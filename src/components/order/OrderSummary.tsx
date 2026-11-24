import { formatVND } from '../../lib/format'
import { PRICE_ON_CALL, type OrderSummaryData } from '../../lib/order'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { ORDER_SUMMARY_TEXT as T } from '../../data/pageText/orderFlow'

interface OrderSummaryProps {
  summary: OrderSummaryData
  /** Ở bước nhận hàng mới biết tỉnh/thành nên mới hiện phí giao */
  showShipping: boolean
}

export function OrderSummary({ summary, showShipping }: OrderSummaryProps) {
  const { line, subtotal, shippingFee, total, priceOnCall } = summary

  return (
    <section aria-label={T.tenKhung} className="rounded-[1.75rem] bg-cream-50 p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <h2 className="font-display text-2xl text-deep-900">{T.tieuDe}</h2>

      {!line ? (
        <p className="mt-4 text-sm text-ink-soft">{T.chuaChon}</p>
      ) : (
        <>
          <div className="mt-5 flex gap-4">
            <div className="h-20 w-24 shrink-0 rounded-xl">
              <Placeholder compact className="h-full w-full" tint={line.tint} note={line.imageNote} image={line.image} sizes="96px" />
            </div>
            <div className="min-w-0">
              <p className="text-label tracking-[0.12em] text-mist-600 uppercase">{line.kindLabel}</p>
              <p className="font-display text-xl leading-tight text-deep-900">{line.name}</p>
              <p className="mt-1 text-sm text-ink-soft">{line.detail}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
            <Row label={T.kichThuoc} value={line.sizeLabel ?? '—'} />
            <Row label={T.soLuong} value={`${line.quantity} ${line.unit}`} />
            <Row label={T.donGia} value={line.unitPrice ? formatVND(line.unitPrice) : priceOnCall ? PRICE_ON_CALL : '—'} />
            {line.gift && (
              <div className="flex items-start justify-between gap-4 text-brass-600">
                <dt className="flex items-center gap-1.5">
                  <Icon name="gift" size={14} /> {T.quaTang}
                </dt>
                <dd className="text-right">
                  {line.giftCount} {line.gift.unit} {line.gift.item}
                </dd>
              </div>
            )}
          </dl>

          <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
            <Row label={T.tamTinh} value={subtotal ? formatVND(subtotal) : priceOnCall ? PRICE_ON_CALL : '—'} />
            <Row
              label={T.phiGiao}
              value={shippingLabel(showShipping, Boolean(subtotal || priceOnCall), shippingFee)}
              muted={!showShipping}
            />
            {/* Thông báo Ecopillo từ 07/08/2026: chuyển khoản, không tiền mặt (paymentPolicy.ts); "Khi nhận hàng" trơ trọi đọc như COD */}
            <Row label={T.thanhToan} value={T.cachThanhToan} />
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-deep-900/15 pt-5">
            <span className="font-medium text-deep-900">{T.tongCong}</span>
            <span className="tabular font-display text-[1.7rem] leading-none text-deep-900">
              {subtotal ? formatVND(showShipping ? total : subtotal) : priceOnCall ? <span className="text-base">{PRICE_ON_CALL}</span> : '—'}
            </span>
          </div>
        </>
      )}
    </section>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={`tabular text-right ${muted ? 'text-ink-faint' : 'text-deep-900'}`}>{value}</dd>
    </div>
  )
}

/** Chưa chọn đủ để có giá thì chưa nói miễn phí hay mất phí (trước đây hiện 50.000đ khi tạm tính còn trống) */
const shippingLabel = (showShipping: boolean, hasPrice: boolean, fee: number): string => {
  if (!showShipping) return T.phiGiaoSau
  if (!hasPrice) return '—'
  return fee === 0 ? T.mienPhi : formatVND(fee)
}
