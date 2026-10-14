import { formatRange, formatVND } from '../lib/format'
import { slugify } from '../lib/slug'
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
      'Họa tiết chần thêu độc quyền, đường may 4 mũi.',
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
    specs: [{ label: 'Bảo hành', value: 'Theo dòng đệm, 5–15 năm' }],
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
])

const withPhoto = (p: Product): Product =>
  p.image || !PRODUCT_PHOTOS.has(p.slug) ? p : { ...p, image: productImage(p.slug, p.name) }

export const PRODUCTS: readonly Product[] = [
  ...COLLECTIONS.map(collectionProduct),
  ...essentialProducts,
  GAM_THUAN_KHIET,
  ...mattressProducts,
].map(withPhoto)

export const productBySlug = (slug: string | undefined): Product | undefined => PRODUCTS.find((p) => p.slug === slug)

export const productPath = (p: Product): string => `/san-pham/${p.slug}`

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
  return `/dat-hang?${params}`
}

export const priceLabel = (p: Product): string => (p.isFromPrice ? `từ ${formatVND(p.min)}` : formatRange(p.min, p.max))

/** Mở trang đặt hàng với bộ sưu tập, mẫu, kích thước đã chọn sẵn */
export const orderUrl = (collection: Collection, pattern?: Pattern, size?: SizeId | null): string => {
  const params = new URLSearchParams({ 'bo-suu-tap': collection.id })
  if (pattern) params.set('mau', pattern.code)
  if (pattern && size) params.set('kich-thuoc', size)
  return `/dat-hang?${params}`
}

/** Sản phẩm ứng với một dòng trong bảng giá ruột chăn gối ở trang chủ */
export const productForEssential = (itemName: string): Product | undefined =>
  PRODUCTS.find((p) => p.name === itemName || p.slug === slugify(`Ruột gối ${itemName}`))
