import type { ImageSource } from './catalog'

/**
 * Sự kiện Ecopillo đồng hành (yêu cầu khách 16/10/2026, mục 35), hiện ở cuối phần "Về chúng tôi" trang chủ
 * (components/home/EventsStrip.tsx). Owner chọn mẫu B và chỉ đưa sự kiện đọc được tên (20/10/2026).
 * Mẫu: docs/de-xuat-su-kien-dong-hanh.html. Tên, ngày, nơi đọc từ băng rôn trong ảnh khách gửi; Ecopillo chưa gửi danh sách
 * (câu 25 trong Excel). Chưa có ngày thì để trống, không tự đoán. Ảnh nén bằng tools/nen-anh-su-kien-2026-10-20.py.
 * Dùng chung cho phần sự kiện ở trang Quà tặng và sự kiện (mục 34, từ 24/10/2026): Ecopillo gửi thêm thì chỉ thêm vào đây.
 */

export interface BrandEvent {
  id: string
  /** Nhãn nhỏ phía trên tên */
  kind: 'Thiện nguyện' | 'Đồng hành' | 'Hội thảo' | 'Giải thưởng' | 'Khai trương'
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

/**
 * Sự kiện lớn, chỉ ở trang Quà tặng và sự kiện (Ecopillo 27/10/2026: "Phần đồng hành thêm các sự kiện lớn").
 * Tên, ngày, nơi, con số chép từ bài viết trên web cũ (giữ đúng link); ảnh lấy từ chính bài đó,
 * nén bằng tools/nen-anh-su-kien-lon-2026-10-27.py. Bài khai trương Đà Nẵng (14/06/2026) chưa đưa: ảnh bìa in chữ chất liệu cũ.
 */
export const MAJOR_EVENTS: readonly BrandEvent[] = [
  {
    id: 'thuong-hieu-dan-dau-2025',
    kind: 'Giải thưởng',
    title: 'Top 10 Thương hiệu dẫn đầu Việt Nam 2025',
    when: '13/04/2025 · TP. Hồ Chí Minh',
    summary:
      'Lễ công bố “Thương hiệu dẫn đầu Việt Nam 2025” do Liên hiệp Khoa học Phát triển Doanh nghiệp Việt Nam và Viện Nghiên cứu Kinh tế Châu Á tổ chức, truyền hình trực tiếp trên HTV1. Ecopillo được vinh danh trong Top 10.',
    postSlug: 'cong-ty-tnhh-ecopillo-eternal-viet-nam-vinh-du-don-nhan-giai-thuong-top-10-thuong-hieu-dan-dau-viet-nam-2025',
    image: eventWideImage('thuong-hieu-dan-dau-2025-ngang', 'Đại diện Ecopillo nhận chứng nhận trên sân khấu lễ công bố Thương hiệu dẫn đầu Việt Nam 2025'),
  },
  {
    id: 'khai-truong-hcm',
    kind: 'Khai trương',
    title: 'Khai trương chi nhánh TP. Hồ Chí Minh',
    when: '27/09/2025 · Gò Vấp, TP. Hồ Chí Minh',
    summary:
      'Hơn 300 khách hàng, đối tác và khách mời dự lễ khai trương cửa hàng 257A6 Nguyễn Văn Lượng. Chương trình thông tin 260 của VTV3 có mặt ghi hình, đưa tin.',
    postSlug: 'khai-truong-ecopillo-chi-nhanh-ho-chi-minh',
    image: eventWideImage('khai-truong-hcm-ngang', 'Lễ cắt băng khai trương chi nhánh Ecopillo TP. Hồ Chí Minh, có múa lân'),
  },
]
