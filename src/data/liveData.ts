/**
 * Giá, hết hàng, mẫu mới, sản phẩm lẻ mới do Ecopillo tự sửa trong WooCommerce (owner 18/11/2026: "giao diện là khung, khách cần tự chỉnh dữ liệu").
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

/**
 * Sản phẩm lẻ mới Ecopillo đăng trong WooCommerce (giai đoạn 4b): thuộc danh mục Woo có trong WOO_CATEGORY_LISTINGS (links.ts)
 * mà web chưa có. Plugin san-pham-moi.php đọc tên, ảnh, mô tả, thuộc tính, giá theo biến thể; chữ đã bỏ HTML, đã đổi chữ chất liệu cũ.
 * Giá: một trong ba kiểu `motGia` (sản phẩm đơn), `chon` (biến thể một chiều), `bienThe` (kích thước × độ dày).
 */
export interface LiveNewProduct {
  /** Tên trên link /san-pham/<duongDan>/, cũng là khoá sản phẩm */
  duongDan: string
  ten: string
  /** Danh mục Woo (slug) có trong WOO_CATEGORY_LISTINGS */
  danhMuc: readonly string[]
  anh: LiveImage
  anhPhu: readonly LiveImage[]
  tomTat: string
  chiTiet: readonly string[]
  thongSo: readonly { nhan: string; giaTri: string }[]
  motGia?: number
  nhanChon?: string
  chon?: readonly { id: string; nhan: string; gia: number }[]
  bienThe?: { co: readonly string[]; doDay: readonly string[]; gia: Readonly<Record<string, number>> }
}

interface LiveData {
  mau: Readonly<Record<string, LivePattern>>
  sanPham: Readonly<Record<string, LiveProduct>>
  mauMoi: readonly LiveNewPattern[]
  sanPhamMoi: readonly LiveNewProduct[]
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
    // Đường dẫn có chữ chất liệu cũ đã bị plugin loại (mau-moi.php); không ghi chữ đó vào mã web
    !/^[a-z0-9-]{3,200}$/.test(v.duongDan) ||
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

const cleanText = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const cleanTexts = (v: unknown, max: number, count: number): string[] =>
  Array.isArray(v) ? v.map((x) => cleanText(x, max)).filter(Boolean).slice(0, count) : []

/** Giá một chiều: id dạng link, nhãn, giá hợp lệ */
const cleanChoices = (v: unknown): { id: string; nhan: string; gia: number }[] => {
  if (!Array.isArray(v)) return []
  const seen = new Set<string>()
  return v.flatMap((x) => {
    const c = (x ?? {}) as Record<string, unknown>
    const id = typeof c.id === 'string' && /^[a-z0-9-]{1,80}$/.test(c.id) ? c.id : ''
    const nhan = cleanText(c.nhan, 80)
    if (!id || !nhan || !isPrice(c.gia) || seen.has(id)) return []
    seen.add(id)
    return [{ id, nhan, gia: c.gia }]
  }).slice(0, 40)
}

/** Bảng kích thước × độ dày: chỉ giữ ô có cả hai chiều trong danh sách */
const cleanVariantTable = (v: unknown): LiveNewProduct['bienThe'] => {
  if (!v || typeof v !== 'object') return undefined
  const t = v as Record<string, unknown>
  const co = cleanTexts(t.co, 60, 20)
  const doDay = cleanTexts(t.doDay, 60, 20)
  const prices = cleanPrices(t.gia)
  if (!co.length || !doDay.length || !prices) return undefined
  const gia = Object.fromEntries(Object.entries(prices).filter(([k]) => {
    const [size, thick] = k.split('|')
    return co.includes(size) && doDay.includes(thick)
  }))
  return Object.keys(gia).length ? { co, doDay, gia } : undefined
}

/** Sản phẩm lẻ mới hợp lệ: link đúng dạng, có tên, ảnh, danh mục và ít nhất một giá */
function cleanNewProduct(input: unknown): LiveNewProduct | undefined {
  if (!input || typeof input !== 'object') return undefined
  const v = input as Record<string, unknown>
  const image = cleanImage(v.anh)
  const ten = cleanText(v.ten, 120)
  const danhMuc = cleanTexts(v.danhMuc, 60, 10)
  const motGia = isPrice(v.motGia) ? v.motGia : undefined
  const chon = cleanChoices(v.chon)
  const bienThe = cleanVariantTable(v.bienThe)
  if (typeof v.duongDan !== 'string' || !/^[a-z0-9-]{3,200}$/.test(v.duongDan) || !ten || !image || !danhMuc.length) return undefined
  if (motGia === undefined && !chon.length && !bienThe) return undefined
  const specs = Array.isArray(v.thongSo)
    ? v.thongSo.flatMap((x) => {
        const s = (x ?? {}) as Record<string, unknown>
        const nhan = cleanText(s.nhan, 60)
        const giaTri = cleanText(s.giaTri, 200)
        return nhan && giaTri ? [{ nhan, giaTri }] : []
      }).slice(0, 12)
    : []
  return {
    duongDan: v.duongDan,
    ten,
    danhMuc,
    anh: image,
    anhPhu: Array.isArray(v.anhPhu) ? v.anhPhu.map(cleanImage).filter((x): x is LiveImage => !!x).slice(0, 12) : [],
    tomTat: cleanText(v.tomTat, 400),
    chiTiet: cleanTexts(v.chiTiet, 600, 16),
    thongSo: specs,
    ...(bienThe ? { bienThe } : chon.length ? { chon, nhanChon: cleanText(v.nhanChon, 40) || 'Lựa chọn' } : { motGia }),
  }
}

function read(): LiveData {
  const empty: LiveData = { mau: {}, sanPham: {}, mauMoi: [], sanPhamMoi: [] }
  if (typeof window === 'undefined') return empty
  const raw = (window as { __ECO_GIA__?: unknown }).__ECO_GIA__
  if (!raw || typeof raw !== 'object') return empty
  const { mau, sanPham, mauMoi, sanPhamMoi } = raw as { mau?: unknown; sanPham?: unknown; mauMoi?: unknown; sanPhamMoi?: unknown }
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
  const newProducts = Array.isArray(sanPhamMoi) ? sanPhamMoi.slice(0, 200).map(cleanNewProduct).filter((x): x is LiveNewProduct => !!x) : []
  return { mau: patterns, sanPham: products, mauMoi: newPatterns, sanPhamMoi: newProducts }
}

const LIVE = read()

export const livePattern = (collectionId: string, code: string): LivePattern | undefined => LIVE.mau[`${collectionId}/${code}`]

export const liveProduct = (slug: string): LiveProduct | undefined => LIVE.sanPham[slug]

/** Mẫu mới Ecopillo thêm trong WooCommerce cho một bộ sưu tập */
export const liveNewPatterns = (collectionId: string): readonly LiveNewPattern[] => LIVE.mauMoi.filter((p) => p.bo === collectionId)

/** Mẫu mới theo tên trên link (trang /san-pham/<tên>/) */
export const liveNewPatternBySlug = (slug: string): LiveNewPattern | undefined => LIVE.mauMoi.find((p) => p.duongDan === slug)

/** Sản phẩm lẻ mới Ecopillo đăng trong WooCommerce (products.ts ghép vào PRODUCTS) */
export const liveNewProducts = (): readonly LiveNewProduct[] => LIVE.sanPhamMoi

/** Sản phẩm lẻ mới theo tên trên link (trang /san-pham/<tên>/) */
export const liveNewProductBySlug = (slug: string): LiveNewProduct | undefined => LIVE.sanPhamMoi.find((p) => p.duongDan === slug)

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
