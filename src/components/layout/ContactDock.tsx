import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { Icon, ZaloMark } from '../ui/Icon'

/**
 * Thanh liên hệ luôn hiện:
 * - Điện thoại: thanh dưới cùng (Gọi / Zalo / Messenger / Đặt hàng).
 * - Máy tính: 1 nút "Liên hệ" nổi góc phải, bấm mới mở Messenger / Zalo / Gọi (đầu trang gọn, 12/10).
 */
export function ContactDock({ mobileBar = true }: { mobileBar?: boolean }) {
  return (
    <>
      {mobileBar && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-ivory/95 px-3 pt-2.5 backdrop-blur-md md:hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_1.4fr] gap-2">
            <a
              href={CONTACT.hotlineTel}
              className="flex h-12 flex-col items-center justify-center rounded-2xl bg-mist-100 text-deep-900 active:bg-mist-200"
            >
              <Icon name="phone" size={18} />
              <span className="mt-0.5 text-[0.7rem] font-medium">Gọi ngay</span>
            </a>
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-col items-center justify-center rounded-2xl bg-mist-100 text-deep-900 active:bg-mist-200"
            >
              <ZaloMark />
              <span className="mt-0.5 text-[0.7rem] font-medium">Nhắn Zalo</span>
            </a>
            <a
              href={CONTACT.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-col items-center justify-center rounded-2xl bg-mist-100 text-deep-900 active:bg-mist-200"
            >
              <Icon name="messenger" size={18} />
              <span className="mt-0.5 text-[0.7rem] font-medium">Messenger</span>
            </a>
            <Link
              to="/dat-hang"
              className="flex h-12 items-center justify-center gap-1.5 rounded-2xl bg-deep-800 text-sm font-medium text-ivory active:bg-deep-700"
            >
              Đặt hàng
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      )}

      <DesktopDock />
    </>
  )
}

/** Máy tính: gom 3 nút nổi thành 1, để không che nội dung */
function DesktopDock() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => setIsOpen(false), [location])

  useEffect(() => {
    if (!isOpen) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <div ref={ref} className="fixed right-6 bottom-6 z-40 hidden flex-col items-end gap-2.5 md:flex">
      {isOpen && (
        <div id="dock-menu" className="reveal flex flex-col items-end gap-2.5">
            <a
              href={CONTACT.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nhắn Messenger Ecopillo"
              className="group flex h-13 items-center gap-2 rounded-full bg-ivory py-2 pr-4 pl-3 text-sm font-medium text-deep-900 shadow-[var(--shadow-lift)] ring-1 ring-cream-200 transition hover:-translate-y-0.5"
            >
              <Icon name="messenger" size={20} />
              Messenger
            </a>
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nhắn Zalo Ecopillo"
              className="group flex h-13 items-center gap-2 rounded-full bg-ivory py-2 pr-4 pl-3 text-sm font-medium text-deep-900 shadow-[var(--shadow-lift)] ring-1 ring-cream-200 transition hover:-translate-y-0.5"
            >
              <ZaloMark />
              Zalo
            </a>
            <a
              href={CONTACT.hotlineTel}
              aria-label={`Gọi hotline ${CONTACT.hotlineDisplay}`}
              className="flex h-13 items-center gap-2 rounded-full bg-deep-800 py-2 pr-5 pl-4 text-sm font-medium text-ivory shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5 hover:bg-deep-700"
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-mist-400/40 [animation-duration:2.4s]" />
                <Icon name="phone" size={17} />
              </span>
              <span className="tabular">{CONTACT.hotlineDisplay}</span>
            </a>
        </div>
      )}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="dock-menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-14 items-center gap-2 rounded-full bg-deep-800 pr-5 pl-4 text-sm font-medium text-ivory shadow-[var(--shadow-lift)] transition hover:bg-deep-700"
      >
        <Icon name={isOpen ? 'close' : 'messenger'} size={20} />
        {isOpen ? 'Đóng' : 'Liên hệ'}
      </button>
    </div>
  )
}
