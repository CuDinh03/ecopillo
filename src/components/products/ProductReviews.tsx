import { REVIEW_CRITERIA, REVIEW_SAMPLE_NOTE, reviewsForCategory } from '../../data/content'
import type { Product } from '../../data/products'
import { Icon } from '../ui/Icon'
import { FillIn } from '../ui/primitives'

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span role="img" className="flex gap-0.5 text-brass-500" aria-label={`${value} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          style={{ width: size, height: size }}
          className={i < Math.round(value) ? 'fill-current' : 'fill-cream-200'}
          aria-hidden="true"
        >
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8L10 1.8Z" />
        </svg>
      ))}
    </span>
  )
}

const average = (values: readonly number[]) => values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1)
const oneDecimal = (n: number) => n.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Biên bản mục 42: nhận xét và chấm điểm chi tiết theo từng sản phẩm */
export function ProductReviews({ product }: { product: Product }) {
  const reviews = reviewsForCategory(product.category)
  if (reviews.length === 0) return null
  const overall = average(reviews.map((r) => r.stars))
  const criteria = REVIEW_CRITERIA.map((label, i) => ({ label, score: average(reviews.map((r) => r.scores[i])) }))

  return (
    <section aria-labelledby="product-reviews-title" className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="product-reviews-title" className="font-display text-[1.8rem] text-deep-900 sm:text-[2.2rem]">
          Nhận xét của khách
        </h2>
        <FillIn>{REVIEW_SAMPLE_NOTE}</FillIn>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[1.5rem] bg-cream-50 p-6 shadow-[var(--shadow-soft)] sm:p-7">
          <p className="flex items-baseline gap-2">
            <span className="tabular font-display text-5xl leading-none text-deep-900">{oneDecimal(overall)}</span>
            <span className="text-sm text-ink-soft">/ 5 · {reviews.length} nhận xét</span>
          </p>
          <div className="mt-3">
            <Stars value={overall} size={18} />
          </div>
          <dl className="mt-6 space-y-3.5">
            {criteria.map((c) => (
              <div key={c.label} className="grid grid-cols-[1fr_auto] items-baseline text-sm">
                <dt className="text-ink-soft">{c.label}</dt>
                <dd className="tabular font-medium text-deep-900">{oneDecimal(c.score)}</dd>
                <dd className="col-span-2 mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-200" aria-hidden="true">
                  <div className="h-full rounded-full bg-deep-800" style={{ width: `${(c.score / 5) * 100}%` }} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.name} className="flex flex-col rounded-[1.5rem] bg-ivory p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <Stars value={r.stars} />
                <Icon name="quote" size={22} className="text-mist-300" />
              </div>
              <blockquote className="mt-4 flex-1 text-body-sm leading-relaxed text-deep-900">“{r.quote}”</blockquote>
              <footer className="mt-5 border-t border-deep-900/10 pt-4 text-sm leading-tight">
                <span className="block font-medium text-deep-900">{r.name}</span>
                <span className="mt-0.5 block text-ink-soft">
                  {r.place} · Đã mua cỡ {r.bought}
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
