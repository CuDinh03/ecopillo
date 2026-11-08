// Kiểm tiêu đề và mô tả Google của mọi trang trong bản build (dist/**/index.html), không cần máy chủ.
// Chạy sau `pnpm build`:  node tools/kiem-tra-meta.mjs [--json <file-ra>]
// Đạt khi: 0 mô tả trên 160 ký tự, 0 mô tả dưới 70, 0 cặp mô tả trùng, 0 tiêu đề trùng (góp ý SEO 08/11/2026).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const DESCRIPTION_MAX = 160
const DESCRIPTION_MIN = 70
const TITLE_MAX = 60

/** Mọi file index.html trong dist/ (bỏ thư mục ảnh, phông cho nhanh) */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return ['images', 'fonts', 'assets', 'hieu-ung'].includes(name) ? [] : htmlFiles(full)
    return name === 'index.html' ? [full] : []
  })
}

const decode = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const metaContent = (html, attr, key) => {
  const tag = html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*>`, 'u'))?.[0]
  return tag ? decode(tag.match(/content="([^"]*)"/u)?.[1] ?? '') : ''
}

const pages = htmlFiles(DIST)
  .map((file) => {
    const html = readFileSync(file, 'utf8')
    const path = `/${relative(DIST, file).split(sep).slice(0, -1).join('/')}${file === join(DIST, 'index.html') ? '' : '/'}`
    return {
      path,
      title: decode(html.match(/<title>([^<]*)<\/title>/u)?.[1] ?? ''),
      desc: metaContent(html, 'name', 'description'),
      ogTitle: metaContent(html, 'property', 'og:title'),
      ogDesc: metaContent(html, 'property', 'og:description'),
      noindex: /<meta[^>]*name="robots"[^>]*noindex/u.test(html),
    }
  })
  .sort((a, b) => a.path.localeCompare(b.path))

/** Gom các trang có cùng giá trị (bỏ trang noindex như 404) */
const duplicates = (key) => {
  const groups = new Map()
  for (const p of pages.filter((x) => !x.noindex)) groups.set(p[key], [...(groups.get(p[key]) ?? []), p.path])
  return [...groups].filter(([, paths]) => paths.length > 1)
}

const longDesc = pages.filter((p) => p.desc.length > DESCRIPTION_MAX)
const shortDesc = pages.filter((p) => p.desc.length < DESCRIPTION_MIN)
const longTitle = pages.filter((p) => p.title.length > TITLE_MAX)
const ogMismatch = pages.filter((p) => p.ogTitle !== p.title)
const dupDesc = duplicates('desc')
const dupTitle = duplicates('title')

const lengths = (key) => pages.map((p) => p[key].length).sort((a, b) => a - b)
const range = (list) => `${list[0]}–${list.at(-1)} (trung vị ${list[Math.floor(list.length / 2)]})`

console.log(`Số trang: ${pages.length}`)
console.log(`Tiêu đề: ${range(lengths('title'))} ký tự, ${longTitle.length} trang trên ${TITLE_MAX}`)
console.log(`Mô tả: ${range(lengths('desc'))} ký tự`)
const report = (label, list, show) => {
  console.log(`\n${label}: ${list.length}`)
  for (const item of list) console.log(`  ${show(item)}`)
}
report(`Mô tả trên ${DESCRIPTION_MAX}`, longDesc, (p) => `${p.desc.length}  ${p.path}`)
report(`Mô tả dưới ${DESCRIPTION_MIN}`, shortDesc, (p) => `${p.desc.length}  ${p.path}  «${p.desc}»`)
report('Cặp mô tả trùng', dupDesc, ([desc, paths]) => `${paths.join(' = ')}  «${desc.slice(0, 60)}…»`)
report('Tiêu đề trùng', dupTitle, ([title, paths]) => `${paths.join(' = ')}  «${title}»`)
report('og:title khác <title>', ogMismatch, (p) => `${p.path}  «${p.ogTitle}» ≠ «${p.title}»`)

const jsonAt = process.argv.indexOf('--json')
if (jsonAt > 0) writeFileSync(process.argv[jsonAt + 1], JSON.stringify(pages, null, 2))

const failed = longDesc.length + shortDesc.length + dupDesc.length + dupTitle.length
console.log(failed ? `\nCHƯA ĐẠT: ${failed} lỗi` : '\nĐẠT')
process.exitCode = failed ? 1 : 0
