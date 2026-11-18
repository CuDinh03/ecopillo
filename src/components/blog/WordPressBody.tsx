import { lazy, Suspense, type ComponentType, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { livePostBodyUrl } from '../../data/livePosts'
import { cleanPostHtml } from '../../lib/cleanPostHtml'
import { scrollToElement } from '../../lib/scroll'

/**
 * Thân bài lấy từ WordPress (HTML đã làm sạch lúc lấy về: tools/lay-bai-viet-wordpress.mjs chỉ giữ thẻ đọc được,
 * bỏ script, style, thuộc tính lạ). Mỗi bài là một gói riêng, chỉ tải khi mở bài.
 *
 * Nằm trong <Suspense>: lúc dựng sẵn HTML React chờ gói bài nên HTML có đủ thân bài; lúc gắn vào trang, gói bài chưa về thì
 * React giữ nguyên HTML có sẵn rồi gắn sau, không chớp, không lệch (khác với nạp xong mới vẽ).
 */

const BODIES = import.meta.glob<{ html: string }>('../../data/bai-viet-wp/bai/*.json', { import: 'default' })

const cache = new Map<string, ComponentType>()

/** Không nạp được thân bài Ecopillo vừa đăng (mạng chập chờn, plugin chưa ghi xong) */
function BodyError() {
  return (
    <p className="mt-8 text-ink-soft">
      Chưa tải được nội dung bài. Quý khách tải lại trang giúp Ecopillo.
    </p>
  )
}

/** Thân bài Ecopillo đăng mới / sửa trong WordPress sau lần dựng: file plugin ghi, lọc lại trên trình duyệt (cleanPostHtml.ts) */
async function loadLive(slug: string, title: string): Promise<{ default: ComponentType }> {
  try {
    const response = await fetch(livePostBodyUrl(slug), { cache: 'no-cache' })
    const data: unknown = response.ok ? await response.json() : null
    const raw = data && typeof data === 'object' ? (data as { html?: unknown }).html : undefined
    if (typeof raw !== 'string') return { default: BodyError }
    const html = cleanPostHtml(raw, slug, title)
    return { default: () => <div className="bai-wp" dangerouslySetInnerHTML={{ __html: html }} /> }
  } catch {
    return { default: BodyError }
  }
}

function bodyOf(slug: string, live: { title: string } | undefined): ComponentType {
  const key = live ? `live:${slug}` : slug
  const cached = cache.get(key)
  if (cached) return cached
  const load = BODIES[`../../data/bai-viet-wp/bai/${slug}.json`]
  const Body = lazy(async () => {
    if (live) return loadLive(slug, live.title)
    const { html } = load ? await load() : { html: '' }
    return { default: () => <div className="bai-wp" dangerouslySetInnerHTML={{ __html: html }} /> }
  })
  cache.set(key, Body)
  return Body
}

/** `live`: bài Ecopillo đăng mới / sửa trong WordPress sau lần dựng (livePosts.ts) */
export function WordPressBody({ slug, live }: { slug: string; live?: { title: string } }) {
  const navigate = useNavigate()
  const Body = bodyOf(slug, live)

  // Link trong thân bài là thẻ <a> thường: link trong web thì chuyển trang không tải lại, "#mục" thì cuộn mềm (Lenis)
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
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
    // Chỉ bắt lượt bấm của link bên trong (link tự có bàn phím: Enter cũng sinh sự kiện click)
    <div onClick={onClick}>
      <Suspense fallback={<p className="mt-8 text-ink-soft">Đang tải bài viết…</p>}>
        <Body />
      </Suspense>
    </div>
  )
}
