import type { ImageSource } from './catalog'

/**
 * Chữ giới thiệu khối khách sạn, dùng chung cho trang chủ (Hospitality) và trang Khách sạn và dự án (HotelPage).
 * Chữ của Ecopillo gửi 16/10/2026 (yêu cầu sửa mục 37, 38, 39), giữ nguyên văn.
 */

/** Mục 37: nhãn thêm "Dự án" */
export const HOTEL_EYEBROW = 'Khách sạn · Resort · Nhà nghỉ · Dự án'

/**
 * Mục 38: dòng in hoa của khách làm dòng phụ dưới tiêu đề "Giấc ngủ năm sao…".
 * [XÁC NHẬN] khách chưa trả lời có thay hẳn tiêu đề đó không (câu hỏi gửi khách số 28).
 */
export const HOTEL_INTRO_HEADING = 'Ecopillo – Giải pháp chăn ga gối đệm toàn diện cho khách sạn & dự án'

/**
 * Mục 38: ba đoạn giới thiệu. Trang chủ chỉ hiện đoạn đầu. Trang Khách sạn và dự án hiện đủ:
 * đoạn đầu ở phần đầu trang, đoạn 2, 3 dưới câu trích nền chàm (để phần đầu trang không cao quá, ảnh không bị cắt lệch)
 */
export const HOTEL_INTRO: readonly string[] = [
  'Ecopillo chuyên cung cấp chăn, ga, gối, đệm số lượng lớn cho khách sạn, resort, nhà nghỉ và các dự án lưu trú.',
  'Với chất liệu được tuyển chọn kỹ lưỡng, đường may chắc chắn với mật độ 4 mũi/cm cùng các dòng đệm đáp ứng đa dạng nhu cầu sử dụng, Ecopillo hướng đến những sản phẩm bền đẹp, phù hợp với cường độ sử dụng thường xuyên và nhu cầu vận hành thực tế.',
  'Chúng tôi mang đến giải pháp đồng bộ từ chăn ga gối đến đệm, giúp đối tác tối ưu chi phí đầu tư, kéo dài thời gian sử dụng sản phẩm và nâng cao trải nghiệm nghỉ ngơi của khách hàng.',
]

/**
 * Ba ý cạnh lưới logo đối tác ở trang Khách sạn và dự án (owner chọn kiểu B 24/10/2026).
 * Rút từ 4 đoạn chữ trang 5 catalog Ecopillo 22.07.2026, giữ số liệu của catalog.
 */
export const HOTEL_PARTNER_POINTS: readonly { value: string; text: string }[] = [
  { value: '3–5 sao', text: 'Đáp ứng tiêu chuẩn khắt khe của khách sạn, khu nghỉ dưỡng, nhà hàng và spa trên toàn quốc.' },
  { value: 'Hàng trăm phòng', text: 'Sản xuất chủ động, cung ứng đồng bộ cho dự án từ nhỏ đến lớn, đúng tiến độ, đúng số lượng.' },
  { value: 'Đồng nhất', text: 'Chất lượng như nhau theo yêu cầu riêng của từng đối tác, minh bạch trong sản xuất.' },
]

/**
 * Đồ vải khách sạn theo trang 65 catalog.
 * Trước 05/11/2026 dùng ở khối "sáu lớp"; từ 05/11 khối đó được thay bằng Hàng trắng (HOTEL_WHITE_GOODS).
 * Giữ hằng này để chỗ khác còn tham chiếu chữ catalog.
 */
export const HOTEL_LINEN = {
  bedding: 'Cotton T250, T255, T300, T400',
  valance: 'Vải gấm',
  towels: 'Cotton',
  sizes: 'Kích thước tiêu chuẩn hoặc may theo yêu cầu.',
} as const

/** Mục 39: bốn lợi ích, thay bốn dòng cũ khách đã gạch */
export const HOTEL_BENEFITS: readonly string[] = [
  'Tư vấn đúng nhu cầu, phù hợp ngân sách',
  'Giải pháp trọn gói cho từng mô hình từ vận chuyển đến setup cho từng phòng',
  'Báo giá ưu đãi theo số lượng và từng hạng mục',
  'Tư vấn chất liệu theo công năng, tần suất sử dụng',
]

/**
 * Mục 39: ảnh phòng khách sạn lấy từ trang khách sạn của web cũ (/danh-muc-san-pham/du-an-khach-san-nha-nghi/),
 * Ecopillo chỉ định 23/10/2026 thay ảnh bộ chăn ga gia đình. Nén bằng tools/nen-anh-khach-san-2026-10-23.py.
 * Chưa nêu tên khách sạn: Ecopillo chưa cho phép.
 */
