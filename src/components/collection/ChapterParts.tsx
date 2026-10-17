import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import {
  GIFT_PROGRAM_NOTE,
  GIFTS,
  isSizeSoldOut,
  patternPrice,
  SIZES,
  type Collection,
  type ImageSource,
  type Pattern,
  type SizeId,
} from '../../data/catalog'
import { orderUrl } from '../../data/products'
import { STORIES_APPROVED, type PatternStory } from '../../data/stories'
import { formatRange, formatVND } from '../../lib/format'
import { NearMeLine, TrustList } from '../products/DetailParts'
import { CrossfadeImage } from '../ui/CrossfadeImage'
import { Icon, ZaloMark } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, FillIn } from '../ui/primitives'

/* Sân khấu của một chương (phần lấy từ hướng A): ảnh lớn, câu chuyện, lựa chọn mua */

const ARROW = 'flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-deep-900 shadow-[var(--shadow-soft)] transition hover:bg-ivory active:scale-95'

interface ChapterImageProps {
  image?: ImageSource
  /** Mẫu đang hiện trên ảnh (có thể là mẫu đang rê chuột xem trước) */
  shown: Pattern
  note: string
  onPrev: () => void
  onNext: () => void
  className?: string
}

export function ChapterImage({ image, shown, note, onPrev, onNext, className = '' }: ChapterImageProps) {
  return (
    <div className={`min-w-0 lg:sticky lg:top-24 lg:self-start ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-cream-100 shadow-[var(--shadow-soft)]">
        {image ? (
          <CrossfadeImage image={image} sizes="(min-width: 1024px) 680px, 100vw" priority />
        ) : (
          <Placeholder className="absolute inset-0 h-full w-full" tone="mist" tint={shown.swatch} note={note} />
        )}
        <span
          key={shown.code}
          className="fade-in absolute bottom-4 left-4 rounded-full bg-ivory/95 px-3.5 py-1.5 text-[0.78rem] font-medium text-deep-900 shadow-[var(--shadow-soft)]"
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
    </div>
  )
}

interface ChapterStoryProps {
  pattern: Pattern
  story?: PatternStory
  title: string
  /** Số thứ tự chương trong bộ (hoặc trong tập) */
  index: number
  total: number
  volume?: string
  className?: string
}

export function ChapterStory({ pattern, story, title, index, total, volume, className = '' }: ChapterStoryProps) {
  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-x-2.5 font-display text-mist-600 italic">
        <span className="text-[3.4rem] leading-[0.85]">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-[1.05rem]">
          chương / {total}
          {volume && ` · tập ${volume}`}
        </span>
      </p>
      {/* key: đổi chương thì chữ hiện dần lại */}
      <div key={pattern.code} className="fade-in" aria-live="polite">
        <h2 id="chapter-title" className="font-display mt-3 text-[2.3rem] leading-[1.05] text-mist-600 italic sm:text-[3rem]">
          {title}
        </h2>
        <p className="mt-2 text-sm font-medium text-deep-900">
          {pattern.colorName} · {pattern.code}
        </p>
        {story && <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ink-soft">{story.text}</p>}
        {story && !STORIES_APPROVED && (
          <p className="mt-3">
            <FillIn>[ECOPILLO DUYỆT CÂU CHUYỆN PHỐI MÀU]</FillIn>
          </p>
        )}
      </div>
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
  const prices = SIZES.map((s) => patternPrice(collection, pattern, s.id))
  const gift = collection.gift !== 'none' ? GIFTS[collection.gift] : undefined
  return (
    <div className={className}>
      <p className="tabular font-display text-[1.9rem] leading-none text-deep-900">
        {size ? formatVND(patternPrice(collection, pattern, size)) : formatRange(Math.min(...prices), Math.max(...prices))}
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
                <span className="text-[0.68rem] tracking-[0.1em] uppercase">{s.bed}</span>
                <span className={`mt-0.5 text-sm font-medium ${soldOut ? 'line-through' : 'text-deep-900'}`}>{s.label.replace(' cm', '')}</span>
                <span className={`tabular mt-1 text-[0.78rem] ${soldOut ? 'text-alert' : 'text-ink-soft'}`}>
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
            <span className="font-medium">{gift.label}</span> cho mỗi bộ, chương trình Tri ân 15.000 khách hàng. <FillIn>{GIFT_PROGRAM_NOTE}</FillIn>
          </span>
        </p>
      )}

      <div className="mt-6 hidden gap-3 lg:flex">
        {isSoldOut ? (
          <span className={buttonClass('secondary', 'lg', 'flex-1 cursor-not-allowed opacity-60')}>{pattern.code} tạm hết hàng</span>
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
