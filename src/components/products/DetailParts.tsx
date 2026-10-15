import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import type { Pattern, SizeId } from '../../data/catalog'
import { NEAR_ME_URL } from '../../data/dealers'
import { PATHS, productsUrl } from '../../data/links'
import { categoryLabel, orderUrl, priceLabel, PRODUCTS, type Product } from '../../data/products'
import { formatVND } from '../../lib/format'
import { Icon, ZaloMark } from '../ui/Icon'
import { FillIn } from '../ui/primitives'
import { ProductCard } from './ProductCard'

/* Các phần dùng chung cho trang chi tiết sản phẩm lẻ và trang bộ sưu tập (từng phối màu) */

/** Biên bản mục 38: bảo hành tuỳ sản phẩm (đệm 5–15 năm, chăn ga 90 …) — phần bị cắt trong biên bản cần xác nhận */
const WARRANTY_BY_CATEGORY: Readonly<Record<string, string>> = {
  'bo-chan-ga': '90 ngày [XÁC NHẬN ĐƠN VỊ: NGÀY]',
  chan: '90 ngày [XÁC NHẬN ĐƠN VỊ: NGÀY]',
  goi: '[ĐIỀN THỜI HẠN BẢO HÀNH GỐI]',
  dem: '5–15 năm tuỳ dòng đệm',
}

const POLICIES = [
  'Thanh toán khi nhận hàng (COD) toàn quốc, không thu phí thu hộ. Nhân viên gọi xác nhận đơn trước khi giao.',
  'Miễn phí giao toàn quốc cho đơn từ 500.000đ. Nội thành Hà Nội khoảng 1 ngày, phía Bắc 2–3 ngày, phía Nam 3–5 ngày.',
  'Kiểm hàng cùng nhân viên giao, được trải thử lên giường. Giao sai được từ chối nhận, không mất tiền.',
  'Chỉ đổi, không trả hàng hoàn tiền. Báo lỗi trong 24 giờ, gửi đổi trong 7 ngày, còn nguyên tem mác, chưa giặt.',
] as const

const TRUST_POINTS = ['Thanh toán khi nhận hàng', 'Miễn phí giao từ 500.000đ', 'Kiểm hàng, trải thử khi nhận', 'Đổi hàng trong 7 ngày'] as const

export function DetailBreadcrumb({ product }: { product: Product }) {
  return (
    <nav aria-label="Đường dẫn" className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
      <Link to="/" className="hover:text-deep-900">
        Trang chủ
      </Link>
      <Icon name="arrowRight" size={13} className="text-ink-faint" />
      <Link to={PATHS.products} className="hover:text-deep-900">
        Sản phẩm
      </Link>
      <Icon name="arrowRight" size={13} className="text-ink-faint" />
      <Link to={productsUrl({ 'danh-muc': product.category })} className="hover:text-deep-900">
        {categoryLabel(product.category)}
      </Link>
    </nav>
  )
}

/** Thiết kế tìm đại lý mục 5: dòng nhỏ, không tranh với nút đặt hàng */
export function NearMeLine() {
  return (
    <p className="mt-5 text-sm text-ink-soft">
      <Link to={NEAR_ME_URL} className="inline-flex items-center gap-1.5 hover:text-deep-900">
        <Icon name="pin" size={15} className="text-mist-600" />
        Muốn nằm thử trước?{' '}
        <span className="font-medium text-deep-900 underline underline-offset-4">Tìm đại lý gần Quý khách</span>
      </Link>
    </p>
  )
}

export function TrustList() {
  return (
    <ul className="mt-8 grid gap-2.5 border-t border-ivory pt-6 text-[0.85rem] text-ink-soft sm:grid-cols-2">
      {TRUST_POINTS.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <Icon name="check" size={15} className="text-mist-600" /> {t}
        </li>
      ))}
    </ul>
  )
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] bg-cream-50 p-6 text-[0.9rem] leading-relaxed text-ink-soft ring-1 ring-cream-200 sm:p-7">
      <h2 className="font-display mb-4 text-[1.35rem] text-deep-900">{title}</h2>
      {children}
    </section>
  )
}

