import { liveObject, type EditableField } from './liveContent'

/**
 * Khoá lưu trong WordPress của 3 bài viết dựng sẵn trong code (src/data/posts.ts), Ecopillo sửa ở Nội dung web → "Bài viết dựng sẵn".
 * Tách riêng khỏi posts.ts để links.ts (chuyển link bài đã ẩn về trang Tin tức) đọc được mà không vòng import
 * (posts.ts dùng productsUrl của links.ts).
 * Plugin (trang-wp.php, eco_tw_code_posts) nhận bộ bài theo đúng tiền tố này: đổi tiền tố là mất phần Ecopillo đã sửa.
 */

/** Bộ thông tin bài: tiêu đề, giới thiệu, ảnh bìa, Hiện / Ẩn… */
export const codePostKey = (slug: string): string => `bai-dung-san-${slug}`
/** Bộ thân bài: danh sách khối (đoạn văn, tiêu đề mục, danh sách, ảnh…) */
export const codePostBodyKey = (slug: string): string => `than-bai-dung-san-${slug}`

export const CODE_POST_SHOW_FIELD: EditableField = {
  khoa: 'hien',
  nhan: 'Trên web',
  kieu: 'chon',
  batBuoc: true,
  luaChon: ['co', 'khong'],
  nhanLuaChon: ['Hiện', 'Ẩn'],
  goiY: 'Ẩn: bài không còn ở trang Tin tức, ô tìm kiếm, bài liên quan; link bài chuyển (301) về trang Tin tức.',
}

const hiddenCache = new Map<string, boolean>()

/** Bài dựng sẵn Ecopillo đã chọn "Ẩn" (tên bài lạ thì luôn false) */
export const isCodePostHidden = (slug: string): boolean => {
  const cached = hiddenCache.get(slug)
  if (cached !== undefined) return cached
  const hidden = liveObject(codePostKey(slug), { hien: 'co' }, [CODE_POST_SHOW_FIELD]).hien === 'khong'
  hiddenCache.set(slug, hidden)
  return hidden
}
