import { useEffect, useState } from 'react'

/** Chiều cao thanh header cố định (h-[4.5rem]) */
export const HEADER_OFFSET = 72

/**
 * Trả về id của mục đang nằm ngay dưới header khi cuộn (scroll-spy).
 * Chỉ tính khi đỉnh mục đã qua header và đáy mục chưa qua, nên các khối
 * không có trong menu (video, đánh giá…) không làm sáng nhầm mục khác.
 */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }
    let frame = 0
    const measure = () => {
      frame = 0
      const line = HEADER_OFFSET + 8
      const found = ids.find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        return rect ? rect.top <= line && rect.bottom > line : false
      })
      setActive(found ?? null)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, enabled])

  return active
}
