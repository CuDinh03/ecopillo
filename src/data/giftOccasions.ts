import { ALL_COLLECTIONS, COLLECTIONS } from './catalog'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import { dsCap, legacyPageText } from './pageText/define'

/**
 * Trang Quà tặng và sự kiện, phần "Chọn theo từng dịp": mỗi dịp một thẻ (tên, câu gợi ý, các bộ chăn ga gợi ý).
 * Ecopillo thêm, xoá, đổi thứ tự dịp và chọn bộ cho từng dịp ở Nội dung web (đợt G, 24/11/2026: "thêm được thì phải xoá được").
 * Trước 24/11/2026 tên và câu nằm ở ô "Chọn quà: 3 dịp" của bộ chữ trang Quà tặng, bộ gợi ý viết cứng theo thứ tự dòng.
 */

export interface GiftOccasion {
  title: string
  text: string
  /** Mã bộ sưu tập gợi ý, theo thứ tự hiện */
  bo: readonly string[]
}

/** Chữ gốc ba dịp (chữ đã duyệt, trước ở src/data/pageText/gifts.ts) */
const BASE_TEXT: readonly { title: string; text: string }[] = [
  { title: 'Quà cưới', text: 'Bộ chăn ga dệt Jacquard hoa văn nổi hoặc dòng cao nhất, cho căn phòng đầu tiên của đôi vợ chồng trẻ.' },
  { title: 'Quà tân gia', text: 'Nhiều mẫu, nhiều màu để hợp với phòng ngủ mới. Có thể nhờ Ecopillo tư vấn theo ảnh phòng.' },
  { title: 'Biếu cha mẹ, dịp Tết', text: 'Màu trơn, sắc nhã, vải mềm mát dễ chịu cho người lớn tuổi; kèm ruột gối êm nâng đỡ cổ vai.' },
]

/** Bộ gợi ý gốc cho từng dịp, theo thứ tự dòng */
const BASE_IDS: readonly (readonly string[])[] = [
  ['eco-doris', 'eco-sweet'],
  ['eco-rosa', 'eco-vera'],
  ['eco-tera', 'eco-liora'],
]

/** Phần Ecopillo đã sửa ở ô cũ "dip" của bộ chữ trang Quà tặng (giữ cho tới khi Ecopillo lưu bộ mới) */
const LEGACY = legacyPageText('qua-tang', {
  dip: dsCap('Chọn quà: các dịp', ['title', 'text'], ['Tên dịp', 'Câu gợi ý'], BASE_TEXT),
})

/**
 * Lựa chọn: bộ chăn ga có trong code (danh sách lựa chọn lúc dựng và lúc chạy như nhau). Web nhận các bộ đã tích theo thứ tự
 * lựa chọn, nên các bộ gợi ý gốc đứng đầu đúng thứ tự đang hiện.
 */
const CHOICE_IDS: readonly string[] = [
  ...new Set([...BASE_IDS.flat(), ...ALL_COLLECTIONS.filter((c) => c.kind !== 'chan-he' && !c.livePath).map((c) => c.id)]),
]
const nameOf = (id: string): string => ALL_COLLECTIONS.find((c) => c.id === id)?.name ?? id

const FIELDS: readonly EditableField[] = [
  { khoa: 'title', nhan: 'Tên dịp', kieu: 'chu', batBuoc: true },
  { khoa: 'text', nhan: 'Câu gợi ý', kieu: 'doan', batBuoc: true },
  {
    khoa: 'bo',
    nhan: 'Bộ chăn ga gợi ý',
    kieu: 'chon-nhieu',
    batBuoc: true,
    luaChon: CHOICE_IDS,
    nhanLuaChon: CHOICE_IDS.map(nameOf),
    goiY: 'Bộ hiện theo thứ tự danh sách lựa chọn; ảnh thẻ là ảnh bìa của bộ đầu tiên. Bộ đã gỡ trong WooCommerce tự bỏ; dịp không còn bộ nào thì không hiện.',
  },
]

/** Dòng ban đầu: chữ ở ô cũ (nếu Ecopillo đã sửa) ghép với bộ gợi ý gốc theo thứ tự; dòng thứ 4 trở đi trước đây không hiện */
const rowsOf = (texts: readonly { title: string; text: string }[]): readonly GiftOccasion[] =>
  BASE_IDS.flatMap((bo, i) => (texts[i] ? [{ title: texts[i].title, text: texts[i].text, bo }] : []))

export const GIFT_OCCASIONS_SET: EditableSet = {
  khoa: 'qua-tang-theo-dip',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Quà tặng: chọn theo từng dịp',
  moTa: 'Các thẻ dịp ở trang Quà tặng và sự kiện (quà cưới, tân gia, biếu…): tên, câu gợi ý, bộ chăn ga gợi ý. Thêm, xoá, đổi thứ tự dịp ở đây.',
  kieu: 'nhieu',
  goc: rowsOf(BASE_TEXT),
  truong: FIELDS,
  tieuDeDong: 'title',
}

const ROWS = liveList<GiftOccasion>(GIFT_OCCASIONS_SET.khoa, rowsOf(LEGACY.dip), FIELDS, () => ({ title: '', text: '', bo: [] }))

/** Dịp đang hiện: bỏ bộ Ecopillo đã gỡ trong WordPress (đợt E2); dịp không còn bộ nào thì bỏ dịp */
export const GIFT_OCCASIONS: readonly GiftOccasion[] = ROWS.map((o) => ({ ...o, bo: o.bo.filter((id) => COLLECTIONS.some((c) => c.id === id)) })).filter(
  (o) => o.bo.length > 0,
)
