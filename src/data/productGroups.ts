import { slugify } from '../lib/slug'
import { patternImage, productImage, type ImageSource } from './catalog'
import { LISTINGS } from './links'
import { liveList, liveObject, rowKey, type EditableField, type EditableSet } from './liveContent'
import { anh, chu, legacyPageText, type PageImage } from './pageText/define'

/**
 * Nhóm sản phẩm lớn của trang Sản phẩm (nút lọc, ô nhóm, kệ, ?danh-muc=…, nhãn nhỏ trên thẻ, đường dẫn trang sản phẩm).
 * Ecopillo thêm, đổi tên, đổi thứ tự, ẩn, xoá nhóm ở Nội dung web → Sản phẩm → "Nhóm sản phẩm" (owner 24/11/2026: khách sửa,
 * thêm, xoá được mọi thứ). Trước 24/11/2026 bốn nhóm cố định trong code: tên, ảnh ô ở bộ chữ "Sản phẩm: tên nhóm, giá",
 * thứ tự ở bộ "Kệ trang Sản phẩm" (ô Kệ thứ 1…4); phần Ecopillo đã lưu ở hai ô cũ đó là dữ liệu ban đầu của bộ này.
 *
 * - Bốn nhóm có sẵn (mã bo-chan-ga, chan, goi, dem) giữ cách chạy riêng: bộ chăn ga có phối màu, chọn bộ sưu tập; đệm có độ dày…;
 *   mã của chúng nằm trên link cũ (?danh-muc=dem, LEGACY_CATEGORY trong products.ts) nên không đổi. Đổi tên, thứ tự, ẩn được.
 *   Xoá dòng nhóm có sẵn = ẩn nhóm đó; thêm lại dòng cùng tên thì có lại đúng mã cũ.
 * - Nhóm mới chạy như sản phẩm lẻ: lọc theo mức giá (mốc giá "khi xem Tất cả"), có ô nhóm, kệ, nút lọc, link ?danh-muc=<mã>.
 *   Mã của nhóm mới: plugin lấy theo tên lúc lưu lần đầu (noi-dung-quan-tri.php, cờ khoaDongTheoTieuDe), đổi tên sau không đổi mã.
 * - Sản phẩm vào nhóm: tích ở ô "Sản phẩm" (cả sản phẩm lẻ mới đăng trong Woo), hoặc chọn trang danh mục ở ô "Trang danh mục":
 *   mọi sản phẩm lẻ của trang đó, kể cả sản phẩm Ecopillo đăng sau trong Woo ở danh mục đó, vào nhóm. Sản phẩm không được nhóm nào
 *   nhận ở lại nhóm gốc của nó (products.ts). Một sản phẩm ở hai nhóm: ô "Sản phẩm" thắng ô "Trang danh mục", rồi nhóm đứng trước thắng.
 *
 * File này không nhập products.ts (products.ts nhập file này để gán nhóm cho sản phẩm): danh sách sản phẩm để chọn truyền vào.
 */

export const BUILTIN_CATEGORY_IDS = ['bo-chan-ga', 'chan', 'goi', 'dem'] as const
export type BuiltinCategoryId = (typeof BUILTIN_CATEGORY_IDS)[number]

export const isBuiltinCategory = (id: string): id is BuiltinCategoryId => (BUILTIN_CATEGORY_IDS as readonly string[]).includes(id)

export interface ProductGroup {
  /** Mã trên link ?danh-muc=… */
  id: string
  label: string
  /** Tên ngắn trong nút "Chỉ xem …" ở đầu kệ */
  shortLabel: string
  /** Dòng nhỏ dưới tên trên ô nhóm; không có thì ghi giá thấp nhất */
  note?: string
  /** Ảnh ô nhóm; không có thì ảnh sản phẩm đầu tiên của nhóm */
  image?: ImageSource
  /** Ẩn: không có nút lọc, ô nhóm, kệ; sản phẩm của nhóm không hiện ở trang Sản phẩm (trang riêng vẫn còn) */
  hidden: boolean
  builtin: boolean
  /** Sản phẩm Ecopillo tích vào nhóm, theo thứ tự tích (cũng là thứ tự trên kệ của nhóm mới) */
  products: readonly string[]
  /** Trang danh mục Ecopillo chọn: sản phẩm lẻ của các trang này vào nhóm */
  listings: readonly string[]
}

/** Một dòng như lưu trong WordPress */
interface GroupRow {
  ma: string
  ten: string
  hien: string
  tenNgan?: string
  ghiChu?: string
  anh?: PageImage
  sanPham?: readonly string[]
  danhMuc?: readonly string[]
}

