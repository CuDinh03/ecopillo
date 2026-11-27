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
 * đoạn kể; thuộc tính "Gam màu" chọn một gam (mã trong stories.ts TONES, Ecopillo thêm gam ở Nội dung web). Không có gam thì mẫu không vào bộ lọc gam.
 */
export interface LiveStory {
  ten: string
  doan: string
  gam?: string
}

export interface LiveNewPattern {
  /** Màu chấm / dải: thuộc tính "Mã màu" (đợt F); không có thì màu be nhạt */
  mauNen?: string
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
  /** Tên bộ (tên danh mục Woo bỏ chữ "Bộ sưu tập" ở đầu), đợt F */
  ten?: string
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
  /**
   * Lựa chọn, giá, hết hàng lấy thẳng từ biến thể Woo khi Ecopillo tích "dùng các lựa chọn và giá" (đợt G): cùng dạng giá của
   * sản phẩm lẻ mới; `het` là các lựa chọn đang hết (id, "cỡ|độ dày", "mac-dinh")
   */
  luaChon?: Pick<LiveNewProduct, 'motGia' | 'nhanChon' | 'chon' | 'bienThe'> & { het: readonly string[] }
}

/** Ảnh, ảnh phụ, tên màu của một mẫu chăn ga có sẵn (khoá `${collectionId}/${code}`) */
export interface LivePatternContent {
  /** Màu chấm / dải của mẫu: thuộc tính "Mã màu" trong Woo (đợt F) */
  mauNen?: string
  anh?: LiveImage
  anhPhu?: readonly LiveImage[]
  tenMau?: string
  cauChuyen?: LiveStory
}

/**
 * Danh mục sản phẩm Ecopillo sửa trong WooCommerce (Sản phẩm → Danh mục; plugin danh-muc.php, đợt E 24/11/2026:
 * "danh mục sản phẩm chưa thêm được, chưa sửa được, chưa xoá được", khách muốn thêm SEO cho danh mục).
 * - `chu`: tên, mô tả của trang danh mục có sẵn (khi Ecopillo tích "Giao diện mới dùng tên, mô tả ở đây")
 * - `moi`: danh mục Ecopillo tạo và tích "Hiện thành trang danh mục" → trang mới ở đúng link danh mục Woo
 * - `an`: trang danh mục đã ẩn hoặc đã xoá trong Woo → link chuyển (301) tới trang ghi ở đây
 */
export interface LiveCategoryText {
  ten?: string
  moTa?: string
}
export interface LiveNewCategory {
  /** Link trang (link danh mục Woo), có "/" hai đầu */
  duongDan: string
  /** Tên danh mục Woo (slug), để sản phẩm lẻ mới trong danh mục này vào trang */
  woo: string
  ten: string
  moTa: string
  /** Sản phẩm lẻ trên web (khoá products.ts hoặc tên link sản phẩm mới), theo thứ tự trong Woo */
  sanPham: readonly string[]
  /** Bộ sưu tập (mã trên web) có mẫu nằm trong danh mục này */
  boSuuTap: readonly string[]
}
export interface LiveCategories {
  chu: Readonly<Record<string, LiveCategoryText>>
  moi: readonly LiveNewCategory[]
  an: Readonly<Record<string, string>>
  /** Bài viết SEO cuối trang danh mục (27/11/2026): link danh mục → tên file JSON trong uploads/ecopillo-du-lieu/danh-muc/ */
  baiSeo: Readonly<Record<string, string>>
}
/**
 * Sản phẩm, mẫu, bộ sưu tập, bài viết có sẵn Ecopillo đã gỡ trong WordPress (đợt E2, plugin an-xoa.php): chuyển sang nháp,
 * riêng tư, thùng rác hoặc xoá hẳn sau khi cài plugin; bộ sưu tập: tích "Ẩn trang" ở danh mục hoặc xoá danh mục.
 * Web bỏ chúng khỏi mọi danh sách; `trang`: link trang của chúng → trang chuyển tới (máy chủ trả 301).
 */
export interface LiveHidden {
  sanPham: ReadonlySet<string>
  mau: ReadonlySet<string>
  bo: ReadonlySet<string>
  bai: ReadonlySet<string>
  trang: Readonly<Record<string, string>>
}

