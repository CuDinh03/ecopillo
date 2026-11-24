/**
 * Danh mục sản phẩm Ecopillo.
 *
 * Khoảng giá của từng bộ sưu tập lấy theo bảng giá thật (1m6 → 2m2).
 * Giá 180×200 theo web cũ (lấy 28/10/2026): bộ ga phủ bán một cỡ Free Size dùng cho cả giường 1m6 và 1m8 nên bằng giá 160×200;
 * Eco Flora (ga chun) 3.600.000đ. Riêng Rosa, Tera, Sweet: owner chốt 09/11/2026 trả cỡ 180×200 về giá trước 28/10
 * (khách 08/11: "5.320.000đ là giá chuẩn" cho Rosa 1m8); 160×200 và 200×220 giữ nguyên. Chăn hè theo bảng giá 2026 (khách gửi 09/11/2026): một cỡ 200×220, 1.380.000đ,
 * nên cỡ nào cũng một giá.
 * Mã mẫu lấy theo ảnh sản phẩm thật (thư mục images/ và web cũ ecopillo.com.vn).
 * Tên màu do mình đặt theo ảnh; màu ô mẫu lấy từ ảnh.
 * Chưa có dữ liệu tồn kho: không mẫu nào ghi "Tạm hết hàng". Trước 09/11/2026 có 11 mẫu ghi hết hàng giả lập, khách tưởng thật nên đã bỏ;
 * khi Ecopillo báo mẫu hết thật thì thêm soldOut: ['180x200'] vào mẫu đó.
 */

import { collectionIdByPath } from './links'
import {
  liveCollectionText,
  liveNewCollections,
  liveNewPatterns,
  livePattern,
  livePatternContent,
  markLiveDiffers,
  liveHidden,
  mergePrices,
  type LiveNewCollection,
  type LiveNewPattern,
  type LiveStory,
} from './liveData'
import { badgeText, CATALOG_TEXT } from './pageText/catalogText'

export type SizeId = '160x200' | '180x200' | '200x220'

export interface SizeOption {
  id: SizeId
  label: string
  bed: string
}

/** Chữ cỡ, chữ giường Ecopillo sửa ở Nội dung web (pageText/catalogText.ts); mã cỡ giữ nguyên */
export const SIZES: readonly SizeOption[] = [
  { id: '160x200', label: CATALOG_TEXT.co160, bed: CATALOG_TEXT.giuong160 },
  { id: '180x200', label: CATALOG_TEXT.co180, bed: CATALOG_TEXT.giuong180 },
  { id: '200x220', label: CATALOG_TEXT.co220, bed: CATALOG_TEXT.giuong220 },
]

export const sizeById = (id: SizeId): SizeOption => SIZES.find((s) => s.id === id) ?? SIZES[0]

export type PriceTable = Readonly<Record<SizeId, number>>

export type GiftTier = 'om' | 'one-plus' | 'two-plus' | 'none'

export interface Gift {
  tier: GiftTier
  /** Mô tả cho 1 bộ */
  label: string
  /** Số món quà cho 1 bộ, để nhân theo số lượng */
  perSet: number
  unit: string
  item: string
}

export const GIFTS: Readonly<Record<GiftTier, Gift>> = {
  om: { tier: 'om', label: 'Tặng vỏ gối ôm cao cấp', perSet: 1, unit: 'vỏ', item: 'gối ôm cao cấp' },
  'one-plus': {
    tier: 'one-plus',
    label: 'Tặng 1 ruột gối Micro Plus',
    perSet: 1,
    unit: 'ruột gối',
    item: 'Micro Plus',
  },
  'two-plus': {
    tier: 'two-plus',
    label: 'Tặng 2 ruột gối Micro Plus',
    perSet: 2,
    unit: 'ruột gối',
    item: 'Micro Plus',
  },
  none: { tier: 'none', label: '', perSet: 0, unit: '', item: '' },
}

/**
 * Bậc quà kèm khi mua bộ chăn ga. Từ 05/11/2026 mọi bộ để `gift: 'none'`
 * (thay bằng thư cảm ơn + ưu đãi 5%, xem thankYou.ts). Giữ bảng này để chỗ đọc
 * `GIFTS[collection.gift]` (thẻ sản phẩm, đặt hàng) vẫn chạy khi `perSet === 0`.
 */

export interface Pattern {
  code: string
  colorName: string
  /** Màu đại diện cho ô mẫu vải tạm thời */
  swatch: string
  isNew?: boolean
  /** Có ảnh thật tại public/images/patterns/<imageKey ?? code>.webp */
  hasImage?: boolean
  /** Tên file ảnh khi trùng mã với dòng khác (chăn hè dùng mã ER) */
  imageKey?: string
  soldOut?: readonly SizeId[]
  /** Giá riêng nếu mẫu khác giá chung của bộ sưu tập */
  prices?: PriceTable
  /** Giá bộ ga chun chần (thay ga phủ chần), theo web cũ; không có thì mẫu này chưa đặt được ga chun chần */
  fittedPrices?: PriceTable
  /** Mẫu Ecopillo thêm trong WooCommerce (liveData.ts): tên trên link, ảnh chính, ảnh phụ lấy từ Thư viện WordPress */
  slug?: string
  image?: ImageSource
  gallery?: readonly ImageSource[]
  /** Câu chuyện Ecopillo nhập trong Woo (đợt C, liveData.ts): thay câu chuyện trong stories.ts */
  liveStory?: { title: string; text: string; tone?: string }
}

/** Kiểu ga trong bộ: ga phủ chần (mặc định) hoặc ga chun chần (mục 28) */
export type SheetStyle = 'phu' | 'chun'

export const SHEET_LABELS: Readonly<Record<SheetStyle, string>> = { phu: CATALOG_TEXT.gaPhu, chun: CATALOG_TEXT.gaChun }

export type CollectionKind = 'ga-phu' | 'ga-chun' | 'chan-ga' | 'chan-he'

