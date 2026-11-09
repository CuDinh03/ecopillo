import { staticImage, type ImageSource } from './catalog'

/**
 * Chữ và ảnh của câu chuyện thương hiệu, dùng chung cho phần "Về chúng tôi" ở trang chủ (components/home/About.tsx)
 * và trang Giới thiệu dạng chương sách (pages/AboutPage.tsx). Nội dung theo trang Giới thiệu và trang chủ cũ của ecopillo.com.vn.
 * Biên bản mục 11, 29, 41. Ecopillo đang duyệt lại câu chữ; nhãn chờ duyệt đã bỏ khỏi web (owner 28/10/2026).
 */

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

/**
 * Triết lý kinh doanh: chép nguyên văn web cũ (khách yêu cầu 05/11/2026). Chữ to là `word`.
 * Câu mô tả viết hoa đầu câu (chị Phương 09/11/2026 "in hoa", owner duyệt cách a), chữ `word` đứng thẳng.
 */
export const PHILOSOPHY = [
  {
    word: 'Tốt',
    text: 'Trong từng nguyên liệu được lựa chọn, từng chi tiết được chế tác, đảm bảo mang lại trải nghiệm trọn vẹn nhất cho bạn.',
  },
  { word: 'Thật', text: 'Trong cách chúng tôi làm việc, thể hiện sự chính trực, tận tâm và minh bạch.' },
  {
    word: 'Thiện',
    text: 'Trong từng hành động hướng đến cộng đồng và môi trường, bởi chúng tôi tin rằng kinh doanh không chỉ để phát triển mà còn để lan tỏa những điều tốt đẹp nhất.',
  },
] as const

/** Sứ mệnh: chép nguyên văn web cũ, hai đoạn (owner yêu cầu 09/11/2026, thay câu tóm tắt cũ). Mỗi phần tử là một đoạn */
export const MISSION: readonly string[] = [
  'Trong một thế giới đang đối mặt với những thách thức lớn lao và nhiều biến động, Ecopillo ra đời như một biểu tượng của sự đổi mới và trách nhiệm, mang đến những giải pháp chăn ga gối đệm không chỉ nâng niu giấc ngủ mà còn góp phần bảo vệ môi trường.',
  'Được khơi nguồn từ tình yêu với thiên nhiên và cam kết với hành tinh, chúng tôi đồng hành cùng bạn trên hành trình tìm kiếm sự thoải mái, tái tạo năng lượng, và xây dựng một tương lai bền vững hơn.',
]
/** Tầm nhìn: chép nguyên văn web cũ (khách yêu cầu 05/11/2026), dài hơn Sứ mệnh nhiều nên chữ hiện nhỏ hơn (`isLongText`) */
export const VISION =
  'Ecopillo hướng đến trở thành thương hiệu chăn ga gối đệm hàng đầu, biểu tượng cho sự hài hòa giữa chất lượng vượt trội và trách nhiệm với môi trường. Với cam kết đổi mới không ngừng, Ecopillo sẽ là người bạn đồng hành đáng tin cậy của mỗi gia đình Việt, mang đến sự chăm sóc trọn vẹn cho giấc ngủ và góp phần xây dựng một cuộc sống an lành, bền vững cho thế hệ tương lai.'

/** Câu dài (Tầm nhìn) không để chữ tiêu đề cỡ lớn: thẻ sẽ cao gấp mấy lần thẻ bên cạnh */
export const isLongText = (text: string): boolean => text.length > 160
/**
 * Ảnh thẻ Sứ mệnh, Tầm nhìn (góp ý 04/11 mục 2, 4: hai ảnh cũ là banner in sẵn chữ). Owner chọn kiểu A "ảnh thật đúng nghĩa" 06/11/2026,
 * mẫu docs/de-xuat-su-menh-tam-nhin-05-11.html. Cả ba ảnh đều 3:2 hoặc vuông, không có chữ in trong ảnh.
 */
export const MISSION_IMAGE: ImageSource = {
  src: '/images/about/thu-trao-qua-tan-nha.webp',
  srcSet: '/images/about/thu-trao-qua-tan-nha-sm.webp 700w, /images/about/thu-trao-qua-tan-nha.webp 1200w',
  alt: 'Ecopillo cùng Hội Chữ thập đỏ trao túi quà tận nhà một hộ gia đình',
}
export const VISION_IMAGE: ImageSource = {
  src: '/images/stores/ha-noi-1.webp',
  srcSet: '/images/stores/ha-noi-1-sm.webp 640w, /images/stores/ha-noi-1.webp 1200w',
  alt: 'Đội ngũ Ecopillo trước logo thương hiệu tại văn phòng 273 Xã Đàn, Hà Nội',
}

/**
 * Trang Giới thiệu, chương V: ảnh trao quà tận nhà đã nằm trong thư nhà sáng lập (FOUNDER_LETTER_IMAGES),
 * nên thẻ Sứ mệnh ở đó dùng ảnh khác để một trang không lặp ảnh.
 * Ảnh khai trương chi nhánh TP. HCM (chị Phương 09/11/2026: "đưa hình cty mình, ko đưa hình cty khách", owner duyệt cách 1),
 * thay ảnh trao quà tại phòng trưng bày của khách. Cùng ảnh với sự kiện lớn ở trang Quà tặng và sự kiện (data/events.ts).
 * Ảnh 1200×750 (16:10) cắt còn 3:2: lệch xuống một chút để giữ băng khai trương và người.
 */
