import { liveList, rowKey, type EditableField, type EditableSet } from './liveContent'

/**
 * Bố cục từng trang Ecopillo tự đổi (owner 20/11/2026: "ecopillo cần tự làm hết được", chọn "bật/tắt, đổi thứ tự khối").
 * Nội dung web → Giao diện → "Bố cục …": mỗi dòng là một khối có sẵn của trang; Lên / Xuống để đổi thứ tự, "Ẩn" để tắt.
 * Kiểu dáng từng khối giữ nguyên (khung), nên đổi thứ tự không làm vỡ trang. Khối mới thêm trong code mà bản đã lưu chưa có
 * thì tự hiện ở cuối. Phần đầu trang (banner, tiêu đề trang) luôn đứng đầu, không nằm trong danh sách.
 * HTML dựng sẵn theo thứ tự gốc; khách xem luôn thấy thứ tự mới (main.tsx vẽ lại khi khác).
 */

export interface LayoutBlock {
  ma: string
  ten: string
}

const FIELDS: readonly EditableField[] = [
  { khoa: 'ten', nhan: 'Khối', kieu: 'chu', batBuoc: true, goiY: 'Tên để nhận ra khối; sửa tên này không đổi gì trên web' },
  { khoa: 'hien', nhan: 'Trên web', kieu: 'chon', batBuoc: true, luaChon: ['co', 'khong'], nhanLuaChon: ['Hiện', 'Ẩn'] },
]

interface LayoutRow {
  ma: string
  ten: string
  hien: string
}

/** Khai bố cục một trang: trả bộ để sửa và thứ tự các khối đang hiện (mã khối) */
export function defineLayout(khoa: string, ten: string, blocks: readonly LayoutBlock[]): { set: EditableSet; order: readonly string[] } {
  const goc: readonly LayoutRow[] = blocks.map((b) => ({ ma: b.ma, ten: b.ten, hien: 'co' }))
  const set: EditableSet = {
    khoa: `bo-cuc-${khoa}`,
    // Thêm, xoá dòng không có nghĩa (khối có sẵn trong trang): chỉ Lên / Xuống và Ẩn
    khongThemXoa: true,
    nhom: 'Giao diện',
    ten: `Bố cục ${ten}`,
    moTa: `Thứ tự các khối của ${ten}: bấm Lên / Xuống để đổi chỗ, chọn "Ẩn" để tắt một khối. "Trả về nội dung gốc" để về bố cục đã duyệt.`,
    kieu: 'nhieu',
    goc,
    tieuDeDong: 'ten',
    khoaDong: 'ma',
    truong: FIELDS,
  }
  // Dòng lạ (mã không có trong trang) ghép vào mẫu rỗng rồi bỏ
  const rows = liveList(set.khoa, goc, FIELDS, (_i, row) => goc.find((g) => rowKey(g.ma) === rowKey(row.ma)) ?? { ma: '', ten: '', hien: 'khong' })
  const seen = new Set<string>()
  const order: string[] = []
  for (const row of rows) {
    if (!row.ma || seen.has(row.ma)) continue
    seen.add(row.ma)
    if (row.hien !== 'khong') order.push(row.ma)
  }
  // Khối có trong code mà bản đã lưu chưa có: hiện ở cuối
  for (const b of blocks) if (!seen.has(b.ma)) order.push(b.ma)
  return { set, order }
}

/* ---------------------------------------------------------------- Các trang */

export const { set: HOME_DESKTOP_LAYOUT_SET, order: HOME_DESKTOP_ORDER } = defineLayout('trang-chu-may-tinh', 'trang chủ (máy tính)', [
  { ma: 'cam-ket', ten: 'Dải 5 cam kết' },
  { ma: 'chat-lieu', ten: 'Chất liệu (Từ thiên nhiên đến giấc ngủ)' },
  { ma: 'dem', ten: 'Bộ sưu tập đệm' },
  { ma: 'bo-suu-tap', ten: 'Bộ sưu tập chăn ga' },
  { ma: 'ruot', ten: 'Ruột chăn, ruột gối và phụ kiện' },
  { ma: 'thu-cam-on', ten: 'Thư cảm ơn (ưu đãi 5%)' },
  { ma: 've-chung-toi', ten: 'Về chúng tôi (cả sự kiện đồng hành)' },
  { ma: 'phim', ten: 'Phim thương hiệu' },
  { ma: 'khach-san', ten: 'Khách sạn và đối tác' },
  { ma: 'nhan-xet', ten: 'Nhận xét của khách' },
  { ma: 'phan-phoi', ten: 'Hệ thống phân phối' },
  { ma: 'hoi-dap', ten: 'Câu hỏi thường gặp' },
])

