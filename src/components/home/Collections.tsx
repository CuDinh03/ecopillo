import { Link } from 'react-router-dom'
import { collectionRange, coverOf } from '../../data/catalog'
import { COLLECTION_SHOWCASE_TEXT, CORE_COLLECTIONS, MORE_COLLECTIONS, type ShowcaseItem } from '../../data/collectionGroups'
import { collectionPath, PATHS } from '../../data/links'
import { formatVND } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, Container, SectionHeading } from '../ui/primitives'

export const orderLink = (collectionId: string) => `${PATHS.order}?bo-suu-tap=${collectionId}`

/**
 * Trang chủ, bộ sưu tập chăn ga (C4, phương án 1, owner chốt 09/11/2026; dữ liệu ở src/data/collectionGroups.ts).
 * Điện thoại: bốn bộ lõi ô 2×2, ba bộ còn lại ba dòng gọn, nút Xem tất cả.
 * Máy tính: bốn ô một hàng, ba bộ còn lại một hàng nhỏ bên dưới.
 * Bấm ô hay dòng đều sang trang bộ sưu tập (chọn mẫu, kích thước, đặt mua ở đó).
 */

/** Ô bộ lõi: ảnh vuông, tên, loại vải, "từ" giá thấp nhất */
function CoreTile({ item, index }: { item: ShowcaseItem; index: number }) {
  const { collection, fabric } = item
  const image = coverOf(collection)
  const { min } = collectionRange(collection)
  return (
    <li data-reveal style={revealDelay(index)} className="min-w-0">
      <Link
        to={collectionPath(collection)}
        className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:rounded-[1.75rem]"
      >
        <span className="relative block aspect-square overflow-hidden">
          <span className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]">
            <Placeholder
              className="h-full w-full"
              image={image}
              note={collection.imageNote}
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 45vw, 46vw"
            />
          </span>
        </span>
        <span className="flex flex-1 flex-col px-3 pt-2.5 pb-3 sm:px-5 sm:pt-4 sm:pb-5">
          <span className="font-display text-[1.15rem] leading-tight text-deep-900 sm:text-[1.6rem]">{collection.name}</span>
          {/* Loại vải và giá hai dòng riêng: chung một dòng thì 390px rớt dòng ở Vera, Rosa, ô cao thấp lệch nhau */}
          <span className="mt-0.5 text-label text-ink-soft sm:mt-1 sm:text-meta">{fabric}</span>
          <span className="tabular mt-1 text-small font-medium text-deep-900 sm:mt-1.5">từ {formatVND(min)}</span>
          <span className="mt-2 hidden text-small text-ink-soft italic sm:block">{collection.tagline}</span>
        </span>
      </Link>
    </li>
  )
}

/** Dòng gọn cho ba bộ còn lại: ảnh nhỏ, tên, loại vải, mũi tên */
function MoreRow({ item }: { item: ShowcaseItem }) {
  const { collection, fabric } = item
  return (
    <li className="min-w-0">
      <Link
        to={collectionPath(collection)}
        className="group grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-ivory p-2 pr-4 shadow-[var(--shadow-soft)] transition duration-300 ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Placeholder
          compact
          className="h-14 w-[4.5rem] rounded-xl"
          image={coverOf(collection)}
          note={collection.imageNote}
          sizes="72px"
        />
        <span className="min-w-0">
          <span className="block font-display text-[1.1rem] leading-tight text-deep-900">{collection.name}</span>
          <span className="mt-0.5 block text-label text-ink-soft">{fabric}</span>
        </span>
        <Icon name="arrowRight" size={18} className="text-deep-800 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </li>
  )
}

export function Collections() {
  return (
    <section id="bo-suu-tap" aria-labelledby="collections-title" className="py-14 sm:py-24">
      <Container>
        <SectionHeading id="collections-title" title={COLLECTION_SHOWCASE_TEXT.title} lead={COLLECTION_SHOWCASE_TEXT.lead} />

        <ul className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {CORE_COLLECTIONS.map((item, i) => (
            <CoreTile key={item.collection.id} item={item} index={i} />
          ))}
        </ul>

        <h3 className="eyebrow mt-9 sm:mt-12">{COLLECTION_SHOWCASE_TEXT.moreTitle}</h3>
        <ul className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-3 sm:gap-5">
          {MORE_COLLECTIONS.map((item) => (
            <MoreRow key={item.collection.id} item={item} />
          ))}
        </ul>

        <div className="mt-8 flex justify-center sm:mt-12">
          <Link to={PATHS.products} className={buttonClass('secondary', 'lg')}>
            {COLLECTION_SHOWCASE_TEXT.seeAll}
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
