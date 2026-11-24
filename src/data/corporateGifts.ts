import type { ImageSource } from './catalog'
import { liveObject, type EditableField, type EditableSet } from './liveContent'
import { GIFTS_TEXT } from './pageText/gifts'

/**
 * Quà tặng doanh nghiệp, sự kiện (Ecopillo gửi 27/10/2026: "Phần này là quà tặng", 7 ảnh), ở trang Quà tặng và sự kiện.
 * Khác thư cảm ơn + ưu đãi 5% (thankYou.ts, mục 11 phản hồi 05/11/2026; trước đó là quà kèm ruột gối). Owner chọn mẫu A: docs/de-xuat-phan-qua-tang.html.
 * Ảnh gốc đều vuông, nén bằng tools/nen-anh-qua-tang-2026-10-27.py; trên web giữ khung vuông để thấy trọn ảnh (owner dặn 27/10).
 * Giá 99K in trong ảnh quảng cáo của Ecopillo: owner bảo không cần hỏi lại (27/10/2026).
 */

export interface CorporateGiftImage {
  image: ImageSource
  /** Chú thích đè dưới chân ảnh. Không có thì ảnh hiện trọn, không lớp phủ (ảnh quảng cáo có chữ) */
  caption?: string
}

/** Ảnh, chú thích Ecopillo sửa ở Nội dung web → Chữ từng trang → Trang Quà tặng và sự kiện (gốc ở pageText/gifts.ts) */
const photo = (image: ImageSource, captionIndex?: number): CorporateGiftImage => {
  const caption = captionIndex === undefined ? undefined : GIFTS_TEXT.chuThichAnh[captionIndex]?.trim()
  return caption ? { image, caption } : { image }
}

const BASE_CORPORATE_GIFTS = {
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
}

/** Ảnh quảng cáo lớn (hiện trọn, không chú thích đè) và hai ảnh cạnh nó trong khối trắng */
export const GIFT_POSTER: CorporateGiftImage = photo(GIFTS_TEXT.anhQuangCao)

export const GIFT_SIDE_IMAGES: readonly CorporateGiftImage[] = [photo(GIFTS_TEXT.anhBen1, 0), photo(GIFTS_TEXT.anhBen2, 1)]

/** Hàng ảnh nhỏ dưới khối trắng */
export const GIFT_MORE_IMAGES: readonly CorporateGiftImage[] = [
  photo(GIFTS_TEXT.anhThem1, 2),
  photo(GIFTS_TEXT.anhThem2, 3),
  photo(GIFTS_TEXT.anhThem3, 4),
  photo(GIFTS_TEXT.anhThem4, 5),
]

/** Khối quà tặng doanh nghiệp: Ecopillo tự sửa trong WordPress (liveContent.ts) */
export const CORPORATE_GIFTS_SET: EditableSet = {
  khoa: 'qua-tang-doanh-nghiep',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Quà tặng doanh nghiệp',
  moTa: 'Chữ khối quà tặng doanh nghiệp ở trang Quà tặng và sự kiện.',
  kieu: 'mot',
  goc: BASE_CORPORATE_GIFTS,
  truong: [
    { khoa: 'eyebrow', nhan: 'Nhãn nhỏ', kieu: 'chu', batBuoc: true },
    { khoa: 'title', nhan: 'Tiêu đề', kieu: 'chu', batBuoc: true },
    { khoa: 'titleAccent', nhan: 'Phần tiêu đề nghiêng', kieu: 'chu', batBuoc: true },
    { khoa: 'lead', nhan: 'Đoạn giới thiệu', kieu: 'doan', batBuoc: true },
    { khoa: 'price', nhan: 'Giá từ', kieu: 'chu', batBuoc: true, goiY: 'Ví dụ 99.000đ' },
    { khoa: 'priceLabel', nhan: 'Nhãn giá', kieu: 'chu', batBuoc: true },
    { khoa: 'points', nhan: 'Các ý', kieu: 'ds-dong', batBuoc: true },
    { khoa: 'callLabel', nhan: 'Chữ trên nút gọi', kieu: 'chu', batBuoc: true },
  ] satisfies EditableField[],
}

export const CORPORATE_GIFTS: typeof BASE_CORPORATE_GIFTS = liveObject(CORPORATE_GIFTS_SET.khoa, BASE_CORPORATE_GIFTS, CORPORATE_GIFTS_SET.truong)
