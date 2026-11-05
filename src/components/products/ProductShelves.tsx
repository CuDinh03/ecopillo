import { Link } from 'react-router-dom'
import { COLORWAY_HINT, colorwayCount, SHELVES, type Shelf } from '../../data/productShelves'
import { productPath, type CategoryId, type Product } from '../../data/products'
import { formatVND } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'

interface ProductShelvesProps {
  /** Bấm "Chỉ xem …" hoặc "Xem theo phối màu": mở lưới của nhóm đó (?danh-muc=…) */
  onPick: (category: CategoryId) => void
  /** Hiện dần chỉ lần đầu vào trang */
  reveal: boolean
}

/**
 * Bốn kệ theo nhóm ở mục "Tất cả" (phương án 1 + 2, owner chốt 02/11/2026): mỗi bộ, mỗi sản phẩm một thẻ, một trang.
 * Không ghi số mẫu, số phối màu (khách 05/11/2026: "đừng cho số lượng vào", web chưa có đủ mẫu đang bán).
 * Máy tính 4 thẻ một hàng (640–1023px: 3), kệ bộ chăn ga thêm thẻ "Xem theo phối màu" lấp ô cuối.
 * Điện thoại: mỗi kệ một hàng thẻ nhỏ lướt ngang; thẻ "Xem theo phối màu" ẩn vì trùng nút ở đầu kệ.
 */
export function ProductShelves({ onPick, reveal }: ProductShelvesProps) {
  return (
    <div className="mt-2 sm:mt-4">
      {/* scroll-mt: điện thoại chừa thanh đầu trang 4.5rem + thanh lọc dính ~3.5rem; máy tính chỉ thanh đầu trang */}
      {SHELVES.map((shelf) => (
        <section key={shelf.category} id={shelf.id} aria-labelledby={`${shelf.id}-ten`} className="mt-9 scroll-mt-[9rem] sm:mt-12 sm:scroll-mt-[5.5rem]">
          <ShelfHeader shelf={shelf} onPick={onPick} />
          <ul className="mt-3.5 grid gap-3 max-sm:-mx-5 max-sm:flex max-sm:scroll-px-5 max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:overscroll-x-contain max-sm:px-5 max-sm:pb-2 max-sm:[scrollbar-width:none] sm:mt-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {shelf.products.map((product, i) => (
              <li
                key={product.slug}
                data-reveal={reveal ? '' : undefined}
                style={reveal ? revealDelay(i, 60) : undefined}
                className="flex max-sm:w-[calc(100%-2.5rem)] max-sm:shrink-0 max-sm:snap-start"
              >
                <ShelfCard product={product} />
              </li>
            ))}
            {shelf.category === 'bo-chan-ga' && (
              <li className="hidden sm:flex">
                <button
                  type="button"
                  onClick={() => onPick('bo-chan-ga')}
                  className="group flex w-full flex-col justify-center gap-2 rounded-[1.25rem] bg-ivory p-5 text-left shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist-600"
                >
                  <span className="font-display text-[1.3rem] leading-tight text-deep-900">Xem theo phối màu</span>
                  <span className="text-meta leading-relaxed text-ink-soft">{COLORWAY_HINT}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-small font-medium text-mist-600">
                    Xem tất cả phối màu
                    <Icon name="arrowRight" size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </li>
            )}
          </ul>
        </section>
      ))}
    </div>
  )
}

function ShelfHeader({ shelf, onPick }: { shelf: Shelf; onPick: (category: CategoryId) => void }) {
  const action = shelf.category === 'bo-chan-ga' ? 'Xem theo phối màu' : `Chỉ xem ${shelf.shortLabel}`
  return (
    <div className="flex items-baseline justify-between gap-3 sm:gap-4">
      {/* Tên kệ không bẻ giữa chữ ("Bộ chăn / ga" ở 320px) */}
      <h2 id={`${shelf.id}-ten`} className="font-display min-w-0 text-[1.35rem] leading-tight text-wrap text-deep-900 min-[360px]:text-[1.45rem] sm:text-[1.8rem]">
        <span className="whitespace-nowrap">{shelf.label}</span>
      </h2>
      <button
        type="button"
        onClick={() => onPick(shelf.category)}
        className="-my-2 inline-flex shrink-0 items-center gap-1 py-2 text-small font-medium whitespace-nowrap text-mist-600 hover:text-deep-900"
      >
        {action}
        <Icon name="arrowRight" size={14} />
      </button>
    </div>
  )
}

/** Giá trên thẻ kệ: chỉ giá thấp nhất cho gọn, giá đủ khoảng ở trang sản phẩm */
const shelfPrice = (p: Product): string => (p.min === p.max ? formatVND(p.min) : `từ ${formatVND(p.min)}`)

/** Thẻ gọn trên kệ: bộ ghi nhãn "Nhiều phối màu" (không ghi số), sản phẩm lẻ ghi một dòng giới thiệu. Liên kết phủ cả thẻ */
function ShelfCard({ product }: { product: Product }) {
  const colorways = colorwayCount(product)
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-mist-600 sm:rounded-[1.25rem]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Placeholder
          className="absolute inset-0 h-full w-full !rounded-none border-0"
          tone="mist"
          note={product.imageNote}
          image={product.image}
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 148px"
        />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-display text-[0.95rem] leading-snug text-deep-900 sm:text-[1.08rem]">
          <Link to={productPath(product)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        {colorways > 1 ? (
          <span className="mt-1.5 self-start rounded-full bg-mist-100 px-2 py-0.5 text-label font-medium text-deep-900">
            Nhiều phối màu
          </span>
        ) : (
          <p className="mt-1 line-clamp-1 text-label text-ink-faint sm:line-clamp-2 sm:text-meta">{product.summary}</p>
        )}
        <p className="tabular mt-auto pt-2.5 text-meta font-semibold text-deep-900 sm:pt-3.5 sm:text-small">{shelfPrice(product)}</p>
      </div>
    </article>
  )
}
