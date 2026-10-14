import { Icon } from './Icon'

interface QuantityStepperProps {
  value: number
  max: number
  onChange: (value: number) => void
  size?: 'sm' | 'md'
}

/** Nút − số lượng + dùng chung ở trang sản phẩm và trang đặt hàng */
export function QuantityStepper({ value, max, onChange, size = 'md' }: QuantityStepperProps) {
  const btn = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  return (
    <div className="inline-flex items-center rounded-full bg-ivory p-1 ring-1 ring-cream-200">
      <button
        type="button"
        aria-label="Giảm số lượng"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className={`flex ${btn} items-center justify-center rounded-full text-deep-900 transition hover:bg-mist-100 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <Icon name="minus" size={18} />
      </button>
      <output aria-live="polite" aria-label="Số lượng" className="tabular w-11 text-center text-lg font-medium text-deep-900">
        {value}
      </output>
      <button
        type="button"
        aria-label="Tăng số lượng"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={`flex ${btn} items-center justify-center rounded-full text-deep-900 transition hover:bg-mist-100 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  )
}
