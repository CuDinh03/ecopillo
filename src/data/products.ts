import { formatRange, formatVND } from '../lib/format'
import { slugify } from '../lib/slug'
import { collectionPath, PATHS, singleProductPath } from './links'
import {
  COLLECTIONS,
  collectionRange,
  coverOf,
  ESSENTIALS,
  productImage,
  type Collection,
  type EssentialItem,
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
  /** Lựa chọn là một mẫu (chăn đông kiểu Hàn): bấm thì đổi sang ảnh của mẫu đó */
  image?: ImageSource
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
  /** Tên nhóm lựa chọn, mặc định "Kích thước" (chăn đông kiểu Hàn chọn theo "Mẫu") */
  choiceLabel?: string
  /**
   * Ecopillo chưa gửi giá (08/11/2026): min = max = 0, mọi chỗ hiện giá ghi PRICE_ON_CALL_LABEL thay cho số,
   * không vào mức giá nào khi lọc, xếp cuối khi sắp theo giá. Có giá thì bỏ cờ này và điền min, max.
   */
  isPriceOnCall?: boolean
}

/** Chữ thay cho giá khi Ecopillo chưa gửi giá (owner 28/10/2026: không để nhãn chờ trên web) */
export const PRICE_ON_CALL_LABEL = 'Báo giá khi gọi xác nhận'

/** Sản phẩm đã có giá (để tính giá thấp nhất của nhóm, lọc theo mức giá) */
export const hasPrice = (p: Product): boolean => !p.isPriceOnCall && p.min > 0

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
/** Năm cỡ đệm trong bảng giá 2026 (khách gửi 09/11/2026) */
const MATTRESS_SIZES = ['120×200', '140×200', '160×200', '180×200', '200×220'] as const
const sizeChoices = (prices: readonly (number | undefined)[] = []): ProductChoice[] =>
  BED_SIZES.map((label, i) => ({ id: label.replace(/ × | cm/g, (m) => (m === ' × ' ? 'x' : '')), label, price: prices[i] }))

/** Giá cỡ giữa (180×200) của dòng bảng giá chỉ ghi thấp – cao: bảng giá 2026 trang 21 */
const MIDDLE_PRICE: Readonly<Record<string, number>> = { 'Topper Micro Fiber': 3_850_000 }

/**
 * Lựa chọn khi đặt sản phẩm lẻ có khoảng giá. ESSENTIALS chỉ ghi giá thấp nhất – cao nhất,
 * nên ruột gối ghép giá thấp với cỡ 45×65, giá cao với cỡ 50×70 (bảng giá 2026 ghi hai cỡ này);
 * chăn, topper ghép theo ba cỡ giường, cỡ giữa lấy ở MIDDLE_PRICE.
 */
const choicesFor = (category: CategoryId, item: EssentialItem): ProductChoice[] | undefined => {
  const { min, max } = item
  if (min === max) return undefined
  if (category === 'goi')
    return [
      { id: '45x65', label: '45 × 65 cm', price: min },
      { id: '50x70', label: '50 × 70 cm', price: max },
    ]
  return sizeChoices([min, MIDDLE_PRICE[item.name], max])
}

/** Bảng giá đệm: mỗi độ dày một hàng giá, theo thứ tự cỡ trong `sizes` */
const variantGrid = (
  sizes: readonly string[],
  rows: Readonly<Record<string, readonly number[]>>,
): ProductVariants => ({
  sizes,
  thicknesses: Object.keys(rows),
  prices: Object.fromEntries(
    Object.entries(rows).flatMap(([thickness, prices]) => sizes.map((size, i) => [`${size}|${thickness}`, prices[i]])),
  ),
})

/**
 * Bảo vệ đệm, divan: giá từng cỡ khách gửi Zalo 05/11/2026, khớp bảng giá 2026; chữ theo catalog Ecopillo 22.07.2026 (trang 64, 66).
 * Ảnh divan khách gửi Zalo 08/11/2026 (tools/nen-anh-khach-gui-2026-11-09.py);
 * ảnh bảo vệ đệm lấy từ bảng giá 2026 (tools/nen-anh-bang-gia-2026-11-09.py).
 * Dòng bảng giá ở ESSENTIALS (catalog.ts) ghi giá thấp – cao, phải khớp.
 */
