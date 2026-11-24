import { productImage, type ImageSource } from './catalog'
import { hiddenPageTarget, LISTINGS, singleProductPath } from './links'
import { LISTING_GUIDES } from './listingGuides'
import { isProductShown, PRODUCTS, productBySlug } from './products'
import { anh, chu, definePageText, doan, dsDong, type TextField } from './pageText/define'

/**
 * Khối "Chọn đệm theo cách Quý khách thích nằm" trên trang chủ (C3, owner chốt 02/11/2026).
 * Chữ cách nằm lấy từ LISTING_GUIDES của danh mục đệm; giá và đường link lấy từ PRODUCTS / LISTINGS, không chép tay.
 * Mẫu lớn Eco Luxe: [XÁC NHẬN mẫu đặt lớn] — owner còn xác nhận.
 */

const DEM_PATH = '/danh-muc-san-pham/dem-ecopillo/'
const DEM_GUIDE = LISTING_GUIDES[DEM_PATH]

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

const productOf = (slug: string) => {
  const p = productBySlug(slug)
  if (!p) throw new Error(`mattressPicker: thiếu sản phẩm ${slug}`)
  return p
}

/** Một dòng cách nằm: chữ từ LISTING_GUIDES, giá/ảnh/link từ sản phẩm đại diện */
const preference = (slug: string, pointIndex: number): MattressPreference => {
  const point = DEM_GUIDE.points[pointIndex]
  const product = productOf(slug)
  const thumb = product.gallery?.[0] ?? product.image
  if (!thumb) throw new Error(`mattressPicker: thiếu ảnh ${slug}`)
  return {
    title: point.title,
    text: point.text,
    productName: product.name,
    min: product.min,
    to: singleProductPath(slug),
    thumb,
  }
}

const BONG_EP_PATH = '/danh-muc-san-pham/san-pham/dem-bong-ep/'

/**
 * Dòng "Thích nằm cứng, gấp gọn" nói cả hai đệm bông ép (Gấm Thuần Khiết gập 3, Nano chần foam gập 2).
 * Chị Phương (Zalo 11/11/2026): "thay ảnh này bằng ảnh nano gập 2". Ảnh Nano gập đôi, bấm sang danh mục Đệm bông ép
 * (thấy cả hai), giá "từ" lấy đệm rẻ hơn.
 */
const bongEpPreference = (): MattressPreference => {
  if (!LISTINGS[BONG_EP_PATH]) throw new Error(`mattressPicker: thiếu danh mục ${BONG_EP_PATH}`)
  const nano = productOf('dem-bong-nano-chan-foam')
  const gam = productOf('dem-bong-gam-thuan-khiet')
  if (!nano.image) throw new Error('mattressPicker: thiếu ảnh dem-bong-nano-chan-foam')
  const point = DEM_GUIDE.points[3]
  return {
    title: point.title,
    text: point.text,
    productName: nano.name,
    min: Math.min(nano.min, gam.min),
    to: BONG_EP_PATH,
    thumb: nano.image,
  }
}

const ecoLuxe = productOf('dem-lo-xo-tui-cao-cap-eco-luxe')
const ECO_LUXE_IMAGE = productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', ecoLuxe.name)

/** Ô đường link (/duong-dan/, https://…): web kiểm đúng dạng link, sai thì dùng link gốc */
const link = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'link', goc, goiY })

