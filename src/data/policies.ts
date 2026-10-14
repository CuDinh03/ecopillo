import { CONTACT, OPENING_HOURS } from './brand'
import type { PolicySlug } from './policyNav'

/**
 * Các trang chính sách (web cũ có 7 trang chính sách; giữ đúng đường link cũ khi có quyền vào WordPress).
 * Nội dung theo biên bản chốt 12/10/2026 mục 35–38, 47, 50 và câu hỏi thường gặp; Ecopillo duyệt lại câu chữ.
 * Phần [ĐIỀN …] là chỗ Ecopillo cần bổ sung.
 */

export interface PolicySection {
  title: string
  /** Đoạn văn */
  body?: readonly string[]
  /** Danh sách gạch đầu dòng */
  list?: readonly string[]
  /** Các bước có số thứ tự */
  steps?: readonly { title: string; text: string }[]
}

export interface Policy {
  slug: PolicySlug
  title: string
  description: string
  intro: string
  /** 3 ý chính hiện thành thẻ ở đầu trang */
  highlights: readonly { value: string; label: string }[]
  sections: readonly PolicySection[]
}

export const POLICIES: readonly Policy[] = [
  {
    slug: 'huong-dan-mua-hang',
    title: 'Hướng dẫn mua hàng online',
    description: 'Đặt chăn ga gối đệm Ecopillo trên web trong 3 bước, nhân viên gọi xác nhận, nhận hàng kiểm rồi mới trả tiền.',
    intro:
      'Quý khách đặt hàng trên web, gọi hotline hoặc nhắn Zalo đều được. Đặt trên web chỉ mất khoảng một phút, Ecopillo gọi xác nhận trước khi giao.',
    highlights: [
      { value: '3 bước', label: 'Chọn mẫu, chọn kích thước, điền thông tin' },
      { value: 'Gọi xác nhận', label: 'Nhân viên gọi lại trước khi giao' },
      { value: 'Trả khi nhận', label: 'Kiểm hàng xong mới thanh toán' },
    ],
    sections: [
      {
        title: 'Đặt hàng trên web',
        steps: [
          { title: 'Chọn sản phẩm', text: 'Vào mục Sản phẩm hoặc Bộ sưu tập, bấm vào mẫu Quý khách thích để xem ảnh, chất liệu và giá.' },
          { title: 'Chọn mẫu, kích thước, số lượng', text: 'Giá đổi ngay theo kích thước Quý khách chọn. Mẫu nào tạm hết hàng sẽ ghi rõ.' },
          { title: 'Điền thông tin nhận hàng', text: 'Họ tên, số điện thoại, tỉnh thành và địa chỉ. Không cần tạo tài khoản, không cần chuyển khoản trước.' },
          { title: 'Nhân viên gọi xác nhận', text: `Ecopillo gọi lại để xác nhận mẫu, kích thước và thời gian giao trong giờ làm việc (${OPENING_HOURS}).` },
          { title: 'Nhận hàng, kiểm hàng, thanh toán', text: 'Quý khách kiểm hàng cùng người giao, được trải thử lên giường, đúng rồi mới trả tiền.' },
        ],
      },
      {
        title: 'Đặt qua điện thoại, Zalo, Messenger',
        body: [
          `Gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}, hoặc nhắn tin fanpage ${CONTACT.fanpageDisplay}. Quý khách có thể gửi ảnh phòng ngủ, số đo giường để được tư vấn mẫu và kích thước.`,
        ],
      },
      {
        title: 'Mua trực tiếp',
        body: ['Quý khách đến văn phòng đại diện, chi nhánh hoặc điểm phân phối của Ecopillo để xem vải, nằm thử gối, đệm và mua ngay.'],
      },
    ],
  },
  {
    slug: 'chinh-sach-giao-hang',
    title: 'Chính sách giao hàng',
    description: 'Miễn phí giao toàn quốc cho đơn từ 500.000đ. Hà Nội khoảng 1 ngày, phía Bắc 2–3 ngày, phía Nam 3–5 ngày.',
    intro: 'Ecopillo giao hàng toàn quốc, thu tiền khi nhận hàng. Quý khách được kiểm hàng và trải thử trước khi thanh toán.',
    highlights: [
      { value: 'Miễn phí', label: 'Giao toàn quốc cho đơn từ 500.000đ' },
      { value: '1–5 ngày', label: 'Tuỳ khu vực nhận hàng' },
      { value: 'Kiểm hàng', label: 'Được trải thử trước khi trả tiền' },
    ],
    sections: [
      {
        title: 'Phí giao hàng',
        list: [
          'Đơn từ 500.000đ: miễn phí giao hàng trên toàn quốc.',
          'Đơn dưới 500.000đ: phí giao 50.000đ, báo rõ khi nhân viên gọi xác nhận.',
          'Không thu thêm phí thu hộ khi thanh toán lúc nhận hàng.',
        ],
      },
      {
        title: 'Thời gian giao',
        list: [
          'Nội thành Hà Nội: khoảng 1 ngày.',
          'Các tỉnh phía Bắc: 2–3 ngày.',
          'Các tỉnh phía Nam: 3–5 ngày.',
          'Hàng may theo kích thước riêng: Ecopillo báo thời gian may khi xác nhận đơn.',
        ],
        body: ['Thời gian tính từ khi nhân viên gọi xác nhận đơn, không tính ngày lễ, Tết. Nếu giao chậm, Ecopillo gọi báo trước.'],
      },
      {
        title: 'Khi nhận hàng',
        list: [
          'Quý khách kiểm hàng cùng nhân viên giao, được trải thử lên giường để xem vừa kích thước (vui lòng không nằm lên).',
          'Giao sai mẫu, sai kích thước: Quý khách có quyền từ chối nhận và không phải trả tiền.',
          'Kiện hàng móp, rách: chụp ảnh và báo ngay cho Ecopillo trước khi ký nhận.',
        ],
      },
    ],
  },
  {
    slug: 'chinh-sach-thanh-toan',
    title: 'Chính sách thanh toán',
    description: 'Đặt online thanh toán khi nhận hàng (COD) toàn quốc, không cần chuyển khoản trước, không mất phí thu hộ.',
    intro: 'Đặt hàng online tại Ecopillo không cần chuyển khoản trước. Quý khách kiểm hàng xong rồi mới trả tiền cho người giao.',
    highlights: [
      { value: 'COD', label: 'Thanh toán khi nhận hàng, toàn quốc' },
      { value: '0đ', label: 'Không mất phí thu hộ' },
      { value: 'Không', label: 'Không yêu cầu chuyển khoản trước' },
    ],
    sections: [
      {
        title: 'Đặt hàng online',
        list: [
          'Thanh toán bằng tiền mặt cho nhân viên giao hàng sau khi kiểm hàng (COD), áp dụng trên toàn quốc.',
          'Ecopillo không yêu cầu chuyển khoản trước và không thu thông tin thẻ ngân hàng trên web.',
          'Nhân viên Ecopillo luôn gọi xác nhận đơn trước khi giao. Nếu có ai nhắn tin yêu cầu chuyển khoản trước, Quý khách vui lòng gọi hotline để kiểm tra.',
        ],
      },
      {
        title: 'Mua trực tiếp tại hệ thống phân phối',
        list: ['Thanh toán tiền mặt hoặc quẹt thẻ ngân hàng tại quầy.'],
      },
      {
        title: 'Khách sạn, dự án, đại lý',
        body: ['Đơn số lượng lớn thanh toán theo hợp đồng. Bộ phận kinh doanh gửi báo giá và điều khoản thanh toán riêng.'],
      },
      {
        title: 'Hoá đơn',
        body: ['[ECOPILLO XÁC NHẬN CÁCH XUẤT HOÁ ĐƠN VAT CHO KHÁCH CÓ NHU CẦU]'],
      },
    ],
  },
  {
    slug: 'chinh-sach-doi-hang',
    title: 'Chính sách kiểm hàng và đổi hàng',
    description: 'Được kiểm hàng, trải thử khi nhận. Báo lỗi trong 24 giờ, gửi đổi trong 7 ngày. Ecopillo hỗ trợ đổi, không trả hàng hoàn tiền.',
    intro: 'Ecopillo muốn Quý khách nhận đúng bộ mình chọn. Vì vậy Quý khách được kiểm hàng, trải thử trước khi trả tiền, và được đổi khi có lỗi.',
    highlights: [
      { value: '24 giờ', label: 'Báo lỗi sau khi nhận hàng' },
      { value: '7 ngày', label: 'Gửi hàng đổi' },
      { value: 'Chỉ đổi', label: 'Không áp dụng trả hàng hoàn tiền' },
    ],
    sections: [
      {
        title: 'Kiểm hàng khi nhận',
        list: [
          'Mở hộp, kiểm mẫu, màu, kích thước và số lượng cùng nhân viên giao.',
          'Được trải thử lên giường để xem vừa kích thước (vui lòng không nằm lên, không giặt).',
          'Sai mẫu, sai kích thước, thiếu hàng: Quý khách có quyền từ chối nhận và không phải trả tiền.',
        ],
      },
      {
        title: 'Điều kiện đổi hàng',
        list: [
          'Báo lỗi sản xuất hoặc thiếu hàng trong 24 giờ sau khi nhận, kèm ảnh hoặc video.',
          'Gửi hàng đổi trong 7 ngày kể từ ngày nhận.',
          'Sản phẩm còn nguyên tem mác, chưa giặt, chưa sử dụng, còn đủ hộp và phụ kiện.',
          'Hàng may theo kích thước riêng chỉ đổi khi có lỗi sản xuất hoặc may sai số đo đã chốt.',
        ],
      },
      {
        title: 'Phí vận chuyển khi đổi',
        list: [
          'Lỗi do nhà sản xuất hoặc giao nhầm: Ecopillo chịu toàn bộ phí vận chuyển hai chiều.',
          'Đổi mẫu, đổi kích thước theo nhu cầu của Quý khách: [ECOPILLO XÁC NHẬN AI CHỊU PHÍ VẬN CHUYỂN].',
        ],
      },
      {
        title: 'Cách gửi yêu cầu đổi',
        steps: [
          { title: 'Báo cho Ecopillo', text: `Gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}, gửi mã đơn hoặc số điện thoại đặt hàng và ảnh sản phẩm.` },
          { title: 'Ecopillo xác nhận', text: 'Nhân viên kiểm tra và hẹn cách gửi hàng đổi, hoặc cho người đến lấy với khách ở Hà Nội, TP. HCM.' },
          { title: 'Nhận hàng mới', text: 'Hàng đổi được giao lại theo thời gian giao hàng thông thường.' },
        ],
      },
    ],
  },
  {
    slug: 'chinh-sach-bao-hanh',
    title: 'Chính sách bảo hành',
    description: 'Bảo hành theo từng sản phẩm tính từ ngày mua: đệm 5–15 năm tuỳ dòng, chăn ga và gối theo thời hạn ghi ở từng sản phẩm.',
    intro: 'Mỗi sản phẩm Ecopillo đều có thời hạn bảo hành rõ ràng, tính từ ngày mua và ghi ngay trên trang sản phẩm.',
    highlights: [
      { value: '5–15 năm', label: 'Đệm, tuỳ dòng đệm' },
      { value: '90 [XÁC NHẬN ĐƠN VỊ]', label: 'Chăn ga' },
      { value: '[ĐIỀN]', label: 'Gối, ruột gối' },
    ],
    sections: [
      {
        title: 'Thời hạn bảo hành',
        list: [
          'Đệm: 5–15 năm tuỳ dòng đệm, ghi trên trang từng sản phẩm.',
          'Chăn ga: 90 [XÁC NHẬN ĐƠN VỊ: NGÀY].',
          'Gối, ruột gối, ruột chăn: [ĐIỀN THỜI HẠN BẢO HÀNH].',
          'Thời hạn tính từ ngày Quý khách nhận hàng.',
        ],
      },
      {
        title: 'Được bảo hành khi',
        list: [
          'Bung đường may, tuột chỉ trong điều kiện sử dụng thông thường.',
          'Khoá kéo, chun ga hỏng do lỗi sản xuất.',
          'Đệm lún, biến dạng vượt mức cho phép của nhà sản xuất [ECOPILLO XÁC NHẬN MỨC LÚN ĐƯỢC BẢO HÀNH].',
        ],
      },
      {
        title: 'Không thuộc bảo hành',
        list: [
          'Hư hỏng do giặt, sấy, là sai hướng dẫn trên nhãn.',
          'Rách, cháy, ố bẩn, côn trùng cắn, hoặc tự ý sửa chữa.',
          'Phai màu, xù nhẹ tự nhiên sau thời gian dài sử dụng.',
        ],
      },
      {
        title: 'Cách yêu cầu bảo hành',
        body: [
          `Gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}, gửi số điện thoại đặt hàng và ảnh phần cần bảo hành. Ecopillo hẹn cách nhận và trả hàng bảo hành.`,
          '[ECOPILLO XÁC NHẬN CÓ CÒN YÊU CẦU KÍCH HOẠT BẢO HÀNH ĐIỆN TỬ HAY KHÔNG; NẾU CÒN, GỬI CÁC BƯỚC KÍCH HOẠT]',
        ],
      },
    ],
  },
]

export const policyBySlug = (slug: string): Policy | undefined => POLICIES.find((p) => p.slug === slug)
