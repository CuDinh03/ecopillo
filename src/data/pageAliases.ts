import { liveList, type EditableField } from './liveContent'

/**
 * Đổi link một trang có sẵn của giao diện mới (owner 24/11/2026: "khách toàn quyền chỉnh sửa web"; đè quy tắc giữ nguyên link
 * web cũ ngày 15/10/2026). Nội dung web → Giao diện → "Đổi link trang": chọn một trang, ghi link mới.
 *
 * - Máy chủ (plugin trang-wp.php): link mới trả HTML dựng sẵn của trang đó (canonical, og:url đổi sang link mới); link cũ trả 301
 *   sang link mới, nên link Google đã biết vẫn tới đúng trang; sơ đồ trang ghi link mới.
 * - Trình duyệt (src/lib/aliasHistory.ts): bộ định tuyến vẫn chạy theo link cũ ("link trong"), thanh địa chỉ và mọi link trên trang
 *   hiện link mới. Code trong web giữ nguyên PATHS, links.ts; chỗ ghi link ra ngoài (canonical, JSON-LD) đi qua `publicPath`.
 *
 * Không có dòng nào (mặc định) thì web chạy đúng như trước (App.tsx dùng BrowserRouter như cũ).
 * Bộ sửa được (ô "Trang" là danh sách mọi trang dựng sẵn, có tên dễ đọc) khai ở pageAliasFrame.ts; ở đây chỉ đọc dữ liệu đã lưu.
 * Plugin kiểm kỹ lúc lưu (trùng trang khác, trùng bài WordPress, trùng link đang 301, đổi nối tiếp); ở đây kiểm lại phần chắc chắn.
 */

export const PAGE_ALIAS_KEY = 'doi-link-trang'

/** Ô "Trang" ở đây là link (đường dẫn trang); màn hình sửa dùng ô chọn (pageAliasFrame.ts) */
export const PAGE_ALIAS_FIELDS: readonly EditableField[] = [
  { khoa: 'trang', nhan: 'Trang', kieu: 'link', batBuoc: true },
  {
    khoa: 'linkMoi',
    nhan: 'Link mới',
    kieu: 'link',
    batBuoc: true,
    goiY: 'Phần sau tên miền, chữ thường không dấu, số, gạch ngang, có "/" hai đầu, ví dụ /ve-ecopillo/. Gõ "Về Ecopillo" cũng được: máy tự đổi thành /ve-ecopillo/.',
  },
]

/** Link trang có sẵn (như eco_tw_is_path trong plugin) */
const PAGE_PATH = /^\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\/$/
/** Link mới: chỉ chữ thường không dấu, số, gạch ngang */
const NEW_PATH = /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/
/** Đầu link dành cho WordPress và file của web (như eco_tw_alias_problem trong plugin) */
const RESERVED_FIRST = /^\/(?:wp-[^/]*|api|feed|comments|embed|page|search|assets|fonts|images|hieu-ung)\//

const withSlash = (path: string): string => (path.endsWith('/') ? path : `${path}/`)
const keyOf = (path: string): string => withSlash(path.trim().toLowerCase())

const ROWS = liveList(PAGE_ALIAS_KEY, [] as { trang: string; linkMoi: string }[], PAGE_ALIAS_FIELDS, () => ({ trang: '', linkMoi: '' }))

/** Link trong (link cũ của trang) → link mới. Bỏ dòng sai, trang chủ, trùng, đổi nối tiếp (A → B, B → C) */
const ALIASES: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>()
  const taken = new Set<string>()
  for (const { trang, linkMoi } of ROWS) {
    const from = keyOf(trang)
    const to = keyOf(linkMoi)
    if (!PAGE_PATH.test(from) || !NEW_PATH.test(to) || RESERVED_FIRST.test(to) || from === to) continue
    if (map.has(from) || taken.has(to)) continue
    map.set(from, to)
    taken.add(to)
  }
  // Link mới lại là link cũ của trang khác (hoặc ngược lại): bỏ cả hai phía, như plugin
  const olds = new Set(map.keys())
  for (const [from, to] of [...map]) if (olds.has(to) || taken.has(from)) map.delete(from)
  return map
})()

const REVERSE: ReadonlyMap<string, string> = new Map([...ALIASES].map(([from, to]) => [to, from]))

/** Ecopillo có đổi link trang nào không (App.tsx: chỉ khi có mới dùng bộ định tuyến đổi link) */
export const hasPageAliases = ALIASES.size > 0

/** Đổi phần đường dẫn theo bảng, giữ ?…, #… phía sau; không có trong bảng thì trả nguyên */
function mapPath(path: string, map: ReadonlyMap<string, string>): string {
  if (!map.size || !path.startsWith('/')) return path
  const at = path.search(/[?#]/)
  const pathname = at < 0 ? path : path.slice(0, at)
  const hit = map.get(keyOf(pathname))
  return hit ? hit + (at < 0 ? '' : path.slice(at)) : path
}

/** Link khách thấy (link mới nếu Ecopillo đã đổi link trang đó). Dùng khi ghi link ra ngoài: canonical, JSON-LD */
export const publicPath = (path: string): string => mapPath(path, ALIASES)

/** Link trong của bộ định tuyến (link cũ của trang) ứng với link trên thanh địa chỉ */
export const internalPath = (path: string): string => mapPath(path, REVERSE)

/** Link cũ hoặc link mới của một trang đã đổi link: "Chuyển hướng link" không áp lên link này (đổi link trang đứng trên, như plugin) */
export const isAliasPath = (path: string): boolean => {
  const key = keyOf(path.split(/[?#]/)[0])
  return ALIASES.has(key) || REVERSE.has(key)
}
