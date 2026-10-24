import { formatRange, formatVND } from '../lib/format'
import { slugify } from '../lib/slug'
import { collectionPath, PATHS, singleProductPath } from './links'
import {
  COLLECTIONS,
  collectionRange,
  coverOf,
  ESSENTIALS,
  MATTRESSES,
  productImage,
  type Collection,
  type ImageSource,
  type Pattern,
  type SizeId,
} from './catalog'

/**
 * Danh sách sản phẩm cho trang /san-pham, ghép từ danh mục trong catalog.ts.
 * Biên bản mục 44: gom lại theo 4 loại cho gọn (Bộ chăn ga · Chăn · Gối · Đệm), khớp "Hệ sinh thái sản phẩm".
 * Biên bản mục 47: mọi sản phẩm đều đặt được trên web; cửa hàng gọi xác nhận trước khi giao.
 */

export type CategoryId = 'bo-chan-ga' | 'chan' | 'goi' | 'dem'

export const CATEGORIES: readonly { id: CategoryId; label: string; hint: string }[] = [
  { id: 'bo-chan-ga', label: 'Bộ chăn ga', hint: 'Mềm mại, thoáng mát' },
  { id: 'chan', label: 'Chăn', hint: 'Nhẹ nhàng, ấm áp' },
  { id: 'goi', label: 'Gối', hint: 'Nâng niu từng giấc ngủ' },
  { id: 'dem', label: 'Đệm & topper', hint: 'Nâng đỡ chuẩn cột sống' },
]

/** Đường dẫn cũ (?danh-muc=ruot-goi…) vẫn mở đúng nhóm mới */
export const LEGACY_CATEGORY: Readonly<Record<string, CategoryId>> = {
  'chan-he': 'chan',
  'ruot-chan': 'chan',
  'ruot-goi': 'goi',
  topper: 'dem',
}

export const categoryLabel = (id: CategoryId): string => CATEGORIES.find((c) => c.id === id)?.label ?? ''

/**
 * Đầu trang Sản phẩm: đoạn giới thiệu và 4 cam kết của web cũ (ecopillo.com.vn/danh-muc-san-pham/san-pham/),
 * đổi "bạn" thành "Quý khách". Khách yêu cầu 16/10/2026 (mục 31: "như web cũ ok hơn"); Ecopillo đã xác nhận 17/10/2026.
 */
export const PRODUCTS_INTRO =
  'Mỗi sản phẩm chăn ga gối đệm Ecopillo là một tác phẩm được thiết kế và hoàn thiện chỉn chu, để mang đến một không gian “Chốn Yên” cho gia đình Quý khách: đầy yêu thương và ấm áp, nơi nghỉ ngơi sau một ngày dài làm việc.'

export const PRODUCTS_PROMISES: readonly string[] = [
  'Chất liệu tuyển chọn cao cấp bậc nhất trên thị trường',
  'Hoàn thiện tỉ mỉ bởi những thợ lành nghề hơn 10 năm kinh nghiệm',
  'Cập nhật sản phẩm theo xu hướng của thị trường',
  'Giao hàng nhanh chóng, nhận đặt hàng theo kích thước riêng',
]

/** Một lựa chọn khi đặt sản phẩm lẻ (thường là kích thước). Không có giá = nhân viên báo giá khi gọi xác nhận */
export interface ProductChoice {
  id: string
  label: string
  price?: number
}

export interface Product {
  slug: string
  name: string
  category: CategoryId
  /** Có với bộ chăn ga, chăn hè: dùng cho chọn mẫu, kích thước và đặt online */
  collection?: Collection
  summary: string
  min: number
  max: number
  /** Giá hiển thị dạng "từ …" (đệm) */
  isFromPrice?: boolean
  image?: ImageSource
  imageNote: string
  details: readonly string[]
  /** Ảnh phụ (ngoài ảnh chính) */
  gallery?: readonly ImageSource[]
  /** Thông số ngắn, ví dụ độ dày, bảo hành */
  specs?: readonly { label: string; value: string }[]
  /** Giá theo tổ hợp kích thước × độ dày (đệm) */
  variants?: ProductVariants
  /** Sản phẩm lẻ không có bảng giá kích thước × độ dày: các lựa chọn để đặt online */
  choices?: readonly ProductChoice[]
}

export interface ProductVariants {
  sizes: readonly string[]
  thicknesses: readonly string[]
  /** khoá `${size}|${thickness}` → giá */
  prices: Readonly<Record<string, number>>
}

export const variantPrice = (v: ProductVariants, size: string, thickness: string): number | undefined =>
  v.prices[`${size}|${thickness}`]