/**
 * Tiêu đề, mô tả trên Google của một trang (link → SEO) Ecopillo điền ở danh mục Woo (ô của plugin hoặc khung Yoast SEO),
 * và từ 25/11/2026 ở khung Yoast SEO của bài, trang, sản phẩm (plugin seo-yoast.php). `anGoogle`: Yoast đặt không cho hiện trên Google
 */
export interface LiveSeo {
  tieuDe?: string
  moTa?: string
  anGoogle?: boolean
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
  danhMuc: LiveCategories
  seo: Readonly<Record<string, LiveSeo>>
  an: LiveHidden
  /** Lựa chọn hết hàng của sản phẩm lẻ có sẵn (ton-kho.php, đợt F): khoá sản phẩm → id lựa chọn / "cỡ|độ dày" / "mac-dinh" */
  hetSanPham: Readonly<Record<string, readonly string[]>>
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
  // Mã gam: gam gốc hoặc gam Ecopillo thêm ở Nội dung web (mã theo tên gam, stories.ts TONE_SET)
  const gam = typeof v.gam === 'string' && /^[a-z0-9-]{1,60}$/.test(v.gam) ? v.gam : undefined
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
    ...(cleanSwatch(v.mauNen) ? { mauNen: cleanSwatch(v.mauNen) } : {}),
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
  const ten = text(v.ten, 80)
  return {
    ...(ten ? { ten } : {}),
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
/** Lựa chọn lấy từ biến thể Woo của sản phẩm có sẵn (đợt G): một giá, một chiều, hoặc cỡ × độ dày */
function cleanOptions(input: unknown): LiveProductContent['luaChon'] {
  if (!input || typeof input !== 'object') return undefined
  const v = input as Record<string, unknown>
  const het = Array.isArray(v.het) ? v.het.filter((x): x is string => typeof x === 'string' && x.length <= 120).slice(0, 80) : []
  const bienThe = cleanVariantTable(v.bienThe)
  if (bienThe) return { bienThe, het }
  const chon = cleanChoices(v.chon)
  if (chon.length) return { chon, nhanChon: cleanText(v.nhanChon, 40) || undefined, het }
  return isPrice(v.motGia) ? { motGia: v.motGia, het } : undefined
}

function cleanProductContent(input: unknown): LiveProductContent {
  const v = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const ten = cleanText(v.ten, 120)
  const anh = cleanImage(v.anh)
  const anhPhu = cleanImages(v.anhPhu)
  const tomTat = cleanText(v.tomTat, 400)
  const chiTiet = cleanTexts(v.chiTiet, 600, 16)
  const thongSo = cleanSpecs(v.thongSo)
  const hieuKy = cleanText(v.hieuKy, 12000)
  const luaChon = cleanOptions(v.luaChon)
  return {
    ...(luaChon ? { luaChon } : {}),
    ...(hieuKy ? { hieuKy } : {}),
    ...(ten ? { ten } : {}),
    ...(anh ? { anh } : {}),
    ...(anhPhu.length ? { anhPhu } : {}),
    ...(tomTat ? { tomTat } : {}),
    ...(chiTiet.length ? { chiTiet } : {}),
    ...(thongSo.length ? { thongSo } : {}),
  }
}

/** Màu "#rrggbb" (thuộc tính "Mã màu" của mẫu trong Woo) */
const cleanSwatch = (v: unknown): string | undefined => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : undefined)

function cleanPatternContent(input: unknown): LivePatternContent {
  const v = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const anh = cleanImage(v.anh)
  const anhPhu = cleanImages(v.anhPhu)
  const tenMau = cleanText(v.tenMau, 60)
  const cauChuyen = cleanStory(v.cauChuyen)
  const mauNen = cleanSwatch(v.mauNen)
  return {
    ...(anh ? { anh } : {}),
    ...(anhPhu.length ? { anhPhu } : {}),
    ...(tenMau ? { tenMau } : {}),
    ...(cauChuyen ? { cauChuyen } : {}),
    ...(mauNen ? { mauNen } : {}),
  }
}

const cleanContentMap = <T extends object>(input: unknown, clean: (v: unknown) => T): Record<string, T> =>
  Object.fromEntries(
    Object.entries(input && typeof input === 'object' ? input : {})
      .slice(0, 400)
      .map(([key, value]) => [key, clean(value)] as const)
      .filter(([, value]) => Object.keys(value).length > 0),
  )

/** Link trong web dạng /a/b/: chữ thường không dấu, số, gạch; có "/" cuối */
export const isPagePath = (v: unknown): v is string =>
  typeof v === 'string' && v.length <= 200 && /^\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\/$/.test(v)

const cleanSlugs = (v: unknown, count: number): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && /^[a-z0-9-]{1,200}$/.test(x)))].slice(0, count) : []

