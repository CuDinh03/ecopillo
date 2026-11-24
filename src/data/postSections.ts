import { slugify } from '../lib/slug'
import { liveList, rowKey, type EditableField, type EditableSet } from './liveContent'

/**
 * Nhóm của bài viết trên trang Tin tức (owner duyệt 18/11/2026, docs/de-xuat-phan-loai-bai-viet-18-11.html):
 * Tin tức là tin về chính Ecopillo; Cẩm nang là bài kiến thức, chia chủ đề (4 chủ đề gốc; Ecopillo thêm, xoá, đổi tên ở Nội dung web).
 * Bài mới / sửa trong WordPress: Ecopillo chọn ở ô "Mục trên web" khi soạn bài (plugin bai-viet-moi.php, khoá meta
 * `_eco_muc_web`), giá trị là các mã dưới đây; ô đó thắng bảng này. Không chọn mà bài không có trong bảng: theo chuyên mục
 * WordPress như trước (chuyên mục Tin tức → Tin tức, còn lại → Cẩm nang).
 */

interface TopicRow {
  ma: string
  ten: string
}

/** 4 chủ đề Cẩm nang gốc (owner duyệt 18/11/2026). Mã là giá trị lưu trong WordPress (ô "Mục trên web") */
const BASE_TOPIC_ROWS: readonly TopicRow[] = [
  { ma: 'chon-chan-ga', ten: 'Chọn chăn ga gối đệm' },
  { ma: 'giac-ngu', ten: 'Giấc ngủ và sức khoẻ' },
  { ma: 'phong-ngu', ten: 'Phòng ngủ và phong thuỷ' },
  { ma: 'cuoi-hoi-le-tet', ten: 'Cưới hỏi, lễ tết' },
]

/** Mã mục không dùng được cho chủ đề: Tin tức, Cẩm nang là hai nhóm lớn cố định (bai-viet-moi.php eco_bv_muc_options cũng bỏ hai mã này) */
const RESERVED = new Set(['tin-tuc', 'cam-nang'])

/**
 * Chủ đề Cẩm nang Ecopillo sửa ở Nội dung web → Bài viết → "Chủ đề Cẩm nang" (owner 24/11/2026: thêm, xoá, sửa được):
 * tên chủ đề (nút lọc trang Tin tức, nhãn trên thẻ bài, đầu bài viết), thứ tự nút. Mã chủ đề có sẵn giữ nguyên; chủ đề mới lấy mã
 * theo tên lúc lưu lần đầu (cờ khoaDongTheoTieuDe, plugin noi-dung.php eco_nd_fill_row_keys) rồi giữ nguyên khi đổi tên (đợt I 24/11/2026),
 * nên bài đã chọn chủ đề không phải chọn lại. Dòng lưu trước đó chưa có mã: mã theo tên như trước (bai-viet-moi.php eco_bv_muc_options cũng vậy).
 * Xoá chủ đề: bài của chủ đề đó về nhóm theo chuyên mục WordPress (Tin tức / Cẩm nang).
 */
export const POST_TOPIC_SET: EditableSet = {
  khoa: 'chu-de-bai-viet',
  nhom: 'Bài viết',
  ten: 'Chủ đề Cẩm nang',
  moTa:
    'Các chủ đề của bài Cẩm nang: nút lọc trang Tin tức (theo thứ tự ở đây), nhãn trên thẻ bài, đầu bài viết. ' +
    'Bài chọn chủ đề ở ô "Mục trên web" khi soạn bài. Thêm chủ đề mới rồi lưu là ô đó có ngay chủ đề mới. Tin tức, Cẩm nang là hai nhóm cố định.',
  kieu: 'nhieu',
  goc: BASE_TOPIC_ROWS,
  tieuDeDong: 'ten',
  khoaDong: 'ma',
  truong: [
    {
      khoa: 'ten',
      nhan: 'Tên chủ đề',
      kieu: 'chu',
      batBuoc: true,
      goiY: 'Đổi tên được: bài đã chọn chủ đề này vẫn ở chủ đề này.',
    },
  ] satisfies EditableField[],
  khoaDongTheoTieuDe: true,
}

const TOPIC_ROWS = liveList<TopicRow>(POST_TOPIC_SET.khoa, BASE_TOPIC_ROWS, POST_TOPIC_SET.truong, (_i, row) => ({
  // Mã dòng (ô ẩn) lấy từ bản đã lưu: chủ đề mới giữ mã plugin đặt lúc lưu lần đầu
  ...(BASE_TOPIC_ROWS.find((r) => r.ma === rowKey(row.ma)) ?? { ma: rowKey(row.ma), ten: '' }),
}))

export interface PostTopicEntry {
  /** Mã lưu trong WordPress */
  id: string
  /**
   * Nhãn mã của chủ đề (Post.category, tham số ?chu-de= trên link): chủ đề gốc dùng tên gốc (link cũ giữ nguyên khi Ecopillo đổi tên),
   * chủ đề mới dùng mã (không trùng tên gốc, "Tin tức", "Cẩm nang")
   */
  key: string
  /** Tên hiện trên web */
  label: string
}

