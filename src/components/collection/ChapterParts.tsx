import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import {
  GIFTS,
  isSizeSoldOut,
  patternPrice,
  patternRange,
  SIZES,
  type Collection,
  type ImageSource,
  type Pattern,
  type SizeId,
} from '../../data/catalog'
import { orderUrl } from '../../data/products'
import { useLightbox } from '../../hooks/useLightbox'
import { usePageLoaded } from '../../hooks/usePageLoaded'
import { STORIES_APPROVED, type PatternStory } from '../../data/stories'
import { formatRange, formatVND } from '../../lib/format'
import { NearMeLine, TrustList } from '../products/DetailParts'
import { CrossfadeImage } from '../ui/CrossfadeImage'
import { Icon, ZaloMark } from '../ui/Icon'
import { Lightbox, ZoomTrigger } from '../ui/Lightbox'
import { Placeholder } from '../ui/Placeholder'
import { ThumbStrip } from '../ui/ThumbStrip'
import { buttonClass, FillIn } from '../ui/primitives'

/* Sân khấu của một chương (phần lấy từ hướng A): ảnh lớn, câu chuyện, lựa chọn mua */

const ARROW = 'flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-deep-900 shadow-[var(--shadow-soft)] transition hover:bg-ivory active:scale-95'

interface ChapterImageProps {
  image?: ImageSource
  /** Ảnh phụ chi tiết của phối màu (web cũ); không gồm ảnh chính */
  gallery?: readonly ImageSource[]
  /** Mẫu đang hiện trên ảnh (có thể là mẫu đang rê chuột xem trước) */
  shown: Pattern
  note: string
  onPrev: () => void
  onNext: () => void
  className?: string
}

