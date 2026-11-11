/**
 * Chính sách giao hàng và thanh toán của Ecopillo (biên bản chốt 12/10/2026, mục 35, 36, 50).
 * - Chỉ thu tiền khi nhận hàng (COD), áp dụng toàn quốc, không thu phí thu hộ.
 * - Miễn phí giao toàn quốc cho đơn từ 500.000đ; đơn nhỏ hơn phí giao 50.000đ.
 * - Không nhận chuyển khoản trước trên web.
 * - Thời gian: nội thành Hà Nội và nội thành TP. HCM giao trong ngày (chị Phương, Zalo 11/11/2026), phía Bắc 2–3 ngày, phía Nam 3–5 ngày.
 *   Ngoại thành hai thành phố vẫn tính theo phía Bắc / phía Nam như trước [XÁC NHẬN với Ecopillo].
 */

import { slugify } from './slug'

export const FREE_SHIP_THRESHOLD = 500_000
export const STANDARD_FEE = 50_000

export type Region = 'same-day' | 'north' | 'south'

export interface Province {
  id: string
  name: string
  region: Region
}

// 34 tỉnh, thành theo đơn vị hành chính từ 01/07/2025.
// Chính sách chỉ nêu "phía Bắc" và "phía Nam": tạm xếp Thanh Hoá – Hà Tĩnh vào phía Bắc,
// từ Quảng Trị trở vào áp thời gian phía Nam.
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

export const PROVINCES: readonly Province[] = [
  { id: 'ha-noi-noi-thanh', name: 'Hà Nội (nội thành)', region: 'same-day' },
  { id: 'tp-ho-chi-minh-noi-thanh', name: 'TP. Hồ Chí Minh (nội thành)', region: 'same-day' },
  ...NORTH.map((name) => ({ id: slugify(name), name, region: 'north' as const })),
  ...SOUTH.map((name) => ({ id: slugify(name), name, region: 'south' as const })),
]

export const provinceById = (id: string): Province | undefined => PROVINCES.find((p) => p.id === id)

export const DELIVERY_TIME: Readonly<Record<Region, string>> = {
  'same-day': 'Trong ngày',
  north: '2–3 ngày',
  south: '3–5 ngày',
}

/** Phí giao theo giá trị đơn, giống nhau trên toàn quốc */
export const shippingFee = (subtotal: number): number => (subtotal >= FREE_SHIP_THRESHOLD ? 0 : STANDARD_FEE)
