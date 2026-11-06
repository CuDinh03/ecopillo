import { useEffect, useState } from 'react'

/**
 * `true` khi trang đã tải xong (sự kiện `load`: ảnh chính, font, gói JS đã về), sau đó giữ `true`.
 * Dùng cho ảnh nhỏ nằm ngay màn đầu nhưng không phải ảnh chính: gắn sau `load` để không giành đường truyền với ảnh chính
 * (trang phối màu ER25 trên điện thoại: 11 ảnh nhỏ hàng chương, cùng gam màu tải cùng lúc với ảnh chính, LCP 3,13s, đo 06/11/2026).
 * Chuyển trang trong web (trang đã `load` từ trước) thì `true` ngay sau lần render đầu.
 * Lúc dựng sẵn và lần render đầu luôn là `false` (khớp nhau, không lỗi hydrate).
 */
export function usePageLoaded(): boolean {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoaded(true)
      return
    }
    const onLoad = () => setIsLoaded(true)
    window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return isLoaded
}