const collectionProduct = (c: Collection): Product => {
  const { min, max } = collectionRange(c)
  return {
    slug: c.id,
    name: c.kind === 'chan-he' ? c.name : `${c.kindLabel} ${c.name}`,
    category: c.kind === 'chan-he' ? 'chan' : 'bo-chan-ga',
    collection: c,
    summary: c.description,
    min,
    max,
    image: coverOf(c),
    imageNote: c.imageNote,
    details: [
      'Vải Lyocell nhập khẩu, dệt từ sợi gỗ tự nhiên: mềm, mát, thoáng khí, lành tính với da nhạy cảm.',
      'Họa tiết chần thêu độc quyền, đường may 4 mũi/cm.',
      ...(c.kind === 'ga-phu' && c.id === 'eco-sweet' ? ['Hoa văn dệt Jacquard nổi khối.'] : []),
      'Nhận may theo kích thước riêng: gọi hoặc nhắn Zalo để báo giá.',
    ],
  }
}

const ESSENTIAL_CATEGORY: Readonly<Record<string, CategoryId>> = {
  'ruot-goi': 'goi',
  'ruot-chan': 'chan',
  'chan-topper': 'dem',
}

const BED_SIZES = ['160 × 200 cm', '180 × 200 cm', '200 × 220 cm'] as const
const sizeChoices = (prices: readonly (number | undefined)[] = []): ProductChoice[] =>
  BED_SIZES.map((label, i) => ({ id: label.replace(/ × | cm/g, (m) => (m === ' × ' ? 'x' : '')), label, price: prices[i] }))

/**
 * Lựa chọn khi đặt sản phẩm lẻ có khoảng giá. Bảng giá cũ chỉ ghi giá thấp nhất – cao nhất,
 * nên ghép giá thấp với cỡ nhỏ, giá cao với cỡ lớn; cỡ không rõ giá thì nhân viên báo khi gọi.
 * [XÁC NHẬN VỚI ECOPILLO: cỡ ruột gối 45×65 / 50×70 và giá topper 180×200]
 */
const choicesFor = (category: CategoryId, min: number, max: number): ProductChoice[] | undefined => {
  if (min === max) return undefined
  if (category === 'goi')
    return [
      { id: '45x65', label: '45 × 65 cm', price: min },
      { id: '50x70', label: '50 × 70 cm', price: max },
    ]
  return sizeChoices([min, undefined, max])
}

const essentialProducts: Product[] = ESSENTIALS.flatMap((group) =>
  group.items
    // Chăn hè đã là sản phẩm riêng (có mẫu, đặt online)
    .filter((item) => item.name !== 'Chăn hè Lyocell')
    .map((item) => {
      const category = ESSENTIAL_CATEGORY[group.id] ?? 'goi'
      const prefix = category === 'goi' ? 'Ruột gối ' : ''
      // "Ruột gối tơ tằm" nhưng giữ hoa tên dòng "Ruột gối Micro Plus"
      const itemName = prefix && !item.name.startsWith('Micro') ? item.name.toLowerCase() : item.name
      return {
        slug: slugify(`${prefix}${item.name}`),
        name: `${prefix}${itemName}`,
        category,
        summary: item.note,
        min: item.min,
        max: item.max,
        imageNote: `Ảnh ${prefix.toLowerCase()}${itemName}`,
        details: [item.note, 'Đặt ngay trên web, nhân viên gọi xác nhận trước khi giao. Giao cùng chính sách như bộ chăn ga.'],
        choices: choicesFor(category, item.min, item.max),
      } satisfies Product
    }),
)

