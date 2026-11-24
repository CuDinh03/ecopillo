import { liveList, type EditableField } from './liveContent'

/**
 * Các trang chính sách có sẵn và trang nào Ecopillo đã ẩn. Tách riêng khỏi policyNav.ts (nhập links.ts) và policies.ts (chữ dài)
 * để links.ts (hiddenPageTarget) đọc được mà không vòng import, như codePostKeys.ts.
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

/** Link cũ của web cũ mở nội dung một trang chính sách (policyNav.ts POLICY_ALIASES): trang đó ẩn thì link này cũng chuyển */
export const POLICY_ALIAS_OF: Readonly<Record<string, PolicySlug>> = {
  'chinh-sach-kiem-tra-hang': 'chinh-sach-doi-tra-hang-va-hoan-tien',
}

/** Bộ "Đầu các trang chính sách" (policies.ts POLICY_HEAD_SET); plugin trang-wp.php eco_tw_policy_hidden đọc cùng khoá */
export const POLICY_HEAD_KEY = 'chinh-sach-dau-trang'

/** Ô chọn trang của mỗi dòng (trước 24/11/2026 là mã ẩn của dòng, cùng giá trị) */
export const POLICY_PAGE_FIELD: EditableField = {
  khoa: 'slug',
  nhan: 'Trang',
  kieu: 'chon',
  batBuoc: true,
  luaChon: POLICY_PAGES.map((p) => p.slug),
  nhanLuaChon: POLICY_PAGES.map((p) => `${p.label} (/${p.slug}/)`),
  goiY: 'Mỗi trang một dòng. Xoá dòng của một trang cũng là ẩn trang đó; thêm lại dòng và chọn trang là trang hiện lại.',
}

export const POLICY_SHOW_FIELD: EditableField = {
  khoa: 'hien',
  nhan: 'Trên web',
  kieu: 'chon',
  batBuoc: true,
  luaChon: ['co', 'khong'],
  nhanLuaChon: ['Hiện', 'Ẩn'],
  goiY: 'Ẩn: trang không còn ở menu chính sách, chân trang, ô tìm, sơ đồ trang cho Google; link trang chuyển (301) về trang Hỏi đáp.',
}

interface PolicyShowRow {
  slug: string
  hien: string
}

/**
 * Trang đang hiện theo bản Ecopillo đã lưu (dòng trên thắng khi hai dòng cùng trang). Chưa lưu: mọi trang hiện.
 * Đã lưu mà không còn dòng của một trang: trang đó ẩn.
 */
const SHOWN: ReadonlySet<string> = (() => {
  const rows = liveList<PolicyShowRow>(
    POLICY_HEAD_KEY,
    POLICY_PAGES.map((p) => ({ slug: p.slug, hien: 'co' })),
    [POLICY_PAGE_FIELD, POLICY_SHOW_FIELD],
    () => ({ slug: '', hien: 'co' }),
  )
  const seen = new Map<string, string>()
  for (const row of rows) if (!seen.has(row.slug)) seen.set(row.slug, row.hien)
  return new Set([...seen].filter(([, hien]) => hien !== 'khong').map(([slug]) => slug))
})()

/** Trang chính sách có sẵn (hoặc link cũ của nó) Ecopillo đã ẩn; tên lạ thì luôn false */
export const isPolicyHidden = (slug: string): boolean => {
  const target = POLICY_ALIAS_OF[slug] ?? slug
  return POLICY_PAGES.some((p) => p.slug === target) && !SHOWN.has(target)
}
