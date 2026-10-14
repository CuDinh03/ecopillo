import { useEffect } from 'react'

const SITE = 'Ecopillo'
const DEFAULT_TITLE = 'Ecopillo - Nâng niu giấc mơ xanh'

/**
 * Tiêu đề tab và đoạn mô tả cho từng trang.
 * Trên WordPress, Yoast giữ tiêu đề, mô tả đang có của từng đường link cũ; đây là bản mặc định cho trang mới.
 */
export function usePageMeta(title: string | null, description?: string) {
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
