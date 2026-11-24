import { PATHS } from './links'
import { chu, definePageText, doan } from './pageText/define'

/**
 * Danh sách trang chính sách cho menu, chân trang và bộ định tuyến. Tách riêng khỏi policies.ts
 * để phần chữ dài của từng chính sách chỉ tải khi khách mở trang đó.
 * Đường link giữ đúng như web cũ (owner chốt 15/10/2026); chỉ "Hướng dẫn mua hàng" là trang mới.
 * `label` ở đây là chữ gốc; chữ đang hiện (Ecopillo sửa ở Nội dung web) lấy từ POLICY_NAV.
 */
export const POLICY_PAGES = [
  { slug: 'huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
  { slug: 'chinh-sach-van-chuyen', label: 'Giao hàng' },
  { slug: 'chinh-sach-thanh-toan', label: 'Thanh toán' },
  { slug: 'chinh-sach-doi-tra-hang-va-hoan-tien', label: 'Kiểm hàng, đổi hàng' },
  { slug: 'chinh-sach-bao-hanh-san-pham', label: 'Bảo hành' },
] as const

export type PolicySlug = (typeof POLICY_PAGES)[number]['slug']

export const policyPath = (slug: string): string => `/${slug}/`

const labelOf = (slug: PolicySlug): string => POLICY_PAGES.find((p) => p.slug === slug)?.label ?? slug

/** Tên các trang chính sách trên menu chính sách, chân trang, Hỏi đáp, ô tìm, "Khám phá thêm" */
export const { set: POLICY_NAV_TEXT_SET, text: POLICY_NAV_TEXT } = definePageText(
  'menu-chinh-sach',
  'Menu chính sách',
  'Tên ngắn của các trang chính sách trên menu bên trái trang chính sách, cột "Chính sách" ở chân trang, trang Hỏi đáp, ô tìm; tiêu đề, mô tả Google của link cũ "Chính sách kiểm tra hàng". Tiêu đề lớn của từng trang sửa ở mục chính sách.',
  {
    huongDan: chu('Hướng dẫn mua hàng', labelOf('huong-dan-mua-hang')),
    giaoHang: chu('Chính sách vận chuyển', labelOf('chinh-sach-van-chuyen')),
    thanhToan: chu('Chính sách thanh toán', labelOf('chinh-sach-thanh-toan')),
    doiHang: chu('Chính sách đổi trả, kiểm hàng', labelOf('chinh-sach-doi-tra-hang-va-hoan-tien')),
    baoHanh: chu('Chính sách bảo hành', labelOf('chinh-sach-bao-hanh-san-pham')),
    baoMat: chu('Chính sách bảo vệ thông tin cá nhân', 'Bảo vệ thông tin cá nhân'),
    tieuDeMenu: chu('Trang chính sách: tiêu đề menu bên trái', 'Các chính sách'),
    duongDan: chu('Trang chính sách: mục giữa của đường dẫn "Trang chủ / … / tên trang"', 'Chính sách'),
    kiemTraHangTieuDe: chu(
      'Trang "Chính sách kiểm tra hàng" (link cũ /chinh-sach-kiem-tra-hang/): tiêu đề',
      'Chính sách kiểm tra hàng',
      'Trang này hiện nội dung trang Kiểm hàng, đổi hàng; chỉ tiêu đề và mô tả Google là riêng.',
    ),
    kiemTraHangMoTa: doan(
      'Trang "Chính sách kiểm tra hàng": mô tả trên Google',
      'Quý khách được kiểm hàng khi nhận, trải nghiệm chăn ga tại nhà. Có lỗi thì báo Ecopillo trong 24 giờ, gửi đổi trong 7 ngày.',
    ),
  },
)

/**
 * Web cũ có riêng trang "Chính sách kiểm tra hàng"; web mới gộp kiểm hàng vào trang đổi hàng.
 * Link cũ vẫn mở đúng nội dung đó (không chuyển hướng), tiêu đề giữ như web cũ.
 * `description`: mô tả Google riêng để không trùng với trang gốc (08/11/2026). Tiêu đề, mô tả Ecopillo sửa ở bộ "Menu chính sách".
 */
export const POLICY_ALIASES: Readonly<Record<string, { slug: PolicySlug; title: string; description?: string }>> = {
  'chinh-sach-kiem-tra-hang': {
    slug: 'chinh-sach-doi-tra-hang-va-hoan-tien',
    title: POLICY_NAV_TEXT.kiemTraHangTieuDe,
    description: POLICY_NAV_TEXT.kiemTraHangMoTa,
  },
}

const LIVE_LABELS: Readonly<Record<PolicySlug, string>> = {
  'huong-dan-mua-hang': POLICY_NAV_TEXT.huongDan,
  'chinh-sach-van-chuyen': POLICY_NAV_TEXT.giaoHang,
  'chinh-sach-thanh-toan': POLICY_NAV_TEXT.thanhToan,
  'chinh-sach-doi-tra-hang-va-hoan-tien': POLICY_NAV_TEXT.doiHang,
  'chinh-sach-bao-hanh-san-pham': POLICY_NAV_TEXT.baoHanh,
}

/** Các trang chính sách (không gồm trang bảo vệ thông tin) với tên đang hiện */
export const POLICY_PAGE_LINKS: readonly { slug: PolicySlug; to: string; label: string }[] = POLICY_PAGES.map((p) => ({
  slug: p.slug,
  to: policyPath(p.slug),
  label: LIVE_LABELS[p.slug],
}))

/** Menu chính sách: các trang trên + trang bảo vệ thông tin (trang riêng) */
export const POLICY_NAV: readonly { to: string; label: string }[] = [
  ...POLICY_PAGE_LINKS.map(({ to, label }) => ({ to, label })),
  { to: PATHS.privacy, label: POLICY_NAV_TEXT.baoMat },
]
