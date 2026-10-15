#!/usr/bin/env node
/**
 * Đóng gói bản xem thử để đưa lên Cloudflare Pages (docs/phuong-an-dua-ban-xem-thu.md).
 * GitHub Actions chạy file này sau khi build; chạy trên máy cũng được để kiểm trước khi đẩy.
 *
 *   VITE_BAN_XEM_THU=1 pnpm exec vite build --outDir dist-xem-thu
 *   node tools/chuan-bi-ban-xem-thu.mjs
 *
 * Kết quả: thư mục .xem-thu/ gồm site/ (web) và functions/ (cổng hỏi mã).
 * Dừng với mã lỗi 1 khi thiếu lớp chặn Google, còn ảnh bị ẩn, hoặc còn chữ cấm.
 */
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const BUILD = join(ROOT, 'dist-xem-thu')
const OUT = join(ROOT, '.xem-thu')
const SITE = join(OUT, 'site')
const SOURCE = join(ROOT, 'trien-khai/xem-thu')

/** Ảnh không được đưa lên dù vẫn nằm trong public/. Thêm vào đây khi ẩn ảnh nào khác */
const EXCLUDED = [
  // In sẵn dòng chất liệu cũ đã bỏ (src/data/catalog.ts, mẫu ER12). Chờ Ecopillo gửi ảnh mới
  'images/patterns/chan-he-ER12.webp',
  'images/patterns/chan-he-ER12-sm.webp',
]

/**
 * Chữ cấm (CLAUDE.md). Chỉ được phép trong đường link CŨ nằm ở bảng chuyển hướng (src/data/links.ts), vì phải nhận link cũ
 * để chuyển 301 sang link mới đã đổi thành "lyocell" (owner chốt 15/10/2026). Chữ hiện trên trang vẫn bị chặn.
 */
const BANNED = /tencel|\b60 ?s\b/i
const OLD_PATH_WITH_BANNED = /['"]\/(?:vai-tencel-la-gi|san-pham\/[a-z0-9-]*tencel[a-z0-9-]*)\/['"]/g

const TEXT_FILE = /\.(html|js|css|json|txt|xml|svg|webmanifest)$/i

const problems = []

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function stripAllowed(text) {
  return text.replace(OLD_PATH_WITH_BANNED, '""')
}

if (!existsSync(join(BUILD, 'index.html'))) {
  console.error('Chưa có bản build. Chạy: VITE_BAN_XEM_THU=1 pnpm exec vite build --outDir dist-xem-thu')
  process.exit(1)
}

rmSync(OUT, { recursive: true, force: true })
cpSync(BUILD, SITE, { recursive: true })
cpSync(join(SOURCE, 'tinh'), SITE, { recursive: true })
cpSync(join(SOURCE, 'functions'), join(OUT, 'functions'), { recursive: true })

// File rác của macOS và ảnh đã ẩn
for (const file of walk(SITE)) {
  if (/(^|\/)(\.DS_Store|\._[^/]*)$/.test(file)) rmSync(file)
}
for (const path of EXCLUDED) rmSync(join(SITE, path), { force: true })

// Chặn Google: đủ 3 lớp mới cho đi
const indexHtml = readFileSync(join(SITE, 'index.html'), 'utf8')
if (!/<meta name="robots" content="noindex/.test(indexHtml)) problems.push('index.html thiếu thẻ noindex (build chưa bật VITE_BAN_XEM_THU=1?)')
if (indexHtml.includes('content="https://ecopillo.com.vn/')) problems.push('index.html còn og:url/og:image trỏ về ecopillo.com.vn')
if (!readFileSync(join(SITE, 'robots.txt'), 'utf8').includes('Disallow: /')) problems.push('robots.txt không chặn')
if (!readFileSync(join(SITE, '_headers'), 'utf8').includes('X-Robots-Tag: noindex')) problems.push('_headers thiếu X-Robots-Tag')
if (!existsSync(join(OUT, 'functions/_middleware.js'))) problems.push('thiếu functions/_middleware.js (cổng hỏi mã)')

// Bản xem thử phải mang thông báo "chưa gửi đi"
const bundle = walk(join(SITE, 'assets'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')
if (!bundle.includes('Bản xem thử giao diện')) problems.push('gói JS không có hộp thông báo bản xem thử')

// Ảnh đã ẩn, chữ cấm trong tên file và nội dung
const files = walk(SITE)
for (const file of files) {
  const rel = relative(SITE, file)
  if (EXCLUDED.includes(rel)) problems.push(`còn ảnh bị ẩn: ${rel}`)
  if (BANNED.test(stripAllowed(rel))) problems.push(`tên file có chữ cấm: ${rel}`)
  if (TEXT_FILE.test(file) && BANNED.test(stripAllowed(readFileSync(file, 'utf8')))) problems.push(`nội dung có chữ cấm: ${rel}`)
}

const bytes = files.reduce((sum, f) => sum + statSync(f).size, 0)
console.log(`Bản xem thử: ${files.length} file, ${(bytes / 1024 / 1024).toFixed(1)} MB → ${relative(ROOT, OUT)}/`)

if (problems.length > 0) {
  console.error(`\nDừng, chưa đưa lên được (${problems.length} lỗi):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log('Đủ lớp chặn Google, không còn ảnh ẩn hay chữ cấm.')
