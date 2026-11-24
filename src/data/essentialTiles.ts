import { ESSENTIALS } from './catalog'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import { dsDong, legacyPageText } from './pageText/define'
import { HOME_TEXT } from './pageText/home'
import { ALL_PRODUCTS } from './products'

/**
 * Các ô của khối "Ruột chăn, ruột gối và phụ kiện" trang chủ (src/components/home/Essentials.tsx). Ecopillo thêm, bỏ, đổi thứ tự ô,
 * chọn sản phẩm và câu nhỏ dưới tên ở Nội dung web → Trang chủ (owner 25/11/2026: "soát kỹ, không bỏ sót chi tiết nào để
 * anh chị toàn quyền tự chỉnh sửa"). Trước 25/11/2026 các ô cố định theo ESSENTIALS (catalog.ts), câu nhỏ ở ba ô "Ruột chăn gối:
 * câu nhỏ dưới tên các ô nhóm …" của bộ chữ Trang chủ, gắn theo vị trí; phần Ecopillo đã sửa ở đó làm dữ liệu ban đầu.
 * Tên, câu dưới tên của 3 nhóm và link "Xem tất cả" vẫn ở bộ chữ Trang chủ.
 */

export interface EssentialRow {
  /** Mã nhóm: ruot-goi, ruot-chan, chan-topper */
  nhom: string
  /** Khoá sản phẩm (sản phẩm lẻ, bộ chăn hè, sản phẩm mới đăng trong Woo) */
  sanPham: string
  /** Câu nhỏ dưới tên ô; trống thì câu gốc / câu đầu mô tả sản phẩm */
  ghiChu?: string
}

const GROUP_IDS: readonly string[] = ESSENTIALS.map((g) => g.id)

/** Câu nhỏ Ecopillo đã sửa ở các ô cũ (theo vị trí ô gốc), giữ tới khi Ecopillo lưu bộ mới */
const LEGACY = legacyPageText('trang-chu', {
  ruotGoiGhiChu: dsDong('', ESSENTIALS[0]?.items.map((i) => i.note) ?? []),
  ruotChanGhiChu: dsDong('', ESSENTIALS[1]?.items.map((i) => i.note) ?? []),
  phuKienGhiChu: dsDong('', ESSENTIALS[2]?.items.map((i) => i.note) ?? []),
})
const LEGACY_NOTES: readonly (readonly string[])[] = [LEGACY.ruotGoiGhiChu, LEGACY.ruotChanGhiChu, LEGACY.phuKienGhiChu]

const rowsOf = (notes: readonly (readonly string[])[]): readonly EssentialRow[] =>
  ESSENTIALS.flatMap((g, gi) => g.items.map((item, i) => ({ nhom: g.id, sanPham: item.slug, ghiChu: notes[gi]?.[i] ?? item.note })))

const BASE_ROWS = rowsOf(ESSENTIALS.map((g) => g.items.map((i) => i.note)))

const FIELDS: readonly EditableField[] = [
  {
    khoa: 'nhom',
    nhan: 'Nhóm',
    kieu: 'chon',
    batBuoc: true,
    luaChon: GROUP_IDS,
    nhanLuaChon: GROUP_IDS.map((id, i) => HOME_TEXT.ruotNhom[i]?.title ?? ESSENTIALS[i]?.title ?? id),
    goiY: 'Tên, câu dưới tên của nhóm và link "Xem tất cả" sửa ở Chữ từng trang → Trang chủ.',
  },
  {
    khoa: 'sanPham',
    nhan: 'Sản phẩm',
    kieu: 'chon',
    batBuoc: true,
    luaChon: ALL_PRODUCTS.map((p) => p.slug),
    nhanLuaChon: ALL_PRODUCTS.map((p) => p.name),
    // Sản phẩm lẻ Ecopillo đăng mới trong Woo cũng chọn được
    luaChonThem: [{ nguon: 'san-pham' }],
    goiY: 'Ảnh, tên, giá của ô lấy theo trang sản phẩm. Sản phẩm đã gỡ trong Woo thì ô tự ẩn.',
  },
  {
    khoa: 'ghiChu',
    nhan: 'Câu nhỏ dưới tên ô',
    kieu: 'chu',
    goiY: 'Ngắn, một câu. Để trống: dùng câu gốc của ô, hoặc câu đầu mô tả sản phẩm.',
  },
]

export const ESSENTIAL_TILES_SET: EditableSet = {
  khoa: 'trang-chu-o-ruot-chan-goi',
  nhom: 'Trang chủ',
  ten: 'Trang chủ: các ô ruột chăn, ruột gối, phụ kiện',
  moTa:
    'Các ô của khối "Ruột chăn, ruột gối và phụ kiện" trang chủ: mỗi dòng một ô (nhóm, sản phẩm, câu nhỏ). Thêm, xoá, đổi thứ tự ô ở đây; ô trong một nhóm hiện theo thứ tự các dòng. ' +
    'Chưa lưu bộ này thì sản phẩm mới đăng trong Woo ở trang danh mục của nhóm tự thêm ô cuối; đã lưu thì chỉ hiện đúng các dòng ở đây (sản phẩm mới: thêm dòng). Nhóm không còn ô nào thì không hiện. Muốn ẩn cả khối: Giao diện → Bố cục trang chủ.',
  kieu: 'nhieu',
  goc: BASE_ROWS,
  truong: FIELDS,
  tieuDeDong: 'sanPham',
}

const START = rowsOf(LEGACY_NOTES)
const ROWS = liveList<EssentialRow>(ESSENTIAL_TILES_SET.khoa, START, FIELDS, () => ({ nhom: '', sanPham: '' }))

/** Các ô theo thứ tự Ecopillo xếp */
export const ESSENTIAL_ROWS: readonly EssentialRow[] = ROWS
/** Ecopillo đã lưu bộ này: chỉ hiện đúng các dòng, không tự thêm sản phẩm mới */
export const ESSENTIAL_ROWS_SAVED: boolean = ROWS !== START
