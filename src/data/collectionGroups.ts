import { ALL_COLLECTIONS, BEDDING_SETS, patternImage, type Collection, type ImageSource } from './catalog'
import { PATHS } from './links'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import { anh, chu, definePageText, type TextField } from './pageText/define'

/**
 * Trang chủ, phần bộ sưu tập chăn ga (C4, owner chốt 09/11/2026, phương án 1 trong docs/de-xuat-gop-y-08-11.html).
 * Khách 08/11: "chị chủ yếu bán ga ER EV ET ED sản phẩm lõi của cty" → bốn bộ lõi ô to 2×2 lên trước,
 * ba bộ còn lại ở "Thêm lựa chọn" bên dưới (chị Phương 09/11/2026: cùng cỡ ô với bốn bộ lõi, bỏ dòng gọn). Nhãn loại vải (mục 8 phản hồi 05/11, Excel STT 94) thành chữ nhỏ dưới tên bộ.
 * Thứ tự khách đã duyệt giữ nguyên trong từng phần: Doris → Vera → Tera → Rosa, rồi Sweet → Liora → Flora.
 * Bộ thêm trong code: thêm vào một trong hai danh sách dưới đây, không thì bộ đó không hiện ở trang chủ.
 * Bộ Ecopillo tạo trong WooCommerce (đợt C) tự hiện ở cuối "Thêm lựa chọn".
 *
 * [XÁC NHẬN nhóm của Rosa, Flora] — giả định cùng "In hoạ tiết" (khách chỉ ghi Vera là "In cao cấp").
 * [XÁC NHẬN giữ tên "Dệt jacquard"] — STT 45 khách nói người mua không biết "jacqua".
 */

interface ShowcaseSource {
  id: string
  /** Loại vải (chữ khách gửi 05/11/2026) */
  fabric: string
}

/** Phần của trang chủ: bốn bộ lõi (hàng đầu) hay "Thêm lựa chọn" */
type ShowcaseGroup = 'loi' | 'them'

/** Bốn bộ lõi: ô ảnh to */
const CORE_SOURCES: readonly ShowcaseSource[] = [
  // Catalog: "chần thêu dày và đều"
  { id: 'eco-doris', fabric: 'Thêu' },
  // Khách ghi In cao cấp (Vera)
  { id: 'eco-vera', fabric: 'In cao cấp' },
  // Khách 05/11 ghi Trơn (Tera)
  { id: 'eco-tera', fabric: 'Trơn' },
  // Catalog 22.07.2026: in hoạt tính; [XÁC NHẬN nhóm của Rosa, Flora]
  { id: 'eco-rosa', fabric: 'In hoạ tiết' },
]

/** Ba bộ còn lại: ô to như bộ lõi, phần "Thêm lựa chọn" */
const MORE_SOURCES: readonly ShowcaseSource[] = [
  // Catalog: "dệt thẳng vào sợi Lyocell bằng kỹ thuật Jacquard"
  { id: 'eco-sweet', fabric: 'Dệt jacquard' },
  // Catalog: "vải dệt kim sa"
  { id: 'eco-liora', fabric: 'Dệt kim sa' },
  // Chỉ câu chuyện EF11 ghi "in tinh xảo"; [XÁC NHẬN nhóm của Rosa, Flora]
  { id: 'eco-flora', fabric: 'In hoạ tiết' },
]

/**
 * Ảnh nền ô "Xem tất cả sản phẩm" (chị Phương 18/11/2026: "bổ sung một số hình"; owner chọn phương án B,
 * docs/de-xuat-xem-tat-ca-va-lien-he-18-11.html, "phụ thuộc vào nó đang nằm ở mục nào thì thêm ảnh của sản phẩm đó").
 * Ô nằm trong mục Bộ sưu tập chăn ga nên dùng ảnh phòng ngủ trải bộ chăn ga; chọn mẫu không phải ảnh bìa của ô nào bên cạnh.
 * Ảnh chỉ để trang trí (chữ trên ô đã nói ô dẫn đi đâu) nên alt rỗng.
 */
const BASE_SEE_ALL_IMAGE: ImageSource = { ...patternImage('EV04', ''), alt: '' }

/** Ô đường link (/duong-dan/, https://…): web kiểm đúng dạng link, sai thì dùng link gốc */
const link = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'link', goc, goiY })

/** Đoạn dẫn: chị Phương qua Zalo 09/11/2026, giữ nguyên văn (thay "Bốn dòng chăn ga chủ lực của Ecopillo") */
const { set: SHOWCASE_SET, text: SHOWCASE } = definePageText(
  'bo-suu-tap-trang-chu',
  'Trang chủ: khối Bộ sưu tập chăn ga',
  'Tiêu đề, đoạn dẫn, chữ, ảnh, link ô "Xem tất cả" của khối bộ sưu tập chăn ga trang chủ. Bộ nào hiện, thứ tự, loại vải: mục "Trang chủ: các bộ sưu tập chăn ga".',
  {
    tieuDe: chu('Tiêu đề', 'Bộ sưu tập chăn ga'),
    danDat: chu('Đoạn dẫn', 'Những dòng chăn ga bán chạy nhất Ecopillo'),
    themLuaChon: chu('Nhãn hàng bộ thêm', 'Thêm lựa chọn'),
    xemTatCa: chu('Ô cuối: chữ to', 'Xem tất cả sản phẩm'),
    xemTatCaPhu: chu('Ô cuối: chữ nhỏ', 'Đệm, chăn ga, gối, chăn'),
    xemTatCaAnh: anh('Ô cuối: ảnh nền (phủ lớp chàm cho chữ trắng)', BASE_SEE_ALL_IMAGE),
    xemTatCaLink: link('Ô cuối: link', PATHS.products),
  },
)
export const COLLECTION_SHOWCASE_SET = SHOWCASE_SET
export const COLLECTION_SHOWCASE_TEXT = {
  title: SHOWCASE.tieuDe,
  lead: SHOWCASE.danDat,
  moreTitle: SHOWCASE.themLuaChon,
  seeAll: SHOWCASE.xemTatCa,
  seeAllNote: SHOWCASE.xemTatCaPhu,
  seeAllTo: SHOWCASE.xemTatCaLink,
}

