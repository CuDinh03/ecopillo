import { useEffect, useState } from 'react'

/** Mã khối của link "#bo-suu-tap"; link khác thì undefined */
export const inPageId = (to: string): string | undefined => (to.startsWith('#') && to.length > 1 ? decodeURIComponent(to.slice(1)) : undefined)

/** Khối có trên trang và đang hiện (khối nằm trong bản đang ẩn, ví dụ bản điện thoại của trang chủ khi xem trên máy tính, không tính) */
const isShown = (id: string): boolean => {
  const el = document.getElementById(id)
  return !!el && el.getClientRects().length > 0
}

/**
 * Nút trỏ tới một khối trong cùng trang ("#bo-suu-tap", Ecopillo đặt ở Nội dung web): khối đó không có trên trang
 * (Ecopillo ẩn ở Bố cục, hoặc gõ mã khối không có) thì nút ẩn đi, không để khách bấm mà không có gì xảy ra.
 * Lúc dựng HTML và lần vẽ đầu luôn coi là có (HTML dựng sẵn giữ nguyên); kiểm lại sau khi gắn và khi đổi khổ màn hình
 * (trang chủ bỏ bản điện thoại / máy tính không dùng tới sau khi gắn).
 */
export function useInPageTarget(to: string): boolean {
  const id = inPageId(to)
  const [hasTarget, setHasTarget] = useState(true)
  useEffect(() => {
    if (!id) return
    let frame = 0
    // Chờ một khung hình: trang chủ vẽ lại theo khổ màn hình ngay sau khi gắn
    const check = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setHasTarget(isShown(id)))
    }
    check()
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', check)
    }
  }, [id])
  return !id || hasTarget
}
