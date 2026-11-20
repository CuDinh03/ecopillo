import { chu, definePageText, doan } from './define'

/** Chữ dùng ở nhiều trang: cuối trang chính sách, bài viết, điểm bán, trang sản phẩm, bộ sưu tập, trang lỗi */
export const { set: COMMON_TEXT_SET, text: COMMON_TEXT } = definePageText(
  'chung',
  'Chữ chung nhiều trang',
  'Các câu lặp ở nhiều trang: khối "Còn điều chưa rõ?" cuối trang chính sách, "Cần tư vấn thêm?" cuối bài viết, phần tìm điểm bán, trang sản phẩm, bộ sưu tập, trang báo lỗi 404.',
  {
    chinhSachNhan: chu('Trang chính sách: nhãn nhỏ trên tên trang', 'Chính sách mua hàng'),
    conChuaRo: chu('Trang chính sách: tiêu đề khối cuối', 'Còn điều chưa rõ?'),
    conChuaRoChu: chu('Trang chính sách: câu khối cuối', 'Gọi hoặc nhắn Zalo, Ecopillo trả lời ngay trong giờ làm việc.'),
    canTuVan: chu('Bài viết: tiêu đề khối cuối', 'Cần tư vấn thêm?'),
    canTuVanChu: chu('Bài viết: câu khối cuối', 'Gửi ảnh phòng, số đo giường qua Zalo, Ecopillo gợi ý mẫu hợp nhất.'),
    diemBanNhan: chu('Điểm bán: nhãn nhỏ (trang Liên hệ)', 'Điểm bán'),
    diemBanTieuDe: chu('Điểm bán: tiêu đề', 'Tìm Ecopillo gần Quý khách'),
    diemBanChu: chu('Điểm bán: câu dưới tiêu đề', 'Nằm thử gối, đệm và chạm tay vào vải Lyocell.'),
    chuaCoDaiLy: doan(
      'Điểm bán: câu khi khu vực chưa có đại lý',
      'Ecopillo giao hàng toàn quốc, miễn phí giao từ 500.000đ. Nhắn Zalo để được tư vấn mẫu qua video.',
    ),
    theSanPham: chu('Thẻ sản phẩm: dòng dưới giá', 'Đặt online, nhân viên gọi xác nhận'),
    spDatMua: doan('Trang sản phẩm: dòng dưới nút Đặt mua', 'Đặt online, nhân viên gọi xác nhận trước khi giao. Thanh toán chuyển khoản vào tài khoản Ecopillo.'),
    spNamThu: chu('Trang sản phẩm: chữ trước link tìm đại lý', 'Muốn nằm thử trước?'),
    spHieuKy: chu('Trang sản phẩm: tiêu đề phần thông tin dài', 'Hiểu kỹ trước khi chọn'),
    spCoTheThich: chu('Trang sản phẩm: tiêu đề sản phẩm gợi ý', 'Có thể Quý khách thích'),
    quaBoSuuTap: chu('Bộ sưu tập: chữ sau tên quà kèm', 'cho mỗi bộ, chương trình Tri ân 15.000 khách hàng.'),
    loi404TieuDe: chu('Trang 404: tiêu đề', 'Trang này đã đi ngủ mất rồi'),
    loi404Chu: doan('Trang 404: đoạn', 'Đường dẫn không tồn tại hoặc đã được đổi. Quý khách thử một trong các trang dưới đây.'),
  },
)
