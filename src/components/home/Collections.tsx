import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import {
  BEDDING_SETS,
  collectionRange,
  coverOf,
  GIFTS,
  imageOfPattern,
  isPatternSoldOut,
  type Collection,
  type Pattern,
} from '../../data/catalog'
import { orderUrl } from '../../data/products'
import { collectionPath, PATHS } from '../../data/links'
import { chapterTitle, patternPath } from '../../data/stories'
import { formatRange } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { preloadImage } from '../../lib/preload'
import { CrossfadeImage } from '../ui/CrossfadeImage'
import { MobileMore } from '../ui/MobileMore'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, Container, SectionHeading } from '../ui/primitives'

/** Thứ tự và độ rộng ô trên lưới bento (lg: 3 cột) */
const LAYOUT: readonly { id: string; wide?: boolean }[] = [
  { id: 'eco-rosa', wide: true },
  { id: 'eco-flora' },
  { id: 'eco-tera' },
  { id: 'eco-vera' },
  { id: 'eco-sweet' },
  { id: 'eco-liora' },
  { id: 'eco-doris', wide: true },
]

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
  // Điện thoại chỉ hiện 4 ô để ô màu và "+N mẫu" nằm gọn một hàng
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
            className={`group/sw relative z-10 -mx-[3px] -my-1.5 grid h-10 w-[34px] place-items-center rounded-full min-[360px]:-mx-1.5 min-[360px]:w-10 sm:m-0 sm:h-7 sm:w-7 ${
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
          // Máy tính hiện đủ mẫu (extra = 0) thì link không có chữ: ẩn hẳn để không có link trống
          className={`relative z-10 -my-3 py-3 pl-1 text-xs font-medium whitespace-nowrap text-deep-800 underline-offset-4 hover:underline ${
            extra > 0 ? '' : 'sm:hidden'
          }`}
        >
          <span className="sm:hidden">+{extraMobile} mẫu</span>
          {extra > 0 && <span className="max-sm:hidden">+{extra} mẫu</span>}
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

function CollectionCard({ collection, wide, index = 0 }: { collection: Collection; wide?: boolean; index?: number }) {
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
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
        wide ? `lg:col-span-2 lg:grid ${isTop ? 'lg:grid-cols-[1fr_1.15fr]' : 'lg:grid-cols-[1.15fr_1fr]'}` : ''
      }`}
    >
      <div
        className={`relative overflow-hidden ${wide ? 'aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]' : 'aspect-[4/3]'} ${
          isTop ? 'lg:order-2' : ''
        }`}
      >
        {image ? (
          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]">
            <CrossfadeImage
              image={image}
              sizes={wide ? '(min-width: 1024px) 540px, 100vw' : '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'}
            />
          </div>
        ) : (
          <Placeholder
            className="absolute inset-0 h-full w-full !rounded-none border-0 border-b lg:border-b-0"
            tint={pattern?.swatch}
            note={collection.imageNote}
          />
        )}
        {collection.badge && (
          <span
            className={`absolute top-4 left-4 rounded-full px-3 py-1 text-label font-medium tracking-wide uppercase ${
              isTop ? 'bg-deep-900 text-brass-100' : 'bg-ivory text-deep-800'
            }`}
          >
            {collection.badge}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-5 sm:p-7 ${wide ? 'lg:p-10' : ''}`}>
        <p className="text-label font-medium tracking-[0.14em] text-mist-600 uppercase">
          {collection.kindLabel}
        </p>
        <h3 className={`font-display mt-2 text-deep-900 ${wide ? 'text-[1.75rem] sm:text-[2.2rem] lg:text-[2.6rem]' : 'text-[1.75rem] sm:text-[1.8rem]'}`}>
          <Link to={collectionPath(collection)} className="decoration-mist-300 underline-offset-[6px] hover:underline">
            {collection.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-small text-ink-soft italic sm:line-clamp-none sm:text-body-sm">{collection.tagline}</p>

        {wide && <p className="mt-5 hidden max-w-md text-sm leading-relaxed text-ink-soft sm:block">{collection.description}</p>}

        <p className="mt-4 hidden text-meta leading-snug text-ink-soft sm:block">
          <span className="text-ink-faint">Gồm: </span>
          {collection.contents.join(' · ')}
        </p>

        <div className="mt-5">
          <Swatches collection={collection} selected={pattern} onSelect={setPatternCode} onPreview={setPreviewCode} />
        </div>

        <div className="mt-auto pt-5 sm:pt-6">
          <p className="hidden text-label tracking-wide text-ink-faint uppercase sm:block">1m6 → 2m2</p>
          <p className="tabular mt-1 text-lead font-medium text-deep-900">{formatRange(min, max)}</p>
          {gift.perSet > 0 && (
            <p className="mt-2 flex items-center gap-2 text-meta text-brass-600">
              <Icon name="gift" size={15} />
              {gift.label}
            </p>
          )}
          <div className="mt-5 flex gap-2">
            <Link
              to={orderUrl(collection, pattern && !isPatternSoldOut(pattern) ? pattern : undefined)}
              className={buttonClass('primary', 'md', 'flex-1 sm:flex-none')}
              aria-label={`Đặt mua ${collection.name}`}
            >
              Đặt mua
              <Icon name="arrowRight" size={17} />
            </Link>
            <Link
              to={pattern ? patternPath(collection, pattern) : collectionPath(collection)}
              className={buttonClass('secondary', 'md', 'flex-1 sm:flex-none')}
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

export function Collections() {
  const byId = new Map(BEDDING_SETS.map((c) => [c.id, c]))

  return (
    <section id="bo-suu-tap" aria-labelledby="collections-title" className="py-14 sm:py-24">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="collections-title"
            title="Bảy bộ sưu tập, một chuẩn mực êm ái"
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

        <div className="m-rail mt-8 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {LAYOUT.map(({ id, wide }, index) => {
            const c = byId.get(id)
            return c ? <CollectionCard key={id} collection={c} wide={wide} index={index} /> : null
          })}
        </div>

        <div className="mt-6 flex justify-center sm:mt-10">
          <Link to={PATHS.products} className={buttonClass('secondary', 'lg')}>
            Xem tất cả sản phẩm
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        {/* Điện thoại: "trong bộ gồm" nằm sau nút (vẫn có trong trang) */}
        <MobileMore label="Trong mỗi bộ gồm những gì" buttonClassName="mt-4">
          <SetAnatomy />
        </MobileMore>
      </Container>
    </section>
  )
}

const ANATOMY = [
  {
    title: 'Bộ ga phủ / bộ chăn ga',
    note: 'Eco Rosa, Tera, Vera, Sweet, Liora, Doris',
    items: [
      ['Ga phủ chần', '160×200 · 180×200 · 200×220'],
      // Mục 28 (Ecopillo trả lời 23/10/2026): Rosa, Tera, Vera chọn được ga chun chần thay ga phủ, giá riêng
      ['hoặc ga chun chần (Rosa, Tera, Vera)', 'cùng kích thước'],
      ['Vỏ chăn 4 mùa, khoá kéo', '200×220'],
      ['2 vỏ gối đầu', '45×65'],
      ['1 vỏ gối ôm', '80×100'],
      // Chỉ Eco Doris có gối tựa (mục 29)
      ['1 vỏ gối tựa (riêng Eco Doris)', '45×45'],
    ],
  },
  {
    title: 'Bộ ga chun',
    note: 'Eco Flora',
    items: [
      ['Ga chun', 'theo kích thước giường'],
      ['Vỏ chăn 4 mùa', '200×220'],
      ['2 vỏ gối đầu', '45×65'],
    ],
  },
] as const

function SetAnatomy() {
  return (
    <div className="m-rail mt-10 grid gap-5 sm:mt-16 lg:grid-cols-[1fr_1fr_0.9fr]">
      {ANATOMY.map((set, i) => (
        <div key={set.title} data-reveal style={revealDelay(i)} className="rounded-[1.75rem] bg-ivory p-6 shadow-[var(--shadow-soft)] sm:p-7">
          <h3 className="font-display text-2xl text-deep-900">{set.title}</h3>
          <p className="mt-1 text-xs text-ink-faint">{set.note}</p>
          <dl className="mt-5 space-y-3 text-sm">
            {set.items.map(([name, size]) => (
              <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                {/* Đường chỉ nối tên và cỡ vẽ bằng ::after của dt: trong dl chỉ được có dt, dd (audit 16/10/2026) */}
                <dt className="text-deep-900 sm:flex sm:flex-1 sm:items-baseline sm:gap-3 sm:after:block sm:after:flex-1 sm:after:translate-y-[-3px] sm:after:text-cream-300 sm:after:content-[''] sm:after:h-px sm:after:[background-image:linear-gradient(to_right,currentColor_50%,transparent_0)] sm:after:[background-size:10px_1px] sm:after:bg-repeat-x">
                  {name}
                </dt>
                <dd className="tabular text-meta text-ink-soft sm:text-right sm:text-sm">{size}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      <div data-reveal style={revealDelay(2)} className="flex flex-col justify-between gap-5 rounded-[1.75rem] bg-mist-100 p-6 sm:p-7">
        <div>
          <Icon name="ruler" size={24} className="text-mist-600" />
          <h3 className="font-display mt-3 text-2xl text-deep-900">Giường kích thước riêng?</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Gửi số đo dài × rộng × độ dày đệm qua Zalo, Ecopillo may vừa khít cho Quý khách.
          </p>
        </div>
        <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'md', 'self-start')}>
          Gửi số đo qua Zalo
        </a>
      </div>
    </div>
  )
}
