/**
 * Nạp Leaflet (bản đồ OpenStreetMap, không cần khoá API) khi khối bản đồ sắp hiện, không nạp lúc mở trang.
 * Thư viện đặt sẵn trong public/vendor/leaflet (Leaflet 1.9.4, Leaflet.markercluster 1.5.3),
 * nên không phải cài thêm gói npm. Chỉ khai báo phần kiểu dữ liệu trang dùng tới.
 */

export interface LMap {
  setView: (center: [number, number], zoom: number, options?: { animate?: boolean }) => LMap
  flyTo: (center: [number, number], zoom?: number, options?: { duration?: number }) => LMap
  fitBounds: (bounds: [number, number][], options?: { padding?: [number, number]; maxZoom?: number; animate?: boolean }) => LMap
  getZoom: () => number
  invalidateSize: () => LMap
  remove: () => void
  addLayer: (layer: unknown) => LMap
  removeLayer: (layer: unknown) => LMap
  attributionControl: { setPrefix: (prefix: string) => void }
}

export interface LMarker {
  on: (event: 'click', fn: () => void) => LMarker
  setIcon: (icon: unknown) => LMarker
  setZIndexOffset: (offset: number) => LMarker
  bindTooltip: (text: string, options?: Record<string, unknown>) => LMarker
  addTo: (map: LMap) => LMarker
  remove: () => void
}

export interface LClusterGroup {
  addLayer: (marker: LMarker) => void
  clearLayers: () => void
  zoomToShowLayer: (marker: LMarker, done?: () => void) => void
}

export interface Leaflet {
  map: (el: HTMLElement, options?: Record<string, unknown>) => LMap
  tileLayer: (url: string, options?: Record<string, unknown>) => { addTo: (map: LMap) => void }
  marker: (at: [number, number], options?: Record<string, unknown>) => LMarker
  circleMarker: (at: [number, number], options?: Record<string, unknown>) => LMarker
  divIcon: (options: Record<string, unknown>) => unknown
  control: { zoom: (options?: Record<string, unknown>) => { addTo: (map: LMap) => void } }
  markerClusterGroup: (options?: Record<string, unknown>) => LClusterGroup
}

declare global {
  interface Window {
    L?: Leaflet
  }
}

const BASE = '/vendor/leaflet/'

const addCss = (href: string) => {
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

const addScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Không tải được ${src}`))
    document.head.appendChild(script)
  })

let loading: Promise<Leaflet> | null = null

export function loadLeaflet(): Promise<Leaflet> {
  if (window.L?.markerClusterGroup) return Promise.resolve(window.L)
  if (!loading) {
    addCss(`${BASE}leaflet.css`)
    addCss(`${BASE}MarkerCluster.css`)
    loading = addScript(`${BASE}leaflet.js`)
      .then(() => addScript(`${BASE}leaflet.markercluster.js`))
      .then(() => {
        if (!window.L) throw new Error('Leaflet chưa sẵn sàng')
        return window.L
      })
      .catch((error: unknown) => {
        loading = null
        throw error
      })
  }
  return loading
}
