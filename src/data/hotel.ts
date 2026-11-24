import type { ImageSource } from './catalog'
import { liveList, liveObject, type EditableField, type EditableSet } from './liveContent'
import { anh, chonNhieu, chu, definePageText, doan, dsCap, dsDong, legacyPageText, link } from './pageText/define'
import { ALL_PRODUCTS, isProductShown, productBySlug, productKind } from './products'

/**
 * Chữ giới thiệu khối khách sạn, dùng chung cho trang chủ (Hospitality) và trang Khách sạn và dự án (HotelPage).
 * Chữ của Ecopillo gửi 16/10/2026 (yêu cầu sửa mục 37, 38, 39), giữ nguyên văn.
 */

/** Mục 37: nhãn thêm "Dự án" */
const BASE_HOTEL_EYEBROW = 'Khách sạn · Resort · Nhà nghỉ · Dự án'

/**
 * Mục 38: dòng in hoa của khách làm dòng phụ dưới tiêu đề "Giấc ngủ năm sao…".
 * [XÁC NHẬN] khách chưa trả lời có thay hẳn tiêu đề đó không (câu hỏi gửi khách số 28).
 */
const BASE_HOTEL_INTRO_HEADING = 'Ecopillo – Giải pháp chăn ga gối đệm toàn diện cho khách sạn & dự án'

/**
 * Mục 38: ba đoạn giới thiệu. Trang chủ chỉ hiện đoạn đầu. Trang Khách sạn và dự án hiện đủ:
 * đoạn đầu ở phần đầu trang, đoạn 2, 3 dưới câu trích nền chàm (để phần đầu trang không cao quá, ảnh không bị cắt lệch)
 */
const BASE_HOTEL_INTRO: readonly string[] = [
  'Ecopillo chuyên cung cấp chăn, ga, gối, đệm số lượng lớn cho khách sạn, resort, nhà nghỉ và các dự án lưu trú.',
  'Với chất liệu được tuyển chọn kỹ lưỡng, đường may chắc chắn với mật độ 4 mũi/cm cùng các dòng đệm đáp ứng đa dạng nhu cầu sử dụng, Ecopillo hướng đến những sản phẩm bền đẹp, phù hợp với cường độ sử dụng thường xuyên và nhu cầu vận hành thực tế.',
  'Chúng tôi mang đến giải pháp đồng bộ từ chăn ga gối đến đệm, giúp đối tác tối ưu chi phí đầu tư, kéo dài thời gian sử dụng sản phẩm và nâng cao trải nghiệm nghỉ ngơi của khách hàng.',
]

/**
 * Ba ý cạnh lưới logo đối tác ở trang Khách sạn và dự án (owner chọn kiểu B 24/10/2026).
 * Rút từ 4 đoạn chữ trang 5 catalog Ecopillo 22.07.2026, giữ số liệu của catalog.
 */
