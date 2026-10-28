import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_ORIGIN, withSlash } from '../data/links'

const SITE = 'Ecopillo'
export const DEFAULT_TITLE = 'Ecopillo - Nâng niu giấc mơ xanh'

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
}
/** Bước dựng đọc ra sau khi vẽ: thẻ đầu trang, và gói (trang `lazy`) mà trang dùng, để trình duyệt nạp gói đó trước khi gắn vào */
export interface PrerenderCollector {
  meta: PageMeta | null
  page: string | null
}
export const PageMetaContext = createContext<PrerenderCollector | null>(null)

export const fullTitle = (title: string | null): string => (title ? `${title} · ${SITE}` : DEFAULT_TITLE)

/** Thẻ canonical: luôn trỏ về đúng link của web cũ (có "/" cuối, không tham số lọc), như Yoast đang khai */
function setCanonical(pathname: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = `${SITE_ORIGIN}${withSlash(pathname)}`
}

/**
 * Tiêu đề tab, đoạn mô tả và thẻ canonical cho từng trang.
 * Trên WordPress, Yoast giữ tiêu đề, mô tả đang có của từng đường link cũ; đây là bản mặc định cho trang mới.
 * `notFound`: trang lỗi (dựng thành 404.html).
 */
export function usePageMeta(title: string | null, description?: string, notFound = false) {
  const { pathname } = useLocation()
  const collected = useContext(PageMetaContext)
  if (collected) collected.meta = { title: fullTitle(title), description, notFound }

  useEffect(() => setCanonical(pathname), [pathname])

  useEffect(() => {
    document.title = fullTitle(title)
    if (!description) return
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previous = meta?.content
    if (meta) meta.content = description
    return () => {
      if (meta && previous !== undefined) meta.content = previous
    }
  }, [title, description])
}