const BAO_VE_DEM: Product = {
  slug: 'bao-ve-dem-chong-tham',
  name: 'Bảo vệ đệm chống thấm',
  category: 'dem',
  summary: 'Tấm bảo vệ trải trên mặt đệm, dây thun 4 góc: chống thấm, chống bụi, giữ đệm luôn sạch, dễ tháo giặt.',
  min: 675_000,
  max: 889_000,
  image: productImage('bao-ve-dem-chong-tham', 'Tấm bảo vệ đệm chống thấm Ecopillo, dây thun 4 góc'),
  imageNote: 'Ảnh tấm bảo vệ đệm chống thấm',
  details: [
    'Hạn chế lấm bẩn từ mồ hôi, thức ăn, đồ uống, giữ đệm luôn sạch.',
    'Chống bám bụi, ngăn nấm mốc, vi khuẩn và côn trùng.',
    'Dây thun co giãn 4 góc giữ tấm bảo vệ không xê dịch. Dễ tháo giặt.',
  ],
  specs: [{ label: 'Cố định', value: 'Dây thun 4 góc' }],
  choices: sizeChoices([675_000, 755_000, 889_000]),
}

const DIVAN: Product = {
  slug: 'divan-ecopillo',
  name: 'Divan Ecopillo',
  category: 'dem',
  summary: 'Kệ giường khung gỗ thông, mặt foam bọc vải Canvas, cao 30 cm. Bảo hành 5 năm.',
  min: 6_580_000,
  max: 9_250_000,
  image: productImage('divan-ecopillo', 'Divan Ecopillo bọc vải xám trong phòng ngủ'),
  imageNote: 'Ảnh divan Ecopillo',
  // Ảnh chi tiết rồi 17 màu vải. Ecopillo chưa gửi tên màu nên alt ghi số thứ tự [ECOPILLO GỬI TÊN MÀU VẢI DIVAN]
  gallery: [
    productImage('divan-ecopillo-2', 'Góc divan Ecopillo bọc đồng'),
    productImage('divan-ecopillo-3', 'Bánh xe dưới chân divan Ecopillo'),
    productImage('divan-ecopillo-4', 'Mép divan Ecopillo bọc vải'),
    productImage('divan-ecopillo-5', 'Mặt vải bọc divan Ecopillo'),
    ...Array.from({ length: 17 }, (_, i) =>
      productImage(`divan-ecopillo-mau-${String(i + 1).padStart(2, '0')}`, `Divan Ecopillo, màu vải ${i + 1}`),
    ),
  ],
  details: [
    'Khung gỗ thông chắc chắn; gỗ ván ép công nghiệp 8 mm chống mối mọt.',
    'Mặt foam PU 10 mm, sợi Micro Fiber, bọc vải Canvas.',
    'Khoá chân trụ và bánh xe.',
    'Nhiều màu vải bọc như trong ảnh: Quý khách chọn màu khi nhân viên gọi xác nhận đơn.',
    'Nhận đặt theo kích thước riêng: gọi hoặc nhắn Zalo để báo giá.',
  ],
  specs: [
    { label: 'Độ cao', value: '30 cm' },
    { label: 'Bảo hành', value: '5 năm' },
    { label: 'Khung', value: 'Gỗ thông, ván ép 8 mm' },
    { label: 'Bọc', value: 'Foam PU, vải Canvas' },
  ],
  choices: [
    { id: '120x200', label: '120 × 200 cm', price: 6_580_000 },
    { id: '140x200', label: '140 × 200 cm', price: 7_460_000 },
    { id: '160x200', label: '160 × 200 cm', price: 7_860_000 },
    { id: '180x200', label: '180 × 200 cm', price: 8_500_000 },
    { id: '200x220', label: '200 × 220 cm', price: 9_250_000 },
  ],
}

