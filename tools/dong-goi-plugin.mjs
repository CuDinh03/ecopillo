// Đóng gói giao diện mới thành plugin WordPress "Ecopillo giao diện mới" (cài bằng Plugin → Cài mới → Tải plugin lên).
// Kế hoạch: docs/ke-hoach-dua-giao-dien-moi-len-web-that.md (owner 18/11/2026: "cứ thay dần giao diện").
//
//   pnpm build                       (bản chạy thật: có GTM + Pixel, KHÔNG phải bản xem thử)
//   node tools/dong-goi-plugin.mjs   → ban-dong-goi/ecopillo-giao-dien-moi.zip (+ thư mục cùng tên để xem)
//
// Trong zip:
//   *.php                            plugin (trien-khai/wordpress-plugin/…): chế độ giao diện + nhận đơn /api/gui
//   site/                            bản build (dist/), trừ _redirects
//   quy-tac/thu-kin.htaccess         quy tắc chế độ Thử kín (chỉ trình duyệt có cookie thử)
//   quy-tac/bat.htaccess             quy tắc chế độ Bật cho mọi người
//   quy-tac/ban-build.txt            mã commit + ngày đóng gói (hiện ở trang cài đặt)
// {SITE} trong quy tắc được plugin thay bằng đường dẫn thật của site/ (ví dụ /wp-content/plugins/ecopillo-giao-dien-moi/site).
// Thử quy tắc bằng Apache trên máy: node tools/dong-goi-plugin.mjs --chi-quy-tac <thư-mục-ra>
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const DIST = 'dist'
const PLUGIN_SRC = 'trien-khai/wordpress-plugin/ecopillo-giao-dien-moi'
const OUT_ROOT = 'ban-dong-goi'
const NAME = 'ecopillo-giao-dien-moi'
const COOKIE = 'ecopillo_gdm'