export const SEE_ALL_IMAGE: ImageSource = SHOWCASE.xemTatCaAnh

export interface ShowcaseItem {
  collection: Collection
  fabric: string
}

/* ——— Bộ nào hiện, thứ tự, loại vải: Ecopillo tự sửa (Nội dung web → Trang chủ) ——— */

interface ShowcaseRow extends ShowcaseSource {
  nhom: ShowcaseGroup
}

/**
 * Lựa chọn: các bộ chăn ga có trong code (không lấy BEDDING_SETS lúc chạy, để danh sách lựa chọn ghi ra lúc dựng và lúc chạy như nhau).
 * Bộ Ecopillo tạo trong WooCommerce không có ở đây: bộ đó tự vào cuối "Thêm lựa chọn".
 */
const CHOICES = ALL_COLLECTIONS.filter((c) => c.kind !== 'chan-he' && !c.livePath)

const BASE_ROWS: readonly ShowcaseRow[] = [
  ...CORE_SOURCES.map((s) => ({ ...s, nhom: 'loi' as const })),
  ...MORE_SOURCES.map((s) => ({ ...s, nhom: 'them' as const })),
]

export const HOME_COLLECTIONS_SET: EditableSet = {
  khoa: 'bo-suu-tap-trang-chu-thu-tu',
  nhom: 'Trang chủ',
  ten: 'Trang chủ: các bộ sưu tập chăn ga',
  moTa:
    'Bộ nào hiện ở khối Bộ sưu tập chăn ga trang chủ, theo thứ tự nào, nằm ở hàng bộ lõi (ô đầu) hay "Thêm lựa chọn", và chữ loại vải dưới tên bộ. ' +
    'Hàng bộ lõi đẹp nhất khi đủ 4 bộ; "Thêm lựa chọn" có thêm ô Xem tất cả ở cuối. Bộ tạo mới trong WooCommerce tự hiện ở cuối "Thêm lựa chọn".',
  kieu: 'nhieu',
  goc: BASE_ROWS,
  tieuDeDong: 'id',
  truong: [
    // Bộ Ecopillo tạo trong Woo sau lần dựng cũng chọn được (đợt G)
    { khoa: 'id', nhan: 'Bộ sưu tập', kieu: 'chon', batBuoc: true, luaChon: CHOICES.map((c) => c.id), nhanLuaChon: CHOICES.map((c) => c.name), luaChonThem: [{ nguon: 'bo-suu-tap' }] },
    { khoa: 'nhom', nhan: 'Nằm ở', kieu: 'chon', batBuoc: true, luaChon: ['loi', 'them'], nhanLuaChon: ['Hàng bộ lõi (ô đầu)', 'Thêm lựa chọn'] },
    { khoa: 'fabric', nhan: 'Loại vải (chữ nhỏ dưới tên bộ)', kieu: 'chu', batBuoc: true },
  ] satisfies EditableField[],
}

const ROWS: readonly ShowcaseRow[] = liveList(HOME_COLLECTIONS_SET.khoa, BASE_ROWS, HOME_COLLECTIONS_SET.truong, () => ({
  id: '',
  nhom: 'them',
  fabric: '',
}))

const byId = new Map(BEDDING_SETS.map((c) => [c.id, c]))

/** Bộ đã gỡ trong WordPress (không còn trong BEDDING_SETS) thì bỏ; một bộ ghi hai lần thì giữ lần đầu */
const resolve = (rows: readonly ShowcaseRow[], group: ShowcaseGroup, seen: Set<string>): readonly ShowcaseItem[] =>
  rows.flatMap(({ id, fabric, nhom }) => {
    const collection = byId.get(id)
    if (nhom !== group || !collection || seen.has(id)) return []
    seen.add(id)
    return [{ collection, fabric }]
  })

const SEEN = new Set<string>()
export const CORE_COLLECTIONS = resolve(ROWS, 'loi', SEEN)
/** Bộ Ecopillo tạo trong WooCommerce (đợt C) tự vào cuối "Thêm lựa chọn"; dòng chữ nhỏ dưới tên là kiểu bộ */
export const MORE_COLLECTIONS = [
  ...resolve(ROWS, 'them', SEEN),
  ...BEDDING_SETS.filter((c) => c.livePath && !SEEN.has(c.id)).map((collection) => ({ collection, fabric: collection.kindLabel })),
]
