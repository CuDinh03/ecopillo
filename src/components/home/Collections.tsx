import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  collectionRange,
  coverOf,
  GIFTS,
  imageOfPattern,
  isPatternSoldOut,
  type Collection,
  type Pattern,
} from '../../data/catalog'
import { COLLECTION_GROUPS, type CollectionGroup } from '../../data/collectionGroups'
import { orderUrl } from '../../data/products'
import { collectionPath, PATHS } from '../../data/links'
import { chapterTitle, patternPath } from '../../data/stories'
import { formatRange } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { scrollToElement } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import { preloadImage } from '../../lib/preload'
import { CrossfadeImage } from '../ui/CrossfadeImage'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, Container, FillIn, SectionHeading } from '../ui/primitives'

export const orderLink = (collectionId: string) => `${PATHS.order}?bo-suu-tap=${collectionId}`

const SWATCH_LIMIT = 6

/** Nhãn nổi khi rê / chọn bàn phím vào ô màu (thay cho title mặc định của trình duyệt) */
function SwatchTip({ pattern }: { pattern: Pattern }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 rounded-lg bg-deep-900 px-2.5 py-1.5 text-label whitespace-nowrap text-ivory opacity-0 shadow-[var(--shadow-soft)] transition duration-200 group-hover/sw:translate-y-0 group-hover/sw:opacity-100 group-focus-visible/sw:translate-y-0 group-focus-visible/sw:opacity-100"
    >
      <span className="font-medium">{pattern.code}</span> · {pattern.colorName}
      {isPatternSoldOut(pattern) && <span className="text-mist-300"> · tạm hết</span>}
      <span aria-hidden="true" className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-deep-900" />
    </span>
  )
}
const MOBILE_SWATCHES = 4

interface SwatchesProps {
  collection: Collection
  selected?: Pattern
  onSelect: (code: string) => void
  /** Rê chuột: xem trước mẫu; null khi rời ô */
  onPreview: (code: string | null) => void
}

/** Ô màu bấm được: đổi ảnh thẻ sang mẫu tương ứng */
function Swatches({ collection, selected, onSelect, onPreview }: SwatchesProps) {
  // Mẫu đại diện luôn đứng đầu để ô đang chọn luôn nhìn thấy
  const ordered = [
    ...collection.patterns.filter((p) => p.code === collection.cover),
    ...collection.patterns.filter((p) => p.code !== collection.cover),
  ]
  const shown = ordered.slice(0, SWATCH_LIMIT)
  const extra = collection.patterns.length - shown.length
  // Điện thoại chỉ hiện 4 ô để ô màu và "Xem thêm" nằm gọn một hàng
  const extraMobile = collection.patterns.length - Math.min(shown.length, MOBILE_SWATCHES)
  // Điện thoại: nút rộng hơn ô màu nhìn thấy (28px) để dễ bấm, lề âm bù lại nên hàng không dài thêm.
  // 320px chỉ đủ chỗ cho vùng bấm 34×40; từ 360px giãn ô ra để vùng bấm đủ 40×40 mà không chồng nhau.
  return (
    <div
      className="flex flex-wrap items-center gap-1.5 min-[360px]:gap-x-3 sm:gap-x-1.5"
      role="group"
      aria-label={`Chọn mẫu ${collection.name}`}
    >
      {shown.map((p, index) => {
        const active = p.code === selected?.code
        return (
          <button
            key={p.code}
            type="button"
            aria-label={`Mẫu ${p.code} ${p.colorName}`}
            aria-pressed={active}
            onClick={() => onSelect(p.code)}
            onPointerEnter={(e) => {
              preloadImage(imageOfPattern(collection, p))
              if (e.pointerType === 'mouse') onPreview(p.code)
            }}
            onPointerLeave={() => onPreview(null)}
            onFocus={() => preloadImage(imageOfPattern(collection, p))}
            className={`group/sw relative z-10 -mx-0.5 -my-1.5 grid h-11 w-10 place-items-center rounded-full min-[360px]:-mx-1.5 min-[360px]:w-10 sm:m-0 sm:h-7 sm:w-7 ${
              isPatternSoldOut(p) ? 'opacity-40' : ''
            } ${index >= MOBILE_SWATCHES ? 'max-sm:hidden' : ''}`}
          >
            <span
              className={`block h-7 w-7 rounded-full p-[3px] transition duration-300 ease-[var(--ease-soft)] group-hover/sw:scale-110 ${
                active ? 'ring-2 ring-deep-800' : 'ring-1 ring-transparent group-hover/sw:ring-mist-400'
              }`}
            >
              <span className="block h-full w-full rounded-full ring-1 ring-deep-900/15" style={{ backgroundColor: p.swatch }} />
            </span>
            <SwatchTip pattern={p} />
          </button>
        )
      })}
      {extraMobile > 0 && (
        <Link
          to={collectionPath(collection)}
          // Máy tính đã hiện đủ mẫu (extra = 0) thì ẩn link trên máy tính
          aria-label={`Xem thêm mẫu ${collection.name}`}
          className={`relative z-10 -my-3 py-3 pl-1 text-xs font-medium whitespace-nowrap text-deep-800 underline-offset-4 hover:underline ${
            extra > 0 ? '' : 'sm:hidden'
          }`}
        >
          {/* Không ghi số mẫu (khách 05/11/2026: "đừng cho số lượng vào", web chưa đủ hết mẫu đang bán) */}
          Xem thêm
        </Link>
      )}
      {selected && (
        <span key={selected.code} className="fade-in w-full pt-1 text-label text-ink-soft">
          <span className="font-display text-small text-mist-600 italic">{chapterTitle(collection, selected)}</span> · {selected.colorName} ·{' '}
          {selected.code}
        </span>
      )}
    </div>
  )
}

