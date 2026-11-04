import { BEDDING_SETS, collectionRange, type Collection } from './catalog'

/**
 * Trang chủ, phần bộ sưu tập chăn ga: chia theo cách làm hoa văn (góp ý 04/11/2026 mục 9, Excel STT 82;
 * owner chọn mẫu A 05/11/2026: docs/de-xuat-bo-suu-tap-theo-loai-05-11.html).
 * Mỗi nhóm một tiêu đề, thẻ bằng nhau, trong nhóm xếp theo giá thấp tới cao. Đệm không nằm ở đây (khối chọn đệm MattressPicker).
 * Bộ chưa có nguồn ghi rõ cách làm hoa văn thì confirmed: false, thẻ hiện [XÁC NHẬN loại] (câu hỏi STT 68).
 * Thêm bộ sưu tập mới: thêm vào một nhóm dưới đây, không thì bộ đó không hiện ở trang chủ.
 */

interface GroupMember {
  id: string
  /** Có nguồn (catalog, câu chuyện phối màu) ghi rõ cách làm hoa văn */
  confirmed: boolean
}

interface GroupSource {
  id: string
  title: string
  note: string
  members: readonly GroupMember[]
}

const GROUP_SOURCES: readonly GroupSource[] = [
  {
    id: 'bo-suu-tap-theu',
    title: 'Thêu',
    note: 'Hoa văn bằng đường chỉ thêu nổi trên mặt vải, nhìn nghiêng thấy rõ, sờ thấy đường chỉ.',
    members: [
      // Câu chuyện ET01, ET02 ghi "thêu logo"; mô tả bộ chỉ ghi "trơn một màu, viền chần nổi"
      { id: 'eco-tera', confirmed: false },
      // Mô tả bộ "chần thêu dày và đều"; ED20 "thêu chỉ vàng", ED26 "thêu tay"
      { id: 'eco-doris', confirmed: true },
    ],
  },
  {
    id: 'bo-suu-tap-in',
    title: 'In hoạ tiết',
    note: 'Hoa văn in lên vải Lyocell: nhiều mẫu, nhiều màu nhất, hợp phòng ngủ trẻ trung và phòng cho bé.',
    members: [
      // Chỉ câu chuyện EF11 ghi "in tinh xảo"
      { id: 'eco-flora', confirmed: false },
      // Catalog Ecopillo 22.07.2026: in hoạt tính
      { id: 'eco-rosa', confirmed: true },
      // Chưa có nguồn nào ghi cách làm hoa văn
      { id: 'eco-vera', confirmed: false },
    ],
  },
  {
    id: 'bo-suu-tap-det',
    title: 'Dệt hoa văn',
    note: 'Hoa văn dệt thẳng vào sợi vải (kỹ thuật Jacquard), nổi khối dưới ánh sáng; Liora dệt cùng sợi kim tuyến.',
    members: [
      // Mô tả bộ "dệt thẳng vào sợi Lyocell bằng kỹ thuật Jacquard"
      { id: 'eco-sweet', confirmed: true },
      // Mô tả bộ "vải dệt kim sa", EL12 "dệt chìm bằng vải kim tuyến"; chưa rõ có phải Jacquard
      { id: 'eco-liora', confirmed: false },
    ],
  },
]

export interface CollectionGroup {
  /** id của khối nhóm, hàng chip nhảy tới đây */
  id: string
  title: string
  note: string
  collections: readonly Collection[]
  /** id các bộ chưa xác nhận thuộc nhóm này */
  unconfirmed: ReadonlySet<string>
}

const byId = new Map(BEDDING_SETS.map((c) => [c.id, c]))

export const COLLECTION_GROUPS: readonly CollectionGroup[] = GROUP_SOURCES.map(({ id, title, note, members }) => ({
  id,
  title,
  note,
  collections: members
    .flatMap((m) => byId.get(m.id) ?? [])
    .sort((a, b) => collectionRange(a).min - collectionRange(b).min),
  unconfirmed: new Set(members.filter((m) => !m.confirmed).map((m) => m.id)),
}))