export interface Collection {
  id: string
  name: string
  kind: CollectionKind
  kindLabel: string
  /** Câu khẩu hiệu của bộ, theo catalog Ecopillo 22.07.2026 (owner chọn 24/10/2026) */
  tagline: string
  description: string
  /** Mô tả cho Google viết tay của trang bộ (chờ Ecopillo duyệt); không có thì ghép tự động từ description và giá */
  metaDescription?: string
  badge?: string
  prices: PriceTable
  gift: GiftTier
  contents: readonly string[]
  /** Có lựa chọn ga chun chần thay ga phủ (Rosa, Tera, Vera; mục 28, Ecopillo: giá riêng) */
  hasFittedOption?: boolean
  patterns: readonly Pattern[]
  imageNote: string
  /** Mã mẫu dùng làm ảnh đại diện bộ sưu tập (phải có hasImage) */
  cover?: string
  /** Câu chuyện chung của bộ Ecopillo nhập trong Woo (đợt C): thay COLLECTION_STORIES trong stories.ts */
  story?: string
  /** Bộ Ecopillo tạo trong Woo (đợt C): đường link trang bộ là link danh mục Woo */
  livePath?: string
}

const SET_PHU_CONTENTS = [
  'Ga phủ chần theo kích thước giường',
  'Vỏ chăn 4 mùa 200×220, có khoá kéo',
  '2 vỏ gối đầu 45×65',
  '1 vỏ gối ôm 80×100',
] as const

/**
 * Eco Doris có thêm vỏ gối tựa: 6 món (khách yêu cầu 16/10/2026, mục 29).
 * Vỏ chăn Doris to hơn các bộ khác: 210×230 (catalog Ecopillo 22.07.2026).
 */
const DORIS_CONTENTS = [
  SET_PHU_CONTENTS[0],
  'Vỏ chăn 4 mùa 210×230, có khoá kéo',
  ...SET_PHU_CONTENTS.slice(2),
  '1 vỏ gối tựa 45×45',
] as const

/** Rosa, Tera, Vera: chọn ga phủ chần hoặc ga chun chần (mục 28, Ecopillo trả lời 23/10/2026) */
const SET_PHU_OR_CHUN_CONTENTS = ['Ga phủ chần hoặc ga chun chần theo kích thước giường', ...SET_PHU_CONTENTS.slice(1)] as const

const SET_CHUN_CONTENTS = [
  'Ga chun theo kích thước giường',
  'Vỏ chăn 4 mùa 200×220',
  '2 vỏ gối đầu 45×65',
] as const

const price = (a: number, b: number, c: number): PriceTable => ({
  '160x200': a,
  '180x200': b,
  '200x220': c,
})

const ROSA_NEW = price(5_080_000, 5_080_000, 5_800_000)
const TERA_ET06 = price(5_540_000, 5_540_000, 5_720_000)

/* Giá bộ ga chun chần theo trang từng mẫu trên web cũ (lấy 23/10/2026). Mẫu không ghi ở đây: web cũ không bán ga chun chần,
   nhân viên báo giá khi gọi xác nhận. ER46 (2m2) và ER48 (1m8) ghi 5.800.000đ, lệch nhịp với ER45, ER47: giữ đúng web cũ, chờ Ecopillo xác nhận */
const ROSA_ER39_CHUN = price(4_700_000, 4_950_000, 5_300_000)
const ROSA_NEW_CHUN = price(5_080_000, 5_200_000, 5_400_000)
const TERA_CHUN = price(5_040_000, 5_180_000, 5_380_000)
/** Bảng giá niêm yết 2026 khách gửi 08/11/2026 (khoanh đỏ) */
const VERA_CHUN = price(5_100_000, 5_250_000, 5_450_000)

/** Mẫu có ảnh thật */
const real = (code: string, colorName: string, swatch: string, extra: Partial<Pattern> = {}): Pattern => ({
  code,
  colorName,
  swatch,
  hasImage: true,
  ...extra,
})