/** Dòng bảng giá đã có sản phẩm riêng: chăn hè (có mẫu, đặt online), bảo vệ đệm và divan (giá từng cỡ) */
const OWN_PRODUCT_ITEMS: ReadonlySet<string> = new Set(['Chăn hè Lyocell', BAO_VE_DEM.name, DIVAN.name])

const essentialProducts: Product[] = ESSENTIALS.flatMap((group) =>
  group.items
    .filter((item) => !OWN_PRODUCT_ITEMS.has(item.name))
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
        choices: choicesFor(category, item),
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
 * Eco Luxe theo bảng giá 2026 (khách gửi 09/11/2026): cỡ nhỏ là 120×200 (không phải 120×190), thêm cỡ 140×200.
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
  variants: variantGrid(MATTRESS_SIZES, {
    '28 cm': [10_230_000, 10_780_000, 11_860_000, 12_950_000, 15_180_000],
  }),
}

/**
 * Đệm lò xo Eco Fresh: chữ, giá, bảo hành khách gửi Zalo 08/11/2026 (bảng giá Eco Fresh, dày 24 cm).
 * Mở lại trang ở link cũ /san-pham/dem-lo-xo-eco-fresh/ (trước đó 301 sang danh mục Đệm lò xo).
 */
const ECO_FRESH: Product = {
  slug: 'dem-lo-xo-eco-fresh',
  name: 'Đệm lò xo Eco Fresh',
  category: 'dem',
  summary:
    'Dòng đệm lò xo tiêu chuẩn, rất phù hợp cho gia đình, nhà cho thuê, khách sạn, homestay cần mức đầu tư hợp lý nhưng vẫn đảm bảo độ bền và cảm giác nằm êm ái.',
  min: 4_700_000,
  max: 7_650_000,
  imageNote: 'Ảnh đệm lò xo Eco Fresh',
  gallery: [
    productImage('dem-lo-xo-eco-fresh-2', 'Góc đệm lò xo Eco Fresh thêu chữ Ecopillo'),
    productImage('dem-lo-xo-eco-fresh-3', 'Mặt đệm Eco Fresh chần foam'),
    productImage('dem-lo-xo-eco-fresh-4', 'Viền đệm lò xo Eco Fresh'),
  ],
  details: [
    'Độ êm vừa phải, đàn hồi và nâng đỡ tốt.',
    'Mặt đệm chần foam mềm mại, có thể nằm êm cả 2 mặt.',
    'Hệ thống lò xo thép chống gỉ, chịu lực tốt, độ bền cao.',
    'Thoáng khí, dễ vệ sinh, phù hợp sử dụng thường xuyên.',
    'Sản xuất tại Việt Nam từ nguyên liệu nhập khẩu.',
  ],
  specs: [
    { label: 'Độ dày', value: '24 cm' },
    { label: 'Bảo hành', value: '7 năm' },
    { label: 'Mặt đệm', value: 'Chần foam, nằm cả 2 mặt' },
    { label: 'Lõi', value: 'Lò xo thép chống gỉ' },
  ],
  variants: {
    sizes: ['120×200', '140×200', '160×200', '180×200', '200×220'],
    thicknesses: ['24 cm'],
    prices: {
      '120×200|24 cm': 4_700_000,
      '140×200|24 cm': 5_180_000,
      '160×200|24 cm': 5_750_000,
      '180×200|24 cm': 6_500_000,
      '200×220|24 cm': 7_650_000,
    },
  },
}

/** Sáu mẫu chăn đông kiểu Hàn khách gửi 08/11/2026, theo thứ tự khách liệt kê. Mã in sẵn trên ảnh */
const CHAN_HAN_CODES = ['EF18', 'EV05', 'EV06', 'EF10', 'ER09', 'ER42'] as const
const chanHanImage = (code: string) => productImage(`chan-dong-kieu-han-${code.toLowerCase()}`, `Chăn đông kiểu Hàn mẫu ${code}`)

/**
 * Chăn đông kiểu Hàn: chữ khách gửi Zalo 08/11/2026. Chưa có giá, cỡ [ECOPILLO GỬI GIÁ, KÍCH THƯỚC CHĂN ĐÔNG KIỂU HÀN]:
 * khách chọn mẫu, nhân viên báo giá khi gọi xác nhận. Khác chăn đông Micro Fiber (ruột chăn rời).
 */
