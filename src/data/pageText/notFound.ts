import { chu, definePageText, dsDong } from './define'

/**
 * Nhãn, nút, bốn lối đi tiếp của trang báo lỗi 404 (biên bản mục 07: không để khách kẹt ở trang lỗi).
 * Tiêu đề, đoạn của trang ở bộ "Chữ chung nhiều trang" (loi404TieuDe, loi404Chu).
 */
export const { set: NOT_FOUND_TEXT_SET, text: NOT_FOUND_TEXT } = definePageText(
  'loi-404',
  'Trang báo lỗi 404',
  'Nhãn nhỏ, bốn link gợi ý, nút về trang chủ của trang báo lỗi 404. Tiêu đề, đoạn chữ ở bộ "Chữ chung nhiều trang".',
  {
    nhan: chu('Nhãn nhỏ trên tiêu đề', 'Lỗi 404'),
    goiY: dsDong(
      'Bốn link gợi ý (đường link giữ theo thứ tự)',
      ['Sản phẩm', 'Tin tức, cẩm nang', 'Hỏi đáp, chính sách', 'Liên hệ'],
      'Thứ tự: Sản phẩm, Tin tức, Hỏi đáp, Liên hệ. Dòng để trống thì bỏ link đó',
    ),
    nutTrangChu: chu('Chữ nút về trang chủ', 'Về trang chủ'),
  },
)
