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
/**
 * Câu chuyện phối màu Ecopillo nhập trong Woo (đợt C): ô Mô tả của sản phẩm mẫu, dòng đầu là tên câu chuyện, các dòng sau là
 * đoạn kể; thuộc tính "Gam màu" chọn một gam (mã trong stories.ts TONES). Không có gam thì mẫu không vào bộ lọc gam.
 */
export interface LiveStory {
  ten: string
  doan: string
  gam?: string
}

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
  cauChuyen?: LiveStory
}

/**
 * Bộ sưu tập mới Ecopillo tạo trong Woo (đợt C, plugin bo-suu-tap-moi.php): một danh mục sản phẩm có tích
 * "Hiện thành bộ sưu tập trên giao diện mới"; các sản phẩm trong danh mục là các mẫu (cùng quy tắc với mẫu mới).
 */
export interface LiveNewCollection {
  /** Mã bộ trên web (tên danh mục Woo bỏ "bo-suu-tap-") */
  id: string
  ten: string
  kieu: 'ga-phu' | 'ga-chun' | 'chan-ga' | 'chan-he'
  /** "Trong bộ gồm" Ecopillo ghi ở danh mục (mỗi dòng một món); trống thì theo kiểu bộ */
  trongBo: readonly string[]
  khauHieu: string
  moTa: string
  cauChuyen: string
  /** Đường link trang bộ (đường link danh mục Woo) */
  duongDan: string
  mau: readonly LiveNewPattern[]
}

