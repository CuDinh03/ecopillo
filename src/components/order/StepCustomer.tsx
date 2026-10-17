import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '../../data/links'
import { formatVND } from '../../lib/format'
import type { CustomerErrors, CustomerInfo, OrderSummaryData } from '../../lib/order'
import { PROVINCES } from '../../lib/shipping'
import { Icon } from '../ui/Icon'
import { Select } from '../ui/Select'

interface StepCustomerProps {
  customer: CustomerInfo
  errors: CustomerErrors
  summary: OrderSummaryData
  onChange: (patch: Partial<CustomerInfo>) => void
}

const INPUT =
  'mt-2 block w-full rounded-xl border bg-ivory px-4 py-3.5 text-[1rem] text-deep-900 placeholder:text-ink-faint transition focus:border-deep-700 focus:ring-4 focus:ring-mist-200 focus:outline-none'

const PROVINCE_OPTIONS = PROVINCES.map((p) => ({ value: p.id, label: p.name }))

const inputClass = (hasError: boolean) => `${INPUT} ${hasError ? 'border-alert ring-4 ring-alert-soft' : 'border-line'}`

interface FieldProps {
  id: keyof CustomerInfo
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
  className?: string
}

function Field({ id, label, error, hint, optional, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={`f-${id}`} className="text-sm font-medium text-deep-900">
        {label}
        {optional && <span className="font-normal text-ink-faint"> (không bắt buộc)</span>}
      </label>
      {children}
      {error ? (
        <p id={`f-${id}-error`} className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-alert-soft px-2 py-1 text-[0.82rem] text-alert" role="alert">
          <Icon name="info" size={14} /> {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[0.8rem] text-ink-faint">{hint}</p>
      )}
    </div>
  )
}

export function StepCustomer({ customer, errors, summary, onChange }: StepCustomerProps) {
  const describedBy = (id: keyof CustomerInfo) => (errors[id] ? `f-${id}-error` : undefined)
  // Chưa có giá chính xác (đệm báo giá khi gọi) thì chỉ nêu mức miễn phí giao
  const shipFee = summary.subtotal || summary.priceOnCall ? summary.shippingFee : null

  return (
    <div className="space-y-12">
      <fieldset>
        <legend className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">Thông tin nhận hàng</legend>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Họ và tên người nhận" error={errors.name}>
            <input
              id="f-name"
              autoComplete="name"
              value={customer.name}
              onChange={(e) => onChange({ name: e.target.value })}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              placeholder="Nguyễn Thị Lan"
              className={inputClass(Boolean(errors.name))}
            />
          </Field>
          <Field id="phone" label="Số điện thoại" error={errors.phone} hint="Nhân viên sẽ gọi số này để xác nhận đơn.">
            <input
              id="f-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={customer.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy('phone')}
              placeholder="09xx xxx xxx"
              className={inputClass(Boolean(errors.phone))}
            />
          </Field>
          <Field id="provinceId" label="Tỉnh / thành phố" error={errors.provinceId} className="sm:col-span-2">
            <Select
              id="f-provinceId"
              variant="field"
              value={customer.provinceId}
              onChange={(provinceId) => onChange({ provinceId })}
              placeholder="Chọn tỉnh/thành nhận hàng"
              options={PROVINCE_OPTIONS}
              ariaInvalid={Boolean(errors.provinceId)}
              ariaDescribedBy={describedBy('provinceId')}
            />
          </Field>
          <Field id="address" label="Địa chỉ nhận hàng" error={errors.address} className="sm:col-span-2">
            <input
              id="f-address"
              autoComplete="street-address"
              value={customer.address}
              onChange={(e) => onChange({ address: e.target.value })}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={describedBy('address')}
              placeholder="Số nhà, tên đường, phường/xã"
              className={inputClass(Boolean(errors.address))}
            />
          </Field>
          <Field id="note" label="Ghi chú cho Ecopillo" optional className="sm:col-span-2">
            <textarea
              id="f-note"
              rows={2}
              value={customer.note}
              onChange={(e) => onChange({ note: e.target.value })}
              placeholder="Ví dụ: giao giờ hành chính, gói quà cưới, gọi trước khi giao…"
              className={`${inputClass(false)} resize-none`}
            />
          </Field>
        </div>
      </fieldset>

      <section aria-labelledby="pay-title">
        <h2 id="pay-title" className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">
          Thanh toán khi nhận hàng
        </h2>
        <div className="mt-6 flex gap-4 rounded-2xl bg-mist-50 p-5 ring-2 ring-deep-800">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory text-deep-800 ring-1 ring-cream-200">
            <Icon name="truck" size={20} />
          </span>
          <div className="flex-1">
            <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-medium text-deep-900">Trả tiền khi nhận hàng (COD)</span>
              <span className="text-sm text-mist-600">
                {shipFee === null ? 'Miễn phí giao từ 500.000đ' : shipFee === 0 ? 'Miễn phí giao hàng' : `Phí giao ${formatVND(shipFee)}`}
              </span>
            </p>
            <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-soft">
              Áp dụng toàn quốc, không thu phí thu hộ. Quý khách kiểm hàng, trải thử lên giường rồi mới thanh toán cho nhân
              viên giao hàng.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          Muốn trả tiền mặt hoặc quẹt thẻ tại cửa hàng? Ghé hệ thống phân phối Ecopillo tại Hà Nội hoặc TP. HCM. Khi bấm “Đặt
          hàng”, Quý khách đồng ý để Ecopillo dùng thông tin trên để gọi xác nhận và giao hàng, theo{' '}
          <Link to={PATHS.privacy} className="font-medium text-deep-900 underline underline-offset-2">
            chính sách bảo vệ thông tin
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
