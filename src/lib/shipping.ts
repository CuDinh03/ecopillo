/**
 * Chính sách giao hàng của Ecopillo (biên bản chốt 12/10/2026, mục 35, 36, 50).
 * Thanh toán: từ 07/08/2026 chuyển khoản một tài khoản, có trường hợp đặt cọc (src/data/paymentPolicy.ts); bỏ COD tiền mặt.
 * - Miễn phí giao toàn quốc cho đơn từ 500.000đ; đơn nhỏ hơn phí giao 50.000đ.
 * - Thời gian: nội thành Hà Nội và nội thành TP. HCM giao trong ngày (chị Phương, Zalo 11/11/2026), phía Bắc 2–3 ngày, phía Nam 3–5 ngày.
 *   Ngoại thành hai thành phố không giao trong ngày: ngoại thành Hà Nội tính như phía Bắc, ngoại thành TP. HCM như phía Nam (Ecopillo xác nhận 11/11/2026).
 *
 * Ecopillo tự sửa mức miễn phí giao, phí giao và danh sách tỉnh theo vùng ở Nội dung web → "Giao hàng: tỉnh, phí" (SHIPPING_SET,
 * owner: khách sửa được 100% web). Chữ thời gian giao từng vùng sửa ở "Đặt hàng: tóm tắt đơn và cảm ơn" (ORDER_SUMMARY_TEXT).
 * Chữ chính sách, hỏi đáp, cam kết có ghi số tiền ("500.000đ", "50.000đ") là chữ Ecopillo tự sửa ở bộ của chúng: đổi mức thì sửa cả chữ đó.
 * Máy chủ nhận đơn (nhan-form.php) lưu tên tỉnh và phí giao web gửi lên, không tự tính lại.
 */

import { ORDER_SUMMARY_TEXT } from '../data/pageText/orderFlow'
import { PAGE_TEXT_GROUP } from '../data/pageText/define'
import { liveObject, type EditableField, type EditableSet } from '../data/liveContent'
import { slugify } from './slug'

export type Region = 'same-day' | 'north' | 'south'

export interface Province {
  id: string
  name: string
  region: Region
}

// 34 tỉnh, thành theo đơn vị hành chính từ 01/07/2025.
// Chính sách chỉ nêu "phía Bắc" và "phía Nam": tạm xếp Thanh Hoá – Hà Tĩnh vào phía Bắc,
// từ Quảng Trị trở vào áp thời gian phía Nam.
const SAME_DAY = ['Hà Nội (nội thành)', 'TP. Hồ Chí Minh (nội thành)']

const NORTH = [
  'Hà Nội (ngoại thành)',
  'Hải Phòng',
  'Quảng Ninh',
  'Bắc Ninh',
  'Hưng Yên',
  'Ninh Bình',
  'Phú Thọ',
  'Thái Nguyên',
  'Tuyên Quang',
  'Lào Cai',
  'Lạng Sơn',
  'Cao Bằng',
  'Điện Biên',
  'Lai Châu',
  'Sơn La',
  'Thanh Hóa',
  'Nghệ An',
  'Hà Tĩnh',
]

const SOUTH = [
  'TP. Hồ Chí Minh (ngoại thành)',
  'Quảng Trị',
  'Huế',
  'Đà Nẵng',
  'Quảng Ngãi',
  'Gia Lai',
  'Đắk Lắk',
  'Khánh Hòa',
  'Lâm Đồng',
  'Đồng Nai',
  'Tây Ninh',
  'Vĩnh Long',
  'Đồng Tháp',
  'An Giang',
  'Cần Thơ',
  'Cà Mau',
]

interface ShippingValues {
  mienPhiTu: number
  phiGiao: number
  tinhTrongNgay?: readonly string[]
  tinhPhiaBac?: readonly string[]
  tinhPhiaNam?: readonly string[]
}

const BASE: ShippingValues = {
  mienPhiTu: 500_000,
  phiGiao: 50_000,
  tinhTrongNgay: SAME_DAY,
  tinhPhiaBac: NORTH,
  tinhPhiaNam: SOUTH,
}

const PROVINCE_HINT =
  'Mỗi dòng một tỉnh / thành, theo thứ tự hiện trong ô chọn tỉnh ở trang Đặt hàng. Đổi tên một tỉnh là thành tỉnh mới (đơn đang soạn dở phải chọn lại).'