function cleanCategories(input: unknown): LiveCategories {
  const raw = (input && typeof input === 'object' ? input : {}) as { chu?: unknown; moi?: unknown; an?: unknown; baiSeo?: unknown }
  const chu: Record<string, LiveCategoryText> = {}
  for (const [path, value] of Object.entries(raw.chu && typeof raw.chu === 'object' ? raw.chu : {}).slice(0, 200)) {
    const v = (value ?? {}) as Record<string, unknown>
    const text = { ten: cleanText(v.ten, 120), moTa: cleanText(v.moTa, 1500) }
    if (isPagePath(path) && (text.ten || text.moTa)) chu[path] = Object.fromEntries(Object.entries(text).filter(([, x]) => x))
  }
  const moi = (Array.isArray(raw.moi) ? raw.moi : [])
    .slice(0, 100)
    .map((value): LiveNewCategory | undefined => {
      const v = (value ?? {}) as Record<string, unknown>
      const ten = cleanText(v.ten, 120)
      if (!isPagePath(v.duongDan) || typeof v.woo !== 'string' || !/^[a-z0-9-]{1,200}$/.test(v.woo) || !ten) return undefined
      const sanPham = cleanSlugs(v.sanPham, 120)
      const boSuuTap = cleanSlugs(v.boSuuTap, 30)
      if (!sanPham.length && !boSuuTap.length) return undefined
      return { duongDan: v.duongDan, woo: v.woo, ten, moTa: cleanText(v.moTa, 1500), sanPham, boSuuTap }
    })
    .filter((x): x is LiveNewCategory => !!x)
  const an: Record<string, string> = {}
  for (const [path, to] of Object.entries(raw.an && typeof raw.an === 'object' ? raw.an : {}).slice(0, 200)) {
    if (isPagePath(path) && (to === '/' || isPagePath(to)) && to !== path) an[path] = to
  }
  const baiSeo: Record<string, string> = {}
  for (const [path, key] of Object.entries(raw.baiSeo && typeof raw.baiSeo === 'object' ? raw.baiSeo : {}).slice(0, 200)) {
    if (isPagePath(path) && typeof key === 'string' && /^[a-z0-9-]{3,160}$/.test(key)) baiSeo[path] = key
  }
  return { chu, moi, an, baiSeo }
}

function cleanSeo(input: unknown): Record<string, LiveSeo> {
  const seo: Record<string, LiveSeo> = {}
  for (const [path, value] of Object.entries(input && typeof input === 'object' ? input : {}).slice(0, 400)) {
    const v = (value ?? {}) as Record<string, unknown>
    const item = { tieuDe: cleanText(v.tieuDe, 200), moTa: cleanText(v.moTa, 400), anGoogle: v.anGoogle === true }
    if ((path === '/' || isPagePath(path)) && (item.tieuDe || item.moTa || item.anGoogle)) seo[path] = Object.fromEntries(Object.entries(item).filter(([, x]) => x))
  }
  return seo
}

function cleanHidden(input: unknown): LiveHidden {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const keys = (v: unknown): Set<string> =>
    new Set(Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && /^[a-z0-9-]{1,120}(\/[A-Za-z0-9-]{1,40})?$/.test(x)).slice(0, 400) : [])
  const trang: Record<string, string> = {}
  for (const [path, to] of Object.entries(raw.trang && typeof raw.trang === 'object' ? raw.trang : {}).slice(0, 600)) {
    if (isPagePath(path) && (to === '/' || isPagePath(to)) && to !== path) trang[path] = to
  }
  return { sanPham: keys(raw.sanPham), mau: keys(raw.mau), bo: keys(raw.bo), bai: keys(raw.bai), trang }
}

