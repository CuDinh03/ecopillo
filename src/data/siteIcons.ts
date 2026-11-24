import type { EditableSet } from './liveContent'

/**
 * Biểu tượng web (favicon, biểu tượng khi lưu ra màn hình điện thoại) và ảnh chia sẻ mặc định (đợt F 24/11/2026; owner:
 * "khách phải 100% tự sửa được tất cả những gì có ở web"). Nội dung web → Giao diện → Biểu tượng web, ảnh chia sẻ.
 * Web không đọc bộ này: plugin (trang-wp.php, eco_tw_write_files) cắt ảnh Ecopillo chọn thành favicon-48.png, favicon.png,
 * apple-touch-icon.png, og-image.jpg trong uploads/ecopillo-du-lieu/tep/, quy tắc .htaccess trả các file đó thay file dựng sẵn.
 * "Trả về nội dung gốc" thì plugin xoá các file đó, web về biểu tượng, ảnh gốc.
 */
export const SITE_ICONS_SET: EditableSet = {
  khoa: 'bieu-tuong-web',
  nhom: 'Giao diện',
  ten: 'Biểu tượng web, ảnh chia sẻ',
  moTa:
    'Biểu tượng nhỏ trên tab trình duyệt và khi lưu web ra màn hình điện thoại; ảnh hiện khi gửi link web lên Facebook, Zalo (trang nào chưa có ảnh riêng). ' +
    'Trình duyệt giữ biểu tượng cũ một thời gian: mở cửa sổ ẩn danh để xem ngay.',
  kieu: 'mot',
  goc: {
    bieuTuong: { src: '/favicon.png', srcSet: '', alt: 'Biểu tượng Ecopillo' },
    anhChiaSe: { src: '/og-image.jpg', srcSet: '', alt: 'Ảnh chia sẻ Ecopillo' },
  },
  truong: [
    { khoa: 'bieuTuong', nhan: 'Biểu tượng web', kieu: 'anh', batBuoc: true, goiY: 'Ảnh vuông, tối thiểu 512×512, nền không trong suốt hoặc logo rõ trên nền trắng.' },
    { khoa: 'anhChiaSe', nhan: 'Ảnh chia sẻ mặc định', kieu: 'anh', batBuoc: true, goiY: 'Ảnh ngang 1200×630 (web tự cắt giữa ảnh theo tỉ lệ này).' },
  ],
}