/** Danh mục gốc trong code; nơi dùng đọc COLLECTIONS (đã ghép giá, hết hàng Ecopillo sửa trong WooCommerce) */
const BASE_COLLECTIONS: readonly Collection[] = [
  {
    id: 'eco-flora',
    name: 'Eco Flora',
    kind: 'ga-chun',
    kindLabel: CATALOG_TEXT.loaiFlora,
    tagline: 'Thanh khiết và sinh động',
    description:
      'Bộ ga chun Lyocell chần thủ công từng đường, họa tiết cánh hoa và vân đá nhẹ nhàng. Lựa chọn khởi đầu cho phòng ngủ thanh lịch.',
    prices: price(3_500_000, 3_600_000, 3_800_000),
    // Mục 11 phản hồi 05/11/2026: bỏ quà kèm (ruột gối / vỏ gối ôm), thay bằng thư cảm ơn + ưu đãi 5%
    gift: 'none',
    contents: SET_CHUN_CONTENTS,
    imageNote: 'Ảnh phòng ngủ trải bộ Eco Flora EF06',
    cover: 'EF06',
    patterns: [
      real('EF06', 'Sọc xanh nước biển', '#b6cfde'),
      // Mẫu web cũ đang bán, chưa có trong catalog 22.07 (thêm 18/11/2026, owner "dựng 10 trang"): ảnh, link theo web cũ, giá chung của bộ, tên màu đặt theo ảnh
      real('EF08', 'Hoa tím nền xanh nhạt', '#d3d5e9'),
      real('EF09', 'Lá dương xỉ nền trắng', '#e6e7e3'),
      real('EF10', 'Cành lá nền xám', '#cdccd1'),
      real('EF11', 'Lá dương xỉ xám', '#cac8c4'),
      real('EF12', 'Hoa xanh nền kem', '#dddfe0'),
      real('EF16', 'Lá bạc hà nền trắng ngà', '#dae0e4'),
      real('EF18', 'Vân đá xám trắng', '#bdbdbe'),
      real('EF19', 'Hồng phấn cho bé', '#f1e2e5'),
    ],
  },
  {
    id: 'eco-rosa',
    name: 'Eco Rosa',
    kind: 'chan-ga',
    kindLabel: CATALOG_TEXT.loaiRosa,
    tagline: 'Tươi mới và sống động',
    description:
      // Catalog Ecopillo 22.07.2026: in hoạt tính
      'Bộ chăn ga Lyocell được yêu thích nhất của Ecopillo: hoa lá, hình học, họa tiết cho bé, từ gam trung tính đến pastel. In hoạt tính nên màu tươi và bền theo thời gian. Các mẫu mới ER45–ER49 vừa ra mắt.',
    // Mô tả Google viết tay 08/11/2026 (C2), chờ Ecopillo duyệt
    metaDescription:
      'Bộ chăn ga Lyocell Eco Rosa in hoạt tính: hoa lá, hình học, họa tiết cho bé, màu tươi và bền. Mẫu mới ER45–ER49, đặt online.',
    ...badgeText(CATALOG_TEXT.nhanRosa),
    prices: price(4_950_000, 5_320_000, 5_690_000),
    gift: 'none',
    contents: SET_PHU_OR_CHUN_CONTENTS,
    hasFittedOption: true,
    imageNote: 'Ảnh phòng ngủ trải bộ Eco Rosa ER48',
    cover: 'ER48',
    patterns: [
      real('ER48', 'Lá xanh nền trắng', '#e1e2e0', { isNew: true, prices: ROSA_NEW, fittedPrices: price(5_080_000, 5_800_000, 5_400_000) }),
      real('ER06', 'Hoa lily hồng nền trắng', '#efeeed'),
      real('ER08', 'Kẻ ô xanh denim', '#bdcbdd'),
      real('ER09', 'Lá xanh nhạt', '#cdd3e5'),
      real('ER10', 'Hình học xám', '#ccc6c7'),
      real('ER11', 'Thú nhỏ nền trắng', '#e8e7ea'),
      real('ER12', 'Đại dương xanh', '#b9daeb'),
      real('ER15', 'Khủng long xanh navy', '#7395bc'),
      real('ER16', 'Lá xám bạc', '#a2a4a9'),
      real('ER17', 'Ngôi sao sắc màu', '#ced0d2'),
      real('ER18', 'Hoa nhí xanh mint', '#bdc6c4'),
      real('ER19', 'Kẻ ô cam đào', '#cfa9a2'),
      real('ER20', 'Hoa kem nhạt', '#cfccc4'),
      real('ER21', 'Hoa hồng phấn', '#d1c4c5'),
      real('ER22', 'Hoa tím nhạt', '#e5dfe7'),
      real('ER24', 'Hoa hồng nhạt', '#d1c3c5'),
      real('ER25', 'Lá xám tro', '#aeb2ba'),
      real('ER26', 'Hoa hồng đào', '#d4c4c4'),
      real('ER28', 'Xanh biển họa tiết', '#7ea7bd'),
      real('ER29', 'Hoa lá pastel', '#cacdd0'),
      real('ER30', 'Xanh xám', '#9da8b3'),
      real('ER31', 'Hoa xám nhạt', '#c0c3cb'),
      real('ER32', 'Hoa tím pastel', '#cecad5'),
      real('ER33', 'Kẻ sọc be', '#c7bdb3'),
      real('ER34', 'Hình học xanh hồng', '#a8a3ab'),
      real('ER35', 'Hoa kem be', '#cbc6c3'),
      real('ER37', 'Lá xanh lam', '#a6b1c1'),
      real('ER39', 'Lá xanh tím', '#a4abbf', { fittedPrices: ROSA_ER39_CHUN }),
      real('ER42', 'Hoa hồng đỏ', '#ded0d5'),
      real('ER45', 'Gấu hồng', '#e6d3d9', { isNew: true, prices: ROSA_NEW, fittedPrices: ROSA_NEW_CHUN }),
      real('ER46', 'Tàu thuyền xanh', '#bacbe3', { isNew: true, prices: ROSA_NEW, fittedPrices: price(5_080_000, 5_200_000, 5_800_000) }),
      real('ER47', 'Hoa nhí hồng', '#e1dde0', { isNew: true, prices: ROSA_NEW, fittedPrices: ROSA_NEW_CHUN }),
      real('ER49', 'Sọc ngang xanh dịu', '#ccccc6', { isNew: true, prices: ROSA_NEW, fittedPrices: ROSA_NEW_CHUN }),
    ],
  },
  {
    id: 'eco-tera',
    name: 'Eco Tera',
    kind: 'chan-ga',
    kindLabel: CATALOG_TEXT.loaiTera,
    tagline: 'Thanh lịch và hiện đại',
    description:
      'Lyocell trơn một màu với ánh lụa nhẹ, viền chần nổi quanh ga phủ. Sáu gam màu từ xanh da trời, hồng phấn đến kem và xám.',
    prices: price(5_040_000, 5_380_000, 5_720_000),
    gift: 'none',
    contents: SET_PHU_OR_CHUN_CONTENTS,
    hasFittedOption: true,
    imageNote: 'Ảnh bộ Eco Tera ET04',
    cover: 'ET04',
    patterns: [
      real('ET01', 'Xanh da trời', '#a2bfe1', { fittedPrices: TERA_CHUN }),
      real('ET02', 'Hồng phấn', '#f0d2d8', { fittedPrices: TERA_CHUN }),
      real('ET03', 'Xám bạc', '#bdbdbe', { fittedPrices: TERA_CHUN }),
      real('ET04', 'Vàng kem', '#e5d8c8', { fittedPrices: TERA_CHUN }),
      real('ET05', 'Trắng ngà', '#f4f3e9', { fittedPrices: TERA_CHUN }),
      real('ET06', 'Xám ghi', '#818284', { prices: TERA_ET06 }),
    ],
  },
  {
    id: 'eco-vera',
    name: 'Eco Vera',
    kind: 'chan-ga',
    kindLabel: CATALOG_TEXT.loaiVera,
    tagline: 'Nghệ thuật chạm cảm xúc',
    description:
      'Họa tiết hoa lá và hình học mềm mại trên nền Lyocell pastel, hợp phòng ngủ sáng màu và nhiều ánh nắng.',
    prices: price(5_600_000, 5_600_000, 5_790_000),
    gift: 'none',
    contents: SET_PHU_OR_CHUN_CONTENTS,
    hasFittedOption: true,
    imageNote: 'Ảnh bộ Eco Vera EV02',
    cover: 'EV02',
    patterns: [
      real('EV02', 'Lá xanh nhạt', '#c9cfdb', { fittedPrices: VERA_CHUN }),
      real('EV01', 'Lá vàng nền kem', '#d3d0c5', { fittedPrices: VERA_CHUN }),
      real('EV03', 'Hoa tím nền kem', '#f5eee4', { fittedPrices: VERA_CHUN }),
      real('EV04', 'Hoa tím hồng', '#f2e3eb', { fittedPrices: VERA_CHUN }),
      real('EV05', 'Hình học xám', '#b9b8be', { fittedPrices: VERA_CHUN }),
      real('EV06', 'Hoa lá xanh lam', '#a9b8cd', { fittedPrices: VERA_CHUN }),
    ],
  },
  {
    id: 'eco-sweet',
    name: 'Eco Sweet',
    kind: 'ga-phu',
    kindLabel: CATALOG_TEXT.loaiSweet,
    tagline: 'Ngọt ngào và quý phái',
    description:
      'Hoa văn được dệt thẳng vào sợi Lyocell bằng kỹ thuật Jacquard, nổi khối tinh tế dưới ánh sáng. Bền màu, càng dùng càng mềm.',
    prices: price(7_890_000, 8_780_000, 9_660_000),
    gift: 'none',
    contents: SET_PHU_CONTENTS,
    imageNote: 'Ảnh bộ Eco Sweet ES06',
    cover: 'ES06',
    patterns: [
      real('ES06', 'Trắng ngà', '#eee9e5'),
      real('ES08', 'Xanh ngọc', '#b6d7e8'),
      // Mẫu web cũ đang bán, chưa có trong catalog 22.07 (thêm 18/11/2026, owner "dựng 10 trang"): ảnh, link theo web cũ, giá chung của bộ, tên màu đặt theo ảnh
      real('ES09', 'Hồng phấn dệt hoa văn chìm', '#fcd4d5'),
      real('ES10', 'Xám bạc', '#bdbcc2'),
    ],
  },
  {
    id: 'eco-liora',
    name: 'Eco Liora',
    kind: 'chan-ga',
    kindLabel: CATALOG_TEXT.loaiLiora,
    tagline: 'Tinh tế và sang trọng',
    description:
      'Vải dệt kim sa độc quyền, từng sợi kim tuyến lấp lánh nhẹ trên nền hồng đào, xám, vàng ánh kim. Hợp làm quà cưới, quà tân gia cho những người thân yêu.',
    prices: price(8_020_000, 8_020_000, 8_280_000),
    gift: 'none',
    contents: SET_PHU_CONTENTS,
    imageNote: 'Ảnh bộ Eco Liora EL10',
    cover: 'EL10',
    patterns: [
      real('EL06', 'Xám ngọc trai', '#d0c9c8'),
      real('EL08', 'Loang hồng tím', '#e4d4e0'),
      real('EL09', 'Hoa hồng nền ghi xám', '#bebcc7'),
      real('EL10', 'Hồng đào', '#e1d0d1'),
      real('EL12', 'Vàng ánh kim', '#e4d7cb'),
    ],
  },
  {
    id: 'eco-doris',
    name: 'Eco Doris',
    kind: 'ga-phu',
    kindLabel: CATALOG_TEXT.loaiDoris,
    tagline: 'Tinh xảo và đầy cuốn hút',
    description:
      'Tuyển chọn sợi Lyocell đẹp nhất, chần thêu dày và đều, đường may 4 mũi/cm chắc chắn. Tinh hoa của hơn 15 năm làm nghề.',
    ...badgeText(CATALOG_TEXT.nhanDoris),
    prices: price(10_000_000, 10_000_000, 10_360_000),
    gift: 'none',
    contents: DORIS_CONTENTS,
    imageNote: 'Ảnh bộ Eco Doris ED25',
    cover: 'ED25',
    patterns: [
      real('ED08', 'Hồng phấn', '#f9ddde'),
      real('ED09', 'Xanh da trời', '#b2d4f7'),
      real('ED10', 'Trắng tinh', '#f4f4f3'),
      real('ED20', 'Đỏ trầm thêu chỉ vàng', '#ba544c'),
      real('ED25', 'Kem thêu hoa', '#e5d7c7'),
      real('ED26', 'Hoa tuyết nền ghi', '#b1b8c3'),
      // Mẫu web cũ đang bán, chưa có trong catalog 22.07 (thêm 18/11/2026, owner "dựng 10 trang"): ảnh, link theo web cũ, giá chung của bộ, tên màu đặt theo ảnh
      real('ED06', 'Tím oải hương thêu bông tuyết', '#aba7be'),
      real('ED11', 'Đỏ san hô', '#de4b44'),
      real('ED12', 'Trắng sữa', '#f5f5f5'),
      real('ED16', 'Xám bạc', '#b0b1b5'),
      real('ED18', 'Kem ngà', '#d7cfc7'),
      real('ED19', 'Đỏ son', '#c95a4e'),
      real('ED21', 'Hồng tro', '#cdb9c2'),
    ],
  },
  {
    id: 'chan-he-lyocell',
    name: 'Chăn hè Lyocell',
    kind: 'chan-he',
    kindLabel: CATALOG_TEXT.loaiChanHe,
    tagline: 'Mát lành êm dịu, giấc hè êm ru',
    description: 'Vỏ Lyocell chần bông mỏng, đắp mát mùa hè, dùng riêng hoặc phối cùng bộ ga.',
    // Bảng giá 2026 chỉ có một cỡ chăn 200×220 (1.380.000đ), đắp được cho cả ba cỡ giường
    prices: price(1_380_000, 1_380_000, 1_380_000),
    gift: 'none',
    contents: ['1 chăn hè Lyocell chần bông mỏng'],
    imageNote: 'Ảnh chăn hè Lyocell ER38',
    // Ảnh đại diện trước đây là ER12 (ảnh 01 in chữ chất liệu cũ, đã bỏ); giữ ER38
    cover: 'ER38',
    patterns: [
      real('ER09', 'Lá xanh xám', '#b7bcc5', { imageKey: 'chan-he-ER09' }),
      // Ảnh 01 của web cũ in chữ chất liệu cũ nên bỏ; ảnh chính lấy ảnh 03 (kệ gỗ), ảnh phụ 02 và 04 (17/11/2026)
      real('ER12', 'Xanh biển họa tiết', '#96bed1', { imageKey: 'chan-he-ER12' }),
      real('ER16', 'Kẻ xám', '#acabb0', { imageKey: 'chan-he-ER16' }),
      real('ER20', 'Kem be', '#d4c9b2', { imageKey: 'chan-he-ER20' }),
      real('ER36', 'Xám ghi', '#acafa9', { imageKey: 'chan-he-ER36' }),
      real('ER38', 'Xanh mây', '#7da5bd', { imageKey: 'chan-he-ER38' }),
    ],
  },
]

