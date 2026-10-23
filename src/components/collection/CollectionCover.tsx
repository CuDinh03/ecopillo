import { Link } from 'react-router-dom'
import { imageOfPattern, type Collection } from '../../data/catalog'
import { collectionPath } from '../../data/links'
import { COLLECTION_STORIES, STORIES_APPROVED } from '../../data/stories'
import { Icon } from '../ui/Icon'
import { FillIn } from '../ui/primitives'

const SLICE_COUNT = 5

/** Chọn đều các phối màu trong bộ để dải ảnh bìa có đủ sắc độ */
const pickSlices = (collection: Collection) => {
  const withImage = collection.patterns.filter((p) => p.hasImage)
  if (withImage.length <= SLICE_COUNT) return withImage
  const step = withImage.length / SLICE_COUNT
  return Array.from({ length: SLICE_COUNT }, (_, i) => withImage[Math.floor(i * step)])
}

interface CollectionCoverProps {
  collection: Collection
  /**
   * Trang của một phối màu: trên điện thoại thu bìa thành một dòng dẫn về trang bộ, để ảnh mẫu lên màn đầu
   * (B5, owner duyệt 24/10/2026). Trang bộ sưu tập và máy tính giữ bìa đầy đủ.
   */
  isCompactOnMobile?: boolean
}

/**
 * Bìa bộ sưu tập (phần lấy từ hướng B): tên bộ, câu chuyện chung và một dải cắt lát các phối màu.
 * Dải ảnh dùng bản ảnh nhỏ, cũng là ảnh của hàng chương bên dưới, nên không tải thêm gì đáng kể.
 */
export function CollectionCover({ collection, isCompactOnMobile = false }: CollectionCoverProps) {
  const story = COLLECTION_STORIES[collection.id]
  const slices = pickSlices(collection)
  return (
    <>
    {isCompactOnMobile && (
      // Mỗi khổ chỉ hiện một h1: dòng này trên điện thoại, bìa đầy đủ từ 640px
      <h1 className="mt-5 sm:hidden">
        <Link
          to={collectionPath(collection)}
          className="flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-ivory px-4 py-3 text-body-sm text-deep-900 shadow-[var(--shadow-soft)] active:bg-mist-100"
        >
          <span>
            <span className="font-medium">Bộ {collection.name}</span>
            <span className="text-ink-soft"> · {collection.patterns.length} chương màu</span>
          </span>
          <Icon name="arrowRight" size={16} className="shrink-0 text-ink-faint" />
        </Link>
      </h1>
    )}
    <header className={`mt-5 flex-col ${isCompactOnMobile ? 'hidden sm:flex' : 'flex'} overflow-hidden rounded-[1.75rem] bg-deep-900 text-ivory sm:rounded-[2.25rem] lg:grid lg:grid-cols-[1fr_1.15fr]`}>
      <div className="p-5 pt-4 sm:p-10 lg:py-12 lg:pl-12">
        <p className="eyebrow !text-ivory/75">
          {collection.kindLabel} · {collection.patterns.length} chương màu
        </p>
        <h1 className="font-display mt-2 text-[2.4rem] leading-none sm:mt-3 sm:text-[4.2rem]">{collection.name}</h1>
        <p className="mt-3 max-w-md text-small leading-relaxed text-ivory/85 sm:mt-4 sm:text-body">{story ?? collection.description}</p>
        {story && !STORIES_APPROVED && (
          <p className="mt-3">
            <FillIn>[ECOPILLO DUYỆT CÂU CHUYỆN BỘ SƯU TẬP]</FillIn>
          </p>
        )}
      </div>
      <div aria-hidden="true" className="-mx-6 flex h-24 shrink-0 gap-1 max-lg:order-first sm:h-36 lg:-mr-10 lg:ml-0 lg:h-auto lg:min-h-[19rem]">
        {slices.map((pattern) => {
          const image = imageOfPattern(collection, pattern)
          return (
            <div key={pattern.code} className="relative flex-1 -skew-x-6 overflow-hidden" style={{ backgroundColor: pattern.swatch }}>
              {image && (
                <img
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="(min-width: 1024px) 260px, 34vw"
                  alt=""
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-[1.35] skew-x-6 object-cover"
                />
              )}
            </div>
          )
        })}
      </div>
    </header>
    </>
  )
}