export const { set: HOME_MOBILE_LAYOUT_SET, order: HOME_MOBILE_ORDER } = defineLayout('trang-chu-dien-thoai', 'trang chủ (điện thoại)', [
  { ma: 'cam-ket', ten: 'Dải 5 cam kết' },
  { ma: 'chat-lieu', ten: 'Chất liệu (Từ thiên nhiên đến giấc ngủ)' },
  { ma: 'dem', ten: 'Bộ sưu tập đệm' },
  { ma: 'bo-suu-tap', ten: 'Bộ sưu tập chăn ga' },
  { ma: 'ruot', ten: 'Ruột chăn, ruột gối và phụ kiện' },
  { ma: 'thu-cam-on', ten: 'Thư cảm ơn (ưu đãi 5%)' },
  { ma: 'nhan-xet', ten: 'Nhận xét của khách' },
  { ma: 've-ecopillo', ten: 'Về Ecopillo (thẻ Câu chuyện, Phim, Khách sạn)' },
  { ma: 'phan-phoi', ten: 'Hệ thống phân phối' },
  { ma: 'hoi-dap', ten: 'Câu hỏi thường gặp' },
])

export const { set: HOTEL_LAYOUT_SET, order: HOTEL_ORDER } = defineLayout('khach-san', 'trang Khách sạn và dự án', [
  { ma: 'doi-tac', ten: 'Đối tác, chứng nhận' },
  { ma: 'hang-trang', ten: 'Hàng trắng khách sạn' },
  { ma: 'san-pham', ten: 'Sản phẩm cho khách sạn' },
  { ma: 'ly-do', ten: 'Câu trích nền chàm (Bền cho vận hành…)' },
  { ma: 'cach-lam', ten: 'Cách làm việc (5 bước)' },
  { ma: 'bao-gia', ten: 'Form nhận báo giá' },
])

export const { set: GIFTS_LAYOUT_SET, order: GIFTS_ORDER } = defineLayout('qua-tang', 'trang Quà tặng và sự kiện', [
  { ma: 'qua-doanh-nghiep', ten: 'Quà tặng doanh nghiệp' },
  { ma: 'thu-cam-on', ten: 'Thư cảm ơn (ưu đãi 5%)' },
  { ma: 'su-kien', ten: 'Sự kiện Ecopillo đồng hành' },
  { ma: 'chon-theo-dip', ten: 'Chọn theo từng dịp' },
  { ma: 'dich-vu', ten: 'Ecopillo lo phần còn lại' },
])

export const { set: RECRUIT_LAYOUT_SET, order: RECRUIT_ORDER } = defineLayout('tuyen-dai-ly', 'trang Tuyển đại lý', [
  { ma: 'mo-hinh', ten: 'Mô hình kinh doanh (bản đồ, ba trụ cột)' },
  { ma: 'dang-ky', ten: 'Đăng ký làm đại lý (quyền lợi, form)' },
])

export const { set: CONTACT_LAYOUT_SET, order: CONTACT_ORDER } = defineLayout('lien-he', 'trang Liên hệ mua hàng', [
  { ma: 'van-phong', ten: 'Văn phòng, chi nhánh' },
  { ma: 'diem-ban', ten: 'Điểm bán, tìm đại lý gần nhất' },
  { ma: 'tin-nhan', ten: 'Form gửi tin nhắn' },
])

