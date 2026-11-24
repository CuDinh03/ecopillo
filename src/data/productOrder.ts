import { slugify } from '../lib/slug'

/**
 * Thứ tự sản phẩm Ecopillo ghi ở Nội dung web (kệ trang Sản phẩm: productShelves.ts; trang danh mục nhỏ: listingProducts.ts):
 * mỗi dòng một tên sản phẩm như trên web, hoặc đường dẫn của sản phẩm. So không dấu, không phân biệt hoa thường, nên gõ thiếu dấu
 * vẫn khớp. Dòng không khớp sản phẩm nào thì bỏ qua; sản phẩm không có dòng nào (sản phẩm mới đăng) xếp sau, giữ thứ tự có sẵn.
 */

interface Orderable {
  slug: string
  name: string
}

/** Vị trí của từng sản phẩm theo các dòng Ecopillo ghi; không có dòng thì không có trong bảng */
export function rankByNames<T extends Orderable>(items: readonly T[], lines: readonly string[]): ReadonlyMap<string, number> {
  const rank = new Map<string, number>()
  lines.forEach((line, i) => {
    const key = slugify(line)
    if (!key) return
    const found = items.find((p) => !rank.has(p.slug) && (p.slug === key || slugify(p.name) === key))
    if (found) rank.set(found.slug, i)
  })
  return rank
}

/** Xếp sản phẩm theo các dòng Ecopillo ghi; sản phẩm không có dòng nào xếp sau theo thứ tự có sẵn (sort ổn định) */
export function orderByNames<T extends Orderable>(items: readonly T[], lines: readonly string[]): readonly T[] {
  const rank = rankByNames(items, lines)
  const at = (p: T): number => rank.get(p.slug) ?? Number.MAX_SAFE_INTEGER
  return [...items].sort((a, b) => at(a) - at(b))
}
