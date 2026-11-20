import { OPENING_HOURS } from './brand'
import { BANK_LINE } from './paymentPolicy'

import { liveList, type EditableField, type EditableSet } from './liveContent'

export interface Review {
  name: string
  place: string
  product: string
  quote: string
}

// Nội dung mẫu — thay bằng đánh giá thật của khách trước khi chạy chính thức.
const BASE_REVIEWS: readonly Review[] = [
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

/** Cảm nhận khách hàng ở trang chủ: Ecopillo tự sửa trong WordPress (liveContent.ts) */
export const REVIEWS_SET: EditableSet = {
  khoa: 'danh-gia',
  nhom: 'Trang chủ',
  ten: 'Cảm nhận khách hàng',
  moTa: 'Các ô cảm nhận của khách ở trang chủ. Chỉ đưa lời khách thật, có khách đồng ý.',
  kieu: 'nhieu',
  goc: BASE_REVIEWS,
  tieuDeDong: 'name',
  truong: [
    { khoa: 'name', nhan: 'Tên khách', kieu: 'chu', batBuoc: true, goiY: 'Ví dụ Chị Minh Anh' },
    { khoa: 'place', nhan: 'Nơi ở', kieu: 'chu', batBuoc: true },
    { khoa: 'product', nhan: 'Sản phẩm đã dùng', kieu: 'chu', batBuoc: true },
    { khoa: 'quote', nhan: 'Lời khách', kieu: 'doan', batBuoc: true },
  ] satisfies EditableField[],
}

export const REVIEWS: readonly Review[] = liveList(REVIEWS_SET.khoa, BASE_REVIEWS, REVIEWS_SET.truong, (): Review => ({ name: '', place: '', product: '', quote: '' }))

export interface Partner {
  name: string
  logo: string
}

/**
 * Tám đối tác theo catalog Ecopillo 22.07.2026 (trang 5), logo cắt từ catalog (nền trong suốt).
 * Owner cho phép đưa logo lên web (24/10/2026). May 10, FLC Biscom, DBV Insurance không phải khách sạn:
 * mọi nhãn đứng trên lưới logo gọi là "Đối tác", không gọi "khách sạn đã đồng hành".
 * Mục 36 (owner cho phép 30/10/2026): thêm VTV3, Hiệp hội DNNVV Hà Nội, báo Dân trí, đặt cạnh May 10 ở đầu.
 * Logo lấy từ nguồn công khai (VTV3, Dân trí: Wikimedia Commons; Hiệp hội: hanoisme.vn), chưa phải file Ecopillo gửi.
 */
const BASE_HOTEL_PARTNERS: readonly Partner[] = [
  { name: 'May 10', logo: '/images/partners/may-10.webp' },
  { name: 'VTV3', logo: '/images/partners/vtv3.webp' },
  { name: 'Hiệp hội Doanh nghiệp nhỏ và vừa Hà Nội', logo: '/images/partners/hiep-hoi-dnnvv-ha-noi.webp' },
  { name: 'Báo Dân trí', logo: '/images/partners/dan-tri.webp' },
  { name: 'FLC Biscom', logo: '/images/partners/flc-biscom.webp' },
  { name: 'Flamingo Resorts', logo: '/images/partners/flamingo-resorts.webp' },
  { name: 'DBV Insurance', logo: '/images/partners/dbv-insurance.webp' },
  { name: 'Hacinco Hotel', logo: '/images/partners/hacinco-hotel.webp' },
  { name: 'Cherry Hotel', logo: '/images/partners/cherry-hotel.webp' },
  { name: 'Đào Thuỷ Harry Hotel', logo: '/images/partners/dao-thuy-harry-hotel.webp' },
  { name: 'Doson Resort Hotel', logo: '/images/partners/doson-resort-hotel.webp' },
  // Khách gửi logo qua Zalo 09/11/2026 (anh Quang): cắt bỏ dòng địa chỉ, nền trong suốt
  { name: 'Panhou Retreat', logo: '/images/partners/panhou-retreat.webp' },
]

/** Logo đối tác (trang chủ, trang Khách sạn): Ecopillo tự sửa trong WordPress (liveContent.ts) */
export const PARTNERS_SET: EditableSet = {
  khoa: 'doi-tac',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Logo đối tác',
  moTa: 'Lưới logo "Đối tác" ở trang chủ và trang Khách sạn và dự án. Logo nền trong suốt (PNG/WebP), chỉ đưa khi đối tác đồng ý.',
  kieu: 'nhieu',
  goc: BASE_HOTEL_PARTNERS,
  tieuDeDong: 'name',
  truong: [
    { khoa: 'name', nhan: 'Tên đối tác', kieu: 'chu', batBuoc: true },
    { khoa: 'logo', nhan: 'Logo (link ảnh)', kieu: 'link', batBuoc: true, goiY: 'Tải logo vào Thư viện, dán link ảnh' },
  ] satisfies EditableField[],
}

export const HOTEL_PARTNERS: readonly Partner[] = liveList(PARTNERS_SET.khoa, BASE_HOTEL_PARTNERS, PARTNERS_SET.truong, (): Partner => ({ name: '', logo: '' }))

export interface Faq {
  q: string
  a: readonly string[]
}

// Biên bản chốt mục 35–38 và 43: Ecopillo sẽ duyệt lại câu trả lời trước khi chạy chính thức.
const BASE_FAQS: readonly Faq[] = [
  {
    q: 'Đơn hàng có được miễn phí giao không, bao lâu thì nhận?',
    a: [
      'Đơn từ 500.000đ được miễn phí giao hàng trên toàn quốc; đơn dưới mức này phí giao 50.000đ.',
      'Nội thành Hà Nội và nội thành TP. HCM nhận trong ngày, các tỉnh phía Bắc 2–3 ngày, các tỉnh phía Nam 3–5 ngày.',
    ],
  },
  {
    q: 'Tôi có được kiểm hàng khi nhận không?',
    a: [
      'Có. Quý khách kiểm hàng cùng nhân viên giao.',
      'Trải nghiệm chăn ga tại nhà: Hà Nội, TP. HCM áp dụng mọi đơn hàng; tỉnh thành khác áp dụng đơn từ 20.000.000 đồng.',
      'Nếu giao sai mẫu hoặc sai kích thước, Quý khách có quyền từ chối nhận.',
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
    q: 'Thanh toán thế nào? Có phải đặt cọc không?',
    // Thông báo Ecopillo từ 07/08/2026, chị Phương 18/11/2026 (src/data/paymentPolicy.ts)
    a: [
      `Ecopillo nhận thanh toán bằng chuyển khoản vào một tài khoản duy nhất: ${BANK_LINE}.`,
      'Đơn chăn ga tiêu chuẩn dưới 10 triệu đồng không cần đặt cọc. Đệm, đơn trên 10 triệu, chăn ga nhỡ cỡ, may riêng hoặc cần chỉnh sửa theo yêu cầu cần đặt cọc; nhân viên báo khi gọi xác nhận đơn.',
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
      'Đệm cao su thiên nhiên 15 năm, đệm lò xo và Eco Foam 10 năm, đệm bông ép Mix Latex 7 năm, divan và đệm bông ép 5 năm. Chăn ga: 90 ngày.',
    ],
  },
  {
    q: 'Điểm bán Ecopillo mở cửa giờ nào?',
    a: [
      `Văn phòng Hà Nội, chi nhánh TP. HCM và đại lý Đà Nẵng: ${OPENING_HOURS}.`,
      'Đại lý: giờ mở cửa ghi ở từng điểm trên trang Liên hệ mua hàng (mục Tìm Ecopillo gần Quý khách). Điểm chưa ghi giờ, Quý khách gọi trước khi ghé.',
    ],
  },
]

/** Câu hỏi thường gặp: Ecopillo tự sửa trong WordPress (liveContent.ts) */
export const FAQS_SET: EditableSet = {
  khoa: 'hoi-dap',
  nhom: 'Trang giới thiệu, khách sạn, quà tặng',
  ten: 'Câu hỏi thường gặp',
  moTa: 'Các câu hỏi và trả lời ở khối Hỏi đáp.',
  kieu: 'nhieu',
  goc: BASE_FAQS,
  tieuDeDong: 'q',
  truong: [
    { khoa: 'q', nhan: 'Câu hỏi', kieu: 'chu', batBuoc: true },
    { khoa: 'a', nhan: 'Trả lời', kieu: 'doan-nhieu', batBuoc: true },
  ] satisfies EditableField[],
}

export const FAQS: readonly Faq[] = liveList(FAQS_SET.khoa, BASE_FAQS, FAQS_SET.truong, (): Faq => ({ q: '', a: [] }))

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

/**
 * Nhận xét ở trên (REVIEWS, SAMPLE_BY_CATEGORY) đều là NỘI DUNG MẪU để dựng giao diện. Owner bảo bỏ hết nhãn chờ (28/10/2026):
 * bỏ nhãn "nhận xét mẫu" mà vẫn hiện thì thành nhận xét bịa, nên khối nhận xét ẩn hẳn ở trang chủ và trang sản phẩm.
 * Có nhận xét thật Ecopillo gửi (tên, tỉnh, mẫu đã mua, đồng ý đăng) thì thay dữ liệu mẫu rồi đổi thành true.
 */
export const REVIEWS_ARE_REAL = false
