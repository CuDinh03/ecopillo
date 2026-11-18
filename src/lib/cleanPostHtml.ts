import { COLLECTIONS } from '../data/catalog'
import { redirectFor } from '../data/links'

/**
 * Thân bài Ecopillo đăng mới / sửa trong WordPress (livePosts.ts). Plugin đã lọc thẻ bằng wp_kses và đổi chữ chất liệu cũ
 * (bai-viet-moi.php); ở đây lọc lại một lần nữa trên trình duyệt rồi làm như bài lấy lúc dựng (tools/lay-bai-viet-wordpress.mjs):
 * chỉ giữ thẻ đọc được, bỏ thuộc tính lạ, bỏ đoạn rỗng, bảng có khung cuộn, ảnh nạp chậm, link về ecopillo.com.vn đổi thành
 * đường dẫn trong web (qua bảng chuyển hướng). Hai chỗ cùng danh sách thẻ: đổi một bên thì đổi bên kia.
 */

const ALLOWED = new Set(['NAV', 'P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'U', 'A', 'IMG', 'FIGURE', 'FIGCAPTION', 'BLOCKQUOTE', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'BR', 'HR', 'SUB', 'SUP'])
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'NOSCRIPT', 'SVG', 'CANVAS', 'VIDEO', 'AUDIO', 'LINK', 'META', 'TEMPLATE'])
const ATTRS: Readonly<Record<string, readonly string[]>> = {
  A: ['href'],
  IMG: ['src', 'alt', 'width', 'height', 'srcset', 'sizes'],
  TD: ['colspan', 'rowspan'],
  TH: ['colspan', 'rowspan', 'scope'],
  H2: ['id'],
  H3: ['id'],
  H4: ['id'],
  NAV: ['aria-label'],
}
const SAFE_URL = /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i

/** Link về ecopillo.com.vn: đường dẫn trong web (qua bảng chuyển hướng); link tới mục trong chính bài chỉ giữ "#mục" */
function fixHref(href: string, slug: string): string {
  let url: URL
  try {
    url = new URL(href, 'https://ecopillo.com.vn/')
  } catch {
    return href
  }
  if (url.hostname.replace(/^www\./, '') !== 'ecopillo.com.vn' || url.pathname.startsWith('/wp-content/')) return href
  const path = url.pathname.endsWith('/') || url.pathname.includes('.') ? url.pathname : `${url.pathname}/`
  const target = redirectFor(path, COLLECTIONS) ?? path
  if (target === `/${slug}/` && url.hash && !url.search) return url.hash
  return `${target}${url.search}${url.hash}`
}

function walk(node: Element, doc: Document): void {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove()
      continue
    }
    if (!(child instanceof Element)) continue
    const tag = child.tagName
    if (DROP.has(tag)) {
      child.remove()
      continue
    }
    walk(child, doc)
    if (tag === 'H1' || tag === 'H5' || tag === 'H6') {
      const h = doc.createElement(tag === 'H1' ? 'h2' : 'h4')
      if (child.id) h.id = child.id
      h.append(...child.childNodes)
      child.replaceWith(h)
      continue
    }
    if (!ALLOWED.has(tag)) {
      child.replaceWith(...child.childNodes)
      continue
    }
    for (const attr of [...child.attributes]) if (!(ATTRS[tag] ?? []).includes(attr.name)) child.removeAttribute(attr.name)
    for (const name of ['href', 'src']) {
      const value = child.getAttribute(name)
      if (value !== null && !SAFE_URL.test(value.trim())) child.removeAttribute(name)
    }
  }
}

/** HTML sạch để gắn vào trang (chỉ chạy trên trình duyệt) */
export function cleanPostHtml(input: string, slug: string, title: string): string {
  const doc = new DOMParser().parseFromString(`<body>${input}</body>`, 'text/html')
  walk(doc.body, doc)
  doc.body.querySelectorAll('p, h2, h3, h4, li').forEach((el) => {
    if (!el.textContent?.replace(/\u00a0/g, ' ').trim() && !el.querySelector('img')) el.remove()
  })
  doc.body.querySelectorAll('table').forEach((table) => {
    const wrap = doc.createElement('div')
    wrap.className = 'bang-cuon'
    wrap.setAttribute('tabindex', '0')
    wrap.setAttribute('role', 'region')
    wrap.setAttribute('aria-label', 'Bảng, cuộn ngang để xem hết')
    table.replaceWith(wrap)
    wrap.append(table)
  })
  doc.body.querySelectorAll('nav[aria-label]').forEach((nav) => nav.setAttribute('class', 'muc-luc'))
  doc.body.querySelectorAll('img').forEach((img) => {
    if (!img.getAttribute('alt')?.trim()) img.setAttribute('alt', title)
    img.setAttribute('loading', 'lazy')
    img.setAttribute('decoding', 'async')
  })
  doc.body.querySelectorAll('a[href]').forEach((a) => a.setAttribute('href', fixHref(a.getAttribute('href') ?? '', slug)))
  return doc.body.innerHTML
}
