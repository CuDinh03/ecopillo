import { useEffect, useRef } from 'react'
import { imageOfPattern, isPatternSoldOut, type Collection, type Pattern } from '../../data/catalog'
import { chapterTitle } from '../../data/stories'
import { preloadImage } from '../../lib/preload'
import { Placeholder } from '../ui/Placeholder'

interface ChapterRailProps {
  collection: Collection
  /** Các chương đang hiện (cả bộ, hoặc một tập của bộ nhiều phối màu) */
  chapters: readonly Pattern[]
  current: Pattern
  volumes: readonly string[]
  volume?: string
  onVolume: (volume: string) => void
  onOpen: (pattern: Pattern) => void
  /** Rê chuột: xem trước ảnh chương; null khi rời */
  onPreview: (code: string | null) => void
  className?: string
}

/** Hàng chương: điện thoại vuốt ngang, máy tính xếp lưới. Bấm một chương thì sân khấu đổi tại chỗ */
export function ChapterRail({ collection, chapters, current, volumes, volume, onVolume, onOpen, onPreview, className = '' }: ChapterRailProps) {
  const listRef = useRef<HTMLUListElement>(null)

  // Điện thoại: đổi chương bằng mũi tên thì kéo thẻ đang mở vào giữa hàng (chỉ cuộn ngang, không kéo cả trang)
  useEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!list || !active || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2, behavior: 'smooth' })
  }, [current.code, volume])

  return (
    <section aria-labelledby="chapters-title" className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <h2 id="chapters-title" className="font-display text-[1.5rem] leading-tight text-deep-900 sm:text-[2rem]">
          {collection.patterns.length} chương màu của {collection.name}
        </h2>
        {volumes.length > 1 && (
          <div role="group" aria-label="Chọn tập" className="-mx-5 flex gap-2 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] sm:mx-0 sm:px-0 sm:[mask-image:none]">
            {volumes.map((v) => {
              const active = v === volume
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onVolume(v)}
                  className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm whitespace-nowrap transition ${
                    active ? 'bg-deep-800 text-ivory' : 'bg-ivory text-ink-soft shadow-[var(--shadow-soft)] hover:text-deep-900'
                  }`}
                >
                  Tập {v}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <ul
        ref={listRef}
        className="-mx-5 mt-4 flex snap-x gap-3 overflow-x-auto px-5 pt-1 pb-3 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0"
      >
        {chapters.map((pattern, i) => {
          const active = pattern.code === current.code
          const soldOut = isPatternSoldOut(pattern)
          const image = imageOfPattern(collection, pattern)
          return (
            <li key={pattern.code} className="w-[8.5rem] shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                aria-pressed={active}
                aria-label={`Chương ${i + 1}: ${chapterTitle(collection, pattern)}, ${pattern.colorName} ${pattern.code}`}
                onClick={() => onOpen(pattern)}
                onPointerEnter={(e) => {
                  preloadImage(image)
                  if (e.pointerType === 'mouse') onPreview(pattern.code)
                }}
                onPointerLeave={() => onPreview(null)}
                onFocus={() => preloadImage(image)}
                className={`block h-full w-full rounded-2xl p-1.5 pb-3 text-left transition duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
                  active ? 'bg-deep-900 text-ivory' : 'bg-cream-50 text-deep-900 shadow-[var(--shadow-soft)]'
                }`}
              >
                <span className={`block aspect-[4/3] overflow-hidden rounded-xl ${soldOut ? 'opacity-50' : ''}`}>
                  <Placeholder compact className="h-full w-full" tint={pattern.swatch} note={pattern.code} image={image} sizes="170px" />
                </span>
                {/* Tên trên thẻ đứng, đậm như thẻ phối màu (mẫu A 04/11/2026) */}
                <span className="font-display mt-2.5 block px-1.5 text-body leading-tight">
                  {chapterTitle(collection, pattern)}
                </span>
                <span className={`mt-1 block px-1.5 text-label leading-snug ${active ? 'text-ivory/75' : 'text-ink-faint'}`}>
                  {pattern.colorName} · {pattern.code}
                  {soldOut && ' · tạm hết'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