const NO_HIDDEN: LiveHidden = { sanPham: new Set(), mau: new Set(), bo: new Set(), bai: new Set(), trang: {} }

function read(): LiveData {
  const empty: LiveData = { mau: {}, sanPham: {}, mauMoi: [], sanPhamMoi: [], noiDungSanPham: {}, noiDungMau: {}, boSuuTapMoi: [], boSuuTapChu: {}, danhMuc: { chu: {}, moi: [], an: {}, baiSeo: {} }, seo: {}, an: NO_HIDDEN, hetSanPham: {} }
  if (typeof window === 'undefined') return empty
  const raw = (window as { __ECO_GIA__?: unknown }).__ECO_GIA__
  if (!raw || typeof raw !== 'object') return empty
  const { mau, sanPham, mauMoi, sanPhamMoi, noiDungWoo, boSuuTapMoi, boSuuTapChu, danhMucWoo, seo, an, tonKho } = raw as {
    mau?: unknown
    sanPham?: unknown
    mauMoi?: unknown
    sanPhamMoi?: unknown
    noiDungWoo?: { sanPham?: unknown; mau?: unknown }
    boSuuTapMoi?: unknown
    boSuuTapChu?: unknown
    danhMucWoo?: unknown
    seo?: unknown
    an?: unknown
    tonKho?: { sanPham?: unknown; mau?: unknown }
  }
  const patterns: Record<string, LivePattern> = {}
  for (const [key, value] of Object.entries(mau && typeof mau === 'object' ? mau : {})) {
    const v = (value ?? {}) as Record<string, unknown>
    patterns[key] = { gia: cleanPrices(v.gia), giaChun: cleanPrices(v.giaChun), het: cleanList(v.het) }
  }
  // Hết hàng mẫu có sẵn Ecopillo báo trong Woo khi chưa bật giá Woo (ton-kho.php): gộp vào `het` của mẫu
  for (const [key, value] of Object.entries(tonKho?.mau && typeof tonKho.mau === 'object' ? tonKho.mau : {})) {
    const sizes = cleanList(value)
    if (!sizes?.length || !/^[a-z0-9-]+\/[A-Za-z0-9-]+$/.test(key)) continue
    const current = patterns[key] ?? {}
    patterns[key] = { ...current, het: [...new Set([...(current.het ?? []), ...sizes])] }
  }
  const soldOut: Record<string, readonly string[]> = {}
  for (const [key, value] of Object.entries(tonKho?.sanPham && typeof tonKho.sanPham === 'object' ? tonKho.sanPham : {}).slice(0, 400)) {
    const list = Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string' && x.length <= 80).slice(0, 60) : []
    if (list.length && /^[a-z0-9-]{1,200}$/.test(key)) soldOut[key] = list
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
    danhMuc: cleanCategories(danhMucWoo),
    seo: cleanSeo(seo),
    an: cleanHidden(an),
    hetSanPham: soldOut,
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

/**
 * Thứ tự phối màu Ecopillo đặt ở "Thứ tự menu" của sản phẩm mẫu trong Woo (mau-moi.php, 25/11/2026): "<mã bộ>/<mã mẫu>" → số.
 * Plugin chỉ ghi số khác 0. Không tin mù: chỉ nhận số nguyên, khoá dạng chữ / số / gạch.
 */
const PATTERN_ORDER: ReadonlyMap<string, number> = (() => {
  if (typeof window === 'undefined') return new Map()
  const raw = (window as { __ECO_GIA__?: { thuTuMau?: unknown } }).__ECO_GIA__?.thuTuMau
  if (!raw || typeof raw !== 'object') return new Map()
  return new Map(
    Object.entries(raw as Record<string, unknown>).filter(
      (e): e is [string, number] => /^[a-z0-9-]{1,80}\/[A-Z0-9]{2,10}$/.test(e[0]) && Number.isInteger(e[1]) && e[1] !== 0,
    ),
  )
})()

/** Số "Thứ tự menu" của một mẫu (undefined = chưa đặt, để 0) */
export const livePatternOrder = (collectionId: string, code: string): number | undefined => PATTERN_ORDER.get(`${collectionId}/${code}`)

/** Mẫu mới theo tên trên link (trang /san-pham/<tên>/) */
export const liveNewPatternBySlug = (slug: string): LiveNewPattern | undefined => LIVE.mauMoi.find((p) => p.duongDan === slug)

/** Sản phẩm lẻ mới Ecopillo đăng trong WooCommerce (products.ts ghép vào PRODUCTS) */
export const liveNewProducts = (): readonly LiveNewProduct[] => LIVE.sanPhamMoi

/** Sản phẩm lẻ mới theo tên trên link (trang /san-pham/<tên>/) */
export const liveNewProductBySlug = (slug: string): LiveNewProduct | undefined => LIVE.sanPhamMoi.find((p) => p.duongDan === slug)

/** Danh mục sản phẩm Ecopillo sửa trong Woo (đợt E): chữ trang có sẵn, trang mới, trang đã ẩn / xoá, bài SEO cuối trang */
export const liveCategories = (): LiveCategories => LIVE.danhMuc

/**
 * Bài SEO cuối trang danh mục mà máy chủ đã ghi sẵn vào HTML (trang-wp.php `eco_tw_put_category_seo`):
 * đọc một lần trước khi React gắn vào #root, để trang hiện tức thì không cần gọi mạng thêm trên lần mở đầu.
 */
const INLINE_CATEGORY_SEO: ReadonlyMap<string, string> = (() => {
  if (typeof document === 'undefined') return new Map()
  const map = new Map<string, string>()
  document.querySelectorAll<HTMLElement>('[data-eco-dm-seo]').forEach((el) => {
    const path = el.dataset.ecoDmSeo
    const inner = el.querySelector('.bai-wp')?.innerHTML
    if (path && isPagePath(path) && inner && inner.trim()) map.set(path, inner)
  })
  return map
})()

/** Tên file JSON bài SEO cuối trang danh mục (nếu Ecopillo đã viết cho danh mục này) */
export const liveCategorySeoKey = (path: string): string | undefined => LIVE.danhMuc.baiSeo[path]

/** HTML bài SEO máy chủ đã nhúng sẵn trong trang đầu tiên (nếu trùng đường link đang mở) */
export const liveCategorySeoInline = (path: string): string | undefined => INLINE_CATEGORY_SEO.get(path)

/** Đường dẫn file JSON bài SEO danh mục plugin ghi */
export const liveCategorySeoUrl = (key: string): string => `/wp-content/uploads/ecopillo-du-lieu/danh-muc/${key}.json`

/** Có danh mục nào có bài SEO cuối trang không: trang dựng sẵn khác bản HTML tĩnh, cần vẽ lại thay vì gắn vào */
const hasLiveCategorySeo = (): boolean => Object.keys(LIVE.danhMuc.baiSeo).length > 0 || INLINE_CATEGORY_SEO.size > 0

/** Tiêu đề, mô tả trên Google Ecopillo điền ở danh mục Woo, theo link trang */
export const liveCategorySeo = (): Readonly<Record<string, LiveSeo>> => LIVE.seo

/** Lựa chọn hết hàng của một sản phẩm lẻ có sẵn (đợt F); không có thì còn hàng */
export const liveSoldOut = (slug: string): readonly string[] | undefined => LIVE.hetSanPham[slug]

/** Sản phẩm, mẫu, bộ, bài Ecopillo đã gỡ trong WordPress (đợt E2) */
export const liveHidden = (): LiveHidden => LIVE.an

/** Có gỡ gì không: trang dựng sẵn còn liệt kê thứ đã gỡ, phải vẽ lại thay vì gắn vào */
export const anyLiveHidden = (): boolean =>
  LIVE.an.sanPham.size + LIVE.an.mau.size + LIVE.an.bo.size + LIVE.an.bai.size + Object.keys(LIVE.danhMuc.an).length > 0

/** Có ô giá / hết hàng nào khác bản dựng sẵn không (main.tsx dùng để chọn vẽ lại hay gắn vào HTML có sẵn) */
let differs = false
export const markLiveDiffers = (): void => {
  differs = true
}
export const liveDiffers = (): boolean => differs || anyLiveHidden() || hasLiveCategorySeo()

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
