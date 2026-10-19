import { Link } from 'react-router-dom'
import { FEATURED_EVENT, OTHER_EVENTS, type BrandEvent } from '../../data/events'
import { postBySlug, postPath } from '../../data/posts'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'

/**
 * Sự kiện Ecopillo đồng hành, cuối phần "Về chúng tôi" (mục 35, owner chọn mẫu B 20/10/2026: docs/de-xuat-su-kien-dong-hanh.html).
 * Máy tính: thẻ lớn sự kiện nổi bật bên trái, lưới nhỏ bên phải (ô cuối rộng hai cột, dùng ảnh ngang).
 * Điện thoại: thẻ lớn ở trên, thẻ nhỏ thành một hàng vuốt ngang. Hiện ngay, không giấu sau nút như bốn thẻ phía trên.
 * Dữ liệu: src/data/events.ts.
 */
export function EventsStrip() {
  return (
    <section aria-labelledby="events-title" className="mt-14 sm:mt-24">
      <header data-reveal="left" className="max-w-2xl">
        <p className="eyebrow">Hoạt động</p>
        <h3 id="events-title" className="font-display mt-3 text-[1.75rem] text-deep-900 sm:text-[2.2rem]">
          Ecopillo <span className="text-mist-600 italic">đồng hành</span>
        </h3>
        <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-ink-soft">
          Những chương trình, sự kiện Ecopillo góp mặt cùng cộng đồng và các đơn vị bạn.
        </p>
      </header>

      <div className="mt-7 grid gap-4 sm:mt-9 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
        <FeaturedCard event={FEATURED_EVENT} />
        {/* Điện thoại: hàng vuốt ngang tràn mép (như .m-rail); từ 640px: lưới */}
        <ul
          tabIndex={0}
          aria-label="Các sự kiện khác"
          className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-deep-700 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-2 lg:grid-rows-2 lg:gap-5"
        >
          {OTHER_EVENTS.map((event, i) => (
            <SmallCard key={event.id} event={event} index={i} isWide={i === OTHER_EVENTS.length - 1} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function FeaturedCard({ event }: { event: BrandEvent }) {
  // Bài viết nằm trên WordPress (giữ link web cũ): chỉ hiện lối đọc khi bài đã có trên giao diện mới
  const post = event.postSlug ? postBySlug(event.postSlug) : undefined
  return (
    <article data-reveal className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-ivory shadow-[var(--shadow-soft)]">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={event.image.src}
          srcSet={event.image.srcSet}
          sizes="(min-width: 1024px) 620px, 100vw"
          alt={event.image.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full bg-mist-100 object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex-1 p-6 sm:p-8">
        <p className="eyebrow">
          {event.kind}
          {event.when && ` · ${event.when}`}
        </p>
        <h4 className="font-display mt-3 text-[1.45rem] leading-snug text-deep-900 sm:text-[1.75rem]">{event.title}</h4>
        {event.summary && <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">{event.summary}</p>}
        {post && (
          <Link
            to={postPath(post)}
            className="mt-4 -mb-2 inline-flex items-center gap-1.5 py-2 text-[0.95rem] font-medium text-deep-800 underline-offset-4 hover:underline"
          >
            Đọc bài viết <Icon name="arrowRight" size={16} />
          </Link>
        )}
      </div>
    </article>
  )
}

interface SmallCardProps {
  event: BrandEvent
  index: number
  /** Máy tính: ô rộng hai cột, đổi sang ảnh ngang */
  isWide: boolean
}

function SmallCard({ event, index, isWide }: SmallCardProps) {
  const wideImage = isWide ? event.wideImage : undefined
  return (
    <li
      data-reveal
      style={revealDelay(index + 1)}
      className={`group relative aspect-[4/5] shrink-0 basis-[62%] snap-start overflow-hidden rounded-[1.25rem] bg-deep-900 text-ivory sm:basis-auto sm:rounded-[1.5rem] lg:aspect-auto ${
        isWide ? 'lg:col-span-2' : ''
      }`}
    >
      <picture>
        {wideImage && <source media="(min-width: 1024px)" srcSet={wideImage.srcSet} sizes="540px" />}
        <img
          src={event.image.src}
          srcSet={event.image.srcSet}
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 62vw"
          alt={event.image.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
        />
      </picture>
      {/* Lớp chàm dưới chân ảnh để chữ trắng đọc được trên mọi ảnh */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-900/95 from-35% to-deep-900/0 px-4 pt-14 pb-4 sm:px-5 sm:pb-5">
        <p className="text-[0.62rem] font-medium tracking-[0.14em] text-mist-300 uppercase">{event.kind}</p>
        <h4 className="font-display mt-1.5 text-[1.05rem] leading-snug sm:text-[1.12rem]">{event.title}</h4>
        {event.when && <p className="mt-1.5 text-[0.78rem] text-ivory/80">{event.when}</p>}
      </div>
    </li>
  )
}
