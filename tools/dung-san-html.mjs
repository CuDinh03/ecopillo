#!/usr/bin/env node
/**
 * Dựng sẵn HTML cho mọi đường link sau `vite build` (Giai đoạn 1, docs/ke-hoach-ssg-va-wordpress.md).
 *
 *   pnpm build                 # tsc + vite build + bước này
 *   node tools/dung-san-html.mjs
 *
 * Cách làm:
 * 1. Build gói máy chủ từ src/entry-server.tsx vào thư mục tạm (không đè dist/).
 * 2. Gọi render(url) từng đường link → ghi dist/<đường>/index.html (trang chủ: dist/index.html).
 * 3. Trang lỗi → dist/404.html. Danh sách link → dist/sitemap.xml.
 *
 * Thẻ <title>, mô tả, canonical lấy từ usePageMeta lúc dựng. `data-trang` trên #root để
 * src/main.tsx nạp đúng gói lazy trước khi hydrate (tránh chớp trắng).
 * Giai đoạn 2: ảnh chia sẻ riêng (og:image, og:image:alt) và og:type cũng lấy từ usePageMeta;
 * trang không khai ảnh giữ ảnh chung trong index.html. Dữ liệu cấu trúc (JSON-LD) nằm sẵn trong phần thân trang.
 */
import { build as viteBuild } from 'vite'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = new URL('..', import.meta.url).pathname
/** Bản xem thử đặt ECOPILLO_DIST=dist-xem-thu; mặc định là dist/ */
const DIST = join(ROOT, process.env.ECOPILLO_DIST || 'dist')
const SSR_OUT = join(ROOT, 'node_modules/.cache/ecopillo-ssr')
const TEMPLATE = join(DIST, 'index.html')
/** Khuôn index.html của Vite (root trống). Giữ lại để chạy lại `dung-san` không cần build lại client. */
const TEMPLATE_CACHE = join(SSR_OUT, 'khuon-index.html')

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function escapeText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

/**
 * Trang mà phần lớn nhất (LCP) là ảnh bìa. HTML dựng sẵn hiện chữ sớm, nên trình duyệt tải font Google
 * (~12 file, ~230 KB) cùng lúc với ảnh bìa và ảnh về muộn. Ở các trang này hoãn font tới khi ảnh bìa
 * tải xong (tối đa 3 giây). Đo 28/10/2026, điện thoại 1,6 Mbps: Giới thiệu 3,04 → 2,00s, Khách sạn 3,80 → 2,45–2,65s, CLS 0.
 * Trang chủ không hoãn: LCP ở đó là tiêu đề, hoãn font thì ảnh nền thành LCP và chậm hơn (đo 4,4s).
 */
const DEFER_FONT_PAGES = new Set(['AboutPage', 'HotelPage', 'ProductDetailPage'])
const FONT_LINK_RE = /<link\s+rel="stylesheet"\s+href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"\s*\/>/

function deferFonts(html) {
  const match = html.match(FONT_LINK_RE)
  if (!match) throw new Error('Không thấy thẻ font Google trong index.html: đã đổi cách nạp font?')
  // Ảnh bìa: ảnh đầu tiên có fetchpriority="high" trong HTML dựng sẵn (React ghi fetchPriority, tên thuộc tính HTML không phân biệt hoa thường)
  const loader =
    `<script>(function(){var done=false;function go(){if(done)return;done=true;` +
    `var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(match[1].replace(/&amp;/g, '&'))};` +
    `document.head.appendChild(l)}setTimeout(go,3000);document.addEventListener('DOMContentLoaded',function(){` +
    `var img=document.querySelector('#root img[fetchpriority="high"]');` +
    `if(!img||img.complete){go();return}img.addEventListener('load',go);img.addEventListener('error',go)})})()</script>`
  return html.replace(FONT_LINK_RE, loader)
}

/** Thay giá trị `content` của thẻ meta mang thuộc tính `attr` (thẻ trong index.html có thể xuống dòng giữa hai thuộc tính) */
function replaceMeta(html, attr, value) {
  const re = new RegExp(`(${attr}\\s+content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`Không thấy thẻ ${attr} trong index.html`)
  return html.replace(re, `$1${escapeAttr(value)}$2`)
}

/** Ghi nội dung trang vào bản index.html của Vite: title, mô tả, canonical, ảnh chia sẻ, #root có HTML dựng sẵn */
function applyPage(template, { url, body, meta, page, siteOrigin }) {
  const title = meta?.title
  const description = meta?.description
  const path = url.endsWith('/') ? url : `${url}/`
  const canonical = `${siteOrigin}${path}`

  let html = template
  if (title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(title)}</title>`)
    html = replaceMeta(html, 'property="og:title"', title)
  }
  if (description) {
    html = replaceMeta(html, 'name="description"', description)
    html = replaceMeta(html, 'property="og:description"', description)
  }
  html = replaceMeta(html, 'property="og:url"', canonical)
  if (meta?.type) html = replaceMeta(html, 'property="og:type"', meta.type)
  if (meta?.image) {
    // Ảnh đã chép từ public/ sang thư mục build: thiếu ảnh thì báo lỗi, không để Facebook, Zalo nhận link hỏng
    if (!existsSync(join(DIST, meta.image.path))) throw new Error(`thiếu ảnh chia sẻ ${meta.image.path}`)
    html = replaceMeta(html, 'property="og:image"', `${siteOrigin}${meta.image.path}`)
    html = replaceMeta(html, 'property="og:image:alt"', meta.image.alt)
  }

  // Canonical: thêm hoặc thay
  if (/rel="canonical"/.test(html)) {
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeAttr(canonical)}" />`)
  } else {
    html = html.replace('</head>', `    <link rel="canonical" href="${escapeAttr(canonical)}" />\n  </head>`)
  }

  const attrs = page ? ` id="root" data-trang="${escapeAttr(page)}"` : ' id="root"'
  if (!html.includes('<div id="root"></div>')) {
    throw new Error('Không thấy <div id="root"></div> trong dist/index.html — vite build đã đổi khuôn?')
  }
  html = html.replace('<div id="root"></div>', `<div${attrs}>${body}</div>`)
  return DEFER_FONT_PAGES.has(page) && /fetchpriority="high"/i.test(body) ? deferFonts(html) : html
}

