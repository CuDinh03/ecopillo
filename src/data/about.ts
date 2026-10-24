import { staticImage, type ImageSource } from './catalog'

/**
 * Chữ và ảnh của câu chuyện thương hiệu, dùng chung cho phần "Về chúng tôi" ở trang chủ (components/home/About.tsx)
 * và trang Giới thiệu dạng chương sách (pages/AboutPage.tsx). Nội dung theo trang Giới thiệu và trang chủ cũ của ecopillo.com.vn.
 * Biên bản mục 11, 29, 41. Ecopillo đang duyệt lại câu chữ (STORY_REVIEW_NOTE).
 */

export const STORY_REVIEW_NOTE = '[ECOPILLO ĐANG DUYỆT LẠI CÂU CHỮ PHẦN CÂU CHUYỆN THƯƠNG HIỆU]'

/**
 * Thư "Chia sẻ từ người sáng lập" (yêu cầu sửa mục 11): chép nguyên văn trang khách gửi 16/10/2026, kể cả cách xưng "bạn"
 * (thư ký tên chị Phương, không đổi sang "Quý khách"). Đã đối chiếu với trang 2 catalog Ecopillo 22.07.2026: khớp từng chữ.
 */
export const FOUNDER_LETTER: readonly string[] = [
  'Tôi sinh ra giữa miền quê gió Lào cát trắng – nơi những giấc ngủ trọn vẹn đôi khi chỉ là ước mơ thầm lặng. Tuổi thơ tôi gắn liền với những chiếc giường cũ kỹ, những đêm trằn trọc vì cái nóng, cái lạnh, và những nỗi lo không gọi thành tên. Nhưng cũng từ nơi ấy, trong những thiếu thốn và mỏi mệt, tôi đã nuôi lớn một giấc mơ: Làm sao để mỗi người đều có một chốn yên lành để nghỉ ngơi, để trở về.',
  'Ecopillo ra đời từ những suy nghĩ rất đời thường như thế. Nhưng càng gắn bó, tôi càng thấu hiểu rằng: để mang đến một giấc ngủ trọn vẹn, không chỉ cần một chiếc chăn mềm đệm êm.',
  'Điều thực sự quan trọng là sự tử tế đặt trong từng nguyên liệu, sự tỉ mỉ gửi gắm qua từng đường kim, mũi chỉ – và một tinh thần trách nhiệm bền bỉ với môi trường mà tất cả chúng ta đang cùng chia sẻ. Và đó chính là tôn chỉ mà chúng tôi luôn theo đuổi: “Tốt – Thật – Thiện”. Mỗi sản phẩm Ecopillo đều mang theo sứ mệnh “Nâng niu giấc mơ xanh”, góp phần kiến tạo nên “Chốn Yên”, nơi bạn và những người thân yêu luôn mong được trở về, mỗi đêm.',
  'Tôi tin rằng, một giấc ngủ an lành là gốc rễ của một cuộc sống tròn đầy. Khi bạn lựa chọn Ecopillo, đó không chỉ là một món đồ trong phòng ngủ – mà là một cách sống: nhẹ nhàng hơn, bền vững hơn, và chan chứa yêu thương hơn với chính mình và những người quanh bạn. Cảm ơn bạn – vì đã để chúng tôi trở thành một phần trong tổ ấm của bạn.',
]

export const FOUNDER_SIGNATURE = ['Phạm Thị Phương', 'Người sáng lập thương hiệu Ecopillo', 'Á hậu Doanh nhân Việt Nam 2025'] as const

/**
 * Hai ảnh đi kèm thư ở trang 2 catalog 22.07.2026, cùng chương trình "Chăn ấm yêu thương" (Cẩm Xuyên, 3/2025).
 * Owner chọn đặt trong thư ở trang Về chúng tôi (24/10/2026). Trích, nén: tools/nen-anh-thu-sang-lap-2026-10-24.py
 */
export const FOUNDER_LETTER_IMAGES: readonly ImageSource[] = [
  {
    src: '/images/about/thu-trao-qua-tan-nha.webp',
    srcSet: '/images/about/thu-trao-qua-tan-nha-sm.webp 700w, /images/about/thu-trao-qua-tan-nha.webp 1200w',
    alt: 'Chị Phạm Thị Phương cùng Hội Chữ thập đỏ trao túi quà Ecopillo tận nhà một hộ gia đình',
  },
  {
    src: '/images/about/thu-nhan-thu-cam-on.webp',
    srcSet: '/images/about/thu-nhan-thu-cam-on-sm.webp 700w, /images/about/thu-nhan-thu-cam-on.webp 1200w',
    alt: 'Chị Phạm Thị Phương nhận thư cảm ơn tại chương trình trao quà Chăn ấm yêu thương',
  },
]

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

/**
 * Tốt · Thật · Thiện kèm câu ngắn như bảng hiệu (yêu cầu sửa mục 5, bảng hiệu 88x4m6 khách gửi 16/10/2026).
 * Bảng hiệu in "Thiện với môi trường", tin nhắn của khách ghi "với thiên nhiên": owner chốt "với thiên nhiên" (24/10/2026).
 */
export const VALUES_SHORT = [
  { word: 'Tốt', text: 'trong chất lượng' },
  { word: 'Thật', text: 'trong cam kết' },
  { word: 'Thiện', text: 'với thiên nhiên' },
] as const

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

/**
 * Mục 12 (khách 16/10/2026: bốn khối "phải đồng nhất cấu trúc"), owner chọn kiểu A 17/10: thẻ Giá trị cốt lõi cũng có ảnh.
 * Tạm dùng ảnh đội ngũ Ecopillo tại văn phòng Hà Nội cho tới khi Ecopillo gửi ảnh riêng (câu hỏi 11 trong Excel).
 */
export const VALUES_IMAGE = staticImage('/images/stores/ha-noi-1.webp', 'Đội ngũ Ecopillo tại văn phòng 273 Xã Đàn, Hà Nội')
export const VALUES_IMAGE_NOTE = '[ECOPILLO GỬI ẢNH RIÊNG CHO GIÁ TRỊ CỐT LÕI]'

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
