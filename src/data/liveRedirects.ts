import { liveList, type EditableField, type EditableSet } from './liveContent'

/**
 * Chuyển hướng link Ecopillo tự thêm (owner 20/11/2026: "ecopillo cần tự làm hết được"): đổi đường dẫn một bài, ngừng bán một mẫu,
 * gộp trang… thì thêm một dòng "link cũ → link mới" để link Google đã biết không ra trang lỗi.
 * Nội dung web → Giao diện → Chuyển hướng link. Plugin (noi-dung.php) trả 301 cho link cũ đi tới WordPress; trên web, link cũ
 * mở trong trang (bấm từ trang khác) cũng chuyển ngay (routes.tsx). Link cũ đang là một trang có sẵn của giao diện mới thì máy chủ
 * vẫn trả trang đó, chỉ trình duyệt chuyển: muốn 301 ở máy chủ cho trang có sẵn thì báo bên làm web.
 */

const FIELDS: readonly EditableField[] = [
  { khoa: 'tu', nhan: 'Link cũ', kieu: 'link', batBuoc: true, goiY: 'Chỉ phần sau tên miền, ví dụ /san-pham/bo-chan-ga-cu/' },
  { khoa: 'toi', nhan: 'Chuyển tới', kieu: 'link', batBuoc: true, goiY: 'Trang gần nghĩa nhất trên web, ví dụ /danh-muc-san-pham/bo-suu-tap-eco-rosa/' },
]

export const REDIRECT_SET: EditableSet = {
  khoa: 'chuyen-huong',
  nhom: 'Giao diện',
  ten: 'Chuyển hướng link',
  moTa: 'Link cũ chuyển sang link mới (301), để link Google đã biết không ra trang lỗi: đổi đường dẫn bài viết, ngừng bán một mẫu, gộp trang. Chỉ ghi link trong web (bắt đầu bằng /). Không chuyển trang chủ, không chuyển vòng.',
  kieu: 'nhieu',
  goc: [],
  tieuDeDong: 'tu',
  truong: FIELDS,
}

const withSlash = (path: string): string => (path.endsWith('/') ? path : `${path}/`)
const isSitePath = (v: unknown): v is string => typeof v === 'string' && /^\/[a-z0-9/_.-]*$/i.test(v) && !v.startsWith('//')

const ROWS = liveList(REDIRECT_SET.khoa, [] as { tu: string; toi: string }[], FIELDS, () => ({ tu: '', toi: '' }))

/** Link cũ (có "/" cuối, chữ thường) → link mới; bỏ dòng sai, trang chủ, vòng, trang quản trị */
const LIVE_REDIRECTS: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>()
  for (const { tu, toi } of ROWS) {
    if (!isSitePath(tu) || !isSitePath(toi)) continue
    const from = withSlash(tu.toLowerCase())
    if (from === '/' || from.startsWith('/wp-') || from === withSlash(toi.toLowerCase())) continue
    map.set(from, toi)
  }
  // Bỏ chuyển vòng: đích lại là một link cũ trong bảng
  for (const [from, to] of [...map]) if (map.has(withSlash(to.toLowerCase()))) map.delete(from)
  return map
})()

export const liveRedirectFor = (path: string): string | undefined => LIVE_REDIRECTS.get(withSlash(path.toLowerCase()))