const CHAN_DONG_KIEU_HAN: Product = {
  slug: 'chan-dong-kieu-han',
  name: 'Chăn đông kiểu Hàn cao cấp',
  category: 'chan',
  summary:
    'Dành cho những ai yêu thích sự ấm áp nhưng không muốn cảm giác nặng nề, bí bách khi ngủ: chỉ hơn 2 kg mà ấm áp bất ngờ.',
  min: 0,
  max: 0,
  isPriceOnCall: true,
  image: chanHanImage(CHAN_HAN_CODES[0]),
  imageNote: 'Ảnh chăn đông kiểu Hàn',
  gallery: CHAN_HAN_CODES.slice(1).map(chanHanImage),
  details: [
    'Lớp bông Microfiber cao cấp chần trực tiếp vào vỏ, vừa mềm nhẹ vừa giữ ấm tốt.',
    'Vải Lyocell mềm mịn, êm ái mỗi khi chạm vào.',
    'Không cần mua riêng ruột chăn hay vỏ chăn, không lo lớp bông xô lệch như chăn lồng ruột thông thường.',
    'Gọn nhẹ, tiện lợi, đồng hành cùng gia đình qua nhiều mùa đông.',
  ],
  specs: [
    { label: 'Trọng lượng', value: 'Hơn 2 kg' },
    { label: 'Vỏ', value: 'Vải Lyocell' },
    { label: 'Bông', value: 'Microfiber chần liền vỏ' },
    { label: 'Mẫu', value: `${CHAN_HAN_CODES.length} mẫu` },
  ],
  choiceLabel: 'Mẫu',
  choices: CHAN_HAN_CODES.map((code) => ({ id: code.toLowerCase(), label: code, image: chanHanImage(code) })),
}

/** Câu về bông PE, theo tài liệu training sản phẩm 2026 (trang 39) */
const BONG_PE_NOTES: readonly string[] = [
  'Bông gòn PE (Polyester Fiber): nhẹ, thoáng, đàn hồi tốt, bền form.',
  'Sợi PE có độ phồng tự nhiên, không xẹp lún nhanh, không hút ẩm nên hạn chế nấm mốc và an toàn cho da.',
]
const ORDER_NOTE = 'Đặt ngay trên web, nhân viên gọi xác nhận trước khi giao. Giao cùng chính sách như bộ chăn ga.'

/**
 * Ruột gối bông PE: ảnh khách gửi Zalo 08/11/2026, xếp vào nhóm Đồ ruột.
 * Giá, cỡ theo bảng giá 2026 (khách gửi 09/11/2026): 45×65 180.000đ, 50×70 215.000đ.
 */
const RUOT_GOI_BONG_PE: Product = {
  slug: 'ruot-goi-bong-pe',
  name: 'Ruột gối bông PE',
  category: 'goi',
  summary: 'Ruột gối nằm nhồi bông PE: nhẹ, thoáng, đàn hồi tốt, không hút ẩm nên hạn chế nấm mốc.',
  min: 180_000,
  max: 215_000,
  image: productImage('ruot-goi-bong-pe', 'Ruột gối bông PE Ecopillo'),
  imageNote: 'Ảnh ruột gối bông PE',
  details: [...BONG_PE_NOTES, 'Vỏ vải trắng viền chỉ, may nhãn Ecopillo.', ORDER_NOTE],
  choices: [
    { id: '45x65', label: '45 × 65 cm', price: 180_000 },
    { id: '50x70', label: '50 × 70 cm', price: 215_000 },
  ],
}

/* ——— Sản phẩm mới trong bảng giá 2026 (khách gửi 09/11/2026), web cũ không có ——— */

