import { BRAND, CONTACT, SOCIAL_LINKS } from '../data/brand'
import type { ImageSource } from '../data/catalog'
import type { Faq } from '../data/content'
import { SITE_ORIGIN, withSlash } from '../data/links'

/**
 * Dữ liệu cấu trúc (JSON-LD) và ảnh chia sẻ cho từng trang (SSG giai đoạn 2, docs/ke-hoach-ssg-va-wordpress.md).
 * Mọi đường link trong JSON-LD là link thật của web (SITE_ORIGIN), kể cả ở bản xem thử, như thẻ canonical.
 */

type JsonLdObject = Record<string, unknown>

const CONTEXT = 'https://schema.org'
const LOGO_PATH = '/images/brand/logo-ecopillo.png'

export const absoluteUrl = (path: string): string => `${SITE_ORIGIN}${path}`
const pageUrl = (path: string): string => absoluteUrl(withSlash(path))

/** Ảnh chia sẻ (og:image) của một trang: đường dẫn trong public/ và chữ mô tả ảnh */
export interface ShareImage {
  path: string
  alt: string
}

const SHARE_SOURCE_RE = /^\/images\/(?:patterns|products)\/([^/]+)\.webp$/

/**
 * Ảnh 1200×630 JPEG tạo sẵn từ ảnh phối màu, ảnh sản phẩm (tools/tao-anh-chia-se-2026-10-28.py, cùng tên gốc).
 * Ảnh khác (ảnh chi tiết, ảnh trang) chưa có bản chia sẻ: trả undefined, trang dùng ảnh chia sẻ chung của web.
 */
export function shareImageOf(image: ImageSource | undefined): ShareImage | undefined {
  const name = image?.src.match(SHARE_SOURCE_RE)?.[1]
  return image && name ? { path: `/images/chia-se/${name}.jpg`, alt: image.alt } : undefined
}

const organizationRef = (): JsonLdObject => ({
  '@type': 'Organization',
  name: BRAND.name,
  url: pageUrl('/'),
  logo: absoluteUrl(LOGO_PATH),
})

/** Trang chủ: thông tin doanh nghiệp và tên web */
export function organizationLd(): JsonLdObject[] {
  return [
    {
      '@context': CONTEXT,
      ...organizationRef(),
      legalName: BRAND.company,
      slogan: BRAND.slogan,
      email: CONTACT.email,
      // tel:0988832072 → +84988832072
      telephone: CONTACT.hotlineTel.replace(/^tel:0/, '+84'),
      sameAs: SOCIAL_LINKS.filter((s) => s.id !== 'zalo').map((s) => s.url),
    },
    { '@context': CONTEXT, '@type': 'WebSite', name: BRAND.name, url: pageUrl('/'), inLanguage: 'vi' },
  ]
}

export interface BreadcrumbItem {
  name: string
  /** Đường link (có thể kèm tham số lọc); mục cuối là trang đang xem */
  path: string
}

/** Đường dẫn "Trang chủ / … / trang đang xem": Google hiện thay cho link dài trong kết quả tìm kiếm */
export function breadcrumbLd(items: readonly BreadcrumbItem[]): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Trang chủ', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.path.includes('?') ? absoluteUrl(item.path) : pageUrl(item.path),
    })),
  }
}

export interface ProductLdInput {
  name: string
  description: string
  path: string
  image?: ImageSource
  sku?: string
  min: number
  max: number
  /** Chỉ ghi khi biết chắc (phối màu có dữ liệu hết hàng theo kích thước); sản phẩm lẻ chưa có dữ liệu tồn kho */
  isInStock?: boolean
}

/** Sản phẩm kèm giá VND: một giá thì Offer, nhiều kích thước thì khoảng giá (AggregateOffer) */
export function productLd({ name, description, path, image, sku, min, max, isInStock }: ProductLdInput): JsonLdObject {
  const url = pageUrl(path)
  const availability =
    isInStock === undefined ? {} : { availability: `${CONTEXT}/${isInStock ? 'InStock' : 'OutOfStock'}` }
  // Chưa có giá (min = 0, báo giá khi gọi): không ghi offers, để Google không hiện giá 0đ
  const offers =
    min <= 0
      ? undefined
      : min === max
        ? { '@type': 'Offer', price: min, priceCurrency: 'VND', url, ...availability }
        : { '@type': 'AggregateOffer', lowPrice: min, highPrice: max, priceCurrency: 'VND', url, ...availability }
  return {
    '@context': CONTEXT,
    '@type': 'Product',
    name,
    description,
    url,
    ...(image ? { image: absoluteUrl(image.src) } : {}),
    ...(sku ? { sku } : {}),
    brand: { '@type': 'Brand', name: BRAND.name },
    ...(offers ? { offers } : {}),
  }
}

/** Trang Hỏi đáp: mỗi câu hỏi một Question, các đoạn trả lời nối thành một câu trả lời */
export function faqLd(faqs: readonly Faq[]): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a.join(' ') },
    })),
  }
}

export interface ArticleLdInput {
  title: string
  description: string
  path: string
  image: ImageSource
}

/**
 * Bài viết. Chưa có ngày đăng: bài trong src/data/posts.ts là bài mẫu; ngày đăng thật lấy từ WordPress ở giai đoạn 3.
 */
export function articleLd({ title, description, path, image }: ArticleLdInput): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: title,
    description,
    image: absoluteUrl(image.src),
    inLanguage: 'vi',
    mainEntityOfPage: pageUrl(path),
    author: organizationRef(),
    publisher: organizationRef(),
  }
}
