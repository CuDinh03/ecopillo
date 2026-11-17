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
    'Đơn hàng và tin nhắn gửi trên trang này chỉ để thử: Ecopillo không gọi lại hay giao hàng theo các đơn này.',
    'Câu chuyện phối màu có nhãn "Bản nháp" đang chờ Ecopillo duyệt.',
    'Bài viết lấy từ web cũ ngày 17/11/2026.',
  ],
  close: 'Đã hiểu, xem tiếp',
  /** Thay lời hứa "đã nhận, sẽ gọi lại" trên màn hình cảm ơn */
  notSent: `Bản xem thử: thông tin này chưa được gửi đi. Quý khách cần đặt hàng thật xin gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}.`,
} as const
