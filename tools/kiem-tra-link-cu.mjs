// Mở từng link của web cũ (docs/link-web-cu/danh-sach-*.tsv) trên bản web đang chạy và báo link nào ra trang lỗi.
// Chạy trước mỗi lần đưa web lên, và sau mỗi lần đổi đường link trong src/App.tsx:
//   node tools/kiem-tra-link-cu.mjs                      (mặc định http://localhost:5173, cần `pnpm dev` đang chạy)
//   node tools/kiem-tra-link-cu.mjs https://dia-chi-thu   (bản chạy thử trên mạng)
// Quy tắc và bảng đích của từng link: docs/giu-link-web-cu.md
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIR = `${ROOT}docs/link-web-cu/`
const ORIGIN = (process.argv[2] ?? 'http://localhost:5173').replace(/\/$/, '')
// Bài viết do WordPress phục vụ; bản chạy thử chỉ có vài bài mẫu nên không tính là lỗi của giao diện
const SERVED_BY_WORDPRESS = new Set(['post'])
const NOT_FOUND_TITLE = 'Không tìm thấy'

const listFile = readdirSync(DIR).filter((f) => f.startsWith('danh-sach-') && f.endsWith('.tsv')).sort().at(-1)
if (!listFile) throw new Error(`Không thấy file danh-sach-*.tsv trong ${DIR}`)
const rows = readFileSync(DIR + listFile, 'utf8').trim().split('\n').slice(1).map((line) => {
  const [type, path] = line.split('\t')
  return { type, path }
})

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
await page.route(/\.(webp|png|jpe?g|woff2?)$|youtube|googleapis|gstatic/, (route) => route.abort())
const summary = {}
const broken = []
for (const row of rows) {
  await page.goto(ORIGIN + row.path, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.title && document.querySelector('main h1, main h2'), null, { timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(250)
  const now = new URL(page.url())
  const isNotFound = (await page.title()).includes(NOT_FOUND_TITLE)
  const isSame = now.pathname.replace(/\/$/, '') === row.path.replace(/\/$/, '')
  const bucket = (summary[row.type] ??= { 'tổng': 0, 'ra trang lỗi': 0, 'chuyển hướng': 0, 'giữ nguyên': 0 })
  bucket['tổng'] += 1
  bucket[isNotFound ? 'ra trang lỗi' : isSame ? 'giữ nguyên' : 'chuyển hướng'] += 1
  if (isNotFound && !SERVED_BY_WORDPRESS.has(row.type)) broken.push(`${row.type}\t${row.path}`)
}
await browser.close()

console.log(`Danh sách: ${listFile} · ${rows.length} link · kiểm trên ${ORIGIN}`)
console.table(summary)
if (broken.length > 0) {
  console.log(`\n${broken.length} link ra trang lỗi (không tính bài viết, vì bài viết lấy từ WordPress):`)
  console.log(broken.join('\n'))
  process.exitCode = 1
}
