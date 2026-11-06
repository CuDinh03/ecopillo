import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collectionRange,
  coverOf,
  imageOfPattern,
  isPatternSoldOut,
  type Collection,
  type Pattern,
} from '../../data/catalog'
import { COLLECTION_GROUPS, SEE_ALL_TILE, type CollectionGroup } from '../../data/collectionGroups'
import { orderUrl } from '../../data/products'
import { collectionPath, PATHS } from '../../data/links'
import { chapterTitle, patternPath } from '../../data/stories'
import { formatRange } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { preloadImage } from '../../lib/preload'
import { CrossfadeImage } from '../ui/CrossfadeImage'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, Container, SectionHeading } from '../ui/primitives'

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
  index?: number
}

/** Thẻ bộ sưu tập: mọi thẻ bằng nhau, nút và giá dồn xuống đáy để các thẻ cùng hàng thẳng nhau */
function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const { min, max } = collectionRange(collection)
  const [patternCode, setPatternCode] = useState(collection.cover ?? collection.patterns[0]?.code)
  const [previewCode, setPreviewCode] = useState<string | null>(null)
  const pattern = collection.patterns.find((p) => p.code === patternCode)
  // Ảnh hiện theo mẫu đang rê chuột (xem trước), không thì theo mẫu đã chọn
  const shownPattern = collection.patterns.find((p) => p.code === previewCode) ?? pattern
  const image = imageOfPattern(collection, shownPattern) ?? coverOf(collection)
  const isTop = collection.id === 'eco-doris'

  return (
    <article
      data-reveal
      style={revealDelay(index)}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
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

/** Đầu cột loại vải: nhãn nhỏ, tên loại, câu giải thích */
function FabricHeader({ group, headingId }: { group: CollectionGroup; headingId: string }) {
  return (
    <header className="mb-3.5 min-h-0 border-t-2 border-deep-800 pt-2.5 sm:mb-3.5 sm:min-h-[5.75rem]">
      <p className="text-[0.64rem] font-medium tracking-[0.14em] text-mist-600 uppercase">Loại vải</p>
      <h3 id={headingId} className="font-display mt-0.5 text-[1.2rem] text-deep-900 sm:text-[1.45rem]">
        {group.title}
      </h3>
      <p className="mt-1 text-[0.74rem] leading-snug text-ink-soft sm:text-[0.78rem]">{group.note}</p>
    </header>
  )
}

/** Ô chàm cuối lưới máy tính: dẫn sang trang Sản phẩm */
function SeeAllTile() {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <header className="mb-3.5 min-h-[5.75rem] border-t-2 border-deep-800 pt-2.5">
        <p className="text-[0.64rem] font-medium tracking-[0.14em] text-mist-600 uppercase">{SEE_ALL_TILE.label}</p>
        <h3 className="font-display mt-0.5 text-[1.45rem] text-deep-900">{SEE_ALL_TILE.title}</h3>
        <p className="mt-1 text-[0.78rem] leading-snug text-ink-soft">{SEE_ALL_TILE.note}</p>
      </header>
      <Link
        to={PATHS.products}
        className="flex min-h-[220px] min-w-0 flex-1 flex-col justify-end gap-2.5 rounded-[1.375rem] bg-deep-800 p-[22px] text-ivory shadow-[var(--shadow-soft)] transition duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:bg-deep-700 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="font-display text-[1.5rem] leading-tight">{SEE_ALL_TILE.heading}</span>
        <span className="text-[0.84rem] text-ivory/80">{SEE_ALL_TILE.lead}</span>
        <span className="mt-1.5 inline-flex self-start rounded-full bg-ivory px-4 py-2.5 text-[0.84rem] font-medium text-deep-800">
          {SEE_ALL_TILE.cta}
          <Icon name="arrowRight" size={16} className="ml-1.5" />
        </span>
      </Link>
    </div>
  )
}

