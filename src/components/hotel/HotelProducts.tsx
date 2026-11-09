import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { ImageSource } from '../../data/catalog'
import { HOTEL_PRODUCTS, type HotelProductEntry } from '../../data/hotel'
import { productBySlug, productPath, shortPriceLabel } from '../../data/products'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { Container } from '../ui/primitives'

/** Lớp chung của thẻ: khối trắng nổi trên nền xanh, nhấc nhẹ khi rê chuột, viền nét khi đi bằng phím Tab */
const CARD_CLASS =
  'group relative flex w-full flex-col overflow-hidden rounded-2xl bg-ivory text-left shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-mist-600 sm:rounded-[1.25rem]'

const IMAGE_SIZES = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 260px'

/**
 * "Sản phẩm cho khách sạn" (khách yêu cầu qua Zalo 09/11/2026): chín sản phẩm của danh mục khách sạn web cũ.
 * Món có trang riêng: thẻ mở trang sản phẩm (giá, đặt online). Món "Giá liên hệ": bấm thẻ điền sẵn form báo giá cuối trang.
 * Máy tính 3 thẻ một hàng (đủ 3 hàng); điện thoại một hàng lướt ngang như kệ trang Sản phẩm.
 */
export function HotelProducts({ onQuote }: { onQuote: (name: string) => void }) {
  return (
    <section aria-labelledby="hotel-products-title" className="border-t border-line py-14 sm:py-20">
      <Container>
        <header data-reveal="left" className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <p className="eyebrow">Sản phẩm cho khách sạn</p>
            <h2 id="hotel-products-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.9rem]">
              Đệm, ruột, đồ vải cho phòng lưu trú
            </h2>
          </div>
          <p className="max-w-sm text-body-sm leading-relaxed text-ink-soft">
            Giá lẻ để Quý khách tham khảo. Đặt số lượng cho khách sạn, dự án: Ecopillo báo giá riêng theo số phòng.
          </p>
        </header>
        <ul className="mt-8 grid gap-4 max-sm:-mx-5 max-sm:flex max-sm:scroll-px-5 max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:overscroll-x-contain max-sm:px-5 max-sm:pb-3 max-sm:[scrollbar-width:none] sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {HOTEL_PRODUCTS.map((entry, i) => (
            <li
              key={entry.kind === 'product' ? entry.slug : entry.name}
              data-reveal
              style={revealDelay(i % 3, 70)}
              className="flex max-sm:w-[78%] max-sm:shrink-0 max-sm:snap-start"
            >
              <EntryCard entry={entry} onQuote={onQuote} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function EntryCard({ entry, onQuote }: { entry: HotelProductEntry; onQuote: (name: string) => void }) {
  if (entry.kind === 'quote') {
    return (
      <article className={CARD_CLASS}>
        <CardImage image={entry.image} note={entry.name} />
        <CardBody
          title={
            <button type="button" onClick={() => onQuote(entry.name)} className="text-left after:absolute after:inset-0 focus-visible:outline-none">
              {entry.name}
            </button>
          }
          note={entry.note}
          price="Giá liên hệ"
          action="Nhận báo giá"
        />
      </article>
    )
  }
  const product = productBySlug(entry.slug)
  // Mã sai thì bỏ thẻ; lúc build listPrerenderPaths (entry-server.tsx) báo lỗi nếu mã không khớp products.ts
  if (!product) return null
  return (
    <article className={CARD_CLASS}>
      <CardImage image={product.image} note={product.imageNote} />
      <CardBody
        title={
          <Link to={productPath(product)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        }
        note={product.summary}
        price={shortPriceLabel(product)}
        action="Xem sản phẩm"
      />
    </article>
  )
}

function CardImage({ image, note }: { image?: ImageSource; note: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <Placeholder
        className="absolute inset-0 h-full w-full !rounded-none border-0 transition duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
        tone="mist"
        note={note}
        image={image}
        sizes={IMAGE_SIZES}
      />
    </div>
  )
}

interface CardBodyProps {
  title: ReactNode
  note: string
  price: string
  action: string
}

function CardBody({ title, note, price, action }: CardBodyProps) {
  return (
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <h3 className="font-display text-[1.15rem] leading-snug text-deep-900 sm:text-[1.3rem]">{title}</h3>
      <p className="mt-1.5 line-clamp-2 text-meta leading-relaxed text-ink-soft sm:text-small">{note}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="tabular text-small font-semibold text-deep-900">{price}</span>
        <span className="inline-flex items-center gap-1 text-meta font-medium text-mist-600 transition-transform group-hover:translate-x-0.5">
          {action}
          <Icon name="arrowRight" size={14} />
        </span>
      </div>
    </div>
  )
}
