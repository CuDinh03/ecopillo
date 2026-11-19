import { ALL_POSTS } from './allPosts'
import type { ImageSource } from './catalog'
import { LISTINGS, PATHS } from './links'
import { POLICY_NAV } from './policyNav'
import { postPath } from './posts'
import { priceLabel, productPath, PRODUCTS, type CategoryId } from './products'

/**
 * Những gì thanh tìm kiếm tìm được (owner chọn B ngày 19/11/2026). Chỉ nạp khi khách mở ô tìm (SiteSearch.tsx gọi import()),
 * vì danh sách bài viết nặng. Sản phẩm, bài viết Ecopillo đăng mới trong WordPress đã nằm trong PRODUCTS, ALL_POSTS nên tự có.
 */

export type SearchKind = 'san-pham' | 'trang' | 'bai-viet'

export interface SearchEntry {
  kind: SearchKind
  title: string
  to: string
  /** Dòng phụ: giá (sản phẩm), loại trang */
  meta?: string
  image?: ImageSource
  keywords?: string
  /** Trừ điểm: sản phẩm chưa có ảnh xếp sau sản phẩm cùng mức khớp */
  penalty?: number
}

/** Trang không phải danh mục. Từ khoá: chữ khách hay gõ khi tìm trang đó */
const PAGES: readonly { title: string; to: string; keywords: string }[] = [
  { title: 'Liên hệ mua hàng', to: PATHS.contact, keywords: 'điểm bán đại lý cửa hàng showroom địa chỉ hệ thống phân phối số điện thoại hotline' },
  { title: 'Đặt hàng online', to: PATHS.order, keywords: 'mua online đặt mua giỏ hàng' },
  { title: 'Giới thiệu Ecopillo', to: PATHS.about, keywords: 'về chúng tôi công ty câu chuyện thương hiệu' },
  { title: 'Khách sạn & dự án', to: PATHS.hotel, keywords: 'khách sạn nhà nghỉ homestay resort dự án' },
  { title: 'Đăng ký mở đại lý', to: PATHS.recruit, keywords: 'tuyển đại lý hợp tác nhượng quyền kinh doanh' },
  { title: 'Quà tặng và sự kiện', to: PATHS.gifts, keywords: 'quà tặng doanh nghiệp quà tết quà cưới sự kiện tri ân' },
  { title: 'Tin tức', to: PATHS.blog, keywords: 'bài viết cẩm nang' },
  { title: 'Hỏi đáp', to: PATHS.faq, keywords: 'câu hỏi thường gặp' },
]

const POLICY_KEYWORDS: Readonly<Record<string, string>> = {
  'Hướng dẫn mua hàng': 'cách mua đặt hàng',
  'Giao hàng': 'vận chuyển ship phí ship giao hàng miễn phí',
  'Thanh toán': 'chuyển khoản số tài khoản đặt cọc',
  'Kiểm hàng, đổi hàng': 'đổi trả hoàn tiền kiểm tra hàng',
  'Bảo hành': 'đổi mới sửa chữa',
  'Bảo vệ thông tin cá nhân': 'bảo mật quyền riêng tư',
}

/** Chữ của nhóm để tìm (không dùng nhãn "Đệm & topper": gõ "topper" sẽ ra mọi đệm) */
const CATEGORY_WORDS: Readonly<Record<CategoryId, string>> = {
  'bo-chan-ga': 'bộ chăn ga gối',
  chan: 'chăn',
  goi: 'gối',
  dem: 'đệm',
}

const productEntries = (): SearchEntry[] =>
  PRODUCTS.map((p) => ({
    kind: 'san-pham',
    title: p.name,
    to: productPath(p),
    meta: priceLabel(p),
    image: p.image,
    // Nhóm (Chăn, Gối, Đệm…) và mã, màu từng mẫu: gõ "EV04" ra bộ Eco Vera
    keywords: [CATEGORY_WORDS[p.category], ...(p.collection?.patterns.flatMap((pt) => [pt.code, pt.colorName]) ?? [])].join(' '),
    penalty: p.image ? 0 : 8,
  }))

const pageEntries = (): SearchEntry[] => [
  ...Object.entries(LISTINGS).map(([to, listing]) => ({ kind: 'trang' as const, title: listing.title, to, meta: 'Danh mục sản phẩm' })),
  ...PAGES.map((page) => ({ kind: 'trang' as const, ...page })),
  ...POLICY_NAV.map((p) => ({ kind: 'trang' as const, title: p.label, to: p.to, meta: 'Chính sách', keywords: `chính sách ${POLICY_KEYWORDS[p.label] ?? ''}` })),
]

const postEntries = (): SearchEntry[] =>
  ALL_POSTS.map((post) => ({ kind: 'bai-viet', title: post.title, to: postPath(post), meta: post.category, image: post.cover }))

export const SEARCH_INDEX: readonly SearchEntry[] = [...productEntries(), ...pageEntries(), ...postEntries()]

/** Gợi ý khi ô tìm còn trống */
export const SEARCH_SUGGESTIONS: readonly string[] = ['Đệm lò xo', 'Ruột gối', 'Chăn hè', 'Bộ chăn ga', 'Topper', 'Divan']
