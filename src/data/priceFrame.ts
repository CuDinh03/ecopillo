import { COLLECTIONS, SIZES, sizeById } from './catalog'
import { collectionPath, HOST_REDIRECTS, LISTINGS, PATHS, patternPath, singleProductPath, withSlash, WOO_CATEGORY_LISTINGS } from './links'
import { ALL_POSTS } from './allPosts'
import { PRODUCTS } from './products'
import { TONES } from './stories'
import { PRODUCT_INFO } from './productInfo'
import { infoToText } from './productInfoText'

/**
 * "Khung giá": danh sách mọi ô giá trên web (mẫu × cỡ, sản phẩm × lựa chọn) kèm sản phẩm WooCommerce tương ứng.
 * tools/dung-san-html.mjs ghi ra dist/khung-gia.json lúc build; tools/dong-goi-plugin.mjs chuyển vào plugin
 * (du-lieu/khung-gia.json, ngoài site/). Plugin dùng nó để đọc giá Ecopillo sửa trong Woo (gia-woo.php) và để nhập
 * giá web vào Woo lần đầu. Kế hoạch: docs/ke-hoach-khach-tu-sua-du-lieu.md.
 *
 * Sản phẩm Woo tìm theo link: link trang web mới, rồi các link cũ 301 sang nó (link cũ có chữ chất liệu cũ vẫn là tên sản phẩm Woo).
 */

export interface FramePattern {
  khoa: string
  ten: string
  duongDan: string
  woo: string[]
  kieu: string
  /** Nhãn cỡ để hiện trong trang đối chiếu */
  nhanCo: Record<string, string>
  gia: Record<string, number>
  giaChun: Record<string, number> | null
}

export interface FrameProduct {
  /** Trang chuyển tới khi Ecopillo gỡ sản phẩm này trong Woo (đợt E2): trang danh mục có nó, không có thì trang Sản phẩm */
  veTrang: string
  khoa: string
  ten: string
  duongDan: string
  woo: string[]
  chon: { id: string; nhan: string; gia: number }[] | null
  bienThe: { co: string[]; doDay: string[]; gia: Record<string, number> } | null
  motGia: number | null
}

/**
 * Bộ sưu tập, để plugin nhận mẫu mới Ecopillo thêm trong WooCommerce (giai đoạn 4): sản phẩm Woo thuộc `danhMucWoo`
 * mà chưa có trong `mau` là mẫu mới của bộ này. `khung`: trang mẫu có sẵn dùng làm khung cho trang mẫu mới.
 */
export interface FrameCollection {
  /** Đường link trang bộ */
  trang: string
  id: string
  ten: string
  kieu: string
  coChun: boolean
  danhMucWoo: string
  khung: string
  maDaCo: string[]
}

/**
 * Danh mục Woo nhận sản phẩm lẻ mới (giai đoạn 4b, plugin san-pham-moi.php): `trang` là trang danh mục web mới,
 * `khung` là trang một sản phẩm lẻ có sẵn dùng làm khung cho trang sản phẩm mới.
 */
export interface FrameCategory {
  woo: string
  trang: string
  khung: string
}

/** Sản phẩm lẻ có sẵn (cả sản phẩm chưa có giá) để plugin lấy tên, ảnh, mô tả Ecopillo đã soát trong Woo (noi-dung-woo.php, đợt B) */
export interface FrameContentProduct {
  khoa: string
  ten: string
  woo: string[]
  /** Phần "Hiểu kỹ trước khi chọn" đang có (productInfoText.ts), điền sẵn vào ô trong trang sửa sản phẩm Woo */
  hieuKy: string
}

/**
 * Bộ sưu tập mới Ecopillo tạo trong Woo (đợt C, plugin bo-suu-tap-moi.php): `khungBo` trang bộ có sẵn cùng kiểu và `khungMau`
 * trang một mẫu của bộ đó, dùng làm trang khung; `gam` các gam màu (thuộc tính "Gam màu" của mẫu ghi tên gam).
 */
export interface FrameNewCollections {
  kieu: Record<'ga-phu' | 'ga-chun' | 'chan-ga' | 'chan-he', { khungBo: string; khungMau: string; nhan: string }>
  gam: { id: string; ten: string }[]
}