/** Chữ bộ sưu tập có sẵn Ecopillo đã soát và tích ở trang sửa danh mục Woo (đợt C): ô trống giữ chữ trong code */
export interface LiveCollectionText {
  trongBo?: readonly string[]
  khauHieu?: string
  moTa?: string
  cauChuyen?: string
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

/**
 * Tên, ảnh, mô tả sản phẩm có sẵn lấy từ WooCommerce khi Ecopillo đã soát và tích ô "Giao diện mới dùng tên, ảnh, mô tả"
 * (đợt B, plugin noi-dung-woo.php). Chỉ có ô Woo không trống; ô thiếu thì giữ nội dung trong code.
 */
export interface LiveProductContent {
  ten?: string
  anh?: LiveImage
  anhPhu?: readonly LiveImage[]
  tomTat?: string
  chiTiet?: readonly string[]
  thongSo?: readonly { nhan: string; giaTri: string }[]
  /** Phần "Hiểu kỹ trước khi chọn" Ecopillo sửa trong Woo (đợt D), dạng chữ của productInfoText.ts */
  hieuKy?: string
}

/** Ảnh, ảnh phụ, tên màu của một mẫu chăn ga có sẵn (khoá `${collectionId}/${code}`) */
export interface LivePatternContent {
  anh?: LiveImage
  anhPhu?: readonly LiveImage[]
  tenMau?: string
  cauChuyen?: LiveStory
}

interface LiveData {
  mau: Readonly<Record<string, LivePattern>>
  sanPham: Readonly<Record<string, LiveProduct>>
  mauMoi: readonly LiveNewPattern[]
  sanPhamMoi: readonly LiveNewProduct[]
  noiDungSanPham: Readonly<Record<string, LiveProductContent>>
  noiDungMau: Readonly<Record<string, LivePatternContent>>
  boSuuTapMoi: readonly LiveNewCollection[]
  boSuuTapChu: Readonly<Record<string, LiveCollectionText>>
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

const cleanStory = (input: unknown): LiveStory | undefined => {
  if (!input || typeof input !== 'object') return undefined
  const v = input as Record<string, unknown>
  const ten = typeof v.ten === 'string' ? v.ten.trim().slice(0, 80) : ''
  const doan = typeof v.doan === 'string' ? v.doan.trim().slice(0, 1200) : ''
  const gam = typeof v.gam === 'string' && /^[a-z]{2,10}$/.test(v.gam) ? v.gam : undefined
  return ten && doan ? { ten, doan, ...(gam ? { gam } : {}) } : undefined
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
    ...(cleanStory(v.cauChuyen) ? { cauChuyen: cleanStory(v.cauChuyen) } : {}),
  }
}

/** Bộ mới hợp lệ: mã, link đúng dạng, tên, kiểu, ít nhất một mẫu hợp lệ */
function cleanNewCollection(input: unknown): LiveNewCollection | undefined {
  if (!input || typeof input !== 'object') return undefined
  const v = input as Record<string, unknown>
  const text = (x: unknown, max: number) => (typeof x === 'string' ? x.trim().slice(0, max) : '')
  const id = text(v.id, 60)
  const ten = text(v.ten, 80)
  const duongDan = text(v.duongDan, 200)
  const kieu = v.kieu === 'ga-phu' || v.kieu === 'ga-chun' || v.kieu === 'chan-ga' || v.kieu === 'chan-he' ? v.kieu : undefined
  if (!/^[a-z0-9-]{3,60}$/.test(id) || !ten || !kieu || !/^\/[a-z0-9/-]{3,200}\/$/.test(duongDan)) return undefined
  const mau = Array.isArray(v.mau)
    ? v.mau.slice(0, 120).map((m) => cleanNewPattern({ ...(m as object), bo: id })).filter((x): x is LiveNewPattern => !!x)
        // Mẫu của bộ mới phải đủ giá ba cỡ (giá chung của bộ tính từ đó)
        .filter((m) => ['160x200', '180x200', '200x220'].every((size) => m.gia[size] !== undefined))
    : []
  if (!mau.length) return undefined
  return { id, ten, kieu, trongBo: cleanTexts(v.trongBo, 200, 12), khauHieu: text(v.khauHieu, 200), moTa: text(v.moTa, 600), cauChuyen: text(v.cauChuyen, 1200), duongDan, mau }
}

const cleanCollectionText = (input: unknown): LiveCollectionText => {
  const v = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const text = (x: unknown, max: number) => (typeof x === 'string' ? x.trim().slice(0, max) : '')
  const khauHieu = text(v.khauHieu, 200)
  const moTa = text(v.moTa, 600)
  const cauChuyen = text(v.cauChuyen, 1200)
  const trongBo = cleanTexts(v.trongBo, 200, 12)
  return {
    ...(khauHieu ? { khauHieu } : {}),
    ...(moTa ? { moTa } : {}),
    ...(cauChuyen ? { cauChuyen } : {}),
    ...(trongBo.length ? { trongBo } : {}),
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

const cleanImages = (v: unknown): LiveImage[] => (Array.isArray(v) ? v.map(cleanImage).filter((x): x is LiveImage => !!x).slice(0, 12) : [])

const cleanSpecs = (v: unknown): { nhan: string; giaTri: string }[] =>
  Array.isArray(v)
    ? v
        .flatMap((x) => {
          const s = (x ?? {}) as Record<string, unknown>
          const nhan = cleanText(s.nhan, 60)
          const giaTri = cleanText(s.giaTri, 200)
          return nhan && giaTri ? [{ nhan, giaTri }] : []
        })
        .slice(0, 12)
    : []

/** Chỉ giữ ô có giá trị đúng kiểu; đối tượng rỗng = không có gì để ghép */
function cleanProductContent(input: unknown): LiveProductContent {
  const v = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const ten = cleanText(v.ten, 120)
  const anh = cleanImage(v.anh)
  const anhPhu = cleanImages(v.anhPhu)
  const tomTat = cleanText(v.tomTat, 400)
  const chiTiet = cleanTexts(v.chiTiet, 600, 16)
  const thongSo = cleanSpecs(v.thongSo)
  const hieuKy = cleanText(v.hieuKy, 12000)
  return {
    ...(hieuKy ? { hieuKy } : {}),
    ...(ten ? { ten } : {}),
    ...(anh ? { anh } : {}),
    ...(anhPhu.length ? { anhPhu } : {}),
    ...(tomTat ? { tomTat } : {}),
    ...(chiTiet.length ? { chiTiet } : {}),
    ...(thongSo.length ? { thongSo } : {}),
  }
}

function cleanPatternContent(input: unknown): LivePatternContent {
  const v = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const anh = cleanImage(v.anh)
  const anhPhu = cleanImages(v.anhPhu)
  const tenMau = cleanText(v.tenMau, 60)
  const cauChuyen = cleanStory(v.cauChuyen)
  return { ...(anh ? { anh } : {}), ...(anhPhu.length ? { anhPhu } : {}), ...(tenMau ? { tenMau } : {}), ...(cauChuyen ? { cauChuyen } : {}) }
}

const cleanContentMap = <T extends object>(input: unknown, clean: (v: unknown) => T): Record<string, T> =>
  Object.fromEntries(
    Object.entries(input && typeof input === 'object' ? input : {})
      .slice(0, 400)
      .map(([key, value]) => [key, clean(value)] as const)
      .filter(([, value]) => Object.keys(value).length > 0),
  )

function read(): LiveData {
  const empty: LiveData = { mau: {}, sanPham: {}, mauMoi: [], sanPhamMoi: [], noiDungSanPham: {}, noiDungMau: {}, boSuuTapMoi: [], boSuuTapChu: {} }
  if (typeof window === 'undefined') return empty
  const raw = (window as { __ECO_GIA__?: unknown }).__ECO_GIA__
  if (!raw || typeof raw !== 'object') return empty
  const { mau, sanPham, mauMoi, sanPhamMoi, noiDungWoo, boSuuTapMoi, boSuuTapChu } = raw as {
    mau?: unknown
    sanPham?: unknown
    mauMoi?: unknown
    sanPhamMoi?: unknown
    noiDungWoo?: { sanPham?: unknown; mau?: unknown }
    boSuuTapMoi?: unknown
    boSuuTapChu?: unknown
  }
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
  return {
    mau: patterns,
    sanPham: products,
    mauMoi: newPatterns,
    sanPhamMoi: newProducts,
    noiDungSanPham: cleanContentMap(noiDungWoo?.sanPham, cleanProductContent),
    noiDungMau: cleanContentMap(noiDungWoo?.mau, cleanPatternContent),
    boSuuTapMoi: Array.isArray(boSuuTapMoi)
      ? boSuuTapMoi.slice(0, 30).map(cleanNewCollection).filter((x): x is LiveNewCollection => !!x)
      : [],
    boSuuTapChu: cleanContentMap(boSuuTapChu, cleanCollectionText),
  }
}

const LIVE = read()

export const livePattern = (collectionId: string, code: string): LivePattern | undefined => LIVE.mau[`${collectionId}/${code}`]

export const liveProduct = (slug: string): LiveProduct | undefined => LIVE.sanPham[slug]

/** Tên, ảnh, mô tả Ecopillo đã soát trong Woo cho một sản phẩm lẻ có sẵn (đợt B) */
export const liveProductContent = (slug: string): LiveProductContent | undefined => LIVE.noiDungSanPham[slug]

/** Bộ sưu tập mới Ecopillo tạo trong Woo (đợt C) */
export const liveNewCollections = (): readonly LiveNewCollection[] => LIVE.boSuuTapMoi

/** Khẩu hiệu, mô tả, câu chuyện Ecopillo đã soát cho một bộ có sẵn (đợt C) */
export const liveCollectionText = (id: string): LiveCollectionText | undefined => LIVE.boSuuTapChu[id]

/** Ảnh, ảnh phụ, tên màu Ecopillo đã soát trong Woo cho một mẫu có sẵn (đợt B) */
export const livePatternContent = (collectionId: string, code: string): LivePatternContent | undefined =>
  LIVE.noiDungMau[`${collectionId}/${code}`]

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
