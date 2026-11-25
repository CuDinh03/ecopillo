import { liveList, type EditableField, type EditableImage, type EditableSet } from './liveContent'
import { isPagePath, liveCategorySeo } from './liveData'

/**
 * Tiêu đề, mô tả trên Google và ảnh chia sẻ của từng trang, Ecopillo tự điền (đợt E 24/11/2026: "khách muốn thêm SEO",
 * "khách được tuỳ chỉnh toàn bộ bằng wp-admin tất cả các chỗ").
 *
 * Hai nơi điền, ưu tiên theo thứ tự:
 * 1. Nội dung web → Giao diện → "SEO từng trang": một dòng mỗi trang (link, tiêu đề, mô tả, ảnh chia sẻ), cho mọi trang.
 * 2. Trang sửa danh mục WooCommerce (ô SEO của plugin, hoặc khung Yoast SEO): cho trang danh mục (plugin danh-muc.php).
 *    Khung Yoast SEO của bài viết, trang, sản phẩm (25/11/2026, plugin seo-yoast.php): tiêu đề SEO, mô tả, "ẩn khỏi Google";
 *    chỉ ô Ecopillo sửa sau khi cài (chữ Yoast còn từ web cũ không đè chữ đã soạn cho web mới).
 * Ô để trống thì trang giữ tiêu đề, mô tả sẵn có. Máy chủ cũng ghi các thẻ này vào HTML trả về (plugin trang-wp.php),
 * nên Google, Facebook, Zalo đọc được ngay mà không cần chạy JavaScript.
 */

export interface PageSeo {
  /** Tiêu đề đầy đủ của tab / Google (không tự thêm "· Ecopillo") */
  tieuDe?: string
  moTa?: string
  anh?: EditableImage
  /** Ẩn khỏi Google (noindex): trang vẫn mở được, không vào kết quả tìm, ra khỏi sitemap */
  anGoogle?: boolean
}

/** Ô "Hiện trên Google": mặc định theo Yoast (thường là hiện) */
const GOOGLE_OPTIONS = ['mac-dinh', 'an', 'hien'] as const

const FIELDS: readonly EditableField[] = [
  {
    khoa: 'duongDan',
    nhan: 'Link trang',
    kieu: 'link',
    batBuoc: true,
    goiY: 'Phần sau tên miền, có "/" cuối, ví dụ /lien-he/ hoặc /danh-muc-san-pham/san-pham/dem-lo-xo/. Trang chủ: /',
  },
  { khoa: 'tieuDe', nhan: 'Tiêu đề trên Google', kieu: 'chu', goiY: 'Để trống thì giữ tiêu đề sẵn có. Nên dưới 60 chữ cái.' },
  { khoa: 'moTa', nhan: 'Mô tả trên Google', kieu: 'doan', goiY: 'Để trống thì giữ mô tả sẵn có. Nên dưới 160 chữ cái.' },
  { khoa: 'anh', nhan: 'Ảnh khi chia sẻ (Facebook, Zalo)', kieu: 'anh', goiY: 'Ảnh ngang, nên 1200×630. Để trống thì dùng ảnh sẵn có.' },
  {
    khoa: 'google',
    nhan: 'Hiện trên Google',
    kieu: 'chon',
    luaChon: GOOGLE_OPTIONS,
    nhanLuaChon: ['Mặc định (hiện, trừ khi khung Yoast của trang đặt ẩn)', 'Ẩn khỏi Google', 'Hiện trên Google (kể cả khi khung Yoast đặt ẩn)'],
    goiY: 'Ẩn: trang vẫn mở được trên web và vẫn có trong menu, nhưng Google không đưa vào kết quả tìm và trang ra khỏi sơ đồ trang (sitemap). Dùng cho trang ưu đãi đã hết, trang chỉ gửi riêng cho khách. Google bỏ trang khỏi kết quả sau vài ngày tới vài tuần.',
  },
]

export const SEO_SET: EditableSet = {
  khoa: 'seo-tung-trang',
  coTheTrong: true,
  nhom: 'Giao diện',
  ten: 'SEO từng trang',
  moTa:
    'Tiêu đề, mô tả trên Google, ảnh khi chia sẻ và ẩn / hiện trên Google của từng trang. Mỗi dòng một trang; ô để trống thì trang giữ chữ sẵn có. ' +
    'Trang danh mục sản phẩm cũng điền được ngay ở Sản phẩm → Danh mục (ô SEO hoặc khung Yoast SEO); bài viết, trang, sản phẩm điền được ở khung Yoast SEO khi sửa bài / sản phẩm. Dòng ở đây đứng trên cùng.',
  kieu: 'nhieu',
  goc: [],
  tieuDeDong: 'duongDan',
  truong: FIELDS,
}

interface SeoRow {
  duongDan: string
  tieuDe?: string
  moTa?: string
  anh?: EditableImage
  google?: string
}

const ROWS = liveList<SeoRow>(SEO_SET.khoa, [], FIELDS, () => ({ duongDan: '' }))

const withSlash = (path: string): string => (path.endsWith('/') ? path : `${path}/`)

const SEO: ReadonlyMap<string, PageSeo> = (() => {
  const map = new Map<string, PageSeo>(Object.entries(liveCategorySeo()))
  for (const row of ROWS) {
    const path = withSlash(row.duongDan.trim().toLowerCase())
    if (path !== '/' && !isPagePath(path)) continue
    const { anGoogle, ...rest } = map.get(path) ?? {}
    // "an" ẩn, "hien" hiện kể cả khi Yoast đặt ẩn, "mac-dinh" / trống theo Yoast (như plugin trang-wp.php)
    const hidden = row.google === 'an' || (row.google !== 'hien' && anGoogle === true)
    const item: PageSeo = {
      ...rest,
      ...(row.tieuDe ? { tieuDe: row.tieuDe } : {}),
      ...(row.moTa ? { moTa: row.moTa } : {}),
      ...(row.anh?.src ? { anh: row.anh } : {}),
      ...(hidden ? { anGoogle: true } : {}),
    }
    if (item.tieuDe || item.moTa || item.anh || item.anGoogle) map.set(path, item)
    else map.delete(path)
  }
  return map
})()

/** SEO Ecopillo điền cho một trang (link có hoặc không có "/" cuối) */
export const pageSeoFor = (pathname: string): PageSeo | undefined => SEO.get(withSlash(pathname.toLowerCase()))
