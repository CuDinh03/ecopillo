import { useSyncExternalStore } from 'react'

/** Khổ điện thoại: dưới mốc `md` (768px) của Tailwind, khớp các lớp `md:hidden` / `hidden md:block` ở trang chủ */
const MOBILE_QUERY = '(max-width: 767px)'

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * Đang xem trên điện thoại không. `null` khi chưa biết: lúc dựng sẵn HTML trên máy chủ và lần vẽ đầu khi
 * gắn React vào HTML đó (hydrate). Khi `null` thì vẽ cả hai bản, để CSS chọn (xem src/pages/HomePage.tsx).
 * Ngay sau khi gắn, React vẽ lại với giá trị thật. Trang không dựng sẵn (`pnpm dev`) có giá trị thật ngay lần vẽ đầu.
 */
export function useIsMobile(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => null,
  )
}
