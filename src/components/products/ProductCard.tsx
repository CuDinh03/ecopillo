import { Link } from 'react-router-dom'
import { GIFTS, imageOfPattern, type Collection, type ImageSource } from '../../data/catalog'
import { categoryLabel, priceLabel, productPath, type Product } from '../../data/products'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'

/** Ảnh mẫu khác trong cùng bộ sưu tập, dùng khi chưa có ảnh thư viện */
function otherPatternImage(collection: Collection, currentSrc?: string): ImageSource | undefined {
  for (const pattern of collection.patterns) {
    const image = imageOfPattern(collection, pattern)
    if (image && image.src !== currentSrc) return image
  }
  return undefined
}

export function ProductCard({ product }: { product: Product }) {
  const gift = product.collection ? GIFTS[product.collection.gift] : undefined
  // Rê chuột mờ dần sang ảnh thứ hai (hieu-ung, câu 4A): ảnh thư viện đầu tiên, chưa có thì lấy mẫu khác
  const altImage =
    product.gallery?.[0] ?? (product.collection ? otherPatternImage(product.collection, product.image?.src) : undefined)

  return (
    <article className="ecm-card group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-[1.5rem] bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] has-[:focus-visible]:-translate-y-1 has-[:focus-visible]:shadow-[var(--shadow-lift)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-mist-600">
      <div className="ecm-swap relative aspect-[4/3] overflow-hidden">
        <Placeholder
          className="absolute inset-0 h-full w-full !rounded-none border-0"
          tone="mist"
          note={product.imageNote}
          image={product.image}
          sizes="(min-width: 1280px) 380px, 50vw"
        />
        {product.image && altImage && (
          <img
            className="ecm-swap__alt"
            src={altImage.src}
            srcSet={altImage.srcSet || undefined}
            sizes={altImage.srcSet ? "(min-width: 1280px) 380px, 50vw" : undefined}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        )}
        {product.collection?.badge && (
          <span className="absolute top-2 left-2 rounded-full bg-ivory/95 px-2.5 py-1 text-label sm:top-3 sm:left-3 sm:px-3 sm:text-label font-medium tracking-wide text-deep-800 uppercase">
            {product.collection.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-6">
        <p className="text-label font-medium tracking-[0.12em] text-mist-600 uppercase sm:text-label sm:tracking-[0.14em]">
          {categoryLabel(product.category)}
        </p>
        {/* Tên dài (khi lấy từ WordPress) cắt còn 2 dòng để thẻ cùng hàng cao bằng nhau (B8, owner duyệt 24/10/2026) */}
        <h3 title={product.name} className="font-display mt-1.5 line-clamp-3 text-body leading-snug text-deep-900 sm:mt-2 sm:line-clamp-2 sm:text-[1.35rem]">
          {/* Liên kết phủ cả thẻ */}
          <Link to={productPath(product)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 hidden text-small leading-relaxed text-ink-soft sm:line-clamp-2">{product.summary}</p>

        <div className="mt-auto pt-3 sm:pt-5">
          <p className="tabular text-meta font-medium text-deep-900 sm:text-base">{priceLabel(product)}</p>
          <div className="mt-2 flex items-center justify-between gap-3 text-label sm:text-meta">
            {gift && gift.perSet > 0 ? (
              <span className="flex items-center gap-1.5 text-brass-600">
                <Icon name="gift" size={14} /> {gift.label}
              </span>
            ) : (
              <span className="text-ink-faint">Đặt online, thanh toán khi nhận</span>
            )}
            <span className="hidden items-center gap-1 font-medium text-deep-800 transition-transform group-hover:translate-x-0.5 sm:flex">
              Xem <Icon name="arrowRight" size={14} />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
