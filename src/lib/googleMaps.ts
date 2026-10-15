/**
 * Nạp Google Maps (khách yêu cầu 15/10/2026 thay bản đồ OpenStreetMap ở Hệ thống phân phối) khi khối bản đồ sắp hiện.
 * Khoá API là khoá trình duyệt của Ecopillo, đặt qua VITE_GOOGLE_MAPS_KEY lúc build. Khoá này ai mở web cũng thấy,
 * nên trên Google Cloud phải giới hạn theo tên miền (cách tạo khoá: docs/viec-can-lam/google-maps.md).
 * Chưa có khoá, hoặc Google từ chối khoá, thì trang dùng lại bản đồ Leaflet (lib/leaflet.ts).
 */

export const GOOGLE_MAPS_KEY: string | undefined = import.meta.env.VITE_GOOGLE_MAPS_KEY || undefined

/** Ghim tuỳ biến (AdvancedMarkerElement) bắt buộc có Map ID; DEMO_MAP_ID của Google chỉ để thử, lên web thật dùng Map ID của Ecopillo */
export const GOOGLE_MAP_ID: string = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

export interface GoogleMapsLibs {
  Map: typeof google.maps.Map
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
}

declare global {
  interface Window {
    /** Google gọi hàm này khi khoá sai, hết hạn hoặc không cho phép tên miền đang mở */
    gm_authFailure?: () => void
    __ecopilloMapsReady?: () => void
  }
}

const authFailureListeners = new Set<() => void>()

/** Báo khi Google từ chối khoá (có thể xảy ra sau khi đã nạp xong thư viện). Trả về hàm huỷ đăng ký */
export const onGoogleAuthFailure = (fn: () => void) => {
  authFailureListeners.add(fn)
  return () => {
    authFailureListeners.delete(fn)
  }
}

let loading: Promise<GoogleMapsLibs> | null = null

const loadScript = (key: string) =>
  new Promise<void>((resolve, reject) => {
    window.__ecopilloMapsReady = () => resolve()
    window.gm_authFailure = () => authFailureListeners.forEach((fn) => fn())
    const params = new URLSearchParams({
      key,
      v: 'weekly',
      language: 'vi',
      region: 'VN',
      loading: 'async',
      callback: '__ecopilloMapsReady',
    })
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.onerror = () => reject(new Error('Không tải được Google Maps'))
    document.head.appendChild(script)
  })

export function loadGoogleMaps(): Promise<GoogleMapsLibs> {
  if (!GOOGLE_MAPS_KEY) return Promise.reject(new Error('Chưa đặt VITE_GOOGLE_MAPS_KEY'))
  if (!loading) {
    loading = loadScript(GOOGLE_MAPS_KEY)
      .then(() => Promise.all([google.maps.importLibrary('maps'), google.maps.importLibrary('marker')]))
      .then(([maps, marker]) => ({
        Map: (maps as google.maps.MapsLibrary).Map,
        AdvancedMarkerElement: (marker as google.maps.MarkerLibrary).AdvancedMarkerElement,
      }))
      .catch((error: unknown) => {
        loading = null
        throw error
      })
  }
  return loading
}
