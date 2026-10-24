/**
 * Báo chí nói về Ecopillo (catalog Ecopillo 22.07.2026, trang 6). Owner chọn kiểu A ngày 24/10/2026: hàng logo báo,
 * bấm logo đổi câu trích, đặt ở chương VI trang Về chúng tôi. Owner cho phép dùng logo và nội dung các bài báo.
 * Câu trích chép nguyên văn ảnh chụp bài trong catalog. Ảnh chụp bài "Doanh nghiệp & Cộng đồng" có đoạn in chữ chất liệu cũ:
 * chỉ lấy câu của chị Phương, không đưa ảnh bài lên web.
 * Link, ngày đăng tra trên internet ngày 24/10/2026 (owner bảo tự tìm), đã mở và khớp chữ trong ảnh catalog.
 * Báo chí Việt và Tin Nóng Showbiz (08/03/2025) đăng cùng một bài, cách nhau một phút: giữ cả hai vì là hai tờ, câu trích khác nhau.
 * Không có link: VEDSU (doanhnghiepvn.org đã bỏ tên miền, bản đăng lại ở trang khác mang tên khác) và Doanh nghiệp & Cộng đồng
 * (trang báo trả 404 mọi bài, kho lưu web không lưu bài; bài viết dịp khai trương showroom TP. HCM, khoảng 29/9/2025, chưa xác nhận).
 * Các bài báo ngoài vẫn có chữ chất liệu cũ ở đoạn khác: không sửa được trang của báo.
 */
export interface PressArticle {
  outlet: string
  logo: string
  quote: string
  /** Ai nói câu trích, nếu không phải lời của báo */
  speaker?: string
  /** Link bài gốc; chưa tìm được thì để trống, nút "Đọc bài" ẩn đi */
  url?: string
  /** Ngày đăng, dạng dd/mm/yyyy */
  date?: string
}

export const PRESS: readonly PressArticle[] = [
  {
    outlet: 'Hội Chữ thập đỏ Việt Nam',
    logo: '/images/press/hoi-chu-thap-do.webp',
    quote:
      'Chương trình “Chăn Ấm Yêu Thương” đã trao 130 chiếc chăn ấm cho những hộ gia đình nghèo, cận nghèo và đặc biệt khó khăn trên địa bàn huyện.',
    url: 'https://redcross.org.vn/ha-tinh-trao-130-chiec-chan-am-cho-130-ho-gia-dinh-co-hoan-canh-kho-khan.html/',
    date: '24/03/2025',
  },
  {
    outlet: 'Doanh nghiệp & Cộng đồng',
    logo: '/images/press/doanh-nghiep-cong-dong.webp',
    quote: 'Ecopillo mang sứ mệnh nâng niu giấc mơ xanh cho hàng triệu gia đình Việt, với tôn chỉ Tốt – Thật – Thiện.',
    speaker: 'CEO Phạm Thị Phương',
  },
  {
    outlet: 'VEDSU',
    logo: '/images/press/vedsu.webp',
    quote: 'Công ty TNHH Ecopillo Eternal Việt Nam vinh dự đón nhận giải thưởng “Top 10 Thương hiệu dẫn đầu Việt Nam 2025”.',
  },
  {
    outlet: 'Báo chí Việt',
    logo: '/images/press/bao-chi-viet.webp',
    quote: 'Tốt trong chất lượng – Thật trong cam kết – Thiện với môi trường.',
    speaker: 'Tôn chỉ của Ecopillo',
    url: 'https://baochiviet.com/dong-hanh-cung-hoa-hau-doanh-nhan-quoc-gia-viet-nam-2025-ecopillo-mang-nhung-giac-ngu-ngon-den-ba-con-gia-lai/',
    date: '08/03/2025',
  },
  {
    outlet: 'Tin Nóng Showbiz',
    logo: '/images/press/tin-nong-showbiz.webp',
    quote:
      'Ecopillo là thương hiệu chăn ga gối đệm cao cấp mang lại giấc ngủ hoàn hảo cho người sử dụng, tạo nên không gian phòng ngủ đẳng cấp, hiện đại và ấm cúng.',
    url: 'https://tinnongshowbiz.net/ecopillo-ntt-dong-hanh-cung-cuoc-thi-hoa-hau-doanh-nhan-quoc-gia-viet-nam-2025-trong-hanh-trinh-thien-nguyen-trao-sinh-ke/',
    date: '08/03/2025',
  },
]
