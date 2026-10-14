import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SELECTOR = '[data-reveal]:not(.is-visible)'

/**
 * Hiện dần khi cuộn: mọi phần tử có thuộc tính `data-reveal` sẽ mờ → rõ và trượt nhẹ lên
 * khi vào khung nhìn (CSS trong index.css). Một IntersectionObserver dùng chung cho cả trang,
 * và theo dõi thêm phần tử mới xuất hiện (đổi trang, mở rộng danh sách).
 */
export function useScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.getElementById('noi-dung')
    if (!root) return
    document.documentElement.classList.add('reveal-ready')
    if (!('IntersectionObserver' in window)) {
      root.querySelectorAll(SELECTOR).forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const scan = () => root.querySelectorAll(SELECTOR).forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(root, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
}
