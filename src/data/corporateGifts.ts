import type { ImageSource } from './catalog'

/**
 * Quà tặng doanh nghiệp, sự kiện (Ecopillo gửi 27/10/2026: "Phần này là quà tặng", 7 ảnh), ở trang Quà tặng và sự kiện.
 * Khác quà tri ân kèm khi mua bộ chăn ga (GIFT_TIERS trong catalog.ts). Owner chọn mẫu A: docs/de-xuat-phan-qua-tang.html.
 * Ảnh gốc đều vuông, nén bằng tools/nen-anh-qua-tang-2026-10-27.py; trên web giữ khung vuông để thấy trọn ảnh (owner dặn 27/10).
 * Giá 99K in trong ảnh quảng cáo của Ecopillo: owner bảo không cần hỏi lại (27/10/2026).
 */

export interface CorporateGiftImage {
  image: ImageSource
  /** Chú thích đè dưới chân ảnh. Không có thì ảnh hiện trọn, không lớp phủ (ảnh quảng cáo có chữ) */
  caption?: string
}

const giftImage = (key: string, alt: string): ImageSource => ({
  src: `/images/qua-tang/${key}.webp`,
  srcSet: `/images/qua-tang/${key}-sm.webp 520w, /images/qua-tang/${key}.webp 1000w`,
  alt,
})

export const CORPORATE_GIFTS = {
  eyebrow: 'Quà tặng doanh nghiệp, sự kiện',
  title: 'Hộp quà chăn ga',
  titleAccent: 'cho doanh nghiệp',
  lead: 'Ecopillo đã làm quà cho VTV3, giải VTV3 Pickleball và nhiều đơn vị. Quà đóng hộp, túi hồng Ecopillo, sẵn sàng để trao.',
  /** Giá in trong ảnh quảng cáo "Gói quà Tết cho doanh nghiệp, giá chỉ từ 99K" */
  price: '99.000đ',
  priceLabel: 'Gói quà Tết cho doanh nghiệp',
  /** Chỉ ghi điều thấy trong ảnh khách gửi hoặc đã có trong chính sách (giao hàng: src/data/policies.ts) */
  points: ['Hộp quà, túi quà in nhận diện Ecopillo', 'Kèm thư cảm ơn mang tên đơn vị nhận, như thư gửi VTV3', 'Giao hàng toàn quốc'],
  callLabel: 'Gọi đặt quà',
} as const

/** Ảnh quảng cáo lớn (hiện trọn, không chú thích đè) và hai ảnh cạnh nó trong khối trắng */
export const GIFT_POSTER: CorporateGiftImage = {
  image: giftImage('goi-qua-tet-doanh-nghiep', 'Gói quà Tết cho doanh nghiệp: hộp quà chăn ga gối đệm cao cấp Ecopillo, giá chỉ từ 99K'),
}

export const GIFT_SIDE_IMAGES: readonly CorporateGiftImage[] = [
  { image: giftImage('qua-tang-vtv3', 'Cầm hộp quà Ecopillo và thư đồng hành cùng VTV3 tại sảnh Đài Truyền hình'), caption: 'Quà tặng đồng hành cùng VTV3' },
  { image: giftImage('qua-tang-pickleball', 'Vận động viên giải VTV3 Pickleball cầm túi quà Ecopillo'), caption: 'Quà tặng tại giải VTV3 Pickleball' },
]

/** Hàng ảnh nhỏ dưới khối trắng */
export const GIFT_MORE_IMAGES: readonly CorporateGiftImage[] = [
  { image: giftImage('tui-qua', 'Túi quà Ecopillo màu hồng xếp sẵn để trao'), caption: 'Túi quà Ecopillo' },
  { image: giftImage('hop-qua-xep-chong', 'Hộp quà chăn ga gối đệm cao cấp Ecopillo xếp chồng, kèm thư VTV3'), caption: 'Hộp quà chăn ga gối đệm cao cấp' },
  {
    image: giftImage('trao-qua-showroom-1', 'Trao hộp quà Ecopillo cho một đoàn khách tại phòng trưng bày'),
    caption: 'Trao quà tại phòng trưng bày Ecopillo',
  },
  { image: giftImage('trao-qua-showroom-2', 'Đoàn khách nhận quà Ecopillo tại phòng trưng bày'), caption: 'Đoàn khách nhận quà Ecopillo' },
]
