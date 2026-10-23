import { CONTACT } from '../../data/brand'
import { GIFT_PROGRAM_NOTE, isSizeSoldOut, patternPrice, SIZES, unitOf, type SizeId } from '../../data/catalog'
import { formatVND } from '../../lib/format'
import { MAX_QUANTITY, type OrderSummaryData } from '../../lib/order'
import { Icon } from '../ui/Icon'
import { QuantityStepper } from '../ui/QuantityStepper'
import { FillIn } from '../ui/primitives'

interface StepSizeProps {
  summary: OrderSummaryData
  onSelectSize: (size: SizeId) => void
  onChangeQuantity: (quantity: number) => void
}

export function StepSize({ summary, onSelectSize, onChangeQuantity }: StepSizeProps) {
  const { collection, pattern, size, quantity, gift, giftCount, subtotal } = summary
  if (!collection || !pattern) return null
  const unit = unitOf(collection)

  return (
    <div className="space-y-12">
      <fieldset id="chon-kich-thuoc" className="scroll-mt-28">
        <legend className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">Chọn kích thước</legend>
        <p className="mt-1 text-sm text-ink-soft">
          {collection.name} · mẫu <span className="font-medium text-deep-900">{pattern.code}</span> ({pattern.colorName})
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {SIZES.map((s) => {
            const soldOut = isSizeSoldOut(pattern, s.id)
            const checked = size === s.id
            return (
              <label
                key={s.id}
                className={`relative flex flex-col rounded-2xl p-5 ring-1 transition duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mist-600 ${
                  soldOut
                    ? 'cursor-not-allowed bg-mist-100 text-ink-faint ring-cream-200'
                    : checked
                      ? 'cursor-pointer bg-mist-50 shadow-[var(--shadow-soft)] ring-2 ring-deep-800'
                      : 'cursor-pointer bg-ivory ring-cream-200 hover:ring-mist-400'
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={s.id}
                  checked={checked}
                  disabled={soldOut}
                  onChange={() => onSelectSize(s.id)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className={`block text-[0.72rem] tracking-[0.14em] uppercase ${soldOut ? '' : 'text-mist-600'}`}>
                      {s.bed}
                    </span>
                    <span className={`font-display mt-1 block text-[1.35rem] leading-tight ${soldOut ? 'line-through decoration-1' : 'text-deep-900'}`}>
                      {s.label}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      checked ? 'border-deep-800 bg-deep-800 text-ivory' : 'border-line'
                    }`}
                  >
                    {checked && <Icon name="check" size={12} strokeWidth={2.4} />}
                  </span>
                </span>
                <span className="mt-4 flex items-center justify-between gap-2">
                  {soldOut ? (
                    <span className="rounded-full bg-alert-soft px-2.5 py-1 text-[0.72rem] font-medium text-alert">
                      Tạm hết hàng
                    </span>
                  ) : (
                    <span className="tabular font-medium text-deep-900">
                      {formatVND(patternPrice(collection, pattern, s.id))}
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          Kích thước hết hàng sẽ sớm về lại — nhắn Zalo để được báo khi có. Giá 180×200 hiện là giá tạm tính{' '}
          <FillIn>[XÁC NHẬN GIÁ KÍCH THƯỚC 180×200]</FillIn>
        </p>
      </fieldset>

      <fieldset>
        <legend className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">Số lượng</legend>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <QuantityStepper value={quantity} max={MAX_QUANTITY} onChange={onChangeQuantity} />
          <p className="text-sm text-ink-soft">
            {quantity >= MAX_QUANTITY ? (
              <>
                Cần nhiều hơn {MAX_QUANTITY} {unit} cho khách sạn, resort?{' '}
                <a href={CONTACT.hotlineTel} className="font-medium text-deep-900 underline underline-offset-4">
                  Gọi nhận báo giá
                </a>
              </>
            ) : (
              unit
            )}
          </p>
        </div>
      </fieldset>

      {gift && (
        <section
          aria-label="Quà tặng kèm"
          className="grain relative overflow-hidden rounded-[1.5rem] bg-brass-100 p-6 sm:flex sm:items-center sm:gap-6"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ivory text-brass-600">
            <Icon name="gift" size={26} />
          </span>
          <div className="mt-4 sm:mt-0">
            <p className="text-[0.72rem] tracking-[0.14em] text-brass-600 uppercase">Quà tặng kèm · Tri ân 15.000 khách hàng</p>
            <p className="font-display mt-1 text-[1.35rem] leading-tight text-deep-900">
              {giftCount} {gift.unit} {gift.item}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {gift.label} × {quantity} bộ. Số lượng quà có hạn. <FillIn>{GIFT_PROGRAM_NOTE}</FillIn>
            </p>
          </div>
        </section>
      )}

      {size && (
        <p className="flex items-baseline justify-between border-t border-ivory pt-6">
          <span className="text-ink-soft">Tạm tính ({quantity} {unit})</span>
          <span className="tabular font-display text-3xl text-deep-900">{formatVND(subtotal)}</span>
        </p>
      )}
    </div>
  )
}
