import { productImage, type ImageSource } from './catalog'
import { hiddenPageTarget, LISTINGS, singleProductPath } from './links'
import { BASE_LISTING_GUIDES, LISTING_GUIDES } from './listingGuides'
import { listingOf } from './listingProducts'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import { ALL_PRODUCTS, hasPrice, isProductShown, PRODUCTS, productBySlug, productKind, type Product } from './products'
import { anh, chon, chu, definePageText, doan, dsDong, legacyPageText, link } from './pageText/define'

/**
 * Khối "Chọn đệm theo cách Quý khách thích nằm" trên trang chủ (C3, owner chốt 02/11/2026).
 * Chữ cách nằm lấy từ LISTING_GUIDES của danh mục đệm; giá và đường link lấy từ PRODUCTS / LISTINGS, không chép tay.
 * Mẫu lớn, các dòng cách nằm, các nút nhóm đệm: Ecopillo tự chọn, thêm, xoá, đổi thứ tự ở Nội dung web (đợt G, 24/11/2026).
 */

const DEM_PATH = '/danh-muc-san-pham/dem-ecopillo/'
// Ecopillo bỏ phần "Chọn thế nào" của Đệm Ecopillo thì khối này vẫn dùng chữ gốc
const DEM_GUIDE = LISTING_GUIDES[DEM_PATH] ?? BASE_LISTING_GUIDES[DEM_PATH]

export interface MattressPreference {
  /** Tiêu đề cách nằm (từ LISTING_GUIDES) */
  title: string
  /** Mô tả ngắn (từ LISTING_GUIDES) */
  text: string
  /** Tên sản phẩm đại diện */
  productName: string
  /** Giá thấp nhất */
  min: number
  /** Đường tới trang sản phẩm đại diện */
  to: string
  thumb: ImageSource
}

/** Chip nhóm đệm: chỉ tên, không ghi số mẫu (khách 05/11/2026: "để tag thôi, bỏ số bên cạnh", "cả đệm cũng vậy") */
export interface MattressChip {
  label: string
  to: string
}

export interface MattressFeatured {
  name: string
  min: number
  to: string
  image: ImageSource
}

const productOf = (slug: string): Product => {
  const p = productBySlug(slug)
  if (!p) throw new Error(`mattressPicker: thiếu sản phẩm ${slug}`)
  return p
}

/** Lựa chọn đệm đại diện, mẫu nổi bật: mọi sản phẩm nhóm Đệm (cả topper, divan) */
const DEM_CHOICES: readonly Product[] = ALL_PRODUCTS.filter((p) => productKind(p) === 'dem' && !p.collection)

/* ——— Dòng cách nằm ——— */

/** Một dòng như lưu trong WordPress. Chữ trống thì lấy dòng cùng thứ tự trong phần "Chọn thế nào" của Đệm Ecopillo */
interface PreferenceRow {
  /** Đệm đại diện: ảnh nhỏ, giá */
  sanPham: string
  /** Bấm vào thì mở; không có thì trang của đệm đại diện */
  link?: string
  tieuDe?: string
  moTa?: string
  anh?: ImageSource
}

const BONG_EP_PATH = '/danh-muc-san-pham/san-pham/dem-bong-ep/'

/**
 * Bốn dòng, khớp thứ tự points[0..3] của danh mục đệm (bỏ dòng topper: topper nằm ở chip).
 * Dòng "Thích nằm cứng, gấp gọn" nói cả hai đệm bông ép: chị Phương (Zalo 11/11/2026) "thay ảnh này bằng ảnh nano gập 2",
 * bấm sang danh mục Đệm bông ép (thấy cả hai), giá "từ" là giá thấp nhất của danh mục.
 */
const BASE_PREFERENCE_ROWS: readonly PreferenceRow[] = [
  { sanPham: 'dem-eco-foam-da-tang' },
  { sanPham: 'dem-lo-xo-tui-doc-lap' },
  { sanPham: 'dem-cao-su-thien-nhien-eco-latex' },
  { sanPham: 'dem-bong-nano-chan-foam', link: BONG_EP_PATH },
]

