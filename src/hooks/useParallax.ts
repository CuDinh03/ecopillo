import { useEffect, type RefObject } from 'react'

/**
 * Trôi nhẹ khi cuộn (parallax) cho lớp trang trí: chỉ trên màn hình lớn và khi không
 * bật giảm chuyển động. Dùng thuộc tính `translate` nên không đụng `transform` của Tailwind.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, factor: number) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const allowed = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    if (!allowed.matches) return
    let frame = 0
    const update = () => {
      frame = 0
      el.style.translate = `0 ${Math.round(window.scrollY * factor)}px`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      el.style.translate = ''
    }
  }, [ref, factor])
}
