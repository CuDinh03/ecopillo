/**
 * Danh sách trang chính sách cho menu, chân trang và bộ định tuyến. Tách riêng khỏi policies.ts
 * để phần chữ dài của từng chính sách chỉ tải khi khách mở trang đó.
 */
export const POLICY_PAGES = [
  { slug: 'huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
  { slug: 'chinh-sach-giao-hang', label: 'Giao hàng' },
  { slug: 'chinh-sach-thanh-toan', label: 'Thanh toán' },
  { slug: 'chinh-sach-doi-hang', label: 'Kiểm hàng, đổi hàng' },
  { slug: 'chinh-sach-bao-hanh', label: 'Bảo hành' },
] as const

export type PolicySlug = (typeof POLICY_PAGES)[number]['slug']

/** Menu chính sách: các trang trên + trang bảo vệ thông tin (trang riêng) */
export const POLICY_NAV: readonly { to: string; label: string }[] = [
  ...POLICY_PAGES.map((p) => ({ to: `/${p.slug}`, label: p.label })),
  { to: '/chinh-sach-bao-mat', label: 'Bảo vệ thông tin cá nhân' },
]
