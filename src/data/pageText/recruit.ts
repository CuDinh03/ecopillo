import { chu, definePageText, doan, doanNhieu, dsCap, dsDong } from './define'

/**
 * Chữ trang Tuyển đại lý. Thư ngỏ và Mô hình kinh doanh: chữ chị Phương gửi Zalo 19/11/2026, giữ nguyên văn.
 * Quyền lợi đại lý: bảng khách gửi, chỉ sửa chính tả và bỏ chữ "Được" đầu dòng. "50 nhà phân phối": owner cho phép công bố,
 * chỉ đặt ở trang này (trang Hệ thống phân phối liệt kê điểm có địa chỉ).
 */
export const { set: RECRUIT_TEXT_SET, text: RECRUIT_TEXT } = definePageText(
  'tuyen-dai-ly',
  'Trang Tuyển đại lý',
  'Thư ngỏ hợp tác, mô hình kinh doanh ba trụ cột, số nhà phân phối, quyền lợi đại lý, form đăng ký của trang Tuyển đại lý.',
  {
    // Tiêu đề tab, mô tả Google vẫn ghi "Tuyển đại lý" vì khách tìm theo chữ đó
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Ecopillo tuyển đại lý, nhà phân phối chăn ga gối đệm cao cấp vải Lyocell tại các tỉnh, thành. Để lại thông tin, bộ phận kinh doanh gọi lại.',
    ),
    thuNhan: chu('Thư ngỏ: nhãn nhỏ', 'Thư ngỏ hợp tác'),
    thuTieuDe: chu('Thư ngỏ: tiêu đề', 'Đồng hành kiến tạo thịnh vượng'),
    thu: doanNhieu('Thư ngỏ: các đoạn', [
      'Trên hành trình phát triển thương hiệu và lan tỏa những giá trị tốt đẹp trong ngành chăn ga gối đệm, Ecopillo luôn trân trọng những mối quan hệ hợp tác được xây dựng trên sự tin tưởng, sẻ chia và cùng phát triển.',
      'Với mong muốn mở rộng hệ sinh thái kinh doanh, Ecopillo trân trọng gửi lời mời hợp tác đến các nhà phân phối, đại lý, cửa hàng chăn ga gối đệm, nội thất và đối tác trên toàn quốc.',
      'Bằng nền tảng sản phẩm chất lượng, chính sách hợp tác minh bạch và tinh thần đồng hành lâu dài, Ecopillo mong muốn cùng Quý đối tác mở rộng thị trường, gia tăng giá trị kinh doanh và kiến tạo những thành công bền vững.',
    ]),
    thuKyTen: chu('Thư ngỏ: dòng ký tên', 'Ecopillo – Cộng sinh cùng phát triển.'),
    moHinhNhan: chu('Mô hình: nhãn nhỏ', 'Mô hình kinh doanh'),
    moHinhTieuDe: chu('Mô hình: tiêu đề', 'Ba trụ cột – Một hệ sinh thái'),
    moHinhChu: doan(
      'Mô hình: đoạn dẫn',
      'Ecopillo xây dựng mô hình kinh doanh đa kênh với ba trụ cột chiến lược: bán lẻ trực tiếp, cung ứng dự án và phát triển hệ thống phân phối. Kết nối đồng bộ từ sản phẩm, dịch vụ đến mạng lưới đối tác, đưa giải pháp giấc ngủ chất lượng đến gần hơn với mọi khách hàng.',
    ),
    truCotTen: dsCap(
      'Mô hình: tên và khẩu hiệu từng trụ cột',
      ['title', 'tagline'],
      ['Tên', 'Khẩu hiệu'],
      [
        { title: 'Bán lẻ trực tiếp', tagline: 'Kết nối khách hàng – Nâng tầm trải nghiệm' },
        { title: 'Cung ứng dự án', tagline: 'Giải pháp toàn diện cho ngành lưu trú' },
        { title: 'Hệ thống phân phối', tagline: 'Cộng sinh cùng phát triển' },
      ],
      'Cùng thứ tự với ô mô tả bên dưới',
    ),
    truCotMoTa: doanNhieu('Mô hình: mô tả từng trụ cột (mỗi trụ cột một đoạn, cùng thứ tự)', [
      'Phát triển hệ thống bán lẻ đa nền tảng từ showroom, website, mạng xã hội đến các sàn thương mại điện tử. Mang đến trải nghiệm mua sắm thuận tiện, tư vấn tận tâm và dịch vụ nhanh chóng trên mọi điểm chạm.',
      'Đồng hành cùng khách sạn, resort, homestay và các dự án lưu trú với giải pháp chăn ga gối đệm đồng bộ. Đảm bảo chất lượng, tính thẩm mỹ, độ bền và năng lực cung ứng theo yêu cầu của từng dự án.',
      'Mở rộng mạng lưới đại lý và nhà phân phối trên toàn quốc. Xây dựng hệ thống hợp tác bền vững dựa trên lợi ích song phương, với nguồn hàng ổn định, chính sách kinh doanh cạnh tranh, hỗ trợ bán hàng và đồng hành phát triển thị trường.',
    ]),
    soNhaPhanPhoi: chu('Bản đồ: con số', '50'),
    soNhaPhanPhoiChu: chu('Bản đồ: chữ dưới con số', 'nhà phân phối'),
    banDoChuThich: doan(
      'Bản đồ: chú thích',
      'Ngôi sao: văn phòng Hà Nội, chi nhánh TP. HCM. Biểu tượng E đánh dấu các vùng có nhà phân phối, không phải từng địa chỉ.',
    ),
    dangKyNhan: chu('Đăng ký: nhãn nhỏ', 'Hợp tác'),
    dangKyTieuDe: chu('Đăng ký: tiêu đề', 'Trở thành đại lý Ecopillo'),
    dangKyChu: doan(
      'Đăng ký: đoạn dẫn',
      'Ecopillo tìm đối tác phân phối chăn ga gối đệm cao cấp tại các tỉnh, thành. Để lại thông tin, bộ phận kinh doanh sẽ gọi lại.',
    ),
    quyenLoi: dsDong('Đăng ký: quyền lợi đại lý (mỗi dòng một ý)', [
      'Giá chiết khấu cơ bản và chính sách theo từng gói',
      'Hàng mẫu, catalogue, ảnh và video sản phẩm',
      'Đào tạo sản phẩm, đào tạo bán hàng, có sẵn kịch bản bán hàng',
      'Hỗ trợ bán hàng online',
      'Hỗ trợ biển bảng và một phần giá kệ theo từng gói hàng',
      'Độc quyền theo từng khu vực',
      'Hỗ trợ đổi hàng nếu khó bán',
      'Không cần ôm tồn, không lo đọng vốn',
      'Chi phí vốn rất thấp',
    ]),
    dangKyLienHe: chu('Đăng ký: chữ trước số hotline', 'Liên hệ mở đại lý:'),
    dangKyViDu: doan('Đăng ký: chữ mờ ví dụ trong ô tin nhắn', 'Ví dụ: cửa hàng chăn ga tại Nam Định, diện tích 60 m², muốn nhận bảng giá sỉ…'),
    dangKyNut: chu('Đăng ký: chữ nút gửi', 'Gửi đăng ký'),
  },
)