// Đợt E5 (owner 24/11/2026 "kể cả về bố cục"): thêm bố cục các trang còn lại
export const { set: CATEGORY_LAYOUT_SET, order: CATEGORY_ORDER } = defineLayout('danh-muc', 'trang danh mục sản phẩm (mọi danh mục)', [
  { ma: 'san-pham', ten: 'Lưới sản phẩm' },
  { ma: 'phoi-mau', ten: 'Phối màu (danh mục bộ chăn ga)' },
  { ma: 'chon-the-nao', ten: 'Chọn thế nào' },
  { ma: 'xem-tat-ca', ten: 'Nút Xem tất cả sản phẩm' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

export const { set: PRODUCTS_LAYOUT_SET, order: PRODUCTS_ORDER } = defineLayout('san-pham', 'trang Sản phẩm (chỉ ẩn / hiện)', [
  { ma: 'cam-ket', ten: 'Bốn cam kết đầu trang' },
  { ma: 'o-nhom', ten: 'Ô nhóm sản phẩm (mục Tất cả)' },
  { ma: 'ke', ten: 'Các kệ sản phẩm (mục Tất cả)' },
  { ma: 'tim-theo-bo', ten: 'Hàng tìm theo bộ sưu tập' },
])

export const { set: PRODUCT_DETAIL_LAYOUT_SET, order: PRODUCT_DETAIL_ORDER } = defineLayout('san-pham-le', 'trang sản phẩm lẻ (phần dưới ảnh và giá)', [
  { ma: 'hieu-ky', ten: 'Hiểu kỹ trước khi chọn' },
  { ma: 'giao-hang', ten: 'Giao hàng, đổi trả & bảo hành' },
  { ma: 'danh-gia', ten: 'Đánh giá của khách (khi có)' },
  { ma: 'co-the-thich', ten: 'Có thể Quý khách thích' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

export const { set: COLLECTION_DETAIL_LAYOUT_SET, order: COLLECTION_DETAIL_ORDER } = defineLayout('bo-suu-tap', 'trang bộ sưu tập và từng mẫu (phần dưới)', [
  { ma: 'cung-gam', ten: 'Cùng gam màu ở bộ khác (khi lọc gam)' },
  { ma: 'giao-hang', ten: 'Giống nhau ở mọi phối màu (giao hàng, bảo hành)' },
  { ma: 'danh-gia', ten: 'Đánh giá của khách (khi có)' },
  { ma: 'co-the-thich', ten: 'Có thể Quý khách thích' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

// Đợt E6 (owner 24/11/2026: Ecopillo sửa được 100% web, kể cả bố cục): các trang còn lại
export const { set: ABOUT_LAYOUT_SET, order: ABOUT_ORDER } = defineLayout('gioi-thieu', 'trang Giới thiệu', [
  { ma: 'muc-luc', ten: 'Mục lục' },
  { ma: 'loi-mo', ten: 'Lời mở' },
  { ma: 'thu-sang-lap', ten: 'Chia sẻ từ người sáng lập' },
  { ma: 'chuong-1', ten: 'Chương: Người làm nghề (người sáng lập)' },
  { ma: 'chuong-2', ten: 'Chương: Chốn Yên (khát vọng)' },
  { ma: 'chuong-3', ten: 'Chương: Triết lý kinh doanh (Tốt · Thật · Thiện)' },
  { ma: 'chuong-4', ten: 'Chương: Từ sợi gỗ đến giấc ngủ (chất liệu, quy trình)' },
  { ma: 'phim', ten: 'Phim thương hiệu' },
  { ma: 'chuong-5', ten: 'Chương: Điều chúng tôi theo đuổi (sứ mệnh, tầm nhìn, giá trị)' },
  { ma: 'chuong-6', ten: 'Chương: Được ghi nhận (con số, chứng nhận, báo chí, đối tác)' },
  { ma: 'cam-ket', ten: 'Dải cam kết' },
  { ma: 'loi-ket', ten: 'Lời kết (mời ghé thăm)' },
])

export const { set: BLOG_LAYOUT_SET, order: BLOG_ORDER } = defineLayout('tin-tuc', 'trang Tin tức', [
  { ma: 'chu-de', ten: 'Nút lọc chủ đề' },
  { ma: 'bai-viet', ten: 'Danh sách bài viết (cả nút Xem thêm)' },
])

export const { set: ARTICLE_LAYOUT_SET, order: ARTICLE_ORDER } = defineLayout('bai-viet', 'trang từng bài viết (dưới tiêu đề)', [
  { ma: 'anh-bia', ten: 'Ảnh bìa' },
  { ma: 'than-bai', ten: 'Thân bài' },
  { ma: 'quan-tam', ten: 'Có thể Quý khách quan tâm (link trong bài, khi có)' },
  { ma: 'tu-van', ten: 'Khung cần tư vấn (gọi, Zalo)' },
  { ma: 'bai-khac', ten: 'Bài viết khác' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

export const { set: FAQ_LAYOUT_SET, order: FAQ_ORDER } = defineLayout('hoi-dap', 'trang Hỏi đáp (chỉ ẩn / hiện)', [
  { ma: 'loi-tat', ten: 'Nút sang các trang chính sách (đầu trang)' },
  { ma: 'cau-hoi', ten: 'Câu hỏi thường gặp' },
])

export const { set: POLICY_LAYOUT_SET, order: POLICY_ORDER } = defineLayout('chinh-sach', 'các trang chính sách (khung chung)', [
  // Menu luôn nằm cột trái (điện thoại: trên cùng), Lên / Xuống không đổi chỗ, chỉ Ẩn được
  { ma: 'menu', ten: 'Menu chính sách (chỉ ẩn / hiện, luôn ở cột trái)' },
  { ma: 'noi-dung', ten: 'Nội dung chính sách' },
  { ma: 'lien-he', ten: 'Khung còn chưa rõ (gọi, Zalo)' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

export const { set: POLICY_CONTENT_LAYOUT_SET, order: POLICY_CONTENT_ORDER } = defineLayout(
  'chinh-sach-noi-dung',
  'nội dung trang chính sách (giao hàng, thanh toán, đổi hàng, bảo hành, hướng dẫn mua hàng)',
  [
    { ma: 'the', ten: 'Các thẻ số nổi bật' },
    { ma: 'muc', ten: 'Các mục chính sách' },
  ],
)

export const { set: PRIVACY_LAYOUT_SET, order: PRIVACY_ORDER } = defineLayout('bao-ve-thong-tin', 'nội dung trang Bảo vệ thông tin cá nhân', [
  { ma: 'muc', ten: 'Các mục chính sách' },
  { ma: 'lien-he', ten: 'Mục liên hệ (hotline, email, địa chỉ)' },
])

export const { set: ORDER_LAYOUT_SET, order: ORDER_LAYOUT_ORDER } = defineLayout('dat-hang', 'trang Đặt hàng và lời cảm ơn (chỉ ẩn / hiện)', [
  { ma: 'hotline', ten: 'Dòng Cần tư vấn? hotline (dưới tiêu đề)' },
  { ma: 'cam-ket', ten: 'Cam kết dưới tóm tắt đơn' },
  { ma: 'cam-on-buoc', ten: 'Lời cảm ơn: ba bước tiếp theo' },
  { ma: 'cam-on-chi-tiet', ten: 'Lời cảm ơn: chi tiết đơn' },
  { ma: 'cam-on-lien-he', ten: 'Lời cảm ơn: cần đổi gì thì gọi (nút gọi, Zalo)' },
])
/** Khối tuỳ chọn đang hiện ở trang Đặt hàng (form các bước không bao giờ ẩn) */
export const ORDER_SHOWN: ReadonlySet<string> = new Set(ORDER_LAYOUT_ORDER)

export const { set: NOT_FOUND_LAYOUT_SET, order: NOT_FOUND_ORDER } = defineLayout('khong-tim-thay', 'trang không tìm thấy (404)', [
  { ma: 'goi-y', ten: 'Link gợi ý' },
  { ma: 'trang-chu', ten: 'Nút về trang chủ' },
])

export const LAYOUT_SETS: readonly EditableSet[] = [
  HOME_DESKTOP_LAYOUT_SET,
  HOME_MOBILE_LAYOUT_SET,
  HOTEL_LAYOUT_SET,
  GIFTS_LAYOUT_SET,
  RECRUIT_LAYOUT_SET,
  CONTACT_LAYOUT_SET,
  CATEGORY_LAYOUT_SET,
  PRODUCTS_LAYOUT_SET,
  PRODUCT_DETAIL_LAYOUT_SET,
  COLLECTION_DETAIL_LAYOUT_SET,
  ABOUT_LAYOUT_SET,
  BLOG_LAYOUT_SET,
  ARTICLE_LAYOUT_SET,
  FAQ_LAYOUT_SET,
  POLICY_LAYOUT_SET,
  POLICY_CONTENT_LAYOUT_SET,
  PRIVACY_LAYOUT_SET,
  ORDER_LAYOUT_SET,
  NOT_FOUND_LAYOUT_SET,
]
