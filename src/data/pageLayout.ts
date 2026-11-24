import { defineFreeBlocks, freeId, type FreeBlockRow, type FreePlace } from './freeBlocks'
import { liveList, rowKey, type EditableField, type EditableSet } from './liveContent'

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

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

interface LayoutDef {
  khoa: string
  ten: string
  blocks: readonly LayoutBlock[]
  /**
   * Khối tự do: true = chèn được sau từng khối (trang vẽ thứ tự bằng <Blocks>, trang Giới thiệu); "cuoi" = chỉ cuối trang
   * (trang chỉ ẩn / hiện khối, vẽ khối tự do bằng FREE_AT_END); false = không có
   */
  tuDo: boolean | 'cuoi'
}

const def = (khoa: string, ten: string, blocks: readonly LayoutBlock[], tuDo: boolean | 'cuoi' = true): LayoutDef => ({ khoa, ten, blocks, tuDo })

/** Khai bố cục một trang: trả bộ để sửa và thứ tự các khối đang hiện (mã khối, cả khối tự do "tu-do-N") */
function defineLayout({ khoa, ten, blocks, tuDo }: LayoutDef): { set: EditableSet; order: readonly string[]; cuoi: readonly string[] } {
  const goc: readonly LayoutRow[] = blocks.map((b) => ({ ma: b.ma, ten: b.ten, hien: 'co' }))
  const set: EditableSet = {
    khoa: `bo-cuc-${khoa}`,
    // Thêm, xoá dòng không có nghĩa (khối có sẵn trong trang): chỉ Lên / Xuống và Ẩn. Khối mới: bộ "Khối tự do"
    khongThemXoa: true,
    nhom: 'Giao diện',
    ten: `Bố cục ${ten}`,
    moTa: `Thứ tự các khối của ${ten}: bấm Lên / Xuống để đổi chỗ, chọn "Ẩn" để tắt một khối. "Trả về nội dung gốc" để về bố cục đã duyệt.${
      tuDo ? ' Muốn thêm khối mới vào trang này: Giao diện → Khối tự do.' : ''
    }`,
    kieu: 'nhieu',
    goc,
    tieuDeDong: 'ten',
    khoaDong: 'ma',
    truong: FIELDS,
  }
  // Dòng lạ (mã không có trong trang) ghép vào mẫu rỗng rồi bỏ
  const rows = liveList(set.khoa, goc, FIELDS, (_i, row) => goc.find((g) => rowKey(g.ma) === rowKey(row.ma)) ?? { ma: '', ten: '', hien: 'khong' })
  const seen = new Set<string>()
  const full: { ma: string; hien: boolean }[] = []
  for (const row of rows) {
    if (!row.ma || seen.has(row.ma)) continue
    seen.add(row.ma)
    full.push({ ma: row.ma, hien: row.hien !== 'khong' })
  }
  // Khối có trong code mà bản đã lưu chưa có: hiện ở cuối
  for (const b of blocks) if (!seen.has(b.ma)) full.push({ ma: b.ma, hien: true })
  // Khối tự do: ngay sau khối đã chọn (kể cả khối đang ẩn), đầu trang hoặc cuối trang; cùng chỗ thì theo thứ tự trong bộ Khối tự do
  const freeAt = (place: string): string[] =>
    tuDo ? FREE.rows.flatMap((row, i) => (row.hien !== 'khong' && row.viTri.includes(`${khoa}@${place}`) ? [freeId(i)] : [])) : []
  if (tuDo !== true) return { set, order: full.filter((b) => b.hien).map((b) => b.ma), cuoi: freeAt('cuoi') }
  const order = [...freeAt('dau'), ...full.flatMap((b) => [...(b.hien ? [b.ma] : []), ...freeAt(b.ma)])]
  return { set, order, cuoi: [] }
}

/* ---------------------------------------------------------------- Các trang */

