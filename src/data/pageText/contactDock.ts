import { PATHS } from '../links'
import { chu, definePageText } from './define'
import { lienKet } from './linkField'

/** Thanh liên hệ luôn hiện (dưới đáy điện thoại, góc phải máy tính) và nút lên đầu trang */
export const { set: CONTACT_DOCK_TEXT_SET, text: CONTACT_DOCK_TEXT } = definePageText(
  'nut-lien-he',
  'Nút liên hệ nổi, nút lên đầu trang',
  'Chữ trên thanh Gọi / Zalo / Messenger / Đặt hàng dưới đáy điện thoại, ba nút nổi góc phải máy tính, nút lên đầu trang. Số hotline, link Zalo, Messenger sửa ở Thông tin chung → Liên hệ.',
  {
    goiNgay: chu('Điện thoại: nút gọi', 'Gọi ngay'),
    nhanZalo: chu('Điện thoại: nút Zalo', 'Nhắn Zalo'),
    messenger: chu('Điện thoại: nút Messenger', 'Messenger'),
    datHang: chu('Điện thoại: nút Đặt hàng', 'Đặt hàng'),
    datHangLink: lienKet('Điện thoại: link nút Đặt hàng', PATHS.order),
    nhomNhan: chu('Máy tính: tên nhóm nút cho trình đọc màn hình', 'Liên hệ Ecopillo'),
    messengerChu: chu('Máy tính: chữ nút Messenger (màn từ 1440px)', 'Messenger'),
    messengerGoiY: chu('Máy tính: chữ hiện khi rê chuột lên nút Messenger', 'Nhắn Messenger'),
    messengerNhan: chu('Máy tính: nút Messenger cho trình đọc màn hình', 'Nhắn Messenger Ecopillo'),
    zaloChu: chu('Máy tính: chữ nút Zalo (màn từ 1440px)', 'Zalo'),
    zaloGoiY: chu('Máy tính: chữ hiện khi rê chuột lên nút Zalo', 'Nhắn Zalo'),
    zaloNhan: chu('Máy tính: nút Zalo cho trình đọc màn hình', 'Nhắn Zalo Ecopillo'),
    goiNhan: chu('Máy tính: nút hotline cho trình đọc màn hình', 'Gọi hotline {so}', 'Giữ {so}: chỗ chèn số hotline'),
    lenDau: chu('Nút lên đầu trang: chữ cho trình đọc màn hình', 'Lên đầu trang'),
  },
)
