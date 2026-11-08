/**
 * Danh mục sản phẩm Ecopillo.
 *
 * Khoảng giá của từng bộ sưu tập lấy theo bảng giá thật (1m6 → 2m2).
 * Giá 180×200 theo web cũ (lấy 28/10/2026): bộ ga phủ bán một cỡ Free Size dùng cho cả giường 1m6 và 1m8 nên bằng giá 160×200;
 * Eco Flora (ga chun) 3.600.000đ. Chăn hè chưa đối chiếu được (web cũ một giá mỗi mẫu, khác bảng giá này).
 * Mã mẫu lấy theo ảnh sản phẩm thật (thư mục images/ và web cũ ecopillo.com.vn).
 * Tên màu do mình đặt theo ảnh; màu ô mẫu lấy từ ảnh. Tình trạng "Tạm hết hàng" là DỮ LIỆU GIẢ LẬP.
 */

export type SizeId = '160x200' | '180x200' | '200x220'

export interface SizeOption {
  id: SizeId
  label: string
  bed: string
}

export const SIZES: readonly SizeOption[] = [
  { id: '160x200', label: '160 × 200 cm', bed: 'Giường 1m6' },
  { id: '180x200', label: '180 × 200 cm', bed: 'Giường 1m8' },
  { id: '200x220', label: '200 × 220 cm', bed: 'Giường 2m2' },
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
}

/** Kiểu ga trong bộ: ga phủ chần (mặc định) hoặc ga chun chần (mục 28) */
export type SheetStyle = 'phu' | 'chun'

export const SHEET_LABELS: Readonly<Record<SheetStyle, string>> = { phu: 'Ga phủ chần', chun: 'Ga chun chần' }

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

/** Mẫu có ảnh thật */
const real = (code: string, colorName: string, swatch: string, extra: Partial<Pattern> = {}): Pattern => ({
  code,
  colorName,
  swatch,
  hasImage: true,
  ...extra,
})

