import { useEffect, useRef } from 'react'
import { IS_PREVIEW, PREVIEW_NOTICE } from '../../data/preview'
import { Icon } from '../ui/Icon'
import { buttonClass } from '../ui/primitives'

const SEEN_KEY = 'ecopillo-da-xem-thong-bao-xem-thu'

/** Trình duyệt chặn bộ nhớ (cửa sổ ẩn danh, trình duyệt trong app) thì coi như chưa xem: hiện lại cũng không sao */
function hasSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Không ghi được thì lần sau hiện lại, không ảnh hưởng gì khác
  }
}

/**
 * Lần đầu mở bản xem thử: hộp thông báo "chưa phải web chính thức".
 * Dùng hộp nổi (dialog) thay cho dải trên đầu trang để không đẩy bố cục xuống (CLS)
 * và không phải sửa các chỗ đang tính theo chiều cao thanh đầu trang.
 */
export function PreviewNotice() {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!IS_PREVIEW || hasSeen()) return
    ref.current?.showModal()
  }, [])

  if (!IS_PREVIEW) return null

  return (
    <dialog
      ref={ref}
      aria-labelledby="xem-thu-tieu-de"
      onClose={markSeen}
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-[1.5rem] bg-ivory p-6 text-deep-900 backdrop:bg-deep-950/60 sm:p-8"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist-100 text-deep-800">
        <Icon name="info" size={22} />
      </span>
      <h2 id="xem-thu-tieu-de" className="font-display mt-5 text-[1.7rem] leading-tight">
        {PREVIEW_NOTICE.title}
      </h2>
      <p className="mt-3 text-ink-soft">{PREVIEW_NOTICE.intro}</p>
      <ul className="mt-4 space-y-2 text-body-sm text-ink-soft">
        {PREVIEW_NOTICE.points.map((point) => (
          <li key={point} className="flex gap-2.5">
            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-deep-700" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
      <form method="dialog" className="mt-7">
        <button type="submit" className={buttonClass('primary', 'md', 'w-full')} autoFocus>
          {PREVIEW_NOTICE.close}
        </button>
      </form>
    </dialog>
  )
}
