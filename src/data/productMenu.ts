import {
  ALL_COLLECTIONS,
  BEDDING_SETS,
  collectionById,
  patternImage,
  productImage,
  type Collection,
  type ImageSource,
} from './catalog'
import { HOTEL_PHOTOS } from './hotel'
import { collectionPathById, hiddenPageTarget, isListingShown, LISTINGS, PATHS, singleProductPath } from './links'
import { listingOf } from './listingProducts'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import { anh, chu, definePageText } from './pageText/define'
import { lienKet } from './pageText/linkField'
import { hasPrice, PRICE_ON_CALL_LABEL, PRODUCTS, productBySlug, type Product } from './products'

/**
 * Ô xổ "Sản phẩm" trên thanh đầu trang.
 * Góp ý 04/11 mục 3, 13 (owner chọn B 05/11) → phản hồi 05/11 mục 10 (phương án A trong
 * docs/de-xuat-menu-lien-he-05-11.html): năm nhóm theo thứ tự anh Quang ghi.
 * Không ghi số mẫu, số bộ (khách 05/11: "đừng cho số lượng vào").
 * [XÁC NHẬN còn mục nào sau Sản phẩm khách sạn] — tin nhắn bị cắt; dừng ở năm nhóm đã ghi.
 * [XÁC NHẬN Divan / Bảo vệ đệm giữ trong Đệm] — mẫu đặt ở nhóm Đệm.
 * Eco Ceno (web cũ có) chưa đưa vào: [XÁC NHẬN Ecopillo còn bán Eco Ceno không].
 */

export interface MenuRow {
  label: string
  to: string
  min: number
  /** Có giá cao hơn (theo kích thước, độ dày, mẫu) thì ghi "từ …" */
  isFromPrice: boolean
  /**
   * Chữ giá thay cho số (khi một bộ chưa có giá ga chun chần).
   * Khi có thì ProductMenu hiện nguyên chữ này, không format VND.
   */
  priceLabel?: string
}

/** Nhóm con trong một cột (ga phủ / ga phủ và chun chần / ga chun) */
export interface MenuSection {
  title: string
  /** Ghi chú ngắn dưới tiêu đề (không phải link) */
  note?: string
  rows: readonly MenuRow[]
}

export interface MenuGroup {
  id: string
  title: string
  to: string
  image: ImageSource
  min: number
  /** Dòng phẳng (Đệm, Đồ ruột…); bỏ trống nếu dùng sections */
  rows: readonly MenuRow[]
  /** Nhóm con trong cột Bộ chăn ga */
  sections?: readonly MenuSection[]
}

const productOf = (slug: string): Product => {
  const p = productBySlug(slug)
  if (!p) throw new Error(`productMenu: thiếu sản phẩm ${slug}`)
  return p
}

/** Sản phẩm của một trang danh mục web cũ (LISTINGS): theo danh sách riêng, hoặc cả nhóm */
const listingProducts = (path: string): readonly Product[] => {
  const listing = listingOf(path)
  if (!listing) throw new Error(`productMenu: thiếu danh mục ${path}`)
  // Sản phẩm Ecopillo đăng mới trong Woo ở danh mục này (giai đoạn 4b)
  const added = PRODUCTS.filter((p) => p.listings?.includes(path))
  // Bỏ qua khoá không còn sản phẩm (dữ liệu sửa trong WordPress không được làm hỏng menu)
  if (listing.products) return [...listing.products.flatMap((slug) => productBySlug(slug) ?? []), ...added.filter((p) => !listing.products?.includes(p.slug))]
  if (listing.collections) return listing.collections.map(productOf)
  return PRODUCTS.filter((p) => p.category === listing.category)
}


/** Giá của dòng tính trên sản phẩm đã có giá; cả dòng chưa có giá thì ghi chữ thay số */
const rowOf = (label: string, to: string, products: readonly Product[]): MenuRow => {
  const priced = products.filter(hasPrice)
  if (!priced.length) return { label, to, min: 0, isFromPrice: false, priceLabel: PRICE_ON_CALL_LABEL.toLowerCase() }
  const min = Math.min(...priced.map((p) => p.min))
  const max = Math.max(...priced.map((p) => p.max))
  // Có sản phẩm chưa có giá trong dòng thì cũng ghi "từ …"
  return { label, to, min, isFromPrice: max > min || priced.length < products.length }
}