/**
 * Ảnh, ảnh phụ, tên màu Ecopillo đã soát trong WooCommerce (đợt B, noi-dung-woo.php) cho mẫu có sẵn. Ô Woo trống thì giữ ảnh,
 * tên màu, ảnh phụ trong code (cùng một quy tắc với sản phẩm lẻ).
 */
const withPatternContent = (collection: Collection, pattern: Pattern): Pattern => {
  const live = livePatternContent(collection.id, pattern.code)
  if (!live) return pattern
  markLiveDiffers()
  const colorName = live.tenMau ?? pattern.colorName
  const alt = `${collection.name} ${pattern.code} · ${colorName}`
  return {
    ...pattern,
    colorName,
    ...(live.mauNen ? { swatch: live.mauNen } : {}),
    ...(live.anh ? { hasImage: true, image: { ...live.anh, alt: live.anh.alt || alt } } : {}),
    ...(live.anhPhu ? { hasImage: true, gallery: live.anhPhu.map((img, i) => ({ ...img, alt: img.alt || `${alt} · ảnh ${i + 2}` })) } : {}),
    ...(live.cauChuyen ? { liveStory: storyOf(live.cauChuyen) } : {}),
  }
}

const storyOf = (story: LiveStory): NonNullable<Pattern['liveStory']> => ({ title: story.ten, text: story.doan, tone: story.gam })

