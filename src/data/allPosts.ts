import wordpressIndex from './bai-viet-wp/danh-sach.json'
import { POSTS, type Post } from './posts'

/**
 * Tất cả bài viết: 3 bài viết trong code (src/data/posts.ts) và bài lấy từ WordPress của web cũ (GĐ3, giữ nguyên link).
 * Bài WordPress lưu ở src/data/bai-viet-wp/ bằng `node tools/lay-bai-viet-wordpress.mjs` (làm sạch HTML, đổi chữ chất liệu cũ,
 * đổi link sang link mới). Danh sách nhẹ nằm ở đây; thân bài nạp riêng từng bài (components/blog/WordPressBody.tsx).
 *
 * Chỉ trang Tin tức, trang bài viết và bước dựng HTML dùng file này, để danh sách không vào gói chung của web.
 */

interface WordPressEntry {
  slug: string
  title: string
  metaTitle: string
  excerpt: string
  description: string
  category: 'Tin tức' | 'Cẩm nang'
  date: string
  modified: string
  readMinutes: number
  cover: { src: string; srcSet: string; alt: string } | null
}

const FALLBACK_COVER = { src: '/og-image.jpg', srcSet: '', alt: 'Ecopillo' }

const WORDPRESS_POSTS: readonly Post[] = (wordpressIndex as readonly WordPressEntry[]).map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  excerpt: entry.excerpt,
  category: entry.category,
  readMinutes: entry.readMinutes,
  cover: entry.cover ? { src: entry.cover.src, srcSet: entry.cover.srcSet, alt: entry.cover.alt } : { ...FALLBACK_COVER, alt: entry.title },
  body: [],
  wp: { date: entry.date, modified: entry.modified, metaTitle: entry.metaTitle, description: entry.description },
}))

/** Bài trong code đứng đầu (bài chọn lọc), sau đó bài WordPress mới nhất trước */
export const ALL_POSTS: readonly Post[] = [...POSTS, ...WORDPRESS_POSTS]

export const anyPostBySlug = (slug: string | undefined): Post | undefined => ALL_POSTS.find((p) => p.slug === slug)

/** Ngày đăng kiểu Việt Nam: "08/11/2025" */
export const formatPostDate = (iso: string): string => iso.split('-').reverse().join('/')