const PREFERENCE_FIELDS: readonly EditableField[] = [
  {
    khoa: 'sanPham',
    nhan: 'Đệm đại diện (ảnh nhỏ, giá)',
    kieu: 'chon',
    batBuoc: true,
    luaChon: DEM_CHOICES.map((p) => p.slug),
    nhanLuaChon: DEM_CHOICES.map((p) => p.name),
    // Đệm Ecopillo đăng mới trong Woo sau lần dựng cũng chọn được (đợt G)
    luaChonThem: [{ nguon: 'san-pham' }],
  },
  {
    khoa: 'link',
    nhan: 'Bấm vào thì mở',
    kieu: 'link',
    goiY: 'Để trống: trang của đệm đại diện. Trỏ tới một trang danh mục (ví dụ /danh-muc-san-pham/san-pham/dem-bong-ep/) thì giá "từ" là giá thấp nhất của danh mục',
  },
  { khoa: 'tieuDe', nhan: 'Cách nằm (chữ đậm)', kieu: 'chu', goiY: 'Để trống: lấy dòng cùng thứ tự ở phần "Chọn thế nào" của Đệm Ecopillo' },
  { khoa: 'moTa', nhan: 'Câu mô tả', kieu: 'doan', goiY: 'Để trống: lấy dòng cùng thứ tự ở phần "Chọn thế nào" của Đệm Ecopillo' },
  { khoa: 'anh', nhan: 'Ảnh nhỏ', kieu: 'anh', goiY: 'Để trống: ảnh của đệm đại diện' },
]

export const MATTRESS_ROWS_SET: EditableSet = {
  khoa: 'dem-trang-chu-dong',
  nhom: 'Trang chủ',
  ten: 'Trang chủ: các dòng cách nằm của khối đệm',
  moTa:
    'Các dòng "Quý khách thích nằm thế nào?" của khối Bộ sưu tập đệm trang chủ: đệm đại diện, trang mở khi bấm, chữ, ảnh. Thêm, xoá, đổi thứ tự ở đây. ' +
    'Dòng trỏ tới sản phẩm hay danh mục Ecopillo đã gỡ thì tự bỏ.',
  kieu: 'nhieu',
  goc: BASE_PREFERENCE_ROWS,
  truong: PREFERENCE_FIELDS,
}

const PREFERENCE_ROWS = liveList<PreferenceRow>(MATTRESS_ROWS_SET.khoa, BASE_PREFERENCE_ROWS, PREFERENCE_FIELDS, () => ({ sanPham: '' }))

/** Sản phẩm đang hiện của một trang danh mục (đã ghép phần Ecopillo chọn, cả sản phẩm mới đăng trong Woo) */
const listingProductsOf = (path: string): readonly Product[] => {
  const listing = listingOf(path)
  if (!listing) return []
  const own = listing.products
    ? listing.products.flatMap((slug) => (isProductShown(slug) ? (productBySlug(slug) ?? []) : []))
    : PRODUCTS.filter((p) => p.category === listing.category && !p.collection)
  return [...own, ...PRODUCTS.filter((p) => p.listings?.includes(path) && !own.includes(p))]
}

/** Giá "từ": dòng trỏ tới danh mục thì giá thấp nhất của danh mục, không thì giá của đệm đại diện */
const minOf = (product: Product, to: string): number => {
  const priced = LISTINGS[to] ? listingProductsOf(to).filter(hasPrice) : []
  return priced.length ? Math.min(...priced.map((p) => p.min)) : product.min
}

/**
 * Ảnh nhỏ: dòng trỏ tới trang sản phẩm dùng ảnh phụ đầu tiên (ảnh cắt lớp đệm), dòng trỏ tới danh mục dùng ảnh chính
 * (ảnh Nano gập đôi của dòng bông ép)
 */
const thumbOf = (product: Product, to: string): ImageSource | undefined =>
  LISTINGS[to] ? product.image : (product.gallery?.[0] ?? product.image)

const preferenceOf = (row: PreferenceRow, index: number): MattressPreference | undefined => {
  const product = productBySlug(row.sanPham)
  if (!product || !isProductShown(product.slug)) return undefined
  const to = row.link ?? singleProductPath(product.slug)
  const thumb = row.anh ?? thumbOf(product, to)
  const point = DEM_GUIDE.points[index]
  const title = row.tieuDe ?? point?.title
  const text = row.moTa ?? point?.text ?? ''
  if (!thumb || !title) return undefined
  return { title, text, productName: product.name, min: minOf(product, to), to, thumb }
}