/** Chủ đề đang dùng, theo thứ tự Ecopillo xếp. Mã trùng, mã Tin tức / Cẩm nang, tên không ra mã thì bỏ */
export const POST_TOPIC_LIST: readonly PostTopicEntry[] = (() => {
  const used = new Set<string>()
  return TOPIC_ROWS.flatMap((row) => {
    const id = row.ma || slugify(row.ten)
    if (!id || used.has(id) || RESERVED.has(id)) return []
    used.add(id)
    return [{ id, key: BASE_TOPIC_ROWS.find((r) => r.ma === id)?.ten ?? id, label: row.ten }]
  })
})()

/** Nhãn mã các chủ đề Cẩm nang, theo thứ tự nút lọc */
export const POST_TOPICS: readonly string[] = POST_TOPIC_LIST.map((t) => t.key)
/** Nhãn mã của bài: "Tin tức", "Cẩm nang" (chưa có chủ đề) hoặc nhãn mã một chủ đề (POST_TOPICS) */
export type PostLabel = string

/** Mã lưu trong WordPress → nhãn mã trên web (ECO_BV_MUC_META ở bai-viet-moi.php lưu mã này) */
export const SECTION_LABELS: Readonly<Record<string, PostLabel>> = {
  'tin-tuc': 'Tin tức',
  ...Object.fromEntries(POST_TOPIC_LIST.map((t) => [t.id, t.key])),
}
export type PostSection = string

export const isPostSection = (v: unknown): v is PostSection => typeof v === 'string' && Object.prototype.hasOwnProperty.call(SECTION_LABELS, v)

/** Nhãn mã còn dùng được; chủ đề Ecopillo đã xoá thì về "Cẩm nang" */
export const knownLabel = (label: PostLabel): PostLabel =>
  label === 'Tin tức' || label === 'Cẩm nang' || POST_TOPICS.includes(label) ? label : 'Cẩm nang'

/** Tên hiện của một chủ đề (nhãn mã → tên Ecopillo đặt); không phải chủ đề thì undefined */
export const topicLabelText = (label: PostLabel): string | undefined => POST_TOPIC_LIST.find((t) => t.key === label)?.label

/** Bài thuộc nhóm lớn nào */
export const postGroupOf = (label: PostLabel): 'Tin tức' | 'Cẩm nang' => (label === 'Tin tức' ? 'Tin tức' : 'Cẩm nang')