/** Đệm bông ép Gấm Thuần Khiết — thông tin và giá theo trang sản phẩm trên web cũ */
const GAM_THUAN_KHIET: Product = {
  slug: 'dem-bong-gam-thuan-khiet',
  name: 'Đệm bông Gấm Thuần Khiết',
  category: 'dem',
  summary:
    'Đệm bông ép truyền thống, độ cứng vừa phải: hợp người thích nằm đệm cứng, người lớn tuổi hay đau lưng và trẻ nhỏ cần nâng đỡ vững.',
  min: 3_290_000,
  max: 6_760_000,
  imageNote: 'Ảnh đệm bông Gấm Thuần Khiết',
  gallery: [productImage('dem-bong-gam-thuan-khiet-2', 'Đệm bông Gấm Thuần Khiết gấp 3')],
  details: [
    'Vỏ vải gấm dệt dày dặn, màu trung tính dễ phối chăn ga và nội thất, dễ vệ sinh.',
    'Lõi bông Polyester nguyên sinh ép nhiệt; lớp bông trải đứng giúp đàn hồi và thoáng khí hơn.',
    'Gập 3 gọn gàng, dễ di chuyển và cất khi không dùng.',
    'Đạt ISO 9001:2015 và QCVN 01:2017/BCT.',
  ],
  specs: [
    { label: 'Độ dày', value: '9 cm · 14 cm' },
    { label: 'Bảo hành', value: '5 năm' },
    { label: 'Vỏ', value: 'Vải gấm dệt' },
    { label: 'Lõi', value: 'Bông ép, trải đứng' },
  ],
  variants: {
    sizes: ['120×190', '160×200', '180×200', '200×220'],
    thicknesses: ['9 cm', '14 cm'],
    prices: {
      '120×190|9 cm': 3_290_000,
      '120×190|14 cm': 4_370_000,
      '160×200|9 cm': 3_675_000,
      '160×200|14 cm': 5_115_000,
      '180×200|9 cm': 3_837_000,
      '180×200|14 cm': 5_637_000,
      '200×220|9 cm': 4_744_000,
      '200×220|14 cm': 6_760_000,
    },
  },
}

/**
 * Mục 42 (Ecopillo trả lời 23/10/2026): thêm đệm lò xo Eco Luxe và đệm bông Nano, giá, thông số, ảnh theo web cũ
 * (/san-pham/dem-lo-xo-tui-cao-cap-eco-luxe/, /san-pham/dem-bong-nano-chan-foam/, lấy ngày 23/10/2026).
 */