export const COLLECTIONS: readonly Collection[] = [
  {
    id: 'eco-flora',
    name: 'Eco Flora',
    kind: 'ga-chun',
    kindLabel: 'Bộ ga chun',
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
      real('EF06', 'Sọc xanh nước biển', '#b6cfde', { soldOut: ['160x200'] }),
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
    kindLabel: 'Bộ chăn ga Lyocell',
    tagline: 'Tươi mới và sống động',
    description:
      // Catalog Ecopillo 22.07.2026: in hoạt tính
      'Bộ chăn ga Lyocell được yêu thích nhất của Ecopillo: hoa lá, hình học, họa tiết cho bé, từ gam trung tính đến pastel. In hoạt tính nên màu tươi và bền theo thời gian. Các mẫu mới ER45–ER49 vừa ra mắt.',
    // Mô tả Google viết tay 08/11/2026 (C2), chờ Ecopillo duyệt
    metaDescription:
      'Bộ chăn ga Lyocell Eco Rosa in hoạt tính: hoa lá, hình học, họa tiết cho bé, màu tươi và bền. Mẫu mới ER45–ER49, thanh toán khi nhận hàng.',
    badge: 'Nhiều mẫu nhất',
    prices: price(4_950_000, 4_950_000, 5_690_000),
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
      real('ER25', 'Lá xám tro', '#aeb2ba', { soldOut: ['200x220'] }),
      real('ER26', 'Hoa hồng đào', '#d4c4c4'),
      real('ER28', 'Xanh biển họa tiết', '#7ea7bd'),
      real('ER29', 'Hoa lá pastel', '#cacdd0'),
      real('ER30', 'Xanh xám', '#9da8b3'),
      real('ER31', 'Hoa xám nhạt', '#c0c3cb', { soldOut: ['160x200'] }),
      real('ER32', 'Hoa tím pastel', '#cecad5'),
      real('ER33', 'Kẻ sọc be', '#c7bdb3'),
      real('ER34', 'Hình học xanh hồng', '#a8a3ab'),
      real('ER35', 'Hoa kem be', '#cbc6c3'),
      real('ER37', 'Lá xanh lam', '#a6b1c1'),
      real('ER39', 'Lá xanh tím', '#a4abbf', { fittedPrices: ROSA_ER39_CHUN }),
      real('ER42', 'Hoa hồng đỏ', '#ded0d5'),
      real('ER45', 'Gấu hồng', '#e6d3d9', { isNew: true, prices: ROSA_NEW, fittedPrices: ROSA_NEW_CHUN }),
      real('ER46', 'Tàu thuyền xanh', '#bacbe3', { isNew: true, prices: ROSA_NEW, fittedPrices: price(5_080_000, 5_200_000, 5_800_000) }),
      real('ER47', 'Hoa nhí hồng', '#e1dde0', { isNew: true, prices: ROSA_NEW, soldOut: ['180x200'], fittedPrices: ROSA_NEW_CHUN }),
      real('ER49', 'Sọc ngang xanh dịu', '#ccccc6', { isNew: true, prices: ROSA_NEW, fittedPrices: ROSA_NEW_CHUN }),
    ],
  },
  {
    id: 'eco-tera',
    name: 'Eco Tera',
    kind: 'chan-ga',
    kindLabel: 'Bộ chăn ga gối',
    tagline: 'Thanh lịch và hiện đại',
    description:
      'Lyocell trơn một màu với ánh lụa nhẹ, viền chần nổi quanh ga phủ. Sáu gam màu từ xanh da trời, hồng phấn đến kem và xám.',
    prices: price(5_040_000, 5_040_000, 5_720_000),
    gift: 'none',
    contents: SET_PHU_OR_CHUN_CONTENTS,
    hasFittedOption: true,
    imageNote: 'Ảnh bộ Eco Tera ET04',
    cover: 'ET04',
    patterns: [
      real('ET01', 'Xanh da trời', '#a2bfe1', { fittedPrices: TERA_CHUN }),
      real('ET02', 'Hồng phấn', '#f0d2d8', { soldOut: ['160x200'], fittedPrices: TERA_CHUN }),
      real('ET03', 'Xám bạc', '#bdbdbe', { fittedPrices: TERA_CHUN }),
      real('ET04', 'Vàng kem', '#e5d8c8', { fittedPrices: TERA_CHUN }),
      real('ET05', 'Trắng ngà', '#f4f3e9', { soldOut: ['160x200', '180x200', '200x220'], fittedPrices: TERA_CHUN }),
      real('ET06', 'Xám ghi', '#818284', { prices: TERA_ET06 }),
    ],
  },
  {
    id: 'eco-vera',
    name: 'Eco Vera',
    kind: 'chan-ga',
    kindLabel: 'Bộ chăn ga gối',
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
      real('EV02', 'Lá xanh nhạt', '#c9cfdb'),
      real('EV01', 'Lá vàng nền kem', '#d3d0c5'),
      real('EV03', 'Hoa tím nền kem', '#f5eee4', { soldOut: ['200x220'] }),
      real('EV04', 'Hoa tím hồng', '#f2e3eb'),
      real('EV05', 'Hình học xám', '#b9b8be'),
      real('EV06', 'Hoa lá xanh lam', '#a9b8cd'),
    ],
  },
  {
    id: 'eco-sweet',
    name: 'Eco Sweet',
    kind: 'ga-phu',
    kindLabel: 'Bộ ga phủ dệt Jacquard',
    tagline: 'Ngọt ngào và quý phái',
    description:
      'Hoa văn được dệt thẳng vào sợi Lyocell bằng kỹ thuật Jacquard, nổi khối tinh tế dưới ánh sáng. Bền màu, càng dùng càng mềm.',
    prices: price(7_890_000, 7_890_000, 9_660_000),
    gift: 'none',
    contents: SET_PHU_CONTENTS,
    imageNote: 'Ảnh bộ Eco Sweet ES06',
    cover: 'ES06',
    patterns: [
      real('ES06', 'Trắng ngà', '#eee9e5'),
      real('ES08', 'Xanh ngọc', '#b6d7e8', { soldOut: ['200x220'] }),
      real('ES10', 'Xám bạc', '#bdbcc2'),
    ],
  },
  {
    id: 'eco-liora',
    name: 'Eco Liora',
    kind: 'chan-ga',
    kindLabel: 'Bộ chăn ga',
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
      real('EL08', 'Loang hồng tím', '#e4d4e0', { soldOut: ['160x200'] }),
      real('EL09', 'Hoa hồng nền ghi xám', '#bebcc7'),
      real('EL10', 'Hồng đào', '#e1d0d1'),
      real('EL12', 'Vàng ánh kim', '#e4d7cb'),
    ],
  },
  {
    id: 'eco-doris',
    name: 'Eco Doris',
    kind: 'ga-phu',
    kindLabel: 'Bộ ga phủ',
    tagline: 'Tinh xảo và đầy cuốn hút',
    description:
      'Tuyển chọn sợi Lyocell đẹp nhất, chần thêu dày và đều, đường may 4 mũi/cm chắc chắn. Tinh hoa của hơn 15 năm làm nghề.',
    badge: 'Dòng cao nhất',
    prices: price(10_000_000, 10_000_000, 10_360_000),
    gift: 'none',
    contents: DORIS_CONTENTS,
    imageNote: 'Ảnh bộ Eco Doris ED25',
    cover: 'ED25',
    patterns: [
      real('ED08', 'Hồng phấn', '#f9ddde'),
      real('ED09', 'Xanh da trời', '#b2d4f7'),
      real('ED10', 'Trắng tinh', '#f4f4f3'),
      real('ED20', 'Đỏ trầm thêu chỉ vàng', '#ba544c', { soldOut: ['180x200'] }),
      real('ED25', 'Kem thêu hoa', '#e5d7c7'),
      real('ED26', 'Hoa tuyết nền tím', '#b1b8c3'),
    ],
  },
  {
    id: 'chan-he-lyocell',
    name: 'Chăn hè Lyocell',
    kind: 'chan-he',
    kindLabel: 'Chăn hè chần bông mỏng',
    tagline: 'Mát lành êm dịu, giấc hè êm ru',
    description: 'Vỏ Lyocell chần bông mỏng, đắp mát mùa hè, dùng riêng hoặc phối cùng bộ ga.',
    prices: price(1_380_000, 1_650_000, 1_920_000),
    gift: 'none',
    contents: ['1 chăn hè Lyocell chần bông mỏng'],
    imageNote: 'Ảnh chăn hè Lyocell ER38',
    // Ảnh đại diện trước đây là ER12, nhưng ảnh đó in sẵn dòng chất liệu cũ (xem ghi chú ở mẫu ER12 bên dưới)
    cover: 'ER38',
    patterns: [
      real('ER09', 'Lá xanh xám', '#b7bcc5', { imageKey: 'chan-he-ER09' }),
      // Ảnh chan-he-ER12.webp in sẵn dòng chất liệu cũ đã bỏ khỏi web (owner yêu cầu 14/10/2026) nên tạm không hiện.
      // Ecopillo gửi ảnh ER12 mới thì đổi lại thành real(…, { imageKey: 'chan-he-ER12' })
      { code: 'ER12', colorName: 'Xanh biển họa tiết', swatch: '#96bed1' },
      real('ER16', 'Kẻ xám', '#acabb0', { imageKey: 'chan-he-ER16', soldOut: ['160x200'] }),
      real('ER20', 'Kem be', '#d4c9b2', { imageKey: 'chan-he-ER20' }),
      real('ER36', 'Xám ghi', '#acafa9', { imageKey: 'chan-he-ER36' }),
      real('ER38', 'Xanh mây', '#7da5bd', { imageKey: 'chan-he-ER38' }),
    ],
  },
]

