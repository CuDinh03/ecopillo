import { imageOfPattern, type Collection } from '../../data/catalog'
import { COLLECTION_STORIES, STORIES_APPROVED } from '../../data/stories'
import { FillIn } from '../ui/primitives'

const SLICE_COUNT = 5

/** Chọn đều các phối màu trong bộ để dải ảnh bìa có đủ sắc độ */
const pickSlices = (collection: Collection) => {
  const withImage = collection.patterns.filter((p) => p.hasImage)
  if (withImage.length <= SLICE_COUNT) return withImage
  const step = withImage.length / SLICE_COUNT
  return Array.from({ length: SLICE_COUNT }, (_, i) => withImage[Math.floor(i * step)])
}

/**
 * Bìa bộ sưu tập (phần lấy từ hướng B): tên bộ, câu chuyện chung và một dải cắt lát các phối màu.
 * Dải ảnh dùng bản ảnh nhỏ, cũng là ảnh của hàng chương bên dưới, nên không tải thêm gì đáng kể.
 */
export function CollectionCover({ collection }: { collection: Collection }) {
  const story = COLLECTION_STORIES[collection.id]
  const slices = pickSlices(collection)
  return (
    <header className="mt-5 flex flex-col overflow-hidden rounded-[1.75rem] bg-deep-900 text-ivory sm:rounded-[2.25rem] lg:grid lg:grid-cols-[1fr_1.15fr]">
      <div className="p-5 pt-4 sm:p-10 lg:py-12 lg:pl-12">
        <p className="eyebrow !text-ivory/75">
          {collection.kindLabel} · {collection.patterns.length} chương màu
        </p>
        <h1 className="font-display mt-2 text-[2.4rem] leading-none sm:mt-3 sm:text-[4.2rem]">{collection.name}</h1>
        <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-ivory/85 sm:mt-4 sm:text-[1.02rem]">{story ?? collection.description}</p>
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
  )
}