const DEF_HOME_DESKTOP_LAYOUT_SET = def('trang-chu-may-tinh', 'trang chủ (máy tính)', [
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

const DEF_HOME_MOBILE_LAYOUT_SET = def('trang-chu-dien-thoai', 'trang chủ (điện thoại)', [
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

const DEF_HOTEL_LAYOUT_SET = def('khach-san', 'trang Khách sạn và dự án', [
  { ma: 'doi-tac', ten: 'Đối tác, chứng nhận' },
  { ma: 'hang-trang', ten: 'Hàng trắng khách sạn' },
  { ma: 'san-pham', ten: 'Sản phẩm cho khách sạn' },
  { ma: 'ly-do', ten: 'Câu trích nền chàm (Bền cho vận hành…)' },
  { ma: 'cach-lam', ten: 'Cách làm việc (5 bước)' },
  { ma: 'bao-gia', ten: 'Form nhận báo giá' },
])

const DEF_GIFTS_LAYOUT_SET = def('qua-tang', 'trang Quà tặng và sự kiện', [
  { ma: 'qua-doanh-nghiep', ten: 'Quà tặng doanh nghiệp' },
  { ma: 'thu-cam-on', ten: 'Thư cảm ơn (ưu đãi 5%)' },
  { ma: 'su-kien', ten: 'Sự kiện Ecopillo đồng hành' },
  { ma: 'chon-theo-dip', ten: 'Chọn theo từng dịp' },
  { ma: 'dich-vu', ten: 'Ecopillo lo phần còn lại' },
])

const DEF_RECRUIT_LAYOUT_SET = def('tuyen-dai-ly', 'trang Tuyển đại lý', [
  { ma: 'mo-hinh', ten: 'Mô hình kinh doanh (bản đồ, ba trụ cột)' },
  { ma: 'dang-ky', ten: 'Đăng ký làm đại lý (quyền lợi, form)' },
])

const DEF_CONTACT_LAYOUT_SET = def('lien-he', 'trang Liên hệ mua hàng', [
  { ma: 'van-phong', ten: 'Văn phòng, chi nhánh' },
  { ma: 'diem-ban', ten: 'Điểm bán, tìm đại lý gần nhất' },
  { ma: 'tin-nhan', ten: 'Form gửi tin nhắn' },
])

// Đợt E5 (owner 24/11/2026 "kể cả về bố cục"): thêm bố cục các trang còn lại
const DEF_CATEGORY_LAYOUT_SET = def('danh-muc', 'trang danh mục sản phẩm (mọi danh mục)', [
  { ma: 'san-pham', ten: 'Lưới sản phẩm' },
  { ma: 'phoi-mau', ten: 'Phối màu (danh mục bộ chăn ga)' },
  { ma: 'chon-the-nao', ten: 'Chọn thế nào' },
  { ma: 'xem-tat-ca', ten: 'Nút Xem tất cả sản phẩm' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

const DEF_PRODUCTS_LAYOUT_SET = def('san-pham', 'trang Sản phẩm (chỉ ẩn / hiện)', [
  { ma: 'cam-ket', ten: 'Bốn cam kết đầu trang' },
  { ma: 'o-nhom', ten: 'Ô nhóm sản phẩm (mục Tất cả)' },
  { ma: 'ke', ten: 'Các kệ sản phẩm (mục Tất cả)' },
  { ma: 'tim-theo-bo', ten: 'Hàng tìm theo bộ sưu tập' },
], 'cuoi')

const DEF_PRODUCT_DETAIL_LAYOUT_SET = def('san-pham-le', 'trang sản phẩm lẻ (phần dưới ảnh và giá)', [
  { ma: 'hieu-ky', ten: 'Hiểu kỹ trước khi chọn' },
  { ma: 'giao-hang', ten: 'Giao hàng, đổi trả & bảo hành' },
  { ma: 'danh-gia', ten: 'Đánh giá của khách (khi có)' },
  { ma: 'co-the-thich', ten: 'Có thể Quý khách thích' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

const DEF_COLLECTION_DETAIL_LAYOUT_SET = def('bo-suu-tap', 'trang bộ sưu tập và từng mẫu (phần dưới)', [
  { ma: 'cung-gam', ten: 'Cùng gam màu ở bộ khác (khi lọc gam)' },
  { ma: 'giao-hang', ten: 'Giống nhau ở mọi phối màu (giao hàng, bảo hành)' },
  { ma: 'danh-gia', ten: 'Đánh giá của khách (khi có)' },
  { ma: 'co-the-thich', ten: 'Có thể Quý khách thích' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

// Đợt E6 (owner 24/11/2026: Ecopillo sửa được 100% web, kể cả bố cục): các trang còn lại
const DEF_ABOUT_LAYOUT_SET = def('gioi-thieu', 'trang Giới thiệu', [
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

const DEF_BLOG_LAYOUT_SET = def('tin-tuc', 'trang Tin tức', [
  { ma: 'chu-de', ten: 'Nút lọc chủ đề' },
  { ma: 'bai-viet', ten: 'Danh sách bài viết (cả nút Xem thêm)' },
])

const DEF_ARTICLE_LAYOUT_SET = def('bai-viet', 'trang từng bài viết (dưới tiêu đề)', [
  { ma: 'anh-bia', ten: 'Ảnh bìa' },
  { ma: 'than-bai', ten: 'Thân bài' },
  { ma: 'quan-tam', ten: 'Có thể Quý khách quan tâm (link trong bài, khi có)' },
  { ma: 'tu-van', ten: 'Khung cần tư vấn (gọi, Zalo)' },
  { ma: 'bai-khac', ten: 'Bài viết khác' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

const DEF_FAQ_LAYOUT_SET = def('hoi-dap', 'trang Hỏi đáp (chỉ ẩn / hiện)', [
  { ma: 'loi-tat', ten: 'Nút sang các trang chính sách (đầu trang)' },
  { ma: 'cau-hoi', ten: 'Câu hỏi thường gặp' },
], 'cuoi')

const DEF_POLICY_LAYOUT_SET = def('chinh-sach', 'các trang chính sách (khung chung)', [
  // Menu luôn nằm cột trái (điện thoại: trên cùng), Lên / Xuống không đổi chỗ, chỉ Ẩn được
  { ma: 'menu', ten: 'Menu chính sách (chỉ ẩn / hiện, luôn ở cột trái)' },
  { ma: 'noi-dung', ten: 'Nội dung chính sách' },
  { ma: 'lien-he', ten: 'Khung còn chưa rõ (gọi, Zalo)' },
  { ma: 'kham-pha', ten: 'Khám phá thêm (link liên quan)' },
])

const DEF_POLICY_CONTENT_LAYOUT_SET = def(
  'chinh-sach-noi-dung',
  'nội dung trang chính sách (giao hàng, thanh toán, đổi hàng, bảo hành, hướng dẫn mua hàng)',
  [
    { ma: 'the', ten: 'Các thẻ số nổi bật' },
    { ma: 'muc', ten: 'Các mục chính sách' },
  ],
  false,
)

const DEF_PRIVACY_LAYOUT_SET = def('bao-ve-thong-tin', 'nội dung trang Bảo vệ thông tin cá nhân', [
  { ma: 'muc', ten: 'Các mục chính sách' },
  { ma: 'lien-he', ten: 'Mục liên hệ (hotline, email, địa chỉ)' },
], false)

const DEF_ORDER_LAYOUT_SET = def('dat-hang', 'trang Đặt hàng và lời cảm ơn (chỉ ẩn / hiện)', [
  { ma: 'hotline', ten: 'Dòng Cần tư vấn? hotline (dưới tiêu đề)' },
  { ma: 'cam-ket', ten: 'Cam kết dưới tóm tắt đơn' },
  // Owner 24/11/2026 (sau đợt G): phần không bắt buộc của form cũng ẩn được; các bước và ô bắt buộc thì luôn hiện
  { ma: 'qua-kem', ten: 'Bước chọn cỡ: khung quà tặng kèm (khi bộ có quà)' },
  { ma: 'ghi-chu', ten: 'Bước thông tin: ô Ghi chú (không bắt buộc)' },
  { ma: 'thanh-toan', ten: 'Bước thông tin: khung thanh toán, phí giao, tài khoản nhận cọc' },
  { ma: 'cam-on-buoc', ten: 'Lời cảm ơn: ba bước tiếp theo' },
  { ma: 'cam-on-chi-tiet', ten: 'Lời cảm ơn: chi tiết đơn' },
  { ma: 'cam-on-lien-he', ten: 'Lời cảm ơn: cần đổi gì thì gọi (nút gọi, Zalo)' },
], false)

const DEF_NOT_FOUND_LAYOUT_SET = def('khong-tim-thay', 'trang không tìm thấy (404)', [
  { ma: 'goi-y', ten: 'Link gợi ý' },
  { ma: 'trang-chu', ten: 'Nút về trang chủ' },
], false)

/* ---------------------------------------------------------------- Khối tự do và thứ tự cuối */

const DEFS: readonly LayoutDef[] = [
  DEF_HOME_DESKTOP_LAYOUT_SET,
  DEF_HOME_MOBILE_LAYOUT_SET,
  DEF_HOTEL_LAYOUT_SET,
  DEF_GIFTS_LAYOUT_SET,
  DEF_RECRUIT_LAYOUT_SET,
  DEF_CONTACT_LAYOUT_SET,
  DEF_CATEGORY_LAYOUT_SET,
  DEF_PRODUCTS_LAYOUT_SET,
  DEF_PRODUCT_DETAIL_LAYOUT_SET,
  DEF_COLLECTION_DETAIL_LAYOUT_SET,
  DEF_ABOUT_LAYOUT_SET,
  DEF_BLOG_LAYOUT_SET,
  DEF_ARTICLE_LAYOUT_SET,
  DEF_FAQ_LAYOUT_SET,
  DEF_POLICY_LAYOUT_SET,
  DEF_POLICY_CONTENT_LAYOUT_SET,
  DEF_PRIVACY_LAYOUT_SET,
  DEF_ORDER_LAYOUT_SET,
  DEF_NOT_FOUND_LAYOUT_SET,
]

/** Mọi chỗ đặt khối tự do: đầu phần đổi được của trang, hoặc ngay sau từng khối có sẵn */
const PLACES: readonly FreePlace[] = DEFS.flatMap((d) =>
  d.tuDo === 'cuoi'
    ? [{ value: `${d.khoa}@cuoi`, label: `${capitalize(d.ten.replace(/ \(chỉ ẩn \/ hiện\)$/, ''))}: cuối trang` }]
    : !d.tuDo
      ? []
      : [
          { value: `${d.khoa}@dau`, label: `${capitalize(d.ten)}: đầu trang (trên mọi khối đổi được)` },
          ...d.blocks.map((b) => ({ value: `${d.khoa}@${b.ma}`, label: `${capitalize(d.ten)}: sau "${b.ten}"` })),
        ],
)

const FREE = defineFreeBlocks(PLACES)
export const FREE_BLOCKS_SET: EditableSet = FREE.set
/** Khối tự do Ecopillo đã lưu, theo thứ tự (mã "tu-do-N" trong thứ tự trang là dòng thứ N) */
export const FREE_BLOCKS: readonly FreeBlockRow[] = FREE.rows

export const { set: HOME_DESKTOP_LAYOUT_SET, order: HOME_DESKTOP_ORDER } = defineLayout(DEF_HOME_DESKTOP_LAYOUT_SET)
export const { set: HOME_MOBILE_LAYOUT_SET, order: HOME_MOBILE_ORDER } = defineLayout(DEF_HOME_MOBILE_LAYOUT_SET)
export const { set: HOTEL_LAYOUT_SET, order: HOTEL_ORDER } = defineLayout(DEF_HOTEL_LAYOUT_SET)
export const { set: GIFTS_LAYOUT_SET, order: GIFTS_ORDER } = defineLayout(DEF_GIFTS_LAYOUT_SET)
export const { set: RECRUIT_LAYOUT_SET, order: RECRUIT_ORDER } = defineLayout(DEF_RECRUIT_LAYOUT_SET)
export const { set: CONTACT_LAYOUT_SET, order: CONTACT_ORDER } = defineLayout(DEF_CONTACT_LAYOUT_SET)
export const { set: CATEGORY_LAYOUT_SET, order: CATEGORY_ORDER } = defineLayout(DEF_CATEGORY_LAYOUT_SET)
export const { set: PRODUCTS_LAYOUT_SET, order: PRODUCTS_ORDER, cuoi: PRODUCTS_FREE_END } = defineLayout(DEF_PRODUCTS_LAYOUT_SET)
export const { set: PRODUCT_DETAIL_LAYOUT_SET, order: PRODUCT_DETAIL_ORDER } = defineLayout(DEF_PRODUCT_DETAIL_LAYOUT_SET)
export const { set: COLLECTION_DETAIL_LAYOUT_SET, order: COLLECTION_DETAIL_ORDER } = defineLayout(DEF_COLLECTION_DETAIL_LAYOUT_SET)
export const { set: ABOUT_LAYOUT_SET, order: ABOUT_ORDER } = defineLayout(DEF_ABOUT_LAYOUT_SET)
export const { set: BLOG_LAYOUT_SET, order: BLOG_ORDER } = defineLayout(DEF_BLOG_LAYOUT_SET)
export const { set: ARTICLE_LAYOUT_SET, order: ARTICLE_ORDER } = defineLayout(DEF_ARTICLE_LAYOUT_SET)
export const { set: FAQ_LAYOUT_SET, order: FAQ_ORDER, cuoi: FAQ_FREE_END } = defineLayout(DEF_FAQ_LAYOUT_SET)
export const { set: POLICY_LAYOUT_SET, order: POLICY_ORDER } = defineLayout(DEF_POLICY_LAYOUT_SET)
export const { set: POLICY_CONTENT_LAYOUT_SET, order: POLICY_CONTENT_ORDER } = defineLayout(DEF_POLICY_CONTENT_LAYOUT_SET)
export const { set: PRIVACY_LAYOUT_SET, order: PRIVACY_ORDER } = defineLayout(DEF_PRIVACY_LAYOUT_SET)
export const { set: ORDER_LAYOUT_SET, order: ORDER_LAYOUT_ORDER } = defineLayout(DEF_ORDER_LAYOUT_SET)
export const { set: NOT_FOUND_LAYOUT_SET, order: NOT_FOUND_ORDER } = defineLayout(DEF_NOT_FOUND_LAYOUT_SET)

/** Khối tuỳ chọn đang hiện ở trang Đặt hàng (form các bước không bao giờ ẩn) */
export const ORDER_SHOWN: ReadonlySet<string> = new Set(ORDER_LAYOUT_ORDER)

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
  FREE_BLOCKS_SET,
]