const productRow = (slug: string, label?: string): MenuRow => {
  const p = productOf(slug)
  return rowOf(label ?? p.name, p.collection ? collectionPathById(slug) : singleProductPath(slug), [p])
}

const collectionRow = (id: string): MenuRow => productRow(id, collectionById(id)?.name)

/** Giá thấp nhất ga chun chần của một bộ (mẫu có fittedPrices). Không có giá → undefined */
const fittedMinOf = (collection: Collection): number | undefined => {
  const values = collection.patterns.flatMap((p) =>
    p.fittedPrices ? Object.values(p.fittedPrices) : [],
  )
  return values.length ? Math.min(...values) : undefined
}

/** Dòng ga chun chần: cùng link bộ sưu tập (chọn kiểu ga ở bước đặt). Bộ chưa có giá thì ghi chữ thay số. */
const fittedRow = (id: string): MenuRow => {
  const collection = collectionById(id)
  if (!collection) throw new Error(`productMenu: thiếu bộ ${id}`)
  const min = fittedMinOf(collection)
  return {
    label: collection.name,
    to: collectionPathById(id),
    min: min ?? 0,
    isFromPrice: min != null,
    // Vera đã có giá từ bảng giá 2026 (khách gửi 08/11/2026); giữ nhánh này cho bộ mới chưa có giá
    ...(min == null ? { priceLabel: PRICE_ON_CALL_LABEL.toLowerCase() } : {}),
  }
}

const groupMin = (rows: readonly MenuRow[]): number => {
  const priced = rows.filter((r) => r.priceLabel == null && r.min > 0).map((r) => r.min)
  return priced.length ? Math.min(...priced) : 0
}

/** Dòng trỏ tới trang Ecopillo đã gỡ trong WordPress (sản phẩm, bộ, danh mục: đợt E, E2) thì bỏ */
const shownRow = (row: MenuRow): boolean => !hiddenPageTarget(row.to)

const group = (g: Omit<MenuGroup, 'min'>): MenuGroup => {
  const rows = g.rows.filter(shownRow)
  const sections = g.sections?.map((s) => ({ ...s, rows: s.rows.filter(shownRow) })).filter((s) => s.rows.length > 0)
  const allRows = sections?.length ? sections.flatMap((s) => s.rows) : rows
  return { ...g, rows, ...(g.sections ? { sections } : {}), min: groupMin(allRows) }
}

const DEM_PATH = '/danh-muc-san-pham/dem-ecopillo/'
const GA_PHU_PATH = '/danh-muc-san-pham/san-pham/bo-ga-phu/'
const RUOT_PATH = '/danh-muc-san-pham/san-pham/ruot-chan-goi/'
const CHAN_HE_PATH = '/danh-muc-san-pham/san-pham/chan-he/'

/** Thứ tự ga phủ gốc: cao cấp trước (Doris → Sweet → Liora → Rosa → Tera → Vera), khớp mục 8. Ecopillo đổi ở Nội dung web */
const GA_PHU_ORDER: readonly string[] = [
  'eco-doris',
  'eco-sweet',
  'eco-liora',
  'eco-rosa',
  'eco-tera',
  'eco-vera',
]

/** Bộ có tuỳ chọn ga chun chần (Rosa, Tera, Vera; mục 28). Ecopillo đổi ở Nội dung web */
const GA_CHUN_CHAN_ORDER: readonly string[] = ['eco-rosa', 'eco-tera', 'eco-vera']


/* ---------------------------------------------------------------- Dòng Ecopillo tự sửa (Nội dung web) */

