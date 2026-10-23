import { Link } from 'react-router-dom'
import type { Collection } from '../../data/catalog'
import { productsUrl } from '../../data/links'
import { sameToneElsewhere, type Tone } from '../../data/stories'
import { ColorwayCard } from '../products/ColorwayCard'
import { Icon } from '../ui/Icon'

export const SAME_TONE_LIMIT = 4

/** Cuối mỗi chương (phần lấy từ hướng C): phối màu cùng gam ở các bộ khác, nhiều mức giá */
export function SameTone({ collection, tone }: { collection: Collection; tone: Tone }) {
  const colorways = sameToneElsewhere(collection, tone.id, SAME_TONE_LIMIT)
  if (colorways.length === 0) return null
  return (
    <section aria-labelledby="same-tone-title" className="mt-16 sm:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h2 id="same-tone-title" className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[2.2rem]">
          Thêm <span className="text-mist-600 italic">{tone.phrase}</span> ở bộ khác
        </h2>
        <Link
          to={productsUrl({ gam: tone.id })}
          className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm font-medium text-deep-800 underline-offset-4 hover:underline"
        >
          Xem cả {tone.phrase} <Icon name="arrowRight" size={15} />
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {colorways.map((colorway) => (
          <li key={`${colorway.collection.id}/${colorway.pattern.code}`}>
            <ColorwayCard colorway={colorway} />
          </li>
        ))}
      </ul>
    </section>
  )
}
