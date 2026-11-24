import type { ImageSource } from './catalog'
import { liveObject, type EditableField, type EditableSet } from './liveContent'
import { PRODUCT_LABELS } from './pageText/productLabels'
import { orderByNames } from './productOrder'
import type { BuiltinCategoryId, ProductGroup } from './productGroups'
import { CATEGORIES, hasPrice, PRODUCTS, type CategoryId, type Product } from './products'
import { COLORWAYS } from './stories'

/**
 * Trang Sản phẩm, mục "Tất cả" (yêu cầu 02/11/2026, owner chốt phương án 1 + 2):
 * bốn ô ảnh nhóm ở đầu, rồi bốn kệ theo nhóm hiện đủ thẻ gộp (mỗi bộ một thẻ), để đệm, chăn, gối hiện ngay
 * thay vì nằm sau 67 phối màu. Mẫu: docs/de-xuat-dem-trang-chu-va-san-pham-02-11.html (phần "Phương án 1 + 2").
 * Lọc, sắp xếp, ?danh-muc=… vẫn ra lưới mỗi phối màu một thẻ như cũ (mục 31).
 */

/**
 * Bốn nhóm có sẵn, theo thứ tự gốc của kệ (ô thứ tự sản phẩm bên dưới). Thứ tự kệ, tên, ảnh ô nhóm, nhóm mới: bộ "Nhóm sản phẩm"
 * (productGroups.ts, 24/11/2026); trước đó thứ tự kệ ở các ô "Kệ thứ 1…4" của bộ này.
 */
const BASE_SHELF_ORDER: readonly BuiltinCategoryId[] = ['bo-chan-ga', 'dem', 'chan', 'goi']

/** Kệ đệm (thứ tự gốc): ba mẫu bán chạy lên đầu, còn lại theo thứ tự trong PRODUCTS */
const MATTRESS_FIRST: readonly string[] = ['dem-lo-xo-tui-cao-cap-eco-luxe', 'dem-lo-xo-tui-doc-lap', 'dem-eco-foam-da-tang']

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

/** Thứ tự gốc trên kệ: đệm bán chạy lên đầu, kệ khác theo PRODUCTS (sort ổn định: cùng hạng giữ thứ tự PRODUCTS) */
const baseShelfProducts = (category: BuiltinCategoryId): readonly Product[] => {
  const inGroup = PRODUCTS.filter((p) => p.category === category)
  return category === 'dem' ? [...inGroup].sort((a, b) => rankOf(a) - rankOf(b)) : inGroup
}

/* ——— Thứ tự kệ và thứ tự sản phẩm trên kệ: Ecopillo sửa ở Nội dung web → Sản phẩm → "Kệ trang Sản phẩm" (owner 24/11/2026) ——— */

const ORDER_KEYS: Readonly<Record<BuiltinCategoryId, string>> = { 'bo-chan-ga': 'thuTuBoChanGa', dem: 'thuTuDem', chan: 'thuTuChan', goi: 'thuTuGoi' }
/** Tên nhóm trong màn hình sửa: tên gốc (dựng lúc build, Ecopillo đổi tên ở bộ Nhóm sản phẩm) */
const BASE_GROUP_NAMES: Readonly<Record<BuiltinCategoryId, string>> = { 'bo-chan-ga': 'Bộ chăn ga', dem: 'Đệm & topper', chan: 'Chăn', goi: 'Gối' }

const SHELF_FIELDS: readonly EditableField[] = [
  ...BASE_SHELF_ORDER.map(
    (category): EditableField => ({
      khoa: ORDER_KEYS[category],
      nhan: `Thứ tự trên kệ ${BASE_GROUP_NAMES[category]} (mỗi dòng một sản phẩm)`,
      kieu: 'ds-dong',
      batBuoc: true,
      goiY: 'Ghi tên sản phẩm như trên web, mỗi dòng một tên, theo thứ tự muốn hiện. Sản phẩm không ghi ở đây (sản phẩm mới đăng) xếp sau, theo thứ tự có sẵn.',
    }),
  ),
]

