/**
 * Giá và hết hàng mới nhất do Ecopillo tự sửa trong WooCommerce (owner 18/11/2026: "giao diện là khung, khách cần tự chỉnh dữ liệu").
 * Kế hoạch: docs/ke-hoach-khach-tu-sua-du-lieu.md (cách A: dữ liệu nạp từ chính WordPress, không qua dịch vụ ngoài).
 *
 * Plugin WordPress (trien-khai/wordpress-plugin/ecopillo-giao-dien-moi/gia-woo.php) ghi file
 * /wp-content/uploads/ecopillo-du-lieu/du-lieu.js mỗi khi Ecopillo lưu sản phẩm. File đó đặt `window.__ECO_GIA__`
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

/** Ảnh lấy từ Thư viện WordPress */
export interface LiveImage {
  src: string
  srcSet: string
  alt: string
}

/**
 * Mẫu mới Ecopillo thêm trong WooCommerce (giai đoạn 4): sản phẩm Woo thuộc danh mục một bộ sưu tập mà web chưa có.
 * Plugin đọc mã (ô Mã sản phẩm), tên màu (dòng đầu Mô tả ngắn), ảnh, giá theo cỡ, hết hàng; trang của mẫu do plugin trả khung.
 */
export interface LiveNewPattern {
  /** Mã bộ sưu tập trên web (eco-rosa…) */
  bo: string
  /** Mã mẫu (ER50) */
  ma: string
  /** Tên màu */
  ten: string
  /** Tên trên link /san-pham/<duongDan>/ (tên sản phẩm Woo) */
  duongDan: string
  anh: LiveImage
  anhPhu: readonly LiveImage[]
  gia: Readonly<Record<string, number>>
  giaChun?: Readonly<Record<string, number>>
  het: readonly string[]
}

interface LiveData {
  mau: Readonly<Record<string, LivePattern>>
  sanPham: Readonly<Record<string, LiveProduct>>
  mauMoi: readonly LiveNewPattern[]
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

const isUrl = (v: unknown): v is string =>
  typeof v === 'string' && /^(https?:\/\/|\/(?!\/))/.test(v) && !/[\s<>"]/.test(v)

const cleanImage = (input: unknown): LiveImage | undefined => {
  if (!input || typeof input !== 'object') return undefined
  const { src, srcSet, alt } = input as Record<string, unknown>
  if (!isUrl(src)) return undefined
  return {
    src,
    srcSet: typeof srcSet === 'string' && !/[<>"]/.test(srcSet) ? srcSet : '',
    alt: typeof alt === 'string' ? alt.slice(0, 300) : '',
  }
}

/** Mẫu mới hợp lệ: mã, link đúng dạng, link không có chữ chất liệu cũ, đủ ảnh và giá */
function cleanNewPattern(input: unknown): LiveNewPattern | undefined {
  if (!input || typeof input !== 'object') return undefined
  const v = input as Record<string, unknown>
  const image = cleanImage(v.anh)
  const prices = cleanPrices(v.gia)
  if (
    typeof v.bo !== 'string' ||
    typeof v.ma !== 'string' ||
    !/^[A-Z]{2}\d{2,3}$/.test(v.ma) ||
    typeof v.ten !== 'string' ||
    !v.ten.trim() ||
    typeof v.duongDan !== 'string' ||
    !/^[a-z0-9-]{3,200}$/.test(v.duongDan) ||
    /tencel|60s/.test(v.duongDan) ||
    !image ||
    !prices
  ) {
    return undefined
  }
  return {
    bo: v.bo,
    ma: v.ma,
    ten: v.ten.trim().slice(0, 80),
    duongDan: v.duongDan,
    anh: image,
    anhPhu: Array.isArray(v.anhPhu) ? v.anhPhu.map(cleanImage).filter((x): x is LiveImage => !!x).slice(0, 12) : [],
    gia: prices,
    giaChun: cleanPrices(v.giaChun),
    het: cleanList(v.het) ?? [],
  }
}

function read(): LiveData {
  const empty: LiveData = { mau: {}, sanPham: {}, mauMoi: [] }
  if (typeof window === 'undefined') return empty
  const raw = (window as { __ECO_GIA__?: unknown }).__ECO_GIA__
  if (!raw || typeof raw !== 'object') return empty
  const { mau, sanPham, mauMoi } = raw as { mau?: unknown; sanPham?: unknown; mauMoi?: unknown }
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
  const newPatterns = Array.isArray(mauMoi) ? mauMoi.slice(0, 200).map(cleanNewPattern).filter((x): x is LiveNewPattern => !!x) : []
  return { mau: patterns, sanPham: products, mauMoi: newPatterns }
}

const LIVE = read()

export const livePattern = (collectionId: string, code: string): LivePattern | undefined => LIVE.mau[`${collectionId}/${code}`]

export const liveProduct = (slug: string): LiveProduct | undefined => LIVE.sanPham[slug]

/** Mẫu mới Ecopillo thêm trong WooCommerce cho một bộ sưu tập */
export const liveNewPatterns = (collectionId: string): readonly LiveNewPattern[] => LIVE.mauMoi.filter((p) => p.bo === collectionId)

/** Mẫu mới theo tên trên link (trang /san-pham/<tên>/) */
export const liveNewPatternBySlug = (slug: string): LiveNewPattern | undefined => LIVE.mauMoi.find((p) => p.duongDan === slug)

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
