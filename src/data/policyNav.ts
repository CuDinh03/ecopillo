import { PATHS } from './links'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import { chu, definePageText, doan, legacyPageText } from './pageText/define'

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

const PRIVACY_LABEL = 'Bảo vệ thông tin cá nhân'

/** Ô tên cũ của từng trang (bộ "Menu chính sách" trước 24/11/2026) */
const LABEL_KEY: Readonly<Record<PolicySlug, 'huongDan' | 'giaoHang' | 'thanhToan' | 'doiHang' | 'baoHanh'>> = {
  'huong-dan-mua-hang': 'huongDan',
  'chinh-sach-van-chuyen': 'giaoHang',
  'chinh-sach-thanh-toan': 'thanhToan',
  'chinh-sach-doi-tra-hang-va-hoan-tien': 'doiHang',
  'chinh-sach-bao-hanh-san-pham': 'baoHanh',
}

/** Chữ chung của khung trang chính sách và link cũ "Chính sách kiểm tra hàng". Tên, thứ tự các trang trên menu: bộ "Menu chính sách: các trang" */
export const { set: POLICY_NAV_TEXT_SET, text: POLICY_NAV_TEXT } = definePageText(
  'menu-chinh-sach',
  'Menu chính sách',
  'Tiêu đề menu bên trái trang chính sách, mục giữa của đường dẫn; tiêu đề, mô tả Google của link cũ "Chính sách kiểm tra hàng". Tên, thứ tự các trang trên menu sửa ở bộ "Menu chính sách: các trang"; tiêu đề lớn của từng trang sửa ở mục chính sách.',
  {
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

/** Tên ngắn Ecopillo đã sửa ở các ô cũ của bộ "Menu chính sách" (trước 24/11/2026): làm tên ban đầu của danh sách mới */
const LEGACY_LABELS = legacyPageText('menu-chinh-sach', {
  huongDan: chu('', labelOf('huong-dan-mua-hang')),
  giaoHang: chu('', labelOf('chinh-sach-van-chuyen')),
  thanhToan: chu('', labelOf('chinh-sach-thanh-toan')),
  doiHang: chu('', labelOf('chinh-sach-doi-tra-hang-va-hoan-tien')),
  baoHanh: chu('', labelOf('chinh-sach-bao-hanh-san-pham')),
  baoMat: chu('', PRIVACY_LABEL),
})

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

interface PolicyNavRow {
  label: string
  to: string
}

const NAV_FIELDS: readonly EditableField[] = [
  { khoa: 'label', nhan: 'Tên trên menu', kieu: 'chu', batBuoc: true },
  {
    khoa: 'to',
    nhan: 'Link trang',
    kieu: 'link',
    batBuoc: true,
    goiY: 'Chỉ trang trong web, ví dụ /chinh-sach-van-chuyen/. Trang chính sách mới: tạo Trang trong WordPress, tích "Hiện trang này bằng giao diện mới", rồi dán đường dẫn trang đó vào đây.',
  },
]

const navRows = (labels: Readonly<Record<string, string>>): readonly PolicyNavRow[] => [
  { label: labels.huongDan, to: policyPath('huong-dan-mua-hang') },
  { label: labels.giaoHang, to: policyPath('chinh-sach-van-chuyen') },
  { label: labels.thanhToan, to: policyPath('chinh-sach-thanh-toan') },
  { label: labels.doiHang, to: policyPath('chinh-sach-doi-tra-hang-va-hoan-tien') },
  { label: labels.baoHanh, to: policyPath('chinh-sach-bao-hanh-san-pham') },
  { label: labels.baoMat, to: PATHS.privacy },
]

const BASE_LABELS = {
  huongDan: labelOf('huong-dan-mua-hang'),
  giaoHang: labelOf('chinh-sach-van-chuyen'),
  thanhToan: labelOf('chinh-sach-thanh-toan'),
  doiHang: labelOf('chinh-sach-doi-tra-hang-va-hoan-tien'),
  baoHanh: labelOf('chinh-sach-bao-hanh-san-pham'),
  baoMat: PRIVACY_LABEL,
}

/**
 * Menu chính sách (owner 24/11/2026, sau đợt G: "khách muốn tự chỉnh sửa toàn bộ web"): Ecopillo đổi tên, đổi thứ tự, bỏ trang
 * khỏi menu, thêm trang chính sách mới (Trang WordPress hiện bằng giao diện mới). Trang có sẵn bỏ khỏi menu vẫn mở được bằng link.
 */
export const POLICY_MENU_SET: EditableSet = {
  khoa: 'menu-chinh-sach-cac-trang',
  nhom: 'Trang chính sách',
  ten: 'Menu chính sách: các trang',
  moTa: 'Các trang trên menu bên trái trang chính sách, cột "Chính sách" ở chân trang, nút đầu trang Hỏi đáp và ô tìm: tên, link, thứ tự. Thêm trang chính sách mới, bỏ trang khỏi menu ở đây.',
  kieu: 'nhieu',
  goc: navRows(BASE_LABELS),
  tieuDeDong: 'label',
  coTheTrong: true,
  truong: NAV_FIELDS,
}

/** Menu chính sách đang hiện: các trang có sẵn + trang bảo vệ thông tin + trang Ecopillo thêm, theo thứ tự Ecopillo xếp */
export const POLICY_NAV: readonly PolicyNavRow[] = liveList<PolicyNavRow>(POLICY_MENU_SET.khoa, navRows(LEGACY_LABELS), NAV_FIELDS, () => ({
  label: '',
  to: '',
  // Menu chỉ dẫn tới trang trong web (bộ định tuyến); link ngoài, #khối thì bỏ dòng
})).filter((row) => row.to.startsWith('/') && !row.to.startsWith('//'))

const sameLink = (a: string, b: string): boolean => a.replace(/\/?$/, '/') === b.replace(/\/?$/, '/')

/** Các trang chính sách (không gồm trang bảo vệ thông tin) với tên đang hiện; trang Ecopillo bỏ khỏi menu dùng tên gốc */
export const POLICY_PAGE_LINKS: readonly { slug: PolicySlug; to: string; label: string }[] = POLICY_PAGES.map((p) => {
  const to = policyPath(p.slug)
  return { slug: p.slug, to, label: POLICY_NAV.find((n) => sameLink(n.to, to))?.label ?? LEGACY_LABELS[LABEL_KEY[p.slug]] }
})