const ECO_LUXE: Product = {
  slug: 'dem-lo-xo-tui-cao-cap-eco-luxe',
  name: 'Đệm lò xo túi cao cấp Eco Luxe',
  category: 'dem',
  summary:
    'Lò xo túi độc lập, mặt Pillow Top êm vừa: hợp đa số người dùng, kể cả trẻ nhỏ, người lớn tuổi và người hay đau lưng.',
  min: 10_230_000,
  max: 15_180_000,
  imageNote: 'Ảnh đệm lò xo Eco Luxe',
  gallery: [productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', 'Đệm lò xo túi cao cấp Eco Luxe, mặt Pillow Top')],
  details: [
    'Lõi lò xo túi độc lập cao 16 cm, thép 2,5 mm, mỗi lò xo xoắn 6 vòng, đường kính 6,5 cm.',
    'Lớp topper tăng tiện nghi: foam PU K50 siêu đàn hồi dày 4 cm, vải gấm xốp nhập khẩu 400 g/m² chần PU.',
    'May viền 4 đai thêu chữ Ecopillo, dễ bê khi di chuyển. Đóng gói hút chân không, cuộn tròn.',
    'Nhận đặt theo kích thước riêng.',
  ],
  specs: [
    { label: 'Độ dày', value: '28 cm' },
    { label: 'Mặt đệm', value: 'Pillow Top 3 viền' },
    { label: 'Lõi', value: 'Lò xo túi độc lập 16 cm' },
    // Catalog Ecopillo 22.07.2026
    { label: 'Bảo hành', value: '10 năm' },
    { label: 'Đóng gói', value: 'Hút chân không, cuộn tròn' },
  ],
  variants: {
    sizes: ['120×190', '160×200', '180×200', '200×220'],
    thicknesses: ['28 cm'],
    prices: {
      '120×190|28 cm': 10_230_000,
      '160×200|28 cm': 11_860_000,
      '180×200|28 cm': 12_950_000,
      '200×220|28 cm': 15_180_000,
    },
  },
}

const NANO_CHAN_FOAM: Product = {
  slug: 'dem-bong-nano-chan-foam',
  name: 'Đệm bông Nano chần foam',
  category: 'dem',
  summary:
    'Đệm bông ép gập 2, mặt chần foam: vững như đệm bông truyền thống mà mặt nằm êm hơn, hợp người lớn tuổi và trẻ nhỏ.',
  min: 4_644_000,
  max: 9_730_000,
  imageNote: 'Ảnh đệm bông Nano chần foam',
  gallery: [productImage('dem-bong-nano-chan-foam-2', 'Đệm bông Nano chần foam trải trên giường')],
  details: [
    'Vỏ vải gấm xốp định lượng cao, chần thêm một lớp foam K43 êm.',
    'Lõi bông Polyester nguyên sinh ép nhiệt cao tần; lớp giữ lõi là bông trải đứng nên đàn hồi và thoáng khí hơn.',
    'Gập 2, dễ di chuyển và cất gọn. Màu sáng trung tính, dễ vệ sinh, dễ phối chăn ga.',
    'Đạt ISO 9001:2015 và QCVN 01:2017/BCT.',
  ],
  specs: [
    { label: 'Độ dày', value: '12 cm · 18 cm' },
    { label: 'Vỏ', value: 'Gấm xốp chần foam K43' },
    { label: 'Lõi', value: 'Bông ép, trải đứng' },
    { label: 'Kiểu', value: 'Gập 2' },
  ],
  variants: {
    sizes: ['120×190', '160×200', '180×200', '200×220'],
    thicknesses: ['12 cm', '18 cm'],
    prices: {
      '120×190|12 cm': 4_644_000,
      '120×190|18 cm': 6_483_000,
      '160×200|12 cm': 5_562_000,
      '160×200|18 cm': 7_498_000,
      '180×200|12 cm': 6_066_000,
      '180×200|18 cm': 8_103_000,
      '200×220|12 cm': 7_257_000,
      '200×220|18 cm': 9_730_000,
    },
  },
}

const MATTRESS_NAMES: Readonly<Record<string, string>> = {
  'Eco Foam đa tầng': 'Đệm Eco Foam đa tầng',
  'Lò xo Eco Royal': 'Đệm lò xo Eco Royal',
  'Cao su thiên nhiên Eco Latex': 'Đệm cao su thiên nhiên Eco Latex',
}

const mattressProducts: Product[] = MATTRESSES.map((m) => {
  const name = MATTRESS_NAMES[m.name] ?? m.name
  return {
    slug: slugify(name),
    name,
    category: 'dem',
    summary: m.note,
    min: m.from,
    max: m.to,
    isFromPrice: true,
    imageNote: `Ảnh ${name.toLowerCase()}`,
    details: [
      m.note,
      'Giá theo kích thước và độ dày: nhân viên báo giá chính xác khi gọi xác nhận đơn. Có thể nằm thử tại hệ thống phân phối Ecopillo ở Hà Nội và TP. HCM.',
    ],
    specs: [{ label: 'Bảo hành', value: m.warranty }],
    choices: sizeChoices(),
  } satisfies Product
})

/** Sản phẩm lẻ có ảnh thật (lấy từ web cũ), đặt tên file theo slug */
const PRODUCT_PHOTOS = new Set([
  'ruot-goi-micro-fiber',
  'ruot-goi-micro-plus',
  'ruot-goi-to-tam',
  'ruot-goi-cao-su-thien-nhien',
  'ruot-goi-long-vu-tu-nhien',
  'chan-dong-micro-fiber',
  'chan-to-tam',
  'chan-long-vu-tu-nhien',
  'topper-micro-fiber',
  'dem-lo-xo-tui-doc-lap',
  'dem-eco-foam-da-tang',
  'dem-lo-xo-eco-royal',
  'dem-cao-su-thien-nhien-eco-latex',
  'dem-bong-gam-thuan-khiet',
  'dem-lo-xo-tui-cao-cap-eco-luxe',
  'dem-bong-nano-chan-foam',
])

const withPhoto = (p: Product): Product =>
  p.image || !PRODUCT_PHOTOS.has(p.slug) ? p : { ...p, image: productImage(p.slug, p.name) }

export const PRODUCTS: readonly Product[] = [
  ...COLLECTIONS.map(collectionProduct),
  ...essentialProducts,
  GAM_THUAN_KHIET,
  NANO_CHAN_FOAM,
  ...mattressProducts,
  ECO_LUXE,
].map(withPhoto)

export const productBySlug = (slug: string | undefined): Product | undefined => PRODUCTS.find((p) => p.slug === slug)

/** Đường link trang sản phẩm: bộ sưu tập mở trang danh mục của web cũ, sản phẩm lẻ mở trang sản phẩm của web cũ (links.ts) */
export const productPath = (p: Product): string => (p.collection ? collectionPath(p.collection) : singleProductPath(p.slug))

/** Giá một đơn vị theo lựa chọn; undefined = chưa có giá, nhân viên báo khi gọi xác nhận */
export const singleUnitPrice = (p: Product, choiceId: string | null, thickness: string | null): number | undefined => {
  if (p.variants) return choiceId && thickness ? variantPrice(p.variants, choiceId, thickness) : undefined
  if (p.choices) return p.choices.find((c) => c.id === choiceId)?.price
  return p.min
}

/** Lựa chọn hợp lệ của sản phẩm lẻ (kích thước, độ dày) */
export const isValidSingleChoice = (p: Product, choiceId: string | null, thickness: string | null): boolean => {
  if (p.variants) return Boolean(choiceId && thickness && p.variants.sizes.includes(choiceId) && p.variants.thicknesses.includes(thickness))
  if (p.choices) return p.choices.some((c) => c.id === choiceId)
  return true
}

/** Mở trang đặt hàng cho sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm) */
export const singleOrderUrl = (p: Product, choiceId?: string | null, thickness?: string | null, quantity = 1): string => {
  const params = new URLSearchParams({ 'san-pham': p.slug })
  if (choiceId) params.set('lua-chon', choiceId)
  if (thickness) params.set('do-day', thickness)
  if (quantity > 1) params.set('so-luong', String(quantity))
  return `${PATHS.order}?${params}`
}

export const priceLabel = (p: Product): string => (p.isFromPrice ? `từ ${formatVND(p.min)}` : formatRange(p.min, p.max))

/** Mở trang đặt hàng với bộ sưu tập, mẫu, kích thước đã chọn sẵn */
export const orderUrl = (collection: Collection, pattern?: Pattern, size?: SizeId | null): string => {
  const params = new URLSearchParams({ 'bo-suu-tap': collection.id })
  if (pattern) params.set('mau', pattern.code)
  if (pattern && size) params.set('kich-thuoc', size)
  return `${PATHS.order}?${params}`
}

/** Sản phẩm ứng với một dòng trong bảng giá ruột chăn gối ở trang chủ */
export const productForEssential = (itemName: string): Product | undefined =>
  PRODUCTS.find((p) => p.name === itemName || p.slug === slugify(`Ruột gối ${itemName}`))

/* ——— Lọc theo mức giá (mẫu 1 "Mốc giá theo từng loại", owner chọn 15/10/2026; mẫu: docs/de-xuat-bo-loc-gia.html) ——— */

const MILLION = 1_000_000

export interface PriceBand {
  /** Dùng trong link: ?gia=5-10-trieu */
  id: string
  label: string
  /** Khoảng [from, to): to = Infinity là "Trên …" */
  from: number
  to: number
}

const band = (id: string, label: string, from: number, to = Infinity): PriceBand => ({ id, label, from, to })

/** Mốc giá đổi theo loại vì giá mỗi loại chênh rất khác nhau (gối vài trăm nghìn, đệm hàng chục triệu). Đổi giá nhiều thì xem lại mốc */
export const PRICE_BANDS: Readonly<Record<CategoryId | 'tat-ca', readonly PriceBand[]>> = {
  'tat-ca': [
    band('duoi-1-trieu', 'Dưới 1 triệu', 0, MILLION),
    band('1-3-trieu', '1 – 3 triệu', MILLION, 3 * MILLION),
    band('3-6-trieu', '3 – 6 triệu', 3 * MILLION, 6 * MILLION),
    band('6-10-trieu', '6 – 10 triệu', 6 * MILLION, 10 * MILLION),
    band('tren-10-trieu', 'Trên 10 triệu', 10 * MILLION),
  ],
  'bo-chan-ga': [
    band('duoi-5-trieu', 'Dưới 5 triệu', 0, 5 * MILLION),
    band('5-8-trieu', '5 – 8 triệu', 5 * MILLION, 8 * MILLION),
    band('tren-8-trieu', 'Trên 8 triệu', 8 * MILLION),
  ],
  chan: [
    band('duoi-2-trieu', 'Dưới 2 triệu', 0, 2 * MILLION),
    band('2-4-trieu', '2 – 4 triệu', 2 * MILLION, 4 * MILLION),
    band('tren-4-trieu', 'Trên 4 triệu', 4 * MILLION),
  ],
  goi: [
    band('duoi-500k', 'Dưới 500 nghìn', 0, 500_000),
    band('500k-1-trieu', '500 nghìn – 1 triệu', 500_000, MILLION),
    band('tren-1-trieu', 'Trên 1 triệu', MILLION),
  ],
  dem: [
    band('duoi-5-trieu', 'Dưới 5 triệu', 0, 5 * MILLION),
    band('5-10-trieu', '5 – 10 triệu', 5 * MILLION, 10 * MILLION),
    band('10-20-trieu', '10 – 20 triệu', 10 * MILLION, 20 * MILLION),
    band('tren-20-trieu', 'Trên 20 triệu', 20 * MILLION),
  ],
}

export const priceBandsOf = (category: CategoryId | null): readonly PriceBand[] => PRICE_BANDS[category ?? 'tat-ca']

/** Thuộc mốc khi có ít nhất một cỡ có giá trong mốc, nên một sản phẩm có thể ở hai mốc (đệm Eco Foam 8 – 15,7 triệu) */
export const inPriceBand = (range: { min: number; max: number }, b: PriceBand): boolean => range.min < b.to && range.max >= b.from
