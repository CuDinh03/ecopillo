import { PATHS } from './links'

/**
 * Danh sách trang chính sách cho menu, chân trang và bộ định tuyến. Tách riêng khỏi policies.ts
 * để phần chữ dài của từng chính sách chỉ tải khi khách mở trang đó.
 * Đường link giữ đúng như web cũ (owner chốt 15/10/2026); chỉ "Hướng dẫn mua hàng" là trang mới.
 */
export const POLICY_PAGES = [
  { slug: 'huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
  { slug: 'chinh-sach-van-chuyen', label: 'Giao hàng' },
  { slug: 'chinh-sach-thanh-toan', label: 'Thanh toán' },
  { slug: 'chinh-sach-doi-tra-hang-va-hoan-tien', label: 'Kiểm hàng, đổi hàng' },
  { slug: 'chinh-sach-bao-hanh-san-pham', label: 'Bảo hành' },
] as const

export type PolicySlug = (typeof POLICY_PAGES)[number]['slug']

/**
 * Web cũ có riêng trang "Chính sách kiểm tra hàng"; web mới gộp kiểm hàng vào trang đổi hàng.
 * Link cũ vẫn mở đúng nội dung đó (không chuyển hướng), tiêu đề giữ như web cũ.
 * `description`: mô tả Google riêng để không trùng với trang gốc (08/11/2026, chờ Ecopillo duyệt).
 */
export const POLICY_ALIASES: Readonly<Record<string, { slug: PolicySlug; title: string; description?: string }>> = {
  'chinh-sach-kiem-tra-hang': {
    slug: 'chinh-sach-doi-tra-hang-va-hoan-tien',
    title: 'Chính sách kiểm tra hàng',
    description: 'Quý khách được kiểm hàng, trải thử khi nhận. Có lỗi thì báo Ecopillo trong 24 giờ, gửi đổi trong 7 ngày.',
  },
}

export const policyPath = (slug: string): string => `/${slug}/`

/** Menu chính sách: các trang trên + trang bảo vệ thông tin (trang riêng) */
export const POLICY_NAV: readonly { to: string; label: string }[] = [
  ...POLICY_PAGES.map((p) => ({ to: policyPath(p.slug), label: p.label })),
  { to: PATHS.privacy, label: 'Bảo vệ thông tin cá nhân' },
]
