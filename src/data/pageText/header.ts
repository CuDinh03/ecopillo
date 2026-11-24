import { PATHS } from '../links'
import { anh, chu, definePageText } from './define'
import { lienKet } from './linkField'

/** Chữ, link, logo ở thanh đầu trang và menu điện thoại (các mục menu sửa ở Giao diện → Menu chính) */
export const { set: HEADER_TEXT_SET, text: HEADER_TEXT } = definePageText(
  'dau-trang',
  'Đầu trang, logo, menu điện thoại',
  'Logo, nút Đặt hàng, nút "Thêm" của thanh máy tính, phần dưới menu điện thoại, chữ cho trình đọc màn hình. Các mục menu sửa ở Giao diện → Menu chính.',
  {
    // WebP nhẹ hơn PNG gốc 75 KB (đo LCP 24/10/2026); PNG gốc giữ cho ảnh chia sẻ
    logo: anh(
      'Logo (đầu trang, chân trang)',
      {
        src: '/images/brand/logo-ecopillo-720.webp',
        srcSet: '/images/brand/logo-ecopillo-400.webp 400w, /images/brand/logo-ecopillo-720.webp 720w',
        alt: 'Ecopillo Eternal – Nâng niu giấc mơ xanh',
      },
      'Ảnh ngang, nền trong suốt, rộng khoảng 720px. Ô mô tả ảnh là chữ thay ảnh cho trình đọc màn hình.',
    ),
    logoChu: chu('Chữ hiện khi ảnh logo tải hỏng', 'Ecopillo'),
    logoNhan: chu('Logo: chữ cho trình đọc màn hình', 'Ecopillo – về trang chủ'),
    boQua: chu('Link "bỏ qua" (hiện khi dùng phím Tab)', 'Bỏ qua tới nội dung'),
    datHang: chu('Nút Đặt hàng trên thanh', 'Đặt hàng'),
    datHangLink: lienKet('Link nút Đặt hàng (thanh đầu trang, nút lớn cuối menu điện thoại)', PATHS.order),
    them: chu('Nút gom mục ở máy tính nhỏ (1024–1279px)', 'Thêm'),
    dieuHuong: chu('Thanh menu máy tính: tên cho trình đọc màn hình', 'Điều hướng chính'),
    menuDiDong: chu('Menu điện thoại: tên cho trình đọc màn hình', 'Menu di động'),
    moTim: chu('Nút kính lúp: chữ cho trình đọc màn hình', 'Mở ô tìm'),
    moMenu: chu('Nút menu điện thoại (đang đóng): chữ cho trình đọc màn hình', 'Mở menu'),
    dongMenu: chu('Nút menu điện thoại (đang mở): chữ cho trình đọc màn hình', 'Đóng menu'),
    datHangOnline: chu('Menu điện thoại: nút lớn cuối menu', 'Đặt hàng online'),
    goiNgay: chu('Menu điện thoại: nút gọi', 'Gọi ngay'),
    nhanZalo: chu('Menu điện thoại: nút Zalo', 'Nhắn Zalo'),
    hotlineZalo: chu('Menu điện thoại: chữ trước số hotline', 'Hotline / Zalo'),
  },
)
