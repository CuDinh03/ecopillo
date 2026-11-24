import type { Product } from '../data/products'

/**
 * Hết hàng sản phẩm lẻ (đợt F 24/11/2026): Ecopillo báo "Hết hàng" ở trang sửa sản phẩm Woo (cả sản phẩm hoặc từng biến thể),
 * plugin ton-kho.php ghi vào du-lieu.js, products.ts gắn `soldOut`. Khoá lựa chọn: id lựa chọn, "cỡ|độ dày", "mac-dinh".
 */

const SINGLE = 'mac-dinh'

/** Mọi khoá lựa chọn của sản phẩm */
const keysOf = (p: Product): string[] =>
  p.variants
    ? p.variants.sizes.flatMap((size) => (p.variants?.thicknesses ?? []).map((t) => `${size}|${t}`))
    : p.choices
      ? p.choices.map((c) => c.id)
      : [SINGLE]

/** Cả sản phẩm tạm hết (mọi lựa chọn đều hết) */
export const isFullySoldOut = (p: Product): boolean => {
  if (!p.soldOut?.length) return false
  const out = new Set(p.soldOut)
  return keysOf(p).every((k) => out.has(k))
}

/** Một lựa chọn cụ thể đã hết: biến thể cần đủ cỡ và độ dày; chưa chọn đủ thì coi là chưa hết */
export const isChoiceSoldOut = (p: Product, choiceId: string | null, thickness: string | null = null): boolean => {
  if (!p.soldOut?.length) return false
  if (p.variants) return choiceId !== null && thickness !== null && p.soldOut.includes(`${choiceId}|${thickness}`)
  if (p.choices) return choiceId !== null && p.soldOut.includes(choiceId)
  return p.soldOut.includes(SINGLE)
}

/**
 * Một ô cỡ / ô độ dày của sản phẩm có biến thể: hết khi mọi tổ hợp còn hợp với ô kia đang chọn đều hết
 * (ô kia chưa chọn thì xét mọi giá trị của nó)
 */
export const isVariantOptionSoldOut = (p: Product, size: string | null, thickness: string | null): boolean => {
  if (!p.variants || !p.soldOut?.length) return false
  const out = new Set(p.soldOut)
  const sizes = size === null ? p.variants.sizes : [size]
  const thicks = thickness === null ? p.variants.thicknesses : [thickness]
  return sizes.every((s) => thicks.every((t) => out.has(`${s}|${t}`)))
}
