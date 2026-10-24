import type { ImageSource } from './catalog'

/**
 * Chữ giới thiệu khối khách sạn, dùng chung cho trang chủ (Hospitality) và trang Khách sạn và dự án (HotelPage).
 * Chữ của Ecopillo gửi 16/10/2026 (yêu cầu sửa mục 37, 38, 39), giữ nguyên văn.
 */

/** Mục 37: nhãn thêm "Dự án" */
export const HOTEL_EYEBROW = 'Khách sạn · Resort · Nhà nghỉ · Dự án'

/**
 * Mục 38: dòng in hoa của khách làm dòng phụ dưới tiêu đề "Giấc ngủ năm sao…".
 * [XÁC NHẬN] khách chưa trả lời có thay hẳn tiêu đề đó không (câu hỏi gửi khách số 28).
 */
export const HOTEL_INTRO_HEADING = 'Ecopillo – Giải pháp chăn ga gối đệm toàn diện cho khách sạn & dự án'

/**
 * Mục 38: ba đoạn giới thiệu. Trang chủ chỉ hiện đoạn đầu. Trang Khách sạn và dự án hiện đủ:
 * đoạn đầu ở phần đầu trang, đoạn 2, 3 dưới câu trích nền chàm (để phần đầu trang không cao quá, ảnh không bị cắt lệch)
 */
export const HOTEL_INTRO: readonly string[] = [
  'Ecopillo chuyên cung cấp chăn, ga, gối, đệm số lượng lớn cho khách sạn, resort, nhà nghỉ và các dự án lưu trú.',
  'Với chất liệu được tuyển chọn kỹ lưỡng, đường may chắc chắn với mật độ 4 mũi/cm cùng các dòng đệm đáp ứng đa dạng nhu cầu sử dụng, Ecopillo hướng đến những sản phẩm bền đẹp, phù hợp với cường độ sử dụng thường xuyên và nhu cầu vận hành thực tế.',
  'Chúng tôi mang đến giải pháp đồng bộ từ chăn ga gối đến đệm, giúp đối tác tối ưu chi phí đầu tư, kéo dài thời gian sử dụng sản phẩm và nâng cao trải nghiệm nghỉ ngơi của khách hàng.',
]

/**
 * Ba ý cạnh lưới 8 logo đối tác ở trang Khách sạn và dự án (owner chọn kiểu B 24/10/2026).
 * Rút từ 4 đoạn chữ trang 5 catalog Ecopillo 22.07.2026, giữ số liệu của catalog.
 */
export const HOTEL_PARTNER_POINTS: readonly { value: string; text: string }[] = [
  { value: '3–5 sao', text: 'Đáp ứng tiêu chuẩn khắt khe của khách sạn, khu nghỉ dưỡng, nhà hàng và spa trên toàn quốc.' },
  { value: 'Hàng trăm phòng', text: 'Sản xuất chủ động, cung ứng đồng bộ cho dự án từ nhỏ đến lớn, đúng tiến độ, đúng số lượng.' },
  { value: 'Đồng nhất', text: 'Chất lượng như nhau theo yêu cầu riêng của từng đối tác, minh bạch trong sản xuất.' },
]

/** Đồ vải khách sạn theo trang 65 catalog: chất liệu từng hạng mục (owner chọn kiểu B 24/10/2026: ghi vào khối "sáu lớp") */
export const HOTEL_LINEN = {
  bedding: 'Cotton T250, T255, T300, T400',
  valance: 'Vải gấm',
  towels: 'Cotton',
  sizes: 'Kích thước tiêu chuẩn hoặc may theo yêu cầu.',
} as const

/** Mục 39: bốn lợi ích, thay bốn dòng cũ khách đã gạch */
export const HOTEL_BENEFITS: readonly string[] = [
  'Tư vấn đúng nhu cầu, phù hợp ngân sách',
  'Giải pháp trọn gói cho từng mô hình từ vận chuyển đến setup cho từng phòng',
  'Báo giá ưu đãi theo số lượng và từng hạng mục',
  'Tư vấn chất liệu theo công năng, tần suất sử dụng',
]

/**
 * Mục 39: ảnh phòng khách sạn lấy từ trang khách sạn của web cũ (/danh-muc-san-pham/du-an-khach-san-nha-nghi/),
 * Ecopillo chỉ định 23/10/2026 thay ảnh bộ chăn ga gia đình. Nén bằng tools/nen-anh-khach-san-2026-10-23.py.
 * Chưa nêu tên khách sạn: Ecopillo chưa cho phép.
 */
const hotelPhoto = (key: string, alt: string): ImageSource => ({
  src: `/images/hotel/${key}.webp`,
  srcSet: `/images/hotel/${key}-sm.webp 640w, /images/hotel/${key}.webp 1600w`,
  alt,
})

export const HOTEL_PHOTOS = {
  /** Đầu trang Khách sạn và dự án; tải trước trong index.html, đổi thì sửa cả ở đó */
  hero: hotelPhoto('phong-king-cua-kinh', 'Phòng khách sạn giường đôi lớn trải chăn ga trắng Ecopillo, cửa kính nhìn ra thành phố'),
  /** Khối khách sạn ở trang chủ */
  home: hotelPhoto('phong-king-den-long', 'Phòng khách sạn giường đôi lớn, chăn ga gối trắng Ecopillo viền chỉ'),
  /** Cạnh form báo giá */
  quote: hotelPhoto('phong-twin-ho-guom', 'Phòng khách sạn hai giường đơn trải chăn ga trắng Ecopillo'),
  /** Lớp "Ga bọc, ga phủ" ở trang Khách sạn và dự án */
  sheets: hotelPhoto('phong-hai-giuong', 'Phòng khách sạn hai giường đôi, ga bọc và chăn trắng Ecopillo có đường viền'),
  /** Lớp "Khăn tắm, khăn tay, khăn mặt", ảnh trang 65 catalog */
  towels: {
    src: '/images/hotel/khan-cotton.webp',
    srcSet: '/images/hotel/khan-cotton-sm.webp 480w, /images/hotel/khan-cotton.webp 800w',
    alt: 'Khăn tắm cotton trắng Ecopillo gấp chồng',
  },
} as const
