import { chu, definePageText, doan, dsDong } from './define'

/**
 * Chữ trang Liên hệ mua hàng (số điện thoại, Zalo, email, văn phòng ở bộ Thông tin liên hệ; điểm bán ở bộ Đại lý).
 * Nhãn hai ô số: chị Phương (Zalo 17/11/2026) "Số 678 là bán lẻ, 072 là mở đại lý".
 */
export const { set: CONTACT_PAGE_TEXT_SET, text: CONTACT_PAGE_TEXT } = definePageText(
  'lien-he',
  'Trang Liên hệ mua hàng',
  'Tiêu đề, đoạn dẫn, nhãn các ô liên hệ, mục Hỏi nhanh, form tin nhắn của trang Liên hệ mua hàng.',
  {
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Hotline, Zalo, email, văn phòng Hà Nội, chi nhánh TP. HCM cùng hệ thống đại lý Ecopillo trên toàn quốc. Gửi tin nhắn, Ecopillo gọi lại trong giờ làm việc.',
    ),
    nhan: chu('Đầu trang: nhãn nhỏ', 'Liên hệ mua hàng'),
    tieuDe: chu('Đầu trang: tiêu đề', 'Ecopillo luôn | lắng nghe Quý khách', 'Dấu | là chỗ xuống dòng'),
    danDat: doan(
      'Đầu trang: đoạn dẫn',
      'Gọi, nhắn tin, ghé văn phòng hoặc tìm đại lý gần nhất. Bộ phận Chăm sóc khách hàng của Ecopillo Việt Nam phản hồi trong giờ làm việc.',
    ),
    nhanSoMuaHang: chu('Ô số thứ hai: nhãn', 'Mua hàng'),
    nhanSoDaiLy: chu('Ô Zalo / hotline: nhãn', 'Mở đại lý'),
    hoiNhanhTieuDe: chu('Hỏi nhanh: tiêu đề', 'Hỏi nhanh'),
    hoiNhanh: dsDong(
      'Hỏi nhanh: 5 dòng (đường link giữ theo thứ tự)',
      ['Giao hàng, kiểm hàng khi nhận', 'Kiểm hàng, đổi hàng', 'Bảo hành sản phẩm', 'Chăn ga cho khách sạn, nhà nghỉ', 'Câu hỏi thường gặp'],
      'Thứ tự: giao hàng, đổi hàng, bảo hành, khách sạn, hỏi đáp',
    ),
    theoDoi: chu('Hỏi nhanh: chữ trên hàng mạng xã hội', 'Theo dõi Ecopillo'),
    tinNhanNhan: chu('Form tin nhắn: nhãn nhỏ', 'Để lại lời nhắn'),
    tinNhanTieuDe: chu('Form tin nhắn: tiêu đề', 'Gửi tin nhắn cho chúng tôi'),
    tinNhanChu: doan('Form tin nhắn: đoạn dẫn', 'Chọn điều Quý khách cần, Ecopillo sẽ chuyển đúng người gọi lại.'),
    tinNhanViDu: doan('Form tin nhắn: chữ mờ ví dụ', 'Ví dụ: giường 1m8 × 2m, muốn tư vấn mẫu mát cho mùa hè…'),
    tinNhanNut: chu('Form tin nhắn: chữ nút gửi', 'Gửi tin nhắn'),
    daNhanTieuDe: chu('Sau khi gửi: tiêu đề', 'Ecopillo đã nhận tin nhắn'),
  },
)
