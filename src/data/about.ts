import { staticImage, type ImageSource } from './catalog'

/**
 * Chữ và ảnh của câu chuyện thương hiệu, dùng chung cho phần "Về chúng tôi" ở trang chủ (components/home/About.tsx)
 * và trang Giới thiệu dạng chương sách (pages/AboutPage.tsx). Nội dung theo trang Giới thiệu và trang chủ cũ của ecopillo.com.vn.
 * Biên bản mục 11, 29, 41. Ecopillo đang duyệt lại câu chữ (STORY_REVIEW_NOTE).
 */

export const STORY_REVIEW_NOTE = '[ECOPILLO ĐANG DUYỆT LẠI CÂU CHỮ PHẦN CÂU CHUYỆN THƯƠNG HIỆU]'

export const STORY_OPENING =
  'Một giấc ngủ không trọn đôi khi chẳng bắt đầu từ điều gì lớn lao: chiếc ga quá thô ráp, đứa trẻ trằn trọc vì chăn bí nóng, hay người lớn mang cả áp lực vào giấc ngủ sau một ngày dài.'

export const FOUNDER_NAME = 'chị Phạm Thị Phương'

/** Câu trích dùng ở trang chủ và trang Giới thiệu; không thêm câu trích nào khác gán cho chị Phương khi Ecopillo chưa gửi */
export const FOUNDER_QUOTE = 'Mỗi sản phẩm làm ra đều bắt đầu từ sự tử tế.'

export const BRAND_PROMISE =
  'Từ đó, Ecopillo® ra đời với một cam kết: mỗi sản phẩm làm ra đều bắt đầu từ sự tử tế, và kết thúc bằng sự bình yên trong giấc ngủ của mọi gia đình.'

/** Biên bản mục 29: ảnh chị Phạm Thị Phương trên VTV3 */
export const FOUNDER_IMAGE: ImageSource = {
  src: '/images/about/chi-phuong.webp',
  srcSet: '/images/about/chi-phuong-sm.webp 800w, /images/about/chi-phuong.webp 1309w',
  alt: 'Chị Phạm Thị Phương, người sáng lập Ecopillo, tại VTV3',
}

export const PHILOSOPHY = [
  { word: 'Tốt', text: 'trong chất lượng sản phẩm: nguyên liệu chọn lọc, từng chi tiết được chế tác kỹ lưỡng.' },
  { word: 'Thật', text: 'trong cam kết với khách hàng: chính trực, tận tâm và minh bạch.' },
  { word: 'Thiện', text: 'trong cách chọn vật liệu và hành động: hướng tới cộng đồng và môi trường.' },
] as const

export const MISSION = 'Mang đến giải pháp chăn ga gối đệm vừa nâng niu giấc ngủ, vừa góp phần bảo vệ môi trường.'
export const VISION =
  'Trở thành thương hiệu chăn ga gối đệm hàng đầu, kết hợp chất lượng vượt trội với trách nhiệm môi trường, đồng hành cùng các gia đình Việt.'
export const MISSION_IMAGE = staticImage('/images/about/su-menh.webp', 'Sứ mệnh Ecopillo: thay màu cho yêu thương')
export const VISION_IMAGE = staticImage('/images/about/tam-nhin.webp', 'Tầm nhìn Ecopillo')

export const CORE_VALUES = [
  { icon: 'award', title: 'Chất lượng vượt trội', text: 'Nguyên liệu tự nhiên, công nghệ tiên tiến.' },
  { icon: 'recycle', title: 'Bảo vệ môi trường', text: 'Vật liệu bền vững, quy trình thân thiện, sản phẩm dùng lâu bền.' },
  { icon: 'lightbulb', title: 'Đổi mới, sáng tạo', text: 'Cải tiến chất liệu và thiết kế từ góp ý của khách hàng.' },
  { icon: 'community', title: 'Kết nối cộng đồng xanh', text: 'Lan toả lối sống và tiêu dùng bền vững.' },
] as const

export const AWARD_NAME = 'Thương hiệu dẫn đầu Việt Nam 2025'
export const AWARD_IMAGE = staticImage('/images/about/thuong-hieu-dan-dau.webp', 'Ecopillo tại lễ công bố Thương hiệu dẫn đầu Việt Nam 2025')

export const CERTIFICATES = [
  {
    name: 'ISO 9001:2015',
    text: 'Hệ thống quản lý chất lượng trong sản xuất được chứng nhận theo tiêu chuẩn quốc tế.',
    logo: '/images/partners/iso-9001.webp',
  },
  {
    name: 'TQC',
    text: 'Chứng nhận chất lượng sản phẩm, hàng hoá phù hợp tiêu chuẩn.',
    logo: '/images/partners/tqc.webp',
  },
  {
    name: AWARD_NAME,
    text: 'Danh hiệu ghi nhận chất lượng sản phẩm và uy tín với khách hàng.',
    logo: null,
  },
] as const

export const CERTIFICATE_FILL_IN = '[ECOPILLO GỬI BẢN CHỤP GIẤY CHỨNG NHẬN ĐỂ ĐỐI CHIẾU ĐÚNG TÊN, NĂM CẤP]'

export const BRAND_STATS = [
  { value: '15+', label: 'năm trong nghề chăn ga gối đệm' },
  { value: '15.000+', label: 'gia đình, khách sạn tin dùng' },
  { value: '2', label: 'văn phòng tại Hà Nội và TP. HCM' },
] as const

/** Chất liệu và tay nghề (dùng chung với BrandStory ở trang chủ) */
export const LYOCELL_INTRO =
  'Ecopillo chọn vải Lyocell cao cấp nhập khẩu, dệt từ sợi gỗ tự nhiên, làm chất liệu chủ đạo. Quy trình sản xuất khép kín, thân thiện môi trường và an toàn cho cả làn da nhạy cảm của trẻ nhỏ.'
export const CRAFT_QUOTE = 'Không chạy theo số lượng, mà kiên định tạo ra từng sản phẩm có linh hồn.'
export const LYOCELL_TRAITS: readonly { title: string; text: string }[] = [
  { title: 'Mềm', text: 'Bề mặt mịn như lụa, rủ nhẹ theo dáng giường.' },
  { title: 'Mát', text: 'Sợi hút ẩm nhanh, giữ cho lưng khô thoáng suốt đêm.' },
  { title: 'Thoáng khí', text: 'Cấu trúc sợi cho không khí lưu thông, không hầm bí.' },
  { title: 'Lành tính', text: 'Dịu với da nhạy cảm, phù hợp cả trẻ nhỏ.' },
]