export function ChapterImage({ image, gallery = [], shown, note, onPrev, onNext, className = '' }: ChapterImageProps) {
  // Ảnh đang chọn trong dãy: 0 = ảnh chính, 1… = ảnh phụ. Đổi chương / xem trước thì về ảnh chính.
  const photos = image ? [image, ...gallery] : []
  const [photoIndex, setPhotoIndex] = useState(0)
  useEffect(() => {
    setPhotoIndex(0)
  }, [shown.code])
  const safeIndex = photos.length ? Math.min(photoIndex, photos.length - 1) : 0
  const current = photos[safeIndex]
  // Dãy ảnh nhỏ dưới ảnh chính: gắn sau khi ảnh chính đã về (LCP, xem usePageLoaded)
  const isPageLoaded = usePageLoaded()
  // Bấm ảnh chính: xem toàn màn hình (C3); đổi ảnh trong khung thì ảnh trên trang đổi theo
  const lightbox = useLightbox()

  return (
    <div className={`min-w-0 lg:sticky lg:top-24 lg:self-start ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-cream-100 shadow-[var(--shadow-soft)]">
        {current ? (
          <CrossfadeImage image={current} sizes="(min-width: 1024px) 680px, 100vw" priority />
        ) : (
          <Placeholder className="absolute inset-0 h-full w-full" tone="mist" tint={shown.swatch} note={note} />
        )}
        {current && <ZoomTrigger onOpen={lightbox.open} label={`Phóng to ảnh ${shown.code}`} />}
        {/* Góc trái trên: góc trái dưới ảnh gốc có vòng mã in sẵn, chip đặt ở đó thì đè lên vòng (rà 23/10/2026) */}
        <span
          key={shown.code}
          className="fade-in pointer-events-none absolute top-4 left-4 rounded-full bg-ivory/95 px-3.5 py-1.5 text-meta font-medium text-deep-900 shadow-[var(--shadow-soft)]"
        >
          {shown.code} · {shown.colorName}
        </span>
        <div className="absolute right-3 bottom-3 flex gap-2">
          <button type="button" onClick={onPrev} aria-label="Chương trước" className={ARROW}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <button type="button" onClick={onNext} aria-label="Chương sau" className={ARROW}>
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>
      {/* Nút ‹ › hai bên dãy ảnh nhỏ (owner 09/11/2026), dùng chung với trang sản phẩm lẻ */}
      <ThumbStrip photos={photos} index={safeIndex} onIndexChange={setPhotoIndex} defer={!isPageLoaded} />
      {lightbox.isOpen && photos.length > 0 && (
        <Lightbox
          photos={photos}
          index={safeIndex}
          onIndexChange={setPhotoIndex}
          onClose={lightbox.close}
          caption={shown.code}
          label={`Ảnh phối màu ${shown.code} · ${shown.colorName}`}
        />
      )}
    </div>
  )
}

interface ChapterStoryProps {
  pattern: Pattern
  story?: PatternStory
  title: string
  /**
   * Trang riêng của phối màu: tên đầy đủ "Bộ chăn ga Lyocell Eco Rosa ER25" thành H1 duy nhất của trang
   * (SSG giai đoạn 2; web cũ cũng đặt H1 như vậy). Trang bộ sưu tập không truyền: H1 là tên bộ ở bìa.
   */
  heading?: string
  className?: string
}

export function ChapterStory({ pattern, story, title, heading, className = '' }: ChapterStoryProps) {
  return (
    <div className={className}>
      {/* Khách 08/11/2026 bỏ dòng đếm chương; 12/11/2026 bỏ chia tập nên cũng không ghi "Tập …" nữa */}
      {/* key: đổi chương thì chữ hiện dần lại */}
      <div key={pattern.code} className="fade-in" aria-live="polite">
        {heading ? (
          <>
            {/* Tên chương giữ nguyên kiểu chữ nhưng không là thẻ tiêu đề; dòng nhỏ bên dưới là H1 */}
            <p id="chapter-title" className="font-display mt-3 text-[2.3rem] leading-[1.05] text-mist-600 italic sm:text-[3rem]">
              {title}
            </p>
            <div className="mt-2 text-sm font-medium text-deep-900">
              <h1 className="inline">{heading}</h1> · {pattern.colorName}
            </div>
          </>
        ) : (
          <>
            <h2 id="chapter-title" className="font-display mt-3 text-[2.3rem] leading-[1.05] text-mist-600 italic sm:text-[3rem]">
              {title}
            </h2>
            <p className="mt-2 text-sm font-medium text-deep-900">
              {pattern.code} · {pattern.colorName}
            </p>
          </>
        )}
        {story && <StoryText text={story.text} />}
        {story && !story.fromCatalog && !STORIES_APPROVED && (
          <p className="mt-3">
            <FillIn>[ECOPILLO DUYỆT CÂU CHUYỆN PHỐI MÀU]</FillIn>
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Câu chuyện phối màu. Điện thoại: thu còn 3 dòng + "Đọc tiếp" để giá, kích thước không bị đẩy xa (C1, 08/11/2026).
 * Máy tính: hiện đủ. Nằm trong khối có key theo mã màu, nên đổi màu thì thu lại.
 */
function StoryText({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false)
  // Câu chuyện ngắn vừa 3 dòng thì không cần nút
  const [isClamped, setIsClamped] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => setIsClamped(el.scrollHeight > el.clientHeight + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div className="mt-4 max-w-xl">
      <p ref={textRef} className={`text-body leading-relaxed text-ink-soft ${isOpen ? '' : 'max-lg:line-clamp-3'}`}>
        {text}
      </p>
      {!isOpen && isClamped && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          // Vùng bấm cao 44px nhưng không đẩy chữ (lề âm)
          className="-my-2 inline-flex h-11 items-center text-sm font-medium text-deep-700 underline underline-offset-4 lg:hidden"
        >
          Đọc tiếp
        </button>
      )}
    </div>
  )
}

interface ChapterBuyProps {
  collection: Collection
  pattern: Pattern
  size: SizeId | null
  onSize: (size: SizeId) => void
  isSoldOut: boolean
  className?: string
}

export function ChapterBuy({ collection, pattern, size, onSize, isSoldOut, className = '' }: ChapterBuyProps) {
  const range = patternRange(collection, pattern)
  const gift = collection.gift !== 'none' ? GIFTS[collection.gift] : undefined
  return (
    <div className={className}>
      <p className="tabular font-display text-[1.9rem] leading-none text-deep-900">
        {size ? formatVND(patternPrice(collection, pattern, size)) : formatRange(range.min, range.max)}
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-deep-900">Kích thước</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {SIZES.map((s) => {
            const soldOut = isSizeSoldOut(pattern, s.id)
            const active = size === s.id
            return (
              <button
                key={s.id}
                type="button"
                disabled={soldOut}
                aria-pressed={active}
                onClick={() => onSize(s.id)}
                className={`flex flex-col items-start rounded-2xl px-3 py-3 text-left transition disabled:cursor-not-allowed ${
                  soldOut
                    ? 'bg-cream-50 text-ink-faint shadow-[var(--shadow-soft)]'
                    : active
                      ? 'bg-mist-50 ring-2 ring-deep-800'
                      : 'bg-ivory ring-1 ring-cream-200 hover:ring-deep-700'
                }`}
              >
                <span className="text-label tracking-[0.1em] uppercase">{s.bed}</span>
                <span className={`mt-0.5 text-sm font-medium ${soldOut ? 'line-through' : 'text-deep-900'}`}>{s.label.replace(' cm', '')}</span>
                <span className={`tabular mt-1 text-meta ${soldOut ? 'text-alert' : 'text-ink-soft'}`}>
                  {soldOut ? 'Tạm hết hàng' : formatVND(patternPrice(collection, pattern, s.id))}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {gift && (
        <p className="mt-6 flex items-start gap-3 rounded-2xl bg-brass-100 p-4 text-sm text-deep-900">
          <Icon name="gift" size={20} className="mt-0.5 shrink-0 text-brass-600" />
          <span>
            <span className="font-medium">{gift.label}</span> cho mỗi bộ, chương trình Tri ân 15.000 khách hàng.
          </span>
        </p>
      )}

      <div className="mt-6 hidden gap-3 lg:flex">
        {isSoldOut ? (
          // Nhãn, không phải nút: màu chữ đặt thẳng (không dùng opacity) để đủ tương phản 4.5:1 (axe 06/11/2026), cùng kiểu nhãn hết hàng trên điện thoại (DetailParts)
          <span className="inline-flex h-14 flex-1 cursor-not-allowed items-center justify-center rounded-full bg-mist-100 px-7 text-base font-medium text-ink-soft">
            {pattern.code} tạm hết hàng
          </span>
        ) : (
          <Link to={orderUrl(collection, pattern, size)} className={buttonClass('primary', 'lg', 'flex-1')}>
            Đặt mua {pattern.code}
            <Icon name="arrowRight" size={18} />
          </Link>
        )}
        <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'lg')}>
          <ZaloMark /> Tư vấn
        </a>
      </div>

      <NearMeLine />
      <TrustList />
    </div>
  )
}
