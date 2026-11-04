import { patternImage, productImage, type ImageSource } from './catalog'
import { CATEGORIES, PRODUCTS, type CategoryId, type Product } from './products'
import { COLORWAYS } from './stories'

/**
 * Trang Sản phẩm, mục "Tất cả" (yêu cầu 02/11/2026, owner chốt phương án 1 + 2):
 * bốn ô ảnh nhóm ở đầu, rồi bốn kệ theo nhóm hiện đủ thẻ gộp (mỗi bộ một thẻ), để đệm, chăn, gối hiện ngay
 * thay vì nằm sau 67 phối màu. Mẫu: docs/de-xuat-dem-trang-chu-va-san-pham-02-11.html (phần "Phương án 1 + 2").
 * Lọc, sắp xếp, ?danh-muc=… vẫn ra lưới mỗi phối màu một thẻ như cũ (mục 31).
 */

/** Thứ tự kệ: đệm ngay sau bộ chăn ga (khách: "phần đệm tìm mãi mới thấy") */
export const SHELF_ORDER: readonly CategoryId[] = ['bo-chan-ga', 'dem', 'chan', 'goi']

/** Kệ đệm: ba mẫu bán chạy lên đầu, còn lại theo thứ tự trong PRODUCTS */
const MATTRESS_FIRST: readonly string[] = ['dem-lo-xo-tui-cao-cap-eco-luxe', 'dem-lo-xo-tui-doc-lap', 'dem-eco-foam-da-tang']

/** Chữ nút "Chỉ xem …" ở đầu kệ (bộ chăn ga dùng nút "Xem N phối màu") */
const SHORT_LABELS: Readonly<Record<CategoryId, string>> = { 'bo-chan-ga': 'bộ chăn ga', dem: 'đệm', chan: 'chăn', goi: 'gối' }

/** Ảnh ô nhóm, chọn theo mẫu đã duyệt */
const TILE_IMAGES: Readonly<Record<CategoryId, (alt: string) => ImageSource>> = {
  'bo-chan-ga': (alt) => patternImage('ED25', alt),
  dem: (alt) => productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', alt),
  chan: (alt) => productImage('chan-long-vu-tu-nhien', alt),
  goi: (alt) => productImage('ruot-goi-long-vu-tu-nhien', alt),
}

/** Số phối màu của một bộ (bộ chăn ga, chăn hè); sản phẩm lẻ là 0 */
export const colorwayCount = (p: Product): number =>
  p.collection ? COLORWAYS.filter((c) => c.collection.id === p.collection?.id).length : 0

/** Số mẫu (thẻ khi xem từng phối màu) của một loại, hoặc tất cả khi null: bộ đếm theo phối màu, sản phẩm lẻ đếm 1 */
export const cardCount = (category: CategoryId | null): number =>
  PRODUCTS.filter((p) => !category || p.category === category).reduce((n, p) => n + (p.collection ? colorwayCount(p) : 1), 0)

const rankOf = (p: Product): number => {
  const i = MATTRESS_FIRST.indexOf(p.slug)
  return i === -1 ? MATTRESS_FIRST.length : i
}

export interface Shelf {
  category: CategoryId
  /** id của kệ, ô nhóm cuộn tới đây */
  id: string
  label: string
  shortLabel: string
  /** Số mẫu cả nhóm (đếm theo phối màu) */
  count: number
  /** Thẻ gộp: mỗi bộ một thẻ, mỗi sản phẩm lẻ một thẻ */
  products: readonly Product[]
  tileImage: ImageSource
  /** Giá thấp nhất cả nhóm */
  min: number
}

export const SHELVES: readonly Shelf[] = SHELF_ORDER.map((category) => {
  const label = CATEGORIES.find((c) => c.id === category)?.label ?? ''
  const inGroup = PRODUCTS.filter((p) => p.category === category)
  // sort ổn định: sản phẩm cùng hạng giữ thứ tự PRODUCTS
  const products = category === 'dem' ? [...inGroup].sort((a, b) => rankOf(a) - rankOf(b)) : inGroup
  return {
    category,
    id: `ke-${category}`,
    label,
    shortLabel: SHORT_LABELS[category],
    count: cardCount(category),
    products,
    tileImage: TILE_IMAGES[category](label),
    min: Math.min(...inGroup.map((p) => p.min)),
  }
})

/** Số thẻ trên cả bốn kệ */
export const SHELF_CARD_COUNT = SHELVES.reduce((n, s) => n + s.products.length, 0)

/** Bộ chăn ga: ít và nhiều phối màu nhất một bộ, cho thẻ "Xem theo phối màu" */
const setColorways = SHELVES.find((s) => s.category === 'bo-chan-ga')?.products.map(colorwayCount) ?? [0]
const SET_COLORWAYS = { fewest: Math.min(...setColorways), most: Math.max(...setColorways) }

/** Số phối màu của cả bộ chăn ga (lưới xem theo phối màu) */
export const SET_COLORWAY_TOTAL = cardCount('bo-chan-ga')

/** Câu trên thẻ "Xem theo phối màu" (máy tính) */
export const COLORWAY_HINT = `Mỗi bộ có từ ${SET_COLORWAYS.fewest} tới ${SET_COLORWAYS.most} phối màu; bấm vào bộ để chọn phối màu, hoặc xem cả ${SET_COLORWAY_TOTAL} phối màu trên một lưới.`
