// Lấy bài viết từ WordPress của web cũ, làm sạch, ghi ra src/data/bai-viet-wp/ (GĐ3, docs/ke-hoach-ssg-va-wordpress.md).
// Build chỉ đọc bản đã lưu này, không gọi WordPress: WordPress lỗi lúc build cũng không hỏng bản build.
// Chạy lại khi Ecopillo đăng hoặc sửa bài:   node tools/lay-bai-viet-wordpress.mjs
//
// Làm gì với mỗi bài:
// - Chỉ giữ thẻ đọc được (đoạn, tiêu đề, danh sách, bảng, ảnh, link, trích dẫn); bỏ script, style, iframe, class, style,
//   bỏ vỏ div/span của Elementor. H1 trong bài đổi thành H2 (trang chỉ có một H1).
// - Chữ chất liệu cũ đổi thành "Lyocell" (owner duyệt Q2 ngày 25/10/2026), cả trong chữ, alt ảnh, tiêu đề, mô tả.
// - Link về ecopillo.com.vn đổi thành đường dẫn trong web, đi qua bảng chuyển hướng (src/data/links.ts): link cũ có chữ
//   chất liệu cũ ra thẳng link mới.
// - Ảnh có chữ chất liệu cũ trong tên file (ảnh sản phẩm của Ecopillo, tên có mã mẫu): thay bằng ảnh mẫu đó của web mới;
//   không tìm được mẫu thì bỏ ảnh. Ảnh khác giữ link WordPress (sau khi lên thật, /wp-content/uploads/ vẫn do WordPress phục vụ).
// - Bỏ bài vai-tencel-la-gi: web mới có bài viết lại vai-lyocell-la-gi (src/data/posts.ts), link cũ 301 sang đó.
//
// Máy chủ web cũ chặn curl (LiteSpeed 403), nên mở Chrome qua Playwright và gọi API ngay trong trang (CLAUDE.md).
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const ORIGIN = 'https://ecopillo.com.vn'
const OUT = 'src/data/bai-viet-wp'
const SKIP = new Set(['vai-tencel-la-gi'])
/** Danh mục "Tin tức" trên WordPress (id 30); bài còn lại ghi "Cẩm nang" */
const NEWS_CATEGORY = 30
const BANNED = /tencel|\b60\s?s\b/i

// Đọc bảng chuyển hướng và ảnh mẫu từ chính mã TypeScript của web
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { redirectFor } = await vite.ssrLoadModule('/src/data/links.ts')
const { COLLECTIONS, imageOfPattern } = await vite.ssrLoadModule('/src/data/catalog.ts')

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
await page.goto(`${ORIGIN}/`, { waitUntil: 'domcontentloaded' })

const raw = await page.evaluate(async () => {
  const get = async (path) => {
    for (let attempt = 0; attempt < 4; attempt++) {
      const r = await fetch(path, { credentials: 'omit' })
      if (r.ok) return r.json()
      await new Promise((ok) => setTimeout(ok, 1500 * (attempt + 1))) // web cũ hay trả 502 khi gọi dồn
    }
    throw new Error(`không lấy được ${path}`)
  }
  const posts = await get('/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,date,modified,categories,featured_media,title,content,excerpt,yoast_head_json')
  const ids = posts.map((p) => p.featured_media).filter(Boolean)
  const media = ids.length ? await get(`/wp-json/wp/v2/media?per_page=100&include=${ids.join(',')}&_fields=id,source_url,alt_text,media_details`) : []
  return { posts, media }
})
// Trang trống để làm sạch HTML bằng DOMParser của Chrome (không chạy script của bài)
const cleaner = await browser.newPage()
await cleaner.goto('about:blank')

