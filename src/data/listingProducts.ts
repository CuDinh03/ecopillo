import { LISTINGS, type ListingPreset } from './links'
import { liveObject, type EditableField, type EditableSet } from './liveContent'
import { orderByNames } from './productOrder'
import { PRODUCTS } from './products'

/**
 * Sản phẩm trong các trang danh mục nhỏ (Đệm lò xo, Ruột gối, Ruột chăn…): Ecopillo tự tích chọn ở Nội dung web
 * (chị Phương 18/11/2026 nhờ chuyển sản phẩm giữa Ruột gối, Ruột chăn, Chăn; owner: "cho tự sửa").
 * Tên trang, mô tả, đường link vẫn ở LISTINGS (links.ts): link phải giữ như web cũ nên không sửa ở đây.
 * Sản phẩm Ecopillo đăng mới trong Woo vẫn tự vào trang theo danh mục Woo (WOO_CATEGORY_LISTINGS), không cần tích.
 */

/** Khoá ô trong màn hình sửa: phần cuối đường link (ruot-chan-goi) */
const fieldKeyOf = (path: string): string => path.split('/').filter(Boolean).pop() ?? path

/** Trang có ghi sẵn danh sách sản phẩm (trang theo bộ sưu tập như Bộ ga phủ, trang theo cả nhóm như Đệm Ecopillo thì không) */
const EDITABLE_PATHS: readonly string[] = Object.entries(LISTINGS)
  .filter(([, listing]) => listing.products?.length)
  .map(([path]) => path)

/** Lựa chọn: mọi sản phẩm lẻ, cả chăn hè Lyocell; bộ chăn ga có trang riêng theo bộ sưu tập */
const CHOICES = PRODUCTS.filter((p) => p.category !== 'bo-chan-ga')

const FIELDS: readonly EditableField[] = EDITABLE_PATHS.map((path) => ({
  khoa: fieldKeyOf(path),
  nhan: `Trang "${LISTINGS[path]?.title ?? path}"`,
  kieu: 'chon-nhieu',
  batBuoc: true,
  luaChon: CHOICES.map((p) => p.slug),
  nhanLuaChon: CHOICES.map((p) => p.name),
  goiY: `Link ${path}. Thứ tự trên trang: bộ "Sản phẩm trong trang danh mục: thứ tự"; sản phẩm tích thêm mà chưa ghi ở đó xếp sau.`,
}))

const BASE: Readonly<Record<string, readonly string[]>> = Object.fromEntries(
  EDITABLE_PATHS.map((path) => [fieldKeyOf(path), LISTINGS[path]?.products ?? []]),
)

export const LISTING_PRODUCTS_SET: EditableSet = {
  khoa: 'san-pham-trong-danh-muc',
  nhom: 'Sản phẩm',
  ten: 'Sản phẩm trong trang danh mục',
  moTa:
    'Tích sản phẩm hiện trong từng trang danh mục (Đệm lò xo, Ruột gối, Ruột chăn…). Ô xổ "Sản phẩm" trên thanh đầu trang lấy giá "từ …" theo các trang này. ' +
    'Sản phẩm đăng mới trong WooCommerce tự vào trang theo danh mục Woo, không cần tích. Tên, mô tả, SEO, ẩn trang, thêm trang danh mục mới: Sản phẩm → Danh mục.',
  kieu: 'mot',
  goc: BASE,
  truong: FIELDS,
}

const LIVE = liveObject(LISTING_PRODUCTS_SET.khoa, BASE, FIELDS)

/* ——— Thứ tự sản phẩm trong từng trang (owner 24/11/2026: khách tự xếp) ——— */

const nameOf = (slug: string): string => PRODUCTS.find((p) => p.slug === slug)?.name ?? slug

const ORDER_FIELDS: readonly EditableField[] = EDITABLE_PATHS.map((path) => ({
  khoa: fieldKeyOf(path),
  nhan: `Trang "${LISTINGS[path]?.title ?? path}" (mỗi dòng một sản phẩm)`,
  kieu: 'ds-dong',
  batBuoc: true,
  goiY: `Link ${path}. Ghi tên sản phẩm như trên web, mỗi dòng một tên, theo thứ tự muốn hiện. Sản phẩm trong trang mà không ghi ở đây (tích thêm, đăng mới trong Woo) xếp sau.`,
}))

const ORDER_BASE: Readonly<Record<string, readonly string[]>> = Object.fromEntries(
  EDITABLE_PATHS.map((path) => [fieldKeyOf(path), (LISTINGS[path]?.products ?? []).map(nameOf)]),
)

export const LISTING_ORDER_SET: EditableSet = {
  khoa: 'thu-tu-trong-danh-muc',
  nhom: 'Sản phẩm',
  ten: 'Sản phẩm trong trang danh mục: thứ tự',
  moTa:
    'Thứ tự sản phẩm trong từng trang danh mục (Đệm lò xo, Ruột gối, Ruột chăn…) và trong ô xổ "Sản phẩm" trên thanh đầu trang. ' +
    'Chọn sản phẩm nào hiện trong trang: bộ "Sản phẩm trong trang danh mục".',
  kieu: 'mot',
  goc: ORDER_BASE,
  truong: ORDER_FIELDS,
}

const ORDER_LIVE = liveObject(LISTING_ORDER_SET.khoa, ORDER_BASE, ORDER_FIELDS)

/** Các dòng thứ tự Ecopillo ghi cho một trang; chưa sửa thì undefined (giữ thứ tự gốc) */
const orderLinesOf = (path: string): readonly string[] | undefined =>
  ORDER_LIVE === ORDER_BASE ? undefined : ORDER_LIVE[fieldKeyOf(path)]

/** Xếp sản phẩm của một trang danh mục theo thứ tự Ecopillo ghi (CategoryPage dùng cho cả sản phẩm đăng mới trong Woo) */
export const orderInListing = <T extends { slug: string; name: string }>(path: string, items: readonly T[]): readonly T[] => {
  const lines = EDITABLE_PATHS.includes(path) ? orderLinesOf(path) : undefined
  return lines ? orderByNames(items, lines) : items
}

/** Sản phẩm (theo khoá) của một trang danh mục, đã ghép bản Ecopillo sửa. Giữ thứ tự gốc, sản phẩm tích thêm xếp sau; rồi xếp theo thứ tự Ecopillo ghi */
const productsOf = (path: string, base: readonly string[]): readonly string[] => {
  const picked = LIVE[fieldKeyOf(path)]
  const chosen = new Set(picked ?? base)
  const members = !picked || picked === base ? base : [...base.filter((slug) => chosen.has(slug)), ...picked.filter((slug) => !base.includes(slug))]
  const lines = orderLinesOf(path)
  if (!lines) return members
  const ordered = orderByNames(members.map((slug) => ({ slug, name: nameOf(slug) })), lines).map((p) => p.slug)
  return ordered.every((slug, i) => slug === members[i]) ? members : ordered
}

/** Trang danh mục (LISTINGS) với danh sách sản phẩm Ecopillo đã chọn */
export const listingOf = (path: string): ListingPreset | undefined => {
  const listing = LISTINGS[path]
  // Trang danh mục Ecopillo tạo trong Woo (đợt E): sản phẩm theo danh mục Woo, không theo ô tích ở đây
  if (!listing?.products || !EDITABLE_PATHS.includes(path)) return listing
  const products = productsOf(path, listing.products)
  return products === listing.products ? listing : { ...listing, products }
}
