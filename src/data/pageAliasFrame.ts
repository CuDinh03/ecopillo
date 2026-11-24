import { COLLECTIONS } from './catalog'
import { COLLECTION_BY_PATH, HOST_REDIRECTS, LISTINGS, PATHS, patternPath, singleProductPath, withSlash } from './links'
import type { EditableSet } from './liveContent'
import { PAGE_ALIAS_FIELDS, PAGE_ALIAS_KEY } from './pageAliases'
import { POLICY_PAGES, policyPath } from './policyNav'
import { POSTS, postPath } from './posts'
import { PRODUCTS } from './products'

/**
 * Bộ "Đổi link trang" cho màn hình sửa trong WordPress (pageAliases.ts đọc dữ liệu đã lưu). Chỉ contentFrame.ts dùng, lúc dựng:
 * ô "Trang" là danh sách mọi trang dựng sẵn của giao diện mới, nhãn "Tên trang (/link/)".
 * Không có: trang chủ (không đổi link được), /he-thong-phan-phoi/ (chỉ còn 301 sang Liên hệ), link phụ của trang chính sách,
 * bài viết lấy từ WordPress (đổi đường dẫn ngay trong bài viết WordPress, rồi thêm dòng ở "Chuyển hướng link").
 */

/** Tên các trang chính (nhãn trong màn hình sửa, không hiện trên web) */
const MAIN_PAGES: readonly (readonly [string, string])[] = [
  [PATHS.products, 'Sản phẩm'],
  [PATHS.about, 'Giới thiệu'],
  [PATHS.contact, 'Liên hệ mua hàng'],
  [PATHS.hotel, 'Khách sạn và dự án'],
  [PATHS.blog, 'Tin tức'],
  [PATHS.recruit, 'Tuyển đại lý'],
  [PATHS.faq, 'Hỏi đáp'],
  [PATHS.gifts, 'Quà tặng'],
  [PATHS.order, 'Đặt hàng'],
  [PATHS.privacy, 'Chính sách bảo mật thông tin'],
]

/** [link, tên] mọi trang đổi link được, theo thứ tự hiện trong ô chọn; trùng link thì giữ dòng đầu */
function pageOptions(): readonly (readonly [string, string])[] {
  const rows: (readonly [string, string])[] = [
    ...MAIN_PAGES,
    ...POLICY_PAGES.map((p) => [policyPath(p.slug), `Chính sách: ${p.label}`] as const),
    ...Object.entries(LISTINGS).map(([path, l]) => [path, `Danh mục: ${l.title}`] as const),
    ...[...COLLECTION_BY_PATH].map(([path, id]) => [path, `Bộ sưu tập: ${COLLECTIONS.find((c) => c.id === id)?.name ?? id}`] as const),
    ...PRODUCTS.filter((p) => !p.collection).map((p) => [singleProductPath(p.slug), `Sản phẩm: ${p.name}`] as const),
    ...COLLECTIONS.flatMap((c) => c.patterns.map((p) => [patternPath(c, p), `Mẫu: ${c.name} ${p.code}`] as const)),
    ...POSTS.map((p) => [postPath(p), `Bài viết: ${p.title}`] as const),
  ]
  const seen = new Map<string, string>()
  for (const [path, label] of rows) {
    const key = withSlash(path)
    if (key !== '/' && key !== withSlash(PATHS.distribution) && !seen.has(key)) seen.set(key, label)
  }
  return [...seen]
}

const OPTIONS = pageOptions()

export const PAGE_ALIAS_SET: EditableSet & { linkDaCo: readonly string[] } = {
  khoa: PAGE_ALIAS_KEY,
  coTheTrong: true,
  nhom: 'Giao diện',
  ten: 'Đổi link trang',
  moTa:
    'Đổi đường link của một trang có sẵn, ví dụ /gioi-thieu/ thành /ve-ecopillo/. Link cũ tự chuyển (301) sang link mới, nên link Google ' +
    'đã biết và link khách đã lưu vẫn tới đúng trang; sơ đồ trang cho Google ghi link mới. Không đổi được trang chủ. Link mới không được ' +
    'trùng trang khác, bài viết WordPress hay link đang chuyển hướng. Xoá dòng là trang về link cũ (nên tránh: Google lại phải học lại).',
  kieu: 'nhieu',
  goc: [],
  tieuDeDong: 'linkMoi',
  truong: PAGE_ALIAS_FIELDS.map((field) =>
    field.khoa === 'trang'
      ? {
          ...field,
          kieu: 'chon' as const,
          luaChon: OPTIONS.map(([path]) => path),
          nhanLuaChon: OPTIONS.map(([path, label]) => `${label} (${path})`),
          goiY: 'Trang cần đổi link. Mỗi trang một dòng.',
        }
      : field,
  ),
  /** Link máy chủ đang chuyển hướng 301 (quy tắc .htaccess, HOST_REDIRECTS): plugin không cho đặt làm link mới */
  linkDaCo: Object.keys(HOST_REDIRECTS).sort(),
}
