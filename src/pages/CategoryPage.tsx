import { Link, useLocation } from 'react-router-dom'
import { ColorwayCard } from '../components/products/ColorwayCard'
import { ProductCard } from '../components/products/ProductCard'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { buttonClass, Container } from '../components/ui/primitives'
import { LISTINGS, PATHS, productsUrl, withSlash } from '../data/links'
import { PRODUCTS } from '../data/products'
import { LISTING_GUIDES } from '../data/listingGuides'
import { relatedForListing } from '../data/related'
import { COLORWAYS } from '../data/stories'
import { ExploreMore } from '../components/ui/ExploreMore'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'
import { NotFoundPage } from './NotFoundPage'

/** Số phối màu hiện trên trang danh mục bộ chăn ga; xem hết ở trang Sản phẩm */
const COLORWAY_PREVIEW = 8

/**
 * Trang danh mục nhỏ của web cũ (đệm lò xo, đệm cao su, ruột chăn gối, bộ ga phủ…), giữ đúng đường link cũ.
 * Mỗi trang là danh sách sản phẩm đã lọc sẵn, tên và mô tả theo danh mục trên web cũ (src/data/links.ts, LISTINGS).
 */
export function CategoryPage() {
  const { pathname } = useLocation()
  const listing = LISTINGS[withSlash(pathname)]
  usePageMeta(listing?.title ?? null, listing?.description)
  if (!listing) return <NotFoundPage />

  const products = PRODUCTS.filter(
    (p) =>
      (!listing.category || p.category === listing.category) &&
      (!listing.products || listing.products.includes(p.slug)) &&
      (!listing.collections || (p.collection && listing.collections.includes(p.collection.id))),
  )
  const colorways = listing.collections ? COLORWAYS.filter((c) => listing.collections?.includes(c.collection.id)) : []
  const moreUrl = productsUrl(listing.category ? { 'danh-muc': listing.category } : {})
  const guide = LISTING_GUIDES[withSlash(pathname)]

  return (
    <div className="pb-24">
      <PageHero
        crumbs={[{ label: 'Sản phẩm', to: PATHS.products }, { label: listing.title }]}
        eyebrow="Sản phẩm Ecopillo"
        title={listing.title}
        lead={listing.description}
      />

      <Container className="mt-10 sm:mt-14">
        <p className="text-sm text-ink-soft">{products.length} sản phẩm</p>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.slug} data-reveal style={revealDelay(i, 70)} className="flex">
              <div className="flex w-full flex-col [&>article]:flex-1">
                <ProductCard product={p} />
              </div>
            </li>
          ))}
        </ul>

        {colorways.length > 0 && (
          <section aria-labelledby="colorways-title" className="mt-16 sm:mt-20">
            <h2 id="colorways-title" className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[2.2rem]">
              Một vài <span className="text-mist-600 italic">phối màu</span>
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {colorways.slice(0, COLORWAY_PREVIEW).map((colorway) => (
                <li key={`${colorway.collection.id}/${colorway.pattern.code}`}>
                  <ColorwayCard colorway={colorway} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {guide && (
          <section aria-labelledby="guide-title" className="mt-16 rounded-[2rem] bg-cream-50 p-6 shadow-[var(--shadow-soft)] sm:mt-20 sm:p-10">
            <h2 id="guide-title" className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[2rem]">
              {guide.title}
            </h2>
            <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {guide.points.map((point) => (
                <div key={point.title} className="border-t border-line pt-4">
                  <dt className="font-medium text-deep-900">{point.title}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{point.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-12 flex justify-center">
          <Link to={moreUrl} className={buttonClass('secondary', 'lg')}>
            Xem tất cả sản phẩm <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <ExploreMore groups={relatedForListing(withSlash(pathname), listing.category)} />
      </Container>
    </div>
  )
}
