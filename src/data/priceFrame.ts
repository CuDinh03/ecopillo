import { COLLECTIONS, SIZES, sizeById } from './catalog'
import { collectionPath, HOST_REDIRECTS, LISTINGS, patternPath, singleProductPath, withSlash, WOO_CATEGORY_LISTINGS } from './links'
import { ALL_POSTS } from './allPosts'
import { PRODUCTS } from './products'

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
}

export interface PriceFrame {
  mau: FramePattern[]
  sanPham: FrameProduct[]
  noiDung: FrameContentProduct[]
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
    sanPham.push({
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
    return [{ id: c.id, ten: c.name, kieu: c.kind, coChun: !!c.hasFittedOption, danhMucWoo: category, khung: shell, maDaCo: c.patterns.map((p) => p.code) }]
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
  }))
  return { mau, sanPham, noiDung, boSuuTap, danhMuc, baiViet, baiTrongCode, khungBai, slugCu }
}