/** Bảo hành: chữ thường in đậm, phần [ĐIỀN …] tô nổi để Ecopillo bổ sung */
function WarrantyText({ text }: { text: string }) {
  const [main, fill] = text.split(/(?=\[)/)
  return (
    <>
      {main.trim() && <strong className="font-medium text-deep-900">{main.trim()}</strong>} {fill && <FillIn>{fill}</FillIn>}
    </>
  )
}

/** Ba thẻ thông tin: trong bộ gồm (bộ chăn ga), chất liệu, giao hàng và bảo hành */
export function ProductInfoCards({ product, className = 'mt-16' }: { product: Product; className?: string }) {
  const collection = product.collection
  const warranty = product.specs?.find((spec) => spec.label === 'Bảo hành')?.value ?? WARRANTY_BY_CATEGORY[product.category]
  return (
    <div className={`grid gap-5 ${collection ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} ${className}`}>
      {collection && (
        <InfoCard title="Trong bộ gồm">
          <ul className="space-y-2">
            {collection.contents.map((c) => (
              <li key={c} className="flex gap-2">
                <Icon name="check" size={15} className="mt-1 shrink-0 text-mist-600" /> {c}
              </li>
            ))}
          </ul>
        </InfoCard>
      )}
      <InfoCard title="Chất liệu & đặc điểm">
        <ul className="space-y-2">
          {product.details.map((d) => (
            <li key={d} className="flex gap-2">
              <Icon name="leaf" size={15} className="mt-1 shrink-0 text-mist-600" /> {d}
            </li>
          ))}
        </ul>
      </InfoCard>
      <InfoCard title="Giao hàng, đổi trả & bảo hành">
        <ul className="space-y-2">
          {POLICIES.map((p) => (
            <li key={p} className="flex gap-2">
              <Icon name="truck" size={15} className="mt-1 shrink-0 text-mist-600" /> {p}
            </li>
          ))}
          <li className="flex gap-2">
            <Icon name="shield" size={15} className="mt-1 shrink-0 text-mist-600" />
            <span>
              Bảo hành tính từ ngày mua: <WarrantyText text={warranty} />
            </span>
          </li>
        </ul>
      </InfoCard>
    </div>
  )
}

export function RelatedProducts({ product }: { product: Product }) {
  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3)
  if (related.length === 0) return null
  return (
    <section aria-labelledby="related-title" className="mt-20">
      <div className="flex items-end justify-between gap-4">
        <h2 id="related-title" className="font-display text-[1.8rem] text-deep-900 sm:text-[2.2rem]">
          Có thể Quý khách thích
        </h2>
        <Link to={productsUrl({ 'danh-muc': product.category })} className="text-sm font-medium text-deep-800 hover:underline">
          Xem tất cả
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
        {related.map((p) => (
          <li key={p.slug} className="flex [&>article]:flex-1">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}

interface MobileBuyBarProps {
  product: Product
  pattern?: Pattern
  size: SizeId | null
  unitPrice: number | null
  singleUrl: string | null
  /** Phối màu đang xem đã hết mọi kích thước */
  isSoldOut?: boolean
}

const BUY_BAR_LINK = 'flex h-12 min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl bg-deep-800 pr-3 pl-4 text-ivory'

/** Thanh mua cố định trên điện thoại: gọi / Zalo / giá / Đặt mua */
export function MobileBuyBar({ product, pattern, size, unitPrice, singleUrl, isSoldOut = false }: MobileBuyBarProps) {
  const collection = product.collection
  const url = collection ? orderUrl(collection, pattern, size) : singleUrl
  const price = unitPrice ? formatVND(unitPrice) : priceLabel(product)
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-ivory/95 px-3 pt-2.5 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-2">
        <a
          href={CONTACT.hotlineTel}
          aria-label={`Gọi hotline ${CONTACT.hotlineDisplay}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mist-100 text-deep-900"
        >
          <Icon name="phone" size={19} />
        </a>
        <a
          href={CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo Ecopillo"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mist-100"
        >
          <ZaloMark />
        </a>
        {isSoldOut ? (
          <span className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-2xl bg-cream-50 text-[0.92rem] font-medium text-ink-faint ring-1 ring-cream-200">
            {pattern?.code} tạm hết hàng
          </span>
        ) : (
          url && (
            <Link to={url} className={BUY_BAR_LINK}>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[0.68rem] text-mist-200">{price}</span>
                <span className="block truncate text-[0.92rem] font-medium">Đặt mua {pattern?.code ?? ''}</span>
              </span>
              <Icon name="arrowRight" size={18} className="shrink-0" />
            </Link>
          )
        )}
      </div>
    </div>
  )
}