/** Bốn dòng cách nằm, khớp thứ tự points[0..3] của danh mục đệm (bỏ dòng topper — topper nằm ở chip); bỏ dòng trỏ tới trang đã gỡ */
export const MATTRESS_PREFERENCES: readonly MattressPreference[] = [
  preference('dem-eco-foam-da-tang', 0),
  preference('dem-lo-xo-tui-doc-lap', 1),
  preference('dem-cao-su-thien-nhien-eco-latex', 2),
  bongEpPreference(),
].filter((row) => !hiddenPageTarget(row.to))

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
 * Chữ khối đệm Ecopillo tự sửa (Nội dung web → Chữ từng trang). Tiêu đề: khách 09/11/2026 ("bộ sưu tập đệm - bộ sưu tập chăn ga
 * nó bằng chữ nhau"); đoạn dẫn: chị Phương 09/11/2026 ("hệ thống phân phối và showroom Ecopillo trên toàn quốc").
 */
export const { set: MATTRESS_TEXT_SET, text: MATTRESS_TEXT } = definePageText(
  'dem-trang-chu',
  'Trang chủ: khối Bộ sưu tập đệm',
  'Tiêu đề, đoạn dẫn, câu và ảnh mẫu nổi bật, chữ các nút nhóm đệm, nút Xem tất cả đệm của khối đệm trang chủ. Chữ 4 dòng cách nằm sửa ở mục Phần "Chọn thế nào" của danh mục (phần của Đệm Ecopillo).',
  {
    tieuDe: chu('Tiêu đề', 'Bộ sưu tập đệm'),
    danDat: doan(
      'Đoạn dẫn',
      'Lò xo, cao su thiên nhiên, foam, bông ép và topper, bảo hành tới 15 năm. Nằm thử tại hệ thống phân phối và showroom Ecopillo trên toàn quốc.',
    ),
    noiBatNhan: chu('Nhãn trên ảnh mẫu nổi bật', 'Nổi bật'),
    noiBatChu: doan('Câu giới thiệu mẫu nổi bật (Eco Luxe)', 'Lõi lò xo túi 16 cm, thêm lớp topper foam 4 cm ôm vai, hông, eo. Bảo hành 10 năm.'),
    anhNoiBat: anh('Ảnh mẫu nổi bật', ECO_LUXE_IMAGE, 'Ảnh ngang (16:10); tên, giá, link theo sản phẩm Eco Luxe'),
    nutXemTatCa: chu('Chữ nút Xem tất cả đệm', 'Xem tất cả đệm'),
    linkXemTatCa: link('Link nút Xem tất cả đệm', DEM_PATH),
    cauHoi: chu('Câu hỏi trên 4 dòng cách nằm', 'Quý khách thích nằm thế nào?'),
    nutNhom: dsDong('Chữ 5 nút nhóm đệm', BASE_CHIPS.map((chip) => chip.label), 'Đúng 5 dòng theo thứ tự: lò xo, cao su, foam, bông ép, topper'),
  },
)

/**
 * Đệm nổi bật: Eco Luxe; Ecopillo gỡ Eco Luxe trong Woo (đợt E2) thì lấy đệm đầu tiên còn hiện.
 * Ảnh: ảnh Ecopillo chọn ở Nội dung web; chưa đổi ảnh thì ảnh của chính đệm đang hiện.
 */
const featuredOf = (): MattressFeatured => {
  const isImageChanged = MATTRESS_TEXT.anhNoiBat.src !== ECO_LUXE_IMAGE.src
  if (isProductShown(ecoLuxe.slug)) {
    return { name: ecoLuxe.name, min: ecoLuxe.min, to: singleProductPath(ecoLuxe.slug), image: MATTRESS_TEXT.anhNoiBat }
  }
  const other = PRODUCTS.find((p) => p.category === 'dem' && p.image && !p.collection) ?? ecoLuxe
  const image = isImageChanged ? MATTRESS_TEXT.anhNoiBat : (other.image ?? productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', other.name))
  return { name: other.name, min: other.min, to: singleProductPath(other.slug), image }
}

export const MATTRESS_FEATURED: MattressFeatured = featuredOf()

export const MATTRESS_ALL_PATH: string = MATTRESS_TEXT.linkXemTatCa

export const MATTRESS_PICKER_TITLE: string = MATTRESS_TEXT.tieuDe
export const MATTRESS_PICKER_LEAD: string = MATTRESS_TEXT.danDat
export const MATTRESS_FEATURED_TEXT: string = MATTRESS_TEXT.noiBatChu
export const MATTRESS_CHIPS: readonly MattressChip[] = BASE_CHIPS.map((chip, i) => ({ ...chip, label: MATTRESS_TEXT.nutNhom[i] ?? chip.label })).filter(
  // Nút trỏ tới danh mục / sản phẩm Ecopillo đã gỡ (đợt E, E2) thì bỏ
  (chip) => !hiddenPageTarget(chip.to),
)
