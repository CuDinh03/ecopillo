import { useSyncExternalStore } from 'react'

/** Khổ điện thoại: dưới mốc `sm` (640px) của Tailwind */
const MOBILE_QUERY = '(max-width: 639px)'

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * Đang xem trên điện thoại không. Đọc ngay ở lần vẽ đầu nên không có cú nhảy bố cục.
 * Khi dựng sẵn HTML trên máy chủ (docs/phan-tich-dung-san-html.md) thì coi là điện thoại,
 * vì Google xếp hạng theo bản điện thoại.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => true,
  )
}