/** Các dòng cách nằm; bỏ dòng trỏ tới trang đã gỡ, dòng thiếu chữ (dòng thêm mới mà phần "Chọn thế nào" không có dòng tương ứng) */
export const MATTRESS_PREFERENCES: readonly MattressPreference[] = PREFERENCE_ROWS.flatMap((row, i) => preferenceOf(row, i) ?? []).filter(
  (row) => !hiddenPageTarget(row.to),
)

/* ——— Nút nhóm đệm ——— */

const chipOf = (path: string, label: string): MattressChip => {
  if (!LISTINGS[path]) throw new Error(`mattressPicker: thiếu danh mục ${path}`)
  return { label, to: path }
}

const BASE_CHIPS: readonly MattressChip[] = [
  chipOf('/danh-muc-san-pham/san-pham/dem-lo-xo/', 'Đệm lò xo'),
  chipOf('/danh-muc-san-pham/san-pham/dem-cao-su/', 'Đệm cao su'),
  chipOf('/danh-muc-san-pham/san-pham/dem-foam/', 'Đệm foam'),
  chipOf('/danh-muc-san-pham/san-pham/dem-bong-ep/', 'Đệm bông ép'),
  { label: 'Topper', to: singleProductPath('topper-micro-fiber') },
]

/**
 * Trước 24/11/2026 chữ 5 nút nằm ở ô "Chữ 5 nút nhóm đệm" của bộ chữ khối đệm, link viết cứng. Đọc phần Ecopillo đã lưu ở đó
 * làm dữ liệu ban đầu của bộ nút mới, để web không đổi khi Ecopillo chưa lưu bộ mới.
 */
const LEGACY = legacyPageText('dem-trang-chu', {
  nutNhom: dsDong('Chữ 5 nút nhóm đệm', BASE_CHIPS.map((chip) => chip.label)),
})

const CHIP_FIELDS: readonly EditableField[] = [
  { khoa: 'label', nhan: 'Chữ trên nút', kieu: 'chu', batBuoc: true },
  { khoa: 'to', nhan: 'Bấm vào thì mở', kieu: 'link', batBuoc: true, goiY: 'Ví dụ /danh-muc-san-pham/san-pham/dem-lo-xo/' },
]

export const MATTRESS_CHIPS_SET: EditableSet = {
  khoa: 'dem-trang-chu-nut',
  nhom: 'Trang chủ',
  ten: 'Trang chủ: các nút nhóm đệm',
  moTa: 'Hàng nút dưới khối Bộ sưu tập đệm trang chủ (Đệm lò xo, Đệm cao su…): chữ, trang mở khi bấm. Thêm, xoá, đổi thứ tự ở đây. Nút trỏ tới trang đã gỡ thì tự ẩn.',
  kieu: 'nhieu',
  goc: BASE_CHIPS,
  truong: CHIP_FIELDS,
  tieuDeDong: 'label',
}

const CHIP_ROWS = liveList<MattressChip>(
  MATTRESS_CHIPS_SET.khoa,
  BASE_CHIPS.map((chip, i) => ({ ...chip, label: LEGACY.nutNhom[i] ?? chip.label })),
  CHIP_FIELDS,
  () => ({ label: '', to: '' }),
)

/* ——— Mẫu lớn và chữ của khối ——— */

const ecoLuxe = productOf('dem-lo-xo-tui-cao-cap-eco-luxe')
const ECO_LUXE_IMAGE = productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', ecoLuxe.name)

/**
 * Chữ khối đệm Ecopillo tự sửa (Nội dung web → Chữ từng trang). Tiêu đề: khách 09/11/2026 ("bộ sưu tập đệm - bộ sưu tập chăn ga
 * nó bằng chữ nhau"); đoạn dẫn: chị Phương 09/11/2026 ("hệ thống phân phối và showroom Ecopillo trên toàn quốc").
 */