/**
 * Ba nhóm Ecopillo tự sửa dòng (owner 18/11/2026: "cho tự sửa", sau góp ý chị Phương chuyển ruột chăn khỏi nhóm Chăn).
 * Các bộ của nhóm Bộ chăn ga (giá ga chun chần tính riêng) sửa ở bộ riêng (PRODUCT_MENU_SETS_SET), dòng Sản phẩm khách sạn ở MENU_TEXT.
 */
const EDITABLE_GROUPS = [
  { id: 'dem', title: 'Đệm Ecopillo' },
  { id: 'do-ruot', title: 'Đồ ruột' },
  { id: 'chan', title: 'Chăn đông và chăn hè' },
] as const

type EditableGroupId = (typeof EDITABLE_GROUPS)[number]['id']

/** Một dòng như lưu trong WordPress: trang là "danh-muc:<link>" hoặc "san-pham:<khoá>" */
interface MenuRowInput {
  nhom: EditableGroupId
  ten: string
  trang: string
}

const listingTarget = (path: string): string => `danh-muc:${path}`
const productTarget = (slug: string): string => `san-pham:${slug}`

/** Trang mở khi bấm: mọi trang danh mục nhỏ, mọi sản phẩm lẻ (cả chăn hè Lyocell) */
const TARGETS: readonly { value: string; label: string }[] = [
  ...Object.entries(LISTINGS).map(([path, l]) => ({ value: listingTarget(path), label: `Trang danh mục: ${l.title}` })),
  ...PRODUCTS.filter((p) => p.category !== 'bo-chan-ga').map((p) => ({ value: productTarget(p.slug), label: `Sản phẩm: ${p.name}` })),
]

const MENU_ROW_FIELDS: readonly EditableField[] = [
  {
    khoa: 'nhom',
    nhan: 'Nhóm',
    kieu: 'chon',
    batBuoc: true,
    luaChon: EDITABLE_GROUPS.map((g) => g.id),
    nhanLuaChon: EDITABLE_GROUPS.map((g) => g.title),
  },
  { khoa: 'ten', nhan: 'Chữ hiện trên menu', kieu: 'chu', batBuoc: true },
  {
    khoa: 'trang',
    nhan: 'Bấm vào thì mở',
    kieu: 'chon',
    batBuoc: true,
    luaChon: TARGETS.map((t) => t.value),
    nhanLuaChon: TARGETS.map((t) => t.label),
    goiY: 'Giá "từ …" tự tính theo sản phẩm của trang đó. Sản phẩm trong trang danh mục chọn ở mục "Sản phẩm trong trang danh mục".',
  },
]

const DEM_LISTING = (slug: string, ten: string): MenuRowInput => ({ nhom: 'dem', ten, trang: listingTarget(`/danh-muc-san-pham/san-pham/${slug}/`) })
const ROW = (nhom: EditableGroupId, slug: string, ten: string): MenuRowInput => ({ nhom, ten, trang: productTarget(slug) })

const BASE_MENU_ROWS: readonly MenuRowInput[] = [
  DEM_LISTING('dem-lo-xo', 'Đệm lò xo'),
  DEM_LISTING('dem-cao-su', 'Đệm cao su'),
  DEM_LISTING('dem-bong-ep', 'Đệm bông ép'),
  DEM_LISTING('dem-foam', 'Đệm foam'),
  ROW('dem', 'topper-micro-fiber', 'Topper'),
  ROW('dem', 'divan-ecopillo', 'Divan'),
  ROW('dem', 'bao-ve-dem-chong-tham', 'Bảo vệ đệm'),
  // Chị Phương 18/11/2026: trên là ruột gối (cả gối ôm, gối tựa, trẻ em), dưới là ruột chăn
  { nhom: 'do-ruot', ten: 'Ruột gối', trang: listingTarget('/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/') },
  { nhom: 'do-ruot', ten: 'Ruột chăn', trang: listingTarget(RUOT_PATH) },
  // Chị Phương 18/11/2026: "mục này chỉ có những cái c đánh dấu" (Chăn đông Micro Fiber, Ruột chăn Micro Plus sang Ruột chăn)
  ROW('chan', 'chan-dong-kieu-han', 'Chăn đông kiểu Hàn cao cấp'),
  ROW('chan', 'chan-to-tam', 'Chăn tơ tằm'),
  ROW('chan', 'chan-long-vu-tu-nhien', 'Chăn lông vũ tự nhiên'),
  ROW('chan', 'chan-he-lyocell', 'Chăn hè Lyocell'),
  // Chị Phương 11/11/2026: "thiếu chăn Ecool"
  ROW('chan', 'chan-he-e-cool', 'Chăn hè E-Cool'),
]

