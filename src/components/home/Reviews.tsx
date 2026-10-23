import { REVIEW_SAMPLE_NOTE, REVIEWS } from '../../data/content'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Container, FillIn, SectionHeading } from '../ui/primitives'

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

export function Reviews() {
  return (
    <section id="danh-gia" aria-labelledby="reviews-title" className="py-14 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="reviews-title"
            eyebrow="Khách hàng nói gì"
            title={
              <>
                Những giấc ngủ <span className="text-mist-600 italic">được nâng niu</span>
              </>
            }
          />
          {/* Nhận xét đang là nội dung mẫu (src/data/content.ts), ghi rõ như trang sản phẩm */}
          <FillIn>{REVIEW_SAMPLE_NOTE}</FillIn>
        </div>
      </Container>

      {/* Điện thoại: vuốt ngang · Máy tính: lưới 4 cột */}
      <div tabIndex={0} aria-label="Nhận xét của khách hàng, cuộn ngang" className="mt-8 overflow-x-auto sm:mt-12 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-deep-700 lg:overflow-visible">
        <Container>
          <ul className="flex snap-x snap-mandatory gap-4 pb-2 lg:grid lg:grid-cols-4 lg:gap-5">
            {REVIEWS.map((r, i) => (
              <li
                key={r.name}
                data-reveal
                style={revealDelay(i)}
                className={`flex w-[84%] shrink-0 snap-start flex-col rounded-[1.75rem] p-7 sm:w-[46%] lg:w-auto ${
                  i % 2 === 0 ? 'bg-mist-50 shadow-[var(--shadow-soft)]' : 'bg-cream-50 shadow-[var(--shadow-soft)]'
                } ${i % 2 === 1 ? 'lg:translate-y-8' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <Stars />
                  <Icon name="quote" size={26} className="text-mist-300" />
                </div>
                <blockquote className="mt-5 flex-1 text-body-sm leading-relaxed text-deep-900">
                  “{r.quote}”
                </blockquote>
                <footer className="mt-7 flex items-start gap-3 border-t border-deep-900/10 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-mist-100 font-display text-lg text-deep-800"
                  >
                    {r.name.split(' ').at(-1)?.[0]}
                  </span>
                  <span className="text-sm leading-tight">
                    <span className="block font-medium text-deep-900">{r.name}</span>
                    <span className="block text-ink-soft">{r.place}</span>
                    <span className="mt-1.5 inline-block rounded-full bg-mist-100 px-2.5 py-0.5 text-label text-deep-800">
                      {r.product}
                    </span>
                  </span>
                </footer>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  )
}
