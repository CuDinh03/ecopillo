import { liveHidden } from './liveData'
import wordpressIndex from './bai-viet-wp/danh-sach.json'
import { LIVE_POSTS, type LivePost } from './livePosts'
import { CODE_POST_SLUGS, POSTS, type Post } from './posts'
import { isPostSection, POST_SECTIONS, SECTION_LABELS, type PostLabel } from './postSections'

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

/**
 * Nhóm của bài: ô "Mục trên web" Ecopillo chọn trong WordPress > bảng xếp sẵn (postSections.ts) > chuyên mục WordPress.
 * Chủ đề Ecopillo đã xoá ở Nội dung web thì theo chuyên mục WordPress
 */
const labelOf = (slug: string, fallback: PostLabel, chosen?: string): PostLabel => {
  const section = chosen ?? POST_SECTIONS[slug]
  return (section && isPostSection(section) && SECTION_LABELS[section]) || fallback
}

const WORDPRESS_POSTS: readonly Post[] = (wordpressIndex as readonly WordPressEntry[]).map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  excerpt: entry.excerpt,
  category: labelOf(entry.slug, entry.category),
  readMinutes: entry.readMinutes,
  cover: entry.cover ? { src: entry.cover.src, srcSet: entry.cover.srcSet, alt: entry.cover.alt } : { ...FALLBACK_COVER, alt: entry.title },
  body: [],
  wp: { date: entry.date, modified: entry.modified, metaTitle: entry.metaTitle, description: entry.description },
}))

/** Bài Ecopillo đăng mới / sửa trong WordPress sau lần dựng (livePosts.ts) */
const livePost = (entry: LivePost): Post => ({
  slug: entry.slug,
  title: entry.title,
  excerpt: entry.excerpt,
  category: labelOf(entry.slug, entry.category, entry.section),
  readMinutes: entry.readMinutes,
  cover: entry.cover ?? { ...FALLBACK_COVER, alt: entry.title },
  body: [],
  wp: { date: entry.date, modified: entry.modified, metaTitle: entry.title, description: entry.description, live: true },
  ...(entry.topics?.length ? { topics: entry.topics } : {}),
})

// Cả bài dựng sẵn đã ẩn: bài WordPress trùng tên không hiện thay
const CODE_SLUGS = new Set(CODE_POST_SLUGS)
const LIVE = LIVE_POSTS.filter((p) => !CODE_SLUGS.has(p.slug) && !p.isPage).map(livePost)
/** Trang Ecopillo tự tạo (đợt G): mở được ở link của nó, không nằm trong Tin tức, tìm bài, bài liên quan */
const OWN_PAGES: readonly Post[] = LIVE_POSTS.filter((p) => p.isPage && !CODE_SLUGS.has(p.slug)).map((p) => ({
  ...livePost(p),
  isPage: true,
  // Kiểu "Trang chính sách" (đợt I): ArticlePage vẽ trong khung trang chính sách
  ...(p.isPolicyPage ? { isPolicyPage: true } : {}),
}))
const LIVE_SLUGS = new Set(LIVE.map((p) => p.slug))

/** Bài WordPress: bản sửa trong WordPress thay bản lúc dựng; bài mới (chưa có lúc dựng) lên đầu, mới nhất trước */
const MERGED_WORDPRESS: readonly Post[] = [
  ...LIVE.filter((p) => !WORDPRESS_POSTS.some((w) => w.slug === p.slug)).sort((a, b) => (b.wp?.date ?? '').localeCompare(a.wp?.date ?? '')),
  ...WORDPRESS_POSTS.map((w) => (LIVE_SLUGS.has(w.slug) ? (LIVE.find((p) => p.slug === w.slug) ?? w) : w)),
]

/**
 * Bài trong code đứng đầu (bài chọn lọc), sau đó bài WordPress mới nhất trước. Bài có sẵn Ecopillo đã gỡ trong WordPress
 * (nháp, riêng tư, thùng rác, xoá hẳn: đợt E2, plugin an-xoa.php) thì bỏ; link bài chuyển về trang Tin tức (máy chủ trả 301).
 * Bài dựng sẵn: POSTS đã bỏ bài Ecopillo ẩn ở Nội dung web, mục của bài lấy từ ô "Mục trên web" ở đó (gốc theo bảng postSections.ts).
 */
const HIDDEN_POSTS = liveHidden().bai
export const ALL_POSTS: readonly Post[] = [
  ...POSTS,
  ...MERGED_WORDPRESS,
].filter((p) => !HIDDEN_POSTS.has(p.slug))

export const anyPostBySlug = (slug: string | undefined): Post | undefined =>
  ALL_POSTS.find((p) => p.slug === slug) ?? OWN_PAGES.find((p) => p.slug === slug)

/** Ngày đăng kiểu Việt Nam: "08/11/2025" */
export const formatPostDate = (iso: string): string => iso.split('-').reverse().join('/')
