import { staticImage, type ImageSource } from './catalog'
import { anh, chu, definePageText, dsAnh, dsCap, dsDong, legacyPageText } from './pageText/define'
import { liveList, liveObject, type EditableField, type EditableSet } from './liveContent'

/**
 * Chữ và ảnh của câu chuyện thương hiệu, dùng chung cho phần "Về chúng tôi" ở trang chủ (components/home/About.tsx)
 * và trang Giới thiệu dạng chương sách (pages/AboutPage.tsx). Nội dung theo trang Giới thiệu và trang chủ cũ của ecopillo.com.vn.
 * Biên bản mục 11, 29, 41. Ecopillo đang duyệt lại câu chữ; nhãn chờ duyệt đã bỏ khỏi web (owner 28/10/2026).
 */

/**
 * Thư "Chia sẻ từ người sáng lập" (yêu cầu sửa mục 11): chép nguyên văn trang khách gửi 16/10/2026, kể cả cách xưng "bạn"
 * (thư ký tên chị Phương, không đổi sang "Quý khách"). Đã đối chiếu với trang 2 catalog Ecopillo 22.07.2026: khớp từng chữ.
 */
const BASE_FOUNDER_LETTER: readonly string[] = [
  'Tôi sinh ra giữa miền quê gió Lào cát trắng – nơi những giấc ngủ trọn vẹn đôi khi chỉ là ước mơ thầm lặng. Tuổi thơ tôi gắn liền với những chiếc giường cũ kỹ, những đêm trằn trọc vì cái nóng, cái lạnh, và những nỗi lo không gọi thành tên. Nhưng cũng từ nơi ấy, trong những thiếu thốn và mỏi mệt, tôi đã nuôi lớn một giấc mơ: Làm sao để mỗi người đều có một chốn yên lành để nghỉ ngơi, để trở về.',
  'Ecopillo ra đời từ những suy nghĩ rất đời thường như thế. Nhưng càng gắn bó, tôi càng thấu hiểu rằng: để mang đến một giấc ngủ trọn vẹn, không chỉ cần một chiếc chăn mềm đệm êm.',
  'Điều thực sự quan trọng là sự tử tế đặt trong từng nguyên liệu, sự tỉ mỉ gửi gắm qua từng đường kim, mũi chỉ – và một tinh thần trách nhiệm bền bỉ với môi trường mà tất cả chúng ta đang cùng chia sẻ. Và đó chính là tôn chỉ mà chúng tôi luôn theo đuổi: “Tốt – Thật – Thiện”. Mỗi sản phẩm Ecopillo đều mang theo sứ mệnh “Nâng niu giấc mơ xanh”, góp phần kiến tạo nên “Chốn Yên”, nơi bạn và những người thân yêu luôn mong được trở về, mỗi đêm.',
  'Tôi tin rằng, một giấc ngủ an lành là gốc rễ của một cuộc sống tròn đầy. Khi bạn lựa chọn Ecopillo, đó không chỉ là một món đồ trong phòng ngủ – mà là một cách sống: nhẹ nhàng hơn, bền vững hơn, và chan chứa yêu thương hơn với chính mình và những người quanh bạn. Cảm ơn bạn – vì đã để chúng tôi trở thành một phần trong tổ ấm của bạn.',
]

const BASE_FOUNDER_SIGNATURE = ['Phạm Thị Phương', 'Người sáng lập thương hiệu Ecopillo', 'Á hậu Doanh nhân Việt Nam 2025'] as const

/**
 * Hai ảnh đi kèm thư ở trang 2 catalog 22.07.2026, cùng chương trình "Chăn ấm yêu thương" (Cẩm Xuyên, 3/2025).
 * Owner chọn đặt trong thư ở trang Về chúng tôi (24/10/2026). Trích, nén: tools/nen-anh-thu-sang-lap-2026-10-24.py
 */
