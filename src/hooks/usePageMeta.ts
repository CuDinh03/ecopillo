import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_ORIGIN, withSlash } from '../data/links'
import { pageSeoFor } from '../data/liveSeo'
import { publicPath } from '../data/pageAliases'
import type { ShareImage } from '../lib/structuredData'

const SITE = 'Ecopillo'
// Tiêu đề trang chủ (A2, 08/11/2026): mở đầu bằng từ khoá khách tìm, giữ câu khẩu hiệu
export const DEFAULT_TITLE = 'Chăn ga gối đệm cao cấp Ecopillo - Nâng niu giấc mơ xanh'

/**
 * Thẻ đầu trang mà trang đang dựng khai báo. Khi dựng sẵn HTML (src/entry-server.tsx) không có `useEffect`,
 * nên `usePageMeta` ghi thẳng vào đây trong lúc vẽ, bước dựng đọc ra rồi viết vào `<head>` của file HTML.
 * Trên trình duyệt không có ngữ cảnh này: chỉ chạy phần `useEffect` như trước.
 */
export interface PageMeta {
  title: string
  description?: string
  /** Trang lỗi: bước dựng ghi thành 404.html, máy chủ trả mã 404 */
  notFound?: boolean
  /** Ảnh chia sẻ riêng (og:image); không có thì dùng ảnh chung của web trong index.html */
  image?: ShareImage
  /** og:type: trang sản phẩm, bài viết; mặc định "website" */
  type?: 'website' | 'product' | 'article'
}

export type PageMetaOptions = Pick<PageMeta, 'notFound' | 'image' | 'type'>
/** Bước dựng đọc ra sau khi vẽ: thẻ đầu trang, và gói (trang `lazy`) mà trang dùng, để trình duyệt nạp gói đó trước khi gắn vào */
export interface PrerenderCollector {
  meta: PageMeta | null
  page: string | null
  /** Mã bố cục (pageLayout.ts) các khối trên trang dùng: plugin biết trang nào có khối tự do để ghi sẵn vào HTML (đợt H) */
  layouts?: string[]
}
export const PageMetaContext = createContext<PrerenderCollector | null>(null)

export const fullTitle = (title: string | null): string => (title ? `${title} · ${SITE}` : DEFAULT_TITLE)

/**
 * Thẻ canonical: link của trang (có "/" cuối, không tham số lọc), như Yoast đang khai. Trang Ecopillo đã đổi link (pageAliases.ts):
 * link mới, vì `pathname` của bộ định tuyến là link trong (link cũ)
 */
function setCanonical(pathname: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = `${SITE_ORIGIN}${publicPath(withSlash(pathname))}`
}

/**
 * Tiêu đề tab, đoạn mô tả và thẻ canonical cho từng trang.
 * Trên WordPress, Yoast giữ tiêu đề, mô tả đang có của từng đường link cũ; đây là bản mặc định cho trang mới.
 * `notFound`: trang lỗi (dựng thành 404.html). `image`, `type`: chỉ ghi vào HTML dựng sẵn
 * (Facebook, Zalo đọc HTML, không chạy JavaScript), nên lúc chuyển trang trên trình duyệt không cần đổi.
 */
export function usePageMeta(title: string | null, description?: string, options: PageMetaOptions = {}) {
  const { pathname } = useLocation()
  const collected = useContext(PageMetaContext)
  if (collected) collected.meta = { title: fullTitle(title), description, ...options }

  useEffect(() => setCanonical(pathname), [pathname])

  // SEO Ecopillo điền ở Nội dung web → "SEO từng trang" hoặc ở danh mục Woo (liveSeo.ts): đứng trên chữ của trang.
  // Máy chủ đã ghi sẵn các thẻ này vào HTML (plugin trang-wp.php); ở đây giữ đúng khi chuyển trang trong trình duyệt
  // Trang đã đổi link: dòng SEO ghi theo link mới đứng trên dòng ghi theo link cũ (như plugin)
  const seo = pageSeoFor(publicPath(pathname)) ?? pageSeoFor(pathname)
  const tabTitle = seo?.tieuDe ?? fullTitle(title)
  const metaDescription = seo?.moTa ?? description
  const noindex = seo?.anGoogle === true

  // Trang Ecopillo đặt ẩn khỏi Google (25/11/2026): máy chủ đã ghi thẻ robots + X-Robots-Tag; đây giữ đúng khi chuyển trang
  // Chỉ đụng thẻ có dấu data-eco-seo (máy chủ ghi sẵn hoặc ở đây thêm): thẻ noindex của bản xem thử giữ nguyên
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"][data-eco-seo]')
    if (!noindex) {
      existing?.remove()
      return
    }
    const meta = existing ?? document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    meta.dataset.ecoSeo = ''
    if (!existing) document.head.appendChild(meta)
    return () => meta.remove()
  }, [noindex])

  useEffect(() => {
    document.title = tabTitle
    if (!metaDescription) return
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previous = meta?.content
    if (meta) meta.content = metaDescription
    return () => {
      if (meta && previous !== undefined) meta.content = previous
    }
  }, [tabTitle, metaDescription])
}
