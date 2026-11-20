import { anh, chu, definePageText, doan, doanNhieu, dsCap } from './define'

/**
 * Chữ, ảnh riêng của trang Giới thiệu. Câu chuyện, thư người sáng lập, triết lý, sứ mệnh, tầm nhìn, con số ở bộ "Giới thiệu";
 * giá trị cốt lõi, chứng nhận, quy trình ở bộ "Giới thiệu: giá trị, chứng nhận, quy trình".
 */
export const { set: ABOUT_PAGE_TEXT_SET, text: ABOUT_PAGE_TEXT } = definePageText(
  'gioi-thieu',
  'Trang Giới thiệu',
  'Phần đầu trang, mục lục, tên các chương, câu trích, ảnh, lời kết của trang Giới thiệu.',
  {
    // Mô tả viết tay 08/11/2026 (C2): dưới 160 ký tự để Google không cắt
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Hơn 15 năm làm chăn ga gối đệm, triết lý Tốt · Thật · Thiện, vải Lyocell, chứng nhận ISO 9001:2015 và TQC. Câu chuyện của Ecopillo.',
    ),
    chuThichAnh: chu('Đầu trang: chú thích trên ảnh', 'Chị Phạm Thị Phương tại VTV3'),
    nhan: chu('Đầu trang: nhãn nhỏ', 'Câu chuyện Ecopillo'),
    // Chị Phương 19/11/2026 ("Phần giới thiệu sửa lại giúp c"), giữ nguyên văn
    tieuDe: chu('Đầu trang: tiêu đề', 'Hành trình kiến tạo Chốn Yên'),
    tieuDePhu: chu('Đầu trang: câu dưới tiêu đề', 'Từ tâm huyết với giấc ngủ Việt đến khát vọng nâng niu hàng triệu giấc mơ.'),
    gioiThieu: doanNhieu('Đầu trang: đoạn giới thiệu', [
      'Ecopillo Eternal Việt Nam ra đời với niềm tin rằng một giấc ngủ chất lượng không chỉ bắt đầu từ chiếc giường êm ái, mà còn từ sự an tâm về chất liệu, sự chỉn chu trong từng sản phẩm và tình yêu dành cho mỗi gia đình.',
      'Theo đuổi những giá trị bền vững trong ngành chăn ga gối đệm, Ecopillo không ngừng lựa chọn, cải tiến và phát triển các sản phẩm từ chất liệu thân thiện, mang đến sự nâng niu trong từng trải nghiệm nghỉ ngơi.',
      'Bởi chúng tôi tin rằng, mỗi gia đình đều xứng đáng có một Chốn Yên – nơi yêu thương sum vầy, cơ thể được tái tạo năng lượng và những giấc mơ được nâng niu.',
    ]),
    kyTen: chu('Đầu trang: dòng ký tên', 'Ecopillo – Nâng niu giấc mơ xanh'),
    mucLoiMo: chu('Mục lục: dòng lời mở', 'Lời mở: một giấc ngủ không trọn'),
    mucThu: chu('Mục lục: dòng thư người sáng lập', 'Chia sẻ từ người sáng lập'),
    mucLoiKet: chu('Mục lục: dòng lời kết', 'Lời kết: mời Quý khách ghé thăm'),
    chuong: dsCap(
      'Sáu chương (I đến VI): nhãn nhỏ và tên chương',
      ['nhan', 'ten'],
      ['Nhãn nhỏ', 'Tên chương (cũng là dòng mục lục)'],
      [
        { nhan: 'Người sáng lập', ten: 'Người làm nghề' },
        { nhan: 'Khát vọng', ten: 'Chốn Yên' },
        // Tên chương theo web cũ (khách 05/11/2026: "triết lý kinh doanh")
        { nhan: 'Tốt · Thật · Thiện', ten: 'Triết lý kinh doanh' },
        { nhan: 'Chất liệu và tay nghề', ten: 'Từ sợi gỗ đến giấc ngủ' },
        { nhan: 'Sứ mệnh, tầm nhìn', ten: 'Điều chúng tôi theo đuổi' },
        { nhan: 'Chứng nhận, đối tác', ten: 'Được ghi nhận' },
      ],
      'Đúng 6 dòng, theo thứ tự chương I đến VI',
    ),
    nguoiSangLap: doan(
      'Chương I: đoạn về người sáng lập',
      'Người đặt nền móng cho thương hiệu là chị Phạm Thị Phương, hơn 15 năm trong nghề chăn ga, từ sản xuất đến bán lẻ. Chị luôn trăn trở làm sao để mỗi sản phẩm giúp khách hàng tạo dựng một “Chốn Yên”.',
      'Tên "chị Phạm Thị Phương" tự in đậm',
    ),
    chonYen: doan('Chương II: câu định nghĩa Chốn Yên', '“Chốn Yên”: nơi giấc ngủ lành mạnh được vun đắp và cơ thể được phục hồi trọn vẹn.'),
    anhChonYen: anh('Chương II: ảnh', {
      src: '/images/patterns/ED25.webp',
      srcSet: '/images/patterns/ED25-sm.webp 640w, /images/patterns/ED25.webp 1600w',
      alt: 'Phòng ngủ trải bộ chăn ga Eco Doris ED25',
    }),
    chuThichChonYen: chu('Chương II: chú thích ảnh', 'Một Chốn Yên: phòng ngủ trải bộ Eco Doris ED25.'),
    anhChatLieu1: anh('Chương IV: ảnh chất liệu trái', { src: '/images/details/lyocell-et01.webp', srcSet: '', alt: 'Cận mặt vải Lyocell trơn bộ Eco Tera ET01' }),
    anhChatLieu2: anh('Chương IV: ảnh chất liệu phải', { src: '/images/details/theu-ed25.webp', srcSet: '', alt: 'Cận đường thêu bộ Eco Doris ED25' }),
    phimNhan: chu('Phim: nhãn nhỏ (tiêu đề, câu dẫn ở bộ Phim thương hiệu)', 'Phim thương hiệu'),
    suMenhNhan: chu('Chương V: nhãn thẻ sứ mệnh', 'Sứ mệnh'),
    tamNhinNhan: chu('Chương V: nhãn thẻ tầm nhìn', 'Tầm nhìn'),
    giaTriNhan: chu('Chương V: nhãn giá trị cốt lõi', 'Giá trị cốt lõi'),
    baoChiNhan: chu('Chương VI: nhãn báo chí', 'Báo chí nói về Ecopillo'),
    baoChiTieuDe: chu('Chương VI: tiêu đề báo chí', 'Người khác kể về chúng tôi'),
    doiTacNhan: chu('Chương VI: nhãn đối tác', 'Đối tác'),
    doiTacChu: doan(
      'Chương VI: đoạn đối tác',
      'Ngoài các gia đình, Ecopillo may chăn ga gối theo kích thước cho khách sạn, khu nghỉ dưỡng và doanh nghiệp trên cả nước.',
    ),
    loiKetNhan: chu('Lời kết: nhãn nhỏ', 'Lời kết · Ghé thăm Ecopillo'),
    loiKetTieuDe: chu('Lời kết: tiêu đề', 'Chạm tay vào chất vải trước khi chọn'),
    loiKetChu: doan('Lời kết: đoạn', 'Cảm nhận độ mềm mát của Lyocell, nằm thử gối và đệm, được tư vấn mẫu hợp với phòng ngủ của Quý khách.'),
    // Tạm dùng ảnh phòng ngủ ED25, chờ Ecopillo gửi ảnh công ty, văn phòng
    anhLoiKet: anh('Lời kết: ảnh', {
      src: '/images/details/hero-ed25.webp',
      srcSet: '/images/details/hero-ed25-sm.webp 640w, /images/details/hero-ed25.webp 1200w',
      alt: 'Phòng ngủ trải bộ Eco Doris ED25',
    }),
  },
)
