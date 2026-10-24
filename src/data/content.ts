import { OPENING_HOURS } from './brand'

export interface Review {
  name: string
  place: string
  product: string
  quote: string
}

// Nội dung mẫu — thay bằng đánh giá thật của khách trước khi chạy chính thức.
export const REVIEWS: readonly Review[] = [
  {
    name: 'Chị Minh Anh',
    place: 'Cầu Giấy, Hà Nội',
    product: 'Eco Rosa ER25',
    quote:
      'Vải mát thật sự, mùa hè nằm không bí lưng. Đường chần đều, giặt mấy lần vẫn phẳng, không xù lông.',
  },
  {
    name: 'Anh Quốc Huy',
    place: 'Gò Vấp, TP. HCM',
    product: 'Eco Doris ED10',
    quote:
      'Mua làm quà cưới cho em gái, hộp đóng gói rất chỉn chu. Hai vợ chồng em khen mãi vì vải mềm như lụa.',
  },
  {
    name: 'Chị Thu Hà',
    place: 'Long Biên, Hà Nội',
    product: 'Eco Flora EF06',
    quote:
      'Con nhỏ da nhạy cảm, đổi sang chăn ga Ecopillo thì hết hẳn nổi mẩn. Nhân viên tư vấn kích thước rất kỹ trước khi giao.',
  },
  {
    name: 'Chị Lan Phương',
    place: 'Thủ Đức, TP. HCM',
    product: 'Eco Sweet ES06',
    quote:
      'Ở ngoài nhìn đẹp hơn trong ảnh, phòng ngủ sang lên hẳn. Được trải thử lên giường lúc nhận nên rất yên tâm.',
  },
]

export interface Partner {
  name: string
  logo: string
}

/**
 * Tám đối tác theo catalog Ecopillo 22.07.2026 (trang 5), logo cắt từ catalog (nền trong suốt).
 * Owner cho phép đưa logo lên web (24/10/2026). May 10, FLC Biscom, DBV Insurance không phải khách sạn:
 * mọi nhãn đứng trên lưới logo gọi là "Đối tác", không gọi "khách sạn đã đồng hành".
 */
export const HOTEL_PARTNERS: readonly Partner[] = [
  { name: 'May 10', logo: '/images/partners/may-10.webp' },
  { name: 'FLC Biscom', logo: '/images/partners/flc-biscom.webp' },
  { name: 'Flamingo Resorts', logo: '/images/partners/flamingo-resorts.webp' },
  { name: 'DBV Insurance', logo: '/images/partners/dbv-insurance.webp' },
  { name: 'Hacinco Hotel', logo: '/images/partners/hacinco-hotel.webp' },
  { name: 'Cherry Hotel', logo: '/images/partners/cherry-hotel.webp' },
  { name: 'Đào Thuỷ Harry Hotel', logo: '/images/partners/dao-thuy-harry-hotel.webp' },
  { name: 'Doson Resort Hotel', logo: '/images/partners/doson-resort-hotel.webp' },
]

export interface Faq {
  q: string
  a: readonly string[]
}

// Biên bản chốt mục 35–38 và 43: Ecopillo sẽ duyệt lại câu trả lời trước khi chạy chính thức.
export const FAQS: readonly Faq[] = [
  {
    q: 'Đơn hàng có được miễn phí giao không, bao lâu thì nhận?',
    a: [
      'Đơn từ 500.000đ được miễn phí giao hàng trên toàn quốc; đơn dưới mức này phí giao 50.000đ.',
      'Nội thành Hà Nội nhận trong khoảng 1 ngày, các tỉnh phía Bắc 2–3 ngày, các tỉnh phía Nam 3–5 ngày.',
    ],
  },
  {
    q: 'Tôi có được kiểm hàng khi nhận không?',
    a: [
      'Có. Quý khách kiểm hàng cùng nhân viên giao, được trải thử lên giường để xem vừa kích thước (vui lòng không nằm lên).',
      'Nếu giao sai mẫu hoặc sai kích thước, Quý khách có quyền từ chối nhận và không phải trả tiền.',
    ],
  },
  {
    q: 'Chính sách đổi hàng như thế nào?',
    a: [
      'Ecopillo hỗ trợ đổi hàng, không áp dụng trả hàng hoàn tiền.',
      'Báo lỗi sản xuất hoặc thiếu hàng trong 24 giờ sau khi nhận. Gửi hàng đổi trong 7 ngày, còn nguyên tem mác, chưa giặt, chưa sử dụng.',
      'Nếu là lỗi của nhà sản xuất, Ecopillo chịu toàn bộ phí vận chuyển đổi hàng.',
    ],
  },
  {
    q: 'Thanh toán thế nào? Có phải chuyển khoản trước không?',
    a: [
      'Không cần chuyển khoản trước. Đặt online, Quý khách thanh toán khi nhận hàng (COD) trên toàn quốc, không mất phí thu hộ.',
      'Sau khi đặt, nhân viên Ecopillo gọi điện xác nhận đơn. Quý khách kiểm hàng xong rồi mới thanh toán cho người giao.',
      'Mua trực tiếp tại hệ thống phân phối Ecopillo: thanh toán tiền mặt hoặc quẹt thẻ.',
    ],
  },
  {
    q: 'Giường nhà tôi kích thước lạ, có may riêng được không?',
    a: [
      'Được. Ecopillo nhận may chăn ga theo kích thước riêng cho gia đình, khách sạn và resort.',
      'Gọi hoặc nhắn Zalo 0988 832 072, gửi số đo dài × rộng × độ dày đệm để được báo giá và thời gian may.',
    ],
  },
  {
    q: 'Sản phẩm được bảo hành bao lâu?',
    a: [
      'Bảo hành theo từng sản phẩm, tính từ ngày mua.',
      'Đệm: 5–15 năm tuỳ dòng đệm. Chăn ga: 90 [XÁC NHẬN ĐƠN VỊ: NGÀY]. Gối: [ĐIỀN THỜI HẠN BẢO HÀNH GỐI].',
    ],
  },
  {
    q: 'Hệ thống phân phối mở cửa giờ nào?',
    a: [
      `Văn phòng đại diện Hà Nội và chi nhánh TP. HCM: ${OPENING_HOURS}.`,
      '[ECOPILLO GỬI GIỜ MỞ CỬA CỦA CÁC ĐIỂM PHÂN PHỐI KHÁC NẾU KHÁC NHAU]',
    ],
  },
]