export const PRODUCT_MENU_SET: EditableSet = {
  khoa: 'menu-san-pham',
  nhom: 'Sản phẩm',
  ten: 'Ô xổ "Sản phẩm" trên thanh đầu trang',
  moTa:
    'Các dòng của ba nhóm Đệm Ecopillo, Đồ ruột, Chăn đông và chăn hè (cả trên điện thoại). Đổi chữ, đổi trang mở khi bấm, chuyển dòng sang nhóm khác, thêm, xoá, đổi thứ tự. ' +
    'Đệm, ruột gối, chăn đăng mới trong WooCommerce tự thêm cuối nhóm của nó (trừ khi đã có dòng trỏ tới trang danh mục chứa nó). Các bộ trong nhóm Bộ chăn ga sửa ở mục riêng; dòng Sản phẩm khách sạn ở mục tên nhóm, ảnh, link cuối.',
  kieu: 'nhieu',
  goc: BASE_MENU_ROWS,
  truong: MENU_ROW_FIELDS,
  tieuDeDong: 'ten',
}

// Dòng mẫu để trống mọi ô: dòng lưu thiếu hoặc sai ô bắt buộc (nhóm lạ, trang trống) thì bị bỏ, không rơi vào nhóm nào
const EMPTY_ROW = { nhom: '', ten: '', trang: '' } as unknown as MenuRowInput
const MENU_ROWS = liveList<MenuRowInput>(PRODUCT_MENU_SET.khoa, BASE_MENU_ROWS, MENU_ROW_FIELDS, () => EMPTY_ROW)

/** Một dòng đã lưu → dòng menu; trang không còn (sản phẩm đã bỏ) thì bỏ dòng, không làm hỏng menu */
const menuRowOf = (input: MenuRowInput): MenuRow | undefined => {
  const [kind, key] = [input.trang.slice(0, input.trang.indexOf(':')), input.trang.slice(input.trang.indexOf(':') + 1)]
  // Trang danh mục Ecopillo đã ẩn / xoá trong Woo: bỏ dòng (đợt E)
  if (kind === 'danh-muc' && LISTINGS[key] && isListingShown(key)) {
    const products = listingProducts(key)
    return products.length ? rowOf(input.ten, key, products) : undefined
  }
  if (kind === 'san-pham' && productBySlug(key)) return productRow(key, input.ten)
  return undefined
}

/** Chăn Ecopillo đăng mới trong Woo, chưa có dòng nào trỏ tới: thêm cuối nhóm Chăn đông và chăn hè */
const newChanRows = (rows: readonly MenuRowInput[]): MenuRow[] =>
  PRODUCTS.filter((p) => p.listings && p.category === 'chan' && !rows.some((r) => r.trang === productTarget(p.slug))).map((p) => productRow(p.slug))

/** Nhóm của sản phẩm mới đăng trong Woo theo loại (chăn đã có newChanRows) */
const NEW_PRODUCT_GROUP: Partial<Record<Product['category'], EditableGroupId>> = { dem: 'dem', goi: 'do-ruot' }

/**
 * Đệm, ruột gối Ecopillo đăng mới trong Woo: thêm cuối nhóm Đệm / Đồ ruột như chăn mới, trừ khi đã có dòng trỏ tới chính nó
 * hoặc tới trang danh mục chứa nó (ví dụ đệm lò xo mới đã nằm trong dòng "Đệm lò xo", giá "từ" tính cả nó)
 */
