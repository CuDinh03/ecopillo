import type { ImageSource } from './catalog'
import { liveObject, type EditableField, type EditableSet } from './liveContent'
import { PRODUCT_LABELS } from './pageText/productLabels'
import { orderByNames } from './productOrder'
import { CATEGORIES, hasPrice, PRODUCTS, type CategoryId, type Product } from './products'
import { COLORWAYS } from './stories'

/**
 * Trang Sản phẩm, mục "Tất cả" (yêu cầu 02/11/2026, owner chốt phương án 1 + 2):
 * bốn ô ảnh nhóm ở đầu, rồi bốn kệ theo nhóm hiện đủ thẻ gộp (mỗi bộ một thẻ), để đệm, chăn, gối hiện ngay
 * thay vì nằm sau 67 phối màu. Mẫu: docs/de-xuat-dem-trang-chu-va-san-pham-02-11.html (phần "Phương án 1 + 2").
 * Lọc, sắp xếp, ?danh-muc=… vẫn ra lưới mỗi phối màu một thẻ như cũ (mục 31).
 */

/** Thứ tự kệ gốc: đệm ngay sau bộ chăn ga (khách: "phần đệm tìm mãi mới thấy") */
const BASE_SHELF_ORDER: readonly CategoryId[] = ['bo-chan-ga', 'dem', 'chan', 'goi']

/** Kệ đệm (thứ tự gốc): ba mẫu bán chạy lên đầu, còn lại theo thứ tự trong PRODUCTS */
const MATTRESS_FIRST: readonly string[] = ['dem-lo-xo-tui-cao-cap-eco-luxe', 'dem-lo-xo-tui-doc-lap', 'dem-eco-foam-da-tang']

/**
 * Chữ nút "Chỉ xem …" ở đầu kệ, Ecopillo sửa ở Nội dung web (pageText/productLabels.ts).
 * Kệ bộ chăn ga dùng nút "Xem theo phối màu" nên tên ngắn của nó không hiện, giữ trong code.
 */
const SHORT_LABELS: Readonly<Record<CategoryId, string>> = {
  'bo-chan-ga': 'bộ chăn ga',
  dem: PRODUCT_LABELS.tenNganDem,
  chan: PRODUCT_LABELS.tenNganChan,
  goi: PRODUCT_LABELS.tenNganGoi,
}

