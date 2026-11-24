import { chu, definePageText, doan } from './define'

/**
 * Chữ giá và câu thẻ "Xem theo phối màu" (đợt chữ từng trang 24/11/2026: "khách tự sửa mọi chi tiết").
 * Tên, tên ngắn, ảnh ô các nhóm sản phẩm (trước ở đây) chuyển sang bộ "Nhóm sản phẩm" (productGroups.ts, 24/11/2026: thêm, ẩn,
 * xoá, đổi thứ tự nhóm); phần Ecopillo đã lưu ở các ô cũ của bộ này vẫn được đọc làm dữ liệu ban đầu ở đó.
 * Mức giá (thêm, xoá, đổi khoảng giá): priceBands.ts. Gam màu (thêm, xoá, đổi chữ): stories.ts TONE_SET.
 */
export const { set: PRODUCT_LABELS_SET, text: PRODUCT_LABELS } = definePageText(
  'nhan-san-pham',
  'Sản phẩm: chữ giá',
  'Chữ thay giá, chữ "từ …", câu trên thẻ "Xem theo phối màu". Tên, thứ tự, ảnh các nhóm sản phẩm: bộ "Nhóm sản phẩm". Mức giá trong bộ lọc: các bộ "Mức giá …"; gam màu: bộ "Gam màu".',
  {
    giaKhiGoi: chu(
      'Chữ thay cho giá khi sản phẩm chưa có giá',
      'Báo giá khi gọi xác nhận',
      'Hiện trên thẻ sản phẩm, trang sản phẩm; menu Sản phẩm dùng cùng câu này viết thường.',
    ),
    giaTu: chu('Giá khởi điểm', 'từ {gia}', '{gia} là số tiền, ví dụ "từ 1.250.000đ". Hiện trên thẻ sản phẩm, thẻ phối màu, ô nhóm, thanh mua trên điện thoại.'),

    phoiMauGoiY: doan(
      'Kệ Bộ chăn ga: câu trên thẻ "Xem theo phối màu" (máy tính)',
      'Mỗi bộ có nhiều phối màu; bấm vào bộ để chọn, hoặc xem mọi phối màu trên một lưới.',
    ),
  },
)

