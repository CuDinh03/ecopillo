import { chu, definePageText, doan } from './define'

/** Chữ trang Hỏi đáp (câu hỏi, câu trả lời sửa ở bộ Hỏi đáp) */
export const { set: FAQ_PAGE_TEXT_SET, text: FAQ_PAGE_TEXT } = definePageText(
  'hoi-dap',
  'Trang Hỏi đáp',
  'Tiêu đề, đoạn dẫn, mô tả Google của trang Hỏi đáp. Câu hỏi và câu trả lời sửa ở bộ Hỏi đáp.',
  {
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Câu hỏi thường gặp khi mua chăn ga gối đệm Ecopillo: giao hàng, kiểm hàng, đổi hàng, thanh toán, đặt cọc, may theo kích thước, bảo hành.',
    ),
    nhan: chu('Nhãn nhỏ trên tiêu đề', 'Hỏi đáp'),
    tieuDe: chu('Tiêu đề', 'Mua sắm an tâm | với Ecopillo', 'Dấu | là chỗ xuống dòng'),
    danDat: doan('Đoạn dẫn', 'Những câu Quý khách hỏi nhiều nhất về giao hàng, kiểm hàng, đổi hàng, thanh toán và bảo hành.'),
    khoiTieuDe: chu('Tiêu đề cột trái phần câu hỏi', 'Câu trả lời nhanh'),
    khoiDanDat: doan('Đoạn dưới tiêu đề cột trái', 'Chưa thấy câu trả lời Quý khách cần? Gọi hoặc nhắn Zalo, Ecopillo phản hồi ngay.'),
  },
)