const newProductRows = (id: EditableGroupId, rows: readonly MenuRowInput[]): MenuRow[] =>
  PRODUCTS.filter(
    (p) =>
      p.listings &&
      NEW_PRODUCT_GROUP[p.category] === id &&
      !rows.some((r) => r.trang === productTarget(p.slug) || p.listings?.some((path) => r.trang === listingTarget(path))),
  ).map((p) => productRow(p.slug))

const editableRows = (id: EditableGroupId): MenuRow[] => {
  const rows = MENU_ROWS.filter((r) => r.nhom === id).flatMap((r) => menuRowOf(r) ?? [])
  return [...rows, ...(id === 'chan' ? newChanRows(MENU_ROWS) : newProductRows(id, MENU_ROWS))]
}

/* ---------------------------------------------------------------- Bộ chăn ga: bộ nào ở nhóm con nào, thứ tự (Nội dung web) */

type SetSectionId = 'ga-phu' | 'ga-chun-chan' | 'ga-chun'

interface SetRowInput {
  nhom: SetSectionId
  bo: string
}

const SET_SECTIONS: readonly { id: SetSectionId; label: string }[] = [
  { id: 'ga-phu', label: 'Bộ ga phủ' },
  { id: 'ga-chun-chan', label: 'Bộ ga phủ và chun chần (giá ga chun chần)' },
  { id: 'ga-chun', label: 'Bộ ga chun' },
]

/** Lựa chọn: các bộ chăn ga có trong code; bộ Ecopillo tạo trong Woo tự vào cuối nhóm con theo kiểu ga */
const SET_CHOICES = ALL_COLLECTIONS.filter((c) => c.kind !== 'chan-he' && !c.livePath)

const BASE_SET_ROWS: readonly SetRowInput[] = [
  ...GA_PHU_ORDER.map((bo) => ({ nhom: 'ga-phu' as const, bo })),
  ...GA_CHUN_CHAN_ORDER.map((bo) => ({ nhom: 'ga-chun-chan' as const, bo })),
  { nhom: 'ga-chun', bo: 'eco-flora' },
]

const SET_ROW_FIELDS: readonly EditableField[] = [
  {
    khoa: 'nhom',
    nhan: 'Nhóm con',
    kieu: 'chon',
    batBuoc: true,
    luaChon: SET_SECTIONS.map((s) => s.id),
    nhanLuaChon: SET_SECTIONS.map((s) => s.label),
    goiY: 'Nhóm con "ga phủ và chun chần" ghi giá thấp nhất của ga chun chần',
  },
  { khoa: 'bo', nhan: 'Bộ sưu tập', kieu: 'chon', batBuoc: true, luaChon: SET_CHOICES.map((c) => c.id), nhanLuaChon: SET_CHOICES.map((c) => c.name) },
]

export const PRODUCT_MENU_SETS_SET: EditableSet = {
  khoa: 'menu-san-pham-bo-chan-ga',
  nhom: 'Sản phẩm',
  ten: 'Ô xổ "Sản phẩm": các bộ trong nhóm Bộ chăn ga',
  moTa:
    'Bộ nào nằm ở nhóm con nào của nhóm Bộ chăn ga (ga phủ; ga phủ và chun chần; ga chun), theo thứ tự nào. Thêm, xoá, đổi thứ tự ở đây. ' +
    'Bộ tạo mới trong WooCommerce tự vào cuối nhóm con theo kiểu ga. Tên nhóm con sửa ở mục "Ô xổ Sản phẩm: tên nhóm, ảnh, link cuối".',
  kieu: 'nhieu',
  goc: BASE_SET_ROWS,
  truong: SET_ROW_FIELDS,
  tieuDeDong: 'bo',
}

const SET_ROWS = liveList<SetRowInput>(PRODUCT_MENU_SETS_SET.khoa, BASE_SET_ROWS, SET_ROW_FIELDS, () => ({ nhom: '', bo: '' }) as unknown as SetRowInput)

