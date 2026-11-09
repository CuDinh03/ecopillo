import { useEffect, useRef } from 'react'
import type { ImageSource } from '../../data/catalog'
import { Icon } from './Icon'
import { Placeholder } from './Placeholder'

/**
 * Dãy ảnh nhỏ dưới ảnh chính (trang sản phẩm lẻ và trang bộ sưu tập), có nút ‹ › hai bên.
 * Owner 09/11/2026 (ảnh divan 22 ảnh): "thêm nút bấm ở 2 bên để khách biết là những ảnh nhỏ đó là các ảnh mẫu chi tiết
 * của sản phẩm để bấm lướt xem". Nút đổi sang ảnh trước / sau (ảnh chính đổi theo), dãy tự cuộn để ảnh đang xem nằm giữa.
 */

const SIDE_BUTTON =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-deep-900 shadow-[var(--shadow-soft)] transition hover:bg-mist-100 active:scale-95 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-700'

interface ThumbStripProps {
  photos: readonly ImageSource[]
  index: number
  onIndexChange: (index: number) => void
  /** Gắn ảnh nhỏ sau khi ảnh chính đã về (LCP, xem usePageLoaded) */
  defer?: boolean
}

export function ThumbStrip({ photos, index, onIndexChange, defer = false }: ThumbStripProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const last = photos.length - 1

  // Ảnh đang xem luôn lọt trong dãy: cuộn ngang dãy (không dùng scrollIntoView vì nó cuộn cả trang)
  useEffect(() => {
    const list = listRef.current
    const item = list?.children[index] as HTMLElement | undefined
    if (!list || !item) return
    const target = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, target) })
  }, [index])

  if (photos.length < 2) return null

  return (
    <div className="mt-3 flex items-center gap-2">
      <button type="button" onClick={() => onIndexChange(index - 1)} disabled={index <= 0} aria-label="Ảnh trước" className={SIDE_BUTTON}>
        <Icon name="arrowLeft" size={17} />
      </button>
      <ul
        ref={listRef}
        aria-label={`Ảnh sản phẩm, đang xem ảnh ${index + 1} trên ${photos.length}`}
        className="relative flex min-w-0 flex-1 scroll-smooth gap-2.5 overflow-x-auto p-1 [scrollbar-width:none] motion-reduce:scroll-auto"
      >
        {photos.map((photo, i) => (
          <li key={photo.src} className="shrink-0">
            <button
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-pressed={i === index}
              className={`block h-16 w-[5.5rem] overflow-hidden rounded-xl transition ${
                i === index ? 'ring-2 ring-deep-800 ring-offset-2 ring-offset-ivory' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Placeholder compact className="h-full w-full" note={`Ảnh ${i + 1}`} image={photo} sizes="88px" defer={defer} />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onIndexChange(index + 1)} disabled={index >= last} aria-label="Ảnh sau" className={SIDE_BUTTON}>
        <Icon name="arrowRight" size={17} />
      </button>
    </div>
  )
}
