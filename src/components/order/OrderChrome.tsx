import { CONTACT } from '../../data/brand'
import { formatVND } from '../../lib/format'
import { Icon, ZaloMark } from '../ui/Icon'

/** Cam kết ngắn dưới tóm tắt đơn, dùng chung cho mọi kiểu đơn */
export function OrderAssurances({ deliveryTime }: { deliveryTime?: string }) {
  return (
    <>
      {deliveryTime && (
        <p className="mt-4 flex items-center gap-2 px-2 text-sm text-ink-soft">
          <Icon name="truck" size={17} className="text-mist-600" />
          Giao dự kiến: <span className="font-medium text-deep-900">{deliveryTime}</span>
        </p>
      )}
      <ul className="mt-5 space-y-2 px-2 text-meta text-ink-soft">
        {[
          'Nhân viên gọi xác nhận trước khi giao',
          'Thanh toán khi nhận, miễn phí giao từ 500.000đ',
          'Kiểm hàng, trải thử lên giường khi nhận',
          'Đổi hàng trong 7 ngày nếu còn nguyên tem mác',
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <Icon name="check" size={14} className="mt-0.5 shrink-0 text-mist-600" />
            {t}
          </li>
        ))}
      </ul>
    </>
  )
}

interface MobileOrderBarProps {
  amount: number
  amountLabel: string
  nextLabel: string
  hint: string | null
  canContinue: boolean
  onNext: () => void
}

/**
 * Thanh dưới cố định trên điện thoại: gọi / Zalo / số tiền / bước tiếp theo.
 * Rà điện thoại 05/11/2026: ở 320px dòng gợi ý và tổng tiền bị cắt "4.950.0…", nên gợi ý xuống tối đa hai dòng
 * (nút cao theo chữ) và số tiền không bao giờ ngắt. Chưa đi tiếp được thì nút vẫn nền chàm đậm (nền chàm 45% chỉ
 * đạt 2,5:1 với chữ trắng), chỉ mũi tên nhạt đi; dòng gợi ý đã nói Quý khách cần làm gì.
 */
export function MobileOrderBar({ amount, amountLabel, nextLabel, hint, canContinue, onNext }: MobileOrderBarProps) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-3 pt-2.5 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-2">
        <a
          href={CONTACT.hotlineTel}
          aria-label={`Gọi hotline ${CONTACT.hotlineDisplay}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mist-100 text-deep-900 active:bg-mist-200"
        >
          <Icon name="phone" size={19} />
        </a>
        <a
          href={CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo Ecopillo"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mist-100 active:bg-mist-200"
        >
          <ZaloMark />
        </a>
        <button
          type="button"
          onClick={onNext}
          aria-disabled={!canContinue}
          className="flex min-h-12 min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl bg-deep-800 py-1.5 pr-3 pl-4 text-left text-ivory transition active:bg-deep-700"
        >
          <span className="min-w-0 leading-tight">
            <span className="line-clamp-2 text-label text-ivory/90">
              {hint ?? (
                <>
                  {amountLabel}
                  {amount > 0 && <span className="whitespace-nowrap"> {formatVND(amount)}</span>}
                </>
              )}
            </span>
            <span className="block truncate text-body-sm font-medium">{nextLabel}</span>
          </span>
          <Icon name="arrowRight" size={18} className={`shrink-0 transition-opacity ${canContinue ? '' : 'opacity-50'}`} />
        </button>
      </div>
    </div>
  )
}
