import { useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router-dom'

const subscribe = () => () => {}

/**
 * false lúc dựng sẵn HTML (tools/dung-san-html.mjs) và lúc React gắn vào trang (hydrate); true ngay sau đó,
 * và luôn true khi chuyển trang trong web. Cùng cách với useIsMobile.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

const EMPTY = new URLSearchParams()

/**
 * Như useSearchParams, nhưng lúc gắn vào trang trả về "không có tham số".
 *
 * HTML dựng sẵn của mỗi trang chỉ có một bản, không có `?danh-muc=…`, `?bo-suu-tap=…`. Đọc tham số ngay lúc gắn thì
 * phần React vẽ khác HTML: lỗi #418 (React bỏ HTML, vẽ lại cả trang), còn lệch class / aria thì React 19 để nguyên
 * bản sai mà không báo (rà 17/11/2026: trang Sản phẩm từ menu, Đặt hàng từ nút "Đặt mua", Tin tức lọc chủ đề).
 * Hook này cho lần gắn khớp HTML, rồi vẽ lại ngay với tham số thật.
 * Thành phần lấy giá trị ban đầu của useState từ tham số thì phải gắn lại sau đó (xem `key` ở OrderPage).
 */
export function useHydratedSearchParams(): ReturnType<typeof useSearchParams> {
  const [params, setParams] = useSearchParams()
  const hydrated = useHydrated()
  return [hydrated ? params : EMPTY, setParams]
}
