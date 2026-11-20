import { chu, definePageText, doan, dsCap } from './define'

/** Chữ trang Quà tặng và sự kiện (quà doanh nghiệp, sự kiện, thư cảm ơn sửa ở bộ riêng của chúng) */
export const { set: GIFTS_TEXT_SET, text: GIFTS_TEXT } = definePageText(
  'qua-tang',
  'Trang Quà tặng và sự kiện',
  'Tiêu đề, đoạn dẫn, gợi ý chọn quà theo dịp, dịch vụ tặng quà của trang Quà tặng và sự kiện.',
  {
    // Mô tả viết tay 08/11/2026 (C2)
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Hộp quà chăn ga Ecopillo cho doanh nghiệp, sự kiện, quà cưới, tân gia, biếu Tết. Thư cảm ơn kèm ưu đãi 5% cho đơn tiếp theo.',
    ),
    nhan: chu('Đầu trang: nhãn nhỏ', 'Quà tặng và sự kiện'),
    tieuDe: chu('Đầu trang: tiêu đề', 'Món quà cho | những giấc ngủ thương yêu', 'Dấu | là chỗ xuống dòng (máy tính)'),
    danDat: doan(
      'Đầu trang: đoạn dẫn',
      'Ecopillo gửi kèm thư cảm ơn và ưu đãi 5% cho đơn hàng tiếp theo. Và một bộ chăn ga đẹp cũng là món quà được dùng mỗi ngày, nhắc người nhận nhớ tới Quý khách.',
    ),
    nutDau: chu('Đầu trang: chữ nút', 'Xem thư cảm ơn'),
    dipNhan: chu('Chọn quà: nhãn nhỏ', 'Gợi ý chọn quà'),
    dipTieuDe: chu('Chọn quà: tiêu đề', 'Chọn theo từng dịp'),
    dip: dsCap(
      'Chọn quà: 3 dịp (bộ sưu tập gợi ý giữ theo thứ tự)',
      ['title', 'text'],
      ['Tên dịp', 'Câu gợi ý'],
      [
        { title: 'Quà cưới', text: 'Bộ chăn ga dệt Jacquard hoa văn nổi hoặc dòng cao nhất, cho căn phòng đầu tiên của đôi vợ chồng trẻ.' },
        { title: 'Quà tân gia', text: 'Nhiều mẫu, nhiều màu để hợp với phòng ngủ mới. Có thể nhờ Ecopillo tư vấn theo ảnh phòng.' },
        { title: 'Biếu cha mẹ, dịp Tết', text: 'Màu trơn, sắc nhã, vải mềm mát dễ chịu cho người lớn tuổi; kèm ruột gối êm nâng đỡ cổ vai.' },
      ],
      'Đúng 3 dòng: cưới (Doris, Sweet), tân gia (Rosa, Vera), biếu (Tera, Liora)',
    ),
    dichVuNhan: chu('Dịch vụ: nhãn nhỏ', 'Tặng dễ dàng'),
    dichVuTieuDe: chu('Dịch vụ: tiêu đề', 'Ecopillo lo phần còn lại'),
    dichVuNutGoi: chu('Dịch vụ: chữ nút gọi', 'Gọi tư vấn quà'),
    dichVu: dsCap(
      'Dịch vụ: 3 ô',
      ['title', 'text'],
      ['Tên', 'Mô tả'],
      [
        { title: 'Hộp đóng gói chỉn chu', text: 'Mỗi bộ đều đóng hộp, sẵn sàng để tặng.' },
        { title: 'Giao tận tay người nhận', text: 'Ghi địa chỉ người nhận khi đặt, nhân viên gọi xác nhận trước khi giao.' },
        { title: 'Chưa rõ cỡ giường?', text: 'Gọi Ecopillo hỏi cách đo, hoặc đổi cỡ trong 7 ngày nếu chưa sử dụng.' },
      ],
      'Biểu tượng theo thứ tự: hộp, xe giao, thước',
    ),
  },
)
