import { useState } from 'react'
import { STOCK_TEXT } from '../data/pageText/stock'
import { isChoiceSoldOut, isFullySoldOut, isVariantOptionSoldOut } from '../lib/stock'
import { Blocks } from '../components/ui/Blocks'
import { PRODUCT_DETAIL_ORDER } from '../data/pageLayout'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CollectionDetail } from '../components/collection/CollectionDetail'
import { DetailBreadcrumb, MobileBuyBar, NearMeLine, ProductInfoCards, RelatedProducts, TrustList } from '../components/products/DetailParts'
import { ProductReviews } from '../components/products/ProductReviews'
import { JsonLd } from '../components/seo/JsonLd'
import { CrossfadeImage } from '../components/ui/CrossfadeImage'
import { Icon, ZaloMark } from '../components/ui/Icon'
import { Lightbox, ZoomTrigger } from '../components/ui/Lightbox'
import { useLightbox } from '../hooks/useLightbox'
import { Placeholder } from '../components/ui/Placeholder'
import { ThumbStrip } from '../components/ui/ThumbStrip'
import { buttonClass, Container } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { COLLECTION_BY_PATH, productPageTarget, withSlash } from '../data/links'
import { PRODUCT_INFO, type InfoSection } from '../data/productInfo'
import { relatedForProduct } from '../data/related'
import { ExploreMore } from '../components/ui/ExploreMore'
import { categoryLabel, hasPrice, priceLabel, productBySlug, singleOrderUrl, variantPrice, type Product } from '../data/products'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatRange } from '../lib/format'
import { productMetaDescription } from '../lib/metaDescription'
import { productLd, shareImageOf } from '../lib/structuredData'
import { NotFoundPage } from './NotFoundPage'
import { COMMON_TEXT } from '../data/pageText/common'
import { chen } from '../data/pageText/define'
import { PRODUCT_DETAIL_TEXT as T } from '../data/pageText/productUi'

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
  usePageMeta(T.khongTimThay, undefined, { notFound: true })
  return <NotFoundPage />
}

/**
 * Mô tả SEO của sản phẩm lẻ theo công thức C2 (08/11/2026): câu đầu phần giới thiệu, tên, giá, gọi xác nhận.
 * Trước 24/10/2026 trang này không đặt mô tả, 16 sản phẩm lẻ dùng chung mô tả của trang chủ (rà toàn web 24/10/2026)
 */
const productDescription = (product: Product): string =>
  // Chưa có giá: "…, giá báo khi gọi xác nhận." thay vì "giá Báo giá khi gọi xác nhận."
  productMetaDescription(product.summary, product.name, hasPrice(product) ? priceLabel(product) : T.moTaGoogleGiaKhiGoi)

/** Sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm): ảnh chính + ảnh phụ, chọn kích thước rồi đặt online */
function ProductDetail({ product }: { product: Product }) {
  const { pathname } = useLocation()
  usePageMeta(product.name, productDescription(product), { image: shareImageOf(product.image), type: 'product' })
  const photos = product.image ? [product.image, ...(product.gallery ?? [])] : []
  const [photoIndex, setPhotoIndex] = useState(0)
  // Bấm ảnh chính: xem toàn màn hình (C3, dùng chung với trang bộ sưu tập)
  const lightbox = useLightbox()
  const variants = product.variants
  // Owner 18/11/2026: "giá thì sẽ để giá min-max. khi chọn giá ở trong thuộc tính thì sẽ hiện giá ở trên".
  // Chưa chọn gì: giá trên cùng là khoảng thấp nhất – cao nhất; chọn đủ thì hiện đúng giá. Một độ dày duy nhất thì chọn sẵn.
  const [variantSize, setVariantSize] = useState<string | null>(null)
  const [thickness, setThickness] = useState<string | null>(variants?.thicknesses.length === 1 ? variants.thicknesses[0] : null)
  const [choiceId, setChoiceId] = useState<string | null>(null)
  const choice = product.choices?.find((c) => c.id === choiceId)
  // Hết hàng Ecopillo báo trong Woo (đợt F): lựa chọn đang chọn đã hết, hoặc cả sản phẩm hết, thì không mở trang đặt hàng
  const allOut = isFullySoldOut(product)
  const selectedOut = allOut || (variants ? isChoiceSoldOut(product, variantSize, thickness) : product.choices ? isChoiceSoldOut(product, choiceId) : false)
  const selectedLabel = variants ? [variantSize, thickness].filter(Boolean).join(' · ') : (product.choices?.find((c) => c.id === choiceId)?.label ?? '')
  const orderUrl = variants ? singleOrderUrl(product, variantSize, thickness) : singleOrderUrl(product, choiceId)
  const singleUrl = selectedOut ? null : orderUrl
  // Giá các tổ hợp còn hợp với lựa chọn hiện tại (chưa chọn ô nào thì là mọi giá)
  const variantPrices = (size: string | null, t: string | null): number[] =>
    variants
      ? variants.sizes.flatMap((sz) =>
          variants.thicknesses.flatMap((th) => {
            const price = (size === null || sz === size) && (t === null || th === t) ? variantPrice(variants, sz, th) : undefined
            return price === undefined ? [] : [price]
          }),
        )
      : []
  const shownPrices = variants
    ? variantPrices(variantSize, thickness)
    : choice?.price !== undefined
      ? [choice.price]
      : choice
        ? []
        : (product.choices ?? []).flatMap((c) => (c.price === undefined ? [] : [c.price]))
  const isExact = variants ? variantSize !== null && thickness !== null : choice !== undefined
  const singlePrice = isExact && shownPrices.length === 1 ? shownPrices[0] : undefined
  const topPrice = shownPrices.length
    ? formatRange(Math.min(...shownPrices), Math.max(...shownPrices))
    : hasPrice(product)
      ? formatRange(product.min, product.max)
      : priceLabel(product)
  const image = photos[photoIndex] ?? product.image
  const info = PRODUCT_INFO[product.slug]
  // Thông số: ô trong productInfo.ts ghi đè ô cùng tên trong products.ts
  const specs = product.specsFromWoo
    ? (product.specs ?? [])
    : [...(info?.specs ?? []), ...(product.specs ?? []).filter((s) => !info?.specs?.some((i) => i.label === s.label))]

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
              {image && <ZoomTrigger onOpen={lightbox.open} />}
            </div>
            {/* Vuốt ngang, có nút ‹ › hai bên (divan 22 ảnh, owner 09/11/2026) */}
            <ThumbStrip photos={photos} index={photoIndex} onIndexChange={setPhotoIndex} />
            {lightbox.isOpen && photos.length > 0 && (
              <Lightbox
                photos={photos}
                index={Math.min(photoIndex, photos.length - 1)}
                onIndexChange={setPhotoIndex}
                onClose={lightbox.close}
                label={chen(T.ariaKhungAnh, { ten: product.name })}
              />
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
              {topPrice}
            </p>
            {allOut && <p className="mt-3 text-sm font-medium text-alert">{STOCK_TEXT.caSanPhamHet}</p>}
            <p className="mt-2 text-sm text-ink-soft">{product.summary}</p>

            <div className="mt-8 space-y-6">
              {variants && (
                <>
                  {/* Giá trong từng ô: ô kích thước theo độ dày đang chọn, ô độ dày theo kích thước đang chọn */}
                  <VariantGroup
                    label={T.kichThuoc}
                    options={variants.sizes}
                    value={variantSize}
                    onChange={setVariantSize}
                    priceOf={(size) => variantPrices(size, thickness)}
                    soldOutOf={(size) => isVariantOptionSoldOut(product, size, thickness)}
                  />
                  <VariantGroup
                    label={T.doDay}
                    options={variants.thicknesses}
                    value={thickness}
                    onChange={setThickness}
                    priceOf={(t) => variantPrices(variantSize, t)}
                    soldOutOf={(t) => isVariantOptionSoldOut(product, variantSize, t)}
                  />
                </>
              )}
              {product.choices && (
                <VariantGroup
                  label={product.choiceLabel ?? T.kichThuoc}
                  options={product.choices.map((c) => c.label)}
                  value={choice?.label ?? null}
                  priceOf={(label) => {
                    const price = product.choices?.find((c) => c.label === label)?.price
                    return price === undefined ? [] : [price]
                  }}
                  soldOutOf={(label) => isChoiceSoldOut(product, product.choices?.find((c) => c.label === label)?.id ?? null)}
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
                    ? T.baoGiaChinhXac
                    : chen(T.baoGiaCo, { co: choice.label })}
                </p>
              )}
              {selectedOut && !allOut && selectedLabel && (
                <p className="text-sm font-medium text-alert">{chen(STOCK_TEXT.luaChonHet, { chon: selectedLabel })}</p>
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
                    {T.datMua}
                    <Icon name="arrowRight" size={18} />
                  </Link>
                )}
                <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'lg')}>
                  <ZaloMark /> {T.tuVan}
                </a>
              </div>
              <p className="text-sm text-ink-soft">
                {COMMON_TEXT.spDatMua}
              </p>
            </div>

            <NearMeLine />
            <TrustList />
          </div>
        </div>

        {/* Thứ tự, ẩn / hiện các khối dưới: Nội dung web → Giao diện → Bố cục trang sản phẩm lẻ (đợt E5) */}
        <Blocks
          order={PRODUCT_DETAIL_ORDER}
          khung="cot"
          blocks={{
            // Phần Ecopillo sửa trong Woo (đợt D) thay phần trong productInfo.ts; sản phẩm mới thêm phần đó cũng có
            'hieu-ky': (product.infoSections ?? info?.sections)?.length ? <ProductStory sections={product.infoSections ?? info?.sections ?? []} /> : null,
            'giao-hang': <ProductInfoCards product={product} />,
            'danh-gia': <ProductReviews product={product} />,
            'co-the-thich': <RelatedProducts product={product} />,
            'kham-pha': <ExploreMore groups={relatedForProduct(product)} />,
          }}
        />
      </Container>

      <MobileBuyBar product={product} size={null} unitPrice={singlePrice ?? null} singleUrl={singleUrl} isSoldOut={selectedOut} />
    </div>
  )
}

