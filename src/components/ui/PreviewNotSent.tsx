import { IS_PREVIEW, PREVIEW_NOTICE } from '../../data/preview'
import { Icon } from './Icon'

interface PreviewNotSentProps {
  /** true: đơn / tin nhắn đã ghi vào trang tính của Ecopillo (src/lib/sendForm.ts), không cần ghi chú */
  delivered: boolean
  className?: string
}

/**
 * Màn hình cảm ơn trên bản xem thử khi hàm gửi chưa nối Apps Script: nói rõ đơn/tin nhắn chưa gửi đi,
 * để khách không chờ cuộc gọi. Bản chạy thật không bao giờ tới màn hình cảm ơn khi chưa gửi được.
 */
export function PreviewNotSent({ delivered, className = '' }: PreviewNotSentProps) {
  if (delivered || !IS_PREVIEW) return null
  return (
    <p
      role="note"
      className={`flex items-start gap-2.5 rounded-2xl bg-mist-100 px-4 py-3 text-left text-sm text-deep-900 ring-1 ring-deep-700/25 ${className}`}
    >
      <Icon name="info" size={17} className="mt-0.5 shrink-0" />
      {PREVIEW_NOTICE.notSent}
    </p>
  )
}
