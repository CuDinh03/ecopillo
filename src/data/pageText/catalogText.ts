import { chen, chu, definePageText, dsDong } from './define'

/**
 * Nhãn của bộ chăn ga dựng lúc nạp trang (catalog.ts): kích thước, kiểu ga, tên loại bộ, nhãn nổi trên thẻ, đơn vị đếm
 * (owner 24/11/2026: "khách tự sửa mọi chi tiết"). Chỉ chữ hiện ra đổi được; mã cỡ (160x200…), mã kiểu ga, mã bộ giữ nguyên.
 * Khẩu hiệu, mô tả, câu chuyện, "Trong bộ gồm" của từng bộ sửa ở trang sửa danh mục WooCommerce (đợt C), không ở đây.
 * Không file này import catalog.ts (catalog.ts import file này).
 */
export const { set: CATALOG_TEXT_SET, text: CATALOG_TEXT } = definePageText(
  'nhan-bo-chan-ga',
  'Bộ chăn ga: kích thước, kiểu ga, loại bộ',
  'Chữ ba kích thước giường, hai kiểu ga (ga phủ chần / ga chun chần), tên loại của từng bộ sưu tập (nhãn nhỏ trên bìa bộ, đầu tên sản phẩm như "Bộ chăn ga Lyocell Eco Rosa"), nhãn nổi trên thẻ sản phẩm, đơn vị đếm khi đặt hàng, đơn vị tiền và chữ thay ảnh phụ.',
  {
    co160: chu('Kích thước 1: chữ', '160 × 200 cm', 'Hiện ở bảng chọn kích thước trang bộ sưu tập, bước đặt hàng, tóm tắt đơn. Mã cỡ không đổi.'),
    giuong160: chu('Kích thước 1: giường', 'Giường 1m6'),
    co180: chu('Kích thước 2: chữ', '180 × 200 cm'),
    giuong180: chu('Kích thước 2: giường', 'Giường 1m8'),
    co220: chu('Kích thước 3: chữ', '200 × 220 cm'),
    giuong220: chu('Kích thước 3: giường', 'Giường 2m2'),

    gaPhu: chu('Kiểu ga: ga phủ chần', 'Ga phủ chần', 'Hiện ở bước chọn kích thước khi đặt bộ Rosa, Tera, Vera và trong tóm tắt đơn.'),
    gaChun: chu('Kiểu ga: ga chun chần', 'Ga chun chần'),

    loaiFlora: chu('Eco Flora: tên loại bộ', 'Bộ ga chun', 'Nhãn nhỏ trên bìa bộ, đầu tên sản phẩm ("Bộ ga chun Eco Flora"), bước chọn mẫu, tóm tắt đơn.'),
    loaiRosa: chu('Eco Rosa: tên loại bộ', 'Bộ chăn ga Lyocell'),
    loaiTera: chu('Eco Tera: tên loại bộ', 'Bộ chăn ga gối'),
    loaiVera: chu('Eco Vera: tên loại bộ', 'Bộ chăn ga gối'),
    loaiSweet: chu('Eco Sweet: tên loại bộ', 'Bộ ga phủ dệt Jacquard'),
    loaiLiora: chu('Eco Liora: tên loại bộ', 'Bộ chăn ga'),
    loaiDoris: chu('Eco Doris: tên loại bộ', 'Bộ ga phủ'),
    loaiChanHe: chu('Chăn hè Lyocell: tên loại', 'Chăn hè chần bông mỏng', 'Nhãn nhỏ trên bìa trang Chăn hè, bước chọn mẫu, tóm tắt đơn.'),

    loaiMoiGaPhu: chu('Bộ mới tạo trong WooCommerce, kiểu ga phủ: tên loại', 'Bộ ga phủ', 'Dùng cho bộ sưu tập Ecopillo tạo mới trong WooCommerce theo kiểu bộ đã chọn.'),
    loaiMoiGaChun: chu('Bộ mới, kiểu ga chun: tên loại', 'Bộ ga chun'),
    loaiMoiChanGa: chu('Bộ mới, kiểu chăn ga gối: tên loại', 'Bộ chăn ga gối'),
    loaiMoiChanHe: chu('Bộ mới, kiểu chăn hè: tên loại', 'Chăn hè'),

    nhanRosa: chu('Eco Rosa: nhãn nổi trên thẻ sản phẩm', 'Nhiều mẫu nhất', 'Ghi một dấu - để bỏ nhãn.'),
    nhanDoris: chu('Eco Doris: nhãn nổi trên thẻ sản phẩm', 'Dòng cao nhất', 'Ghi một dấu - để bỏ nhãn.'),

    donViBo: chu('Đơn vị đếm: bộ chăn ga', 'bộ', 'Hiện cạnh số lượng khi đặt hàng, ví dụ "2 bộ".'),
    donViChiec: chu('Đơn vị đếm: chăn hè', 'chiếc'),

    trongBoChanHeMoi: dsDong(
      'Bộ mới kiểu chăn hè: "Trong bộ gồm" mặc định',
      ['1 chăn hè chần bông mỏng'],
      'Dùng khi bộ chăn hè tạo mới trong WooCommerce chưa ghi "Trong bộ gồm". Mỗi dòng một món.',
    ),

    tienDong: chu('Đơn vị tiền sau mọi giá', 'đ', 'Ví dụ "3.500.000đ". Hiện sau mọi giá web tự ghi (thẻ sản phẩm, trang sản phẩm, đặt hàng, menu). Giá viết trong câu chữ thì sửa ở câu đó.'),
    trieu: chu('Chữ "triệu" trong giá gọn', 'triệu', 'Ví dụ "từ 3,5 triệu" ở bước chọn bộ sưu tập khi đặt hàng.'),
    anhPhu: chu(
      'Ảnh phụ của mẫu, sản phẩm: chữ thay ảnh (Google, trình đọc màn hình)',
      'ảnh {so}',
      'Web ghép sau tên mẫu, ví dụ "Eco Rosa ER25 · Xanh ngọc · ảnh 2". {so} là số thứ tự ảnh.',
    ),
  },
)

/** Chữ thay ảnh phụ thứ `so` (2, 3…): "<tên> · ảnh 2" */
export const extraPhotoAlt = (name: string, so: number): string => `${name} · ${chen(CATALOG_TEXT.anhPhu, { so })}`

/** Nhãn nổi: "-" là Ecopillo bỏ nhãn */
export const badgeText = (text: string): { badge?: string } => (text.trim() === '-' ? {} : { badge: text })
