import type { ReactNode } from 'react'
import { ORDER_SHOWN } from '../../data/pageLayout'
import { Link } from 'react-router-dom'
import { PATHS } from '../../data/links'
import { formatVND } from '../../lib/format'
import type { CustomerErrors, CustomerInfo, OrderSummaryData } from '../../lib/order'
import { PROVINCES } from '../../lib/shipping'
import { Icon } from '../ui/Icon'
import { Select } from '../ui/Select'
import { BANK_LINE } from '../../data/paymentPolicy'
import { ORDER_TEXT } from '../../data/pageText/order'
import { ORDER_CUSTOMER_TEXT as T } from '../../data/pageText/orderFlow'
import { chen } from '../../data/pageText/define'

interface StepCustomerProps {
  customer: CustomerInfo
  errors: CustomerErrors
  summary: OrderSummaryData
  onChange: (patch: Partial<CustomerInfo>) => void
}

const INPUT =
  'mt-2 block w-full rounded-xl border bg-ivory px-4 py-3.5 text-body text-deep-900 placeholder:text-ink-faint transition focus:border-deep-700 focus:ring-2 focus:ring-deep-700 focus:outline-none'

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
    <div data-field className={`scroll-mt-[5.5rem] ${className}`}>
      <label htmlFor={`f-${id}`} className="text-sm font-medium text-deep-900">
        {label}
        {optional && <span className="font-normal text-ink-faint"> {T.khongBatBuoc}</span>}
      </label>
      {children}
      {error ? (
        <p id={`f-${id}-error`} className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-alert-soft px-2 py-1 text-meta text-alert" role="alert">
          <Icon name="info" size={14} /> {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-meta text-ink-faint">{hint}</p>
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
        <legend className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">{T.tieuDe}</legend>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {ORDER_SHOWN.has('o-ten') && (
            <Field id="name" label={T.oTen} error={errors.name}>
              <input
                id="f-name"
                autoComplete="name"
                value={customer.name}
                onChange={(e) => onChange({ name: e.target.value })}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('name')}
                placeholder={T.oTenMau}
                className={inputClass(Boolean(errors.name))}
              />
            </Field>
          )}
          {ORDER_SHOWN.has('o-sdt') && (
            <Field id="phone" label={T.oSdt} error={errors.phone} hint={T.oSdtGoiY}>
              <input
                id="f-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={customer.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy('phone')}
                placeholder={T.oSdtMau}
                className={inputClass(Boolean(errors.phone))}
              />
            </Field>
          )}
          {ORDER_SHOWN.has('o-tinh') && (
            <Field id="provinceId" label={T.oTinh} error={errors.provinceId} className="sm:col-span-2">
              <Select
                id="f-provinceId"
                variant="field"
                value={customer.provinceId}
                onChange={(provinceId) => onChange({ provinceId })}
                placeholder={T.oTinhMau}
                options={PROVINCE_OPTIONS}
                ariaInvalid={Boolean(errors.provinceId)}
                ariaDescribedBy={describedBy('provinceId')}
              />
            </Field>
          )}
          {ORDER_SHOWN.has('o-dia-chi') && (
            <Field id="address" label={T.oDiaChi} error={errors.address} className="sm:col-span-2">
              <input
                id="f-address"
                autoComplete="street-address"
                value={customer.address}
                onChange={(e) => onChange({ address: e.target.value })}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={describedBy('address')}
                placeholder={T.oDiaChiMau}
                className={inputClass(Boolean(errors.address))}
              />
            </Field>
          )}
          {ORDER_SHOWN.has('ghi-chu') && <Field id="note" label={T.oGhiChu} optional className="sm:col-span-2">
            <textarea
              id="f-note"
              rows={2}
              value={customer.note}
              onChange={(e) => onChange({ note: e.target.value })}
              placeholder={T.oGhiChuMau}
              className={`${inputClass(false)} resize-none`}
            />
          </Field>}
        </div>
      </fieldset>

      {/* Ecopillo ẩn khung thanh toán (Bố cục trang Đặt hàng): bỏ cả tiêu đề, dòng đồng ý chính sách thì luôn còn */}
      <section aria-labelledby={ORDER_SHOWN.has('thanh-toan') ? 'pay-title' : undefined}>
        {ORDER_SHOWN.has('thanh-toan') && <h2 id="pay-title" className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">
          {T.thanhToan}
        </h2>}
        {ORDER_SHOWN.has('thanh-toan') && <div className="mt-6 flex gap-4 rounded-2xl bg-mist-50 p-5 ring-2 ring-deep-800">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory text-deep-800 ring-1 ring-cream-200">
            <Icon name="truck" size={20} />
          </span>
          <div className="flex-1">
            <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-medium text-deep-900">{ORDER_TEXT.thanhToanTieuDe}</span>
              <span className="text-sm text-mist-600">
                {shipFee === null ? ORDER_TEXT.mienPhiGiao : shipFee === 0 ? T.mienPhiGiaoHang : chen(T.phiGiao, { phi: formatVND(shipFee) })}
              </span>
            </p>
            <p className="mt-1 text-small leading-relaxed text-ink-soft">
              {/* Thông báo Ecopillo từ 07/08/2026 (src/data/paymentPolicy.ts): một tài khoản duy nhất */}
              <span className="block font-medium text-deep-900">{BANK_LINE}</span>
              {T.datCoc}
            </p>
          </div>
        </div>}
        <p className={`text-xs leading-relaxed text-ink-soft ${ORDER_SHOWN.has('thanh-toan') ? 'mt-4' : ''}`}>
          {ORDER_TEXT.xemHang} {T.dongY}{' '}
          <Link to={PATHS.privacy} className="-my-2 inline-block py-2 font-medium text-deep-900 underline underline-offset-2">
            {T.linkChinhSach}
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
