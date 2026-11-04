import { CORPORATE_GIFTS, GIFT_MORE_IMAGES, GIFT_POSTER, GIFT_SIDE_IMAGES, type CorporateGiftImage } from '../../data/corporateGifts'
import { revealDelay } from '../../lib/reveal'
import { ContactButtons, Container } from '../ui/primitives'

/**
 * Quà tặng doanh nghiệp, sự kiện ở trang Quà tặng và sự kiện, đặt trên khối tri ân (owner chọn mẫu A 27/10/2026:
 * docs/de-xuat-phan-qua-tang.html). Máy tính: khối trắng, chữ bên trái, bên phải ảnh quảng cáo vuông + hai ảnh nhỏ xếp dọc.
 * Ảnh quảng cáo có chữ nên giữ khung vuông như ảnh gốc, không chú thích đè; hai ảnh nhỏ cũng vuông để cột ảnh không bị kéo cao (owner dặn "nhìn được hết các nội dung của ảnh").
 * Điện thoại: ảnh lên trước, chữ sau. Dưới khối là hàng 4 ảnh. Dữ liệu: src/data/corporateGifts.ts.
 */
export function CorporateGifts() {
  const g = CORPORATE_GIFTS
  return (
    <section id="qua-tang-doanh-nghiep" aria-labelledby="corporate-gifts-title" className="scroll-mt-24 pt-4 pb-14 sm:pb-24">
      <Container>
        <div className="grid gap-5 rounded-[2.25rem] bg-ivory p-3 shadow-[var(--shadow-soft)] sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-8">
          <div className="grid grid-cols-2 gap-3 self-center sm:grid-cols-[2fr_1fr] lg:order-2">
            <GiftPhoto item={GIFT_POSTER} className="col-span-2 aspect-square sm:col-span-1" sizes="(min-width: 1024px) 440px, (min-width: 640px) 64vw, 100vw" eager />
            <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-1 sm:grid-cols-1">
              {GIFT_SIDE_IMAGES.map((item) => (
                <GiftPhoto key={item.image.src} item={item} className="aspect-square" sizes="(min-width: 1024px) 220px, (min-width: 640px) 32vw, 50vw" />
              ))}
            </div>
          </div>

          <div data-reveal="left" className="flex flex-col px-3 pt-2 pb-4 sm:px-6 sm:pt-6 lg:order-1 lg:py-6 lg:pl-8">
            <p className="eyebrow">{g.eyebrow}</p>
            <h2 id="corporate-gifts-title" className="font-display mt-4 text-[2rem] leading-[1.1] text-deep-900 sm:text-[2.9rem]">
              {g.title} {g.titleAccent}
            </h2>
            <p className="mt-4 text-body-sm leading-relaxed text-ink-soft">{g.lead}</p>

            <div className="mt-6 self-start rounded-[1.25rem] bg-brass-100 px-5 py-4 text-deep-900">
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span>
                  <span className="text-small">từ </span>
                  <span className="font-display text-[2.25rem] leading-none">{g.price}</span>
                </span>
                <span className="text-small font-medium">{g.priceLabel}</span>
              </p>
            </div>

            <ul className="mt-5 grid gap-2.5 text-body-sm text-ink-soft">
              {g.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-brand-gold ring-4 ring-brand-gold/30" />
                  {point}
                </li>
              ))}
            </ul>

            <ContactButtons size="md" stretch className="mt-7 lg:mt-auto lg:pt-8" callLabel={g.callLabel} />
          </div>
        </div>

        <ul className="m-rail mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-4 sm:gap-4">
          {GIFT_MORE_IMAGES.map((item, i) => (
            <li key={item.image.src} data-reveal style={revealDelay(i)}>
              <GiftPhoto item={item} className="aspect-square" sizes="(min-width: 1240px) 290px, (min-width: 640px) 25vw, 50vw" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

interface GiftPhotoProps {
  item: CorporateGiftImage
  className?: string
  sizes: string
  /** Ảnh quảng cáo nằm gần đầu trang: tải ngay, không đợi cuộn */
  eager?: boolean
}

function GiftPhoto({ item, className = '', sizes, eager = false }: GiftPhotoProps) {
  return (
    <figure className={`group relative overflow-hidden rounded-[1.25rem] bg-mist-100 sm:rounded-[1.5rem] ${className}`}>
      <img
        src={item.image.src}
        srcSet={item.image.srcSet}
        sizes={sizes}
        alt={item.image.alt}
        width={1000}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
      />
      {item.caption && (
        // Lớp chàm dưới chân ảnh để chữ trắng đọc được trên mọi ảnh (như thẻ sự kiện)
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-900/90 from-30% to-deep-900/0 px-4 pt-12 pb-3.5 text-small leading-snug text-ivory sm:px-5 sm:pb-4">
          {item.caption}
        </figcaption>
      )}
    </figure>
  )
}