/** Cột loại vải trên máy tính: đầu cột + lưới thẻ (nhóm hai bộ chiếm hai cột) */
function FabricColumn({ group, indexOffset }: { group: CollectionGroup; indexOffset: number }) {
  const headingId = `${group.id}-tieu-de`
  const span = group.collections.length
  return (
    <section
      id={group.id}
      aria-labelledby={headingId}
      className={`flex min-w-0 flex-col ${span > 1 ? 'sm:col-span-2' : 'sm:col-span-1'}`}
    >
      <FabricHeader group={group} headingId={headingId} />
      {/* minmax(0,1fr): thẻ trong nhóm 2 cột (Rosa+Flora) được phép co, không đẩy lưới tràn ngang */}
      <div
        className={`grid min-w-0 flex-1 gap-5 ${
          span > 1 ? 'sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]' : 'grid-cols-1'
        }`}
      >
        {group.collections.map((c, i) => (
          <CollectionCard key={c.id} collection={c} index={indexOffset + i} />
        ))}
      </div>
    </section>
  )
}

/** Điện thoại: một dải vuốt, mỗi mục = đầu loại vải + một thẻ */
function MobileRail() {
  const items = COLLECTION_GROUPS.flatMap((group) =>
    group.collections.map((c) => ({ group, collection: c })),
  )
  return (
    <div
      className="m-rail -mx-5 flex gap-3 overflow-x-auto scroll-smooth px-5 pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      role="list"
      aria-label="Bộ sưu tập theo loại vải"
    >
      {items.map(({ group, collection }, index) => (
        <div key={collection.id} role="listitem" className="w-[84%] min-w-0 shrink-0 snap-start">
          <FabricHeader group={group} headingId={`${group.id}-${collection.id}-tieu-de`} />
          <CollectionCard
            collection={collection}
            index={index}
          />
        </div>
      ))}
    </div>
  )
}

export function Collections() {
  // Offset chỉ số hiện dần cho từng cột (tính trước, không sửa biến khi render)
  const offsets = COLLECTION_GROUPS.reduce<number[]>((acc, _group, i) => {
    const prev = i === 0 ? 0 : acc[i - 1]! + COLLECTION_GROUPS[i - 1]!.collections.length
    acc.push(prev)
    return acc
  }, [])

  return (
    <section id="bo-suu-tap" aria-labelledby="collections-title" className="py-14 sm:py-24">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="collections-title"
            title="Bộ sưu tập chăn ga, chọn theo loại vải"
            lead="Giá thay đổi theo kích thước giường 1m6, 1m8 và 2m2. Bấm “Đặt mua” để chọn mẫu và kích thước."
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

        {/* Điện thoại: một dải vuốt; máy tính từ sm: lưới cột theo loại vải (phương án 1) */}
        <div className="mt-8 sm:hidden">
          <MobileRail />
          <div className="mt-6 flex justify-center">
            <Link to={PATHS.products} className={buttonClass('secondary', 'lg')}>
              {SEE_ALL_TILE.heading}
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </div>

        {/*
          Máy tính: 2 cột (sm–lg) rồi 4 cột từ xl — khớp phương án 1 (docs/de-xuat-nhom-vai-05-11.html).
          Không dùng lg:grid-cols-3: nhóm "In hoạ tiết" chiếm 2 cột (Rosa+Flora) sẽ lệch/cắt mép phải ở khoảng 1024–1279.
          minmax(0,1fr) ở cả lưới ngoài và lưới trong cột: thẻ không giữ min-content, không đẩy trang tràn ngang.
        */}
        <div className="mt-10 hidden gap-x-5 gap-y-10 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[repeat(4,minmax(0,1fr))]">
          {COLLECTION_GROUPS.map((group, i) => (
            <FabricColumn key={group.id} group={group} indexOffset={offsets[i]!} />
          ))}
          <div className="min-w-0 sm:col-span-1">
            <SeeAllTile />
          </div>
        </div>
      </Container>
    </section>
  )
}