export const BEDDING_SETS = COLLECTIONS.filter((c) => c.kind !== 'chan-he')

export const collectionById = (id: string | null | undefined): Collection | undefined =>
  COLLECTIONS.find((c) => c.id === id)

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
    subtitle: 'Năm độ êm, từ nâng đỡ chắc tay đến bồng bềnh như mây',
    imageNote: 'Ảnh 5 loại ruột gối xếp tầng',
    imageKey: 'ruot-goi-micro-plus',
    items: [
      { name: 'Micro Fiber', note: 'Sợi siêu mảnh, êm vừa, dễ giặt', min: 380_000, max: 420_000 },
      { name: 'Micro Plus', note: 'Bông cao cấp, đàn hồi tốt', min: 515_000, max: 550_000 },
      { name: 'Tơ tằm', note: 'Mềm mượt, điều hoà nhiệt', min: 960_000, max: 960_000 },
      { name: 'Cao su thiên nhiên', note: 'Nâng đỡ cổ, thoáng khí', min: 1_260_000, max: 1_260_000 },
      { name: 'Lông vũ tự nhiên', note: 'Bồng bềnh, chuẩn khách sạn 5 sao', min: 2_880_000, max: 2_880_000 },
    ],
  },
  {
    id: 'ruot-chan',
    title: 'Ruột chăn',
    subtitle: 'Giữ ấm vừa đủ, nhẹ trên người',
    imageNote: 'Ảnh ruột chăn lông vũ phồng nhẹ',
    imageKey: 'chan-to-tam',
    items: [
      { name: 'Chăn đông Micro Fiber', note: 'Ấm, nhẹ, giặt máy được', min: 1_680_000, max: 1_680_000 },
      { name: 'Chăn tơ tằm', note: 'Mỏng nhẹ, thoáng, ít bám bụi', min: 2_650_000, max: 2_650_000 },
      { name: 'Chăn lông vũ tự nhiên', note: 'Ấm sâu, siêu nhẹ cho mùa đông', min: 5_630_000, max: 5_630_000 },
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
      { name: 'Chăn hè Lyocell', note: 'Chần bông mỏng, mát cho mùa hè', min: 1_380_000, max: 1_920_000 },
      { name: 'Topper Micro Fiber', note: 'Làm mềm mặt đệm cứng', min: 3_550_000, max: 4_200_000 },
      // Giá từng cỡ ở BAO_VE_DEM, DIVAN (products.ts): đổi giá thì sửa cả hai chỗ
      { name: 'Bảo vệ đệm chống thấm', note: 'Chống thấm, chống bụi, dễ tháo giặt', min: 675_000, max: 889_000 },
      { name: 'Divan Ecopillo', note: 'Kệ giường khung gỗ thông, cao 30 cm', min: 6_580_000, max: 9_250_000 },
    ],
  },
]