const BASE_FOUNDER_LETTER_IMAGES: readonly ImageSource[] = [
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

const BASE_STORY_OPENING =
  'Một giấc ngủ không trọn đôi khi chẳng bắt đầu từ điều gì lớn lao: chiếc ga quá thô ráp, đứa trẻ trằn trọc vì chăn bí nóng, hay người lớn mang cả áp lực vào giấc ngủ sau một ngày dài.'

export const FOUNDER_NAME = 'chị Phạm Thị Phương'

/** Câu trích dùng ở trang chủ và trang Giới thiệu; không thêm câu trích nào khác gán cho chị Phương khi Ecopillo chưa gửi */
const BASE_FOUNDER_QUOTE = 'Mỗi sản phẩm làm ra đều bắt đầu từ sự tử tế.'

const BASE_BRAND_PROMISE =
  'Từ đó, Ecopillo® ra đời với một cam kết: mỗi sản phẩm làm ra đều bắt đầu từ sự tử tế, và kết thúc bằng sự bình yên trong giấc ngủ của mọi gia đình.'

/** Biên bản mục 29: ảnh chị Phạm Thị Phương trên VTV3 */
const BASE_FOUNDER_IMAGE: ImageSource = {
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
const BASE_PHILOSOPHY = [
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
const BASE_MISSION: readonly string[] = [
  'Trong một thế giới đang đối mặt với những thách thức lớn lao và nhiều biến động, Ecopillo ra đời như một biểu tượng của sự đổi mới và trách nhiệm, mang đến những giải pháp chăn ga gối đệm không chỉ nâng niu giấc ngủ mà còn góp phần bảo vệ môi trường.',
  'Được khơi nguồn từ tình yêu với thiên nhiên và cam kết với hành tinh, chúng tôi đồng hành cùng bạn trên hành trình tìm kiếm sự thoải mái, tái tạo năng lượng, và xây dựng một tương lai bền vững hơn.',
]
/** Tầm nhìn: chép nguyên văn web cũ (khách yêu cầu 05/11/2026), dài hơn Sứ mệnh nhiều nên chữ hiện nhỏ hơn (`isLongText`) */
const BASE_VISION =
  'Ecopillo hướng đến trở thành thương hiệu chăn ga gối đệm hàng đầu, biểu tượng cho sự hài hòa giữa chất lượng vượt trội và trách nhiệm với môi trường. Với cam kết đổi mới không ngừng, Ecopillo sẽ là người bạn đồng hành đáng tin cậy của mỗi gia đình Việt, mang đến sự chăm sóc trọn vẹn cho giấc ngủ và góp phần xây dựng một cuộc sống an lành, bền vững cho thế hệ tương lai.'

/** Câu dài (Tầm nhìn) không để chữ tiêu đề cỡ lớn: thẻ sẽ cao gấp mấy lần thẻ bên cạnh */
export const isLongText = (text: string): boolean => text.length > 160
/**
 * Ảnh thẻ Sứ mệnh, Tầm nhìn (góp ý 04/11 mục 2, 4: hai ảnh cũ là banner in sẵn chữ). Owner chọn kiểu A "ảnh thật đúng nghĩa" 06/11/2026,
 * mẫu docs/de-xuat-su-menh-tam-nhin-05-11.html. Cả ba ảnh đều 3:2 hoặc vuông, không có chữ in trong ảnh.
 */
const BASE_MISSION_IMAGE: ImageSource = {
  src: '/images/about/thu-trao-qua-tan-nha.webp',
  srcSet: '/images/about/thu-trao-qua-tan-nha-sm.webp 700w, /images/about/thu-trao-qua-tan-nha.webp 1200w',
  alt: 'Ecopillo cùng Hội Chữ thập đỏ trao túi quà tận nhà một hộ gia đình',
}
const BASE_VISION_IMAGE: ImageSource = {
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
const BASE_MISSION_IMAGE_ABOUT_PAGE: ImageSource = {
  src: '/images/events/khai-truong-hcm-ngang.webp',
  srcSet: '/images/events/khai-truong-hcm-ngang-sm.webp 640w, /images/events/khai-truong-hcm-ngang.webp 1200w',
  alt: 'Lễ cắt băng khai trương chi nhánh Ecopillo TP. Hồ Chí Minh',
}
export const MISSION_IMAGE_ABOUT_PAGE_POSITION = '50% 55%'

const BASE_CORE_VALUES: readonly { icon: 'award' | 'recycle' | 'lightbulb' | 'community'; title: string; text: string }[] = [
  { icon: 'award', title: 'Chất lượng vượt trội', text: 'Nguyên liệu tự nhiên, công nghệ tiên tiến.' },
  { icon: 'recycle', title: 'Bảo vệ môi trường', text: 'Vật liệu bền vững, quy trình thân thiện, sản phẩm dùng lâu bền.' },
  { icon: 'lightbulb', title: 'Đổi mới, sáng tạo', text: 'Cải tiến chất liệu và thiết kế từ góp ý của khách hàng.' },
  { icon: 'community', title: 'Kết nối cộng đồng xanh', text: 'Lan toả lối sống và tiêu dùng bền vững.' },
]

/**
 * Mục 12 (khách 16/10/2026: bốn khối "phải đồng nhất cấu trúc"), owner chọn kiểu A 17/10: thẻ Giá trị cốt lõi cũng có ảnh.
 * Ảnh đội ngũ Hà Nội chuyển sang thẻ Tầm nhìn (06/11/2026). Từ 09/11/2026 dùng ảnh khai trương chi nhánh TP. HCM
 * (ảnh của chính Ecopillo, thay ảnh trao quà ở phòng trưng bày khách) cho tới khi Ecopillo gửi ảnh riêng (câu hỏi 11 trong Excel).
 */
export const VALUES_IMAGE_POSITION = MISSION_IMAGE_ABOUT_PAGE_POSITION


const BASE_AWARD_NAME = 'Thương hiệu dẫn đầu Việt Nam 2025'
const BASE_AWARD_IMAGE = staticImage('/images/about/thuong-hieu-dan-dau.webp', 'Ecopillo tại lễ công bố Thương hiệu dẫn đầu Việt Nam 2025')

export interface Certificate {
  /** Ảnh Ecopillo chọn từ Thư viện (đợt D): dùng cho cả ô nhỏ và khi bấm xem, thay `image` */
  imageUrl?: string
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
const BASE_CERTIFICATES: readonly Certificate[] = [
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
const BASE_FOUNDER_HONOURS: readonly Certificate[] = [
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

const BASE_BRAND_STATS = [
  { value: '15+', label: 'năm trong nghề chăn ga gối đệm' },
  // Owner 18/11/2026: thay 15.000 bằng "hàng trăm nghìn" (mức số thống nhất cả web; tên chương trình "Tri ân 15.000 khách hàng" giữ nguyên)
  { value: 'Hàng trăm nghìn', label: 'gia đình, khách sạn tin dùng' },
  { value: '2', label: 'văn phòng tại Hà Nội và TP. HCM' },
] as const

/** Chất liệu và tay nghề (dùng chung với BrandStory ở trang chủ) */
const BASE_LYOCELL_INTRO =
  'Ecopillo chọn vải Lyocell cao cấp nhập khẩu, dệt từ sợi gỗ tự nhiên, làm chất liệu chủ đạo. Quy trình sản xuất khép kín, thân thiện môi trường và an toàn cho cả làn da nhạy cảm của trẻ nhỏ.'
const BASE_CRAFT_QUOTE = 'Không chạy theo số lượng, mà kiên định tạo ra từng sản phẩm có linh hồn.'
/**
 * Quy trình phát triển sản phẩm 7 bước, chương IV trang Giới thiệu (chị Phương Zalo 12/11/2026).
 * Chữ chép đúng tài liệu chị Phương gửi. Chị chọn mẫu A + cách 1, bỏ dòng tóm tắt, hiện hết mô tả không cần bấm
 * (mẫu: docs/de-xuat-quy-trinh-7-buoc-12-11.html). Tên ba chặng là cách chia của owner (Zalo 11:40).
 */
export type ProcessIcon = 'research' | 'design' | 'review' | 'box' | 'shield' | 'factory' | 'truck'

export interface ProcessStep {
  title: string
  text: string
  icon: ProcessIcon
  /** Bước duyệt mẫu: làm nổi bật, kèm kết quả Đạt / Không đạt */
  isGate?: boolean
}

export interface ProcessStage {
  name: string
  steps: readonly ProcessStep[]
}

const BASE_PRODUCT_PROCESS_TITLE = 'Quy trình phát triển sản phẩm'
const BASE_PRODUCT_PROCESS: readonly ProcessStage[] = [
  {
    name: 'Ý tưởng và thiết kế',
    steps: [
      {
        title: 'Nghiên cứu & Phát triển (R&D)',
        icon: 'research',
        text: 'Ý tưởng sản phẩm được hình thành dựa trên dữ liệu thị trường, thử nghiệm thực tế và phân tích hành vi người dùng, nhằm đảm bảo định hướng phù hợp với triết lý thương hiệu và tiêu chuẩn chất lượng.',
      },
      {
        title: 'Thiết kế sản phẩm',
        icon: 'design',
        text: 'R&D phối hợp cùng bộ phận thiết kế để xây dựng bản thiết kế hoàn chỉnh – đảm bảo tính khả thi trong sản xuất, đồng thời cân bằng giữa công năng và thẩm mỹ.',
      },
      {
        title: 'Thẩm định thiết kế (R&D)',
        icon: 'review',
        text: 'Thiết kế được rà soát toàn diện về mặt kỹ thuật, cấu trúc và chất liệu. Chỉ khi đáp ứng đầy đủ các tiêu chí nội bộ, mới tiến hành sản xuất mẫu thử.',
      },
    ],
  },
  {
    name: 'Mẫu thử',
    steps: [
      {
        title: 'Sản xuất mẫu thử',
        icon: 'box',
        text: 'Bản thiết kế được hiện thực hóa thành mẫu thử trên chất liệu thật, phục vụ đánh giá trực quan về phom dáng, độ phồng, độ dày, cảm giác bề mặt và tính đồng nhất.',
      },
      {
        title: 'Duyệt mẫu (Giám đốc Sản xuất)',
        icon: 'shield',
        isGate: true,
        text: 'Mẫu thử được thẩm định bởi Giám đốc Sản xuất theo các tiêu chí kỹ thuật nghiêm ngặt: độ chính xác đường may, độ bền cấu trúc, độ dày chần thêu, khả năng ổn định khi sản xuất số lượng lớn.',
      },
    ],
  },
  {
    name: 'Sản xuất',
    steps: [
      {
        title: 'Sản xuất đại trà',
        icon: 'factory',
        text: 'Sản phẩm được đưa vào dây chuyền sản xuất khép kín, với quy trình kiểm soát chất lượng tại từng công đoạn nhằm đảm bảo sự đồng bộ tuyệt đối với mẫu chuẩn.',
      },
      {
        title: 'Kiểm định cuối & Xuất xưởng',
        icon: 'truck',
        text: 'Trước khi ra mắt thị trường, mỗi lô sản phẩm phải vượt qua hệ thống kiểm định cuối cùng – bao gồm cả đánh giá kỹ thuật lẫn cảm quan. Chỉ những sản phẩm đạt mức hoàn thiện tuyệt đối mới được phép xuất xưởng.',
      },
    ],
  },
]
/** Kết quả bước duyệt mẫu, chép đúng tài liệu */
const BASE_PROCESS_GATE_RESULTS = {
  pass: { label: 'Đạt yêu cầu', text: 'Chuyển sang sản xuất hàng loạt.' },
  fail: { label: 'Không đạt', text: 'Quay lại R&D để điều chỉnh, tối ưu.' },
} as const

const BASE_LYOCELL_TRAITS: readonly { title: string; text: string }[] = [
  { title: 'Mềm', text: 'Bề mặt mịn như lụa, rủ nhẹ theo dáng giường.' },
  { title: 'Mát', text: 'Sợi hút ẩm nhanh, giữ cho lưng khô thoáng suốt đêm.' },
  { title: 'Thoáng khí', text: 'Cấu trúc sợi cho không khí lưu thông, không hầm bí.' },
  { title: 'Lành tính', text: 'Dịu với da nhạy cảm, phù hợp cả trẻ nhỏ.' },
]

/* ——— Trang Giới thiệu: Ecopillo tự sửa trong WordPress (liveContent.ts) ——— */

const BASE_ABOUT = {
  moDau: BASE_STORY_OPENING,
  loiNguoiSangLap: BASE_FOUNDER_QUOTE,
  camKet: BASE_BRAND_PROMISE,
  anhNguoiSangLap: BASE_FOUNDER_IMAGE,
  thu: BASE_FOUNDER_LETTER,
  chuKy: [...BASE_FOUNDER_SIGNATURE],
  trietLy: BASE_PHILOSOPHY.map((p) => ({ word: p.word, text: p.text })),
  suMenh: BASE_MISSION,
  tamNhin: BASE_VISION,
  soLieu: BASE_BRAND_STATS.map((s) => ({ value: s.value, label: s.label })),
  chatLieu: BASE_LYOCELL_INTRO,
  loiTayNghe: BASE_CRAFT_QUOTE,
}

export const ABOUT_SET: EditableSet = {
  khoa: 'gioi-thieu',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Giới thiệu',
  moTa: 'Chữ và ảnh của trang Giới thiệu (một phần dùng chung ở trang chủ): câu chuyện, thư người sáng lập, triết lý, sứ mệnh, tầm nhìn, con số.',
  kieu: 'mot',
  goc: BASE_ABOUT,
  truong: [
    { khoa: 'moDau', nhan: 'Câu mở đầu câu chuyện', kieu: 'doan', batBuoc: true },
    { khoa: 'loiNguoiSangLap', nhan: 'Lời người sáng lập (một câu)', kieu: 'chu', batBuoc: true },
    { khoa: 'camKet', nhan: 'Cam kết thương hiệu', kieu: 'doan', batBuoc: true },
    { khoa: 'anhNguoiSangLap', nhan: 'Ảnh người sáng lập', kieu: 'anh', batBuoc: true },
    { khoa: 'thu', nhan: 'Thư người sáng lập', kieu: 'doan-nhieu', batBuoc: true },
    { khoa: 'chuKy', nhan: 'Chữ ký dưới thư (3 dòng: tên, vai trò, danh hiệu)', kieu: 'ds-dong', batBuoc: true },
    { khoa: 'trietLy', nhan: 'Triết lý kinh doanh', kieu: 'ds-cap', batBuoc: true, cap: ['word', 'text'], nhanCap: ['Chữ to', 'Câu mô tả'] },
    { khoa: 'suMenh', nhan: 'Sứ mệnh', kieu: 'doan-nhieu', batBuoc: true },
    { khoa: 'tamNhin', nhan: 'Tầm nhìn', kieu: 'doan', batBuoc: true },
    { khoa: 'soLieu', nhan: 'Con số', kieu: 'ds-cap', batBuoc: true, cap: ['value', 'label'], nhanCap: ['Số', 'Mô tả'] },
    { khoa: 'chatLieu', nhan: 'Đoạn giới thiệu chất liệu', kieu: 'doan', batBuoc: true },
    { khoa: 'loiTayNghe', nhan: 'Câu về tay nghề', kieu: 'chu', batBuoc: true },
  ] satisfies EditableField[],
}

const ABOUT = liveObject(ABOUT_SET.khoa, BASE_ABOUT, ABOUT_SET.truong)

export const STORY_OPENING: string = ABOUT.moDau
export const FOUNDER_QUOTE: string = ABOUT.loiNguoiSangLap
export const BRAND_PROMISE: string = ABOUT.camKet
export const FOUNDER_IMAGE: ImageSource = ABOUT.anhNguoiSangLap
export const FOUNDER_LETTER: readonly string[] = ABOUT.thu
export const FOUNDER_SIGNATURE: readonly string[] = ABOUT.chuKy
export const PHILOSOPHY: readonly { word: string; text: string }[] = ABOUT.trietLy
export const MISSION: readonly string[] = ABOUT.suMenh
export const VISION: string = ABOUT.tamNhin
export const BRAND_STATS: readonly { value: string; label: string }[] = ABOUT.soLieu
export const LYOCELL_INTRO: string = ABOUT.chatLieu
export const CRAFT_QUOTE: string = ABOUT.loiTayNghe

/* ——— Giá trị cốt lõi, danh hiệu, chứng nhận, quy trình, ảnh: Ecopillo tự sửa (Nội dung web → Chữ từng trang) ——— */

const flatSteps = BASE_PRODUCT_PROCESS.flatMap((stage) => stage.steps)

export const { set: ABOUT_MORE_SET, text: ABOUT_MORE } = definePageText(
  'gioi-thieu-them',
  'Giới thiệu: giá trị, chứng nhận, quy trình',
  'Giá trị cốt lõi, danh hiệu, đặc tính vải Lyocell, tiêu đề và ô Đạt / Không đạt của quy trình, chữ các giấy chứng nhận và ghi nhận, ảnh sứ mệnh / tầm nhìn / thư (trang chủ và trang Giới thiệu). Các bước quy trình sửa ở mục "Giới thiệu: các bước quy trình".',
  {
    giaTriCotLoi: dsCap(
      'Giá trị cốt lõi (tối đa 4 ô)',
      ['title', 'text'],
      ['Tên', 'Câu mô tả'],
      BASE_CORE_VALUES.map((v) => ({ title: v.title, text: v.text })),
      'Mỗi dòng một ô, tối đa 4 ô (thẻ trang chủ xếp 2 × 2); biểu tượng lần lượt: huy chương, tái chế, bóng đèn, cộng đồng',
    ),
    danhHieu: chu('Danh hiệu', BASE_AWARD_NAME),
    anhDanhHieu: anh('Ảnh danh hiệu', BASE_AWARD_IMAGE),
    anhSuMenh: anh('Ảnh thẻ Sứ mệnh (trang chủ)', BASE_MISSION_IMAGE),
    anhSuMenhTrangGioiThieu: anh('Ảnh thẻ Sứ mệnh và Giá trị cốt lõi (trang Giới thiệu, thẻ Giá trị ở trang chủ)', BASE_MISSION_IMAGE_ABOUT_PAGE),
    anhTamNhin: anh('Ảnh thẻ Tầm nhìn', BASE_VISION_IMAGE),
    anhThu1: anh('Ảnh thứ nhất trong thư người sáng lập', BASE_FOUNDER_LETTER_IMAGES[0]),
    anhThu2: anh('Ảnh thứ hai trong thư người sáng lập', BASE_FOUNDER_LETTER_IMAGES[1]),
    dacTinhLyocell: dsCap('Đặc tính vải Lyocell (4 ô)', ['title', 'text'], ['Chữ đậm', 'Câu mô tả'], BASE_LYOCELL_TRAITS.map((t) => ({ title: t.title, text: t.text }))),
    quyTrinhTieuDe: chu('Quy trình: tiêu đề', BASE_PRODUCT_PROCESS_TITLE),
    duyetDat: chu('Quy trình: bước duyệt, ô Đạt (nhãn | câu)', `${BASE_PROCESS_GATE_RESULTS.pass.label} | ${BASE_PROCESS_GATE_RESULTS.pass.text}`, 'Nhãn và câu cách nhau bằng dấu |'),
    duyetKhongDat: chu('Quy trình: bước duyệt, ô Không đạt (nhãn | câu)', `${BASE_PROCESS_GATE_RESULTS.fail.label} | ${BASE_PROCESS_GATE_RESULTS.fail.text}`, 'Nhãn và câu cách nhau bằng dấu |'),
    duyetQuayLai: chu('Quy trình: dòng quay lại dưới bước duyệt', 'Không đạt thì quay lại bước 1 (R&D)'),
    chungNhan: dsCap('Giấy chứng nhận chất lượng (3 ô, ảnh giữ theo thứ tự)', ['name', 'text'], ['Tên', 'Câu dưới'], BASE_CERTIFICATES.map((c) => ({ name: c.name, text: c.text }))),
    ghiNhanNhan: chu('Nhãn hàng ghi nhận cá nhân', 'Ghi nhận dành cho chị Phạm Thị Phương'),
    ghiNhan: dsCap('Ghi nhận dành cho người sáng lập (4 ô, ảnh giữ theo thứ tự)', ['name', 'text'], ['Tên', 'Câu dưới'], BASE_FOUNDER_HONOURS.map((c) => ({ name: c.name, text: c.text }))),
    anhChungNhan: dsAnh(
      'Ảnh giấy chứng nhận chất lượng (theo thứ tự các dòng ở trên)',
      BASE_CERTIFICATES.map((c) => `${c.image}.webp`),
      'Ảnh chụp giấy rõ nét, dọc. Thêm một giấy: thêm dòng ở ô chứng nhận và thêm ảnh ở đây cùng thứ tự',
    ),
    anhGhiNhan: dsAnh('Ảnh ghi nhận dành cho người sáng lập (theo thứ tự)', BASE_FOUNDER_HONOURS.map((c) => `${c.image}.webp`)),
  },
)

/** Ghép chữ Ecopillo sửa lên danh sách gốc theo thứ tự; thêm dòng thì bỏ (không có ảnh / biểu tượng cho dòng đó) */
const zipText = <B extends object, T extends object>(base: readonly B[], rows: readonly T[], merge: (b: B, t: T) => B): readonly B[] =>
  base.map((b, i) => (rows[i] ? merge(b, rows[i]) : b)).slice(0, Math.max(1, Math.min(base.length, rows.length)))

const splitPair = (text: string, fallback: { label: string; text: string }) => {
  const [label, rest] = text.split('|').map((part) => part.trim())
  return label && rest ? { label, text: rest } : fallback
}

/** Giá trị cốt lõi: bao nhiêu dòng Ecopillo lưu thì bấy nhiêu ô (tối đa 4, thẻ trang chủ xếp 2 × 2), biểu tượng lặp lại theo vòng */
const MAX_CORE_VALUES = 4
export const CORE_VALUES = ABOUT_MORE.giaTriCotLoi.slice(0, MAX_CORE_VALUES).map((t, i) => ({
  icon: BASE_CORE_VALUES[i % BASE_CORE_VALUES.length].icon,
  title: t.title,
  text: t.text,
}))
export const AWARD_NAME: string = ABOUT_MORE.danhHieu
export const AWARD_IMAGE: ImageSource = ABOUT_MORE.anhDanhHieu
export const MISSION_IMAGE: ImageSource = ABOUT_MORE.anhSuMenh
export const MISSION_IMAGE_ABOUT_PAGE: ImageSource = ABOUT_MORE.anhSuMenhTrangGioiThieu
export const VALUES_IMAGE: ImageSource = MISSION_IMAGE_ABOUT_PAGE
export const VISION_IMAGE: ImageSource = ABOUT_MORE.anhTamNhin
export const FOUNDER_LETTER_IMAGES: readonly ImageSource[] = [ABOUT_MORE.anhThu1, ABOUT_MORE.anhThu2]
export const LYOCELL_TRAITS: readonly { title: string; text: string }[] = ABOUT_MORE.dacTinhLyocell
export const PRODUCT_PROCESS_TITLE: string = ABOUT_MORE.quyTrinhTieuDe
export const PROCESS_GATE_RESULTS = {
  pass: splitPair(ABOUT_MORE.duyetDat, BASE_PROCESS_GATE_RESULTS.pass),
  fail: splitPair(ABOUT_MORE.duyetKhongDat, BASE_PROCESS_GATE_RESULTS.fail),
  backLine: ABOUT_MORE.duyetQuayLai,
}
/* ——— Các bước quy trình: Ecopillo thêm, xoá, đổi thứ tự bước, đổi chặng (đợt G, 24/11/2026) ——— */

interface ProcessRowInput {
  /** Tên chặng; các bước liền nhau cùng tên chặng gom chung một chặng */
  chang: string
  title: string
  text: string
  /** 'co': bước duyệt mẫu (nổi bật, kèm ô Đạt / Không đạt) */
  duyet: string
}

const rowsOfStages = (stages: readonly ProcessStage[]): readonly ProcessRowInput[] =>
  stages.flatMap((stage) => stage.steps.map((step) => ({ chang: stage.name, title: step.title, text: step.text, duyet: step.isGate ? 'co' : 'khong' })))

/**
 * Trước 24/11/2026 tên chặng, chữ bước nằm ở hai ô của bộ "Giới thiệu: giá trị, chứng nhận, quy trình", ghép theo thứ tự.
 * Đọc phần Ecopillo đã lưu ở đó làm dữ liệu ban đầu, để web không đổi khi Ecopillo chưa lưu bộ mới.
 */
const LEGACY_PROCESS = legacyPageText('gioi-thieu-them', {
  quyTrinhChang: dsDong('Quy trình: tên chặng', BASE_PRODUCT_PROCESS.map((stage) => stage.name)),
  quyTrinhBuoc: dsCap('Quy trình: các bước', ['title', 'text'], ['Tên bước', 'Mô tả'], flatSteps.map((step) => ({ title: step.title, text: step.text }))),
})

const LEGACY_STAGES: readonly ProcessStage[] = (() => {
  let index = 0
  return BASE_PRODUCT_PROCESS.map((stage, stageIndex) => ({
    name: LEGACY_PROCESS.quyTrinhChang[stageIndex] ?? stage.name,
    steps: stage.steps.map((step) => {
      const edited = LEGACY_PROCESS.quyTrinhBuoc[index++]
      return edited ? { ...step, title: edited.title, text: edited.text } : step
    }),
  }))
})()

const PROCESS_FIELDS: readonly EditableField[] = [
  { khoa: 'chang', nhan: 'Chặng', kieu: 'chu', batBuoc: true, goiY: 'Các bước liền nhau ghi cùng tên chặng thì gom chung một chặng (Chặng 1, 2, 3… tự đánh số)' },
  { khoa: 'title', nhan: 'Tên bước', kieu: 'chu', batBuoc: true },
  { khoa: 'text', nhan: 'Mô tả', kieu: 'doan', batBuoc: true },
  {
    khoa: 'duyet',
    nhan: 'Kiểu bước',
    kieu: 'chon',
    batBuoc: true,
    luaChon: ['khong', 'co'],
    nhanLuaChon: ['Bước thường', 'Bước duyệt (nổi bật, kèm ô Đạt / Không đạt, dòng quay lại)'],
  },
]

export const PRODUCT_PROCESS_SET: EditableSet = {
  khoa: 'gioi-thieu-quy-trinh',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Giới thiệu: các bước quy trình',
  moTa:
    'Các bước của "Quy trình phát triển sản phẩm" (trang Giới thiệu, chương IV): thêm, xoá, đổi thứ tự bước, đổi tên chặng. Bước tự đánh số. ' +
    'Tiêu đề quy trình, chữ ô Đạt / Không đạt, dòng quay lại sửa ở mục "Giới thiệu: giá trị, chứng nhận, quy trình".',
  kieu: 'nhieu',
  goc: rowsOfStages(BASE_PRODUCT_PROCESS),
  truong: PROCESS_FIELDS,
  tieuDeDong: 'title',
}

const PROCESS_ROWS = liveList<ProcessRowInput>(PRODUCT_PROCESS_SET.khoa, rowsOfStages(LEGACY_STAGES), PROCESS_FIELDS, () => ({
  chang: '',
  title: '',
  text: '',
  duyet: 'khong',
}))

/** Biểu tượng bước thường theo vòng (thứ tự gốc); bước duyệt luôn là chiếc khiên */
const STEP_ICONS: readonly ProcessIcon[] = flatSteps.filter((step) => !step.isGate).map((step) => step.icon)
const GATE_ICON: ProcessIcon = flatSteps.find((step) => step.isGate)?.icon ?? 'shield'

/** Gom các bước liền nhau cùng tên chặng thành một chặng */
export const PRODUCT_PROCESS: readonly ProcessStage[] = (() => {
  let plain = 0
  const stages: { name: string; steps: ProcessStep[] }[] = []
  for (const row of PROCESS_ROWS) {
    const isGate = row.duyet === 'co'
    const step: ProcessStep = {
      title: row.title,
      text: row.text,
      icon: isGate ? GATE_ICON : STEP_ICONS[plain++ % STEP_ICONS.length],
      ...(isGate ? { isGate: true } : {}),
    }
    const last = stages[stages.length - 1]
    if (last && last.name === row.chang) last.steps.push(step)
    else stages.push({ name: row.chang, steps: [step] })
  }
  return stages
})()
const mergeCertificate = (b: Certificate, t: { name: string; text: string }): Certificate => ({
  ...b,
  name: t.name,
  short: t.name === b.name ? b.short : t.name,
  text: t.text,
})
/**
 * Chữ (dsCap) và ảnh (dsAnh) ghép theo thứ tự. Ảnh khác ảnh gốc thì dùng ảnh Ecopillo chọn; dòng thêm mới chỉ hiện khi có ảnh
 * cùng thứ tự (một giấy chứng nhận không có ảnh thì không hiện).
 */
const withImages = (base: readonly Certificate[], rows: readonly { name: string; text: string }[], images: readonly string[]): readonly Certificate[] => {
  const kept = zipText(base, rows, mergeCertificate).map((c, i) =>
    images[i] && images[i] !== `${base[i]?.image}.webp` ? { ...c, imageUrl: images[i] } : c,
  )
  const extra = rows.slice(base.length).flatMap((row, j) => {
    const url = images[base.length + j]
    return url ? [{ name: row.name, short: row.name, text: row.text, image: url, imageUrl: url }] : []
  })
  return [...kept, ...extra]
}

export const CERTIFICATES: readonly Certificate[] = withImages(BASE_CERTIFICATES, ABOUT_MORE.chungNhan, ABOUT_MORE.anhChungNhan)
export const FOUNDER_HONOURS_LABEL: string = ABOUT_MORE.ghiNhanNhan
export const FOUNDER_HONOURS: readonly Certificate[] = withImages(BASE_FOUNDER_HONOURS, ABOUT_MORE.ghiNhan, ABOUT_MORE.anhGhiNhan)