/** Làm sạch HTML, trả HTML sạch và số chữ (để tính phút đọc) */
async function sanitize(html) {
  return cleaner.evaluate((input) => {
    const ALLOWED = new Set(['NAV', 'P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'U', 'A', 'IMG', 'FIGURE', 'FIGCAPTION', 'BLOCKQUOTE', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'BR', 'HR', 'SUB', 'SUP'])
    const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'NOSCRIPT', 'SVG', 'CANVAS', 'VIDEO', 'AUDIO', 'LINK', 'META'])
    const ATTRS = {
      A: ['href'], IMG: ['src', 'alt', 'width', 'height', 'srcset', 'sizes'], TD: ['colspan', 'rowspan'], TH: ['colspan', 'rowspan', 'scope'],
      H2: ['id'], H3: ['id'], H4: ['id'], NAV: ['aria-label'],
    }
    const doc = new DOMParser().parseFromString(`<body>${input}</body>`, 'text/html')
    // Mục lục của plugin Easy Table of Contents: neo nằm trong <span class="ez-toc-section" id>, chuyển id lên tiêu đề
    doc.querySelectorAll('.ez-toc-section[id]').forEach((span) => {
      const heading = span.closest('h1, h2, h3, h4, h5, h6')
      if (heading && !heading.id) heading.id = span.id
    })
    // Khung mục lục (có nút Toggle, biểu tượng): dựng lại thành <nav> gồm tiêu đề + danh sách link
    doc.querySelectorAll('#ez-toc-container, .ez-toc-container').forEach((box) => {
      const list = box.querySelector('nav > ul, ul')
      if (!list) { box.remove(); return }
      const nav = doc.createElement('nav')
      nav.setAttribute('aria-label', 'Nội dung chính')
      const title = doc.createElement('p')
      title.textContent = box.querySelector('.ez-toc-title')?.textContent.trim() || 'Nội dung chính'
      nav.append(title, list)
      box.replaceWith(nav)
    })
    const walk = (node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.COMMENT_NODE) { child.remove(); continue }
        if (child.nodeType !== Node.ELEMENT_NODE) continue
        const tag = child.tagName
        if (DROP.has(tag)) { child.remove(); continue }
        walk(child)
        if (tag === 'H1' || tag === 'H5' || tag === 'H6') {
          const h = doc.createElement(tag === 'H1' ? 'H2' : 'H4')
          if (child.id) h.id = child.id
          h.append(...child.childNodes)
          child.replaceWith(h)
          continue
        }
        if (!ALLOWED.has(tag)) { child.replaceWith(...child.childNodes); continue }
        for (const attr of [...child.attributes]) if (!(ATTRS[tag] ?? []).includes(attr.name)) child.removeAttribute(attr.name)
      }
    }
    walk(doc.body)
    // Đoạn rỗng (Elementor, &nbsp;) bỏ đi
    doc.body.querySelectorAll('p, h2, h3, h4, li').forEach((el) => {
      if (!el.textContent.replace(/\u00a0/g, ' ').trim() && !el.querySelector('img')) el.remove()
    })
    doc.body.querySelectorAll('table').forEach((t) => {
      const wrap = doc.createElement('div')
      wrap.className = 'bang-cuon'
      t.replaceWith(wrap)
      wrap.append(t)
    })
    doc.body.querySelectorAll('nav[aria-label]').forEach((nav) => nav.setAttribute('class', 'muc-luc'))
    doc.body.querySelectorAll('img').forEach((img) => {
      img.setAttribute('loading', 'lazy')
      img.setAttribute('decoding', 'async')
    })
    return { html: doc.body.innerHTML, words: doc.body.textContent.trim().split(/\s+/).length }
  }, html)
}

/** Chữ chất liệu cũ → Lyocell (cả ™, ®); chỉ số sợi "60s" bỏ hẳn */
const fixWords = (text) =>
  text
    // Không đòi ranh giới từ: neo mục lục viết "Chan_ga_cuoi_tencel" (dấu _ dính liền)
    .replace(/tencel\s*(™|®|&trade;|&reg;)?/gi, (m) => (m[0] === 'T' && m[1] === 'E' ? 'LYOCELL' : 'Lyocell'))
    .replace(/\s*\b60\s?s\b/gi, '')

const decode = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\[&hellip;\]|\[…\]|&hellip;/g, '…')
    .replace(/\s+/g, ' ')
    .trim()