interface CollectionCardProps {
  collection: Collection
  /** Chưa xác nhận bộ này thuộc nhóm đang hiện (câu hỏi STT 68) */
  unconfirmed?: boolean
  index?: number
}

/** Thẻ bộ sưu tập: mọi thẻ bằng nhau (mục 9, mẫu A), nút và giá dồn xuống đáy để các thẻ cùng hàng thẳng nhau */
function CollectionCard({ collection, unconfirmed, index = 0 }: CollectionCardProps) {
  const { min, max } = collectionRange(collection)
  const [patternCode, setPatternCode] = useState(collection.cover ?? collection.patterns[0]?.code)
  const [previewCode, setPreviewCode] = useState<string | null>(null)
  const pattern = collection.patterns.find((p) => p.code === patternCode)
  // Ảnh hiện theo mẫu đang rê chuột (xem trước), không thì theo mẫu đã chọn
  const shownPattern = collection.patterns.find((p) => p.code === previewCode) ?? pattern
  const image = imageOfPattern(collection, shownPattern) ?? coverOf(collection)
  const gift = GIFTS[collection.gift]
  const isTop = collection.id === 'eco-doris'

  return (
    <article
      data-reveal
      style={revealDelay(index)}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]">
            <CrossfadeImage image={image} sizes="(min-width: 1280px) 280px, (min-width: 1024px) 300px, (min-width: 640px) 50vw, 84vw" />
          </div>
        ) : (
          <Placeholder
            className="absolute inset-0 h-full w-full !rounded-none border-0 border-b"
            tint={pattern?.swatch}
            note={collection.imageNote}
          />
        )}
        {/* Nhãn đặt góc trên trái: góc dưới ảnh có mã mẫu in sẵn (ES06, ER48…) */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          {collection.badge && (
            <span
              className={`rounded-full px-3 py-1 text-label font-medium tracking-wide uppercase ${
                isTop ? 'bg-deep-900 text-brass-100' : 'bg-ivory text-deep-800'
              }`}
            >
              {collection.badge}
            </span>
          )}
          {unconfirmed && <FillIn className="text-label">[XÁC NHẬN loại]</FillIn>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-label font-medium tracking-[0.14em] text-mist-600 uppercase">{collection.kindLabel}</p>
        <h4 className="font-display mt-2 text-[1.6rem] text-deep-900">
          <Link to={collectionPath(collection)} className="decoration-mist-300 underline-offset-[6px] hover:underline">
            {collection.name}
          </Link>
        </h4>
        <p className="mt-1 line-clamp-2 text-small text-ink-soft italic sm:line-clamp-none">{collection.tagline}</p>

        <p className="mt-4 hidden text-meta leading-snug text-ink-soft sm:block">
          <span className="text-ink-faint">Gồm: </span>
          {collection.contents.join(' · ')}
        </p>

        <div className="mt-5">
          <Swatches collection={collection} selected={pattern} onSelect={setPatternCode} onPreview={setPreviewCode} />
        </div>

        <div className="mt-auto pt-5">
          <p className="hidden text-label tracking-wide text-ink-faint uppercase sm:block">1m6 → 2m2</p>
          <p className="tabular mt-1 text-lead font-medium text-deep-900">{formatRange(min, max)}</p>
          {gift.perSet > 0 && (
            <p className="mt-2 flex items-center gap-2 text-meta text-brass-600">
              <Icon name="gift" size={15} />
              {gift.label}
            </p>
          )}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link
              to={orderUrl(collection, pattern && !isPatternSoldOut(pattern) ? pattern : undefined)}
              className={buttonClass('primary', 'md', '!px-3')}
              aria-label={`Đặt mua ${collection.name}`}
            >
              Đặt mua
              <Icon name="arrowRight" size={17} />
            </Link>
            <Link
              to={pattern ? patternPath(collection, pattern) : collectionPath(collection)}
              className={buttonClass('secondary', 'md', '!px-3')}
              aria-label={`Xem chi tiết ${collection.name}`}
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Hàng chip dưới tiêu đề: bấm thì cuộn tới nhóm (đi qua Lenis) */
function GroupJumps() {
  const goTo = (e: MouseEvent<HTMLAnchorElement>, group: CollectionGroup) => {
    const target = document.getElementById(group.id)
    if (!target) return
    e.preventDefault()
    scrollToElement(target)
  }
  return (
    <nav aria-label="Nhóm bộ sưu tập theo cách làm hoa văn" className="mt-6 sm:mt-8">
      <ul className="flex flex-wrap gap-2">
        {COLLECTION_GROUPS.map((group) => (
          <li key={group.id}>
            <a
              href={`#${group.id}`}
              onClick={(e) => goTo(e, group)}
              className="group/chip inline-flex h-10 items-center gap-1.5 rounded-full bg-ivory px-4 text-sm font-medium text-deep-900 shadow-[var(--shadow-soft)] transition duration-300 ease-[var(--ease-soft)] hover:bg-deep-800 hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist-600 active:scale-[0.98]"
            >
              {group.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function GroupBlock({ group }: { group: CollectionGroup }) {
  const headingId = `${group.id}-tieu-de`
  return (
    <section id={group.id} aria-labelledby={headingId} className="mt-10 scroll-mt-[5.5rem] sm:mt-14">
      <header className="mb-5 flex flex-col gap-1 border-b border-line pb-3 sm:grid sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-5 sm:pb-4">
        <h3 id={headingId} className="font-display text-[1.6rem] text-deep-900 sm:text-[1.75rem]">
          {group.title}
        </h3>
        <p className="text-meta leading-relaxed text-ink-soft sm:text-sm">{group.note}</p>
      </header>
      <div className="m-rail grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {group.collections.map((c, index) => (
          <CollectionCard key={c.id} collection={c} unconfirmed={group.unconfirmed.has(c.id)} index={index} />
        ))}
      </div>
    </section>
  )
}

export function Collections() {
  return (
    <section id="bo-suu-tap" aria-labelledby="collections-title" className="py-14 sm:py-24">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="collections-title"
            title="Bộ sưu tập chăn ga, chọn theo cách làm hoa văn"
            lead="Giá thay đổi theo kích thước giường 1m6, 1m8 và 2m2. Bấm “Đặt mua” để chọn mẫu, kích thước và xem quà tặng kèm."
          />
          <ol className="flex gap-6 text-sm text-ink-soft lg:pb-2" aria-label="Phân khúc">
            <li>
              <span className="block font-display text-2xl text-deep-900">3,5tr</span>khởi điểm
            </li>
            <li className="border-l border-line pl-6">
              <span className="block font-display text-2xl text-deep-900">10,4tr</span>dòng cao nhất
            </li>
          </ol>
        </div>

        <GroupJumps />

        {COLLECTION_GROUPS.map((group) => (
          <GroupBlock key={group.id} group={group} />
        ))}

        <div className="mt-8 flex justify-center sm:mt-12">
          <Link to={PATHS.products} className={buttonClass('secondary', 'lg')}>
            Xem tất cả sản phẩm
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
        {/* Khối "Trong mỗi bộ gồm những gì" bỏ theo khách 05/11/2026 ("nhìn lộn xộn"); thành phần từng bộ vẫn ở dòng "Gồm" trên thẻ và trang bộ */}
      </Container>
    </section>
  )
}
