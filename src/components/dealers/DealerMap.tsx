import { useEffect, useRef, useState } from 'react'
import type { Dealer, LatLng } from '../../data/dealers'
import { loadLeaflet, type LClusterGroup, type Leaflet, type LMap, type LMarker } from '../../lib/leaflet'

interface DealerMapProps {
  dealers: readonly Dealer[]
  selectedId: string | null
  onSelect: (id: string) => void
  /** Vị trí khách (chấm xanh) khi đã cho phép định vị */
  me: LatLng | null
  className?: string
}

const VIETNAM: [number, number][] = [
  [23.4, 102.1],
  [8.6, 109.5],
]

const pinIcon = (L: Leaflet, d: Dealer, selected: boolean) =>
  L.divIcon({
    className: '',
    html: `<span class="dealer-pin ${d.loai === 'dai-ly' ? '' : 'dealer-pin--chinh'} ${selected ? 'is-selected' : ''}"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 34],
    tooltipAnchor: [0, -34],
  })

/**
 * Bản đồ nhiều ghim (Leaflet + OpenStreetMap). Bấm ghim thì báo thẻ tương ứng; chọn thẻ thì bản đồ bay tới ghim.
 * Lăn chuột trên bản đồ vẫn cuộn trang (phóng to bằng nút +/- hoặc hai ngón tay) để không kẹt khi cuộn danh sách.
 */
export function DealerMap({ dealers, selectedId, onSelect, me, className = '' }: DealerMapProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const libRef = useRef<Leaflet | null>(null)
  const mapRef = useRef<LMap | null>(null)
  const clusterRef = useRef<LClusterGroup | null>(null)
  const markersRef = useRef(new Map<string, { marker: LMarker; dealer: Dealer }>())
  const meRef = useRef<LMarker | null>(null)
  const onSelectRef = useRef(onSelect)
  const selectedRef = useRef(selectedId)
  useEffect(() => {
    onSelectRef.current = onSelect
    selectedRef.current = selectedId
  })

  // Tạo bản đồ một lần
  useEffect(() => {
    let cancelled = false
    const markers = markersRef.current
    loadLeaflet()
      .then((L) => {
        if (cancelled || !boxRef.current) return
        const map = L.map(boxRef.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true })
        map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>')
        L.control.zoom({ position: 'topright', zoomInTitle: 'Phóng to', zoomOutTitle: 'Thu nhỏ' }).addTo(map)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)
        map.fitBounds(VIETNAM, { animate: false })
        const cluster = L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 48,
          iconCreateFunction: (c: { getChildCount: () => number }) =>
            L.divIcon({ className: '', html: `<span class="dealer-cluster">${c.getChildCount()}</span>`, iconSize: [40, 40] }),
        })
        map.addLayer(cluster)
        libRef.current = L
        mapRef.current = map
        clusterRef.current = cluster
        setState('ready')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      clusterRef.current = null
      markers.clear()
      meRef.current = null
    }
  }, [])

  // Ghim theo danh sách đang hiện
  useEffect(() => {
    const L = libRef.current
    const map = mapRef.current
    const cluster = clusterRef.current
    if (state !== 'ready' || !L || !map || !cluster) return
    cluster.clearLayers()
    markersRef.current.clear()
    for (const d of dealers) {
      const marker = L.marker([d.lat, d.lng], { icon: pinIcon(L, d, d.id === selectedRef.current), title: d.ten, keyboard: true })
      marker.bindTooltip(d.ten, { direction: 'top' })
      marker.on('click', () => onSelectRef.current(d.id))
      cluster.addLayer(marker)
      markersRef.current.set(d.id, { marker, dealer: d })
    }

    meRef.current?.remove()
    meRef.current = me
      ? L.marker([me.lat, me.lng], {
          icon: L.divIcon({ className: '', html: '<span class="dealer-me"></span>', iconSize: [18, 18] }),
          interactive: false,
          zIndexOffset: 1000,
        }).addTo(map)
      : null

    // Khung nhìn: vị trí khách cùng vài điểm gần nhất, hoặc toàn bộ điểm đang hiện
    map.invalidateSize()
    const points: [number, number][] = dealers.slice(0, me ? 3 : dealers.length).map((d) => [d.lat, d.lng])
    if (me) points.push([me.lat, me.lng])
    if (points.length === 1) map.setView(points[0], 14)
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 14 })
    else map.fitBounds(VIETNAM)
  }, [dealers, me, state])

  // Ghim đang chọn: nổi bật và bay tới
  useEffect(() => {
    const L = libRef.current
    const map = mapRef.current
    const cluster = clusterRef.current
    if (state !== 'ready' || !L || !map || !cluster) return
    markersRef.current.forEach(({ marker, dealer }, id) => {
      const selected = id === selectedId
      marker.setIcon(pinIcon(L, dealer, selected))
      marker.setZIndexOffset(selected ? 500 : 0)
    })
    const picked = selectedId ? markersRef.current.get(selectedId) : undefined
    if (picked) {
      cluster.zoomToShowLayer(picked.marker, () => {
        map.flyTo([picked.dealer.lat, picked.dealer.lng], Math.max(map.getZoom(), 14), { duration: 0.6 })
      })
    }
  }, [selectedId, state])

  return (
    <div className={`dealer-map relative overflow-hidden bg-cream-50 ${className}`}>
      <div ref={boxRef} className="absolute inset-0" role="region" aria-label="Bản đồ các điểm bán Ecopillo" />
      {state !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-ink-soft">
          {state === 'loading' ? 'Đang tải bản đồ…' : 'Chưa tải được bản đồ. Quý khách bấm “Chỉ đường” ở từng điểm để mở Google Maps.'}
        </div>
      )}
    </div>
  )
}
