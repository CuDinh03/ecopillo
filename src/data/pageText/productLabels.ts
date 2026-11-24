import { patternImage, productImage } from '../catalog'
import { anh, chu, definePageText, doan } from './define'

/**
 * Tên nhóm sản phẩm, chữ giá và ảnh ô nhóm (đợt chữ từng trang 24/11/2026: "khách tự sửa mọi chi tiết").
 * Các dữ liệu này dựng lúc nạp trang (products.ts, productShelves.ts) và dùng cho lọc, đường link: chỉ chữ hiện ra đổi được,
 * mã nhóm giữ nguyên trong code (4 nhóm là khung của web: bộ lọc, kệ, đường link, menu đều theo 4 nhóm này).
 * Mức giá (thêm, xoá, đổi khoảng giá): priceBands.ts. Gam màu (thêm, xoá, đổi chữ): stories.ts TONE_SET.
 */
export const { set: PRODUCT_LABELS_SET, text: PRODUCT_LABELS } = definePageText(
  'nhan-san-pham',
  'Sản phẩm: tên nhóm, giá',
  'Tên 4 nhóm sản phẩm (nút lọc, ô nhóm, tên kệ, nhãn nhỏ trên thẻ, đường dẫn), chữ thay giá, chữ "từ …" và ảnh 4 ô nhóm đầu trang Sản phẩm. Mức giá trong bộ lọc: các bộ "Mức giá …"; gam màu: bộ "Gam màu".',
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

