import { collectionById, patternImage, productImage, type ImageSource } from './catalog'
import { collectionPathById, LISTINGS, PATHS, singleProductPath } from './links'
import { PRODUCTS, productBySlug, type Product } from './products'
import { colorwayCount } from './productShelves'

/**
 * Ô xổ "Sản phẩm" trên thanh đầu trang (góp ý 04/11/2026 mục 3, 13; owner chọn phương án B ngày 05/11/2026).
 * Năm nhóm theo thứ tự và tên nhóm của menu web cũ, thêm Topper vào nhóm Đệm. Mẫu: docs/de-xuat-menu-san-pham-04-11.html.
 * Mọi link là link web cũ đã có (links.ts); giá, số mẫu tính từ PRODUCTS, không chép tay.
 * Eco Ceno (web cũ có) chưa đưa vào: [XÁC NHẬN Ecopillo còn bán Eco Ceno không].
 */

export interface MenuRow {
  label: string
  to: string
  min: number
  /** Có giá cao hơn (theo kích thước, độ dày, mẫu) thì ghi "từ …" */
  isFromPrice: boolean
}

export interface MenuGroup {
  id: string
  title: string
  to: string
  image: ImageSource
  /** Dòng phụ trên thẻ điện thoại, ví dụ "6 bộ sưu tập" */
  note: string
  min: number
  rows: readonly MenuRow[]
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

const rowOf = (label: string, to: string, products: readonly Product[]): MenuRow => {
  const min = Math.min(...products.map((p) => p.min))
  const max = Math.max(...products.map((p) => p.max))
  return { label, to, min, isFromPrice: max > min }
}

const listingRow = (path: string, label = LISTINGS[path]?.title ?? ''): MenuRow => rowOf(label, path, listingProducts(path))

const productRow = (slug: string, label?: string): MenuRow => {
  const p = productOf(slug)
  return rowOf(label ?? p.name, p.collection ? collectionPathById(slug) : singleProductPath(slug), [p])
}

const collectionRow = (id: string): MenuRow => productRow(id, collectionById(id)?.name)

const groupMin = (rows: readonly MenuRow[]): number => Math.min(...rows.map((r) => r.min))

const DEM_PATH = '/danh-muc-san-pham/dem-ecopillo/'
const GA_PHU_PATH = '/danh-muc-san-pham/san-pham/bo-ga-phu/'
const RUOT_PATH = '/danh-muc-san-pham/san-pham/ruot-chan-goi/'

/** Thứ tự bộ ga phủ theo menu web cũ */
const GA_PHU_ORDER: readonly string[] = ['eco-doris', 'eco-sweet', 'eco-rosa', 'eco-liora', 'eco-tera', 'eco-vera']

const group = (g: Omit<MenuGroup, 'min'>): MenuGroup => ({ ...g, min: groupMin(g.rows) })

export const PRODUCT_MENU: readonly MenuGroup[] = [
  group({
    id: 'dem',
    title: LISTINGS[DEM_PATH].title,
    to: DEM_PATH,
    image: productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', 'Đệm Ecopillo'),
    note: `${listingProducts(DEM_PATH).length} mẫu`,
    rows: [
      listingRow('/danh-muc-san-pham/san-pham/dem-lo-xo/'),
      listingRow('/danh-muc-san-pham/san-pham/dem-cao-su/'),
      listingRow('/danh-muc-san-pham/san-pham/dem-bong-ep/'),
      listingRow('/danh-muc-san-pham/san-pham/dem-foam/'),
      productRow('topper-micro-fiber', 'Topper'),
    ],
  }),
  group({
    id: 'ga-phu',
    title: LISTINGS[GA_PHU_PATH].title,
    to: GA_PHU_PATH,
    image: patternImage('ED25', 'Bộ ga phủ'),
    note: `${GA_PHU_ORDER.length} bộ sưu tập`,
    rows: GA_PHU_ORDER.map(collectionRow),
  }),
  group({
    id: 'ga-chun',
    title: 'Bộ ga chun',
    to: collectionPathById('eco-flora'),
    image: patternImage('EF06', 'Bộ ga chun'),
    note: '1 bộ sưu tập',
    rows: [collectionRow('eco-flora')],
  }),
  group({
    id: 'chan-he',
    title: 'Chăn hè',
    to: collectionPathById('chan-he-lyocell'),
    image: patternImage('ER09', 'Chăn hè'),
    note: `${colorwayCount(productOf('chan-he-lyocell'))} phối màu`,
    rows: [collectionRow('chan-he-lyocell')],
  }),
  group({
    id: 'ruot',
    title: LISTINGS[RUOT_PATH].title,
    to: RUOT_PATH,
    image: productImage('chan-long-vu-tu-nhien', 'Ruột chăn gối'),
    note: `${listingProducts(RUOT_PATH).length} mẫu`,
    rows: [
      listingRow('/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/', 'Ruột gối nằm'),
      productRow('chan-dong-micro-fiber'),
      productRow('chan-to-tam'),
      productRow('chan-long-vu-tu-nhien'),
    ],
  }),
]

/** Dòng cuối ô xổ */
export const PRODUCT_MENU_ALL = { label: 'Xem tất cả sản phẩm', to: PATHS.products } as const
export const PRODUCT_MENU_GIFTS = { lead: 'Quà tặng doanh nghiệp, sự kiện:', label: 'Quà tặng và sự kiện', to: PATHS.gifts } as const