interface VariantGroupProps {
  label: string
  options: readonly string[]
  /** null: chưa chọn */
  value: string | null
  onChange: (value: string) => void
  /** Các giá có thể của lựa chọn (một giá, hoặc khoảng khi ô bên kia chưa chọn); rỗng = chưa có giá, ghi "Báo giá khi gọi" */
  priceOf: (option: string) => readonly number[]
  /** Lựa chọn tạm hết hàng (đợt F): ô mờ, ghi "Tạm hết hàng" thay giá, không bấm được (trừ ô đang chọn, để bỏ được) */
  soldOutOf?: (option: string) => boolean
}

/**
 * Ô chọn kích thước, độ dày, mẫu: mỗi ô ghi giá của lựa chọn đó (owner 18/11/2026: "cho giá hiện ở ô kích thước của
 * từng sản phẩm"), cùng kiểu ô kích thước trang bộ sưu tập (ChapterBuy) và bước đặt hàng.
 */
function VariantGroup({ label, options, value, onChange, priceOf, soldOutOf }: VariantGroupProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-deep-900">
        {label}
        {value && (
          <>
            : <span className="font-normal text-ink-soft">{value}</span>
          </>
        )}
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const active = option === value
          const prices = priceOf(option)
          const soldOut = soldOutOf?.(option) ?? false
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              disabled={soldOut && !active}
              onClick={() => onChange(option)}
              className={`flex min-w-0 flex-col items-start rounded-2xl px-4 py-3 text-left transition ${
                active ? 'bg-mist-50 ring-2 ring-deep-800' : 'bg-ivory ring-1 ring-cream-200 hover:ring-deep-700'
              } ${soldOut ? 'cursor-not-allowed opacity-55' : ''}`}
            >
              <span className={`text-sm font-medium text-deep-900 ${soldOut ? 'line-through' : ''}`}>{option}</span>
              <span className="tabular mt-0.5 text-meta text-ink-soft">
                {soldOut ? STOCK_TEXT.tamHet : prices.length ? formatRange(Math.min(...prices), Math.max(...prices)) : T.baoGiaKhiGoi}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** "Hiểu kỹ trước khi chọn": cấu tạo, hợp với ai, cách dùng (src/data/productInfo.ts) */
function ProductStory({ sections }: { sections: readonly InfoSection[] }) {
  return (
    <section aria-labelledby="story-title" className="mt-16 sm:mt-20">
      <h2 id="story-title" className="font-display text-[1.8rem] leading-tight text-deep-900 sm:text-[2.2rem]">
        {COMMON_TEXT.spHieuKy}
      </h2>
      <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="eyebrow">{section.title}</h3>
            {section.body?.map((line) => (
              <p key={line} className="chu-deu mt-3 text-body-sm leading-relaxed text-ink-soft">
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