const BASE_HOTEL_PARTNER_POINTS: readonly { value: string; text: string }[] = [
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
const BASE_HOTEL_BENEFITS: readonly string[] = [
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

const BASE_HOTEL_PHOTOS = {
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

/** Ba nhóm gốc; nhóm Ecopillo thêm ở Nội dung web có mã "nhom-4", "nhom-5"… */
export type HotelWhiteGoodsGroupId = string

/** Mật độ sợi của món Chăn ga (catalog trang 65) */
const BASE_CHAN_GA_CHIPS: readonly string[] = ['T250', 'T255', 'T300', 'T400']

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
const BASE_HOTEL_WHITE_GOODS: readonly HotelWhiteGoodsGroup[] = [
  {
    id: 'dem',
    // [XÁC NHẬN tên nhóm "Đệm và divan"]
    label: 'Đệm và divan',
    blurb: 'Đệm lò xo cho giường khách sạn, kèm divan.',
    // Tạm dùng ảnh phòng; chờ ảnh đệm khách sạn
    image: BASE_HOTEL_PHOTOS.home,
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
    image: BASE_HOTEL_PHOTOS.runner,
    items: [
      {
        name: 'Chăn ga',
        // T255 thay T200: catalog trang 65 ghi T250, T255, T300, T400; bảng giá 2026 (khách gửi 09/11/2026) có
        // "Bộ ga trắng khách sạn T255" và "T300" cỡ 180×200, đều "Giá liên hệ" nên không ghi giá
        chips: BASE_CHAN_GA_CHIPS,
        note: 'Cotton · ga bọc, ga phủ, vỏ chăn, vỏ gối',
        image: BASE_HOTEL_PHOTOS.sheets,
      },
      // [ECOPILLO GỬI ẢNH váy giường]
      { name: 'Váy giường', note: 'Vải gấm' },
      { name: 'Tấm trang trí', note: 'Vải gấm', image: BASE_HOTEL_PHOTOS.runner },
    ],
  },
  {
    id: 'tam',
    // [XÁC NHẬN tên nhóm "Đồ phòng tắm"]
    label: 'Đồ phòng tắm',
    blurb: HOTEL_LINEN.sizes,
    image: BASE_HOTEL_PHOTOS.towels,
    items: [
      // [ECOPILLO GỬI ẢNH áo choàng tắm] — chưa rõ chất liệu
      { name: 'Áo choàng tắm' },
      { name: 'Khăn các loại', note: 'Cotton · khăn tắm, khăn tay, khăn mặt', image: BASE_HOTEL_PHOTOS.towels },
    ],
  },
] as const

/** Thẻ khối "Sản phẩm cho khách sạn": trang sản phẩm có sẵn, hoặc món chưa có trang riêng (bấm thì điền sẵn form báo giá) */
export type HotelProductEntry =
  | { kind: 'product'; slug: string }
  | { kind: 'quote'; name: string; note: string; image?: ImageSource }

/** Hai món chưa có trang riêng trong khối "Sản phẩm cho khách sạn" (chữ gốc; Ecopillo sửa ở HOTEL_PAGE_SET) */
const BASE_HOTEL_QUOTES: readonly { name: string; note: string; image: ImageSource }[] = [
  {
    name: 'Chăn ga gối đệm khách sạn',
    // Mật độ sợi theo catalog trang 65, khớp món Chăn ga của Hàng trắng
    note: 'Cotton T250, T255, T300, T400 · may theo cỡ giường',
    image: BASE_HOTEL_PHOTOS.sheets,
  },
  {
    name: 'Khăn tắm, khăn tay, khăn mặt',
    // Cỡ theo bảng giá 2026 trang 20 (Đồ vải khách sạn); chất liệu theo catalog trang 65
    note: 'Cotton · khăn tắm 70×140, khăn tay 35×70, khăn mặt 35×35 cm',
    image: BASE_HOTEL_PHOTOS.towels,
  },
]

/* ——— Chữ khối khách sạn (trang chủ + trang Khách sạn và dự án): Ecopillo tự sửa trong WordPress (liveContent.ts) ——— */

const BASE_HOTEL = {
  nhan: BASE_HOTEL_EYEBROW,
  tieuDe: BASE_HOTEL_INTRO_HEADING,
  gioiThieu: BASE_HOTEL_INTRO,
  diemNoiBat: BASE_HOTEL_PARTNER_POINTS.map((p) => ({ value: p.value, text: p.text })),
  loiIch: BASE_HOTEL_BENEFITS,
}

export const HOTEL_SET: EditableSet = {
  khoa: 'khach-san',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Khách sạn và dự án',
  moTa: 'Chữ khối khách sạn ở trang chủ và trang Khách sạn và dự án: nhãn, tiêu đề, giới thiệu, điểm nổi bật, lợi ích.',
  kieu: 'mot',
  goc: BASE_HOTEL,
  truong: [
    { khoa: 'nhan', nhan: 'Nhãn nhỏ', kieu: 'chu', batBuoc: true },
    { khoa: 'tieuDe', nhan: 'Tiêu đề', kieu: 'chu', batBuoc: true },
    { khoa: 'gioiThieu', nhan: 'Đoạn giới thiệu', kieu: 'doan-nhieu', batBuoc: true },
    { khoa: 'diemNoiBat', nhan: 'Điểm nổi bật', kieu: 'ds-cap', batBuoc: true, cap: ['value', 'text'], nhanCap: ['Chữ to', 'Mô tả'] },
    { khoa: 'loiIch', nhan: 'Lợi ích khi hợp tác', kieu: 'ds-dong', batBuoc: true },
  ] satisfies EditableField[],
}

const HOTEL = liveObject(HOTEL_SET.khoa, BASE_HOTEL, HOTEL_SET.truong)

export const HOTEL_EYEBROW: string = HOTEL.nhan
export const HOTEL_INTRO_HEADING: string = HOTEL.tieuDe
export const HOTEL_INTRO: readonly string[] = HOTEL.gioiThieu
export const HOTEL_PARTNER_POINTS: readonly { value: string; text: string }[] = HOTEL.diemNoiBat
export const HOTEL_BENEFITS: readonly string[] = HOTEL.loiIch

/* ——— Chữ, ảnh trang Khách sạn và dự án: Ecopillo tự sửa (Nội dung web → Chữ từng trang) ——— */

/** Thẻ sản phẩm có trang riêng, thứ tự gốc (anh Quang, Zalo 09/11/2026) */
const BASE_HOTEL_PRODUCT_SLUGS: readonly string[] = [
  'dem-tron-cao-cap-ecopillo',
  'divan-ecopillo',
  'dem-lo-xo-tui-doc-lap',
  'ruot-goi-micro-fiber',
  'chan-dong-micro-fiber',
  'topper-micro-fiber',
  'dem-lo-xo-eco-fresh',
]

/**
 * Lựa chọn: sản phẩm lẻ (cả chăn hè Lyocell); bộ chăn ga có khối riêng. Web nhận các ô tích theo thứ tự lựa chọn,
 * nên sản phẩm gốc đứng đầu đúng thứ tự đang hiện
 */
const PRODUCT_CHOICES = [
  ...BASE_HOTEL_PRODUCT_SLUGS.flatMap((slug) => productBySlug(slug) ?? []),
  ...ALL_PRODUCTS.filter((p) => productKind(p) !== 'bo-chan-ga' && !BASE_HOTEL_PRODUCT_SLUGS.includes(p.slug)),
]

const whiteGoodsItems = (id: HotelWhiteGoodsGroupId) =>
  (BASE_HOTEL_WHITE_GOODS.find((g) => g.id === id)?.items ?? []).map((item) => ({ name: item.name, note: item.note ?? '-' }))

export const { set: HOTEL_PAGE_SET, text: HOTEL_PAGE } = definePageText(
  'khach-san',
  'Trang Khách sạn và dự án',
  'Tiêu đề, các khối, sản phẩm, 5 bước làm việc, form báo giá, chữ khối Hàng trắng, ảnh của trang Khách sạn và dự án. Đoạn giới thiệu, điểm nổi bật, lợi ích ở bộ "Khách sạn và dự án"; nhóm Hàng trắng, món chưa có trang riêng ở bộ riêng.',
  {
    // Mô tả viết tay 08/11/2026 (C2)
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Ecopillo cung cấp chăn ga gối đệm số lượng lớn cho khách sạn, resort, nhà nghỉ: đường may 4 mũi/cm, giải pháp đồng bộ, báo giá theo số lượng.',
    ),
    // Chị Phương 09/11/2026: "cái này có thể ghi 2 dòng đk k"
    duongDan: chu('Đường dẫn đầu trang: tên trang', 'Khách sạn và dự án'),
    tieuDe: chu('Đầu trang: tiêu đề', 'Giấc ngủ năm sao | cho khách lưu trú', 'Dấu | là chỗ xuống dòng'),
    nutBaoGia: chu('Đầu trang: chữ nút', 'Nhận báo giá'),
    linkBaoGia: link(
      'Đầu trang: link nút',
      '#bao-gia',
      '#bao-gia là form báo giá cuối trang; cũng nhận /duong-dan/ hay https://…. Khối đó đã ẩn ở Bố cục thì nút tự ẩn',
    ),
    anhDau: anh('Đầu trang: ảnh', BASE_HOTEL_PHOTOS.hero, 'Ảnh này tải trước để trang mở nhanh: đổi ảnh thì báo bên làm web cập nhật'),
    anhTrangChu: anh('Ảnh khối khách sạn ở trang chủ', BASE_HOTEL_PHOTOS.home),
    doiTacNhan: chu('Đối tác: nhãn nhỏ', 'Đối tác của chúng tôi'),
    doiTacTieuDe: chu('Đối tác: tiêu đề', 'Đối tác tin cậy của khách sạn, khu nghỉ dưỡng'),
    chungNhanNhan: chu('Đối tác: nhãn chứng nhận', 'Chứng nhận, danh hiệu'),
    trichDan: chu('Nền chàm: câu trích', '“Bền cho vận hành, êm cho khách nghỉ.”'),
    sanPhamNhan: chu('Sản phẩm: nhãn nhỏ', 'Sản phẩm cho khách sạn'),
    sanPhamTieuDe: chu('Sản phẩm: tiêu đề', 'Đệm, ruột, đồ vải cho phòng lưu trú'),
    sanPhamChu: doan(
      'Sản phẩm: đoạn',
      'Giá theo số lượng và số phòng: Ecopillo báo giá riêng cho từng khách sạn, dự án. Bấm thẻ để xem chi tiết hoặc nhận báo giá.',
    ),
    theGiaLienHe: chu('Sản phẩm, Hàng trắng: chữ giá', 'Giá liên hệ'),
    theNhanBaoGia: chu('Sản phẩm: chữ trên thẻ món chưa có trang', 'Nhận báo giá'),
    theXemSanPham: chu('Sản phẩm: chữ trên thẻ có trang sản phẩm', 'Xem sản phẩm'),
    sanPham: {
      ...chonNhieu(
        'Sản phẩm: các thẻ sản phẩm có trang riêng',
        PRODUCT_CHOICES.map((p) => p.slug),
        PRODUCT_CHOICES.map((p) => p.name),
        BASE_HOTEL_PRODUCT_SLUGS,
        'Thứ tự theo danh sách tích. Món chưa có trang riêng (bấm là điền form báo giá) sửa ở mục "Khách sạn: món chưa có trang riêng"',
      ),
      // Sản phẩm Ecopillo đăng mới trong Woo sau lần dựng cũng tích được (đợt G)
      luaChonThem: [{ nguon: 'san-pham' }],
    },
    canBaoGia: chu('Form báo giá: chữ điền sẵn khi bấm một món', 'Cần báo giá: {ten}', '{ten} là tên món Quý khách bấm'),
    hangTrangNhan: chu('Hàng trắng: nhãn nhỏ', 'Hàng trắng khách sạn'),
    hangTrangTieuDe: chu('Hàng trắng: tiêu đề', 'Hàng trắng cho phòng lưu trú'),
    hangTrangChu: doan('Hàng trắng: đoạn', 'Đệm, đồ vải trên giường và đồ phòng tắm. Giá báo theo số phòng, cỡ giường và số lượng.'),
    hangTrangNut: chu('Hàng trắng: chữ nút báo giá', 'Liên hệ báo giá'),
    hangTrangKichThuoc: chu('Hàng trắng: dòng dưới nút', HOTEL_LINEN.sizes),
    anhCanVai: anh('Hàng trắng: ảnh cận vải nhỏ đè góc', {
      src: '/images/details/vai-ed25.webp',
      srcSet: '',
      alt: 'Cận chất vải Lyocell của bộ Eco Doris ED25',
    }),
    cachLamNhan: chu('Cách làm việc: nhãn nhỏ', 'Cách làm việc'),
    cachLamTieuDe: chu('Cách làm việc: tiêu đề', 'Từ khảo sát đến nghiệm thu'),
    buoc: dsCap('Cách làm việc: các bước', ['title', 'text'], ['Tên bước', 'Mô tả'], [
      { title: 'Khảo sát, tư vấn', text: 'Nhận số phòng, cỡ giường, phong cách; gửi mẫu vải để chọn.' },
      { title: 'Báo giá, may mẫu', text: 'Báo giá theo số lượng, may một bộ mẫu để duyệt chất liệu và màu.' },
      { title: 'Sản xuất', text: 'May theo số đo đã chốt, kiểm từng bộ trước khi đóng gói.' },
      { title: 'Giao, trải thử', text: 'Giao tận nơi, trải thử trên giường mẫu trước khi nghiệm thu.' },
      { title: 'Bổ sung, bảo hành', text: 'Bổ sung đúng mẫu khi cần, bảo hành theo hợp đồng.' },
    ]),
    cachLamGhiChu: doan('Cách làm việc: dòng dưới các bước', 'Số lượng tối thiểu và thời gian may Ecopillo báo theo từng dự án, cùng với báo giá.'),
    baoGiaNhan: chu('Báo giá: nhãn nhỏ', 'Nhận báo giá'),
    baoGiaTieuDe: chu('Báo giá: tiêu đề', 'Gửi yêu cầu cho dự án của Quý khách'),
    baoGiaChu: doan('Báo giá: đoạn', 'Ghi số phòng, cỡ giường và món cần may. Bộ phận dự án gọi lại, gửi mẫu vải và báo giá riêng.'),
    baoGiaViDu: doan('Báo giá: chữ mờ ví dụ trong ô tin nhắn', 'Ví dụ: khách sạn 40 phòng ở Đà Nẵng, 20 giường 1m6 và 20 giường 1m8, cần ga bọc, vỏ chăn, ruột gối…'),
    baoGiaNut: chu('Báo giá: chữ nút gửi', 'Gửi yêu cầu báo giá'),
    anhBaoGia: anh('Báo giá: ảnh cạnh form', BASE_HOTEL_PHOTOS.quote),
    hangTrangDoc: chu('Hàng trắng: hàng nút nhóm (trình đọc màn hình)', 'Nhóm hàng trắng'),
    baoGiaMonDoc: chu('Hàng trắng: nút báo giá từng món (trình đọc màn hình)', 'Liên hệ báo giá {ten}', '{ten} là tên món'),
  },
)

export const HOTEL_PHOTOS = { ...BASE_HOTEL_PHOTOS, hero: HOTEL_PAGE.anhDau, home: HOTEL_PAGE.anhTrangChu, quote: HOTEL_PAGE.anhBaoGia }

/** Ảnh cận vải đè góc ảnh nhóm ở khối Hàng trắng */
export const WHITE_GOODS_DETAIL_IMAGE: ImageSource = HOTEL_PAGE.anhCanVai

/*
 * ——— Ô đã chuyển sang bộ danh sách riêng (đợt G, 24/11/2026: thêm được thì xoá, đổi thứ tự được) ———
 * Trước đó nhóm Hàng trắng, món từng nhóm, hai món báo giá nằm ở bộ chữ trang Khách sạn, ghép theo thứ tự dòng.
 * Đọc phần Ecopillo đã lưu ở các ô cũ làm dữ liệu ban đầu của bộ mới: web không đổi khi Ecopillo chưa lưu bộ mới.
 */
const LEGACY = legacyPageText('khach-san', {
  hangTrangNhom: dsCap('Hàng trắng: nhóm', ['label', 'blurb'], ['Tên nhóm', 'Câu giải thích'], BASE_HOTEL_WHITE_GOODS.map((g) => ({ label: g.label, blurb: g.blurb }))),
  anhNhomDem: anh('Hàng trắng: ảnh nhóm đệm', BASE_HOTEL_WHITE_GOODS[0].image),
  anhNhomGiuong: anh('Hàng trắng: ảnh nhóm đồ vải trên giường', BASE_HOTEL_WHITE_GOODS[1].image),
  anhNhomTam: anh('Hàng trắng: ảnh nhóm phòng tắm', BASE_HOTEL_WHITE_GOODS[2].image),
  chipChanGa: dsDong('Hàng trắng: các ô mật độ sợi của món Chăn ga', BASE_CHAN_GA_CHIPS),
  monDem: dsCap('Hàng trắng: món nhóm đệm', ['name', 'note'], ['Tên món', 'Chữ phụ'], whiteGoodsItems('dem')),
  monGiuong: dsCap('Hàng trắng: món nhóm đồ vải trên giường', ['name', 'note'], ['Tên món', 'Chữ phụ'], whiteGoodsItems('giuong')),
  monTam: dsCap('Hàng trắng: món nhóm phòng tắm', ['name', 'note'], ['Tên món', 'Chữ phụ'], whiteGoodsItems('tam')),
  monBaoGia: dsCap('Sản phẩm: món chưa có trang riêng', ['name', 'note'], ['Tên món', 'Chữ phụ'], BASE_HOTEL_QUOTES.map((q) => ({ name: q.name, note: q.note }))),
  anhMonBaoGia1: anh('Sản phẩm: ảnh món chăn ga khách sạn', BASE_HOTEL_QUOTES[0].image),
  anhMonBaoGia2: anh('Sản phẩm: ảnh món khăn', BASE_HOTEL_QUOTES[1].image),
})

/* ——— Hàng trắng: nhóm (tab), món, ảnh, ô mật độ sợi ——— */

/** Một nhóm Hàng trắng như lưu trong WordPress. Món: "Tên | chữ phụ", chữ phụ "-" là không có */
interface WhiteGoodsRow {
  label: string
  blurb: string
  image: ImageSource
  mon: readonly { name: string; note: string }[]
  /** Ô nhỏ dưới tên món đầu tiên (mật độ sợi của món Chăn ga) */
  chip?: readonly string[]
}

const LEGACY_GROUP_IMAGES: readonly ImageSource[] = [LEGACY.anhNhomDem, LEGACY.anhNhomGiuong, LEGACY.anhNhomTam]
const LEGACY_ITEMS: readonly (readonly { name: string; note: string }[])[] = [LEGACY.monDem, LEGACY.monGiuong, LEGACY.monTam]

/** Nhóm gốc → dòng; ô mật độ sợi đi theo nhóm có món mang ô (Chăn ga, món đầu của Đồ vải trên giường) */
const whiteGoodsRows = (
  labels: readonly { label: string; blurb: string }[],
  images: readonly ImageSource[],
  items: readonly (readonly { name: string; note: string }[])[],
  chips: readonly string[],
): readonly WhiteGoodsRow[] =>
  BASE_HOTEL_WHITE_GOODS.map((group, i) => {
    // Ô cũ thiếu dòng thì nhóm đó giữ chữ gốc (như trước khi chuyển)
    const label = labels[i] ?? { label: group.label, blurb: group.blurb }
    const hasChips = group.items[0]?.chips !== undefined
    return { label: label.label, blurb: label.blurb, image: images[i] ?? group.image, mon: items[i] ?? [], ...(hasChips ? { chip: chips } : {}) }
  })

const WHITE_GOODS_FIELDS: readonly EditableField[] = [
  { khoa: 'label', nhan: 'Tên nhóm (chữ trên tab)', kieu: 'chu', batBuoc: true },
  { khoa: 'blurb', nhan: 'Câu giải thích', kieu: 'doan', batBuoc: true },
  { khoa: 'image', nhan: 'Ảnh lớn khi mở tab này', kieu: 'anh', batBuoc: true },
  { khoa: 'mon', nhan: 'Các món', kieu: 'ds-cap', batBuoc: true, cap: ['name', 'note'], nhanCap: ['Tên món', 'Chữ phụ (- là không có)'] },
  { khoa: 'chip', nhan: 'Ô nhỏ dưới tên món đầu tiên', kieu: 'ds-dong', goiY: 'Mỗi dòng một ô, ví dụ mật độ sợi T300. Để trống: không có ô' },
]

export const HOTEL_WHITE_GOODS_SET: EditableSet = {
  khoa: 'khach-san-hang-trang',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Khách sạn: nhóm Hàng trắng',
  moTa:
    'Các tab của khối Hàng trắng (trang Khách sạn và dự án): tên nhóm, câu giải thích, ảnh, các món, ô mật độ sợi. Thêm, xoá, đổi thứ tự nhóm ở đây. ' +
    'Tiêu đề khối, chữ nút, ảnh cận vải sửa ở bộ chữ "Trang Khách sạn và dự án".',
  kieu: 'nhieu',
  goc: whiteGoodsRows(
    BASE_HOTEL_WHITE_GOODS.map((g) => ({ label: g.label, blurb: g.blurb })),
    BASE_HOTEL_WHITE_GOODS.map((g) => g.image),
    BASE_HOTEL_WHITE_GOODS.map((g) => whiteGoodsItems(g.id)),
    BASE_CHAN_GA_CHIPS,
  ),
  truong: WHITE_GOODS_FIELDS,
  tieuDeDong: 'label',
}

const WHITE_GOODS_ROWS = liveList<WhiteGoodsRow>(
  HOTEL_WHITE_GOODS_SET.khoa,
  whiteGoodsRows(LEGACY.hangTrangNhom, LEGACY_GROUP_IMAGES, LEGACY_ITEMS, LEGACY.chipChanGa),
  WHITE_GOODS_FIELDS,
  () => ({ label: '', blurb: '', image: { src: '', srcSet: '', alt: '' }, mon: [] }),
)

/** Mã tab: ba nhóm đầu giữ mã cũ (dem, giuong, tam: HTML dựng sẵn không đổi), nhóm thêm đánh số */
const groupIdOf = (index: number): string => BASE_HOTEL_WHITE_GOODS[index]?.id ?? `nhom-${index + 1}`

export const HOTEL_WHITE_GOODS: readonly HotelWhiteGoodsGroup[] = WHITE_GOODS_ROWS.map((row, i) => {
  const chips = (row.chip ?? []).filter(Boolean)
  return {
    id: groupIdOf(i),
    label: row.label,
    blurb: row.blurb,
    image: row.image,
    items: row.mon.map((item, j) => ({
      name: item.name,
      ...(item.note === '-' ? {} : { note: item.note }),
      ...(j === 0 && chips.length ? { chips } : {}),
    })),
  }
})

/* ——— Sản phẩm cho khách sạn: thẻ sản phẩm có trang riêng + thẻ món báo giá ——— */

/** Món chưa có trang riêng như lưu trong WordPress */
interface QuoteRow {
  name: string
  note?: string
  image?: ImageSource
  /** Vị trí thẻ trong khối (1 = thẻ đầu); không có thì xếp cuối */
  viTri?: number
}

/** Vị trí gốc: chăn ga khách sạn là thẻ thứ 2, khăn xếp cuối (anh Quang, Zalo 09/11/2026) */
const BASE_QUOTE_POSITIONS: readonly (number | undefined)[] = [2, undefined]

const quoteRows = (texts: readonly { name: string; note: string }[], images: readonly ImageSource[]): readonly QuoteRow[] =>
  BASE_HOTEL_QUOTES.map((base, i) => {
    // Ô cũ thiếu dòng thì món đó giữ chữ gốc (như trước khi chuyển)
    const text = texts[i]
    const viTri = BASE_QUOTE_POSITIONS[i]
    return { name: text?.name || base.name, note: text?.note ?? base.note, image: images[i] ?? base.image, ...(viTri ? { viTri } : {}) }
  })

const QUOTE_FIELDS: readonly EditableField[] = [
  { khoa: 'name', nhan: 'Tên món', kieu: 'chu', batBuoc: true },
  { khoa: 'note', nhan: 'Chữ phụ', kieu: 'chu' },
  { khoa: 'image', nhan: 'Ảnh', kieu: 'anh' },
  { khoa: 'viTri', nhan: 'Vị trí thẻ', kieu: 'so', goiY: '1 là thẻ đầu tiên của khối, 2 là thẻ thứ hai…; để trống thì xếp cuối' },
]

export const HOTEL_QUOTES_SET: EditableSet = {
  khoa: 'khach-san-mon-bao-gia',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Khách sạn: món chưa có trang riêng',
  moTa:
    'Thẻ "Nhận báo giá" ở khối Sản phẩm cho khách sạn (bấm thẻ là điền sẵn form báo giá): tên, chữ phụ, ảnh, vị trí thẻ. Thêm, xoá, đổi thứ tự ở đây. ' +
    'Thẻ sản phẩm có trang riêng chọn ở bộ chữ "Trang Khách sạn và dự án", ô "Sản phẩm: các thẻ sản phẩm".',
  kieu: 'nhieu',
  goc: quoteRows(BASE_HOTEL_QUOTES, BASE_HOTEL_QUOTES.map((q) => q.image)),
  truong: QUOTE_FIELDS,
  tieuDeDong: 'name',
}

const QUOTE_ROWS = liveList<QuoteRow>(
  HOTEL_QUOTES_SET.khoa,
  quoteRows(LEGACY.monBaoGia, [LEGACY.anhMonBaoGia1, LEGACY.anhMonBaoGia2]),
  QUOTE_FIELDS,
  () => ({ name: '' }),
)

const quoteEntry = (row: QuoteRow): HotelProductEntry => ({ kind: 'quote', name: row.name, note: row.note ?? '', image: row.image })

/**
 * Sản phẩm của danh mục khách sạn web cũ (/danh-muc-san-pham/du-an-khach-san-nha-nghi/), mặc định theo thứ tự anh Quang
 * gửi qua Zalo 09/11/2026: "làm sao cho xuất hiện được những sp này ở phần Khách sạn & dự án".
 * Ecopillo tích sản phẩm ở Nội dung web; sản phẩm đã gỡ trong Woo (đợt E2) tự bỏ.
 * Chăn ga khách sạn và khăn chưa có trang riêng: bảng giá 2026 ghi "Giá liên hệ", nên bấm thẻ là điền sẵn form báo giá.
 */
export const HOTEL_PRODUCTS: readonly HotelProductEntry[] = (() => {
  const entries: HotelProductEntry[] = HOTEL_PAGE.sanPham
    .filter((slug) => productBySlug(slug) && isProductShown(slug))
    .map((slug) => ({ kind: 'product', slug }))
  for (const row of QUOTE_ROWS) {
    const at = row.viTri && row.viTri > 0 ? Math.min(Math.floor(row.viTri) - 1, entries.length) : entries.length
    entries.splice(at, 0, quoteEntry(row))
  }
  return entries
})()
