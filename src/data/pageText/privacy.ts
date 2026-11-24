import { BRAND } from '../brand'
import { liveList, type EditableField, type EditableSet } from '../liveContent'
import { chu, definePageText, doan } from './define'

/**
 * Chính sách bảo vệ thông tin cá nhân theo Nghị định 13/2023/NĐ-CP (biên bản chốt mục 62). Bên thực hiện soạn; mã số doanh nghiệp,
 * địa chỉ và thời gian lưu theo web cũ. Ecopillo tự sửa ở Nội dung web → Trang chính sách (owner 20/11/2026).
 * 20/11/2026: bỏ "thu tiền khi giao" ở phần 3, 4 (thông báo Ecopillo từ 07/08/2026: chuyển khoản, không thu tiền mặt khi giao).
 */
export interface PrivacySection {
  title: string
  body: readonly string[]
}

const BASE_SECTIONS: readonly PrivacySection[] = [
  {
    title: '1. Bên xử lý thông tin',
    body: [
      `${BRAND.company} (gọi tắt là Ecopillo) là bên kiểm soát và xử lý thông tin cá nhân Quý khách cung cấp trên website ecopillo.com.vn.`,
      'Mã số doanh nghiệp: 0110682605 do Sở Kế hoạch và Đầu tư TP. Hà Nội cấp. Địa chỉ: Số 273 Xã Đàn, phường Nam Đồng, quận Đống Đa, thành phố Hà Nội.',
    ],
  },
  {
    title: '2. Thông tin Ecopillo thu thập',
    body: [
      'Khi Quý khách đặt hàng: họ tên, số điện thoại, địa chỉ nhận hàng (tỉnh/thành, địa chỉ chi tiết) và ghi chú cho đơn hàng nếu có.',
      'Khi Quý khách liên hệ qua điện thoại, Zalo, Facebook: tên hiển thị, số điện thoại và nội dung trao đổi.',
      'Thông tin kỹ thuật khi truy cập web (loại thiết bị, trình duyệt, trang đã xem) qua công cụ đo lường quảng cáo của Google và Facebook, không gắn với họ tên của Quý khách.',
      'Ecopillo không thu thập dữ liệu cá nhân nhạy cảm và không lưu thông tin thẻ ngân hàng trên web.',
    ],
  },
  {
    title: '3. Mục đích sử dụng',
    body: [
      'Gọi điện xác nhận đơn hàng và giao hàng.',
      'Hỗ trợ đổi hàng, bảo hành và trả lời câu hỏi của Quý khách.',
      'Gửi thông tin ưu đãi, chỉ khi Quý khách đồng ý nhận. Quý khách có thể từ chối bất cứ lúc nào.',
      'Ecopillo không bán, cho thuê hay trao đổi thông tin cá nhân của Quý khách với bên khác vì mục đích thương mại.',
    ],
  },
  {
    title: '4. Bên được nhận thông tin',
    body: [
      'Đơn vị vận chuyển: chỉ nhận tên, số điện thoại, địa chỉ để giao hàng.',
      'Nhà cung cấp dịch vụ lưu trữ website và email: chỉ lưu giữ, không được dùng vào mục đích khác.',
      'Cơ quan nhà nước có thẩm quyền khi có yêu cầu theo quy định của pháp luật.',
    ],
  },
  {
    title: '5. Lưu trữ và bảo vệ',
    body: [
      'Thông tin đơn hàng được lưu trên hệ thống quản trị website của Ecopillo, chỉ người được phân công xử lý đơn mới xem được.',
      'Thông tin được lưu cho tới khi Quý khách yêu cầu xoá, trừ trường hợp pháp luật yêu cầu lưu lâu hơn (ví dụ chứng từ kế toán).',
      'Khi phát hiện sự cố lộ lọt thông tin, Ecopillo sẽ thông báo cho Quý khách và cơ quan có thẩm quyền theo thời hạn Nghị định 13/2023/NĐ-CP quy định.',
    ],
  },
  {
    title: '6. Quyền của Quý khách',
    body: [
      'Được biết thông tin nào đang được lưu, được xem, sửa hoặc yêu cầu xoá thông tin của mình.',
      'Được rút lại sự đồng ý, phản đối hoặc yêu cầu hạn chế việc xử lý thông tin.',
      'Được khiếu nại, tố cáo, khởi kiện và yêu cầu bồi thường theo quy định của pháp luật.',
      'Ecopillo phản hồi yêu cầu trong thời hạn Nghị định 13/2023/NĐ-CP quy định.',
    ],
  },
  {
    title: '7. Sự đồng ý của Quý khách',
    body: ['Khi bấm "Đặt hàng", Quý khách đồng ý để Ecopillo dùng thông tin đã điền cho các mục đích ở phần 3 của chính sách này.'],
  },
]

const SECTION_FIELDS: readonly EditableField[] = [
  { khoa: 'title', nhan: 'Tiêu đề phần (có số thứ tự)', kieu: 'chu', batBuoc: true },
  { khoa: 'body', nhan: 'Các ý (mỗi dòng một ý)', kieu: 'ds-dong', batBuoc: true },
]

export const PRIVACY_SECTIONS_SET: EditableSet = {
  khoa: 'chinh-sach-bao-ve-thong-tin',
  nhom: 'Trang chính sách',
  ten: 'Chính sách bảo vệ thông tin cá nhân',
  moTa: 'Các phần của trang Chính sách bảo vệ thông tin cá nhân (phần cuối "Liên hệ" tự lấy hotline, email, văn phòng).',
  kieu: 'nhieu',
  goc: BASE_SECTIONS,
  tieuDeDong: 'title',
  truong: SECTION_FIELDS,
}

export const PRIVACY_SECTIONS: readonly PrivacySection[] = liveList(PRIVACY_SECTIONS_SET.khoa, BASE_SECTIONS, SECTION_FIELDS, () => ({
  title: '',
  body: [],
}))

export const { set: PRIVACY_TEXT_SET, text: PRIVACY_TEXT } = definePageText(
  'bao-ve-thong-tin',
  'Trang Bảo vệ thông tin cá nhân: đầu trang',
  'Tên trang, mô tả Google, đoạn mở đầu, tiêu đề phần Liên hệ của trang Chính sách bảo vệ thông tin cá nhân.',
  {
    tieuDe: chu('Tên trang', 'Chính sách bảo vệ thông tin cá nhân'),
    moTaGoogle: doan('Mô tả trên Google', 'Ecopillo thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng theo Nghị định 13/2023/NĐ-CP.'),
    moDau: doan(
      'Đoạn mở đầu',
      'Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Ecopillo chỉ dùng thông tin Quý khách cung cấp để giao hàng và chăm sóc khách hàng.',
    ),
    lienHeTieuDe: chu('Tiêu đề phần Liên hệ', '8. Liên hệ về thông tin cá nhân'),
    lienHeHotline: chu('Phần Liên hệ: chữ trước số hotline', 'Hotline/Zalo:', 'Số hotline lấy ở bộ Thông tin liên hệ'),
    lienHeEmail: chu('Phần Liên hệ: chữ trước email', 'Email:', 'Email lấy ở bộ Thông tin liên hệ'),
  },
)
