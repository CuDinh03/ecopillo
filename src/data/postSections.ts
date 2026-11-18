/**
 * Nhóm của bài viết trên trang Tin tức (owner duyệt 18/11/2026, docs/de-xuat-phan-loai-bai-viet-18-11.html):
 * Tin tức là tin về chính Ecopillo; Cẩm nang là bài kiến thức, chia 4 chủ đề.
 * Bài mới / sửa trong WordPress: Ecopillo chọn ở ô "Mục trên web" khi soạn bài (plugin bai-viet-moi.php, khoá meta
 * `_eco_muc_web`), giá trị là các mã dưới đây; ô đó thắng bảng này. Không chọn mà bài không có trong bảng: theo chuyên mục
 * WordPress như trước (chuyên mục Tin tức → Tin tức, còn lại → Cẩm nang).
 */

export const POST_TOPICS = ['Chọn chăn ga gối đệm', 'Giấc ngủ và sức khoẻ', 'Phòng ngủ và phong thuỷ', 'Cưới hỏi, lễ tết'] as const
export type PostTopic = (typeof POST_TOPICS)[number]
/** Nhãn của bài: "Tin tức", "Cẩm nang" (chưa có chủ đề) hoặc một chủ đề Cẩm nang */
export type PostLabel = 'Tin tức' | 'Cẩm nang' | PostTopic

/** Mã lưu trong WordPress → nhãn trên web (khớp ECO_BV_MUC ở bai-viet-moi.php) */
export const SECTION_LABELS = {
  'tin-tuc': 'Tin tức',
  'chon-chan-ga': 'Chọn chăn ga gối đệm',
  'giac-ngu': 'Giấc ngủ và sức khoẻ',
  'phong-ngu': 'Phòng ngủ và phong thuỷ',
  'cuoi-hoi-le-tet': 'Cưới hỏi, lễ tết',
} as const satisfies Readonly<Record<string, PostLabel>>
export type PostSection = keyof typeof SECTION_LABELS

export const isPostSection = (v: unknown): v is PostSection => typeof v === 'string' && v in SECTION_LABELS

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
