import { useEffect, useRef } from 'react'
import { imageOfPattern, isPatternSoldOut, type Collection, type Pattern } from '../../data/catalog'
import { chapterTitle } from '../../data/stories'
import { usePageLoaded } from '../../hooks/usePageLoaded'
import { preloadImage } from '../../lib/preload'
import { Placeholder } from '../ui/Placeholder'

interface ChapterRailProps {
  collection: Collection
  /** Mọi phối màu của bộ, một hàng (anh Quang, Zalo 12/11/2026: bỏ nút chọn tập, "để tất cả sp của bộ sưu tập vào 1 chỗ") */
  chapters: readonly Pattern[]
  current: Pattern
  onOpen: (pattern: Pattern) => void
  /** Rê chuột: xem trước ảnh chương; null khi rời */
  onPreview: (code: string | null) => void
  className?: string
}

/**
 * Hàng chương: điện thoại vuốt ngang, máy tính xếp lưới. Bấm một chương thì sân khấu đổi tại chỗ.
 * C1 (khách 08/11/2026, owner chốt 09/11/2026 phương án 2): trên điện thoại hàng này nằm ngay dưới ảnh, tên "Chọn màu";
 * thẻ to (~40% bề ngang), chỉ tên thơ + mã, thẻ đang chọn không nền chàm đậm (viền chàm sáng mảnh).
 */
export function ChapterRail({ collection, chapters, current, onOpen, onPreview, className = '' }: ChapterRailProps) {
  const listRef = useRef<HTMLUListElement>(null)
  // Hàng chương nằm ngay màn đầu trên điện thoại: ảnh nhỏ gắn sau khi ảnh chính đã về (LCP, xem usePageLoaded)
  const isPageLoaded = usePageLoaded()

  // Điện thoại: đổi chương bằng mũi tên thì kéo thẻ đang mở vào giữa hàng (chỉ cuộn ngang, không kéo cả trang).
  // Thẻ đã nằm trọn trong tầm nhìn (khách vừa bấm nó) thì để yên: bấm màu nào chỉ đổi ảnh và tên (C1)
  useEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!list || !active || list.scrollWidth <= list.clientWidth) return
    const card = active.parentElement ?? active
    const isVisible = card.offsetLeft >= list.scrollLeft && card.offsetLeft + card.offsetWidth <= list.scrollLeft + list.clientWidth
    if (isVisible) return
    list.scrollTo({ left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2, behavior: 'smooth' })
  }, [current.code])

  return (
    <section aria-labelledby="chapters-title" className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 id="chapters-title" className="font-display text-[1.35rem] leading-tight text-deep-900 sm:text-[2rem]">
            <span className="lg:hidden">Chọn màu</span>
            {/* Anh Quang (Zalo 12/11/2026): "Các màu sắc của bộ sưu tập" + tên bộ */}
            <span className="max-lg:hidden">Các màu sắc của bộ sưu tập {collection.name}</span>
          </h2>
          {chapters.length > 2 && <p className="mt-0.5 text-meta text-ink-soft lg:hidden">Vuốt ngang để xem thêm màu</p>}
        </div>
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
            <li key={pattern.code} className="w-[40vw] max-w-[12rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
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
                // Thẻ đang chọn: viền chàm sáng mảnh, nền trắng như thẻ khác (khách: "không khung chàm đậm").
                // flex-col: nút tự canh giữa nội dung theo chiều dọc, thẻ cao hơn (tên 3 dòng cùng hàng) thì ảnh bị đẩy xuống
                className={`flex h-full w-full flex-col overflow-hidden rounded-2xl bg-ivory pb-3 text-left text-deep-900 shadow-[var(--shadow-soft)] transition duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
                  active ? 'outline-2 outline-offset-2 outline-deep-700' : ''
                }`}
              >
                <span className={`block aspect-[4/3] overflow-hidden ${soldOut ? 'opacity-50' : ''}`}>
                  <Placeholder
                    compact
                    className="h-full w-full"
                    tint={pattern.swatch}
                    note={pattern.code}
                    image={image}
                    sizes="(min-width: 1024px) 170px, 40vw"
                    defer={!isPageLoaded}
                  />
                </span>
                {/* Chỉ tên thơ + mã; câu tả màu đã có trên ảnh lớn và dưới tên chương (C1) */}
                <span className="font-display mt-2.5 block px-3 text-body leading-tight">{chapterTitle(collection, pattern)}</span>
                <span className="tabular mt-1 block px-3 text-label leading-snug text-ink-soft">
                  {pattern.code}
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