/* ——— Nhận xét chi tiết từng sản phẩm (biên bản mục 42) ——— */

export const REVIEW_CRITERIA = ['Chất liệu', 'Đường may, hoàn thiện', 'Đúng như ảnh', 'Giao hàng, đóng gói'] as const

export interface ProductReview {
  name: string
  place: string
  /** Mẫu / kích thước đã mua */
  bought: string
  stars: number
  quote: string
  /** Điểm theo từng tiêu chí, cùng thứ tự với REVIEW_CRITERIA */
  scores: readonly [number, number, number, number]
}

// NỘI DUNG MẪU để dựng giao diện — thay bằng nhận xét thật Ecopillo gửi (tên, tỉnh, mẫu đã mua, đồng ý đăng).
const SAMPLE_BY_CATEGORY: Readonly<Record<string, readonly ProductReview[]>> = {
  'bo-chan-ga': [
    {
      name: 'Chị Minh Anh',
      place: 'Cầu Giấy, Hà Nội',
      bought: '180 × 200 cm',
      stars: 5,
      quote: 'Vải mát thật sự, mùa hè nằm không bí lưng. Đường chần đều, giặt mấy lần vẫn phẳng.',
      scores: [5, 5, 5, 4],
    },
    {
      name: 'Anh Quốc Huy',
      place: 'Gò Vấp, TP. HCM',
      bought: '160 × 200 cm',
      stars: 5,
      quote: 'Mua làm quà cưới, hộp đóng gói chỉn chu. Màu ngoài đời nhã hơn ảnh một chút.',
      scores: [5, 5, 4, 5],
    },
  ],
  chan: [
    {
      name: 'Chị Thu Hà',
      place: 'Long Biên, Hà Nội',
      bought: '200 × 220 cm',
      stars: 5,
      quote: 'Chăn nhẹ, đắp không bị nặng ngực mà vẫn đủ ấm. Con nhỏ da nhạy cảm dùng không bị mẩn.',
      scores: [5, 5, 5, 5],
    },
  ],
  goi: [
    {
      name: 'Anh Tuấn',
      place: 'Hải Phòng',
      bought: '45 × 65 cm',
      stars: 5,
      quote: 'Gối êm vừa phải, sáng dậy không mỏi cổ. Nhân viên gọi xác nhận rất nhanh.',
      scores: [5, 4, 5, 5],
    },
  ],
  dem: [
    {
      name: 'Chị Lan Phương',
      place: 'Thủ Đức, TP. HCM',
      bought: '180 × 200 cm',
      stars: 4,
      quote: 'Đệm nâng lưng tốt, nằm nghiêng không bị lún vai. Giao hơi muộn một ngày nhưng có báo trước.',
      scores: [5, 5, 5, 4],
    },
  ],
}

export const reviewsForCategory = (category: string): readonly ProductReview[] => SAMPLE_BY_CATEGORY[category] ?? []

export const REVIEW_SAMPLE_NOTE = '[NHẬN XÉT MẪU — THAY BẰNG NHẬN XÉT THẬT CỦA KHÁCH]'
