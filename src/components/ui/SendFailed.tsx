import { CONTACT } from '../../data/brand'
import { Icon } from './Icon'

interface SendFailedProps {
  /** "đơn hàng" hoặc "tin nhắn" */
  what: string
  className?: string
}

/**
 * Gửi không được (mất mạng, máy chủ lỗi): báo thẳng là CHƯA gửi, mời thử lại hoặc gọi / nhắn Zalo.
 * Thông tin khách đã nhập vẫn giữ nguyên trên form.
 */
export function SendFailed({ what, className = '' }: SendFailedProps) {
  return (
    <div role="alert" className={`rounded-2xl bg-alert-soft px-4 py-3.5 text-body-sm text-alert ${className}`}>
      <p className="flex items-start gap-2 font-medium">
        <Icon name="info" size={17} className="mt-0.5 shrink-0" />
        Chưa gửi được {what}. Thông tin Quý khách nhập vẫn còn, xin bấm gửi lại sau ít phút.
      </p>
      <p className="mt-2 pl-6 text-deep-900">
        Cần ngay, Quý khách gọi{' '}
        <a href={CONTACT.hotlineTel} className="tabular font-medium whitespace-nowrap underline underline-offset-2">
          {CONTACT.hotlineDisplay}
        </a>{' '}
        hoặc{' '}
        <a
          href={CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2"
        >
          nhắn Zalo
        </a>
        .
      </p>
    </div>
  )
}