/** Ảnh ô nhóm, chọn theo mẫu đã duyệt; Ecopillo đổi ảnh ở Nội dung web (pageText/productLabels.ts) */
const TILE_IMAGES: Readonly<Record<CategoryId, ImageSource>> = {
  'bo-chan-ga': PRODUCT_LABELS.anhNhomBoChanGa,
  dem: PRODUCT_LABELS.anhNhomDem,
  chan: PRODUCT_LABELS.anhNhomChan,
  goi: PRODUCT_LABELS.anhNhomGoi,
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

/** Thứ tự gốc trên kệ: đệm bán chạy lên đầu, kệ khác theo PRODUCTS (sort ổn định: cùng hạng giữ thứ tự PRODUCTS) */
const baseShelfProducts = (category: CategoryId): readonly Product[] => {
  const inGroup = PRODUCTS.filter((p) => p.category === category)
  return category === 'dem' ? [...inGroup].sort((a, b) => rankOf(a) - rankOf(b)) : inGroup
}

/* ——— Thứ tự kệ và thứ tự sản phẩm trên kệ: Ecopillo sửa ở Nội dung web → Sản phẩm → "Kệ trang Sản phẩm" (owner 24/11/2026) ——— */

const SHELF_KEYS = ['ke1', 'ke2', 'ke3', 'ke4'] as const
const ORDER_KEYS: Readonly<Record<CategoryId, string>> = { 'bo-chan-ga': 'thuTuBoChanGa', dem: 'thuTuDem', chan: 'thuTuChan', goi: 'thuTuGoi' }
const categoryLabel = (id: CategoryId): string => CATEGORIES.find((c) => c.id === id)?.label ?? id

const SHELF_FIELDS: readonly EditableField[] = [
  ...SHELF_KEYS.map(
    (khoa, i): EditableField => ({
      khoa,
      nhan: `Kệ thứ ${i + 1}`,
      kieu: 'chon',
      batBuoc: true,
      luaChon: CATEGORIES.map((c) => c.id),
      nhanLuaChon: CATEGORIES.map((c) => c.label),
      ...(i === 0 ? { goiY: 'Ô nhóm đầu trang và các kệ xếp theo thứ tự này. Chọn trùng một nhóm thì nhóm đó chỉ hiện một lần, nhóm bị thiếu xếp cuối.' } : {}),
    }),
  ),
  ...BASE_SHELF_ORDER.map(
    (category): EditableField => ({
      khoa: ORDER_KEYS[category],
      nhan: `Thứ tự trên kệ ${categoryLabel(category)} (mỗi dòng một sản phẩm)`,
      kieu: 'ds-dong',
      batBuoc: true,
      goiY: 'Ghi tên sản phẩm như trên web, mỗi dòng một tên, theo thứ tự muốn hiện. Sản phẩm không ghi ở đây (sản phẩm mới đăng) xếp sau, theo thứ tự có sẵn.',
    }),
  ),
]

const SHELF_BASE: Readonly<Record<string, string | readonly string[]>> = {
  ...Object.fromEntries(SHELF_KEYS.map((k, i) => [k, BASE_SHELF_ORDER[i]])),
  ...Object.fromEntries(BASE_SHELF_ORDER.map((c) => [ORDER_KEYS[c], baseShelfProducts(c).map((p) => p.name)])),
}

export const SHELF_SET: EditableSet = {
  khoa: 'ke-san-pham',
  nhom: 'Sản phẩm',
  ten: 'Kệ trang Sản phẩm: thứ tự',
  moTa:
    'Trang Sản phẩm, mục "Tất cả": thứ tự 4 ô nhóm và 4 kệ, thứ tự sản phẩm trên từng kệ. ' +
    'Thứ tự sản phẩm trong các trang danh mục nhỏ (Đệm lò xo, Ruột gối…): bộ "Sản phẩm trong trang danh mục: thứ tự".',
  kieu: 'mot',
  goc: SHELF_BASE,
  truong: SHELF_FIELDS,
}

const SHELF_LIVE = liveObject(SHELF_SET.khoa, SHELF_BASE, SHELF_FIELDS)
const SHELF_EDITED = SHELF_LIVE !== SHELF_BASE

/** Thứ tự kệ: nhóm Ecopillo chọn (bỏ trùng), nhóm thiếu xếp cuối theo thứ tự gốc */
export const SHELF_ORDER: readonly CategoryId[] = (() => {
  const picked = SHELF_KEYS.map((k) => SHELF_LIVE[k]).filter((v): v is CategoryId => BASE_SHELF_ORDER.includes(v as CategoryId))
  return [...new Set([...picked, ...BASE_SHELF_ORDER])]
})()

/** Sản phẩm trên một kệ: thứ tự Ecopillo ghi (theo tên), chưa sửa thì thứ tự gốc */
const shelfProducts = (category: CategoryId): readonly Product[] => {
  const base = baseShelfProducts(category)
  const names = SHELF_LIVE[ORDER_KEYS[category]]
  return SHELF_EDITED && Array.isArray(names) ? orderByNames(base, names) : base
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
  const products = shelfProducts(category)
  return {
    category,
    id: `ke-${category}`,
    label,
    shortLabel: SHORT_LABELS[category],
    count: cardCount(category),
    products,
    tileImage: TILE_IMAGES[category],
    min: Math.min(...inGroup.filter(hasPrice).map((p) => p.min)),
  }
})

/** Câu trên thẻ "Xem theo phối màu" (máy tính). Không ghi số (khách 05/11/2026: "đừng cho số lượng vào") */
export const COLORWAY_HINT: string = PRODUCT_LABELS.phoiMauGoiY
