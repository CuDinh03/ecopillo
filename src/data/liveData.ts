/**
 * Giá và hết hàng mới nhất do Ecopillo tự sửa trong WooCommerce (owner 18/11/2026: "giao diện là khung, khách cần tự chỉnh dữ liệu").
 * Kế hoạch: docs/ke-hoach-khach-tu-sua-du-lieu.md (cách A: dữ liệu nạp từ chính WordPress, không qua dịch vụ ngoài).
 *
 * Plugin WordPress (trien-khai/wordpress-plugin/ecopillo-giao-dien-moi/gia-woo.php) ghi file
 * /wp-content/uploads/ecopillo-du-lieu/gia.js mỗi khi Ecopillo lưu sản phẩm. File đó đặt `window.__ECO_GIA__`
 * trước khi gói JS chính chạy (thẻ script `defer` đứng trước, vite.config.ts). Không có file (pnpm dev, bản xem thử,
 * plugin chưa bật lấy giá Woo) thì dùng giá trong catalog.ts / products.ts như cũ.
 *
 * Chỉ ô nào khớp được với WooCommerce mới có trong file; ô thiếu giữ giá trong code.
 * Trang dựng sẵn mang giá lúc dựng: giá mới khác giá đó thì main.tsx vẽ lại trang thay vì gắn vào HTML cũ.
 */

/** Một mẫu chăn ga, khoá `${collectionId}/${code}`. Khoá giá là SizeId (160x200, 180x200, 200x220) */
export interface LivePattern {
  gia?: Readonly<Record<string, number>>
  /** Giá bộ ga chun chần */
  giaChun?: Readonly<Record<string, number>>
  /** Cỡ hết hàng */
  het?: readonly string[]
}

/** Một sản phẩm lẻ, khoá là slug trong products.ts */
export interface LiveProduct {
  /** Giá theo id lựa chọn (choices) */
  chon?: Readonly<Record<string, number>>
  /** Giá theo khoá `${size}|${thickness}` (variants) */
  bienThe?: Readonly<Record<string, number>>
}

interface LiveData {
  mau: Readonly<Record<string, LivePattern>>
  sanPham: Readonly<Record<string, LiveProduct>>
}

const isPrice = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0 && v < 1e10

/** Chỉ giữ cặp khoá → giá hợp lệ: file do máy chủ ghi nhưng vẫn không tin mù */
const cleanPrices = (input: unknown): Record<string, number> | undefined => {
  if (!input || typeof input !== 'object') return undefined
  const entries = Object.entries(input as Record<string, unknown>).filter(
    (e): e is [string, number] => typeof e[0] === 'string' && e[0].length < 60 && isPrice(e[1]),
  )
  return entries.length ? Object.fromEntries(entries) : undefined
}

const cleanList = (input: unknown): string[] | undefined =>
  Array.isArray(input) ? input.filter((v): v is string => typeof v === 'string' && v.length < 60) : undefined

function read(): LiveData {
  const empty: LiveData = { mau: {}, sanPham: {} }
  if (typeof window === 'undefined') return empty
  const raw = (window as { __ECO_GIA__?: unknown }).__ECO_GIA__
  if (!raw || typeof raw !== 'object') return empty
  const { mau, sanPham } = raw as { mau?: unknown; sanPham?: unknown }
  const patterns: Record<string, LivePattern> = {}
  for (const [key, value] of Object.entries(mau && typeof mau === 'object' ? mau : {})) {
    const v = (value ?? {}) as Record<string, unknown>
    patterns[key] = { gia: cleanPrices(v.gia), giaChun: cleanPrices(v.giaChun), het: cleanList(v.het) }
  }
  const products: Record<string, LiveProduct> = {}
  for (const [key, value] of Object.entries(sanPham && typeof sanPham === 'object' ? sanPham : {})) {
    const v = (value ?? {}) as Record<string, unknown>
    products[key] = { chon: cleanPrices(v.chon), bienThe: cleanPrices(v.bienThe) }
  }
  return { mau: patterns, sanPham: products }
}

const LIVE = read()

export const livePattern = (collectionId: string, code: string): LivePattern | undefined => LIVE.mau[`${collectionId}/${code}`]

export const liveProduct = (slug: string): LiveProduct | undefined => LIVE.sanPham[slug]

/** Có ô giá / hết hàng nào khác bản dựng sẵn không (main.tsx dùng để chọn vẽ lại hay gắn vào HTML có sẵn) */
let differs = false
export const markLiveDiffers = (): void => {
  differs = true
}
export const liveDiffers = (): boolean => differs

/** Bảng giá mới: ghép ô giá live lên bảng cũ; không ô nào đổi thì trả lại đúng bảng cũ */
export function mergePrices<T extends Readonly<Record<string, number>>>(base: T, live: Readonly<Record<string, number>> | undefined): T {
  if (!live) return base
  let changed = false
  const next: Record<string, number> = { ...base }
  for (const key of Object.keys(base)) {
    const value = live[key]
    if (value !== undefined && value !== base[key]) {
      next[key] = value
      changed = true
    }
  }
  if (!changed) return base
  markLiveDiffers()
  return next as T
}
