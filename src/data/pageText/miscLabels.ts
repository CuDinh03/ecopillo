import type { BrandEvent } from '../events'
import type { PostLabel } from '../postSections'
import { chu, definePageText } from './define'

/**
 * Nhãn nhỏ dựng sẵn trong dữ liệu: loại sự kiện (events.ts) và mục bài viết (postSections.ts) (owner 24/11/2026: "khách tự sửa
 * mọi chi tiết"). Mã giữ nguyên (ô "Nhãn" của sự kiện, ô "Mục trên web" của bài, tham số ?chu-de= trên link): chỉ chữ hiện ra đổi.
 */
export const { set: MISC_LABELS_SET, text: MISC_LABELS } = definePageText(
  'nhan-su-kien-bai-viet',
  'Nhãn loại sự kiện, mục bài viết',
  'Chữ nhãn nhỏ trên thẻ sự kiện (trang chủ, trang Quà tặng và sự kiện) và tên các mục bài viết (nút lọc trang Tin tức, nhãn trên thẻ bài, đầu bài viết).',
  {
    suKienThienNguyen: chu('Sự kiện loại "Thiện nguyện": chữ nhãn', 'Thiện nguyện', 'Loại sự kiện chọn ở bộ "Sự kiện"; ở đây chỉ đổi chữ hiện trên thẻ.'),
    suKienDongHanh: chu('Sự kiện loại "Đồng hành": chữ nhãn', 'Đồng hành'),
    suKienHoiThao: chu('Sự kiện loại "Hội thảo": chữ nhãn', 'Hội thảo'),
    suKienGiaiThuong: chu('Sự kiện loại "Giải thưởng": chữ nhãn', 'Giải thưởng'),
    suKienKhaiTruong: chu('Sự kiện loại "Khai trương": chữ nhãn', 'Khai trương'),

    mucTinTuc: chu('Mục "Tin tức": tên', 'Tin tức', 'Nút lọc trang Tin tức, nhãn trên thẻ bài, đầu bài viết. Mục của bài chọn ở ô "Mục trên web" khi soạn bài.'),
    mucCamNang: chu('Mục "Cẩm nang" (mọi bài kiến thức): tên', 'Cẩm nang'),
    mucChonChanGa: chu('Chủ đề Cẩm nang "Chọn chăn ga gối đệm": tên', 'Chọn chăn ga gối đệm'),
    mucGiacNgu: chu('Chủ đề Cẩm nang "Giấc ngủ và sức khoẻ": tên', 'Giấc ngủ và sức khoẻ'),
    mucPhongNgu: chu('Chủ đề Cẩm nang "Phòng ngủ và phong thuỷ": tên', 'Phòng ngủ và phong thuỷ'),
    mucCuoiHoi: chu('Chủ đề Cẩm nang "Cưới hỏi, lễ tết": tên', 'Cưới hỏi, lễ tết'),
  },
)

const EVENT_KIND_TEXT: Readonly<Record<BrandEvent['kind'], string>> = {
  'Thiện nguyện': MISC_LABELS.suKienThienNguyen,
  'Đồng hành': MISC_LABELS.suKienDongHanh,
  'Hội thảo': MISC_LABELS.suKienHoiThao,
  'Giải thưởng': MISC_LABELS.suKienGiaiThuong,
  'Khai trương': MISC_LABELS.suKienKhaiTruong,
}

/** Chữ hiện của một loại sự kiện (mã loại là chữ gốc, giữ nguyên trong dữ liệu) */
export const eventKindText = (kind: BrandEvent['kind']): string => EVENT_KIND_TEXT[kind] ?? kind

const POST_LABEL_TEXT: Readonly<Record<PostLabel, string>> = {
  'Tin tức': MISC_LABELS.mucTinTuc,
  'Cẩm nang': MISC_LABELS.mucCamNang,
  'Chọn chăn ga gối đệm': MISC_LABELS.mucChonChanGa,
  'Giấc ngủ và sức khoẻ': MISC_LABELS.mucGiacNgu,
  'Phòng ngủ và phong thuỷ': MISC_LABELS.mucPhongNgu,
  'Cưới hỏi, lễ tết': MISC_LABELS.mucCuoiHoi,
}

/** Chữ hiện của một mục bài viết; mã mục (chữ gốc) vẫn dùng để lọc và trên link ?chu-de= */
export const postLabelText = (label: PostLabel): string => POST_LABEL_TEXT[label] ?? label