/** Link về web cũ: đổi thành đường dẫn trong web, qua bảng chuyển hướng. Link tới mục trong chính bài: chỉ giữ "#mục" */
function fixHref(href, slug) {
  if (!href) return href
  let url
  try {
    url = new URL(href, `${ORIGIN}/`)
  } catch {
    return href
  }
  if (url.hostname.replace(/^www\./, '') !== 'ecopillo.com.vn') return href
  if (url.pathname.startsWith('/wp-content/')) return url.href
  const path = url.pathname.endsWith('/') || url.pathname.includes('.') ? url.pathname : `${url.pathname}/`
  const target = redirectFor(path, COLLECTIONS) ?? path
  if (target === `/${slug}/` && url.hash && !url.search) return url.hash
  return `${target}${url.search}${url.hash}`
}

/** Ảnh sản phẩm có chữ cũ trong tên file: "Bo-ga-phu-…-Eco-Doris-ED10-Ecopillo-…jpg" → ảnh mẫu ED10 của web mới */
function replacementImage(src) {
  const m = src.match(/Eco-([A-Za-z]+)-([A-Z]{2}\d{2,3})/i)
  if (!m) return null
  const collection = COLLECTIONS.find((c) => c.id === `eco-${m[1].toLowerCase()}`)
  const pattern = collection?.patterns.find((p) => p.code.toUpperCase() === m[2].toUpperCase())
  return collection && pattern ? imageOfPattern(collection, pattern) ?? null : null
}

function fixImages(html) {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const src = tag.match(/\bsrc="([^"]*)"/)?.[1] ?? ''
    if (!BANNED.test(src) && !BANNED.test(tag.match(/\bsrcset="([^"]*)"/)?.[1] ?? '')) return tag
    const replacement = replacementImage(src)
    if (!replacement) return ''
    const alt = fixWords(tag.match(/\balt="([^"]*)"/)?.[1] || replacement.alt)
    return `<img src="${replacement.src}" srcset="${replacement.srcSet}" sizes="(min-width: 768px) 720px, 100vw" alt="${alt}" loading="lazy" decoding="async">`
  })
}

/** Kích thước ảnh webp trong public/ (đọc phần đầu file: VP8X, VP8 hoặc VP8L) */
function webpSize(path) {
  const b = readFileSync(join('public', path))
  const kind = b.toString('ascii', 12, 16)
  if (kind === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) }
  if (kind === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
  if (kind === 'VP8L') {
    const bits = b.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  return null
}

/**
 * Ảnh không khai width/height thì trình duyệt không giữ chỗ: ảnh tải dần đẩy chữ xuống (xô bố cục, và bấm mục lục
 * cuộn trượt khỏi tiêu đề vì ảnh phía trên nở ra giữa chừng). Ghi đủ kích thước cho mọi ảnh:
 * ảnh của web mới đọc từ file; ảnh WordPress lấy từ tên file ("-1600x1136.jpg") hoặc tải ảnh để đo.
 */
async function addImageSizes(html) {
  const tags = [...new Set(html.match(/<img\b[^>]*>/g) ?? [])].filter((t) => !/\swidth="/.test(t) || !/\sheight="/.test(t))
  const sizes = new Map()
  const toMeasure = []
  for (const tag of tags) {
    const src = tag.match(/\ssrc="([^"]*)"/)?.[1] ?? ''
    if (src.startsWith('/images/')) sizes.set(tag, webpSize(src))
    else {
      const m = src.match(/-(\d{2,5})x(\d{2,5})\.(?:jpe?g|png|webp|gif)(?:\?|$)/i)
      if (m) sizes.set(tag, { width: Number(m[1]), height: Number(m[2]) })
      else toMeasure.push([tag, src])
    }
  }
  if (toMeasure.length) {
    const measured = await page.evaluate(async (list) =>
      Promise.all(list.map(([, src]) => new Promise((done) => {
        const img = new Image()
        img.onload = () => done({ width: img.naturalWidth, height: img.naturalHeight })
        img.onerror = () => done(null)
        img.src = src
      }))), toMeasure)
    toMeasure.forEach(([tag], i) => sizes.set(tag, measured[i]))
  }
  let out = html
  for (const [tag, size] of sizes) {
    if (!size?.width || !size?.height) continue
    const clean = tag.replace(/\s(width|height)="[^"]*"/g, '')
    out = out.split(tag).join(clean.replace(/^<img/, `<img width="${size.width}" height="${size.height}"`))
  }
  return out
}

