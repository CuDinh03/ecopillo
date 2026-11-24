import { anh, chu, definePageText, doan, dsCap, dsDong, type PageImage } from './define'

/** Ảnh quà tặng doanh nghiệp (Ecopillo gửi 27/10/2026, ảnh vuông, nén bằng tools/nen-anh-qua-tang-2026-10-27.py) */
const giftImage = (key: string, alt: string): PageImage => ({
  src: `/images/qua-tang/${key}.webp`,
  srcSet: `/images/qua-tang/${key}-sm.webp 520w, /images/qua-tang/${key}.webp 1000w`,
  alt,
})

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
    duongDan: chu('Đường dẫn đầu trang: tên trang', 'Quà tặng và sự kiện'),
    nhan: chu('Đầu trang: nhãn nhỏ', 'Quà tặng và sự kiện'),
    tieuDe: chu('Đầu trang: tiêu đề', 'Món quà cho | những giấc ngủ thương yêu', 'Dấu | là chỗ xuống dòng (máy tính)'),
    danDat: doan(
      'Đầu trang: đoạn dẫn',
      'Ecopillo gửi kèm thư cảm ơn và ưu đãi 5% cho đơn hàng tiếp theo. Và một bộ chăn ga đẹp cũng là món quà được dùng mỗi ngày, nhắc người nhận nhớ tới Quý khách.',
    ),
    nutDau: chu('Đầu trang: chữ nút', 'Xem thư cảm ơn'),
    quaGiaTu: chu('Quà doanh nghiệp: chữ trước giá', 'từ'),
    anhQuangCao: anh(
      'Quà doanh nghiệp: ảnh quảng cáo lớn (hiện trọn, không chú thích)',
      giftImage('goi-qua-tet-doanh-nghiep', 'Gói quà Tết cho doanh nghiệp: hộp quà chăn ga gối đệm cao cấp Ecopillo, giá chỉ từ 99K'),
      'Ảnh vuông',
    ),
    anhBen1: anh('Quà doanh nghiệp: ảnh nhỏ thứ nhất cạnh ảnh lớn', giftImage('qua-tang-vtv3', 'Cầm hộp quà Ecopillo và thư đồng hành cùng VTV3 tại sảnh Đài Truyền hình'), 'Ảnh vuông'),
    anhBen2: anh('Quà doanh nghiệp: ảnh nhỏ thứ hai cạnh ảnh lớn', giftImage('qua-tang-pickleball', 'Vận động viên giải VTV3 Pickleball cầm túi quà Ecopillo'), 'Ảnh vuông'),
    anhThem1: anh('Quà doanh nghiệp: hàng ảnh dưới, ảnh 1', giftImage('tui-qua', 'Túi quà Ecopillo màu hồng xếp sẵn để trao'), 'Ảnh vuông'),
    anhThem2: anh('Quà doanh nghiệp: hàng ảnh dưới, ảnh 2', giftImage('hop-qua-xep-chong', 'Hộp quà chăn ga gối đệm cao cấp Ecopillo xếp chồng, kèm thư VTV3'), 'Ảnh vuông'),
    anhThem3: anh('Quà doanh nghiệp: hàng ảnh dưới, ảnh 3', giftImage('trao-qua-showroom-1', 'Trao hộp quà Ecopillo cho một đoàn khách tại phòng trưng bày'), 'Ảnh vuông'),
    anhThem4: anh('Quà doanh nghiệp: hàng ảnh dưới, ảnh 4', giftImage('trao-qua-showroom-2', 'Đoàn khách nhận quà Ecopillo tại phòng trưng bày'), 'Ảnh vuông'),
    chuThichAnh: dsDong(
      'Quà doanh nghiệp: chú thích đè dưới ảnh (6 dòng)',
      [
        'Quà tặng đồng hành cùng VTV3',
        'Quà tặng tại giải VTV3 Pickleball',
        'Túi quà Ecopillo',
        'Hộp quà chăn ga gối đệm cao cấp',
        'Trao quà tại phòng trưng bày Ecopillo',
        'Đoàn khách nhận quà Ecopillo',
      ],
      'Thứ tự: hai ảnh nhỏ cạnh ảnh lớn, rồi 4 ảnh hàng dưới. Dòng để trống: ảnh đó không có chú thích',
    ),
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
