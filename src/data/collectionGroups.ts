import { BEDDING_SETS, type Collection } from './catalog'

/**
 * Trang chủ, phần bộ sưu tập chăn ga: chia theo loại vải (mục 8 phản hồi 05/11/2026, Excel STT 94;
 * phương án 1 trong docs/de-xuat-nhom-vai-05-11.html, thay phương án A STT 82).
 * Thứ tự cao cấp trước: Doris → Sweet → Liora → Vera → Tera → Rosa → Flora.
 * Trong nhóm giữ đúng thứ tự khai báo, không xếp lại theo giá.
 * Thêm bộ sưu tập mới: thêm vào một nhóm dưới đây, không thì bộ đó không hiện ở trang chủ.
 *
 * [XÁC NHẬN nhóm của Rosa, Flora] — giả định phương án 1: cùng nhóm "In hoạ tiết" (khách chỉ ghi Vera là "In cao cấp").
 * [XÁC NHẬN thứ tự Vera, Tera, Rosa] — xếp theo giá khởi điểm cao xuống thấp.
 * [XÁC NHẬN Tera sang Trơn] — khách 05/11 ghi Trơn (Tera); web trước để tạm ở Thêu.
 * [XÁC NHẬN giữ tên "Dệt jacquard"] — STT 45 khách nói người mua không biết "jacqua"; giữ tên kèm câu giải thích.
 */

interface GroupMember {
  id: string
  /** Có nguồn (catalog, tin khách) ghi rõ loại vải thuộc nhóm này; false = chờ Ecopillo (câu hỏi STT 73), không hiện nhãn trên web (owner 28/10) */
  confirmed: boolean
}

interface GroupSource {
  id: string
  /** Tên loại vải (chữ khách gửi) */
  title: string
  /** Câu giải thích loại vải, chép từ mô tả bộ trong catalog */
  note: string
  members: readonly GroupMember[]
}

const GROUP_SOURCES: readonly GroupSource[] = [
  {
    id: 'bo-suu-tap-theu',
    title: 'Thêu',
    note: 'Hoa văn bằng đường chỉ thêu trên mặt vải; Doris chần thêu dày và đều.',
    members: [
      // Khách ghi Thêu (Doris). Catalog: "chần thêu dày và đều"; ED20 "thêu chỉ vàng", ED26 "thêu tay"
      { id: 'eco-doris', confirmed: true },
    ],
  },
  {
    id: 'bo-suu-tap-jacquard',
    title: 'Dệt jacquard',
    note: 'Hoa văn dệt thẳng vào sợi Lyocell bằng kỹ thuật Jacquard, không in lên mặt vải.',
    members: [
      // Khách ghi. Catalog: "dệt thẳng vào sợi Lyocell bằng kỹ thuật Jacquard"
      { id: 'eco-sweet', confirmed: true },
    ],
  },
  {
    id: 'bo-suu-tap-kim-sa',
    title: 'Dệt kim sa',
    note: 'Vải dệt kim sa, từng sợi kim tuyến lấp lánh nhẹ dưới ánh đèn.',
    members: [
      // Khách ghi. Catalog: "vải dệt kim sa"; EL12 "dệt chìm bằng vải kim tuyến"
      { id: 'eco-liora', confirmed: true },
    ],
  },
  {
    id: 'bo-suu-tap-in-cao-cap',
    title: 'In cao cấp',
    note: 'Hoạ tiết hoa lá và hình học trên nền Lyocell màu pastel.',
    members: [
      // Khách ghi In cao cấp (Vera)
      { id: 'eco-vera', confirmed: true },
    ],
  },
  {
    id: 'bo-suu-tap-tron',
    title: 'Trơn',
    note: 'Lyocell trơn một màu, viền chần nổi.',
    members: [
      // Khách 05/11 ghi Trơn (Tera); trước đây để tạm ở Thêu
      { id: 'eco-tera', confirmed: true },
    ],
  },
  {
    id: 'bo-suu-tap-in-hoa-tiet',
    title: 'In hoạ tiết',
    // [XÁC NHẬN nhóm của Rosa, Flora]
    note: 'Hoạ tiết in lên vải; Rosa in hoạt tính, Flora là bộ ga chun.',
    members: [
      // Catalog Ecopillo 22.07.2026: in hoạt tính; khách chưa ghi nhóm
      { id: 'eco-rosa', confirmed: false },
      // Chỉ câu chuyện EF11 ghi "in tinh xảo"; khách chưa ghi nhóm, chỉ nói Flora cuối
      { id: 'eco-flora', confirmed: false },
    ],
  },
]

/** Chữ ô "Xem tất cả" cuối lưới cột (phương án 1) */
export const SEE_ALL_TILE = {
  label: 'Còn nữa',
  title: 'Sản phẩm khác',
  note: 'Đệm, ruột chăn gối, chăn hè.',
  heading: 'Xem tất cả sản phẩm',
  lead: 'Lọc theo loại, kích thước và giá.',
  cta: 'Xem tất cả',
} as const

export interface CollectionGroup {
  /** id của khối nhóm (neo #) */
  id: string
  title: string
  note: string
  collections: readonly Collection[]
}

const byId = new Map(BEDDING_SETS.map((c) => [c.id, c]))

export const COLLECTION_GROUPS: readonly CollectionGroup[] = GROUP_SOURCES.map(
  ({ id, title, note, members }) => ({
    id,
    title,
    note,
    // Giữ đúng thứ tự khai báo (cao cấp trước), không xếp lại theo giá
    collections: members.flatMap((m) => byId.get(m.id) ?? []),
  }),
)