const SHELF_BASE: Readonly<Record<string, readonly string[]>> = Object.fromEntries(
  BASE_SHELF_ORDER.map((c) => [ORDER_KEYS[c], baseShelfProducts(c).map((p) => p.name)]),
)

export const SHELF_SET: EditableSet = {
  khoa: 'ke-san-pham',
  nhom: 'Sản phẩm',
  ten: 'Kệ trang Sản phẩm: thứ tự',
  moTa:
    'Trang Sản phẩm, mục "Tất cả": thứ tự sản phẩm trên kệ của 4 nhóm có sẵn. Thứ tự các nhóm, ẩn nhóm, nhóm mới (thứ tự sản phẩm trên kệ nhóm mới theo ô "Sản phẩm" của nhóm): bộ "Nhóm sản phẩm". ' +
    'Thứ tự sản phẩm trong các trang danh mục nhỏ (Đệm lò xo, Ruột gối…): bộ "Sản phẩm trong trang danh mục: thứ tự".',
  kieu: 'mot',
  goc: SHELF_BASE,
  truong: SHELF_FIELDS,
}

const SHELF_LIVE = liveObject(SHELF_SET.khoa, SHELF_BASE, SHELF_FIELDS)
const SHELF_EDITED = SHELF_LIVE !== SHELF_BASE

const isBaseShelf = (id: string): id is BuiltinCategoryId => (BASE_SHELF_ORDER as readonly string[]).includes(id)

/**
 * Sản phẩm trên một kệ. Nhóm có sẵn: thứ tự Ecopillo ghi ở bộ này (theo tên), chưa sửa thì thứ tự gốc; sản phẩm Ecopillo chuyển
 * từ nhóm khác sang (bộ Nhóm sản phẩm) xếp sau. Nhóm mới: sản phẩm tích ở ô "Sản phẩm" của nhóm theo thứ tự tích, rồi phần còn lại.
 */
const shelfProducts = (group: ProductGroup): readonly Product[] => {
  const inGroup = PRODUCTS.filter((p) => p.category === group.id)
  if (!isBaseShelf(group.id)) {
    const picked = group.products.flatMap((slug) => inGroup.find((p) => p.slug === slug) ?? [])
    return [...picked, ...inGroup.filter((p) => !picked.includes(p))]
  }
  const base = baseShelfProducts(group.id)
  const names = SHELF_LIVE[ORDER_KEYS[group.id]]
  const ordered = SHELF_EDITED && Array.isArray(names) ? orderByNames(base, names) : base
  return [...ordered, ...inGroup.filter((p) => !ordered.includes(p))]
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
  /** Ảnh ô nhóm (Ecopillo chọn; không có thì ảnh sản phẩm đầu tiên trên kệ) */
  tileImage?: ImageSource
  /** Dòng nhỏ dưới tên ô nhóm Ecopillo ghi; không có thì ghi giá thấp nhất */
  note?: string
  /** Giá thấp nhất cả nhóm; 0 = cả nhóm chưa có giá */
  min: number
}

/** Kệ theo thứ tự nhóm Ecopillo xếp (bộ Nhóm sản phẩm), chỉ nhóm đang hiện */
export const SHELVES: readonly Shelf[] = CATEGORIES.map((group) => {
  const products = shelfProducts(group)
  const priced = products.filter(hasPrice)
  return {
    category: group.id,
    id: `ke-${group.id}`,
    label: group.label,
    shortLabel: group.shortLabel,
    count: cardCount(group.id),
    products,
    tileImage: group.image ?? products.find((p) => p.image)?.image,
    ...(group.note ? { note: group.note } : {}),
    min: priced.length ? Math.min(...priced.map((p) => p.min)) : 0,
  }
}).filter((shelf) => shelf.products.length > 0)

/** Câu trên thẻ "Xem theo phối màu" (máy tính). Không ghi số (khách 05/11/2026: "đừng cho số lượng vào") */
export const COLORWAY_HINT: string = PRODUCT_LABELS.phoiMauGoiY
