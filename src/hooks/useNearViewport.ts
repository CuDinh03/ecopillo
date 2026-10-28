import { useEffect, useRef, useState } from 'react'

/**
 * `true` khi phần tử đã tới gần màn hình (cách `margin`), sau đó giữ `true`.
 * Dùng cho ảnh nhỏ nằm gần màn đầu: `loading="lazy"` của Chrome trên mạng chậm tải sớm cả ảnh cách
 * màn hình 1250–2500px, nên ở trang Khách sạn 11 ảnh logo, giấy chứng nhận giành đường truyền với ảnh bìa
 * (LCP điện thoại 2,35 → 2,64s khi dựng sẵn HTML, đo 28/10/2026).
 * Lúc dựng sẵn và lần render đầu luôn là `false` (khớp nhau, không lỗi hydrate).
 */
export function useNearViewport<T extends Element>(margin = '300px') {
  const ref = useRef<T>(null)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || isNear) return
    if (typeof IntersectionObserver === 'undefined') {
      setIsNear(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: `${margin} 0px` },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [margin, isNear])

  return [ref, isNear] as const
}