/** Ghép giá, giá ga chun chần, cỡ hết hàng do Ecopillo sửa trong WooCommerce (liveData.ts) lên một mẫu */
const withLivePattern = (collection: Collection, pattern: Pattern): Pattern => {
  const live = livePattern(collection.id, pattern.code)
  if (!live) return pattern
  const base = pattern.prices ?? collection.prices
  const prices = mergePrices(base, live.gia)
  const fittedPrices = pattern.fittedPrices ? mergePrices(pattern.fittedPrices, live.giaChun) : undefined
  const soldOut = live.het?.filter((id): id is SizeId => SIZES.some((s) => s.id === id))
  const soldOutChanged = soldOut !== undefined && soldOut.join() !== (pattern.soldOut ?? []).join()
  if (soldOutChanged) markLiveDiffers()
  if (prices === base && fittedPrices === pattern.fittedPrices && !soldOutChanged) return pattern
  return {
    ...pattern,
    ...(prices !== base ? { prices } : {}),
    ...(fittedPrices ? { fittedPrices } : {}),
    ...(soldOutChanged ? { soldOut: soldOut.length ? soldOut : undefined } : {}),
  }
}

/** Mẫu mới Ecopillo thêm trong WooCommerce (giai đoạn 4). Thiếu giá cỡ nào thì lấy giá chung của bộ */
const newPattern = (collection: Collection, p: LiveNewPattern): Pattern => {
  const prices = { ...collection.prices, ...p.gia } as PriceTable
  const chun = p.giaChun && SIZES.every((s) => p.giaChun?.[s.id] !== undefined) ? (p.giaChun as PriceTable) : undefined
  const soldOut = p.het.filter((id): id is SizeId => SIZES.some((s) => s.id === id))
  return {
    code: p.ma,
    colorName: p.ten,
    swatch: p.mauNen ?? '#d9d4cc',
    isNew: true,
    hasImage: true,
    slug: p.duongDan,
    image: { ...p.anh, alt: p.anh.alt || `${collection.name} ${p.ma} · ${p.ten}` },
    gallery: p.anhPhu.map((img, i) => ({ ...img, alt: img.alt || `${collection.name} ${p.ma} · ${p.ten} · ảnh ${i + 2}` })),
    prices,
    ...(chun && collection.hasFittedOption ? { fittedPrices: chun } : {}),
    ...(soldOut.length ? { soldOut } : {}),
    ...(p.cauChuyen ? { liveStory: storyOf(p.cauChuyen) } : {}),
  }
}

const withNewPatterns = (collection: Collection, patterns: readonly Pattern[]): readonly Pattern[] => {
  const extra = liveNewPatterns(collection.id)
    .filter((p) => !patterns.some((q) => q.code === p.ma))
    .map((p) => newPattern(collection, p))
  if (!extra.length) return patterns
  markLiveDiffers()
  return [...patterns, ...extra]
}

