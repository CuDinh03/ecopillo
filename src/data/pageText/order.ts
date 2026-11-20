import { chu, definePageText, doan, dsDong } from './define'

/**
 * Chữ trang Đặt hàng và màn hình cảm ơn. Câu đặt cọc, tài khoản lấy từ paymentPolicy.ts / Thông tin liên hệ;
 * mức miễn phí giao tính trong src/lib/shipping.ts (đổi mức thì báo bên làm web, sửa chữ ở đây cho khớp).
 */
export const { set: ORDER_TEXT_SET, text: ORDER_TEXT } = definePageText(
  'dat-hang',
  'Trang Đặt hàng',
  'Tiêu đề, mô tả Google, các cam kết cạnh giỏ hàng, chữ bước thanh toán, quà kèm, màn hình cảm ơn sau khi đặt.',
  {
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Đặt chăn ga gối đệm Ecopillo online: chọn mẫu, chọn kích thước, nhập địa chỉ nhận. Nhân viên gọi xác nhận, miễn phí giao từ 500.000đ.',
    ),
    tieuDe: chu('Tiêu đề trang', 'Đặt hàng online'),
    camKet: dsDong('Cam kết cạnh giỏ hàng (mỗi dòng một ý)', [
      'Nhân viên gọi xác nhận trước khi giao',
      'Chuyển khoản vào tài khoản Ecopillo, miễn phí giao từ 500.000đ',
      'Kiểm hàng khi nhận, trải nghiệm chăn ga tại nhà',
      'Đổi hàng trong 7 ngày nếu còn nguyên tem mác',
    ]),
    giaTuCoNho: chu('Bước chọn bộ: dòng dưới tiêu đề', 'Giá hiển thị từ kích thước nhỏ nhất (1m6).'),
    gaPhu: chu('Bước kích thước: mô tả ga phủ', 'Trải phủ mặt đệm, buông xuống quanh thành đệm'),
    gaChun: chu('Bước kích thước: mô tả ga chun', 'Bo chun ôm quanh đệm, không xô lệch'),
    hetCo: chu('Bước kích thước: dòng về cỡ hết hàng', 'Kích thước hết hàng sẽ sớm về lại — nhắn Zalo để được báo khi có.'),
    quaNhan: chu('Quà kèm: nhãn nhỏ', 'Quà tặng kèm · Tri ân 15.000 khách hàng'),
    quaGhiChu: chu('Quà kèm: câu cuối', 'Số lượng quà có hạn.'),
    thanhToanTieuDe: chu('Bước thông tin: tiêu đề ô thanh toán', 'Chuyển khoản vào tài khoản Ecopillo'),
    mienPhiGiao: chu('Bước thông tin: chữ phí giao khi chưa chọn tỉnh', 'Miễn phí giao từ 500.000đ'),
    xemHang: doan('Bước thông tin: câu mời xem hàng', 'Muốn xem hàng tận mắt? Ghé hệ thống phân phối và showroom Ecopillo trên toàn quốc.'),
    camOnTieuDe: chu('Màn hình cảm ơn: tiêu đề', 'Ecopillo cảm ơn Quý khách!'),
    camOnChu: doan('Màn hình cảm ơn: câu chính', 'Nhân viên Ecopillo sẽ gọi điện xác nhận đơn trong thời gian sớm nhất.'),
    camOnPhu: chu('Màn hình cảm ơn: câu nhỏ', 'Quý khách chưa cần thanh toán gì lúc này.'),
    buocNhan: chu('Màn hình cảm ơn: bước 1', 'Ecopillo đã nhận đơn'),
    buocGoi: chu('Màn hình cảm ơn: bước 2', 'Nhân viên gọi xác nhận'),
    buocGiao: chu('Màn hình cảm ơn: bước 3', 'Giao hàng, kiểm hàng khi nhận'),
  },
)
