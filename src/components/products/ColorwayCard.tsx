import { Link } from 'react-router-dom'
import { imageOfPattern, patternPrice, SIZES } from '../../data/catalog'
import { patternPath, type Colorway } from '../../data/stories'
import { formatVND } from '../../lib/format'
import { Placeholder } from '../ui/Placeholder'

/** Ô một phối màu: ảnh, tên câu chuyện, bộ sưu tập và giá từ. Dùng ở trang Sản phẩm (lọc theo gam) và cuối mỗi chương */
export function ColorwayCard({ colorway }: { colorway: Colorway }) {
  const { collection, pattern, story } = colorway
  const from = Math.min(...SIZES.map((size) => patternPrice(collection, pattern, size.id)))
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-cream-50 ring-1 ring-cream-200 transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:rounded-[1.5rem]">
      <div className="aspect-[4/3] overflow-hidden">
        <Placeholder
          className="h-full w-full !rounded-none transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.05]"
          tint={pattern.swatch}
          note={pattern.code}
          image={imageOfPattern(collection, pattern)}
          sizes="(min-width: 1024px) 300px, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <h3 className="font-display text-[1.1rem] leading-tight text-mist-600 italic sm:text-[1.35rem]">
          {/* Liên kết phủ cả ô */}
          <Link to={patternPath(collection, pattern)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {story.title}
          </Link>
        </h3>
        <p className="mt-1 text-[0.72rem] text-ink-faint sm:text-[0.78rem]">
          {collection.name} · {pattern.code}
        </p>
        <p className="tabular mt-auto pt-3 text-[0.8rem] font-medium text-deep-900 sm:text-[0.92rem]">từ {formatVND(from)}</p>
      </div>
    </article>
  )
}