export interface Mattress {
  name: string
  note: string
  from: number
  /** Giá cao nhất theo kích thước, theo trang web cũ */
  to: number
  /** Bảo hành theo catalog Ecopillo 22.07.2026 */
  warranty: string
}

export const MATTRESSES: readonly Mattress[] = [
  { name: 'Đệm lò xo túi độc lập', note: 'Mỗi lò xo một túi, nằm cạnh nhau không bị rung', from: 5_880_000, to: 9_060_000, warranty: '10 năm' },
  { name: 'Eco Foam đa tầng', note: 'Nhiều lớp foam ôm theo đường cong cơ thể', from: 8_020_000, to: 15_700_000, warranty: '10 năm' },
  { name: 'Lò xo Eco Royal', note: 'Kết cấu lò xo cao cấp, viền chắc', from: 14_365_000, to: 22_335_000, warranty: '10 năm' },
  { name: 'Cao su thiên nhiên Eco Latex', note: 'Đàn hồi tự nhiên, thoáng và bền', from: 16_100_000, to: 39_000_000, warranty: '15 năm' },
]

/** Đơn vị đếm: chăn hè tính "chiếc", còn lại tính "bộ" */
export const unitOf = (collection: Collection | undefined): string =>
  collection?.kind === 'chan-he' ? 'chiếc' : 'bộ'

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
 * Đếm từ dãy ảnh web cũ (images/web-cu-anh-mau, tải 05/11/2026, thêm 31 mẫu ngày 08/11/2026): bỏ ảnh trùng ảnh chính, tối đa 8.
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
  // ER12 có hai bộ ảnh: bộ chăn ga (khoá ER12) có dãy ảnh; chăn hè ER12 vẫn ẩn ảnh vì ảnh cũ in chữ chất liệu cũ
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
  ES06: 3,
  ES08: 6,
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
  'chan-he-ER16': 2,
}

/** Ảnh phụ của một phối màu (không gồm ảnh chính). */
export const patternGallery = (collection: Collection, pattern: Pattern | undefined): ImageSource[] => {
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
  pattern?.hasImage
    ? patternImage(pattern.imageKey ?? pattern.code, `${collection.name} ${pattern.code} · ${pattern.colorName}`)
    : undefined

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