const hotelPhoto = (key: string, alt: string): ImageSource => ({
  src: `/images/hotel/${key}.webp`,
  srcSet: `/images/hotel/${key}-sm.webp 640w, /images/hotel/${key}.webp 1600w`,
  alt,
})

export const HOTEL_PHOTOS = {
  /** Đầu trang Khách sạn và dự án; tải trước trong index.html, đổi thì sửa cả ở đó */
  hero: hotelPhoto('phong-king-cua-kinh', 'Phòng khách sạn giường đôi lớn trải chăn ga trắng Ecopillo, cửa kính nhìn ra thành phố'),
  /** Khối khách sạn ở trang chủ */
  home: hotelPhoto('phong-king-den-long', 'Phòng khách sạn giường đôi lớn, chăn ga gối trắng Ecopillo viền chỉ'),
  /** Cạnh form báo giá */
  quote: hotelPhoto('phong-twin-ho-guom', 'Phòng khách sạn hai giường đơn trải chăn ga trắng Ecopillo'),
  /** Ảnh nhóm Đồ vải trên giường (cũng dùng làm ảnh phụ cho món Chăn ga) */
  sheets: hotelPhoto('phong-hai-giuong', 'Phòng khách sạn hai giường đôi, ga bọc và chăn trắng Ecopillo có đường viền'),
  /** Ảnh nhóm Đồ phòng tắm / món Khăn các loại, ảnh trang 65 catalog */
  towels: {
    src: '/images/hotel/khan-cotton.webp',
    srcSet: '/images/hotel/khan-cotton-sm.webp 480w, /images/hotel/khan-cotton.webp 800w',
    alt: 'Khăn tắm cotton trắng Ecopillo gấp chồng',
  },
  /**
   * Tấm trang trí vải gấm (khách gửi 05/11/2026). Nén 1600×1199 / 640×480.
   * [ECOPILLO GỬI ẢNH] các món còn lại của Hàng trắng vẫn chờ file gốc.
   */
  runner: hotelPhoto('tam-trang-tri-vai-gam', 'Tấm trang trí vải gấm vắt ngang giường khách sạn, kèm ảnh cận vải'),
} as const

export type HotelWhiteGoodsGroupId = 'dem' | 'giuong' | 'tam'

export interface HotelWhiteGoodsItem {
  /** Tên món theo chữ khách gửi 05/11/2026 */
  name: string
  /** Chữ phụ ngắn (catalog trang 65); không bịa thông số */
  note?: string
  /** Chip mật độ sợi, chỉ món Chăn ga */
  chips?: readonly string[]
  /** Ảnh riêng của món (nếu khác ảnh nhóm) */
  image?: ImageSource
}

export interface HotelWhiteGoodsGroup {
  id: HotelWhiteGoodsGroupId
  /** [XÁC NHẬN tên nhóm] — em đặt theo danh sách khách 05/11 */
  label: string
  /** Một câu giải thích nhóm */
  blurb: string
  /** Ảnh lớn khi tab này đang mở */
  image: ImageSource
  /** true = ảnh tạm (đệm khách sạn chưa có ảnh riêng) */
  temporaryImage?: boolean
  items: readonly HotelWhiteGoodsItem[]
}

/**
 * Hàng trắng khách sạn (mục 12 phản hồi 05/11, phương án C): ba nhóm thay khối "sáu lớp".
 * Tên nhóm theo chữ khách; mật độ sợi theo catalog trang 65 (T250, T255, T300, T400), khớp bảng giá 2026.
 * Ruột chăn / ruột gối không có trong danh sách khách nên không đưa vào đây (câu hỏi gửi Ecopillo).
 */
