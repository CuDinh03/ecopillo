import { chu, definePageText, doan, dsDong } from './define'

/**
 * Chữ chung của sản phẩm dựng lúc nạp trang (products.ts): các dòng chi tiết của bộ chăn ga, dòng "Đặt ngay trên web…"
 * cuối phần chi tiết sản phẩm lẻ, chữ các lựa chọn khi đặt (owner 24/11/2026: "khách tự sửa mọi chi tiết").
 * Mã lựa chọn (45x65, 160x200, theo-tu-van…) giữ nguyên, chỉ chữ hiện ra đổi được.
 * Sản phẩm lẻ đã tích "Giao diện mới dùng tên, ảnh, mô tả" trong WooCommerce thì phần chi tiết lấy từ Woo, không dùng các dòng ở đây.
 * Không file này import products.ts (products.ts import file này).
 */
export const { set: PRODUCT_COPY_SET, text: PRODUCT_COPY } = definePageText(
  'chu-san-pham',
  'Sản phẩm: dòng chi tiết chung, lựa chọn khi đặt',
  'Các dòng chi tiết dưới giá ở trang mọi bộ chăn ga, chăn hè Lyocell; dòng "Đặt ngay trên web…" cuối chi tiết sản phẩm lẻ; chữ các lựa chọn cỡ gối, divan, đệm tròn, đệm Nano Comfort, tên ô chọn mẫu.',
  {
    chiTietBo: dsDong(
      'Bộ chăn ga, chăn hè Lyocell: các dòng chi tiết (mỗi dòng một ý)',
      [
        'Vải Lyocell nhập khẩu, dệt từ sợi gỗ tự nhiên: mềm, mát, thoáng khí, lành tính với da nhạy cảm.',
        'Họa tiết chần thêu độc quyền, đường may 4 mũi/cm.',
        'Nhận may theo kích thước riêng: gọi hoặc nhắn Zalo để báo giá.',
      ],
      'Hiện ở trang mọi bộ sưu tập và bộ Ecopillo tạo mới trong WooCommerce.',
    ),
    chiTietSweet: chu('Eco Sweet: dòng thêm (chèn sau dòng thứ hai)', 'Hoa văn dệt Jacquard nổi khối.'),
    ghiChuDat: doan(
      'Sản phẩm lẻ: dòng cuối phần chi tiết',
      'Đặt ngay trên web, nhân viên gọi xác nhận trước khi giao. Giao cùng chính sách như bộ chăn ga.',
      'Hiện ở ruột gối, ruột chăn, vỏ gối, chăn hè E-Cool và sản phẩm Ecopillo đăng mới trong WooCommerce.',
    ),

    goi45: chu('Ruột gối: lựa chọn cỡ nhỏ', '45 × 65 cm'),
    goi50: chu('Ruột gối: lựa chọn cỡ lớn', '50 × 70 cm'),
    co120: chu('Divan: lựa chọn cỡ 120', '120 × 200 cm', 'Ba cỡ còn lại của divan dùng chữ kích thước ở bộ "Bộ chăn ga: kích thước, kiểu ga, loại bộ".'),
    co140: chu('Divan: lựa chọn cỡ 140', '140 × 200 cm'),
    demTron200Mong: chu('Đệm tròn: lựa chọn 1', 'Ø 200 cm · dày 24 cm'),
    demTron200Day: chu('Đệm tròn: lựa chọn 2', 'Ø 200 cm · dày 28 cm'),
    demTron220Day: chu('Đệm tròn: lựa chọn 3', 'Ø 220 cm · dày 28 cm'),
    nhanCoDoDay: chu('Đệm tròn: tên ô chọn', 'Cỡ và độ dày'),
    nhanMau: chu('Chăn đông kiểu Hàn: tên ô chọn', 'Mẫu'),
    theoTuVan: chu('Đệm Nano Comfort: chữ lựa chọn duy nhất', 'Theo tư vấn'),
  },
)