/** Ruột gối ôm, gối tựa bông PE: giá bảng giá 2026 trang 22–23, cỡ theo training trang 39. Ảnh từ bảng giá */
const RUOT_GOI_OM: Product = {
  slug: 'ruot-goi-om',
  name: 'Ruột gối ôm bông PE',
  category: 'goi',
  summary: 'Ruột gối ôm 80 × 100 cm nhồi bông PE: nhẹ, đàn hồi tốt, giữ form lâu.',
  min: 390_000,
  max: 390_000,
  imageNote: 'Ảnh ruột gối ôm bông PE',
  details: [...BONG_PE_NOTES, ORDER_NOTE],
  specs: [
    { label: 'Kích thước', value: '80 × 100 cm' },
    { label: 'Ruột', value: 'Bông PE' },
  ],
}

const RUOT_GOI_TUA: Product = {
  slug: 'ruot-goi-tua',
  name: 'Ruột gối tựa bông PE',
  category: 'goi',
  summary: 'Ruột gối tựa vuông 45 × 45 cm nhồi bông PE, dùng tựa lưng trên giường, sofa.',
  min: 158_000,
  max: 158_000,
  imageNote: 'Ảnh ruột gối tựa bông PE',
  details: [...BONG_PE_NOTES, ORDER_NOTE],
  specs: [
    { label: 'Kích thước', value: '45 × 45 cm' },
    { label: 'Ruột', value: 'Bông PE' },
  ],
}

/** Ruột chăn Micro Plus: giá bảng giá 2026 trang 23, chữ theo training trang 34. Ảnh từ bảng giá */
const RUOT_CHAN_MICRO_PLUS: Product = {
  slug: 'ruot-chan-micro-plus',
  name: 'Ruột chăn Micro Plus',
  category: 'chan',
  summary: 'Cân bằng giữa độ phồng, độ nhẹ và khả năng giữ nhiệt: ấm nhanh mà không cần chăn dày nặng.',
  min: 1_780_000,
  max: 1_780_000,
  imageNote: 'Ảnh ruột chăn Micro Plus',
  details: [
    'Lõi sợi Micro Plus mảnh, tơi xốp, đàn hồi tốt; tạo lớp không khí tĩnh khoá nhiệt mà vẫn thông thoáng.',
    'Chần điểm tròn cố định lõi sợi ở nhiều điểm, hạn chế dồn sợi.',
    'Vải bọc mềm mịn, mật độ sợi cao, không xô lệch, vón cục sau thời gian dài.',
    'Nhẹ, không đè người khi ngủ, ít tiếng động khi trở mình.',
    ORDER_NOTE,
  ],
  specs: [
    { label: 'Kích thước', value: '200 × 220 cm' },
    { label: 'Ruột', value: 'Sợi Micro Plus' },
    { label: 'Kiểu chần', value: 'Chần điểm tròn' },
  ],
}

/**
 * Vỏ gối bán lẻ: bảng giá 2026 trang 18 chỉ ghi tên, đơn vị, giá.
 * [ECOPILLO GỬI ẢNH, CHẤT LIỆU, KÍCH THƯỚC VỎ GỐI]: cỡ vỏ gối nằm, gối ôm lấy theo vỏ gối trong các bộ chăn ga (45×65, 80×100);
 * vỏ gối trẻ em chưa rõ cỡ nên để trống.
 */
const pillowCase = (slug: string, name: string, price: number, summary: string, size?: string): Product => ({
  slug,
  name,
  category: 'goi',
  summary,
  min: price,
  max: price,
  imageNote: `Ảnh ${name.toLowerCase()}`,
  details: [summary, ORDER_NOTE],
  ...(size ? { specs: [{ label: 'Kích thước', value: size }] } : {}),
})

const VO_GOI: readonly Product[] = [
  pillowCase('vo-goi-nam', 'Vỏ gối nằm (đôi)', 780_000, 'Một đôi vỏ gối nằm Ecopillo, bán lẻ để thay hoặc thêm cho bộ chăn ga.', '45 × 65 cm'),
  pillowCase('vo-goi-tre-em', 'Vỏ gối trẻ em', 345_000, 'Vỏ gối trẻ em Ecopillo, bán theo chiếc.'),
  pillowCase('vo-goi-om', 'Vỏ gối ôm', 280_000, 'Vỏ gối ôm Ecopillo, bán theo chiếc.', '80 × 100 cm'),
]

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

