import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { OPENING_HOURS } from '../../data/brand'
import { PATHS } from '../../data/links'
import { isValidPhone } from '../../lib/order'
import { focusField } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import { PreviewNotSent } from '../ui/PreviewNotSent'
import { buttonClass } from '../ui/primitives'

/**
 * Form "Gửi tin nhắn cho chúng tôi" (trang Liên hệ mua hàng, trang Khách sạn).
 * Trên WordPress, form này nối vào form liên hệ đang dùng (Contact Form 7 / Flatsome) để tin nhắn
 * về email cskh như cũ. Ô "Quý khách cần" giúp Ecopillo biết khách hỏi gì nhiều nhất.
 */

export const TOPICS = [
  'Tư vấn chọn mẫu',
  'Hỏi về đơn hàng',
  'Bảo hành, đổi hàng',
  'Khách sạn, nhà nghỉ',
  'Đăng ký đại lý',
  'Khác',
] as const

export type Topic = (typeof TOPICS)[number]

interface ContactForm {
  topic: Topic
  name: string
  phone: string
  message: string
}

type ContactErrors = Partial<Record<'name' | 'phone' | 'message', string>>

const EMPTY_FORM: ContactForm = { topic: 'Tư vấn chọn mẫu', name: '', phone: '', message: '' }

const validate = (f: ContactForm): ContactErrors => {
  const errors: ContactErrors = {}
  if (f.name.trim().length < 2) errors.name = 'Vui lòng nhập họ tên.'
  if (!isValidPhone(f.phone)) errors.phone = 'Số điện thoại chưa đúng, ví dụ 0988 832 072.'
  if (f.message.trim().length < 5) errors.message = 'Quý khách vui lòng ghi ngắn gọn điều cần hỏi.'
  return errors
}

const INPUT =
  'mt-2 block w-full rounded-xl border bg-ivory px-4 py-3.5 text-body text-deep-900 placeholder:text-ink-faint transition focus:border-deep-700 focus:ring-2 focus:ring-deep-700 focus:outline-none'

const inputClass = (hasError: boolean) => `${INPUT} ${hasError ? 'border-alert ring-4 ring-alert-soft' : 'border-line'}`

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div data-field className="scroll-mt-[5.5rem]">
      <label htmlFor={`c-${id}`} className="text-sm font-medium text-deep-900">
        {label}
      </label>
      {children}
      {error && (
        <p id={`c-${id}-error`} role="alert" className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-alert-soft px-2 py-1 text-meta text-alert">
          <Icon name="info" size={14} /> {error}
        </p>
      )}
    </div>
  )
}

interface MessageFormProps {
  /** Chủ đề chọn sẵn, ví dụ trang Khách sạn chọn sẵn "Khách sạn, nhà nghỉ" */
  defaultTopic?: Topic
  /** Gợi ý trong ô nội dung */
  placeholder?: string
  submitLabel?: string
  /**
   * Chữ điền sẵn vào ô nội dung (ví dụ trang Khách sạn: "Cần báo giá: Chăn ga T300").
   * Đổi giá trị này khi khách bấm "Liên hệ báo giá" từ một món; form chỉ ghi đè ô nội dung,
   * giữ nguyên họ tên / điện thoại / chủ đề đã nhập.
   */
  defaultMessage?: string
  /** Tăng mỗi lần bấm báo giá, để bấm lại cùng món vẫn ghi đè ô nội dung */
  prefillKey?: number
}

export function MessageForm({
  defaultTopic = 'Tư vấn chọn mẫu',
  placeholder = 'Ví dụ: giường 1m8 × 2m, muốn tư vấn mẫu mát cho mùa hè…',
  submitLabel = 'Gửi tin nhắn',
  defaultMessage = '',
  prefillKey = 0,
}: MessageFormProps) {
  const initial: ContactForm = { ...EMPTY_FORM, topic: defaultTopic, message: defaultMessage }
  const [form, setForm] = useState<ContactForm>(initial)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [sent, setSent] = useState<ContactForm | null>(null)

  // Khi trang đẩy chữ mới (bấm "Liên hệ báo giá" một món): ghi vào ô nội dung, bỏ trạng thái đã gửi
  useEffect(() => {
    if (!defaultMessage || prefillKey === 0) return
    setSent(null)
    setForm((f) => ({ ...f, message: defaultMessage }))
    setErrors((e) => {
      if (!e.message) return e
      const next = { ...e }
      delete next.message
      return next
    })
  }, [defaultMessage, prefillKey])

  const change = (patch: Partial<ContactForm>) => {
    setForm((f) => ({ ...f, ...patch }))
    // Sửa ô nào thì xoá lỗi ô đó
    setErrors((e) => {
      const next = { ...e }
      for (const key of Object.keys(patch)) delete next[key as keyof ContactErrors]
      return next
    })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      focusField(`c-${first}`)
      return
    }
    setSent(form)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center py-10 text-center sm:py-16" role="status">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mist-100 text-deep-800">
          <Icon name="check" size={28} />
        </span>
        <h3 className="font-display mt-6 text-[1.9rem] leading-tight text-deep-900">Ecopillo đã nhận tin nhắn</h3>
        <p className="mt-3 max-w-sm text-ink-soft">
          Cảm ơn {sent.name.trim()}. Bộ phận Chăm sóc khách hàng sẽ gọi lại số{' '}
          <span className="tabular font-medium text-deep-900">{sent.phone}</span> trong giờ làm việc ({OPENING_HOURS}).
        </p>
        <p className="mt-2 text-sm text-ink-faint">Chủ đề: {sent.topic}</p>
        <PreviewNotSent className="mt-6 max-w-sm" />
        <button
          type="button"
          onClick={() => {
            setForm(initial)
            setSent(null)
          }}
          className={buttonClass('secondary', 'md', 'mt-8')}
        >
          Gửi tin nhắn khác
        </button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-6">
      <fieldset>
        <legend className="text-sm font-medium text-deep-900">Quý khách cần</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const active = form.topic === t
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => change({ topic: t })}
                className={`rounded-full px-4 py-2 text-small transition ${
                  active ? 'bg-deep-800 text-ivory' : 'bg-cream-50 text-deep-900 ring-1 ring-cream-200 hover:ring-deep-700/40'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Họ tên" error={errors.name}>
          <input
            id="c-name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => change({ name: e.target.value })}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'c-name-error' : undefined}
            className={inputClass(!!errors.name)}
            placeholder="Nguyễn Thị Lan"
          />
        </Field>
        <Field id="phone" label="Số điện thoại" error={errors.phone}>
          <input
            id="c-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => change({ phone: e.target.value })}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'c-phone-error' : undefined}
            className={inputClass(!!errors.phone)}
            placeholder="09xx xxx xxx"
          />
        </Field>
      </div>

      <Field id="message" label="Nội dung yêu cầu" error={errors.message}>
        <textarea
          id="c-message"
          rows={5}
          value={form.message}
          onChange={(e) => change({ message: e.target.value })}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'c-message-error' : undefined}
          className={`${inputClass(!!errors.message)} resize-y`}
          placeholder={placeholder}
        />
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-meta leading-relaxed text-ink-faint">
          Ecopillo chỉ dùng thông tin này để liên hệ lại, theo{' '}
          <Link to={PATHS.privacy} className="-my-2 inline-block py-2 underline underline-offset-2 hover:text-deep-900">
            chính sách bảo vệ thông tin
          </Link>
          .
        </p>
        <button type="submit" className={buttonClass('primary', 'lg', 'shrink-0')}>
          {submitLabel}
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </form>
  )
}

