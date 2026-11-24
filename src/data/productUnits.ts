import { liveObject, type EditableField, type EditableSet } from './liveContent'
import { ALL_PRODUCTS, productKind } from './products'

/**
 * Đơn vị đếm của nhóm Đệm & topper khi đặt hàng (owner 24/11/2026: "khách tự sửa mọi chi tiết").
 * Cả nhóm (mã nhóm 'dem') tính "tấm"; sản phẩm tích ở đây tính "chiếc" (topper, bảo vệ đệm, divan).
 * Trước đây web đoán theo tên ("Đệm …" là tấm): Ecopillo đổi tên trong WooCommerce thì đơn vị đổi theo. Nay theo mã sản phẩm.
 * Gốc: sản phẩm của nhóm có link không bắt đầu bằng "dem-" (đúng bằng cách đoán theo tên cũ với mọi sản phẩm trong code).
 * Chữ "tấm", "chiếc" sửa ở bộ "Đặt hàng: tóm tắt đơn".
 */

const MATTRESS_GROUP = ALL_PRODUCTS.filter((p) => productKind(p) === 'dem')

const FIELDS: readonly EditableField[] = [
  {
    khoa: 'tinhChiec',
    nhan: 'Sản phẩm tính "chiếc"',
    kieu: 'chon-nhieu',
    luaChon: MATTRESS_GROUP.map((p) => p.slug),
    nhanLuaChon: MATTRESS_GROUP.map((p) => p.name),
    goiY: 'Sản phẩm không tích tính "tấm" (đệm). Sản phẩm mới đăng trong WooCommerce vào nhóm đệm tính "tấm" cho tới khi tích ở đây.',
  },
]

const BASE = { tinhChiec: MATTRESS_GROUP.filter((p) => !p.slug.startsWith('dem-')).map((p) => p.slug) }

export const PRODUCT_UNIT_SET: EditableSet = {
  khoa: 'don-vi-dem',
  nhom: 'Sản phẩm',
  ten: 'Đơn vị đếm nhóm Đệm & topper',
  moTa: 'Khi đặt hàng, đệm tính "tấm", còn topper, bảo vệ đệm, divan tính "chiếc". Tích các sản phẩm tính "chiếc".',
  kieu: 'mot',
  goc: BASE,
  truong: FIELDS,
}

const LIVE: { tinhChiec?: readonly string[] } = liveObject(PRODUCT_UNIT_SET.khoa, BASE, FIELDS)
const BY_PIECE = new Set(LIVE.tinhChiec ?? [])

/** Sản phẩm lẻ nhóm Đệm & topper tính "tấm" (đệm); mọi sản phẩm khác tính "chiếc". Theo nhóm gốc (Ecopillo chuyển nhóm không đổi đơn vị) */
export const countsBySheet = (product: { slug: string; category: string; baseCategory?: string }): boolean =>
  (product.baseCategory ?? product.category) === 'dem' && !BY_PIECE.has(product.slug)
