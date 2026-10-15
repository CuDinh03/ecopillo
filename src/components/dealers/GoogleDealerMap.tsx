import { useEffect, useRef, useState } from 'react'
import { MarkerClusterer, type Renderer } from '@googlemaps/markerclusterer'
import type { Dealer } from '../../data/dealers'
import { GOOGLE_MAP_ID, loadGoogleMaps, onGoogleAuthFailure, type GoogleMapsLibs } from '../../lib/googleMaps'
import type { DealerMapProps } from './DealerMap'

const VIETNAM = { north: 23.4, south: 8.6, west: 102.1, east: 109.5 }
/** Phóng gần nhất khi tự canh khung nhìn (một điểm, hoặc vài điểm gần nhau) */
const MAX_FIT_ZOOM = 14
const FIT_PADDING = 40

/** Ghim dùng lại CSS .dealer-pin của bản đồ cũ (index.css), bọc trong khung để mũi ghim chạm đúng toạ độ */
const pinContent = (d: Dealer, selected: boolean) => {
  const wrap = document.createElement('div')
  wrap.className = 'dealer-pin-wrap'
  const pin = document.createElement('span')
  pin.className = `dealer-pin ${d.loai === 'dai-ly' ? '' : 'dealer-pin--chinh'} ${selected ? 'is-selected' : ''}`
  wrap.appendChild(pin)
  return wrap
}

const clusterRenderer = (libs: GoogleMapsLibs): Renderer => ({
  render: ({ count, position }) => {
    const el = document.createElement('span')
    el.className = 'dealer-cluster'
    el.textContent = String(count)
    return new libs.AdvancedMarkerElement({ position, content: el, title: `${count} điểm bán`, zIndex: 100 + count })
  },
})

interface GoogleDealerMapProps extends DealerMapProps {
  /** Không nạp được Google Maps, hoặc Google từ chối khoá: trang chuyển về bản đồ cũ */
  onFail: () => void
}

/**
 * Bản đồ nhiều ghim bằng Google Maps (khách yêu cầu 15/10/2026). Cách dùng giống bản đồ cũ: bấm ghim thì báo thẻ,
 * chọn thẻ thì bản đồ bay tới ghim. Lăn chuột vẫn cuộn trang (gestureHandling 'cooperative': Ctrl + lăn để phóng,
 * điện thoại kéo bằng hai ngón).
 */
export function GoogleDealerMap({ dealers, selectedId, onSelect, me, className = '', onFail }: GoogleDealerMapProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready'>('loading')
  const libsRef = useRef<GoogleMapsLibs | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const clustererRef = useRef<MarkerClusterer | null>(null)
  const markersRef = useRef(new Map<string, { marker: google.maps.marker.AdvancedMarkerElement; dealer: Dealer }>())
  const meRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const onSelectRef = useRef(onSelect)
  const selectedRef = useRef(selectedId)
  const onFailRef = useRef(onFail)
  useEffect(() => {
    onSelectRef.current = onSelect
    selectedRef.current = selectedId
    onFailRef.current = onFail
  })

  // Tạo bản đồ một lần
  useEffect(() => {
    let cancelled = false
    const markers = markersRef.current
    const stopAuthWatch = onGoogleAuthFailure(() => onFailRef.current())
    loadGoogleMaps()
      .then((libs) => {
        if (cancelled || !boxRef.current) return
        const map = new libs.Map(boxRef.current, {
          mapId: GOOGLE_MAP_ID,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          clickableIcons: false,
          gestureHandling: 'cooperative',
        })
        map.fitBounds(VIETNAM, 0)
        libsRef.current = libs
        mapRef.current = map
        clustererRef.current = new MarkerClusterer({ map, renderer: clusterRenderer(libs) })
        setState('ready')
      })
      .catch(() => {
        if (!cancelled) onFailRef.current()
      })
    return () => {
      cancelled = true
      stopAuthWatch()
      clustererRef.current?.setMap(null)
      clustererRef.current = null
      if (meRef.current) meRef.current.map = null
      meRef.current = null
      markers.clear()
      mapRef.current = null
    }
  }, [])

  // Ghim theo danh sách đang hiện
  useEffect(() => {
    const libs = libsRef.current
    const map = mapRef.current
    const clusterer = clustererRef.current
    if (state !== 'ready' || !libs || !map || !clusterer) return
    clusterer.clearMarkers()
    markersRef.current.clear()
    const markers = dealers.map((d) => {
      const marker = new libs.AdvancedMarkerElement({
        position: { lat: d.lat, lng: d.lng },
        content: pinContent(d, d.id === selectedRef.current),
        title: d.ten,
        gmpClickable: true,
      })
      marker.addEventListener('gmp-click', () => onSelectRef.current(d.id))
      markersRef.current.set(d.id, { marker, dealer: d })
      return marker
    })
    clusterer.addMarkers(markers)

    if (meRef.current) meRef.current.map = null
    meRef.current = null
    if (me) {
      const dot = document.createElement('span')
      dot.className = 'dealer-me'
      meRef.current = new libs.AdvancedMarkerElement({ map, position: me, content: dot, zIndex: 1000 })
    }

    // Khung nhìn: vị trí khách cùng vài điểm gần nhất, hoặc toàn bộ điểm đang hiện
    const points = dealers.slice(0, me ? 3 : dealers.length).map((d) => ({ lat: d.lat, lng: d.lng }))
    if (me) points.push(me)
    if (points.length === 0) {
      map.fitBounds(VIETNAM, 0)
    } else if (points.length === 1) {
      map.setCenter(points[0])
      map.setZoom(MAX_FIT_ZOOM)
    } else {
      const bounds = new google.maps.LatLngBounds()
      points.forEach((p) => bounds.extend(p))
      map.fitBounds(bounds, FIT_PADDING)
      google.maps.event.addListenerOnce(map, 'idle', () => {
        if ((map.getZoom() ?? 0) > MAX_FIT_ZOOM) map.setZoom(MAX_FIT_ZOOM)
      })
    }
  }, [dealers, me, state])

  // Ghim đang chọn: nổi bật và bay tới
  useEffect(() => {
    const map = mapRef.current
    if (state !== 'ready' || !map) return
    markersRef.current.forEach(({ marker, dealer }, id) => {
      const selected = id === selectedId
      marker.content = pinContent(dealer, selected)
      marker.zIndex = selected ? 500 : null
    })
    const picked = selectedId ? markersRef.current.get(selectedId) : undefined
    if (picked) {
      map.panTo({ lat: picked.dealer.lat, lng: picked.dealer.lng })
      map.setZoom(Math.max(map.getZoom() ?? 0, MAX_FIT_ZOOM))
    }
  }, [selectedId, state])

  return (
    <div className={`dealer-map relative overflow-hidden bg-cream-50 ${className}`}>
      <div ref={boxRef} className="absolute inset-0" role="region" aria-label="Bản đồ các điểm bán Ecopillo" />
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-ink-soft">Đang tải bản đồ…</div>
      )}
    </div>
  )
}
