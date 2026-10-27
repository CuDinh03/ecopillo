import { BRAND, CONTACT, SHOWROOMS } from '../data/brand'
import { PolicyLayout } from '../components/policy/PolicyLayout'
import { RichText } from '../components/ui/RichText'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Chính sách bảo vệ thông tin cá nhân theo Nghị định 13/2023/NĐ-CP (biên bản chốt mục 62).
 * Bên thực hiện soạn; mã số doanh nghiệp, địa chỉ và thời gian lưu theo web cũ (chân trang, chính sách bảo mật cũ).
 * Nhãn chờ bỏ theo owner 28/10/2026; Ecopillo vẫn nên đọc lại trước khi chạy chính thức.
 */
interface PolicySection {
  title: string
  body: readonly string[]
}

const SECTIONS: readonly PolicySection[] = [
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
      'Gọi điện xác nhận đơn hàng, giao hàng và thu tiền khi giao.',
      'Hỗ trợ đổi hàng, bảo hành và trả lời câu hỏi của Quý khách.',
      'Gửi thông tin ưu đãi, chỉ khi Quý khách đồng ý nhận. Quý khách có thể từ chối bất cứ lúc nào.',
      'Ecopillo không bán, cho thuê hay trao đổi thông tin cá nhân của Quý khách với bên khác vì mục đích thương mại.',
    ],
  },
  {
    title: '4. Bên được nhận thông tin',
    body: [
      'Đơn vị vận chuyển: chỉ nhận tên, số điện thoại, địa chỉ để giao hàng và thu tiền khi giao.',
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
    body: [
      'Khi bấm "Đặt hàng", Quý khách đồng ý để Ecopillo dùng thông tin đã điền cho các mục đích ở phần 3 của chính sách này.',
    ],
  },
]

export function PrivacyPage() {
  usePageMeta(
    'Chính sách bảo vệ thông tin cá nhân',
    'Ecopillo thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng theo Nghị định 13/2023/NĐ-CP.',
  )
  return (
    <PolicyLayout
      title="Chính sách bảo vệ thông tin cá nhân"
      intro="Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Ecopillo chỉ dùng thông tin Quý khách cung cấp để giao hàng và chăm sóc khách hàng."
    >
      <div className="space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[1.85rem]">{section.title}</h2>
            <ul className="mt-4 space-y-2.5 leading-relaxed text-ink-soft">
              {section.body.map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-600" />
                  <span>
                    <RichText text={line} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h2 className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[1.85rem]">8. Liên hệ về thông tin cá nhân</h2>
          <ul className="mt-4 space-y-2 leading-relaxed text-ink-soft">
            <li>
              Hotline/Zalo:{' '}
              <a href={CONTACT.hotlineTel} className="tabular text-deep-900 underline underline-offset-2">
                {CONTACT.hotlineDisplay}
              </a>
            </li>
            <li>
              Email:{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-deep-900 underline underline-offset-2">
                {CONTACT.email}
              </a>
            </li>
            <li>
              {SHOWROOMS[0].kind}: {SHOWROOMS[0].address}
            </li>
          </ul>
        </section>
      </div>
    </PolicyLayout>
  )
}