export const { set: MATTRESS_TEXT_SET, text: MATTRESS_TEXT } = definePageText(
  'dem-trang-chu',
  'Trang chủ: khối Bộ sưu tập đệm',
  'Tiêu đề, đoạn dẫn, mẫu nổi bật (sản phẩm, câu, ảnh), nút Xem tất cả đệm của khối đệm trang chủ. Các dòng cách nằm, các nút nhóm đệm: mục "Trang chủ: các dòng cách nằm của khối đệm", "Trang chủ: các nút nhóm đệm".',
  {
    tieuDe: chu('Tiêu đề', 'Bộ sưu tập đệm'),
    danDat: doan(
      'Đoạn dẫn',
      'Lò xo, cao su thiên nhiên, foam, bông ép và topper, bảo hành tới 15 năm. Nằm thử tại hệ thống phân phối và showroom Ecopillo trên toàn quốc.',
    ),
    noiBatNhan: chu('Nhãn trên ảnh mẫu nổi bật', 'Nổi bật'),
    noiBatSanPham: {
      ...chon(
        'Mẫu nổi bật: sản phẩm (tên, giá, link)',
        DEM_CHOICES.map((p) => p.slug),
        DEM_CHOICES.map((p) => p.name),
        ecoLuxe.slug,
        'Sản phẩm này bị gỡ trong WooCommerce thì web lấy đệm đầu tiên còn hiện',
      ),
      luaChonThem: [{ nguon: 'san-pham' }],
    },
    noiBatChu: doan('Câu giới thiệu mẫu nổi bật', 'Lõi lò xo túi 16 cm, thêm lớp topper foam 4 cm ôm vai, hông, eo. Bảo hành 10 năm.'),
    anhNoiBat: anh('Ảnh mẫu nổi bật', ECO_LUXE_IMAGE, 'Ảnh ngang (16:10). Giữ ảnh gốc mà đổi sản phẩm nổi bật thì web dùng ảnh của sản phẩm đó'),
    nutXemTatCa: chu('Chữ nút Xem tất cả đệm', 'Xem tất cả đệm'),
    linkXemTatCa: link('Link nút Xem tất cả đệm', DEM_PATH),
    cauHoi: chu('Câu hỏi trên các dòng cách nằm', 'Quý khách thích nằm thế nào?'),
    nhomDoc: chu('Hàng nút nhóm đệm: tên cho trình đọc màn hình', 'Nhóm đệm'),
  },
)

/**
 * Đệm nổi bật: sản phẩm Ecopillo chọn (gốc Eco Luxe); sản phẩm đó gỡ trong Woo (đợt E2) thì lấy đệm đầu tiên còn hiện.
 * Ảnh: ảnh Ecopillo chọn ở Nội dung web; chưa đổi ảnh thì ảnh Eco Luxe gốc cho Eco Luxe, ảnh chính của đệm khác.
 */
const featuredOf = (): MattressFeatured => {
  const isImageChanged = MATTRESS_TEXT.anhNoiBat.src !== ECO_LUXE_IMAGE.src
  const chosen = productBySlug(MATTRESS_TEXT.noiBatSanPham)
  const product =
    chosen && isProductShown(chosen.slug) ? chosen : (PRODUCTS.find((p) => productKind(p) === 'dem' && p.image && !p.collection) ?? ecoLuxe)
  const image =
    isImageChanged || product.slug === ecoLuxe.slug
      ? MATTRESS_TEXT.anhNoiBat
      : (product.image ?? productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', product.name))
  return { name: product.name, min: product.min, to: singleProductPath(product.slug), image }
}

export const MATTRESS_FEATURED: MattressFeatured = featuredOf()

export const MATTRESS_ALL_PATH: string = MATTRESS_TEXT.linkXemTatCa

export const MATTRESS_PICKER_TITLE: string = MATTRESS_TEXT.tieuDe
export const MATTRESS_PICKER_LEAD: string = MATTRESS_TEXT.danDat
export const MATTRESS_FEATURED_TEXT: string = MATTRESS_TEXT.noiBatChu
/** Nút trỏ tới danh mục / sản phẩm Ecopillo đã gỡ (đợt E, E2) thì bỏ */
export const MATTRESS_CHIPS: readonly MattressChip[] = CHIP_ROWS.filter((chip) => !hiddenPageTarget(chip.to))