function writeHtml(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

function toFilePath(url) {
  const clean = url.replace(/^\//, '').replace(/\/$/, '')
  return clean === '' ? join(DIST, 'index.html') : join(DIST, clean, 'index.html')
}

async function main() {
  let template
  try {
    template = readFileSync(TEMPLATE, 'utf8')
  } catch {
    console.error(`Chưa có ${relative(ROOT, TEMPLATE)}. Chạy vite build trước.`)
    process.exit(1)
  }
  if (template.includes('<div id="root"></div>')) {
    // Lần đầu sau vite build: giữ khuôn trống để lần sau chạy lại dung-san không cần build client
    mkdirSync(SSR_OUT, { recursive: true })
    writeFileSync(TEMPLATE_CACHE, template)
  } else {
    try {
      template = readFileSync(TEMPLATE_CACHE, 'utf8')
    } catch {
      console.error(
        `${relative(ROOT, TEMPLATE)} đã có HTML dựng sẵn, và chưa có khuôn trống trong cache.\n` +
          `Chạy lại: pnpm exec vite build && node tools/dung-san-html.mjs`,
      )
      process.exit(1)
    }
    if (!template.includes('<div id="root"></div>')) {
      console.error('Khuôn trong cache cũng không còn root trống. Chạy lại vite build.')
      process.exit(1)
    }
  }

  console.log('Build gói máy chủ (entry-server)…')
  // Giữ khuôn đã cache: chỉ xoá các file build SSR khác
  const cachedShell = template
  rmSync(SSR_OUT, { recursive: true, force: true })
  mkdirSync(SSR_OUT, { recursive: true })
  writeFileSync(TEMPLATE_CACHE, cachedShell)
  await viteBuild({
    configFile: join(ROOT, 'vite.config.ts'),
    build: {
      ssr: join(ROOT, 'src/entry-server.tsx'),
      outDir: SSR_OUT,
      emptyOutDir: false,
      sourcemap: false,
    },
    logLevel: 'warn',
  })

  const serverEntry = join(SSR_OUT, 'entry-server.js')
  const { render, listPrerenderPaths, NOT_FOUND_PATH, SITE_ORIGIN, HOST_REDIRECTS } = await import(
    pathToFileURL(serverEntry).href
  )
  // Bản xem thử (GitHub Actions đặt XEM_THU_URL): canonical, og:url, sitemap trỏ về chính bản xem thử, không trỏ ecopillo.com.vn
  const siteOrigin = (process.env.XEM_THU_URL || SITE_ORIGIN).replace(/\/$/, '')
  const paths = listPrerenderPaths()
  console.log(`Dựng ${paths.length} trang vào ${relative(ROOT, DIST)}/…`)

  const started = Date.now()
  let ok = 0
  const failures = []

  // Giữ khuôn gốc: trang chủ ghi đè index.html, các trang khác ghi thư mục con
  const baseTemplate = template

  for (const url of paths) {
    try {
      const { html: body, meta, page } = await render(url)
      if (meta?.notFound) {
        failures.push(`${url} → trang báo 404 (route lệch?)`)
        continue
      }
      const out = applyPage(baseTemplate, { url, body, meta, page, siteOrigin })
      writeHtml(toFilePath(url), out)
      ok += 1
    } catch (err) {
      failures.push(`${url}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // 404.html
  try {
    const { html: body, meta, page } = await render(NOT_FOUND_PATH)
    const out = applyPage(baseTemplate, {
      url: '/',
      body,
      meta: { title: meta?.title ?? 'Không tìm thấy trang · Ecopillo', description: meta?.description, notFound: true },
      page,
      siteOrigin,
    })
    // Không để canonical/og:url của trang lỗi trông như trang hợp lệ riêng
    const out404 = out.replace(/<link rel="canonical" href="[^"]*"\s*\/?>\n?/, '')
    writeHtml(join(DIST, '404.html'), out404)
    ok += 1
  } catch (err) {
    failures.push(`404.html: ${err instanceof Error ? err.message : String(err)}`)
  }

  const today = new Date().toISOString().slice(0, 10)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((url) => `  <url><loc>${siteOrigin}${url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
  writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

  // Cloudflare Pages: có 404.html thì hết fallback SPA — phải có _redirects cho link cũ / link tạm xem thử
  const redirectLines = Object.entries(HOST_REDIRECTS)
    .map(([from, to]) => `${from} ${to} 301`)
    .sort()
  writeFileSync(
    join(DIST, '_redirects'),
    `# Sinh từ HOST_REDIRECTS (src/data/links.ts) lúc dựng sẵn HTML. Không sửa tay.\n${redirectLines.join('\n')}\n`,
  )

  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  console.log(
    `Xong: ${ok} file HTML + sitemap.xml + _redirects (${redirectLines.length} dòng) trong ${seconds}s → ${relative(ROOT, DIST)}/`,
  )

  if (failures.length > 0) {
    console.error(`\nLỗi (${failures.length}):`)
    for (const line of failures) console.error(`  - ${line}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