export const MISSION_IMAGE_ABOUT_PAGE: ImageSource = {
  src: '/images/events/khai-truong-hcm-ngang.webp',
  srcSet: '/images/events/khai-truong-hcm-ngang-sm.webp 640w, /images/events/khai-truong-hcm-ngang.webp 1200w',
  alt: 'Lễ cắt băng khai trương chi nhánh Ecopillo TP. Hồ Chí Minh',
}
export const MISSION_IMAGE_ABOUT_PAGE_POSITION = '50% 55%'

export const CORE_VALUES = [
  { icon: 'award', title: 'Chất lượng vượt trội', text: 'Nguyên liệu tự nhiên, công nghệ tiên tiến.' },
  { icon: 'recycle', title: 'Bảo vệ môi trường', text: 'Vật liệu bền vững, quy trình thân thiện, sản phẩm dùng lâu bền.' },
  { icon: 'lightbulb', title: 'Đổi mới, sáng tạo', text: 'Cải tiến chất liệu và thiết kế từ góp ý của khách hàng.' },
  { icon: 'community', title: 'Kết nối cộng đồng xanh', text: 'Lan toả lối sống và tiêu dùng bền vững.' },
] as const

/**
 * Mục 12 (khách 16/10/2026: bốn khối "phải đồng nhất cấu trúc"), owner chọn kiểu A 17/10: thẻ Giá trị cốt lõi cũng có ảnh.
 * Ảnh đội ngũ Hà Nội chuyển sang thẻ Tầm nhìn (06/11/2026). Từ 09/11/2026 dùng ảnh khai trương chi nhánh TP. HCM
 * (ảnh của chính Ecopillo, thay ảnh trao quà ở phòng trưng bày khách) cho tới khi Ecopillo gửi ảnh riêng (câu hỏi 11 trong Excel).
 */
export const VALUES_IMAGE = MISSION_IMAGE_ABOUT_PAGE
export const VALUES_IMAGE_POSITION = MISSION_IMAGE_ABOUT_PAGE_POSITION

export const AWARD_NAME = 'Thương hiệu dẫn đầu Việt Nam 2025'
export const AWARD_IMAGE = staticImage('/images/about/thuong-hieu-dan-dau.webp', 'Ecopillo tại lễ công bố Thương hiệu dẫn đầu Việt Nam 2025')

export interface Certificate {
  name: string
  /** Tên ngắn cho thẻ nhỏ (trang Khách sạn) */
  short: string
  text: string
  /** Ảnh chụp giấy, cắt từ catalog Ecopillo 22.07.2026: `${image}-sm.webp` cho thẻ, `${image}.webp` khi bấm xem */
  image: string
}

const certificateImage = (key: string): string => `/images/certificates/${key}`

/**
 * Ba giấy về chất lượng, chép đúng chữ trên giấy trong catalog Ecopillo 22.07.2026 (trang 4).
 * Owner chọn "tủ chứng nhận" kiểu A (24/10/2026); tạm dùng ảnh cắt từ catalog cho tới khi có bản gốc nét hơn.
 * Trích, nén: tools/trich-anh-catalog-mau-2026-10-24.py rồi tools/nen-anh-catalog-phan-moi-2026-10-24.py
 */
export const CERTIFICATES: readonly Certificate[] = [
  {
    name: 'ISO 9001:2015',
    short: 'ISO 9001:2015',
    text: 'Hệ thống quản lý chất lượng. Phạm vi: sản xuất và kinh doanh chăn ga gối đệm.',
    image: certificateImage('chung-nhan-iso-9001-2015'),
  },
  {
    name: 'Hợp quy QCVN 01:2017/BCT',
    short: 'Hợp quy QCVN 01:2017',
    text: 'Sản phẩm dệt may được TQC đánh giá phù hợp quy chuẩn kỹ thuật quốc gia.',
    image: certificateImage('chung-nhan-tqc-qcvn-01-2017-bct'),
  },
  {
    name: 'Top 10 Thương hiệu dẫn đầu Việt Nam 2025',
    short: 'Top 10 Thương hiệu dẫn đầu 2025',
    text: 'Quyết định số 136-VKT, ngày 13/4/2025.',
    image: certificateImage('chung-nhan-top-10-thuong-hieu-2025'),
  },
]

/** Bốn ghi nhận dành cho chị Phạm Thị Phương: để riêng một hàng, không lẫn với giấy chất lượng */
export const FOUNDER_HONOURS: readonly Certificate[] = [
  {
    name: 'Tấm lòng vàng',
    short: 'Tấm lòng vàng',
    text: 'Hội Chữ thập đỏ tỉnh Hà Tĩnh, 2025.',
    image: certificateImage('ghi-nhan-tam-long-vang-chu-thap-do-ha-tinh'),
  },
  {
    name: 'Tấm lòng vàng',
    short: 'Tấm lòng vàng',
    text: 'UBND xã Chư Á, Gia Lai: “Tạo sinh kế, trao yêu thương”.',
    image: certificateImage('ghi-nhan-tam-long-vang-chu-a-gia-lai'),
  },
  {
    name: 'Kỷ niệm chương',
    short: 'Kỷ niệm chương',
    text: 'Tạp chí Tinh Hoa Đất Việt, 100 năm Báo chí Cách mạng.',
    image: certificateImage('ky-niem-chuong-tinh-hoa-dat-viet'),
  },
  {
    name: 'Nhà hoạt động xã hội tiêu biểu',
    short: 'Nhà hoạt động xã hội tiêu biểu',
    text: 'Chương trình “Kết nối doanh nhân tâm tài đất Việt”.',
    image: certificateImage('chung-nhan-ket-noi-doanh-nhan-tam-tai'),
  },
]

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
