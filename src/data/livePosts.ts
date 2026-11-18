/**
 * Bài viết Ecopillo đăng mới hoặc sửa trong WordPress sau lần dựng web (giai đoạn 4b, anh Quang 18/11/2026:
 * "thêm sp mới và bài viết mới là nhiệm vụ của bên anh"). Kế hoạch: docs/ke-hoach-khach-tu-sua-du-lieu.md.
 *
 * Plugin (trien-khai/wordpress-plugin/ecopillo-giao-dien-moi/bai-viet-moi.php) ghi danh sách vào du-lieu.js (`window.__ECO_BAI__`)
 * và thân bài (HTML đã lọc thẻ, đã đổi chữ chất liệu cũ) vào /wp-content/uploads/ecopillo-du-lieu/bai/<tên>.json.
 * allPosts.ts ghép danh sách vào trang Tin tức; WordPressBody.tsx nạp thân bài khi mở bài.
 * main.tsx chỉ hỏi có bài nào không (để vẽ lại trang Tin tức, trang bài viết dựng sẵn).
 */

export interface LivePost {
  slug: string
  title: string
  excerpt: string
  description: string
  category: 'Tin tức' | 'Cẩm nang'
  date: string
  modified: string
  readMinutes: number
  cover: { src: string; srcSet: string; alt: string } | null
}

const DATE = /^\d{4}-\d{2}-\d{2}$/
const text = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isUrl = (v: unknown): v is string => typeof v === 'string' && /^(https?:\/\/|\/(?!\/))/.test(v) && !/[\s<>"]/.test(v)

function clean(input: unknown): LivePost | undefined {
  if (!input || typeof input !== 'object') return undefined
  const v = input as Record<string, unknown>
  const slug = typeof v.duongDan === 'string' && /^[a-z0-9-]{3,200}$/.test(v.duongDan) ? v.duongDan : ''
  const title = text(v.tieuDe, 200)
  const date = typeof v.ngay === 'string' && DATE.test(v.ngay) ? v.ngay : ''
  if (!slug || !title || !date) return undefined
  const cover = v.anh && typeof v.anh === 'object' ? (v.anh as Record<string, unknown>) : null
  return {
    slug,
    title,
    excerpt: text(v.tomTat, 400),
    description: text(v.moTa, 160) || text(v.tomTat, 155),
    category: v.loai === 'Tin tức' ? 'Tin tức' : 'Cẩm nang',
    date,
    modified: typeof v.sua === 'string' && DATE.test(v.sua) ? v.sua : date,
    readMinutes: typeof v.phut === 'number' && v.phut > 0 && v.phut < 120 ? Math.round(v.phut) : 3,
    cover:
      cover && isUrl(cover.src)
        ? { src: cover.src, srcSet: typeof cover.srcSet === 'string' && !/[<>"]/.test(cover.srcSet) ? cover.srcSet : '', alt: text(cover.alt, 300) || title }
        : null,
  }
}

const raw = (): unknown => (typeof window === 'undefined' ? undefined : (window as { __ECO_BAI__?: unknown }).__ECO_BAI__)

export const LIVE_POSTS: readonly LivePost[] = (() => {
  const list = raw()
  return Array.isArray(list) ? list.slice(0, 200).map(clean).filter((p): p is LivePost => !!p) : []
})()

/** Đường dẫn file thân bài plugin ghi */
export const livePostBodyUrl = (slug: string): string => `/wp-content/uploads/ecopillo-du-lieu/bai/${slug}.json`
