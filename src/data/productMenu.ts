import {
  BEDDING_SETS,
  collectionById,
  patternImage,
  productImage,
  type Collection,
  type ImageSource,
} from './catalog'
import { HOTEL_PHOTOS } from './hotel'
import { collectionPathById, LISTINGS, PATHS, singleProductPath } from './links'
import { hasPrice, PRICE_ON_CALL_LABEL, PRODUCTS, productBySlug, type Product } from './products'

/**
 * Ô xổ "Sản phẩm" trên thanh đầu trang.
 * Góp ý 04/11 mục 3, 13 (owner chọn B 05/11) → phản hồi 05/11 mục 10 (phương án A trong
 * docs/de-xuat-menu-lien-he-05-11.html): năm nhóm theo thứ tự anh Quang ghi.
 * Không ghi số mẫu, số bộ (khách 05/11: "đừng cho số lượng vào").
 * [XÁC NHẬN còn mục nào sau Sản phẩm khách sạn] — tin nhắn bị cắt; dừng ở năm nhóm đã ghi.
 * [XÁC NHẬN Divan / Bảo vệ đệm giữ trong Đệm] — mẫu đặt ở nhóm Đệm.
 * Eco Ceno (web cũ có) chưa đưa vào: [XÁC NHẬN Ecopillo còn bán Eco Ceno không].
 */

export interface MenuRow {
  label: string
  to: string
  min: number
  /** Có giá cao hơn (theo kích thước, độ dày, mẫu) thì ghi "từ …" */
  isFromPrice: boolean
  /**
   * Chữ giá thay cho số (khi một bộ chưa có giá ga chun chần).
   * Khi có thì ProductMenu hiện nguyên chữ này, không format VND.
   */
  priceLabel?: string
}

/** Nhóm con trong một cột (ga phủ / ga phủ và chun chần / ga chun) */
export interface MenuSection {
  title: string
  /** Ghi chú ngắn dưới tiêu đề (không phải link) */
  note?: string
  rows: readonly MenuRow[]
}

export interface MenuGroup {
  id: string
  title: string
  to: string
  image: ImageSource
  min: number
  /** Dòng phẳng (Đệm, Đồ ruột…); bỏ trống nếu dùng sections */
  rows: readonly MenuRow[]
  /** Nhóm con trong cột Bộ chăn ga */
  sections?: readonly MenuSection[]
}

const productOf = (slug: string): Product => {
  const p = productBySlug(slug)
  if (!p) throw new Error(`productMenu: thiếu sản phẩm ${slug}`)
  return p
}

/** Sản phẩm của một trang danh mục web cũ (LISTINGS): theo danh sách riêng, hoặc cả nhóm */
const listingProducts = (path: string): readonly Product[] => {
  const listing = LISTINGS[path]
  if (!listing) throw new Error(`productMenu: thiếu danh mục ${path}`)
  if (listing.products) return listing.products.map(productOf)
  if (listing.collections) return listing.collections.map(productOf)
  return PRODUCTS.filter((p) => p.category === listing.category)
}

/** Giá của dòng tính trên sản phẩm đã có giá; cả dòng chưa có giá thì ghi chữ thay số */
const rowOf = (label: string, to: string, products: readonly Product[]): MenuRow => {
  const priced = products.filter(hasPrice)
  if (!priced.length) return { label, to, min: 0, isFromPrice: false, priceLabel: PRICE_ON_CALL_LABEL.toLowerCase() }
  const min = Math.min(...priced.map((p) => p.min))
  const max = Math.max(...priced.map((p) => p.max))
  // Có sản phẩm chưa có giá trong dòng thì cũng ghi "từ …"
  return { label, to, min, isFromPrice: max > min || priced.length < products.length }
}

const listingRow = (path: string, label = LISTINGS[path]?.title ?? ''): MenuRow =>
  rowOf(label, path, listingProducts(path))

const productRow = (slug: string, label?: string): MenuRow => {
  const p = productOf(slug)
  return rowOf(label ?? p.name, p.collection ? collectionPathById(slug) : singleProductPath(slug), [p])
}

const collectionRow = (id: string): MenuRow => productRow(id, collectionById(id)?.name)

/** Giá thấp nhất ga chun chần của một bộ (mẫu có fittedPrices). Không có giá → undefined */
const fittedMinOf = (collection: Collection): number | undefined => {
  const values = collection.patterns.flatMap((p) =>
    p.fittedPrices ? Object.values(p.fittedPrices) : [],
  )
  return values.length ? Math.min(...values) : undefined
}

/** Dòng ga chun chần: cùng link bộ sưu tập (chọn kiểu ga ở bước đặt). Bộ chưa có giá thì ghi chữ thay số. */
const fittedRow = (id: string): MenuRow => {
  const collection = collectionById(id)
  if (!collection) throw new Error(`productMenu: thiếu bộ ${id}`)
  const min = fittedMinOf(collection)
  return {
    label: collection.name,
    to: collectionPathById(id),
    min: min ?? 0,
    isFromPrice: min != null,
    // Vera đã có giá từ bảng giá 2026 (khách gửi 08/11/2026); giữ nhánh này cho bộ mới chưa có giá
    ...(min == null ? { priceLabel: PRICE_ON_CALL_LABEL.toLowerCase() } : {}),
  }
}

