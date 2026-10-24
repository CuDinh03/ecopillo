import type { ImageSource } from './catalog'

/**
 * Sự kiện Ecopillo đồng hành (yêu cầu khách 16/10/2026, mục 35), hiện ở cuối phần "Về chúng tôi" trang chủ
 * (components/home/EventsStrip.tsx). Owner chọn mẫu B và chỉ đưa sự kiện đọc được tên (20/10/2026).
 * Mẫu: docs/de-xuat-su-kien-dong-hanh.html. Tên, ngày, nơi đọc từ băng rôn trong ảnh khách gửi; Ecopillo chưa gửi danh sách
 * (câu 25 trong Excel). Chưa có ngày thì để trống, không tự đoán. Ảnh nén bằng tools/nen-anh-su-kien-2026-10-20.py.
 * Dùng chung cho phần sự kiện ở trang Quà tặng và sự kiện (mục 34, từ 24/10/2026): Ecopillo gửi thêm thì chỉ thêm vào đây.
 */

/** Trang Quà tặng và sự kiện: nhắc Ecopillo gửi thêm sự kiện, ảnh gian hàng (mục 34) */
export const EVENTS_FILL_IN = '[ECOPILLO GỬI THÊM SỰ KIỆN CÓ MẶT ECOPILLO: TÊN, NGÀY, NƠI VÀ ẢNH GIAN HÀNG]'

export interface BrandEvent {
  id: string
  /** Nhãn nhỏ phía trên tên */
  kind: 'Thiện nguyện' | 'Đồng hành' | 'Hội thảo'
  title: string
  /** Ngày, nơi: chỉ ghi khi đọc được trong ảnh */
  when?: string
  /** Đoạn mô tả, chỉ dùng cho sự kiện nổi bật */
  summary?: string
  /** Bài viết trên web cũ (giữ đúng link). Chỉ hiện nút "Đọc bài viết" khi bài đã có trên web mới */
  postSlug?: string
  /** Ảnh dọc 4:5 */
  image: ImageSource
  /** Ảnh ngang 16:10, cho ô rộng */
  wideImage?: ImageSource
}

const eventImage = (key: string, alt: string): ImageSource => ({
  src: `/images/events/${key}.webp`,
  srcSet: `/images/events/${key}-sm.webp 480w, /images/events/${key}.webp 960w`,
  alt,
})

const eventWideImage = (key: string, alt: string): ImageSource => ({
  src: `/images/events/${key}.webp`,
  srcSet: `/images/events/${key}-sm.webp 640w, /images/events/${key}.webp 1200w`,
  alt,
})

/** Sự kiện nổi bật (thẻ lớn): đủ tên, ngày, nơi, con số, và có bài viết trên web cũ */
export const FEATURED_EVENT: BrandEvent = {
  id: 'chan-am-yeu-thuong',
  kind: 'Thiện nguyện',
  title: 'Chương trình trao quà “Chăn ấm yêu thương”',
  when: 'Tháng 3/2025 · Cẩm Xuyên, Hà Tĩnh',
  summary:
    'Cùng Hội Chữ thập đỏ tỉnh Hà Tĩnh, Ecopillo trao 130 chiếc chăn ấm cho 130 hộ gia đình có hoàn cảnh khó khăn ở huyện Cẩm Xuyên, hưởng ứng “Tháng Nhân đạo”.',
  postSlug: 'ecopillo-trao-130-chiec-chan-am-cho-130-ho-gia-dinh-co-hoan-canh-kho-khan-huyen-cam-xuyen',
  image: eventWideImage('chan-am-yeu-thuong-ngang', 'Ecopillo và Hội Chữ thập đỏ tỉnh Hà Tĩnh trao chăn cho các hộ gia đình tại hội trường xã Yên Hòa'),
}

/** Các sự kiện còn lại (lưới nhỏ). Ô cuối kéo rộng hai cột trên máy tính nên cần ảnh ngang */
export const OTHER_EVENTS: readonly BrandEvent[] = [
  {
    id: 'esg-dan-tri',
    kind: 'Hội thảo',
    title: 'Hội thảo “Thực thi ESG bằng AI: doanh nghiệp cần làm gì?”',
    when: '14/08/2025 · TP. Hồ Chí Minh',
    image: eventImage('esg-dan-tri', 'Đại diện Ecopillo tại hội thảo Thực thi ESG bằng AI do báo Dân trí tổ chức'),
  },
  {
    id: 'vtv3-sinh-nhat',
    kind: 'Đồng hành',
    title: 'Sinh nhật kênh VTV3',
    image: eventImage('vtv3-sinh-nhat', 'Đại diện Ecopillo bên lẵng hoa chúc mừng sinh nhật kênh VTV3'),
  },
  {
    id: 'vtv3-pickleball',
    kind: 'Đồng hành',
    title: 'Giải VTV3 Pickleball “30 Years of Excellence”',
    image: eventImage('vtv3-pickleball', 'Vận động viên giải VTV3 Pickleball nhận quà tặng Ecopillo'),
    wideImage: eventWideImage('vtv3-pickleball-ngang', 'Vận động viên giải VTV3 Pickleball nhận quà tặng Ecopillo'),
  },
]
