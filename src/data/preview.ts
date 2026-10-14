import { CONTACT } from './brand'

/**
 * Bản xem thử gửi Ecopillo duyệt giao diện (docs/phuong-an-dua-ban-xem-thu.md).
 * Chỉ bật khi build với VITE_BAN_XEM_THU=1 (GitHub Actions làm việc này). Build thường thì tắt,
 * nên bản chạy thật không mang theo thông báo nào dưới đây.
 */
export const IS_PREVIEW = import.meta.env.VITE_BAN_XEM_THU === '1'

export const PREVIEW_NOTICE = {
  title: 'Bản xem thử giao diện',
  intro: 'Đây là bản xem thử để Ecopillo duyệt giao diện, chưa phải website chính thức.',
  points: [
    'Đơn hàng và tin nhắn gửi trên trang này chưa được chuyển tới Ecopillo.',
    'Ô vàng viền gạch là chỗ còn chờ Ecopillo gửi hoặc xác nhận nội dung.',
    'Câu chuyện phối màu có nhãn "Bản nháp" đang chờ Ecopillo duyệt.',
    'Bài viết mới có 3 bài mẫu; bài thật sẽ lấy từ WordPress.',
  ],
  close: 'Đã hiểu, xem tiếp',
  /** Thay lời hứa "đã nhận, sẽ gọi lại" trên màn hình cảm ơn */
  notSent: `Bản xem thử: thông tin này chưa được gửi đi. Quý khách cần đặt hàng thật xin gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}.`,
} as const