const groupMin = (rows: readonly MenuRow[]): number => {
  const priced = rows.filter((r) => r.priceLabel == null && r.min > 0).map((r) => r.min)
  return priced.length ? Math.min(...priced) : 0
}

const group = (g: Omit<MenuGroup, 'min'>): MenuGroup => {
  const allRows = g.sections?.length ? g.sections.flatMap((s) => s.rows) : g.rows
  return { ...g, min: groupMin(allRows) }
}

const DEM_PATH = '/danh-muc-san-pham/dem-ecopillo/'
const GA_PHU_PATH = '/danh-muc-san-pham/san-pham/bo-ga-phu/'
const RUOT_PATH = '/danh-muc-san-pham/san-pham/ruot-chan-goi/'
const CHAN_HE_PATH = '/danh-muc-san-pham/san-pham/chan-he/'

/** Thứ tự ga phủ: cao cấp trước (Doris → Sweet → Liora → Rosa → Tera → Vera), khớp mục 8 */
const GA_PHU_ORDER: readonly string[] = [
  'eco-doris',
  'eco-sweet',
  'eco-liora',
  'eco-rosa',
  'eco-tera',
  'eco-vera',
]

/** Bộ có tuỳ chọn ga chun chần (Rosa, Tera, Vera; mục 28) */
const GA_CHUN_CHAN_ORDER: readonly string[] = ['eco-rosa', 'eco-tera', 'eco-vera']

export const PRODUCT_MENU: readonly MenuGroup[] = [
  group({
    id: 'dem',
    title: 'Đệm Ecopillo',
    to: DEM_PATH,
    image: productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', 'Đệm Ecopillo'),
    rows: [
      listingRow('/danh-muc-san-pham/san-pham/dem-lo-xo/'),
      listingRow('/danh-muc-san-pham/san-pham/dem-cao-su/'),
      listingRow('/danh-muc-san-pham/san-pham/dem-bong-ep/'),
      listingRow('/danh-muc-san-pham/san-pham/dem-foam/'),
      productRow('topper-micro-fiber', 'Topper'),
      // [XÁC NHẬN Divan / Bảo vệ đệm giữ trong Đệm]
      productRow('divan-ecopillo', 'Divan'),
      productRow('bao-ve-dem-chong-tham', 'Bảo vệ đệm'),
    ],
  }),
  group({
    id: 'bo-chan-ga',
    title: 'Bộ chăn ga Ecopillo',
    to: GA_PHU_PATH,
    image: patternImage('ED25', 'Bộ chăn ga Ecopillo'),
    rows: [],
    sections: [
      {
        title: 'Ga phủ',
        rows: GA_PHU_ORDER.map(collectionRow),
      },
      {
        title: 'Ga phủ và chun chần',
        // Rosa, Tera, Vera — chọn ga chun chần ở bước kích thước khi đặt
        note: 'Chọn ga chun chần khi đặt hàng',
        rows: GA_CHUN_CHAN_ORDER.map(fittedRow),
      },
      {
        title: 'Ga chun',
        rows: [collectionRow('eco-flora')],
      },
    ],
  }),
  group({
    id: 'do-ruot',
    title: 'Đồ ruột',
    to: RUOT_PATH,
    image: productImage('ruot-goi-micro-plus', 'Đồ ruột Ecopillo'),
    rows: [
      listingRow('/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/', 'Ruột gối nằm'),
      listingRow(RUOT_PATH, 'Ruột chăn gối'),
    ],
  }),
  group({
    id: 'chan',
    title: 'Chăn đông và chăn hè',
    to: CHAN_HE_PATH,
    image: patternImage('ER09', 'Chăn đông và chăn hè'),
    rows: [
      productRow('chan-dong-micro-fiber'),
      productRow('chan-dong-kieu-han'),
      productRow('ruot-chan-micro-plus'),
      productRow('chan-to-tam'),
      productRow('chan-long-vu-tu-nhien'),
      collectionRow('chan-he-lyocell'),
    ],
  }),
  group({
    id: 'khach-san',
    title: 'Sản phẩm khách sạn',
    to: PATHS.hotel,
    image: HOTEL_PHOTOS.sheets,
    rows: [
      {
        label: 'Hàng trắng khách sạn',
        to: PATHS.hotel,
        min: 0,
        isFromPrice: false,
        priceLabel: 'giá liên hệ',
      },
    ],
  }),
]

/** Dòng cuối ô xổ */
export const PRODUCT_MENU_ALL = { label: 'Xem tất cả sản phẩm', to: PATHS.products } as const
export const PRODUCT_MENU_GIFTS = {
  lead: 'Quà tặng doanh nghiệp, sự kiện:',
  label: 'Quà tặng và sự kiện',
  to: PATHS.gifts,
} as const

/** Kiểm tra BEDDING_SETS còn đủ khi thêm bộ mới (tránh quên đưa vào menu) */
void BEDDING_SETS