/** Thứ tự gốc: thứ tự kệ đã duyệt (đệm ngay sau bộ chăn ga, khách: "phần đệm tìm mãi mới thấy") */
const BASE_ORDER: readonly BuiltinCategoryId[] = ['bo-chan-ga', 'dem', 'chan', 'goi']

/** Tên, ảnh gốc bốn nhóm (trước ở pageText/productLabels.ts) */
const BASE_TEXT: Readonly<Record<BuiltinCategoryId, { ten: string; tenNgan: string; anh: PageImage }>> = {
  'bo-chan-ga': { ten: 'Bộ chăn ga', tenNgan: 'bộ chăn ga', anh: patternImage('ED25', 'Bộ chăn ga') },
  dem: { ten: 'Đệm & topper', tenNgan: 'đệm', anh: productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', 'Đệm & topper') },
  chan: { ten: 'Chăn', tenNgan: 'chăn', anh: productImage('chan-long-vu-tu-nhien', 'Chăn') },
  goi: { ten: 'Gối', tenNgan: 'gối', anh: productImage('ruot-goi-long-vu-tu-nhien', 'Gối') },
}

/** Phần Ecopillo đã sửa ở các ô cũ của bộ chữ "Sản phẩm: tên nhóm, giá" (giữ tới khi Ecopillo lưu bộ Nhóm sản phẩm) */
const LEGACY_TEXT = legacyPageText('nhan-san-pham', {
  nhomBoChanGa: chu('', BASE_TEXT['bo-chan-ga'].ten),
  nhomChan: chu('', BASE_TEXT.chan.ten),
  nhomGoi: chu('', BASE_TEXT.goi.ten),
  nhomDem: chu('', BASE_TEXT.dem.ten),
  tenNganChan: chu('', BASE_TEXT.chan.tenNgan),
  tenNganGoi: chu('', BASE_TEXT.goi.tenNgan),
  tenNganDem: chu('', BASE_TEXT.dem.tenNgan),
  anhNhomBoChanGa: anh('', BASE_TEXT['bo-chan-ga'].anh),
  anhNhomDem: anh('', BASE_TEXT.dem.anh),
  anhNhomChan: anh('', BASE_TEXT.chan.anh),
  anhNhomGoi: anh('', BASE_TEXT.goi.anh),
})

const LEGACY_ROW_TEXT: Readonly<Record<BuiltinCategoryId, { ten: string; tenNgan: string; anh: PageImage }>> = {
  'bo-chan-ga': { ten: LEGACY_TEXT.nhomBoChanGa, tenNgan: BASE_TEXT['bo-chan-ga'].tenNgan, anh: LEGACY_TEXT.anhNhomBoChanGa },
  dem: { ten: LEGACY_TEXT.nhomDem, tenNgan: LEGACY_TEXT.tenNganDem, anh: LEGACY_TEXT.anhNhomDem },
  chan: { ten: LEGACY_TEXT.nhomChan, tenNgan: LEGACY_TEXT.tenNganChan, anh: LEGACY_TEXT.anhNhomChan },
  goi: { ten: LEGACY_TEXT.nhomGoi, tenNgan: LEGACY_TEXT.tenNganGoi, anh: LEGACY_TEXT.anhNhomGoi },
}

/** Thứ tự Ecopillo đã chọn ở các ô cũ "Kệ thứ 1…4" của bộ "Kệ trang Sản phẩm" (productShelves.ts) */
const LEGACY_ORDER: readonly BuiltinCategoryId[] = (() => {
  const keys = ['ke1', 'ke2', 'ke3', 'ke4'] as const
  const base = Object.fromEntries(keys.map((k, i) => [k, BASE_ORDER[i]])) as Record<(typeof keys)[number], string>
  const fields: EditableField[] = keys.map((khoa) => ({ khoa, nhan: khoa, kieu: 'chon', batBuoc: true, luaChon: BASE_ORDER }))
  const saved = liveObject('ke-san-pham', base, fields)
  return [...new Set([...keys.map((k) => saved[k]).filter(isBuiltinCategory), ...BASE_ORDER])]
})()

const rowOf = (id: BuiltinCategoryId, text: { ten: string; tenNgan: string; anh: PageImage }): GroupRow => ({
  ma: id,
  ten: text.ten,
  hien: 'hien',
  tenNgan: text.tenNgan,
  anh: text.anh,
})

/** Dòng gốc trong màn hình sửa */
const BASE_ROWS: readonly GroupRow[] = BASE_ORDER.map((id) => rowOf(id, BASE_TEXT[id]))
/** Dòng web dùng khi Ecopillo chưa lưu bộ này: tên, ảnh, thứ tự đã sửa ở các ô cũ */
const LEGACY_ROWS: readonly GroupRow[] = LEGACY_ORDER.map((id) => rowOf(id, LEGACY_ROW_TEXT[id]))

/** Trang danh mục chọn được lúc dựng: trang có sản phẩm lẻ (trang Bộ ga phủ chỉ có bộ chăn ga, bỏ) */
const LISTING_CHOICES: readonly string[] = Object.entries(LISTINGS)
  .filter(([, l]) => !l.collections?.length)
  .map(([path]) => path)

export const PRODUCT_GROUPS_KEY = 'nhom-san-pham'

const fieldsOf = (products: readonly { slug: string; name: string }[]): readonly EditableField[] => [
  {
    khoa: 'ten',
    nhan: 'Tên nhóm',
    kieu: 'chu',
    batBuoc: true,
    goiY:
      'Hiện ở nút lọc, ô nhóm, tên kệ, nhãn nhỏ trên thẻ sản phẩm và đường dẫn trang sản phẩm. Link của nhóm mới: /danh-muc-san-pham/san-pham/?danh-muc= và tên nhóm viết không dấu, nối bằng gạch (lấy lúc lưu lần đầu, đổi tên sau không đổi link).',
  },
  {
    khoa: 'hien',
    nhan: 'Hiện trên web',
    kieu: 'chon',
    batBuoc: true,
    luaChon: ['hien', 'an'],
    nhanLuaChon: ['Hiện', 'Ẩn'],
    goiY:
      'Ẩn (hoặc xoá dòng): nút lọc, ô nhóm, kệ của nhóm không hiện, sản phẩm của nhóm không hiện ở trang Sản phẩm; trang riêng của từng sản phẩm, trang danh mục nhỏ, ô tìm vẫn còn. Link lọc theo nhóm đã ẩn mở trang Sản phẩm (Tất cả). Ẩn hết mọi nhóm thì web vẫn hiện 4 nhóm gốc.',
  },
  { khoa: 'tenNgan', nhan: 'Tên ngắn trong nút "Chỉ xem …" ở đầu kệ', kieu: 'chu', goiY: 'Để trống: dùng tên nhóm viết thường.' },
  { khoa: 'ghiChu', nhan: 'Dòng nhỏ dưới tên trên ô nhóm', kieu: 'chu', goiY: 'Để trống: ghi giá thấp nhất của nhóm ("từ …").' },
  { khoa: 'anh', nhan: 'Ảnh ô nhóm (đầu trang Sản phẩm)', kieu: 'anh', goiY: 'Để trống: ảnh sản phẩm đầu tiên của nhóm.' },
  {
    khoa: 'sanPham',
    nhan: 'Sản phẩm đưa vào nhóm này',
    kieu: 'chon-nhieu',
    luaChon: products.map((p) => p.slug),
    nhanLuaChon: products.map((p) => p.name),
    // Sản phẩm lẻ Ecopillo đăng mới trong Woo sau lần dựng cũng tích được (đợt G)
    luaChonThem: [{ nguon: 'san-pham' }],
    goiY:
      'Sản phẩm tích ở đây chuyển sang nhóm này (khỏi nhóm cũ), xếp đầu kệ theo thứ tự tích. Bốn nhóm có sẵn để trống là giữ sản phẩm như cũ. Bộ chăn ga luôn ở nhóm của nó.',
  },
  {
    khoa: 'danhMuc',
    nhan: 'Trang danh mục đưa vào nhóm này',
    kieu: 'chon-nhieu',
    luaChon: LISTING_CHOICES,
    nhanLuaChon: LISTING_CHOICES.map((path) => `Trang danh mục: ${LISTINGS[path]?.title ?? path}`),
    luaChonThem: [{ nguon: 'danh-muc' }],
    goiY:
      'Mọi sản phẩm lẻ của trang danh mục đã chọn vào nhóm này, kể cả sản phẩm đăng sau trong WooCommerce ở danh mục đó. Cách cho nhóm mới tự nhận sản phẩm mới: tạo danh mục trong Sản phẩm → Danh mục, tích "Hiện thành trang danh mục", rồi chọn trang đó ở đây.',
  },
]

/** Bộ sửa được; `products`: sản phẩm lẻ có trong code (danh sách lựa chọn của ô Sản phẩm) */
export const productGroupSet = (products: readonly { slug: string; name: string }[]): EditableSet => ({
  khoa: PRODUCT_GROUPS_KEY,
  nhom: 'Sản phẩm',
  ten: 'Nhóm sản phẩm',
  moTa:
    'Các nhóm lớn của trang Sản phẩm (Bộ chăn ga, Đệm & topper, Chăn, Gối…): tên, thứ tự, ảnh ô nhóm, ẩn / hiện. Thêm nhóm mới (ví dụ "Đồ cho bé") và chọn sản phẩm cho nó. ' +
    'Thứ tự ở đây là thứ tự nút lọc, ô nhóm và kệ. Thứ tự sản phẩm trên kệ 4 nhóm có sẵn: bộ "Kệ trang Sản phẩm: thứ tự". Nhóm mới lọc theo mốc giá "Mức giá khi xem Tất cả".',
  kieu: 'nhieu',
  goc: BASE_ROWS,
  truong: fieldsOf(products),
  tieuDeDong: 'ten',
  khoaDong: 'ma',
  khoaDongTheoTieuDe: true,
})

const EMPTY_ROW: GroupRow = { ma: '', ten: '', hien: '' }

/** Mã của một dòng: mã đã lưu, chưa có thì theo tên (giống sanitize_title của plugin) */
export const groupIdOf = (row: { ma?: unknown; ten?: unknown }, index: number): string =>
  rowKey(row.ma) || slugify(typeof row.ten === 'string' ? row.ten : '') || `nhom-${index + 1}`

const groupOf = (row: GroupRow, id: string): ProductGroup => {
  const builtin = isBuiltinCategory(id)
  const shortLabel = row.tenNgan || row.ten.toLowerCase()
  return {
    id,
    label: row.ten,
    shortLabel,
    ...(row.ghiChu ? { note: row.ghiChu } : {}),
    ...(row.anh ? { image: { ...row.anh, alt: row.anh.alt || row.ten } } : {}),
    hidden: row.hien === 'an',
    builtin,
    products: row.sanPham ?? [],
    listings: row.danhMuc ?? [],
  }
}

/**
 * Mọi nhóm theo thứ tự Ecopillo xếp, cả nhóm ẩn. Nhóm có sẵn Ecopillo đã xoá dòng thì thêm cuối, ở dạng ẩn
 * (sản phẩm của nó vẫn cần tên nhóm cho nhãn, đường dẫn).
 */
export function readProductGroups(set: EditableSet): readonly ProductGroup[] {
  // Mã không phải ô sửa (ô mã ẩn), nên dòng mới mang mã đã lưu qua dòng mẫu
  const rows = liveList<GroupRow>(
    set.khoa,
    LEGACY_ROWS,
    set.truong,
    (_i, row) => LEGACY_ROWS.find((r) => rowKey(r.ma) === rowKey(row.ma)) ?? { ...EMPTY_ROW, ma: rowKey(row.ma) },
  )
  const used = new Set<string>()
  const groups = rows.map((row, i) => {
    const wanted = groupIdOf(row, i)
    let id = wanted
    for (let n = 2; used.has(id); n += 1) id = `${wanted}-${n}`
    used.add(id)
    return groupOf(row, id)
  })
  const missing = BUILTIN_CATEGORY_IDS.filter((id) => !used.has(id)).map((id) => ({ ...groupOf(rowOf(id, LEGACY_ROW_TEXT[id]), id), hidden: true }))
  return [...groups, ...missing]
}

/** Sản phẩm (dạng tối thiểu) để gán nhóm */
export interface GroupMember {
  slug: string
  category: string
  listings?: readonly string[]
  /** Bộ chăn ga, chăn hè: luôn ở nhóm gốc (phối màu, chọn bộ đi theo nhóm) */
  isCollection: boolean
}

/** Sản phẩm có thuộc trang danh mục không: sản phẩm ghi ở trang, sản phẩm mới đăng ở danh mục Woo đó, hoặc trang theo cả một nhóm gốc */
const inListing = (p: GroupMember, path: string): boolean => {
  if (p.listings?.includes(path)) return true
  const listing = LISTINGS[path]
  if (!listing || listing.collections?.length) return false
  if (listing.products) return listing.products.includes(p.slug)
  return !!listing.category && listing.category === p.category
}

/** Nhóm Ecopillo chọn cho một sản phẩm; undefined = giữ nhóm gốc */
export function assignedGroup(p: GroupMember, groups: readonly ProductGroup[]): string | undefined {
  if (p.isCollection) return undefined
  return groups.find((g) => g.products.includes(p.slug))?.id ?? groups.find((g) => g.listings.some((path) => inListing(p, path)))?.id
}