/** Khẩu hiệu, mô tả, câu chuyện bộ có sẵn Ecopillo đã soát ở trang sửa danh mục Woo (đợt C); ô trống giữ chữ trong code */
const withCollectionText = (c: Collection): Collection => {
  const live = liveCollectionText(c.id)
  if (!live) return c
  markLiveDiffers()
  return {
    ...c,
    // Tên bộ Ecopillo sửa ở tên danh mục Woo (đợt F); link, mã bộ giữ nguyên
    ...(live.ten ? { name: live.ten } : {}),
    ...(live.khauHieu ? { tagline: live.khauHieu } : {}),
    ...(live.moTa ? { description: live.moTa, metaDescription: undefined } : {}),
    ...(live.cauChuyen ? { story: live.cauChuyen } : {}),
    ...(live.trongBo ? { contents: live.trongBo } : {}),
  }
}

const KIND_OF_NEW: Readonly<Record<LiveNewCollection['kieu'], Pick<Collection, 'kind' | 'kindLabel' | 'contents'>>> = {
  'ga-phu': { kind: 'ga-phu', kindLabel: CATALOG_TEXT.loaiMoiGaPhu, contents: SET_PHU_CONTENTS },
  'ga-chun': { kind: 'ga-chun', kindLabel: CATALOG_TEXT.loaiMoiGaChun, contents: SET_CHUN_CONTENTS },
  'chan-ga': { kind: 'chan-ga', kindLabel: CATALOG_TEXT.loaiMoiChanGa, contents: SET_PHU_CONTENTS },
  'chan-he': { kind: 'chan-he', kindLabel: CATALOG_TEXT.loaiMoiChanHe, contents: ['1 chăn hè chần bông mỏng'] },
}

/**
 * Bộ sưu tập Ecopillo tạo trong WooCommerce (đợt C): giá chung của bộ là giá thấp nhất từng cỡ trong các mẫu,
 * ảnh bìa là mẫu đầu, trong bộ gồm theo kiểu bộ. Mã trùng bộ có sẵn thì bỏ.
 */
const newCollection = (live: LiveNewCollection): Collection => {
  const prices = Object.fromEntries(SIZES.map((s) => [s.id, Math.min(...live.mau.map((m) => m.gia[s.id] ?? Infinity))])) as PriceTable
  const shell: Collection = {
    id: live.id,
    name: live.ten,
    ...KIND_OF_NEW[live.kieu],
    ...(live.trongBo.length ? { contents: live.trongBo } : {}),
    tagline: live.khauHieu,
    description: live.moTa || live.khauHieu,
    prices,
    gift: 'none',
    imageNote: '',
    patterns: [],
    cover: live.mau[0].ma,
    ...(live.cauChuyen ? { story: live.cauChuyen } : {}),
    livePath: live.duongDan,
  }
  return { ...shell, patterns: live.mau.map((m) => newPattern(shell, m)) }
}

const NEW_COLLECTIONS: readonly Collection[] = liveNewCollections()
  .filter((c) => !BASE_COLLECTIONS.some((b) => b.id === c.id) && collectionIdByPath(c.duongDan) === c.id)
  .map(newCollection)
if (NEW_COLLECTIONS.length) markLiveDiffers()

/**
 * Mọi bộ sưu tập, kể cả bộ / mẫu Ecopillo đã gỡ trong WordPress: chỉ để tra cứu (collectionById), không để liệt kê.
 * Liệt kê dùng COLLECTIONS.
 */
export const ALL_COLLECTIONS: readonly Collection[] = [
  ...BASE_COLLECTIONS.map(withCollectionText).map((c) => ({
    ...c,
    patterns: withNewPatterns(
      c,
      c.patterns.map((p) => withLivePattern(c, withPatternContent(c, p))),
    ),
  })),
  ...NEW_COLLECTIONS,
]

/**
 * Bộ sưu tập đang hiện (đợt E2): bỏ bộ Ecopillo đã ẩn / xoá danh mục, bỏ mẫu đã gỡ trong Woo (nháp, thùng rác, xoá);
 * bộ không còn mẫu nào thì bỏ cả bộ. Ảnh bìa là mẫu đã gỡ thì lấy mẫu đầu còn lại.
 */
export const COLLECTIONS: readonly Collection[] = (() => {
  const hidden = liveHidden()
  if (!hidden.bo.size && !hidden.mau.size) return ALL_COLLECTIONS
  return ALL_COLLECTIONS.flatMap((c) => {
    if (hidden.bo.has(c.id)) return []
    const patterns = c.patterns.filter((p) => !hidden.mau.has(`${c.id}/${p.code}`))
    if (!patterns.length) return []
    if (patterns.length === c.patterns.length) return [c]
    return [{ ...c, patterns, cover: patterns.some((p) => p.code === c.cover) ? c.cover : patterns[0].code }]
  })
})()

export const BEDDING_SETS = COLLECTIONS.filter((c) => c.kind !== 'chan-he')

/** Tra một bộ theo mã (cả bộ đã gỡ, để chỗ tra cứu không vỡ; link của nó đã chuyển hướng) */
export const collectionById = (id: string | null | undefined): Collection | undefined =>
  COLLECTIONS.find((c) => c.id === id) ?? ALL_COLLECTIONS.find((c) => c.id === id)

export const patternPrice = (collection: Collection, pattern: Pattern, size: SizeId): number =>
  (pattern.prices ?? collection.prices)[size]

/** Giá bộ theo kiểu ga. Ga chun chần chưa có giá (web cũ không bán mẫu này) thì undefined: nhân viên báo khi gọi */
export const setPrice = (collection: Collection, pattern: Pattern, size: SizeId, sheet: SheetStyle): number | undefined =>
  sheet === 'chun' ? pattern.fittedPrices?.[size] : patternPrice(collection, pattern, size)

