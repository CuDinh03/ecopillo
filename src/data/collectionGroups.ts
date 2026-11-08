import { BEDDING_SETS, type Collection } from './catalog'

/**
 * Trang chủ, phần bộ sưu tập chăn ga (C4, owner chốt 09/11/2026, phương án 1 trong docs/de-xuat-gop-y-08-11.html).
 * Khách 08/11: "chị chủ yếu bán ga ER EV ET ED sản phẩm lõi của cty" → bốn bộ lõi ô to 2×2 lên trước,
 * ba bộ còn lại thành dòng gọn "Thêm lựa chọn" bên dưới. Nhãn loại vải (mục 8 phản hồi 05/11, Excel STT 94) thành chữ nhỏ dưới tên bộ.
 * Thứ tự khách đã duyệt giữ nguyên trong từng phần: Doris → Vera → Tera → Rosa, rồi Sweet → Liora → Flora.
 * Thêm bộ sưu tập mới: thêm vào một trong hai danh sách dưới đây, không thì bộ đó không hiện ở trang chủ.
 *
 * [XÁC NHẬN nhóm của Rosa, Flora] — giả định cùng "In hoạ tiết" (khách chỉ ghi Vera là "In cao cấp").
 * [XÁC NHẬN giữ tên "Dệt jacquard"] — STT 45 khách nói người mua không biết "jacqua".
 */

interface ShowcaseSource {
  id: string
  /** Loại vải (chữ khách gửi 05/11/2026) */
  fabric: string
}

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

/** Ba bộ còn lại: dòng gọn */
const MORE_SOURCES: readonly ShowcaseSource[] = [
  // Catalog: "dệt thẳng vào sợi Lyocell bằng kỹ thuật Jacquard"
  { id: 'eco-sweet', fabric: 'Dệt jacquard' },
  // Catalog: "vải dệt kim sa"
  { id: 'eco-liora', fabric: 'Dệt kim sa' },
  // Chỉ câu chuyện EF11 ghi "in tinh xảo"; [XÁC NHẬN nhóm của Rosa, Flora]
  { id: 'eco-flora', fabric: 'In hoạ tiết' },
]

export const COLLECTION_SHOWCASE_TEXT = {
  title: 'Bộ sưu tập chăn ga',
  lead: 'Bốn dòng chăn ga chủ lực của Ecopillo',
  moreTitle: 'Thêm lựa chọn',
  seeAll: 'Xem tất cả sản phẩm',
} as const

export interface ShowcaseItem {
  collection: Collection
  fabric: string
}

const byId = new Map(BEDDING_SETS.map((c) => [c.id, c]))

const resolve = (sources: readonly ShowcaseSource[]): readonly ShowcaseItem[] =>
  sources.flatMap(({ id, fabric }) => {
    const collection = byId.get(id)
    return collection ? [{ collection, fabric }] : []
  })

export const CORE_COLLECTIONS = resolve(CORE_SOURCES)
export const MORE_COLLECTIONS = resolve(MORE_SOURCES)
