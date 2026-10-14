import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CollectionDetail } from '../components/collection/CollectionDetail'
import { DetailBreadcrumb, MobileBuyBar, NearMeLine, ProductInfoCards, RelatedProducts, TrustList } from '../components/products/DetailParts'
import { ProductReviews } from '../components/products/ProductReviews'
import { CrossfadeImage } from '../components/ui/CrossfadeImage'
import { Icon, ZaloMark } from '../components/ui/Icon'
import { Placeholder } from '../components/ui/Placeholder'
import { buttonClass, Container } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { categoryLabel, priceLabel, productBySlug, singleOrderUrl, variantPrice, type Product } from '../data/products'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatVND } from '../lib/format'
import { NotFoundPage } from './NotFoundPage'

export function ProductDetailPage() {
  const { slug, mau } = useParams()
  const product = productBySlug(slug)
  if (!product) return <MissingProduct />
  // Bộ chăn ga, chăn hè: trang bộ sưu tập, mỗi phối màu là một chương có đường link riêng
  if (product.collection) return <CollectionDetail key={product.slug} product={product} collection={product.collection} patternParam={mau} />
  // key: đổi sản phẩm thì làm mới lựa chọn kích thước
  return <ProductDetail key={product.slug} product={product} />
}

function MissingProduct() {
  usePageMeta('Không tìm thấy trang')
  return <NotFoundPage />
}

/** Sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm): ảnh chính + ảnh phụ, chọn kích thước rồi đặt online */
function ProductDetail({ product }: { product: Product }) {
  usePageMeta(product.name)
  const photos = product.image ? [product.image, ...(product.gallery ?? [])] : []
  const [photoIndex, setPhotoIndex] = useState(0)
  const variants = product.variants
  const [variantSize, setVariantSize] = useState(variants?.sizes[1] ?? variants?.sizes[0] ?? '')
  const [thickness, setThickness] = useState(variants?.thicknesses[0] ?? '')
  const variantUnitPrice = variants ? variantPrice(variants, variantSize, thickness) : undefined
  // Sản phẩm có khoảng giá: chọn kích thước rồi đặt online
  const [choiceId, setChoiceId] = useState(product.choices?.[0]?.id ?? null)
  const choice = product.choices?.find((c) => c.id === choiceId)
  const singleUrl = variants ? singleOrderUrl(product, variantSize, thickness) : singleOrderUrl(product, choiceId)
  const singlePrice = variantUnitPrice ?? choice?.price
  const image = photos[photoIndex] ?? product.image

  return (
    <div className="pb-36 lg:pb-24">
      <Container className="pt-8 sm:pt-10">
        <DetailBreadcrumb product={product} />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* Ảnh */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-cream-100 shadow-[var(--shadow-soft)]">
              {image ? (
                <CrossfadeImage image={image} sizes="(min-width: 1024px) 680px, 100vw" priority />
              ) : (
                <Placeholder className="absolute inset-0 h-full w-full" tone="mist" note={product.imageNote} />
              )}
            </div>
            {photos.length > 1 && (
              <ul aria-label="Ảnh sản phẩm" className="mt-3 flex gap-2.5">
                {photos.map((photo, i) => (
                  <li key={photo.src}>
                    <button
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      aria-label={`Xem ảnh ${i + 1}`}
                      aria-pressed={i === photoIndex}
                      className={`block h-16 w-[5.5rem] overflow-hidden rounded-xl transition ${
                        i === photoIndex ? 'ring-2 ring-deep-800 ring-offset-2 ring-offset-ivory' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <Placeholder compact className="h-full w-full" note={`Ảnh ${i + 1}`} image={photo} sizes="88px" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Thông tin và lựa chọn */}
          <div>
            <p className="eyebrow">{categoryLabel(product.category)}</p>
            <h1 className="font-display mt-3 text-[2.1rem] leading-tight text-deep-900 sm:text-[2.6rem]">
              {product.name}
            </h1>
            <p className="tabular mt-5 font-display text-[2rem] leading-none text-deep-900">
              {singlePrice ? formatVND(singlePrice) : priceLabel(product)}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{product.summary}</p>

            <div className="mt-8 space-y-6">
              {variants && (
                <>
                  <VariantGroup label="Kích thước" options={variants.sizes} value={variantSize} onChange={setVariantSize} />
                  <VariantGroup label="Độ dày" options={variants.thicknesses} value={thickness} onChange={setThickness} />
                </>
              )}
              {product.choices && choiceId && (
                <VariantGroup
                  label="Kích thước"
                  options={product.choices.map((c) => c.label)}
                  value={choice?.label ?? ''}
                  onChange={(label) => setChoiceId(product.choices?.find((c) => c.label === label)?.id ?? null)}
                />
              )}
              {product.choices && choice && choice.price === undefined && (
                <p className="text-sm text-ink-soft">
                  Giá cỡ {choice.label} theo độ dày và dòng đệm: nhân viên báo giá chính xác khi gọi xác nhận đơn.
                </p>
              )}
              {product.specs && (
                <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-cream-50 p-4 ring-1 ring-cream-200">
                  {product.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[0.7rem] tracking-[0.12em] text-ink-faint uppercase">{spec.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium text-deep-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="hidden gap-3 lg:flex">
                {singleUrl && (
                  <Link to={singleUrl} className={buttonClass('primary', 'lg', 'flex-1')}>
                    Đặt mua
                    <Icon name="arrowRight" size={18} />
                  </Link>
                )}
                <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'lg')}>
                  <ZaloMark /> Tư vấn
                </a>
              </div>
              <p className="text-sm text-ink-soft">
                Đặt online, nhân viên gọi xác nhận trước khi giao. Thanh toán khi nhận hàng.
              </p>
            </div>

            <NearMeLine />
            <TrustList />
          </div>
        </div>

        <ProductInfoCards product={product} />

        <ProductReviews product={product} />

        <RelatedProducts product={product} />
      </Container>

      <MobileBuyBar product={product} size={null} unitPrice={singlePrice ?? null} singleUrl={singleUrl} />
    </div>
  )
}

interface VariantGroupProps {
  label: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
}

function VariantGroup({ label, options, value, onChange }: VariantGroupProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-deep-900">
        {label}: <span className="font-normal text-ink-soft">{value}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={`h-10 rounded-full px-4 text-sm transition ${
              option === value ? 'bg-deep-800 text-ivory' : 'bg-ivory text-deep-900 ring-1 ring-cream-200 hover:ring-mist-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
