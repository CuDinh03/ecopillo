import { REVIEWS, REVIEWS_ARE_REAL, type Review } from '../../data/content'
import { revealDelay } from '../../lib/reveal'
import { Container, SectionHeading } from '../ui/primitives'

function Stars() {
  return (
    <span role="img" className="flex gap-0.5 text-brass-500" aria-label="5 trên 5 sao">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8L10 1.8Z" />
        </svg>
      ))}
    </span>
  )
}

/**
 * Mẫu C trang chủ (owner duyệt 23/10/2026): một câu trích lớn bên trái, ba nhận xét còn lại thành cột lời ngắn bên phải,
 * thay cho lưới bốn thẻ. Điện thoại: câu trích ở trên, ba nhận xét xếp dưới.
 * Nhận xét đang là nội dung mẫu (src/data/content.ts) nên khối ẩn cho tới khi REVIEWS_ARE_REAL = true.
 */
export function Reviews() {
  if (!REVIEWS_ARE_REAL) return null
  const [featured, ...others] = REVIEWS
  return (
    <section id="danh-gia" aria-labelledby="reviews-title" className="py-14 sm:py-24">
      <Container>
        <SectionHeading id="reviews-title" title="Nhận xét của khách" lead="Những giấc ngủ được nâng niu, kể bằng lời của chính Quý khách." />

        <div className="mt-8 grid gap-10 sm:mt-12 lg:grid-cols-12 lg:gap-16">
          <figure data-reveal className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <Stars />
            </div>
            <blockquote className="font-display mt-4 max-w-[32ch] text-[1.5rem] leading-[1.3] text-deep-900 italic sm:text-[2rem] lg:text-[2.125rem]">
              “{featured.quote}”
            </blockquote>
            <figcaption className="mt-6">
              <Reviewer review={featured} />
            </figcaption>
          </figure>

          <ul className="divide-y divide-line border-y border-line lg:col-span-5 lg:self-end">
            {others.map((r, i) => (
              <li key={r.name} data-reveal style={revealDelay(i + 1)} className="py-5">
                <blockquote className="text-body-sm leading-relaxed text-deep-900">“{r.quote}”</blockquote>
                <div className="mt-3">
                  <Reviewer review={r} compact />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

function Reviewer({ review, compact = false }: { review: Review; compact?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 leading-tight ${compact ? 'text-meta' : 'text-sm'}`}>
      <span className="font-medium text-deep-900">{review.name}</span>
      <span className="text-ink-soft">· {review.place}</span>
      <span className="rounded-full bg-ivory px-2.5 py-0.5 text-label text-deep-800 shadow-[var(--shadow-soft)]">{review.product}</span>
    </p>
  )
}