export interface PriceFrame {
  mau: FramePattern[]
  sanPham: FrameProduct[]
  noiDung: FrameContentProduct[]
  boMoi: FrameNewCollections
  boSuuTap: FrameCollection[]
  danhMuc: FrameCategory[]
  /**
   * Bài viết lúc dựng (plugin bai-viet-moi.php): `baiViet` tên bài WordPress → ngày sửa (bài sửa sau ngày này là bài đã sửa),
   * `baiTrongCode` bài viết trong code (WordPress không ghi đè), `khungBai` trang một bài có sẵn làm khung cho bài mới.
   */
  baiViet: Record<string, string>
  baiTrongCode: string[]
  khungBai: string
  /** Tên sản phẩm Woo của mọi link cũ /san-pham/… đã 301 (sản phẩm gộp, đổi tên): không bao giờ coi là mẫu mới */
  slugCu: string[]
  /**
   * Trang danh mục có sẵn (plugin danh-muc.php, đợt E): danh mục Woo cùng link là trang này. `boSuuTap`: trang bộ sưu tập
   * (chữ sửa ở khung bộ sưu tập, chỉ có SEO ở khung danh mục). `ten`, `moTa`: chữ đang hiện, để Ecopillo đối chiếu.
   */
  trangDanhMuc: { trang: string; ten: string; moTa: string; boSuuTap: boolean }[]
  /** Trang khung cho trang danh mục mới Ecopillo tạo trong Woo: một trang danh mục nhỏ có sẵn */
  khungDanhMuc: string
  /** Trang Sản phẩm: nơi chuyển tới mặc định khi Ecopillo ẩn / xoá một danh mục */
  trangSanPham: string
  /** Trang Tin tức: nơi chuyển tới khi Ecopillo gỡ một bài viết có sẵn (đợt E2) */
  trangTinTuc: string
}

const slugOf = (path: string): string => path.replace(/\/$/, '').split('/').pop() ?? ''

/** Tên sản phẩm Woo có thể ứng với một trang web mới: chính link đó, rồi link cũ đã 301 sang */
function wooSlugsFor(path: string): string[] {
  const target = withSlash(path)
  const slugs = [slugOf(target)]
  for (const [from, to] of Object.entries(HOST_REDIRECTS)) {
    if (withSlash(to) === target && from.startsWith('/san-pham/')) slugs.push(slugOf(from))
  }
  return [...new Set(slugs.filter(Boolean))]
}

