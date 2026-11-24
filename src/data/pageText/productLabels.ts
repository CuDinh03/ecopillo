import { patternImage, productImage } from '../catalog'
import { anh, chu, definePageText, doan, dsDong } from './define'

/**
 * Tên nhóm sản phẩm, chữ giá, mức giá, gam màu và ảnh ô nhóm (đợt chữ từng trang 24/11/2026: "khách tự sửa mọi chi tiết").
 * Các dữ liệu này dựng lúc nạp trang (products.ts, stories.ts, productShelves.ts) và dùng cho lọc, đường link:
 * chỉ chữ hiện ra đổi được, mã nhóm, mã mức giá, mã gam và khoảng giá thật của từng mốc giữ nguyên trong code.
 */
export const { set: PRODUCT_LABELS_SET, text: PRODUCT_LABELS } = definePageText(
  'nhan-san-pham',
  'Sản phẩm: tên nhóm, giá, mức giá, gam màu',
  'Tên 4 nhóm sản phẩm (nút lọc, ô nhóm, tên kệ, nhãn nhỏ trên thẻ, đường dẫn), chữ thay giá, chữ "từ …", tên các mức giá trong bộ lọc, cụm chữ gam màu và ảnh 4 ô nhóm đầu trang Sản phẩm.',
  {
    nhomBoChanGa: chu('Nhóm Bộ chăn ga: tên', 'Bộ chăn ga', 'Hiện ở nút lọc, ô nhóm, tên kệ, nhãn nhỏ trên thẻ sản phẩm và đường dẫn trang sản phẩm.'),
    nhomBoChanGaCau: chu('Nhóm Bộ chăn ga: câu ngắn', 'Mềm mại, thoáng mát'),
    nhomChan: chu('Nhóm Chăn: tên', 'Chăn'),
    nhomChanCau: chu('Nhóm Chăn: câu ngắn', 'Nhẹ nhàng, ấm áp'),
    nhomGoi: chu('Nhóm Gối: tên', 'Gối'),
    nhomGoiCau: chu('Nhóm Gối: câu ngắn', 'Nâng niu từng giấc ngủ'),
    nhomDem: chu('Nhóm Đệm & topper: tên', 'Đệm & topper'),
    nhomDemCau: chu('Nhóm Đệm & topper: câu ngắn', 'Nâng đỡ chuẩn cột sống'),
    tenNganChan: chu('Nhóm Chăn: tên ngắn trong nút "Chỉ xem …" ở đầu kệ', 'chăn'),
    tenNganGoi: chu('Nhóm Gối: tên ngắn trong nút "Chỉ xem …" ở đầu kệ', 'gối'),
    tenNganDem: chu('Nhóm Đệm & topper: tên ngắn trong nút "Chỉ xem …" ở đầu kệ', 'đệm'),

    giaKhiGoi: chu(
      'Chữ thay cho giá khi sản phẩm chưa có giá',
      'Báo giá khi gọi xác nhận',
      'Hiện trên thẻ sản phẩm, trang sản phẩm; menu Sản phẩm dùng cùng câu này viết thường.',
    ),
    giaTu: chu('Giá khởi điểm', 'từ {gia}', '{gia} là số tiền, ví dụ "từ 1.250.000đ". Hiện trên thẻ sản phẩm, thẻ phối màu, ô nhóm, thanh mua trên điện thoại.'),

    mucGiaTatCa: dsDong(
      'Mức giá khi xem Tất cả (mỗi dòng một mốc, giữ đúng thứ tự)',
      ['Dưới 1 triệu', '1 – 3 triệu', '3 – 6 triệu', '6 – 10 triệu', 'Trên 10 triệu'],
      'Chỉ đổi chữ trên nút. Khoảng giá thật của từng mốc cố định theo thứ tự: dưới 1 triệu, 1–3, 3–6, 6–10, trên 10 triệu.',
    ),
    mucGiaBoChanGa: dsDong(
      'Mức giá nhóm Bộ chăn ga (mỗi dòng một mốc, giữ đúng thứ tự)',
      ['Dưới 5 triệu', '5 – 8 triệu', 'Trên 8 triệu'],
      'Chỉ đổi chữ trên nút. Khoảng giá thật cố định: dưới 5 triệu, 5–8, trên 8 triệu.',
    ),
    mucGiaChan: dsDong(
      'Mức giá nhóm Chăn (mỗi dòng một mốc, giữ đúng thứ tự)',
      ['Dưới 2 triệu', '2 – 4 triệu', 'Trên 4 triệu'],
      'Chỉ đổi chữ trên nút. Khoảng giá thật cố định: dưới 2 triệu, 2–4, trên 4 triệu.',
    ),
    mucGiaGoi: dsDong(
      'Mức giá nhóm Gối (mỗi dòng một mốc, giữ đúng thứ tự)',
      ['Dưới 500 nghìn', '500 nghìn – 1 triệu', 'Trên 1 triệu'],
      'Chỉ đổi chữ trên nút. Khoảng giá thật cố định: dưới 500 nghìn, 500 nghìn–1 triệu, trên 1 triệu.',
    ),
    mucGiaDem: dsDong(
      'Mức giá nhóm Đệm & topper (mỗi dòng một mốc, giữ đúng thứ tự)',
      ['Dưới 5 triệu', '5 – 10 triệu', '10 – 20 triệu', 'Trên 20 triệu'],
      'Chỉ đổi chữ trên nút. Khoảng giá thật cố định: dưới 5 triệu, 5–10, 10–20, trên 20 triệu.',
    ),

    gamXanh: chu('Gam xanh: cụm chữ trong câu', 'gam xanh', 'Ghép vào câu "Thêm … ở bộ khác", "Xem cả …" ở trang bộ sưu tập và dòng kết quả lọc.'),
    gamHong: chu('Gam hồng, đỏ cam: cụm chữ trong câu', 'gam hồng, đỏ cam'),
    gamTim: chu('Gam tím: cụm chữ trong câu', 'gam tím'),
    gamKem: chu('Gam trắng, kem: cụm chữ trong câu', 'gam trắng, kem'),
    gamXam: chu('Gam xám: cụm chữ trong câu', 'gam xám'),
    gamBe: chu('Gam cho bé: cụm chữ trong câu', 'phối màu cho bé'),

    anhNhomBoChanGa: anh('Ô nhóm Bộ chăn ga (đầu trang Sản phẩm): ảnh', patternImage('ED25', 'Bộ chăn ga')),
    anhNhomDem: anh('Ô nhóm Đệm & topper: ảnh', productImage('dem-lo-xo-tui-cao-cap-eco-luxe-2', 'Đệm & topper')),
    anhNhomChan: anh('Ô nhóm Chăn: ảnh', productImage('chan-long-vu-tu-nhien', 'Chăn')),
    anhNhomGoi: anh('Ô nhóm Gối: ảnh', productImage('ruot-goi-long-vu-tu-nhien', 'Gối')),
    phoiMauGoiY: doan(
      'Kệ Bộ chăn ga: câu trên thẻ "Xem theo phối màu" (máy tính)',
      'Mỗi bộ có nhiều phối màu; bấm vào bộ để chọn, hoặc xem mọi phối màu trên một lưới.',
    ),
  },
)

/** Chữ một mốc giá: ô Ecopillo để thiếu dòng thì dùng chữ gốc của mốc đó */
export const bandLabel = (labels: readonly string[], index: number, fallback: string): string => labels[index]?.trim() || fallback
