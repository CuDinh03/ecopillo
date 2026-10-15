import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import {
  imageOfPattern,
  isPatternSoldOut,
  isSizeSoldOut,
  patternPrice,
  type Collection,
  type Pattern,
  type SizeId,
} from '../../data/catalog'
import type { Product } from '../../data/products'
import { chapterTitle, patternByParam, patternPath, storyOf, toneById, volumesOf } from '../../data/stories'
import { relatedForProduct } from '../../data/related'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ExploreMore } from '../ui/ExploreMore'
import { DetailBreadcrumb, MobileBuyBar, ProductInfoCards, RelatedProducts } from '../products/DetailParts'
import { ProductReviews } from '../products/ProductReviews'
import { Container } from '../ui/primitives'
import { ChapterBuy, ChapterImage, ChapterStory } from './ChapterParts'
import { ChapterRail } from './ChapterRail'
import { CollectionCover } from './CollectionCover'
import { SameTone } from './SameTone'

interface CollectionDetailProps {
  product: Product
  collection: Collection
  /** Mã mẫu trên đường link, ví dụ "et01" trong /san-pham/eco-tera/et01 */
  patternParam?: string
}

/** Chương mở sẵn khi vào trang bộ sưu tập: mẫu đại diện, không thì mẫu đầu tiên còn hàng */
const defaultPattern = (collection: Collection): Pattern | undefined =>
  collection.patterns.find((p) => p.code === collection.cover && !isPatternSoldOut(p)) ??
  collection.patterns.find((p) => !isPatternSoldOut(p)) ??
  collection.patterns[0]

/**
 * Trang bộ sưu tập theo thiết kế "Kết hợp D" (owner chọn 14/10/2026):
 * bìa kể chuyện cả bộ (B) → sân khấu của một chương, đổi tại chỗ (A) → cùng gam màu ở bộ khác (C).
 * Mỗi phối màu là một chương có đường link riêng; đổi chương thì đổi link nhưng không cuộn trang.
 */
export function CollectionDetail({ product, collection, patternParam }: CollectionDetailProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const legacy = patternParam ? undefined : patternByParam(collection, searchParams.get('mau'))
  const pattern = patternByParam(collection, patternParam) ?? legacy ?? defaultPattern(collection)

  const [size, setSize] = useState<SizeId | null>(null)
  const [previewCode, setPreviewCode] = useState<string | null>(null)
  // Tập đang xem trong hàng chương (bộ nhiều phối màu); null = tập của chương đang mở
  const [browsedVolume, setBrowsedVolume] = useState<string | null>(null)

  const story = pattern ? storyOf(collection, pattern) : undefined
  const title = pattern ? chapterTitle(collection, pattern) : product.name
  usePageMeta(pattern ? `${title} · ${product.name} ${pattern.code}` : product.name, story?.text ?? product.summary)

  if (!pattern) return null
  // Link cũ dạng ?mau=ER42: chuyển sang link riêng của phối màu
  if (legacy) return <Navigate to={patternPath(collection, legacy)} replace />

  const volumes = volumesOf(collection)
  const volumeOf = (p: Pattern) => storyOf(collection, p)?.volume
  // Số chương đếm trong tập (nếu bộ có chia tập), không thì đếm trong cả bộ
  const siblings = story?.volume ? collection.patterns.filter((p) => volumeOf(p) === story.volume) : collection.patterns
  const index = siblings.findIndex((p) => p.code === pattern.code)
  const railVolume = browsedVolume ?? story?.volume
  const railChapters = railVolume ? collection.patterns.filter((p) => volumeOf(p) === railVolume) : collection.patterns

  const open = (next: Pattern) => {
    setBrowsedVolume(null)
    setPreviewCode(null)
    // keepScroll: SiteLayout không kéo trang lên đầu khi chỉ đổi chương
    navigate(patternPath(collection, next), { replace: true, state: { keepScroll: true } })
  }
  const step = (delta: number) => open(siblings[(index + delta + siblings.length) % siblings.length])

  const shown = collection.patterns.find((p) => p.code === previewCode) ?? pattern
  const validSize = size && !isSizeSoldOut(pattern, size) ? size : null
  const isSoldOut = isPatternSoldOut(pattern)
  const tone = toneById(story?.tone)

  return (
    <div className="pb-36 lg:pb-24">
      <Container className="pt-8 sm:pt-10">
        <DetailBreadcrumb product={product} />
        <CollectionCover collection={collection} />

        {/*
          Điện thoại: ảnh → câu chuyện → hàng chương → mua (các khối bọc dùng `contents` để xếp lại thứ tự).
          Máy tính: ảnh bên trái dính khi cuộn, câu chuyện và mua bên phải; hàng chương nằm NGOÀI khối hai cột,
          nên ảnh dính không bao giờ trôi đè lên hàng chương.
        */}
        <section aria-labelledby="chapter-title" className="mt-8 flex flex-col gap-y-7 lg:mt-12 lg:block">
          <div className="max-lg:contents lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-x-14">
            <ChapterImage
              image={imageOfPattern(collection, shown)}
              shown={shown}
              note={collection.imageNote}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
            />
            <div className="max-lg:contents">
              <ChapterStory pattern={pattern} story={story} title={title} index={index} total={siblings.length} volume={story?.volume} />
              <ChapterBuy
                collection={collection}
                pattern={pattern}
                size={validSize}
                onSize={setSize}
                isSoldOut={isSoldOut}
                className="max-lg:order-last lg:mt-7"
              />
            </div>
          </div>
          <ChapterRail
            collection={collection}
            chapters={railChapters}
            current={pattern}
            volumes={volumes}
            volume={railVolume}
            onVolume={setBrowsedVolume}
            onOpen={open}
            onPreview={setPreviewCode}
            className="min-w-0 lg:mt-14"
          />
        </section>

        {tone && <SameTone collection={collection} tone={tone} />}

        <h2 className="font-display mt-16 text-[1.6rem] leading-tight text-deep-900 sm:mt-20 sm:text-[2.2rem]">
          Giống nhau ở <span className="text-mist-600 italic">mọi phối màu</span>
        </h2>
        <ProductInfoCards product={product} className="mt-6" />

        <ProductReviews product={product} />
        <RelatedProducts product={product} />
        <ExploreMore groups={relatedForProduct(product)} />
      </Container>

      <MobileBuyBar
        product={product}
        pattern={pattern}
        size={validSize}
        unitPrice={validSize ? patternPrice(collection, pattern, validSize) : null}
        singleUrl={null}
        isSoldOut={isSoldOut}
      />
    </div>
  )
}
