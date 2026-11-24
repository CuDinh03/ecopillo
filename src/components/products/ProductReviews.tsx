import { criterionScore, PRODUCT_REVIEW_TEXT, reviewsOf } from '../../data/productReviews'
import type { Product } from '../../data/products'
import { Icon } from '../ui/Icon'
import { chen } from '../../data/pageText/define'
import { PRODUCT_DETAIL_TEXT as T } from '../../data/pageText/productUi'

const average = (values: readonly number[]) => values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1)
const oneDecimal = (n: number) => n.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span role="img" className="flex gap-0.5 text-brass-500" aria-label={chen(T.soSao, { so: Number.isInteger(value) ? value : oneDecimal(value) })}>
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

/**
 * Biên bản mục 42: nhận xét và chấm điểm chi tiết theo từng sản phẩm. Nhận xét Ecopillo thêm ở Nội dung web → Sản phẩm →
 * Nhận xét từng sản phẩm (src/data/productReviews.ts); sản phẩm chưa có nhận xét nào thì không hiện khối.
 */
export function ProductReviews({ product }: { product: Product }) {
  const reviews = reviewsOf(product.slug)
  if (reviews.length === 0) return null
  const overall = average(reviews.map((r) => Number(r.sao)))
  // Tiêu chí chỉ hiện khi có ít nhất một nhận xét chấm điểm tiêu chí đó
  const criteria = PRODUCT_REVIEW_TEXT.tieuChi.slice(0, 4).flatMap((label, i) => {
    const scores = reviews.map((r) => criterionScore(r, i)).filter((s): s is number => s !== undefined)
    return scores.length ? [{ label, score: average(scores) }] : []
  })

  return (
    <section aria-labelledby="product-reviews-title" className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="product-reviews-title" className="font-display text-[1.8rem] text-deep-900 sm:text-[2.2rem]">
          {T.nhanXet}
        </h2>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="self-start rounded-[1.5rem] bg-cream-50 p-6 shadow-[var(--shadow-soft)] sm:p-7">
          <p className="flex items-baseline gap-2">
            <span className="tabular font-display text-5xl leading-none text-deep-900">{oneDecimal(overall)}</span>
            <span className="text-sm text-ink-soft">{chen(T.soNhanXet, { so: reviews.length })}</span>
          </p>
          <div className="mt-3">
            <Stars value={overall} size={18} />
          </div>
          {criteria.length > 0 && (
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
          )}
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r, i) => (
            <li key={`${r.ten}-${i}`} className="flex flex-col rounded-[1.5rem] bg-ivory p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <Stars value={Number(r.sao)} />
                <Icon name="quote" size={22} className="text-mist-300" />
              </div>
              <blockquote className="mt-4 flex-1 text-body-sm leading-relaxed text-deep-900">“{r.loi}”</blockquote>
              {r.anh && (
                <img
                  src={r.anh.src}
                  srcSet={r.anh.srcSet || undefined}
                  sizes="(min-width: 640px) 320px, 100vw"
                  alt={r.anh.alt || chen(PRODUCT_REVIEW_TEXT.anhKhach, { ten: r.ten })}
                  loading="lazy"
                  decoding="async"
                  className="mt-4 aspect-[4/3] w-full rounded-xl object-cover"
                />
              )}
              <footer className="mt-5 border-t border-deep-900/10 pt-4 text-sm leading-tight">
                <span className="block font-medium text-deep-900">{r.ten}</span>
                {(r.noiO || r.daMua || r.ngay) && (
                  <span className="mt-0.5 block text-ink-soft">
                    {[r.noiO, r.daMua ? chen(T.daMuaCo, { co: r.daMua }) : undefined, r.ngay].filter(Boolean).join(' · ')}
                  </span>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
