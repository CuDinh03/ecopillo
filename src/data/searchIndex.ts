import { ALL_POSTS } from './allPosts'
import type { ImageSource } from './catalog'
import { LISTINGS, PATHS } from './links'
import { SEARCH_PAGES, SEARCH_TEXT } from './pageText/search'
import { postLabelText } from './pageText/miscLabels'
import { POLICY_NAV, policyPath } from './policyNav'
import { postPath } from './posts'
import { CATEGORIES, categoryLabel, categoryUrl, priceLabel, productPath, PRODUCTS } from './products'
import type { BuiltinCategoryId } from './productGroups'

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

/** Từ khoá thêm của từng trang chính sách (theo link, để Ecopillo đổi tên trang chính sách không mất từ khoá) */
const POLICY_KEYWORDS: Readonly<Record<string, string>> = {
  [policyPath('huong-dan-mua-hang')]: SEARCH_TEXT.tuHuongDan,
  [policyPath('chinh-sach-van-chuyen')]: SEARCH_TEXT.tuGiaoHang,
  [policyPath('chinh-sach-thanh-toan')]: SEARCH_TEXT.tuThanhToan,
  [policyPath('chinh-sach-doi-tra-hang-va-hoan-tien')]: SEARCH_TEXT.tuDoiHang,
  [policyPath('chinh-sach-bao-hanh-san-pham')]: SEARCH_TEXT.tuBaoHanh,
  [PATHS.privacy]: SEARCH_TEXT.tuBaoMat,
}

/** Chữ của nhóm để tìm (không dùng nhãn "Đệm & topper": gõ "topper" sẽ ra mọi đệm). Nhóm Ecopillo thêm: tên nhóm */
const CATEGORY_WORDS: Readonly<Record<BuiltinCategoryId, string>> = {
  'bo-chan-ga': SEARCH_TEXT.tuNhomBoChanGa,
  chan: SEARCH_TEXT.tuNhomChan,
  goi: SEARCH_TEXT.tuNhomGoi,
  dem: SEARCH_TEXT.tuNhomDem,
}

const productEntries = (): SearchEntry[] =>
  PRODUCTS.map((p) => ({
    kind: 'san-pham',
    title: p.name,
    to: productPath(p),
    meta: priceLabel(p),
    image: p.image,
    // Nhóm (Chăn, Gối, Đệm…) và mã, màu từng mẫu: gõ "EV04" ra bộ Eco Vera
    keywords: [(CATEGORY_WORDS as Readonly<Record<string, string>>)[p.category] ?? categoryLabel(p.category), ...(p.collection?.patterns.flatMap((pt) => [pt.code, pt.colorName]) ?? [])].join(' '),
    penalty: p.image ? 0 : 8,
  }))

const pageEntries = (): SearchEntry[] => [
  // Nhóm đang hiện (bộ Nhóm sản phẩm): mở trang Sản phẩm lọc theo nhóm
  ...CATEGORIES.map((g) => ({ kind: 'trang' as const, title: g.label, to: categoryUrl(g.id), meta: SEARCH_TEXT.loaiNhom })),
  ...Object.entries(LISTINGS).map(([to, listing]) => ({ kind: 'trang' as const, title: listing.title, to, meta: SEARCH_TEXT.loaiDanhMuc })),
  // Trang khác: Nội dung web → Giao diện → Trang tìm được trong ô tìm (src/data/pageText/search.ts)
  ...SEARCH_PAGES.map((page) => ({ kind: 'trang' as const, title: page.ten, to: page.link, keywords: page.tuKhoa ?? '' })),
  ...POLICY_NAV.map((p) => ({
    kind: 'trang' as const,
    title: p.label,
    to: p.to,
    meta: SEARCH_TEXT.loaiChinhSach,
    keywords: `${SEARCH_TEXT.tuChinhSach} ${POLICY_KEYWORDS[p.to] ?? ''}`,
  })),
]

const postEntries = (): SearchEntry[] =>
  ALL_POSTS.map((post) => ({ kind: 'bai-viet', title: post.title, to: postPath(post), meta: postLabelText(post.category), image: post.cover }))

export const SEARCH_INDEX: readonly SearchEntry[] = [...productEntries(), ...pageEntries(), ...postEntries()]

/** Gợi ý khi ô tìm còn trống (Ecopillo sửa ở Nội dung web → Thanh tìm kiếm) */
export const SEARCH_SUGGESTIONS: readonly string[] = SEARCH_TEXT.goiY
