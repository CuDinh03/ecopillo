import { COLLECTIONS, SIZES, sizeById } from './catalog'
import { collectionPath, HOST_REDIRECTS, patternPath, singleProductPath, withSlash } from './links'
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

export interface PriceFrame {
  mau: FramePattern[]
  sanPham: FrameProduct[]
  boSuuTap: FrameCollection[]
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
  return { mau, sanPham, boSuuTap, slugCu }
}