/** Bộ của một nhóm con theo thứ tự Ecopillo xếp; một bộ ghi hai lần trong cùng nhóm con thì giữ lần đầu */
const setIdsOf = (section: SetSectionId): readonly string[] => [...new Set(SET_ROWS.filter((r) => r.nhom === section).map((r) => r.bo))]

/** Bộ Ecopillo tạo trong Woo chưa có dòng nào ở nhóm con đó */
const newSetRowsFor = (section: SetSectionId, kinds: readonly string[]): MenuRow[] =>
  BEDDING_SETS.filter((c) => c.livePath && kinds.includes(c.kind) && !setIdsOf(section).includes(c.id)).map((c) => collectionRow(c.id))

/* ---------------------------------------------------------------- Chữ, ảnh, link Ecopillo tự sửa (Nội dung web) */

/** Tên, ảnh năm nhóm, tên nhóm con, dòng khách sạn, link cuối ô xổ (owner 24/11/2026: khách tự sửa mọi chi tiết, kể cả menu) */
export const { set: PRODUCT_MENU_TEXT_SET, text: MENU_TEXT } = definePageText(
  'o-xo-san-pham',
  'Ô xổ "Sản phẩm": tên nhóm, ảnh, link cuối',
  'Tên và ảnh năm nhóm của ô xổ Sản phẩm (máy tính và điện thoại), tên ba nhóm con của Bộ chăn ga, dòng Sản phẩm khách sạn, chữ "từ" trước giá, link cuối ô xổ. Các dòng của nhóm Đệm, Đồ ruột, Chăn sửa ở mục "Ô xổ Sản phẩm trên thanh đầu trang".',
  {
    nhomDem: chu('Nhóm 1: tên', EDITABLE_GROUPS[0].title),
    linkDem: lienKet('Nhóm 1: link khi bấm tên, ảnh nhóm', DEM_PATH),
    anhDem: anh('Nhóm 1: ảnh', productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', 'Đệm Ecopillo')),
    nhomBoChanGa: chu('Nhóm 2: tên', 'Bộ chăn ga Ecopillo'),
    linkBoChanGa: lienKet('Nhóm 2: link khi bấm tên, ảnh nhóm', GA_PHU_PATH),
    anhBoChanGa: anh('Nhóm 2: ảnh', patternImage('ED25', 'Bộ chăn ga Ecopillo')),
    // "Bộ" đứng trước (chị Phương 18/11/2026): không có thì khách tưởng giá là của riêng một tấm ga
    nhomGaPhu: chu('Nhóm 2: tên nhóm con ga phủ', 'Bộ ga phủ'),
    nhomGaChunChan: chu('Nhóm 2: tên nhóm con ga phủ và chun chần', 'Bộ ga phủ và chun chần'),
    ghiChuGaChunChan: chu('Nhóm 2: ghi chú dưới nhóm con ga phủ và chun chần', 'Chọn ga chun chần khi đặt hàng'),
    nhomGaChun: chu('Nhóm 2: tên nhóm con ga chun', 'Bộ ga chun'),
    nhomDoRuot: chu('Nhóm 3: tên', EDITABLE_GROUPS[1].title),
    anhDoRuot: anh('Nhóm 3: ảnh', productImage('ruot-goi-micro-plus', 'Đồ ruột Ecopillo')),
    nhomChan: chu('Nhóm 4: tên', EDITABLE_GROUPS[2].title),
    linkChan: lienKet('Nhóm 4: link khi bấm tên, ảnh nhóm', CHAN_HE_PATH),
    anhChan: anh('Nhóm 4: ảnh', patternImage('ER09', 'Chăn đông và chăn hè')),
    nhomKhachSan: chu('Nhóm 5: tên', 'Sản phẩm khách sạn'),
    anhKhachSan: anh('Nhóm 5: ảnh', HOTEL_PHOTOS.sheets),
    dongKhachSan: chu('Nhóm 5: chữ dòng duy nhất', 'Hàng trắng khách sạn'),
    giaKhachSan: chu('Nhóm 5: chữ thay giá', 'giá liên hệ'),
    linkKhachSan: lienKet('Nhóm 5: link', PATHS.hotel),
    tu: chu('Chữ trước giá thấp nhất', 'từ', 'Ví dụ "từ 1.200.000đ"'),
    xemCaNhom: chu('Điện thoại: link xem cả nhóm', 'Xem cả nhóm {nhom}', 'Giữ {nhom}: tên nhóm'),
    xemTatCa: chu('Link cuối: xem tất cả', 'Xem tất cả sản phẩm'),
    xemTatCaLink: lienKet('Link cuối: xem tất cả (đường dẫn)', PATHS.products),
    quaTangDan: chu('Máy tính: chữ trước link quà tặng', 'Quà tặng doanh nghiệp, sự kiện:'),
    quaTang: chu('Máy tính: link quà tặng', 'Quà tặng và sự kiện'),
    quaTangLink: lienKet('Máy tính: link quà tặng (đường dẫn)', PATHS.gifts),
  },
)

export const PRODUCT_MENU: readonly MenuGroup[] = [
  group({
    id: 'dem',
    title: MENU_TEXT.nhomDem,
    to: MENU_TEXT.linkDem,
    image: MENU_TEXT.anhDem,
    rows: editableRows('dem'),
  }),
  group({
    id: 'bo-chan-ga',
    title: MENU_TEXT.nhomBoChanGa,
    to: MENU_TEXT.linkBoChanGa,
    image: MENU_TEXT.anhBoChanGa,
    rows: [],
    sections: [
      {
        title: MENU_TEXT.nhomGaPhu,
        rows: [...setIdsOf('ga-phu').map(collectionRow), ...newSetRowsFor('ga-phu', ['ga-phu', 'chan-ga'])],
      },
      {
        title: MENU_TEXT.nhomGaChunChan,
        // Gốc Rosa, Tera, Vera — chọn ga chun chần ở bước kích thước khi đặt
        note: MENU_TEXT.ghiChuGaChunChan,
        rows: setIdsOf('ga-chun-chan').map(fittedRow),
      },
      {
        title: MENU_TEXT.nhomGaChun,
        rows: [...setIdsOf('ga-chun').map(collectionRow), ...newSetRowsFor('ga-chun', ['ga-chun'])],
      },
    ],
  }),
  group({
    id: 'do-ruot',
    title: MENU_TEXT.nhomDoRuot,
    // Không còn trang chung cho cả nhóm (Ruột chăn gối nay chỉ là ruột chăn): tiêu đề nhóm mở trang của dòng đầu
    to: editableRows('do-ruot')[0]?.to ?? RUOT_PATH,
    image: MENU_TEXT.anhDoRuot,
    rows: editableRows('do-ruot'),
  }),
  group({
    id: 'chan',
    title: MENU_TEXT.nhomChan,
    to: MENU_TEXT.linkChan,
    image: MENU_TEXT.anhChan,
    rows: editableRows('chan'),
  }),
  group({
    id: 'khach-san',
    title: MENU_TEXT.nhomKhachSan,
    to: MENU_TEXT.linkKhachSan,
    image: MENU_TEXT.anhKhachSan,
    rows: [
      {
        label: MENU_TEXT.dongKhachSan,
        to: MENU_TEXT.linkKhachSan,
        min: 0,
        isFromPrice: false,
        priceLabel: MENU_TEXT.giaKhachSan,
      },
    ],
  }),
].filter((g) => g.rows.length > 0 || (g.sections?.length ?? 0) > 0)

/** Dòng cuối ô xổ */
export const PRODUCT_MENU_ALL = { label: MENU_TEXT.xemTatCa, to: MENU_TEXT.xemTatCaLink } as const
export const PRODUCT_MENU_GIFTS = {
  lead: MENU_TEXT.quaTangDan,
  label: MENU_TEXT.quaTang,
  to: MENU_TEXT.quaTangLink,
} as const

/** Chữ trước giá, link xem cả nhóm (ProductMenu.tsx) */
export const PRODUCT_MENU_LABELS = { from: MENU_TEXT.tu, seeGroup: MENU_TEXT.xemCaNhom } as const