const FIELDS: readonly EditableField[] = [
  { khoa: 'mienPhiTu', nhan: 'Miễn phí giao cho đơn từ (đồng)', kieu: 'so', batBuoc: true, goiY: 'Ví dụ 500000. Đơn từ mức này trở lên không mất phí giao.' },
  { khoa: 'phiGiao', nhan: 'Phí giao đơn dưới mức trên (đồng)', kieu: 'so', batBuoc: true, goiY: 'Ví dụ 50000. Ghi 0 nếu miễn phí giao mọi đơn.' },
  { khoa: 'tinhTrongNgay', nhan: 'Tỉnh / thành giao trong ngày', kieu: 'ds-dong', goiY: PROVINCE_HINT },
  { khoa: 'tinhPhiaBac', nhan: 'Tỉnh / thành tính thời gian phía Bắc', kieu: 'ds-dong', goiY: PROVINCE_HINT },
  { khoa: 'tinhPhiaNam', nhan: 'Tỉnh / thành tính thời gian phía Nam', kieu: 'ds-dong', goiY: PROVINCE_HINT },
]

export const SHIPPING_SET: EditableSet = {
  khoa: 'giao-hang-tinh-phi',
  nhom: PAGE_TEXT_GROUP,
  ten: 'Giao hàng: tỉnh, phí',
  moTa:
    'Mức miễn phí giao, phí giao và các tỉnh / thành theo vùng (giao trong ngày, phía Bắc, phía Nam) của trang Đặt hàng. ' +
    'Chữ thời gian giao từng vùng sửa ở "Đặt hàng: tóm tắt đơn và cảm ơn"; câu có ghi số tiền ở chính sách, hỏi đáp, cam kết sửa ở bộ của chúng.',
  kieu: 'mot',
  goc: BASE,
  truong: FIELDS,
}

const LIVE = liveObject(SHIPPING_SET.khoa, BASE, FIELDS)

/** Số tiền Ecopillo nhập: số nguyên từ 0 tới 1 tỉ, sai thì dùng mức gốc */
const money = (value: number, fallback: number): number => (Number.isFinite(value) && value >= 0 && value <= 1_000_000_000 ? Math.round(value) : fallback)

export const FREE_SHIP_THRESHOLD = money(LIVE.mienPhiTu, BASE.mienPhiTu)
export const STANDARD_FEE = money(LIVE.phiGiao, BASE.phiGiao)

/** Mã tỉnh lấy từ tên (slugify), như trước: "Hà Nội (nội thành)" → "ha-noi-noi-thanh"; tên trùng mã thì giữ dòng đầu */
function buildProvinces(lists: readonly (readonly [readonly string[] | undefined, Region])[]): Province[] {
  const seen = new Set<string>()
  const out: Province[] = []
  for (const [names, region] of lists) {
    for (const raw of names ?? []) {
      const name = raw.trim().slice(0, 60)
      const id = slugify(name)
      if (!id || seen.has(id)) continue
      seen.add(id)
      out.push({ id, name, region })
    }
  }
  return out
}

const provincesOf = (v: ShippingValues): Province[] =>
  buildProvinces([
    [v.tinhTrongNgay, 'same-day'],
    [v.tinhPhiaBac, 'north'],
    [v.tinhPhiaNam, 'south'],
  ])

const LIVE_PROVINCES = provincesOf(LIVE)
// Ecopillo xoá trống cả ba danh sách: giữ danh sách gốc, không để trang Đặt hàng không chọn được tỉnh
export const PROVINCES: readonly Province[] = LIVE_PROVINCES.length ? LIVE_PROVINCES : provincesOf(BASE)

export const provinceById = (id: string): Province | undefined => PROVINCES.find((p) => p.id === id)

// Chữ thời gian giao Ecopillo sửa ở Nội dung web → Chữ từng trang → "Đặt hàng: tóm tắt đơn và cảm ơn"
export const DELIVERY_TIME: Readonly<Record<Region, string>> = {
  'same-day': ORDER_SUMMARY_TEXT.giaoTrongNgay,
  north: ORDER_SUMMARY_TEXT.giaoPhiaBac,
  south: ORDER_SUMMARY_TEXT.giaoPhiaNam,
}

/** Phí giao theo giá trị đơn, giống nhau trên toàn quốc */
export const shippingFee = (subtotal: number): number => (subtotal >= FREE_SHIP_THRESHOLD ? 0 : STANDARD_FEE)
