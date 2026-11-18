import { CONTACT } from './brand'

/**
 * Thanh toán, đặt cọc, trải nghiệm chăn ga tại nhà: theo THÔNG BÁO Ecopillo áp dụng từ 07/08/2026 (chị Phương gửi Zalo 18/11/2026),
 * cùng tin chị Phương cùng ngày: "Giờ đang k cho dùng tiền mặt", "Bên chị chỉ thanh toán duy nhất 1 tài khoản".
 * Đè biên bản chốt mục 35, 36, 50 (thu tiền khi nhận, COD toàn quốc, không chuyển khoản trước).
 * [XÁC NHẬN mức đặt cọc, lúc đặt cọc] — thông báo không ghi; web chỉ nói nhân viên báo khi gọi xác nhận đơn.
 * Một chỗ cho các câu dùng lại (trang chính sách, hỏi đáp, trang sản phẩm, bước đặt hàng) để không lệch nhau.
 */

export const BANK_LINE = `${CONTACT.chuTaiKhoan} · Số tài khoản ${CONTACT.soTaiKhoan} · ${CONTACT.nganHang}`

export const NO_DEPOSIT = 'Không cần đặt cọc: chăn ga tiêu chuẩn hoặc hoá đơn chăn ga dưới 10 triệu đồng.'

export const DEPOSIT_CASES: readonly string[] = [
  'Chăn ga kích thước nhỡ cỡ.',
  'Chăn ga may theo kích thước hoặc yêu cầu riêng.',
  'Sản phẩm cần chỉnh sửa theo yêu cầu của khách.',
  'Toàn bộ các sản phẩm đệm.',
  'Đơn hàng giá trị lớn trên 10.000.000 đồng.',
]

export const DEPOSIT_SHORT = 'Đệm, đơn trên 10 triệu, chăn ga nhỡ cỡ hoặc may riêng cần đặt cọc'

export const HOME_TRIAL = 'Trải nghiệm chăn ga tại nhà: Hà Nội, TP. HCM mọi đơn hàng; tỉnh thành khác đơn từ 20.000.000 đồng.'
