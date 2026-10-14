import { IS_PREVIEW, PREVIEW_NOTICE } from '../../data/preview'
import { Icon } from './Icon'

/** Màn hình cảm ơn trên bản xem thử: nói rõ đơn/tin nhắn chưa gửi đi, để khách không chờ cuộc gọi */
export function PreviewNotSent({ className = '' }: { className?: string }) {
  if (!IS_PREVIEW) return null
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