export function buildPriceFrame(): PriceFrame {
  const sizeLabels = Object.fromEntries(SIZES.map((s) => [s.id, `${sizeById(s.id).label} (${s.bed})`]))
  const mau: FramePattern[] = []
  for (const c of COLLECTIONS) {
    for (const p of c.patterns) {
      const path = patternPath(c, p)
      if (!path.startsWith('/san-pham/')) continue // mẫu chưa có trang riêng: không có sản phẩm Woo tương ứng
      mau.push({
        khoa: `${c.id}/${p.code}`,
        ten: `${c.kindLabel} ${c.name} ${p.code} · ${p.colorName}`,
        duongDan: path,
        woo: wooSlugsFor(path),
        kieu: c.kind,
        nhanCo: sizeLabels,
        gia: { ...(p.prices ?? c.prices) },
        giaChun: p.fittedPrices ? { ...p.fittedPrices } : null,
      })
    }
  }
  const sanPham: FrameProduct[] = []
  for (const p of PRODUCTS) {
    if (p.collection || p.isPriceOnCall) continue
    const path = singleProductPath(p.slug)
    const chon = p.choices?.filter((c) => c.price !== undefined).map((c) => ({ id: c.id, nhan: c.label, gia: c.price as number })) ?? null
    const home = Object.entries(LISTINGS).find(([, l]) => l.products?.includes(p.slug))?.[0]
    sanPham.push({
      veTrang: home ?? PATHS.products,
      khoa: p.slug,
      ten: p.name,
      duongDan: path,
      woo: wooSlugsFor(path),
      chon: chon && chon.length ? chon : null,
      bienThe: p.variants ? { co: [...p.variants.sizes], doDay: [...p.variants.thicknesses], gia: { ...p.variants.prices } } : null,
      motGia: !p.choices && !p.variants && p.min > 0 ? p.min : null,
    })
  }
  const boSuuTap: FrameCollection[] = COLLECTIONS.flatMap((c) => {
    const shell = c.patterns.map((p) => patternPath(c, p)).find((path) => path.startsWith('/san-pham/'))
    const category = slugOf(collectionPath(c))
    if (!shell || !collectionPath(c).startsWith('/danh-muc-san-pham/')) return []
    return [{ trang: collectionPath(c), id: c.id, ten: c.name, kieu: c.kind, coChun: !!c.hasFittedOption, danhMucWoo: category, khung: shell, maDaCo: c.patterns.map((p) => p.code) }]
  })
  const slugCu = Object.keys(HOST_REDIRECTS)
    .filter((from) => from.startsWith('/san-pham/'))
    .map(slugOf)
  // Khung trang sản phẩm mới: sản phẩm lẻ đầu tiên có trang riêng trong danh mục đó (mọi trang sản phẩm lẻ cùng bố cục)
  const fallback = singleProductPath(PRODUCTS.find((p) => !p.collection)?.slug ?? '')
  const danhMuc: FrameCategory[] = Object.entries(WOO_CATEGORY_LISTINGS).map(([woo, trang]) => {
    const listing = LISTINGS[trang]
    const single = (slug: string) => PRODUCTS.some((p) => p.slug === slug && !p.collection)
    const first = listing?.products?.find(single) ?? PRODUCTS.find((p) => !p.collection && p.category === listing?.category)?.slug
    return { woo, trang, khung: first ? singleProductPath(first) : fallback }
  })
  const wordpress = ALL_POSTS.filter((p) => p.wp)
  const baiViet = Object.fromEntries(wordpress.map((p) => [p.slug, p.wp?.modified ?? '']))
  const baiTrongCode = ALL_POSTS.filter((p) => !p.wp).map((p) => p.slug)
  const khungBai = wordpress[0] ? `/${wordpress[0].slug}/` : ''
  const noiDung: FrameContentProduct[] = PRODUCTS.filter((p) => !p.collection).map((p) => ({
    khoa: p.slug,
    ten: p.name,
    woo: wooSlugsFor(singleProductPath(p.slug)),
    hieuKy: infoToText(PRODUCT_INFO[p.slug]?.sections ?? []),
  }))
  const shellOf = (kind: 'ga-phu' | 'ga-chun' | 'chan-ga' | 'chan-he', label: string) => {
    const col = boSuuTap.find((c) => c.kieu === kind) ?? boSuuTap[0]
    return { khungBo: col?.trang ?? '', khungMau: col?.khung ?? '', nhan: label }
  }
  const boMoi: FrameNewCollections = {
    kieu: {
      'ga-phu': shellOf('ga-phu', 'Bộ ga phủ'),
      'ga-chun': shellOf('ga-chun', 'Bộ ga chun'),
      'chan-ga': shellOf('chan-ga', 'Bộ chăn ga gối'),
      'chan-he': shellOf('chan-he', 'Chăn hè'),
    },
    gam: TONES.map((t) => ({ id: t.id, ten: t.label })),
  }
  const trangDanhMuc = [
    ...Object.entries(LISTINGS).map(([trang, l]) => ({ trang, ten: l.title, moTa: l.description, boSuuTap: false })),
    ...COLLECTIONS.filter((c) => collectionPath(c).startsWith('/danh-muc-san-pham/')).map((c) => ({
      trang: collectionPath(c),
      ten: c.name,
      moTa: c.metaDescription ?? '',
      boSuuTap: true,
    })),
  ]
  const khungDanhMuc = Object.keys(LISTINGS).find((path) => LISTINGS[path]?.products?.length) ?? ''
  return { mau, sanPham, noiDung, boMoi, boSuuTap, danhMuc, baiViet, baiTrongCode, khungBai, slugCu, trangDanhMuc, khungDanhMuc, trangSanPham: PATHS.products, trangTinTuc: PATHS.blog }
}
