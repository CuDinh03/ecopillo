import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT, OPENING_HOURS } from '../../data/brand'
import { formatVND } from '../../lib/format'
import { PRICE_ON_CALL, type CustomerInfo, type OrderSummaryData } from '../../lib/order'
import { Icon, type IconName } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { PreviewNotSent } from '../ui/PreviewNotSent'
import { buttonClass, ContactButtons } from '../ui/primitives'
import { BANK_LINE } from '../../data/paymentPolicy'
import { ORDER_TEXT } from '../../data/pageText/order'
import { ORDER_SUMMARY_TEXT as T } from '../../data/pageText/orderFlow'
import { chen } from '../../data/pageText/define'

interface ConfirmationProps {
  orderCode: string
  /** Đơn đã ghi vào trang tính của Ecopillo (src/lib/sendForm.ts) */
  delivered: boolean
  summary: OrderSummaryData
  customer: CustomerInfo
  onNewOrder: () => void
}

/** Biên bản mục 50: màn hình cuối là lời cảm ơn, rồi nhân viên gọi xác nhận đơn */
export function Confirmation({ orderCode, delivered, summary, customer, onNewOrder }: ConfirmationProps) {
  const { line, subtotal, shippingFee, total, priceOnCall } = summary
  if (!line) return null

  const steps: readonly { icon: IconName; title: string; text: ReactNode; done?: boolean }[] = [
    { icon: 'check', title: ORDER_TEXT.buocNhan, text: chen(T.maDon, { ma: orderCode }), done: true },
    {
      icon: 'phone',
      title: ORDER_TEXT.buocGoi,
      text: (
        <>
          {T.goiToiSo} <span className="tabular font-medium text-deep-900">{customer.phone}</span>{' '}
          {chen(T.trongGio, { gio: OPENING_HOURS })}
          {priceOnCall ? T.baoGiaTheoCo : ''}
        </>
      ),
    },
    {
      icon: 'truck',
      title: ORDER_TEXT.buocGiao,
      text: chen(T.duKienGiao, { thoiGian: summary.deliveryTime?.toLowerCase() ?? T.theoKhuVuc }),
    },
  ]

  return (
    <div className="reveal mx-auto max-w-3xl">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist-100 text-deep-800 ring-8 ring-mist-50">
          <Icon name="check" size={30} strokeWidth={2} />
        </span>
        <p className="eyebrow mt-7">{chen(T.daNhanMa, { ma: orderCode })}</p>
        <h1 className="font-display mt-3 text-[1.85rem] text-deep-900 sm:text-5xl">{ORDER_TEXT.camOnTieuDe}</h1>
        <p className="mx-auto mt-4 max-w-md text-lead font-medium text-deep-800">
          {ORDER_TEXT.camOnChu}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{ORDER_TEXT.camOnPhu}</p>
        <PreviewNotSent delivered={delivered} className="mx-auto mt-6 max-w-md" />
      </div>

      <ol className="mt-10 grid gap-3 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={`rounded-2xl p-5 ring-1 ${step.done ? 'bg-mist-100 ring-mist-200' : 'bg-ivory ring-cream-200'}`}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step.done ? 'bg-deep-800 text-ivory' : 'bg-mist-100 text-deep-800'
                }`}
              >
                <Icon name={step.icon} size={15} />
              </span>
              <span className="tabular text-xs text-ink-faint">{chen(T.buocSo, { so: i + 1 })}</span>
            </span>
            <p className="mt-3 font-medium text-deep-900">{step.title}</p>
            <p className="mt-1 text-small leading-relaxed text-ink-soft">{step.text}</p>
          </li>
        ))}
      </ol>

      <article className="mt-10 overflow-hidden rounded-[2rem] bg-ivory shadow-[var(--shadow-lift)]">
        <div className="flex gap-5 border-b border-dashed border-line bg-mist-100 p-6 sm:p-8">
          <div className="h-24 w-32 shrink-0 rounded-2xl sm:h-28 sm:w-40">
            <Placeholder compact className="h-full w-full" tint={line.tint} note={line.imageNote} image={line.image} sizes="160px" />
          </div>
          <div>
            <p className="text-label tracking-[0.14em] text-mist-600 uppercase">{line.kindLabel}</p>
            <h2 className="font-display text-3xl leading-tight text-deep-900">{line.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{line.detail}</p>
          </div>
        </div>

        <dl className="grid gap-x-10 gap-y-4 p-6 text-sm sm:grid-cols-2 sm:p-8">
          <Item label={T.ctKichThuoc} value={line.sizeLabel ?? '—'} />
          <Item
            label={T.ctSoLuong}
            value={`${line.quantity} ${line.unit}${line.unitPrice ? ` × ${formatVND(line.unitPrice)}` : ''}`}
          />
          {line.gift && (
            <Item
              label={T.ctQua}
              value={
                <>
                  {line.giftCount} {line.gift.unit} {line.gift.item}
                </>
              }
            />
          )}
          <Item label={T.ctThanhToan} value={chen(T.ctChuyenKhoan, { taiKhoan: BANK_LINE })} />
          <Item label={T.ctNguoiNhan} value={`${customer.name.trim()} · ${customer.phone}`} />
          <Item label={T.ctGiaoDen} value={`${customer.address}, ${summary.province?.name ?? ''}`} />
          {customer.note.trim() && <Item label={T.ctGhiChu} value={customer.note.trim()} />}
          <Item label={T.ctThoiGian} value={summary.deliveryTime ?? '—'} highlight />
        </dl>

        <dl className="space-y-2.5 border-t border-line bg-mist-100/60 p-6 text-sm sm:p-8">
          <div className="flex justify-between">
            <dt className="text-ink-soft">{T.ctTamTinh}</dt>
            <dd className="tabular text-deep-900">{subtotal ? formatVND(subtotal) : PRICE_ON_CALL}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">{T.ctPhiGiao}</dt>
            <dd className="tabular text-deep-900">{shippingFee === 0 ? T.mienPhi : formatVND(shippingFee)}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-deep-900/15 pt-4">
            <dt className="font-medium text-deep-900">{T.ctTong}</dt>
            <dd className="tabular font-display text-3xl text-deep-900 sm:text-4xl">
              {subtotal ? formatVND(total) : <span className="text-lg">{PRICE_ON_CALL}</span>}
            </dd>
          </div>
        </dl>
      </article>

      <div className="mt-10 flex flex-col items-center gap-6">
        <p className="text-center text-sm text-ink-soft">
          {T.canDoi}{' '}
          <span className="tabular font-medium text-deep-900">{CONTACT.hotlineDisplay}</span>:
        </p>
        <ContactButtons className="justify-center" />
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onNewOrder} className={buttonClass('ghost', 'md')}>
            {T.datThem}
          </button>
          <Link to="/" className={buttonClass('ghost', 'md')}>
            {T.veTrangChu}
          </Link>
        </div>
      </div>
    </div>
  )
}

function Item({ label, value, highlight }: { label: string; value: ReactNode; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-label tracking-[0.12em] text-ink-faint uppercase">{label}</dt>
      <dd className={`mt-1 ${highlight ? 'font-medium text-mist-600' : 'text-deep-900'}`}>{value}</dd>
    </div>
  )
}
