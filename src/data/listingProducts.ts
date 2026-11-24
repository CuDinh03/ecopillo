import { LISTINGS, type ListingPreset } from './links'
import { liveObject, type EditableField, type EditableSet } from './liveContent'
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
  goiY: `Link ${path}. Thứ tự trên trang theo thứ tự có sẵn của web; sản phẩm mới tích thêm xếp sau.`,
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
    'Sản phẩm đăng mới trong WooCommerce tự vào trang theo danh mục Woo, không cần tích. Tên trang và đường link giữ như web cũ, muốn đổi thì báo bên làm web.',
  kieu: 'mot',
  goc: BASE,
  truong: FIELDS,
}

const LIVE = liveObject(LISTING_PRODUCTS_SET.khoa, BASE, FIELDS)

/** Sản phẩm (theo khoá) của một trang danh mục, đã ghép bản Ecopillo sửa. Giữ thứ tự gốc; sản phẩm tích thêm xếp sau */
const productsOf = (path: string, base: readonly string[]): readonly string[] => {
  const picked = LIVE[fieldKeyOf(path)]
  if (!picked || picked === base) return base
  const chosen = new Set(picked)
  return [...base.filter((slug) => chosen.has(slug)), ...picked.filter((slug) => !base.includes(slug))]
}

/** Trang danh mục (LISTINGS) với danh sách sản phẩm Ecopillo đã chọn */
export const listingOf = (path: string): ListingPreset | undefined => {
  const listing = LISTINGS[path]
  // Trang danh mục Ecopillo tạo trong Woo (đợt E): sản phẩm theo danh mục Woo, không theo ô tích ở đây
  if (!listing?.products || !EDITABLE_PATHS.includes(path)) return listing
  const products = productsOf(path, listing.products)
  return products === listing.products ? listing : { ...listing, products }
}
