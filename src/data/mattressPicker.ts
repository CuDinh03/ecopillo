import { productImage, type ImageSource } from './catalog'
import { LISTINGS, singleProductPath } from './links'
import { LISTING_GUIDES } from './listingGuides'
import { productBySlug } from './products'

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
  text: string
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

const ecoLuxe = productOf('dem-lo-xo-tui-cao-cap-eco-luxe')

export const MATTRESS_FEATURED: MattressFeatured = {
  name: ecoLuxe.name,
  text: 'Lõi lò xo túi 16 cm, thêm lớp topper foam 4 cm ôm vai, hông, eo. Bảo hành 10 năm.',
  min: ecoLuxe.min,
  to: singleProductPath('dem-lo-xo-tui-cao-cap-eco-luxe'),
  image: productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', ecoLuxe.name),
}

/** Bốn dòng cách nằm, khớp thứ tự points[0..3] của danh mục đệm (bỏ dòng topper — topper nằm ở chip) */
export const MATTRESS_PREFERENCES: readonly MattressPreference[] = [
  preference('dem-eco-foam-da-tang', 0),
  preference('dem-lo-xo-tui-doc-lap', 1),
  preference('dem-cao-su-thien-nhien-eco-latex', 2),
  preference('dem-bong-gam-thuan-khiet', 3),
]

const chipOf = (path: string, label: string): MattressChip => {
  if (!LISTINGS[path]) throw new Error(`mattressPicker: thiếu danh mục ${path}`)
  return { label, to: path }
}

export const MATTRESS_CHIPS: readonly MattressChip[] = [
  chipOf('/danh-muc-san-pham/san-pham/dem-lo-xo/', 'Đệm lò xo'),
  chipOf('/danh-muc-san-pham/san-pham/dem-cao-su/', 'Đệm cao su'),
  chipOf('/danh-muc-san-pham/san-pham/dem-foam/', 'Đệm foam'),
  chipOf('/danh-muc-san-pham/san-pham/dem-bong-ep/', 'Đệm bông ép'),
  { label: 'Topper', to: singleProductPath('topper-micro-fiber') },
]

export const MATTRESS_ALL_PATH = DEM_PATH
export const MATTRESS_PICKER_TITLE = DEM_GUIDE.title
export const MATTRESS_PICKER_LEAD =
  'Lò xo, cao su thiên nhiên, foam, bông ép và topper, bảo hành tới 15 năm. Nằm thử tại hệ thống phân phối ở Hà Nội, Đà Nẵng và TP. HCM.'
