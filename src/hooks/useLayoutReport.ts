import { useContext } from 'react'
import { layoutKeyOf } from '../data/pageLayout'
import { PageMetaContext } from './usePageMeta'

/**
 * Lúc dựng sẵn HTML (entry-server.tsx): ghi mã bố cục trang đang dùng vào bộ gom. tools/dung-san-html.mjs gom thành
 * bo-cuc-trang.json (mã bố cục → các link), plugin (trang-wp.php) dựa vào đó ghi khối tự do vào HTML trả về cho Google.
 * Trên trình duyệt không có bộ gom nên không làm gì.
 */
export function useLayoutReport(order: readonly string[]): void {
  const collected = useContext(PageMetaContext)
  const key = layoutKeyOf(order)
  if (!collected || !key) return
  collected.layouts = [...new Set([...(collected.layouts ?? []), key])]
}
