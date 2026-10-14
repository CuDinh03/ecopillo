/**
 * Cổng vào bản xem thử trên Cloudflare Pages (docs/phuong-an-dua-ban-xem-thu.md).
 *
 * - Khách mở link có mã `?ma=<mã>` lần đầu: ghi cookie 30 ngày rồi chuyển về link không mã.
 * - Có cookie đúng: xem bình thường. Không có: hiện trang hỏi mã, không lộ nội dung web.
 * - Mã đặt ở biến XEM_THU_MA của dự án Cloudflare (GitHub Actions đặt từ secret cùng tên).
 *   Đổi mã là mọi link và cookie cũ hết hiệu lực. Chưa đặt mã thì đóng hẳn, không mở tự do.
 * - Mọi trả lời đều kèm X-Robots-Tag: noindex để Google không lưu bản xem thử.
 */

const COOKIE = 'ecopillo_xem_thu'
const MAX_AGE = 60 * 60 * 24 * 30
const NOINDEX = 'noindex, nofollow, noarchive'

/** Đường dẫn mở không cần mã: robots.txt cho máy tìm kiếm, ảnh chia sẻ cho Zalo/Facebook hiện khung xem trước */
const PUBLIC_PATHS = new Set(['/robots.txt', '/og-image.jpg', '/favicon.png', '/favicon-48.png', '/apple-touch-icon.png'])

async function digest(code) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`ecopillo-xem-thu:${code}`))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') ?? ''
  const found = header.split(/;\s*/).find((part) => part.startsWith(`${name}=`))
  return found ? found.slice(name.length + 1) : ''
}

function withNoindex(response) {
  const copy = new Response(response.body, response)
  copy.headers.set('X-Robots-Tag', NOINDEX)
  return copy
}

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function gatePage(origin, { wrongCode }) {
  const image = escapeHtml(`${origin}/og-image.jpg`)
  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="${NOINDEX}" />
<title>Ecopillo – bản xem thử giao diện</title>
<meta property="og:title" content="Ecopillo – bản xem thử giao diện" />
<meta property="og:description" content="Bản xem thử website mới của Ecopillo, dành riêng cho Ecopillo duyệt." />
<meta property="og:image" content="${image}" />
<link rel="icon" type="image/png" href="/favicon-48.png" />
<style>
  :root { --cham: #2d2e8d; --cham-sang: #333dba; --xanh-nhat: #e9f8ff; --trang: #ffffff; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 16px;
    font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--cham); background: var(--xanh-nhat); }
  main { width: min(26rem, 100%); background: var(--trang); border-radius: 24px; padding: 32px 24px;
    box-shadow: 0 20px 50px -20px rgb(45 46 141 / 0.35); }
  h1 { margin: 0 0 8px; font: 400 1.7rem/1.2 Georgia, serif; }
  p { margin: 0 0 20px; color: rgb(45 46 141 / 0.75); }
  label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; }
  input { width: 100%; height: 48px; padding: 0 14px; font: inherit; color: inherit; border-radius: 12px;
    border: 1px solid rgb(45 46 141 / 0.3); }
  input:focus { outline: 2px solid var(--cham-sang); outline-offset: 1px; }
  button { margin-top: 14px; width: 100%; height: 48px; border: 0; border-radius: 999px; font: inherit; font-weight: 600;
    color: var(--trang); background: var(--cham); cursor: pointer; }
  button:hover { background: var(--cham-sang); }
  .loi { margin: 10px 0 0; color: #b42318; font-size: 0.9rem; }
</style>
</head>
<body>
<main>
  <h1>Bản xem thử của Ecopillo</h1>
  <p>Trang này dành riêng cho Ecopillo duyệt giao diện. Quý khách vui lòng mở bằng đường link đã được gửi, hoặc nhập mã xem thử.</p>
  <form method="get" action="/">
    <label for="ma">Mã xem thử</label>
    <input id="ma" name="ma" autocomplete="off" autocapitalize="off" spellcheck="false" required />
    ${wrongCode ? '<p class="loi" role="alert">Mã chưa đúng. Quý khách kiểm lại giúp.</p>' : ''}
    <button type="submit">Xem bản thử</button>
  </form>
</main>
</body>
</html>`
  return new Response(html, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': NOINDEX },
  })
}

export async function onRequest(context) {
  const { request, env, next } = context
  const url = new URL(request.url)

  if (PUBLIC_PATHS.has(url.pathname)) return withNoindex(await next())

  const code = env.XEM_THU_MA
  if (!code) {
    return new Response('Bản xem thử chưa được cấu hình mã.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': NOINDEX },
    })
  }

  const expected = await digest(code)
  const given = url.searchParams.get('ma')
  if (given !== null) {
    if ((await digest(given.trim())) !== expected) return gatePage(url.origin, { wrongCode: true })
    url.searchParams.delete('ma')
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.pathname + url.search + url.hash,
        'Set-Cookie': `${COOKIE}=${expected}; Max-Age=${MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': NOINDEX,
      },
    })
  }

  if (readCookie(request, COOKIE) === expected) return withNoindex(await next())
  return gatePage(url.origin, { wrongCode: false })
}
