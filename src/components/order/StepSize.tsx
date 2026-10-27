import { CONTACT } from '../../data/brand'
import {
  isSizeSoldOut,
  setPrice,
  SHEET_LABELS,
  SIZES,
  unitOf,
  type SheetStyle,
  type SizeId,
} from '../../data/catalog'
import { formatVND } from '../../lib/format'
import { MAX_QUANTITY, PRICE_ON_CALL, type OrderSummaryData } from '../../lib/order'
import { Icon } from '../ui/Icon'
import { QuantityStepper } from '../ui/QuantityStepper'

interface StepSizeProps {
  summary: OrderSummaryData
  sheet: SheetStyle
  onSelectSheet: (sheet: SheetStyle) => void
  onSelectSize: (size: SizeId) => void
  onChangeQuantity: (quantity: number) => void
}

// Chỉ tả kiểu ga chung, không thêm chi tiết sản phẩm chưa được Ecopillo xác nhận
const SHEET_NOTES: Readonly<Record<SheetStyle, string>> = {
  phu: 'Trải phủ mặt đệm, buông xuống quanh thành đệm',
  chun: 'Bo chun ôm quanh đệm, không xô lệch',
}

export function StepSize({ summary, sheet, onSelectSheet, onSelectSize, onChangeQuantity }: StepSizeProps) {
  const { collection, pattern, size, quantity, gift, giftCount, subtotal, priceOnCall } = summary
  if (!collection || !pattern) return null
  const unit = unitOf(collection)
  const activeSheet: SheetStyle = collection.hasFittedOption ? sheet : 'phu'

  return (
    <div className="space-y-12">
      {/* Mục 28 (Ecopillo trả lời 23/10/2026): Rosa, Tera, Vera chọn ga phủ chần hoặc ga chun chần, giá riêng */}
      {collection.hasFittedOption && (
        <fieldset>
          <legend className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">Kiểu ga</legend>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(['phu', 'chun'] as const).map((id) => {
              const checked = activeSheet === id
              return (
                <label
                  key={id}
                  className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl p-5 ring-1 transition duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mist-600 ${
                    checked ? 'bg-mist-50 shadow-[var(--shadow-soft)] ring-2 ring-deep-800' : 'bg-ivory ring-cream-200 hover:ring-mist-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="sheet"
                    value={id}
                    checked={checked}
                    onChange={() => onSelectSheet(id)}
                    className="sr-only"
                  />
                  <span>
                    <span className="font-display block text-[1.35rem] leading-tight text-deep-900">{SHEET_LABELS[id]}</span>
                    <span className="mt-1 block text-sm text-ink-soft">{SHEET_NOTES[id]}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      checked ? 'border-deep-800 bg-deep-800 text-ivory' : 'border-line'
                    }`}
                  >
                    {checked && <Icon name="check" size={12} strokeWidth={2.4} />}
                  </span>
                </label>
              )
            })}
          </div>
          {activeSheet === 'chun' && !pattern.fittedPrices && (
            <p className="mt-4 text-sm text-ink-soft">
              Mẫu {pattern.code} chưa có giá ga chun chần: nhân viên báo giá khi gọi xác nhận.
            </p>
          )}
        </fieldset>
      )}

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
                    <span className={`block text-label tracking-[0.14em] uppercase ${soldOut ? '' : 'text-mist-600'}`}>
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
                    <span className="rounded-full bg-alert-soft px-2.5 py-1 text-label font-medium text-alert">
                      Tạm hết hàng
                    </span>
                  ) : (
                    <span className="tabular font-medium text-deep-900">
                      {formatPrice(setPrice(collection, pattern, s.id, activeSheet))}
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          Kích thước hết hàng sẽ sớm về lại — nhắn Zalo để được báo khi có.
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
            <p className="text-label tracking-[0.14em] text-brass-600 uppercase">Quà tặng kèm · Tri ân 15.000 khách hàng</p>
            <p className="font-display mt-1 text-[1.35rem] leading-tight text-deep-900">
              {giftCount} {gift.unit} {gift.item}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {gift.label} × {quantity} bộ. Số lượng quà có hạn.
            </p>
          </div>
        </section>
      )}

      {size && (
        <p className="flex items-baseline justify-between border-t border-ivory pt-6">
          <span className="text-ink-soft">Tạm tính ({quantity} {unit})</span>
          <span className="tabular font-display text-3xl text-deep-900">
            {priceOnCall ? <span className="text-lg">{PRICE_ON_CALL}</span> : formatVND(subtotal)}
          </span>
        </p>
      )}
    </div>
  )
}

const formatPrice = (price: number | undefined) => (price === undefined ? PRICE_ON_CALL : formatVND(price))
