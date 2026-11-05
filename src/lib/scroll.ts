/**
 * Cuộn êm tới một phần tử, có tính scroll-margin (chừa chỗ cho thanh đầu trang, thanh liên hệ dưới đáy).
 * Cuộn trôi (Lenis, public/hieu-ung) đang chạy thì nó chặn scrollIntoView của trình duyệt,
 * nên phải nhờ chính Lenis cuộn; không có Lenis thì dùng cách thường.
 * - 'start': đưa mép trên phần tử lên sát dưới thanh đầu trang.
 * - 'nearest': chỉ cuộn khi phần tử đang bị khuất, vừa đủ để thấy trọn.
 */
export function scrollToElement(el: HTMLElement, block: 'start' | 'nearest' = 'start'): void {
  const lenis = window.ecoMotion?.lenis()
  if (!lenis) {
    el.scrollIntoView({ behavior: 'smooth', block })
    return
  }
  const style = getComputedStyle(el)
  const marginTop = parseFloat(style.scrollMarginTop) || 0
  const marginBottom = parseFloat(style.scrollMarginBottom) || 0
  const rect = el.getBoundingClientRect()
  const toStart = window.scrollY + rect.top - marginTop

  if (block === 'start') {
    lenis.scrollTo(toStart)
    return
  }
  if (rect.top - marginTop < 0) lenis.scrollTo(toStart)
  else if (rect.bottom + marginBottom > window.innerHeight) {
    lenis.scrollTo(window.scrollY + rect.bottom + marginBottom - window.innerHeight)
  }
}

/**
 * Bấm gửi mà còn ô lỗi: đưa cả khối ô (nhãn, ô, dòng báo lỗi) lên sát dưới thanh đầu trang rồi mới focus.
 * focus() thường chỉ cuộn vừa đủ thấy ô, nên trên điện thoại ô và dòng lỗi lọt dưới thanh đặt hàng dán đáy (rà 05/11/2026).
 * Chờ một khung hình để dòng báo lỗi vừa thêm đã có trên trang. Khối ô cần `data-field` và `scroll-mt-[5.5rem]`.
 */
export function focusField(id: string): void {
  requestAnimationFrame(() => {
    const el = document.getElementById(id)
    if (!el) return
    scrollToElement(el.closest<HTMLElement>('[data-field]') ?? el, 'start')
    el.focus({ preventScroll: true })
  })
}