/** Khoảng giá của một phối màu qua mọi kích thước */
export const patternRange = (collection: Collection, pattern: Pattern): { min: number; max: number } => {
  const values = SIZES.map((s) => patternPrice(collection, pattern, s.id))
  return { min: Math.min(...values), max: Math.max(...values) }
}

export const isSizeSoldOut = (pattern: Pattern, size: SizeId): boolean =>
  pattern.soldOut?.includes(size) ?? false

export const isPatternSoldOut = (pattern: Pattern): boolean =>
  SIZES.every((s) => isSizeSoldOut(pattern, s.id))

/** Khoảng giá của bộ sưu tập, gồm cả các mẫu có giá riêng */
export const collectionRange = (collection: Collection): { min: number; max: number } => {
  const values = collection.patterns.flatMap((p) => Object.values(p.prices ?? collection.prices))
  return { min: Math.min(...values), max: Math.max(...values) }
}

/* ——— Ruột chăn, ruột gối, topper ——— */

export interface EssentialItem {
  /**
   * Khoá sản phẩm (trang sản phẩm lẻ, hoặc bộ chăn hè Lyocell): ô trang chủ tra theo khoá, nên Ecopillo đổi tên trong Woo
   * vẫn đúng ô, gỡ sản phẩm thì ô tự bỏ. Lúc build entry-server.tsx kiểm mọi khoá phải có trong products.ts
   */
  slug: string
  name: string
  note: string
  min: number
  max: number
}

export interface EssentialGroup {
  id: string
  title: string
  subtitle: string
  imageNote: string
  /** Ảnh đại diện nhóm, file trong public/images/products */
  imageKey?: string
  items: readonly EssentialItem[]
}

export const ESSENTIALS: readonly EssentialGroup[] = [
  {
    id: 'ruot-goi',
    title: 'Ruột gối',
    subtitle: 'Từ bông PE giá mềm đến lông vũ bồng bềnh như mây',
    imageNote: 'Ảnh 5 loại ruột gối xếp tầng',
    imageKey: 'ruot-goi-micro-plus',
    items: [
      // Chị Phương (Zalo 11/11/2026): "cho thêm cái ruột gối pe hiển thị ra đầu vì nó rẻ, dễ hút khách".
      // Sản phẩm riêng RUOT_GOI_BONG_PE (products.ts): đổi giá thì sửa cả hai chỗ
      { slug: 'ruot-goi-bong-pe', name: 'Bông PE', note: 'Nhẹ, thoáng, không hút ẩm', min: 180_000, max: 215_000 },
      { slug: 'ruot-goi-micro-fiber', name: 'Micro Fiber', note: 'Sợi siêu mảnh, êm vừa, dễ giặt', min: 380_000, max: 450_000 },
      { slug: 'ruot-goi-micro-plus', name: 'Micro Plus', note: 'Bông cao cấp, đàn hồi tốt', min: 515_000, max: 550_000 },
      { slug: 'ruot-goi-to-tam', name: 'Tơ tằm', note: 'Mềm mượt, điều hoà nhiệt', min: 960_000, max: 960_000 },
      { slug: 'ruot-goi-cao-su-thien-nhien', name: 'Cao su thiên nhiên', note: 'Nâng đỡ cổ, thoáng khí', min: 1_260_000, max: 1_260_000 },
      { slug: 'ruot-goi-long-vu-tu-nhien', name: 'Lông vũ tự nhiên', note: 'Bồng bềnh, chuẩn khách sạn 5 sao', min: 2_880_000, max: 2_880_000 },
    ],
  },
  {
    id: 'ruot-chan',
    title: 'Ruột chăn',
    subtitle: 'Giữ ấm vừa đủ, nhẹ trên người',
    imageNote: 'Ảnh ruột chăn lông vũ phồng nhẹ',
    imageKey: 'chan-to-tam',
    items: [
      { slug: 'chan-dong-micro-fiber', name: 'Chăn đông Micro Fiber', note: 'Ấm, nhẹ, giặt máy được', min: 1_680_000, max: 1_680_000 },
      { slug: 'chan-to-tam', name: 'Chăn tơ tằm', note: 'Mỏng nhẹ, thoáng, ít bám bụi', min: 2_650_000, max: 2_650_000 },
      { slug: 'chan-long-vu-tu-nhien', name: 'Chăn lông vũ tự nhiên', note: 'Ấm sâu, siêu nhẹ cho mùa đông', min: 5_630_000, max: 5_630_000 },
    ],
  },
  {
    // Tên nhóm theo khách 05/11/2026 ("Chăn, topper và phụ kiện khác"); thêm bảo vệ đệm, divan với giá khách gửi cùng ngày
    id: 'chan-topper',
    title: 'Chăn, topper và phụ kiện khác',
    subtitle: 'Thêm một lớp êm, giữ đệm sạch, đổi mùa cho phòng ngủ',
    imageNote: 'Ảnh topper trải trên đệm, chăn hè gấp cạnh',
    imageKey: 'topper-micro-fiber',
    items: [
      { slug: 'chan-he-lyocell', name: 'Chăn hè Lyocell', note: 'Chần bông mỏng, mát cho mùa hè', min: 1_380_000, max: 1_380_000 },
      // Chị Phương 11/11/2026 "thiếu chăn Ecool": sản phẩm riêng CHAN_HE_E_COOL (products.ts), đổi giá thì sửa cả hai chỗ
      { slug: 'chan-he-e-cool', name: 'Chăn hè E-Cool Ecopillo', note: 'Vải mát E-Cool, bông siêu nhẹ', min: 1_380_000, max: 1_380_000 },
      { slug: 'topper-micro-fiber', name: 'Topper Micro Fiber', note: 'Làm mềm mặt đệm cứng', min: 3_550_000, max: 4_200_000 },
      // Giá từng cỡ ở BAO_VE_DEM, DIVAN (products.ts): đổi giá thì sửa cả hai chỗ
      { slug: 'bao-ve-dem-chong-tham', name: 'Bảo vệ đệm chống thấm', note: 'Chống thấm, chống bụi, dễ tháo giặt', min: 675_000, max: 889_000 },
      { slug: 'divan-ecopillo', name: 'Divan Ecopillo', note: 'Kệ giường khung gỗ thông, cao 30 cm', min: 6_580_000, max: 9_250_000 },
    ],
  },
]