/** Mô tả Google: Yoast nếu đủ dài, không thì đoạn trích; giới hạn 155 ký tự như góp ý SEO 08/11/2026 */
function description(yoast, excerpt) {
  const pick = (yoast && yoast.length >= 70 ? yoast : excerpt) || yoast || ''
  if (pick.length <= 155) return pick
  const cut = pick.slice(0, 154)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const mediaById = new Map(raw.media.map((m) => [m.id, m]))
mkdirSync(join(OUT, 'bai'), { recursive: true })
for (const f of readdirSync(join(OUT, 'bai'))) rmSync(join(OUT, 'bai', f))

const index = []
const warnings = []
for (const post of raw.posts) {
  if (SKIP.has(post.slug)) continue
  const clean = await sanitize(post.content.rendered)
  // Thứ tự quan trọng: ảnh trước (nhận ra ảnh qua tên file cũ), rồi link (bảng chuyển hướng nhận link cũ), cuối cùng mới đổi chữ
  let html = fixImages(clean.html)
  html = html.replace(/href="([^"]*)"/g, (_, href) => `href="${fixHref(href.replace(/&amp;/g, '&'), post.slug).replace(/&/g, '&amp;')}"`)
  html = fixWords(html)
  html = await addImageSizes(html)
  if (BANNED.test(html)) warnings.push(`${post.slug}: còn chữ chất liệu cũ sau khi làm sạch`)

  const yoast = post.yoast_head_json ?? {}
  const title = fixWords(decode(post.title.rendered))
  const metaTitle = fixWords(decode(yoast.title ?? '')).replace(/\s*[-–|·]\s*ECOPILLO.*$/i, '') || title
  const excerpt = fixWords(decode(post.excerpt.rendered))
  const media = mediaById.get(post.featured_media)
  const coverOk = media && !BANNED.test(media.source_url)
  const sizes = Object.values(media?.media_details?.sizes ?? {}).filter((s) => s.width >= 300 && !BANNED.test(s.source_url))
  if (!coverOk) warnings.push(`${post.slug}: không có ảnh bìa dùng được`)

  index.push({
    slug: post.slug,
    title,
    metaTitle,
    excerpt: excerpt.length > 260 ? `${excerpt.slice(0, excerpt.lastIndexOf(' ', 258))}…` : excerpt,
    description: description(fixWords(decode(yoast.description ?? '')), excerpt),
    category: post.categories.includes(NEWS_CATEGORY) ? 'Tin tức' : 'Cẩm nang',
    date: post.date.slice(0, 10),
    modified: post.modified.slice(0, 10),
    readMinutes: Math.max(1, Math.round(clean.words / 220)),
    cover: coverOk
      ? {
          src: media.source_url,
          srcSet: sizes.sort((a, b) => a.width - b.width).map((s) => `${s.source_url} ${s.width}w`).join(', '),
          alt: fixWords(media.alt_text || title),
          width: media.media_details?.width ?? null,
          height: media.media_details?.height ?? null,
        }
      : null,
  })
  writeFileSync(join(OUT, 'bai', `${post.slug}.json`), `${JSON.stringify({ html })}\n`)
}

await browser.close()
index.sort((a, b) => b.date.localeCompare(a.date))
writeFileSync(join(OUT, 'danh-sach.json'), `${JSON.stringify(index, null, 1)}\n`)
await vite.close()
console.log(`Đã lưu ${index.length} bài vào ${OUT}/ (bỏ: ${[...SKIP].join(', ')})`)
for (const w of warnings) console.log('  lưu ý:', w)
if (warnings.some((w) => w.includes('chữ chất liệu cũ'))) process.exit(1)
