import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { liveCategorySeoInline, liveCategorySeoKey, liveCategorySeoUrl } from '../../data/liveData'
import { cleanPostHtml } from '../../lib/cleanPostHtml'
import { scrollToElement } from '../../lib/scroll'

/**
 * Bài viết SEO cuối trang danh mục (khách yêu cầu 27/11/2026: bố cục 1. Mô tả → 2. Sản phẩm → 3. Nội dung SEO hiện đầy đủ).
 * Ecopillo soạn trong Sản phẩm → Danh mục → khung "Giao diện mới: trang danh mục, SEO" → "Nội dung SEO cuối trang danh mục".
 *
 * - Lần mở trang trực tiếp từ máy chủ: máy chủ đã ghi sẵn HTML bài SEO trong `[data-eco-dm-seo]` (cho Google đọc thẳng),
 *   ở đây dùng ngay bản đó nên hiện tức thì không cần gọi mạng thêm.
 * - Khi chuyển trang nội bộ trong web (SPA): nạp file JSON riêng của danh mục rồi lưu đệm trong bộ nhớ.
 * - Định dạng dùng chung `.bai-wp` và `chu-deu` (cùng kiểu chữ thân bài viết, bảng cuộn ngang, link nội bộ chuyển không tải lại trang).
 */

const cache = new Map<string, string>()

export function CategorySeoContent({ path, title, className }: { path: string; title: string; className?: string }) {
  const navigate = useNavigate()
  const key = liveCategorySeoKey(path)
  const inlineHtml = liveCategorySeoInline(path)
  const cacheKey = key ? `${path}:${key}` : inlineHtml ? `${path}:inline` : null

  const [fetched, setFetched] = useState<{ cacheKey: string; html: string } | null>(null)

  const syncHtml = useMemo(() => {
    if (!cacheKey) return null
    const hit = cache.get(cacheKey)
    if (hit !== undefined) return hit
    if (inlineHtml && typeof window !== 'undefined') {
      const cleaned = cleanPostHtml(inlineHtml, path, title)
      cache.set(cacheKey, cleaned)
      return cleaned
    }
    return null
  }, [cacheKey, inlineHtml, path, title])

  useEffect(() => {
    if (!cacheKey || !key || syncHtml !== null) return
    let active = true
    void (async () => {
      try {
        const res = await fetch(liveCategorySeoUrl(key), { cache: 'no-cache' })
        if (!res.ok) return
        const data: unknown = await res.json()
        const raw = data && typeof data === 'object' ? (data as { html?: unknown }).html : undefined
        if (typeof raw !== 'string' || !raw.trim()) return
        const cleaned = cleanPostHtml(raw, path, title)
        cache.set(cacheKey, cleaned)
        if (active) setFetched({ cacheKey, html: cleaned })
      } catch {
        // Mạng chập chờn thì bỏ qua khối bài SEO, không phá phần sản phẩm phía trên
      }
    })()
    return () => {
      active = false
    }
  }, [cacheKey, key, path, syncHtml, title])

  const html = syncHtml ?? (fetched?.cacheKey === cacheKey ? fetched.html : null)
  if (!html) return null

  // Link trong bài SEO: link trong web chuyển trang không tải lại, "#mục" cuộn mềm (Lenis), giống WordPressBody.tsx
  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = (event.target as HTMLElement).closest('a')
    const href = link?.getAttribute('href')
    if (!link || !href) return
    if (href.startsWith('#')) {
      const target = document.getElementById(decodeURIComponent(href.slice(1)))
      if (!target) return
      event.preventDefault()
      scrollToElement(target)
      window.history.replaceState(window.history.state, '', href)
      return
    }
    if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/wp-content/')) {
      event.preventDefault()
      navigate(href)
    }
  }

  return (
    <section
      aria-label={`Thông tin chi tiết ${title}`}
      className={className ?? 'mt-16 first:mt-0 sm:mt-20 sm:first:mt-0'}
    >
      <article
        onClick={onClick}
        className="chu-deu rounded-[2rem] bg-ivory px-5 py-7 text-base leading-[1.75] text-ink-soft shadow-[var(--shadow-soft)] sm:px-10 sm:py-10 lg:px-14 lg:py-12 [&>:first-child]:mt-0"
      >
        <div className="bai-wp" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </section>
  )
}