/**
 * Bốn dòng đệm giá theo kích thước × độ dày: bảng giá 2026 (khách gửi 09/11/2026), chữ theo training sản phẩm 2026.
 * Bảo hành theo Sổ bảo hành 2026 (lò xo, Eco Foam 10 năm; cao su thiên nhiên 15 năm).
 */
const LO_XO_TUI_DOC_LAP: Product = {
  slug: 'dem-lo-xo-tui-doc-lap',
  name: 'Đệm lò xo túi độc lập',
  category: 'dem',
  summary:
    'Dòng đệm lò xo bán chạy nhất: nâng đỡ 3 vùng vai, lưng, hông, nằm cạnh nhau trở mình không rung. Cao 24 cm, hợp từ gia đình trẻ đến người lớn tuổi.',
  min: 6_130_000,
  max: 9_060_000,
  isFromPrice: true,
  imageNote: 'Ảnh đệm lò xo túi độc lập',
  details: [
    'Lò xo túi độc lập thép chống rỉ nhập khẩu, 6 vòng xoắn, bền theo thời gian.',
    'Nâng đỡ 3 vùng cơ thể vai, lưng, hông; không rung, không lắc, hạn chế ảnh hưởng người nằm cạnh.',
    'Lớp tiện nghi foam PU đàn hồi và bông tiện nghi giúp phân tán áp lực, tăng độ êm.',
    'Vải Quilted Jacquard 350 gsm thoáng mát, mềm, kháng mạt bụi; hoa văn độc quyền Ecopillo.',
  ],
  specs: [
    { label: 'Độ dày', value: '24 cm' },
    { label: 'Bảo hành', value: '10 năm' },
  ],
  variants: variantGrid(MATTRESS_SIZES, {
    '24 cm': [6_130_000, 6_420_000, 7_060_000, 7_750_000, 9_060_000],
  }),
}

const ECO_FOAM: Product = {
  slug: 'dem-eco-foam-da-tang',
  name: 'Đệm Eco Foam đa tầng',
  category: 'dem',
  summary:
    'Nhiều lớp foam ôm theo đường cong cơ thể: êm, mát, nâng đỡ chuẩn, không xẹp, không lún võng. Hợp mọi lứa tuổi, nhất là người đau lưng.',
  min: 7_190_000,
  max: 18_440_000,
  isFromPrice: true,
  imageNote: 'Ảnh đệm Eco Foam đa tầng',
  details: [
    'Foam đa tầng: memory foam lạnh, memory foam massage, dưới cùng là foam nguyên khối K50.',
    'Vải Extra Cool cân bằng nhiệt, kháng khuẩn, kháng nấm mốc.',
    'Không xẹp, không biến dạng, không lún võng dù dùng lâu dài.',
    'Đóng gói hút chân không, cuộn tròn, dễ mang vào nhà, lên tầng.',
  ],
  specs: [{ label: 'Bảo hành', value: '10 năm' }],
  variants: variantGrid(MATTRESS_SIZES, {
    '10 cm': [7_190_000, 8_120_000, 8_700_000, 9_490_000, 11_030_000],
    '15 cm': [8_020_000, 9_230_000, 10_120_000, 11_060_000, 13_050_000],
    '20 cm': [9_650_000, 10_980_000, 12_060_000, 13_280_000, 15_700_000],
    '25 cm': [11_200_000, 12_790_000, 14_090_000, 15_550_000, 18_440_000],
  }),
}

