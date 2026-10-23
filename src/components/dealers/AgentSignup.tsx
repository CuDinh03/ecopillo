import { CONTACT } from '../../data/brand'
import { AGENT_BENEFITS } from '../../data/dealers'
import { Icon } from '../ui/Icon'
import { SectionHeading } from '../ui/primitives'
import { MessageForm } from '../contact/MessageForm'

/**
 * Khối "Trở thành đại lý": quyền lợi + form đăng ký. Dùng ở cuối trang Hệ thống phân phối
 * và ở trang Tuyển đại lý (/tuyen-dai-ly/, link của web cũ).
 */
export function AgentSignup() {
  return (
    <section
      id="dang-ky-dai-ly"
      aria-labelledby="agent-title"
      className="scroll-mt-28 grid gap-10 rounded-[2rem] bg-cream-50 p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14"
    >
      <div className="lg:col-span-5">
        <SectionHeading
          id="agent-title"
          eyebrow="Hợp tác"
          title={
            <>
              Trở thành <span className="text-mist-600 italic">đại lý Ecopillo</span>
            </>
          }
          lead="Ecopillo tìm đối tác phân phối chăn ga gối đệm cao cấp tại các tỉnh, thành. Để lại thông tin, bộ phận kinh doanh sẽ gọi lại."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {AGENT_BENEFITS.map((b) => (
            <li key={b} className="flex gap-3 text-[0.95rem] text-deep-900">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-deep-800 text-ivory">
                <Icon name="check" size={12} strokeWidth={2.2} />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.95rem] text-deep-900">
          Liên hệ mở đại lý:
          <a
            href={CONTACT.hotlineTel}
            className="tabular -my-2 inline-flex items-center gap-1.5 py-2 font-medium text-deep-800 underline decoration-mist-300 underline-offset-4 transition hover:text-mist-600 hover:decoration-mist-600"
          >
            <Icon name="phone" size={16} />
            {CONTACT.hotlineDisplay}
          </a>
        </p>
      </div>
      <div className="rounded-[1.5rem] bg-ivory p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:col-span-7">
        <MessageForm
          defaultTopic="Đăng ký đại lý"
          placeholder="Ví dụ: cửa hàng chăn ga tại Nam Định, diện tích 60 m², muốn nhận bảng giá sỉ…"
          submitLabel="Gửi đăng ký"
        />
      </div>
    </section>
  )
}