export const HOTEL_WHITE_GOODS: readonly HotelWhiteGoodsGroup[] = [
  {
    id: 'dem',
    // [XÁC NHẬN tên nhóm "Đệm và divan"]
    label: 'Đệm và divan',
    blurb: 'Đệm lò xo cho giường khách sạn, kèm divan.',
    // Tạm dùng ảnh phòng; chờ ảnh đệm khách sạn
    image: HOTEL_PHOTOS.home,
    temporaryImage: true,
    items: [
      // [ECOPILLO GỬI ẢNH đệm lò xo liên kết] — chưa có thông số (độ dày, bảo hành)
      { name: 'Đệm lò xo liên kết' },
      // [ECOPILLO GỬI ẢNH đệm lò xo túi 24 cm]
      { name: 'Đệm lò xo túi độc lập 24 cm' },
      // [ECOPILLO GỬI ẢNH đệm 5 sao]
      { name: 'Đệm lò xo túi cao cấp 5 sao' },
      // [XÁC NHẬN cùng loại Divan Ecopillo đang bán trên web] · [ECOPILLO GỬI ẢNH divan]
      { name: 'Divan' },
    ],
  },
  {
    id: 'giuong',
    // [XÁC NHẬN tên nhóm "Đồ vải trên giường"]
    label: 'Đồ vải trên giường',
    blurb: 'Trắng tinh hoặc màu theo nhận diện khách sạn.',
    image: HOTEL_PHOTOS.runner,
    items: [
      {
        name: 'Chăn ga',
        // T255 thay T200: catalog trang 65 ghi T250, T255, T300, T400; bảng giá 2026 (khách gửi 09/11/2026) có
        // "Bộ ga trắng khách sạn T255" và "T300" cỡ 180×200, đều "Giá liên hệ" nên không ghi giá
        chips: ['T250', 'T255', 'T300', 'T400'],
        note: 'Cotton · ga bọc, ga phủ, vỏ chăn, vỏ gối',
        image: HOTEL_PHOTOS.sheets,
      },
      // [ECOPILLO GỬI ẢNH váy giường]
      { name: 'Váy giường', note: 'Vải gấm' },
      { name: 'Tấm trang trí', note: 'Vải gấm', image: HOTEL_PHOTOS.runner },
    ],
  },
  {
    id: 'tam',
    // [XÁC NHẬN tên nhóm "Đồ phòng tắm"]
    label: 'Đồ phòng tắm',
    blurb: HOTEL_LINEN.sizes,
    image: HOTEL_PHOTOS.towels,
    items: [
      // [ECOPILLO GỬI ẢNH áo choàng tắm] — chưa rõ chất liệu
      { name: 'Áo choàng tắm' },
      { name: 'Khăn các loại', note: 'Cotton · khăn tắm, khăn tay, khăn mặt', image: HOTEL_PHOTOS.towels },
    ],
  },
] as const

/** Thẻ khối "Sản phẩm cho khách sạn": trang sản phẩm có sẵn, hoặc món chưa có trang riêng (bấm thì điền sẵn form báo giá) */
export type HotelProductEntry =
  | { kind: 'product'; slug: string }
  | { kind: 'quote'; name: string; note: string; image: ImageSource }

/**
 * Chín sản phẩm của danh mục khách sạn web cũ (/danh-muc-san-pham/du-an-khach-san-nha-nghi/), theo thứ tự anh Quang
 * gửi qua Zalo 09/11/2026: "làm sao cho xuất hiện được những sp này ở phần Khách sạn & dự án".
 * Chăn ga khách sạn và khăn chưa có trang riêng: bảng giá 2026 ghi "Giá liên hệ", nên bấm thẻ là điền sẵn form báo giá.
 */
export const HOTEL_PRODUCTS: readonly HotelProductEntry[] = [
  { kind: 'product', slug: 'dem-tron-cao-cap-ecopillo' },
  {
    kind: 'quote',
    name: 'Chăn ga gối đệm khách sạn',
    // Mật độ sợi theo catalog trang 65, khớp món Chăn ga của Hàng trắng
    note: 'Cotton T250, T255, T300, T400 · may theo cỡ giường',
    image: HOTEL_PHOTOS.sheets,
  },
  { kind: 'product', slug: 'divan-ecopillo' },
  { kind: 'product', slug: 'dem-lo-xo-tui-doc-lap' },
  { kind: 'product', slug: 'ruot-goi-micro-fiber' },
  { kind: 'product', slug: 'chan-dong-micro-fiber' },
  { kind: 'product', slug: 'topper-micro-fiber' },
  { kind: 'product', slug: 'dem-lo-xo-eco-fresh' },
  {
    kind: 'quote',
    name: 'Khăn tắm, khăn tay, khăn mặt',
    // Cỡ theo bảng giá 2026 trang 20 (Đồ vải khách sạn); chất liệu theo catalog trang 65
    note: 'Cotton · khăn tắm 70×140, khăn tay 35×70, khăn mặt 35×35 cm',
    image: HOTEL_PHOTOS.towels,
  },
]