const ECO_ROYAL: Product = {
  slug: 'dem-lo-xo-eco-royal',
  name: 'Đệm lò xo Eco Royal',
  category: 'dem',
  summary:
    'Đệm lò xo cao cấp nhất của Ecopillo: lò xo túi phân 5 vùng, topper 3 tầng có cao su thiên nhiên, vải Extra Cool mát lưng.',
  min: 14_365_000,
  max: 22_335_000,
  isFromPrice: true,
  imageNote: 'Ảnh đệm lò xo Eco Royal',
  details: [
    'Lò xo túi độc lập thép mạ kẽm, phân 5 vùng nâng đỡ; viền foam bao thành dày 7 cm giữ thành đệm chắc.',
    'Topper 3 tầng: cao su thiên nhiên, memory foam, foam lượn sóng tạo khe thoáng.',
    'Vải Extra Cool tản nhiệt nhanh; sợi có Nano bạc kháng khuẩn, khử mùi.',
    'Tĩnh âm khi trở mình. Đóng gói hút chân không, cuộn tròn.',
  ],
  specs: [
    { label: 'Độ dày', value: '29 cm' },
    { label: 'Bảo hành', value: '10 năm' },
  ],
  variants: variantGrid(MATTRESS_SIZES, {
    '29 cm': [14_365_000, 15_800_000, 17_280_000, 18_965_000, 22_335_000],
  }),
}

const ECO_LATEX: Product = {
  slug: 'dem-cao-su-thien-nhien-eco-latex',
  name: 'Đệm cao su thiên nhiên Eco Latex',
  category: 'dem',
  summary:
    'Ruột 100% cao su thiên nhiên: đàn hồi tự nhiên, thoáng khí, kháng khuẩn, chống nấm mốc. Dòng đệm bền nhất, bảo hành 15 năm.',
  min: 16_100_000,
  max: 39_000_000,
  isFromPrice: true,
  imageNote: 'Ảnh đệm cao su thiên nhiên Eco Latex',
  details: [
    'Ruột 100% mủ cao su thiên nhiên, lỗ thoáng phân bố đều giúp khí lưu thông, phân tán áp lực vai, lưng, hông.',
    'Kháng khuẩn, kháng nấm mốc, không gây dị ứng, an toàn cho trẻ nhỏ và làn da nhạy cảm.',
    'Vỏ ngoài vải Cool Jacquard mát, tháo ra giặt được.',
  ],
  specs: [{ label: 'Bảo hành', value: '15 năm' }],
  variants: variantGrid(['160×200', '180×200', '200×220'], {
    '10 cm': [16_100_000, 18_760_000, 23_000_000],
    '15 cm': [22_200_000, 25_900_000, 31_700_000],
    '20 cm': [29_600_000, 33_000_000, 39_000_000],
  }),
}

/**
 * Đệm bông ép Mix Latex: bảng giá 2026 trang 3 (giá, ảnh), training trang 25–26 (chữ), Sổ bảo hành (7 năm).
 * Mở lại trang ở link cũ /san-pham/dem-bong-ep-cao-cap-mix-latex/ (trước đó 301 sang danh mục Đệm bông ép).
 */
const MIX_LATEX: Product = {
  slug: 'dem-bong-ep-cao-cap-mix-latex',
  name: 'Đệm bông ép Mix Latex',
  category: 'dem',
  summary:
    'Cho người thích nằm cứng mà vẫn muốn êm nhẹ: lõi bông ép, mặt 2 cm cao su thiên nhiên. Hợp trẻ em, người già, người đau lưng, cột sống.',
  min: 6_250_000,
  max: 13_000_000,
  isFromPrice: true,
  imageNote: 'Ảnh đệm bông ép Mix Latex',
  gallery: [
    productImage('dem-bong-ep-cao-cap-mix-latex-2', 'Đệm bông ép Mix Latex nhìn chính diện'),
    productImage('dem-bong-ep-cao-cap-mix-latex-3', 'Đệm bông ép Mix Latex gập 2'),
    productImage('dem-bong-ep-cao-cap-mix-latex-4', 'Mặt chần đệm bông ép Mix Latex'),
  ],
  details: [
    'Độ êm vừa: không quá cứng như bông ép truyền thống, không mềm như foam; nâng đỡ trục sống tự nhiên.',
    'Lõi bông ép xanh Nano Bạc Ag+ kháng khuẩn, kháng nấm, kháng mạt bụi; không xẹp, không biến dạng.',
    'Mặt 2 cm cao su thiên nhiên tăng độ êm, đàn hồi nhẹ, phân bổ áp lực đều vùng lưng, hông, vai.',
    'Vải gấm xốp nhập khẩu 400 g/m chần foam. Gập 2, dễ di chuyển; ấm mùa đông, thoáng mùa hè.',
    'Nhận đặt theo kích thước riêng.',
  ],
  specs: [
    { label: 'Độ dày', value: '12 · 14 · 17 · 21 cm' },
    { label: 'Bảo hành', value: '7 năm' },
    { label: 'Kiểu', value: 'Gập 2' },
    { label: 'Lõi', value: 'Bông ép Nano Bạc, mặt cao su 2 cm' },
  ],
  variants: variantGrid(MATTRESS_SIZES, {
    '12 cm': [6_250_000, 7_130_000, 7_380_000, 8_100_000, 9_410_000],
    '14 cm': [6_660_000, 7_690_000, 7_780_000, 8_680_000, 10_280_000],
    '17 cm': [7_590_000, 8_840_000, 9_060_000, 10_130_000, 11_890_000],
    '21 cm': [8_260_000, 9_570_000, 9_860_000, 10_960_000, 13_000_000],
  }),
}

