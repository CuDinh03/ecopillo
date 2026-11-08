import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CollectionDetail } from '../components/collection/CollectionDetail'
import { DetailBreadcrumb, MobileBuyBar, NearMeLine, ProductInfoCards, RelatedProducts, TrustList } from '../components/products/DetailParts'
import { ProductReviews } from '../components/products/ProductReviews'
import { JsonLd } from '../components/seo/JsonLd'
import { CrossfadeImage } from '../components/ui/CrossfadeImage'
import { Icon, ZaloMark } from '../components/ui/Icon'
import { Placeholder } from '../components/ui/Placeholder'
import { buttonClass, Container } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { COLLECTION_BY_PATH, productPageTarget, withSlash } from '../data/links'
import { PRODUCT_INFO, type InfoSection } from '../data/productInfo'
import { relatedForProduct } from '../data/related'
import { ExploreMore } from '../components/ui/ExploreMore'
import { categoryLabel, hasPrice, priceLabel, productBySlug, singleOrderUrl, variantPrice, type Product } from '../data/products'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatVND } from '../lib/format'
import { productMetaDescription } from '../lib/metaDescription'
import { productLd, shareImageOf } from '../lib/structuredData'
import { NotFoundPage } from './NotFoundPage'

/**
 * Trang sản phẩm, ở đúng đường link của web cũ (src/data/links.ts):
 * - trang danh mục bộ sưu tập (/danh-muc-san-pham/bo-suu-tap-eco-rosa/): trang bộ sưu tập, mở sẵn chương đại diện;
 * - trang sản phẩm của một mẫu (/san-pham/bo-chan-ga-lyocell-eco-rosa-er25/): cùng trang bộ sưu tập, mở chương ER25;
 * - trang sản phẩm lẻ (/san-pham/ruot-goi-to-tam-ecopillo/): ruột gối, ruột chăn, topper, đệm.
 * Cả hai kiểu link bộ sưu tập dùng chung một component, nên đổi chương không tải lại trang.
 */
export function ProductDetailPage() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const collectionId = COLLECTION_BY_PATH.get(withSlash(pathname))
  const target = productPageTarget(slug)
  const pattern = target?.kind === 'pattern' ? target : undefined
  const product = productBySlug(collectionId ?? pattern?.collectionId ?? (target?.kind === 'product' ? target.slug : undefined))
  if (!product) return <MissingProduct />
  // Bộ chăn ga, chăn hè: trang bộ sưu tập, mỗi phối màu là một chương có đường link riêng
  if (product.collection)
    return <CollectionDetail key={product.slug} product={product} collection={product.collection} patternParam={pattern?.code} />
  // key: đổi sản phẩm thì làm mới lựa chọn kích thước
  return <ProductDetail key={product.slug} product={product} />
}

function MissingProduct() {
  usePageMeta('Không tìm thấy trang', undefined, { notFound: true })
  return <NotFoundPage />
}

/**
 * Mô tả SEO của sản phẩm lẻ theo công thức C2 (08/11/2026): câu đầu phần giới thiệu, tên, giá, thanh toán khi nhận.
 * Trước 24/10/2026 trang này không đặt mô tả, 16 sản phẩm lẻ dùng chung mô tả của trang chủ (rà toàn web 24/10/2026)
 */
const productDescription = (product: Product): string =>
  // Chưa có giá: "…, giá báo khi gọi xác nhận." thay vì "giá Báo giá khi gọi xác nhận."
  productMetaDescription(product.summary, product.name, hasPrice(product) ? priceLabel(product) : 'báo khi gọi xác nhận')

/** Sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm): ảnh chính + ảnh phụ, chọn kích thước rồi đặt online */
function ProductDetail({ product }: { product: Product }) {
  const { pathname } = useLocation()
  usePageMeta(product.name, productDescription(product), { image: shareImageOf(product.image), type: 'product' })
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
  const info = PRODUCT_INFO[product.slug]
  // Thông số: ô trong productInfo.ts ghi đè ô cùng tên trong products.ts
  const specs = [...(info?.specs ?? []), ...(product.specs ?? []).filter((s) => !info?.specs?.some((i) => i.label === s.label))]

  return (
    <div className="pb-36 lg:pb-24">
      <Container className="pt-8 sm:pt-10">
        {/* Sản phẩm lẻ chưa có dữ liệu tồn kho: không ghi còn hay hết hàng */}
        <JsonLd
          data={productLd({ name: product.name, description: product.summary, path: pathname, image: product.image, min: product.min, max: product.max })}
        />
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
            {/* Chưa có giá: chữ báo giá nhỏ hơn số tiền, để không rớt hai dòng trên điện thoại */}
            <p
              className={`tabular mt-5 font-display leading-none text-deep-900 ${hasPrice(product) ? 'text-[2rem]' : 'text-[1.45rem]'}`}
            >
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
                  label={product.choiceLabel ?? 'Kích thước'}
                  options={product.choices.map((c) => c.label)}
                  value={choice?.label ?? ''}
                  onChange={(label) => {
                    const next = product.choices?.find((c) => c.label === label)
                    setChoiceId(next?.id ?? null)
                    // Lựa chọn có ảnh riêng (mẫu chăn đông Hàn): đổi luôn ảnh chính sang ảnh mẫu đó
                    const nextPhoto = next?.image ? photos.findIndex((p) => p.src === next.image?.src) : -1
                    if (nextPhoto >= 0) setPhotoIndex(nextPhoto)
                  }}
                />
              )}
              {product.choices && choice && choice.price === undefined && (
                <p className="text-sm text-ink-soft">
                  {product.isPriceOnCall
                    ? 'Nhân viên báo giá chính xác khi gọi xác nhận đơn.'
                    : `Giá cỡ ${choice.label} theo độ dày và dòng đệm: nhân viên báo giá chính xác khi gọi xác nhận đơn.`}
                </p>
              )}
              {specs.length > 0 && (
                <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-cream-50 p-4 shadow-[var(--shadow-soft)]">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-label tracking-[0.12em] text-ink-faint uppercase">{spec.label}</dt>
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

        {info && <ProductStory sections={info.sections} />}

        <ProductInfoCards product={product} />

        <ProductReviews product={product} />

        <RelatedProducts product={product} />
        <ExploreMore groups={relatedForProduct(product)} />
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

/** "Hiểu kỹ trước khi chọn": cấu tạo, hợp với ai, cách dùng (src/data/productInfo.ts) */
function ProductStory({ sections }: { sections: readonly InfoSection[] }) {
  return (
    <section aria-labelledby="story-title" className="mt-16 sm:mt-20">
      <h2 id="story-title" className="font-display text-[1.8rem] leading-tight text-deep-900 sm:text-[2.2rem]">
        Hiểu kỹ trước khi chọn
      </h2>
      <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="eyebrow">{section.title}</h3>
            {section.body?.map((line) => (
              <p key={line} className="mt-3 text-body-sm leading-relaxed text-ink-soft">
                {line}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 space-y-2.5 text-body-sm leading-relaxed text-ink-soft">
                {section.list.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-600" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
