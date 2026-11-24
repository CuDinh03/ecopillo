import { liveList, type EditableField, type EditableImage, type EditableSet } from './liveContent'
import { isPagePath, liveCategorySeo } from './liveData'

/**
 * Tiêu đề, mô tả trên Google và ảnh chia sẻ của từng trang, Ecopillo tự điền (đợt E 24/11/2026: "khách muốn thêm SEO",
 * "khách được tuỳ chỉnh toàn bộ bằng wp-admin tất cả các chỗ").
 *
 * Hai nơi điền, ưu tiên theo thứ tự:
 * 1. Nội dung web → Giao diện → "SEO từng trang": một dòng mỗi trang (link, tiêu đề, mô tả, ảnh chia sẻ), cho mọi trang.
 * 2. Trang sửa danh mục WooCommerce (ô SEO của plugin, hoặc khung Yoast SEO): cho trang danh mục (plugin danh-muc.php).
 * Ô để trống thì trang giữ tiêu đề, mô tả sẵn có. Máy chủ cũng ghi các thẻ này vào HTML trả về (plugin trang-wp.php),
 * nên Google, Facebook, Zalo đọc được ngay mà không cần chạy JavaScript.
 */

export interface PageSeo {
  /** Tiêu đề đầy đủ của tab / Google (không tự thêm "· Ecopillo") */
  tieuDe?: string
  moTa?: string
  anh?: EditableImage
}

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
]

export const SEO_SET: EditableSet = {
  khoa: 'seo-tung-trang',
  coTheTrong: true,
  nhom: 'Giao diện',
  ten: 'SEO từng trang',
  moTa:
    'Tiêu đề, mô tả trên Google và ảnh khi chia sẻ của từng trang. Mỗi dòng một trang; ô để trống thì trang giữ chữ sẵn có. ' +
    'Trang danh mục sản phẩm cũng điền được ngay ở Sản phẩm → Danh mục (ô SEO hoặc khung Yoast SEO); dòng ở đây đứng trên.',
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
}

const ROWS = liveList<SeoRow>(SEO_SET.khoa, [], FIELDS, () => ({ duongDan: '' }))

const withSlash = (path: string): string => (path.endsWith('/') ? path : `${path}/`)

const SEO: ReadonlyMap<string, PageSeo> = (() => {
  const map = new Map<string, PageSeo>(Object.entries(liveCategorySeo()))
  for (const row of ROWS) {
    const path = withSlash(row.duongDan.trim().toLowerCase())
    if (path !== '/' && !isPagePath(path)) continue
    const item: PageSeo = {
      ...map.get(path),
      ...(row.tieuDe ? { tieuDe: row.tieuDe } : {}),
      ...(row.moTa ? { moTa: row.moTa } : {}),
      ...(row.anh?.src ? { anh: row.anh } : {}),
    }
    if (item.tieuDe || item.moTa || item.anh) map.set(path, item)
  }
  return map
})()

/** SEO Ecopillo điền cho một trang (link có hoặc không có "/" cuối) */
export const pageSeoFor = (pathname: string): PageSeo | undefined => SEO.get(withSlash(pathname.toLowerCase()))
