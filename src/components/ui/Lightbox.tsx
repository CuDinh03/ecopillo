import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ImageSource } from '../../data/catalog'
import { Icon } from './Icon'
import { ZoomStage } from './ZoomStage'

/**
 * Khung xem ảnh toàn màn hình, dùng chung cho mọi dãy ảnh (C3, owner chốt 09/11/2026; mẫu ở docs/de-xuat-gop-y-08-11.html mục C3).
 * Nền tối, "3 / 8 · ER06" + nút Đóng ở trên, ảnh ở giữa (chụm / chạm 2 lần để phóng, vuốt ngang đổi ảnh), dãy ảnh nhỏ ở dưới.
 * Máy tính: mũi tên ‹ ›, phím ← →, Esc đóng; bấm ảnh để phóng rồi rê chuột để soi.
 * Ảnh lớn 1600px chỉ tải khi khung mở (trang vẫn dùng ảnh nhỏ theo srcSet).
 * Mở / đóng và nút Back: useLightbox (src/hooks/useLightbox.ts).
 */

interface LightboxProps {
  photos: readonly ImageSource[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Chữ sau số thứ tự ảnh, ví dụ mã phối màu "ER06" */
  caption?: string
  /** Tên khung cho trình đọc màn hình */
  label: string
}

/** Ảnh nhỏ 640px cùng tên với ảnh lớn (…-sm.webp), có sẵn cho mọi ảnh phối màu và ảnh sản phẩm */
const thumbOf = (photo: ImageSource): string => photo.srcSet.split(',')[0]?.trim().split(' ')[0] || photo.src

/**
 * Lớp bấm phủ kín ảnh chính trên trang để mở khung xem toàn màn hình, kèm biểu tượng kính lúp ở góc phải trên.
 * Đặt ngay sau ảnh trong khung `relative`; chip, mũi tên đặt sau lớp này thì vẫn bấm được như cũ.
 */
export function ZoomTrigger({ onOpen, label = 'Phóng to ảnh' }: { onOpen: () => void; label?: string }) {
  return (
    <button type="button" onClick={onOpen} aria-label={label} className="group absolute inset-0 cursor-zoom-in">
      <span
        aria-hidden
        className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 text-deep-900 shadow-[var(--shadow-soft)] transition group-hover:scale-105 group-active:scale-95"
      >
        <Icon name="zoom" size={18} />
      </span>
    </button>
  )
}

const BUTTON =
  'flex h-11 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22 active:scale-95 focus-visible:outline-white'

export function Lightbox({ photos, index, onIndexChange, onClose, caption, label }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const thumbsRef = useRef<HTMLUListElement>(null)
  const [showHint, setShowHint] = useState(true)
  const count = photos.length
  const go = (next: number) => {
    if (next >= 0 && next < count) onIndexChange(next)
  }

  // Nút đã bấm để mở khung: đóng khung thì trả focus về đó (khung bị gỡ khỏi trang nên trình duyệt không tự trả)
  const openerRef = useRef<HTMLElement | null>(null)

  // Mở bằng showModal: trình duyệt giữ focus trong khung, Esc gọi onCancel
  useEffect(() => {
    const dialog = dialogRef.current
    if (!openerRef.current && document.activeElement instanceof HTMLElement && !dialog?.contains(document.activeElement))
      openerRef.current = document.activeElement
    if (dialog && !dialog.open) dialog.showModal()
    // Khoá cuộn trang phía sau (cả cuộn trôi Lenis trên máy tính) để vị trí trang không đổi khi đóng
    const lenis = window.ecoMotion?.lenis()
    lenis?.stop?.()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      lenis?.start?.()
      // preventScroll: trả focus mà trang không cuộn tới nút
      if (!dialog?.isConnected || !dialog.open) openerRef.current?.focus({ preventScroll: true })
    }
  }, [])

  // Ảnh nhỏ đang chọn luôn nằm trong tầm nhìn của dãy
  useEffect(() => {
    const active = thumbsRef.current?.children[index] as HTMLElement | undefined
    active?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [index])

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={label}
      data-lenis-prevent
      // Esc: trình duyệt định đóng khung, ta đóng qua onClose để lùi đúng mục lịch sử
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(index - 1)
        else if (e.key === 'ArrowRight') go(index + 1)
        else return
        e.preventDefault()
      }}
      className="fade-in fixed inset-0 m-0 h-svh max-h-none w-full max-w-none overflow-hidden bg-night p-0 text-white backdrop:bg-night"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 sm:px-6">
          <p className="tabular text-small text-white/90" aria-live="polite">
            {index + 1} / {count}
            {caption && <span className="text-white/70"> · {caption}</span>}
          </p>
          <button type="button" onClick={onClose} className={`${BUTTON} gap-1.5 px-4 text-small font-medium`} autoFocus>
            <Icon name="close" size={18} /> Đóng
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <ZoomStage photos={photos} index={index} onIndexChange={onIndexChange} onInteract={() => setShowHint(false)} />
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label="Ảnh trước"
                className={`${BUTTON} absolute top-1/2 left-3 hidden w-11 -translate-y-1/2 disabled:opacity-30 md:flex`}
              >
                <Icon name="arrowLeft" size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                disabled={index === count - 1}
                aria-label="Ảnh sau"
                className={`${BUTTON} absolute top-1/2 right-3 hidden w-11 -translate-y-1/2 disabled:opacity-30 md:flex`}
              >
                <Icon name="arrowRight" size={20} />
              </button>
            </>
          )}
          {showHint && (
            <p
              aria-hidden
              className="pointer-events-none absolute bottom-3 left-1/2 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-white/16 px-3.5 py-1.5 text-center text-label text-white"
            >
              <span className="md:hidden">Chụm 2 ngón hoặc chạm 2 lần để phóng · vuốt ngang đổi ảnh</span>
              <span className="hidden md:inline">Bấm vào ảnh để phóng, rê chuột để soi · phím ← → đổi ảnh</span>
            </p>
          )}
        </div>

        {count > 1 && (
          <ul
            ref={thumbsRef}
            aria-label="Chọn ảnh"
            className="flex shrink-0 gap-2 overflow-x-auto overscroll-contain px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] [scrollbar-width:none] sm:justify-center"
          >
            {photos.map((photo, i) => (
              <li key={photo.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Xem ảnh ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={`block h-11 w-[3.75rem] overflow-hidden rounded-lg transition ${
                    i === index ? 'opacity-100 outline-2 outline-offset-2 outline-white' : 'opacity-55 hover:opacity-90'
                  }`}
                >
                  <img src={thumbOf(photo)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>,
    document.body,
  )
}
