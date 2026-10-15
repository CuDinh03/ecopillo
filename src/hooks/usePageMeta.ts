import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_ORIGIN, withSlash } from '../data/links'

const SITE = 'Ecopillo'
const DEFAULT_TITLE = 'Ecopillo - Nâng niu giấc mơ xanh'

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
 */
export function usePageMeta(title: string | null, description?: string) {
  const { pathname } = useLocation()

  useEffect(() => setCanonical(pathname), [pathname])

  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : DEFAULT_TITLE
    if (!description) return
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previous = meta?.content
    if (meta) meta.content = description
    return () => {
      if (meta && previous !== undefined) meta.content = previous
    }
  }, [title, description])
}
