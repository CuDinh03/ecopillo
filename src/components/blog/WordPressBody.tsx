import { lazy, Suspense, type ComponentType, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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

function bodyOf(slug: string): ComponentType {
  const cached = cache.get(slug)
  if (cached) return cached
  const load = BODIES[`../../data/bai-viet-wp/bai/${slug}.json`]
  const Body = lazy(async () => {
    const { html } = load ? await load() : { html: '' }
    return { default: () => <div className="bai-wp" dangerouslySetInnerHTML={{ __html: html }} /> }
  })
  cache.set(slug, Body)
  return Body
}

export function WordPressBody({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const Body = bodyOf(slug)

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
