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
    duongDanTrangChu: chu('Đường dẫn đầu trang: chữ "Trang chủ"', 'Trang chủ'),
    duongDan: chu('Đường dẫn đầu trang: tên trang', 'Liên hệ mua hàng'),
    nhan: chu('Đầu trang: nhãn nhỏ', 'Liên hệ mua hàng'),
    tieuDe: chu('Đầu trang: tiêu đề', 'Ecopillo luôn | lắng nghe Quý khách', 'Dấu | là chỗ xuống dòng'),
    danDat: doan(
      'Đầu trang: đoạn dẫn',
      'Gọi, nhắn tin, ghé văn phòng hoặc tìm đại lý gần nhất. Bộ phận Chăm sóc khách hàng của Ecopillo Việt Nam phản hồi trong giờ làm việc.',
    ),
    diaChiNhan: chu('Đầu trang: chữ trước địa chỉ', 'Địa chỉ:'),
    moCua: chu('Đầu trang: dòng giờ mở cửa', 'Mở cửa {gio}', '{gio} là giờ mở cửa ở bộ Thông tin liên hệ'),
    hotlineNhan: chu('Ô hotline: nhãn', 'Hotline'),
    hotlineDong: chu('Ô hotline: dòng dưới số', '{gio} · có Zalo', '{gio} là giờ mở cửa ở bộ Thông tin liên hệ'),
    nhanSoMuaHang: chu('Ô số thứ hai: nhãn', 'Mua hàng'),
    nhanSoDaiLy: chu('Ô Zalo / hotline: nhãn', 'Mở đại lý'),
    nhanMessenger: chu('Ô Messenger: nhãn', 'Messenger'),
    nhanEmail: chu('Ô email: nhãn', 'Email'),
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
    // Thứ tự cố định theo mã chủ đề trong code (TOPICS ở MessageForm.tsx): đổi chữ hiện trên nút, mã gửi đi giữ nguyên
    chuDe: dsDong(
      'Form tin nhắn: 6 chủ đề (giữ đúng thứ tự)',
      ['Tư vấn chọn mẫu', 'Hỏi về đơn hàng', 'Bảo hành, đổi hàng', 'Khách sạn, nhà nghỉ', 'Đăng ký mở đại lý', 'Khác'],
      'Thứ tự: tư vấn mẫu, đơn hàng, bảo hành, khách sạn, mở đại lý, khác. Chỉ đổi chữ hiện trên nút',
    ),
    chuDeNhan: chu('Form tin nhắn: nhãn ô chủ đề', 'Quý khách cần'),
    hoTenNhan: chu('Form tin nhắn: nhãn ô họ tên', 'Họ tên'),
    hoTenViDu: chu('Form tin nhắn: chữ mờ ô họ tên', 'Nguyễn Thị Lan'),
    soDienThoaiNhan: chu('Form tin nhắn: nhãn ô số điện thoại', 'Số điện thoại'),
    soDienThoaiViDu: chu('Form tin nhắn: chữ mờ ô số điện thoại', '09xx xxx xxx'),
    noiDungNhan: chu('Form tin nhắn: nhãn ô nội dung', 'Nội dung yêu cầu'),
    loiHoTen: chu('Form tin nhắn: báo lỗi họ tên', 'Vui lòng nhập họ tên.'),
    loiSoDienThoai: chu('Form tin nhắn: báo lỗi số điện thoại', 'Số điện thoại chưa đúng, ví dụ {so}.', '{so} là hotline ở bộ Thông tin liên hệ'),
    loiNoiDung: chu('Form tin nhắn: báo lỗi nội dung', 'Quý khách vui lòng ghi ngắn gọn điều cần hỏi.'),
    baoMatTruoc: chu('Form tin nhắn: câu bảo mật (trước link)', 'Ecopillo chỉ dùng thông tin này để liên hệ lại, theo'),
    baoMatLink: chu('Form tin nhắn: câu bảo mật (chữ link)', 'chính sách bảo vệ thông tin'),
    dangGui: chu('Form tin nhắn: chữ nút khi đang gửi', 'Đang gửi…'),
    daNhanTieuDe: chu('Sau khi gửi: tiêu đề', 'Ecopillo đã nhận tin nhắn'),
    daNhanChu: doan(
      'Sau khi gửi: câu cảm ơn',
      'Cảm ơn {ten}. Bộ phận Chăm sóc khách hàng sẽ gọi lại số {so} trong giờ làm việc ({gio}).',
      '{ten} là họ tên, {so} là số điện thoại Quý khách ghi, {gio} là giờ mở cửa',
    ),
    daNhanChuDe: chu('Sau khi gửi: dòng chủ đề', 'Chủ đề: {chuDe}', '{chuDe} là chủ đề Quý khách chọn'),
    daNhanNut: chu('Sau khi gửi: chữ nút gửi tin khác', 'Gửi tin nhắn khác'),
  },
)
