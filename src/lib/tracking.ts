/**
 * Báo lượt xem trang và chuyển đổi cho Google Tag Manager và Facebook Pixel.
 * Mã đo chỉ có ở bản chạy thật (plugin trong vite.config.ts); bản xem thử và `pnpm dev` không có,
 * nên mọi hàm dưới đây không làm gì khi chưa có `dataLayer` / `fbq`.
 *
 * Sự kiện đẩy vào dataLayer (để cấu hình trong GTM, tên tiếng Việt không dấu):
 *   xem_trang        mỗi lần chuyển trang trong web (lần mở đầu GTM tự đếm)
 *   dat_hang         đặt hàng gửi tới Ecopillo thành công (kèm ma_don, gia_tri)
 *   gui_tin_nhan     form tin nhắn gửi thành công (kèm chu_de)
 * Pixel: PageView mỗi lần chuyển trang, Purchase khi đặt hàng (như plugin WooCommerce ở web cũ), Lead khi gửi tin nhắn.
 */

type Fbq = (command: 'track', event: string, params?: Record<string, unknown>) => void

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: Fbq
  }
}

const push = (event: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) window.dataLayer.push(event)
}

const pixel = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') window.fbq('track', event, params)
}

/** Chuyển trang trong web (không tính lần mở đầu: mã trong index.html đã đếm) */
export function trackPageView(path: string): void {
  push({ event: 'xem_trang', page_path: path, page_title: document.title })
  pixel('PageView')
}

export function trackOrder(code: string, value: number | null, itemName: string): void {
  push({ event: 'dat_hang', ma_don: code, gia_tri: value ?? 0, san_pham: itemName })
  pixel('Purchase', { value: value ?? 0, currency: 'VND', content_name: itemName })
}

export function trackMessage(topic: string): void {
  push({ event: 'gui_tin_nhan', chu_de: topic })
  pixel('Lead', { content_category: topic })
}