/** Xếp sẵn 61 bài lúc duyệt (3 bài trong code + 58 bài WordPress) */
export const POST_SECTIONS: Readonly<Record<string, PostSection>> = {
  // Tin tức · Ecopillo
  'tri-an-15-000-khach-hang-nhan-qua-tu-ecopillo': 'tin-tuc',
  'ecopillo-chinh-thuc-khai-truong-chi-nhanh-da-nang': 'tin-tuc',
  'khai-truong-ecopillo-chi-nhanh-ho-chi-minh': 'tin-tuc',
  'ecopillo-dat-chung-nhan-hop-quy': 'tin-tuc',
  'cong-ty-tnhh-ecopillo-eternal-viet-nam-vinh-du-don-nhan-giai-thuong-top-10-thuong-hieu-dan-dau-viet-nam-2025': 'tin-tuc',
  'ecopillo-trao-130-chiec-chan-am-cho-130-ho-gia-dinh-co-hoan-canh-kho-khan-huyen-cam-xuyen': 'tin-tuc',
  'ecopillo-noi-moi-tam-chan-cu-viet-tiep-mot-cau-chuyen-tu-te': 'tin-tuc',
  // Cẩm nang · Chọn chăn ga gối đệm
  'vai-lyocell-la-gi': 'chon-chan-ga',
  'cach-chon-kich-thuoc-ga-giuong': 'chon-chan-ga',
  'cach-giat-va-bao-quan-chan-ga-lyocell': 'chon-chan-ga',
  'ga-giuong-cao-cap-ecopillo-chon-ga-trai-giuong-dep-phu-hop-cho-phong-ngu': 'chon-chan-ga',
  'topper-la-gi-khi-nao-thi-nen-su-dung-topper': 'chon-chan-ga',
  'chan-ga-goi-dem-cuoi-dep': 'chon-chan-ga',
  'chan-ga-goi-khach-san-ecopillo': 'chon-chan-ga',
  'nem-cao-su-thien-nhien-va-tat-ca-nhung-dieu-ban-can-biet-truoc-khi-mua': 'chon-chan-ga',
  'kich-thuoc-nem-chuan-hien-nay-cach-chon-nem-phu-hop-cho-phong-ngu': 'chon-chan-ga',
  'nem-cao-su-non-la-gi-co-nen-dung-nem-cao-su-non-khong': 'chon-chan-ga',
  'vai-lua-chat-lieu-vai-cao-cap-duoc-yeu-thich-nhat-hien-nay': 'chon-chan-ga',
  'vai-thun-la-gi-cac-loai-vai-thun-va-ung-dung-pho-bien': 'chon-chan-ga',
  'chan-long-cuu-chan-dong-am-ap-cho-gia-dinh-ban': 'chon-chan-ga',
  'cua-hang-chan-ga-goi-dem-gan-day-tai-ha-noi': 'chon-chan-ga',
  // Cẩm nang · Giấc ngủ và sức khoẻ
  'meo-hay-dut-diem-tinh-trang-ngu-day-bi-chong-mat': 'giac-ngu',
  'huong-dan-cach-nam-giam-dau-da-day-hieu-qua': 'giac-ngu',
  'cach-tam-khuya-an-toan-tranh-dot-quy': 'giac-ngu',
  'tu-the-nam-giam-dau-dau-hieu-qua-loi-khuyen-tu-chuyen-gia': 'giac-ngu',
  'kho-ngu-nen-uong-gi-top-05-thuc-uong-hieu-qua-nhanh': 'giac-ngu',
  'vi-sao-ngu-mo-mat-giai-ma-hien-tuong-ngu-mo-mat': 'giac-ngu',
  'uong-matcha-co-mat-ngu-khong-nhung-ai-khong-nen-uong': 'giac-ngu',
  'checklist-cac-dong-nhac-thu-gian-de-ngu-trong-15-phut': 'giac-ngu',
  'cach-tri-ho-ve-dem-cho-nguoi-lon-giam-ho-nhanh-hieu-qua': 'giac-ngu',
  'tim-hieu-thoi-gian-di-ngu-va-thuc-day-tot-nhat-danh-cho-tre-nho': 'giac-ngu',
  'roi-loan-giac-ngu-hanh-trinh-tim-lai-giac-ngu-ngon': 'giac-ngu',
  'hoat-huyet-duong-nao-nen-dung-hay-tim-giai-phap-ngu-ngon-tu-nhien': 'giac-ngu',
  // Cẩm nang · Phòng ngủ và phong thuỷ
  'mau-do-do-ung-dung-va-cach-phoi-mau-noi-that-phong-ngu-sang-trong': 'phong-ngu',
  'ke-giuong-ngu-quay-dau-huong-nao-tot': 'phong-ngu',
  'tai-sao-ngu-khong-duoc-quay-dau-ra-cua': 'phong-ngu',
  'giuong-gap-gon': 'phong-ngu',
  'giuong-sat-cao-cap': 'phong-ngu',
  'giuong-pallet-la-gi': 'phong-ngu',
  'cach-khu-mui-hoi-phong-ngu-don-gian-hieu-qua': 'phong-ngu',
  'phong-ngu-dep-huong-dan-thiet-ke-chi-tiet-tu-a-den-z': 'phong-ngu',
  'mau-hong-va-y-nghia-mau-hong-trong-cuoc-song': 'phong-ngu',
  'y-nghia-cua-mau-trang': 'phong-ngu',
  'mau-xanh-duong': 'phong-ngu',
  'menh-kim-hop-mau-gi': 'phong-ngu',
  'menh-moc-hop-mau-gi': 'phong-ngu',
  'menh-thuy-hop-mau-gi': 'phong-ngu',
  'menh-hoa-hop-mau-gi': 'phong-ngu',
  'menh-tho-hop-mau-gi': 'phong-ngu',
  'duong-lieu-moc-la-gi': 'phong-ngu',
  // Cẩm nang · Cưới hỏi, lễ tết
  'xem-ngay-cuoi-hop-tuoi-vo-chong-cach-tinh-va-cach-chon-ngay-tot': 'cuoi-hoi-le-tet',
  'bi-quyet-chuan-bi-trap-dam-ngo-dep': 'cuoi-hoi-le-tet',
  'hoa-cuoi-cam-tay-bi-quyet-lua-chon-hoa-mau-cuoi-dep': 'cuoi-hoi-le-tet',
  'nha-hang-tiec-cuoi-sang-trong-bac-nhat-tai-ha-noi': 'cuoi-hoi-le-tet',
  'giuong-cuoi-dep-sang-trong-cho-phong-tan-hon': 'cuoi-hoi-le-tet',
  '20-mau-trang-tri-phong-cuoi-dep-lang-man': 'cuoi-hoi-le-tet',
  'con-bao-nhieu-ngay-nua-den-tet-2026-tet-binh-ngo': 'cuoi-hoi-le-tet',
  'bao-nhieu-ngay-nua-den-trung-thu': 'cuoi-hoi-le-tet',
  'bao-nhieu-ngay-nua-den-noel': 'cuoi-hoi-le-tet',
  'y-nghia-ngay-vu-lan-bao-hieu-goi-y-qua-tang-cha-me': 'cuoi-hoi-le-tet',
  'thong-diep-bao-ve-moi-truong': 'cuoi-hoi-le-tet',
}