/** Đơn vị đếm: chăn hè tính "chiếc", còn lại tính "bộ" (chữ Ecopillo sửa ở Nội dung web) */
export const unitOf = (collection: Collection | undefined): string =>
  collection?.kind === 'chan-he' ? CATALOG_TEXT.donViChiec : CATALOG_TEXT.donViBo

export interface ImageSource {
  src: string
  srcSet: string
  alt: string
}

/** Ảnh mẫu: bản 640px cho thẻ nhỏ, 1600px cho ảnh lớn */
export const patternImage = (code: string, alt: string): ImageSource => ({
  src: `/images/patterns/${code}.webp`,
  srcSet: `/images/patterns/${code}-sm.webp 640w, /images/patterns/${code}.webp 1600w`,
  alt,
})

/**
 * Số ảnh phụ chi tiết theo mã (public/images/patterns/<MÃ>-2.webp …).
 * Đếm từ dãy ảnh web cũ (images/web-cu-anh-mau, tải 05/11/2026, thêm 33 mẫu ngày 08/11/2026): bỏ ảnh trùng ảnh chính, tối đa 8.
 * Chăn hè dùng khoá ảnh 'chan-he-<MÃ>' (imageKey) để khỏi lẫn với dãy ảnh bộ chăn ga cùng mã.
 * Nén bằng tools/nen-anh-mau-chi-tiet-2026-11-05.py; script in ra _gallery-counts.json (đã chuyển ra ngoài public/), số ở đây phải khớp file đó.
 * Mẫu không có trong bảng → chỉ hiện ảnh chính.
 */
export const PATTERN_GALLERY_COUNTS: Readonly<Record<string, number>> = {
  ED08: 4,
  ED09: 4,
  ED10: 3,
  ED25: 8,
  ED26: 6,
  EF06: 8,
  EF09: 8,
  EF10: 8,
  EF11: 8,
  // Web cũ gắn nhầm dãy ảnh EF16 vào trang EF12 (ảnh in mã EF16): dùng cho EF16, EF12 chỉ có ảnh chính
  EF16: 7,
  EF18: 8,
  EF19: 6,
  EL06: 8,
  EL08: 8,
  EL12: 8,
  ER06: 7,
  ER08: 4,
  ER09: 6,
  ER10: 6,
  ER11: 6,
  // ER12 có hai bộ ảnh: bộ chăn ga (khoá ER12) và chăn hè (khoá chan-he-ER12)
  ER12: 7,
  ER15: 4,
  ER16: 2,
  ER19: 2,
  ER21: 2,
  ER22: 3,
  ER24: 3,
  ER25: 2,
  ER26: 2,
  ER28: 2,
  ER29: 2,
  ER30: 2,
  ER31: 2,
  ER32: 2,
  ER33: 2,
  ER34: 2,
  ER35: 2,
  ER37: 2,
  ER39: 2,
  ER42: 8,
  ER45: 4,
  ER46: 4,
  ER47: 4,
  ER48: 5,
  ER49: 5,
  ED06: 6,
  ED11: 3,
  ED12: 4,
  ED16: 2,
  ED18: 2,
  ED19: 2,
  ED21: 2,
  EF08: 8,
  ES06: 3,
  ES08: 6,
  ES09: 7,
  ES10: 3,
  ET01: 7,
  ET02: 5,
  ET03: 5,
  ET04: 5,
  ET05: 5,
  ET06: 1,
  EV01: 5,
  EV02: 5,
  EV03: 4,
  EV04: 6,
  EV05: 2,
  EV06: 2,
  'chan-he-ER09': 3,
  'chan-he-ER12': 2,
  'chan-he-ER16': 2,
  'chan-he-ER36': 3,
  'chan-he-ER38': 3,
}

/** Ảnh phụ của một phối màu (không gồm ảnh chính). */
export const patternGallery = (collection: Collection, pattern: Pattern | undefined): ImageSource[] => {
  if (pattern?.gallery) return [...pattern.gallery]
  if (!pattern?.hasImage) return []
  const key = pattern.imageKey ?? pattern.code
  const n = PATTERN_GALLERY_COUNTS[key] ?? 0
  if (n <= 0) return []
  const baseAlt = `${collection.name} ${pattern.code} · ${pattern.colorName}`
  return Array.from({ length: n }, (_, i) => {
    const idx = i + 2
    return patternImage(`${key}-${idx}`, `${baseAlt} · ảnh ${idx}`)
  })
}

export const imageOfPattern = (collection: Collection, pattern: Pattern | undefined): ImageSource | undefined =>
  pattern?.image ??
  (pattern?.hasImage
    ? patternImage(pattern.imageKey ?? pattern.code, `${collection.name} ${pattern.code} · ${pattern.colorName}`)
    : undefined)

export const coverOf = (collection: Collection): ImageSource | undefined =>
  imageOfPattern(
    collection,
    collection.patterns.find((p) => p.code === collection.cover),
  )

/** Ảnh tĩnh trong public/images (chỉ một bản) */
export const staticImage = (src: string, alt: string): ImageSource => ({ src, srcSet: '', alt })

/** Ảnh sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm) */
export const productImage = (key: string, alt: string): ImageSource => ({
  src: `/images/products/${key}.webp`,
  srcSet: `/images/products/${key}-sm.webp 640w, /images/products/${key}.webp 1600w`,
  alt,
})