/** Sản phẩm lẻ có ảnh thật (web cũ, ảnh khách gửi, bảng giá 2026), đặt tên file theo slug */
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
  'dem-lo-xo-eco-fresh',
  'dem-bong-ep-cao-cap-mix-latex',
  'ruot-goi-om',
  'ruot-goi-tua',
  'ruot-chan-micro-plus',
])

const withPhoto = (p: Product): Product =>
  p.image || !PRODUCT_PHOTOS.has(p.slug) ? p : { ...p, image: productImage(p.slug, p.name) }

export const PRODUCTS: readonly Product[] = [
  ...COLLECTIONS.map(collectionProduct),
  ...essentialProducts,
  CHAN_DONG_KIEU_HAN,
  RUOT_CHAN_MICRO_PLUS,
  RUOT_GOI_BONG_PE,
  RUOT_GOI_OM,
  RUOT_GOI_TUA,
  ...VO_GOI,
  GAM_THUAN_KHIET,
  MIX_LATEX,
  NANO_CHAN_FOAM,
  LO_XO_TUI_DOC_LAP,
  ECO_FOAM,
  ECO_ROYAL,
  ECO_LATEX,
  ECO_LUXE,
  ECO_FRESH,
  BAO_VE_DEM,
  DIVAN,
].map(withPhoto)

export const productBySlug = (slug: string | undefined): Product | undefined => PRODUCTS.find((p) => p.slug === slug)

/** Đường link trang sản phẩm: bộ sưu tập mở trang danh mục của web cũ, sản phẩm lẻ mở trang sản phẩm của web cũ (links.ts) */
export const productPath = (p: Product): string => (p.collection ? collectionPath(p.collection) : singleProductPath(p.slug))

/** Giá một đơn vị theo lựa chọn; undefined = chưa có giá, nhân viên báo khi gọi xác nhận */
export const singleUnitPrice = (p: Product, choiceId: string | null, thickness: string | null): number | undefined => {
  if (p.variants) return choiceId && thickness ? variantPrice(p.variants, choiceId, thickness) : undefined
  if (p.choices) return p.choices.find((c) => c.id === choiceId)?.price
  return p.isPriceOnCall ? undefined : p.min
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

export const priceLabel = (p: Product): string => {
  if (!hasPrice(p)) return PRICE_ON_CALL_LABEL
  return p.isFromPrice ? `từ ${formatVND(p.min)}` : formatRange(p.min, p.max)
}

/** Giá ngắn trên thẻ kệ: chỉ giá thấp nhất cho gọn, giá đủ khoảng ở trang sản phẩm */
export const shortPriceLabel = (p: Product): string => {
  if (!hasPrice(p)) return PRICE_ON_CALL_LABEL
  return p.min === p.max ? formatVND(p.min) : `từ ${formatVND(p.min)}`
}

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

/** Thuộc mốc khi có ít nhất một cỡ có giá trong mốc, nên một sản phẩm có thể ở hai mốc (đệm Eco Foam 7,19 – 18,44 triệu) */
export const inPriceBand = (range: { min: number; max: number }, b: PriceBand): boolean => range.min < b.to && range.max >= b.from