/** Bảng 301 từ dist/_redirects (sinh từ HOST_REDIRECTS trong src/data/links.ts lúc dựng HTML) */
function readRedirects() {
  return readFileSync(join(DIST, '_redirects'), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => l.trim().split(/\s+/))
    .filter(([from, to, code]) => from?.startsWith('/') && to?.startsWith('/') && code === '301')
    .map(([from, to]) => [from, to])
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Quy tắc .htaccess cho một chế độ ('thu-kin' | 'bat'). Giữ đúng thứ tự: 301 → file → trang */
export function buildRules(mode, redirects) {
  const gate = mode === 'thu-kin' ? [`RewriteCond %{HTTP_COOKIE} (^|;\\s*)${COOKIE}=1(;|$)`] : []
  // Để WordPress tự lo: trang quản trị, file hệ thống, xem trước bài, tìm kiếm, công tắc thử
  const skip = [
    'RewriteCond %{REQUEST_URI} !^/(wp-admin|wp-content|wp-includes|wp-json)(/|$)',
    'RewriteCond %{REQUEST_URI} !^/(wp-login\\.php|xmlrpc\\.php|wp-cron\\.php)',
    'RewriteCond %{QUERY_STRING} !(^|&)(preview|preview_id|p|page_id|s|giao-dien-moi)=',
  ]
  const lines = [
    `# Do plugin "Ecopillo giao dien moi" ghi (che do: ${mode}). Doi che do o Cai dat > Giao dien moi, dung sua tay.`,
    '<IfModule mod_rewrite.c>',
    'RewriteEngine On',
    'RewriteBase /',
  ]
  if (mode === 'thu-kin') {
    // Người đang thử: không lấy trang WordPress cũ đã lưu đệm (LiteSpeed Cache)
    lines.push(...gate, 'RewriteRule .* - [E=Cache-Control:no-cache]')
  }
  // 1. Link cũ đã đổi hoặc gộp: 301 sang link mới. NE: giữ "#" trong đích (/lien-he/#diem-ban)
  for (const [from, to] of redirects) {
    const path = from.replace(/^\/|\/$/g, '')
    if (!path) continue // không bao giờ chuyển hướng trang chủ
    lines.push(...gate, ...skip, `RewriteRule ^${escapeRegex(path)}/?$ ${to} [R=301,L,NE]`)
  }
  // 2. File của giao diện mới (JS, CSS, ảnh, favicon, sitemap…): có file trong site/ thì trả file đó
  lines.push(...gate, ...skip, 'RewriteCond %{DOCUMENT_ROOT}{SITE}%{REQUEST_URI} -f', 'RewriteRule ^ {SITE}%{REQUEST_URI} [L]')
  // 3. Trang: /duong-dan/ → site/duong-dan/index.html (trang chủ: site/index.html)
  lines.push(
    ...gate,
    ...skip,
    'RewriteCond %{REQUEST_URI} /$',
    'RewriteCond %{DOCUMENT_ROOT}{SITE}%{REQUEST_URI}index.html -f',
    'RewriteRule ^ {SITE}%{REQUEST_URI}index.html [L]',
  )
  lines.push('</IfModule>')
  return lines.join('\n') + '\n'
}

function writeRules(dir, redirects, version) {
  mkdirSync(dir, { recursive: true })
  for (const mode of ['thu-kin', 'bat']) writeFileSync(join(dir, `${mode}.htaccess`), buildRules(mode, redirects))
  writeFileSync(join(dir, 'ban-build.txt'), `${version}\n`)
}

const args = process.argv.slice(2)
if (!existsSync(join(DIST, 'index.html')) || !existsSync(join(DIST, '_redirects'))) {
  console.error('Chưa có bản build. Chạy: pnpm build')
  process.exit(1)
}
const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8')
if (/name="robots" content="noindex/.test(indexHtml)) {
  console.error('dist/ là bản xem thử (có noindex). Chạy lại: pnpm build (không đặt VITE_BAN_XEM_THU)')
  process.exit(1)
}
if (!indexHtml.includes('GTM-5DHJ4ZNM')) console.warn('Lưu ý: bản build không có GTM (đã nạp mã đo kiểu khác?)')

const redirects = readRedirects()
const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim()
const dirty = execFileSync('git', ['status', '--porcelain', '--', 'src', 'public', 'index.html'], { encoding: 'utf8' }).trim() ? ' (có sửa chưa commit)' : ''
const version = `${commit}${dirty} · đóng gói ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`

if (args[0] === '--chi-quy-tac') {
  writeRules(args[1], redirects, version)
  console.log(`Quy tắc (${redirects.length} dòng 301) → ${args[1]}`)
  process.exit(0)
}

const stage = join(OUT_ROOT, NAME)
rmSync(OUT_ROOT, { recursive: true, force: true })
mkdirSync(stage, { recursive: true })
for (const file of readdirSync(PLUGIN_SRC).filter((f) => f.endsWith('.php'))) cpSync(join(PLUGIN_SRC, file), join(stage, file))
cpSync(DIST, join(stage, 'site'), {
  recursive: true,
  filter: (src) => !/(^|\/)(_redirects|\.DS_Store|\._[^/]*)$/.test(src),
})
writeRules(join(stage, 'quy-tac'), redirects, version)
// Thư mục site/ chỉ có file tĩnh: chặn chạy PHP trong đó nếu ai đó lỡ đặt file .php vào
writeFileSync(join(stage, 'site', '.htaccess'), '<FilesMatch "\\.(php|phtml|phar)$">\n  Require all denied\n</FilesMatch>\n')

const zip = join(OUT_ROOT, `${NAME}.zip`)
execFileSync('zip', ['-r', '-q', '-X', `${NAME}.zip`, NAME], { cwd: OUT_ROOT })
const size = (execFileSync('du', ['-sh', zip], { encoding: 'utf8' }).split('\t')[0] || '').trim()
console.log(`Plugin ${version}\n  ${redirects.length} dòng 301 · zip ${size} → ${zip}`)
