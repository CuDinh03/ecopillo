import { Link } from 'react-router-dom'
import { collectionRange, coverOf } from '../../data/catalog'
import { COLLECTION_SHOWCASE_TEXT, CORE_COLLECTIONS, MORE_COLLECTIONS, type ShowcaseItem } from '../../data/collectionGroups'
import { collectionPath, PATHS } from '../../data/links'
import { formatVND } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { Container, SectionHeading } from '../ui/primitives'

export const orderLink = (collectionId: string) => `${PATHS.order}?bo-suu-tap=${collectionId}`

/**
 * Trang chủ, bộ sưu tập chăn ga (C4, phương án 1, owner chốt 09/11/2026; dữ liệu ở src/data/collectionGroups.ts).
 * Bốn bộ lõi (bán chạy nhất) rồi "Thêm lựa chọn" ba bộ, cùng một kiểu ô to (khách 09/11/2026 bỏ dòng gọn).
 * Điện thoại 2×2 mỗi phần; máy tính 4 ô một hàng. Ô thứ tư của "Thêm lựa chọn" là ô Xem tất cả sản phẩm.
 * Bấm ô sang trang bộ sưu tập (chọn mẫu, kích thước, đặt mua ở đó).
 */

/** Ô bộ sưu tập: ảnh vuông, tên, loại vải, "từ" giá thấp nhất (dùng cho cả bộ lõi và Thêm lựa chọn) */
function CollectionTile({ item, index }: { item: ShowcaseItem; index: number }) {
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

/**
 * Ô cuối hàng "Thêm lựa chọn": nền chàm, sang trang Sản phẩm.
 * Ba bộ + ô này đủ một hàng 4 (máy tính) và 2×2 (điện thoại), không bị trống chỗ.
 */
function SeeAllTile({ index }: { index: number }) {
  return (
    <li data-reveal style={revealDelay(index)} className="min-w-0">
      <Link
        to={PATHS.products}
        className="group flex h-full min-h-40 flex-col justify-between rounded-[1.25rem] bg-deep-900 p-4 text-white shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:rounded-[1.75rem] sm:p-6"
      >
        <span className="font-display text-[1.25rem] leading-tight sm:text-[1.75rem]">{COLLECTION_SHOWCASE_TEXT.seeAll}</span>
        <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-deep-900 transition-transform duration-300 group-hover:translate-x-1 sm:h-12 sm:w-12">
          <Icon name="arrowRight" size={20} />
        </span>
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
            <CollectionTile key={item.collection.id} item={item} index={i} />
          ))}
        </ul>

        <h3 className="eyebrow mt-9 sm:mt-12">{COLLECTION_SHOWCASE_TEXT.moreTitle}</h3>
        {/* Chị Phương 09/11/2026: "3 dòng dưới e cũng cho to như những dòng trên", "trên to dưới nhỏ buồn cười" */}
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-5 lg:grid-cols-4">
          {MORE_COLLECTIONS.map((item, i) => (
            <CollectionTile key={item.collection.id} item={item} index={i} />
          ))}
          <SeeAllTile index={MORE_COLLECTIONS.length} />
        </ul>
      </Container>
    </section>
  )
}
