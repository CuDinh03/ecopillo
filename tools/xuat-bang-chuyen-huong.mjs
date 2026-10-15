// Xuất bảng chuyển hướng 301 cho máy chủ, từ đúng bảng mà giao diện đang dùng (src/data/links.ts, SERVER_REDIRECTS).
// Gửi file này cho bên làm WordPress / máy chủ; sửa đích thì sửa links.ts rồi chạy lại, đừng sửa tay file xuất ra.
//   node tools/xuat-bang-chuyen-huong.mjs [thư-mục-ra]      (mặc định: docs/link-web-cu/)
// Kết quả: chuyen-huong-301.tsv (cột: tu, den) và chuyen-huong-301.htaccess (dòng Redirect 301 cho LiteSpeed/Apache).
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT_DIR = (process.argv[2] ?? `${ROOT}docs/link-web-cu`).replace(/\/$/, '')

const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
let links
try {
  links = await server.ssrLoadModule('/src/data/links.ts')
} finally {
  await server.close()
}

const rows = Object.entries(links.SERVER_REDIRECTS)
// Đích là một link khác trong bảng thì đi thẳng tới đích cuối, tránh chuyển hai lần
const finalTarget = (to, seen = new Set()) =>
  links.SERVER_REDIRECTS[to] && !seen.has(to) ? finalTarget(links.SERVER_REDIRECTS[to], seen.add(to)) : to

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(`${OUT_DIR}/chuyen-huong-301.tsv`, `tu\tden\n${rows.map(([from, to]) => `${from}\t${finalTarget(to)}`).join('\n')}\n`)
writeFileSync(
  `${OUT_DIR}/chuyen-huong-301.htaccess`,
  `# Sinh từ src/data/links.ts bằng tools/xuat-bang-chuyen-huong.mjs. Không sửa tay.\n${rows
    .map(([from, to]) => `Redirect 301 ${from} ${finalTarget(to)}`)
    .join('\n')}\n`,
)
console.log(`${rows.length} dòng chuyển hướng → ${OUT_DIR}/chuyen-huong-301.{tsv,htaccess}`)
