import { DEPOSIT_SHORT, NO_DEPOSIT } from '../paymentPolicy'
import { chu, definePageText, doan } from './define'

/**
 * Chữ nhỏ của luồng đặt hàng (đợt chữ từng trang, owner: "khách tự sửa được mọi chi tiết, kể cả nhỏ nhất"):
 * các bước chọn mẫu / kích thước, form nhận hàng và lời báo lỗi, tóm tắt đơn, màn hình cảm ơn.
 * Tiêu đề, cam kết, quà kèm và lời cảm ơn chính vẫn ở bộ "Trang Đặt hàng" (order.ts, giữ nguyên khoá).
 * Chữ có {…} là chỗ web tự chèn số / tên: giữ nguyên chỗ chèn khi sửa (hàm chen trong define.ts).
 * Không thuộc các bộ này: tên tỉnh và mức phí giao (bộ "Giao hàng: tỉnh, phí", src/lib/shipping.ts), tên kiểu ga, đơn vị, quà của bộ sưu tập (catalog.ts),
 * số tài khoản, hotline, giờ làm việc (Thông tin liên hệ).
 */

/** Bước 1, 2 (chọn mẫu, kích thước), thanh nút dưới và phần chọn của đơn sản phẩm lẻ */
export const { set: ORDER_STEPS_TEXT_SET, text: ORDER_STEPS_TEXT } = definePageText(
  'dat-hang-cac-buoc',
  'Đặt hàng: các bước chọn',
  'Thanh ba bước, bước chọn bộ sưu tập và mẫu, bước kích thước và số lượng, nút đi tiếp, lời nhắc khi chưa chọn đủ, phần chọn kích thước của đơn sản phẩm lẻ (ruột gối, đệm…).',
  {
    trangChu: chu('Đầu trang: link quay về (trên tiêu đề)', 'Trang chủ'),
    canTuVan: chu('Đầu trang: chữ trước số hotline', 'Cần tư vấn?'),
    coZalo: chu('Đầu trang: chữ sau số hotline', '(có Zalo)'),
    nhanBuoc: chu('Thanh ba bước: tên đọc cho người khiếm thị', 'Các bước đặt hàng'),
    buoc1: chu('Thanh ba bước: bước 1 (máy tính)', 'Chọn bộ sưu tập & mẫu'),
    buoc1Ngan: chu('Thanh ba bước: bước 1 (điện thoại)', 'Chọn mẫu'),
    buoc2: chu('Thanh ba bước: bước 2 (máy tính)', 'Kích thước & số lượng'),
    buoc2Ngan: chu('Thanh ba bước: bước 2 (điện thoại)', 'Kích thước'),
    buoc3: chu('Thanh ba bước: bước 3 (máy tính)', 'Thông tin nhận hàng'),
    buoc3Ngan: chu('Thanh ba bước: bước 3 (điện thoại)', 'Nhận hàng'),
    quayLai: chu('Nút quay lại bước trước', 'Quay lại bước {so}', '{so} là số bước, web tự điền'),

    nutBuoc1: chu('Nút đi tiếp ở bước 1', 'Chọn kích thước'),
    nutBuoc2: chu('Nút đi tiếp ở bước 2', 'Nhập thông tin nhận'),
    nutDatHang: chu('Nút gửi đơn (bước 3 và đơn sản phẩm lẻ)', 'Đặt hàng'),
    nutDangGui: chu('Nút gửi đơn: lúc đang gửi', 'Đang gửi đơn…'),
    goiYChonMau: chu('Cạnh nút đi tiếp: khi đã chọn bộ, chưa chọn mẫu', 'Chọn một mẫu để tiếp tục'),
    goiYChonBo: chu('Cạnh nút đi tiếp: khi chưa chọn bộ sưu tập', 'Chọn bộ sưu tập và mẫu'),
    goiYChonCo: chu('Cạnh nút đi tiếp: khi chưa chọn kích thước', 'Chọn kích thước còn hàng'),
    nhacChonMau: chu('Lời nhắc khi bấm tiếp mà chưa chọn mẫu', 'Quý khách chọn một mẫu để tiếp tục.'),
    nhacChonBo: chu('Lời nhắc khi bấm tiếp mà chưa chọn bộ sưu tập', 'Quý khách chọn bộ sưu tập và mẫu để tiếp tục.'),
    nhacChonCo: chu('Lời nhắc khi bấm tiếp mà chưa chọn kích thước', 'Quý khách chọn một kích thước còn hàng để tiếp tục.'),
    donHang: chu(
      'Khung báo gửi không được: tên thứ chưa gửi được',
      'đơn hàng',
      'Hiện trong câu "Chưa gửi được đơn hàng. Thông tin Quý khách nhập vẫn còn…"',
    ),

    chonBo: chu('Bước 1: tiêu đề phần chọn bộ sưu tập', 'Chọn bộ sưu tập'),
    giaTu: chu('Bước 1: giá trên ô bộ sưu tập', 'từ {gia}', '{gia} là giá thấp nhất của bộ, web tự điền'),
    coQua: chu('Bước 1: nhãn ô bộ sưu tập có quà', 'Có quà'),
    chonMau: chu('Bước 1: tiêu đề phần chọn mẫu', 'Chọn mẫu', 'Web tự thêm " · tên bộ sưu tập" phía sau'),
    chuaChonBo: chu('Bước 1: câu khi chưa chọn bộ sưu tập', 'Chọn một bộ sưu tập ở trên để xem các mẫu.'),
    anhMau: chu('Bước 1: chữ trên khung ảnh mẫu khi chưa có ảnh', 'Ảnh mẫu {ma}', '{ma} là mã mẫu, web tự điền'),
    nhanMoi: chu('Bước 1: nhãn mẫu mới', 'Mới'),
    hetHang: chu('Bước 1 và 2: nhãn tạm hết hàng (mẫu, kích thước)', 'Tạm hết hàng'),
    motSoCoHet: chu('Bước 1: dòng dưới mẫu có cỡ hết hàng', 'Một số kích thước tạm hết'),
    xemThemMau: chu('Bước 1: nút hiện thêm mẫu', 'Xem thêm mẫu'),
    xemAnhThat: doan(
      'Bước 1: câu cuối (trước số Zalo)',
      'Muốn xem ảnh thật từng mẫu hoặc mẫu khác tại hệ thống phân phối Ecopillo? Nhắn Zalo',
      'Web tự thêm số hotline phía sau',
    ),

    kieuGa: chu('Bước 2: tiêu đề phần kiểu ga', 'Kiểu ga'),
    chuaCoGiaChun: doan(
      'Bước 2: câu khi mẫu chưa có giá ga chun chần',
      'Mẫu {ma} chưa có giá ga chun chần: nhân viên báo giá khi gọi xác nhận.',
      '{ma} là mã mẫu, web tự điền',
    ),
    chonKichThuoc: chu('Bước 2: tiêu đề phần chọn kích thước', 'Chọn kích thước'),
    chuMau: chu('Bước 2: chữ trước mã mẫu (dòng dưới tiêu đề)', 'mẫu', 'Dòng hiện: tên bộ sưu tập · mẫu ER25 (Kem)'),
    soLuong: chu('Bước 2 và đơn sản phẩm lẻ: tiêu đề phần số lượng', 'Số lượng'),
    canNhieuHon: chu(
      'Bước 2: câu khi chọn số lượng tối đa',
      'Cần nhiều hơn {so} {donVi} cho khách sạn, resort?',
      '{so} là số lượng tối đa, {donVi} là đơn vị (bộ, chiếc…), web tự điền',
    ),
    goiBaoGia: chu('Bước 2: link gọi sau câu số lượng tối đa', 'Gọi nhận báo giá'),
    quaTangKem: chu('Bước 2: tên khung quà đọc cho người khiếm thị', 'Quà tặng kèm'),
    quaTheoBo: chu('Bước 2: dòng quà theo số bộ', '{qua} × {so} bộ.', '{qua} là tên quà mỗi bộ, {so} là số bộ, web tự điền'),
    tamTinhSoLuong: chu('Bước 2: dòng tạm tính', 'Tạm tính ({so} {donVi})', '{so} là số lượng, {donVi} là đơn vị, web tự điền'),

    leXacNhan: chu('Đơn sản phẩm lẻ: câu dưới tiêu đề (trước "Cần tư vấn?")', 'Nhân viên gọi xác nhận đơn trước khi giao.'),
    leKichThuoc: chu('Đơn sản phẩm lẻ: tên ô chọn kích thước', 'Kích thước', 'Sản phẩm có tên ô riêng trong dữ liệu sản phẩm thì dùng tên đó'),
    leDoDay: chu('Đơn sản phẩm lẻ: tên ô chọn độ dày (đệm)', 'Độ dày'),
    leGoiY: chu('Đơn sản phẩm lẻ: cạnh nút Đặt hàng khi chưa chọn', 'Chọn {luaChon} để tiếp tục', '{luaChon} là tên ô chọn (viết thường), web tự điền'),
    leBaoGia: chu('Đơn sản phẩm lẻ: dưới lựa chọn chưa có giá', 'Báo giá khi gọi'),
    leGiaKhiGoi: chu('Đơn sản phẩm lẻ, thanh dưới điện thoại: khi chưa có giá', 'Giá báo khi gọi xác nhận'),
  },
)

/** Bước 3: form nhận hàng, lời báo lỗi từng ô, ô thanh toán */
export const { set: ORDER_CUSTOMER_TEXT_SET, text: ORDER_CUSTOMER_TEXT } = definePageText(
  'dat-hang-nhan-hang',
  'Đặt hàng: thông tin nhận hàng',
  'Bước 3 của trang Đặt hàng (và phần dưới đơn sản phẩm lẻ): tên các ô, chữ mờ trong ô, lời báo khi nhập sai, ô thanh toán, câu đồng ý cuối form.',
  {
    tieuDe: chu('Tiêu đề phần nhận hàng', 'Thông tin nhận hàng'),
    khongBatBuoc: chu('Chữ sau tên ô không bắt buộc', '(không bắt buộc)'),
    oTen: chu('Ô họ tên: tên ô', 'Họ và tên người nhận'),
    oTenMau: chu('Ô họ tên: chữ mờ trong ô', 'Nguyễn Thị Lan'),
    oSdt: chu('Ô số điện thoại: tên ô', 'Số điện thoại'),
    oSdtMau: chu('Ô số điện thoại: chữ mờ trong ô', '09xx xxx xxx'),
    oSdtGoiY: chu('Ô số điện thoại: dòng nhỏ dưới ô', 'Nhân viên sẽ gọi số này để xác nhận đơn.'),
    oTinh: chu('Ô tỉnh / thành: tên ô', 'Tỉnh / thành phố'),
    oTinhMau: chu('Ô tỉnh / thành: chữ khi chưa chọn', 'Chọn tỉnh/thành nhận hàng'),
    oDiaChi: chu('Ô địa chỉ: tên ô', 'Địa chỉ nhận hàng'),
    oDiaChiMau: chu('Ô địa chỉ: chữ mờ trong ô', 'Số nhà, tên đường, phường/xã'),
    oGhiChu: chu('Ô ghi chú: tên ô', 'Ghi chú cho Ecopillo'),
    oGhiChuMau: chu('Ô ghi chú: chữ mờ trong ô', 'Ví dụ: giao giờ hành chính, gói quà cưới, gọi trước khi giao…'),

    loiTen: chu('Báo lỗi: chưa nhập họ tên', 'Vui lòng nhập họ tên người nhận.'),
    loiSdt: chu(
      'Báo lỗi: số điện thoại sai',
      'Số điện thoại chưa đúng, ví dụ {so}.',
      '{so} là hotline chính ở Thông tin liên hệ, web tự điền',
    ),
    loiTinh: chu('Báo lỗi: chưa chọn tỉnh / thành', 'Vui lòng chọn tỉnh/thành nhận hàng.'),
    loiDiaChi: chu('Báo lỗi: địa chỉ quá ngắn', 'Vui lòng nhập số nhà, đường, phường/xã.'),

    thanhToan: chu('Tiêu đề phần thanh toán', 'Thanh toán'),
    mienPhiGiaoHang: chu('Ô thanh toán: khi đơn được miễn phí giao', 'Miễn phí giao hàng'),
    phiGiao: chu('Ô thanh toán: khi đơn mất phí giao', 'Phí giao {phi}', '{phi} là số tiền phí giao, web tự điền'),
    datCoc: doan(
      'Ô thanh toán: câu đặt cọc (dưới số tài khoản)',
      `${NO_DEPOSIT} ${DEPOSIT_SHORT}: nhân viên báo khi gọi xác nhận đơn.`,
    ),
    dongY: doan(
      'Câu đồng ý cuối form (trước link chính sách)',
      'Khi bấm “Đặt hàng”, Quý khách đồng ý để Ecopillo dùng thông tin trên để gọi xác nhận và giao hàng, theo',
    ),
    linkChinhSach: chu('Câu đồng ý: chữ link chính sách', 'chính sách bảo vệ thông tin'),
  },
)

/** Khung tóm tắt đơn, thanh dưới điện thoại, màn hình cảm ơn, thời gian giao */
export const { set: ORDER_SUMMARY_TEXT_SET, text: ORDER_SUMMARY_TEXT } = definePageText(
  'dat-hang-tom-tat',
  'Đặt hàng: tóm tắt đơn và cảm ơn',
  'Khung "Đơn của Quý khách" cạnh form, thanh dưới trên điện thoại, chữ thời gian giao theo vùng, màn hình cảm ơn sau khi đặt (bảng chi tiết đơn, nút cuối).',
  {
    tenKhung: chu('Khung tóm tắt: tên đọc cho người khiếm thị', 'Tóm tắt đơn hàng'),
    tieuDe: chu('Khung tóm tắt: tiêu đề', 'Đơn của Quý khách'),
    chuaChon: chu('Khung tóm tắt: khi chưa chọn gì', 'Chưa chọn sản phẩm.'),
    kichThuoc: chu('Khung tóm tắt: dòng Kích thước', 'Kích thước'),
    soLuong: chu('Khung tóm tắt: dòng Số lượng', 'Số lượng'),
    donGia: chu('Khung tóm tắt: dòng Đơn giá', 'Đơn giá'),
    quaTang: chu('Khung tóm tắt: dòng Quà tặng', 'Quà tặng'),
    tamTinh: chu('Khung tóm tắt và thanh dưới điện thoại: chữ Tạm tính', 'Tạm tính'),
    phiGiao: chu('Khung tóm tắt: dòng Phí giao hàng', 'Phí giao hàng'),
    phiGiaoSau: chu('Khung tóm tắt: phí giao khi chưa tới bước nhận hàng', 'Tính ở bước nhận hàng'),
    mienPhi: chu('Khung tóm tắt và màn hình cảm ơn: phí giao bằng 0', 'Miễn phí'),
    thanhToan: chu('Khung tóm tắt: dòng Thanh toán', 'Thanh toán'),
    cachThanhToan: chu('Khung tóm tắt: cách thanh toán', 'Chuyển khoản khi nhận hàng'),
    tongCong: chu('Khung tóm tắt và thanh dưới điện thoại: chữ Tổng cộng', 'Tổng cộng'),
    giaKhiGoi: chu('Chỗ giá khi chưa có giá (đệm theo kích thước…)', 'Báo khi gọi xác nhận'),
    chuaChonMau: chu('Khung tóm tắt: dòng mẫu khi chưa chọn mẫu', 'Chưa chọn mẫu'),
    chuaChonCo: chu('Khung tóm tắt (sản phẩm lẻ): khi chưa chọn kích thước', 'Chưa chọn kích thước'),
    motCo: chu('Khung tóm tắt (sản phẩm lẻ): sản phẩm chỉ có một cỡ', 'Một cỡ'),
    donViTam: chu('Đơn vị của đệm', 'tấm'),
    donViChiec: chu('Đơn vị của ruột gối, ruột chăn, topper…', 'chiếc'),
    anhMa: chu('Chữ trên khung ảnh khi chưa có ảnh mẫu', 'Ảnh {ma}', '{ma} là mã mẫu, web tự điền'),
    anhBo: chu('Chữ trên khung ảnh khi chưa chọn mẫu', 'Ảnh bộ sưu tập'),

    giaoTrongNgay: chu('Thời gian giao: nội thành Hà Nội, TP. HCM', 'Trong ngày'),
    giaoPhiaBac: chu('Thời gian giao: phía Bắc (cả ngoại thành Hà Nội)', '2–3 ngày'),
    giaoPhiaNam: chu('Thời gian giao: phía Nam (cả ngoại thành TP. HCM)', '3–5 ngày'),
    giaoDuKien: chu('Dưới khung tóm tắt: chữ trước thời gian giao', 'Giao dự kiến:'),
    goiHotline: chu('Thanh dưới điện thoại: tên nút gọi đọc cho người khiếm thị', 'Gọi hotline {so}', '{so} là hotline, web tự điền'),
    nhanZalo: chu('Thanh dưới điện thoại: tên nút Zalo đọc cho người khiếm thị', 'Nhắn Zalo Ecopillo'),

    daNhanMa: chu('Cảm ơn: dòng nhỏ trên tiêu đề', 'Đã nhận đơn · Mã {ma}', '{ma} là mã đơn, web tự điền'),
    buocSo: chu('Cảm ơn: nhãn trên ba bước', 'Bước {so}', '{so} là số bước, web tự điền'),
    maDon: chu('Cảm ơn: bước 1, dòng dưới', 'Mã đơn {ma}', '{ma} là mã đơn, web tự điền'),
    goiToiSo: chu('Cảm ơn: bước 2, chữ trước số điện thoại', 'Gọi tới số'),
    trongGio: chu('Cảm ơn: bước 2, chữ sau số điện thoại', 'trong giờ làm việc ({gio})', '{gio} là giờ làm việc ở Thông tin liên hệ, web tự điền'),
    baoGiaTheoCo: chu('Cảm ơn: bước 2, thêm khi đơn chưa có giá', ', báo giá chính xác theo kích thước'),
    duKienGiao: chu('Cảm ơn: bước 3, dòng dưới', 'Dự kiến {thoiGian} sau khi xác nhận', '{thoiGian} là thời gian giao (viết thường), web tự điền'),
    theoKhuVuc: chu('Cảm ơn: bước 3, khi chưa biết thời gian giao', 'theo khu vực'),
    ctKichThuoc: chu('Cảm ơn, bảng chi tiết: Kích thước', 'Kích thước'),
    ctSoLuong: chu('Cảm ơn, bảng chi tiết: Số lượng', 'Số lượng'),
    ctQua: chu('Cảm ơn, bảng chi tiết: Quà tặng kèm', 'Quà tặng kèm'),
    ctThanhToan: chu('Cảm ơn, bảng chi tiết: Thanh toán', 'Thanh toán'),
    ctChuyenKhoan: chu('Cảm ơn, bảng chi tiết: cách thanh toán', 'Chuyển khoản: {taiKhoan}', '{taiKhoan} là dòng tài khoản ở Thông tin liên hệ, web tự điền'),
    ctNguoiNhan: chu('Cảm ơn, bảng chi tiết: Người nhận', 'Người nhận'),
    ctGiaoDen: chu('Cảm ơn, bảng chi tiết: Giao đến', 'Giao đến'),
    ctGhiChu: chu('Cảm ơn, bảng chi tiết: Ghi chú', 'Ghi chú'),
    ctThoiGian: chu('Cảm ơn, bảng chi tiết: Thời gian giao dự kiến', 'Thời gian giao dự kiến'),
    ctTamTinh: chu('Cảm ơn, bảng chi tiết: Tạm tính', 'Tạm tính'),
    ctPhiGiao: chu('Cảm ơn, bảng chi tiết: Phí giao hàng', 'Phí giao hàng'),
    ctTong: chu('Cảm ơn, bảng chi tiết: Tổng thanh toán', 'Tổng thanh toán'),
    canDoi: chu('Cảm ơn: câu trên nút liên hệ (trước số hotline)', 'Cần đổi thông tin hoặc giao gấp? Gọi hoặc nhắn Zalo'),
    datThem: chu('Cảm ơn: nút đặt đơn khác', 'Đặt thêm đơn khác'),
    veTrangChu: chu('Cảm ơn: nút về trang chủ', 'Về trang chủ'),
  },
)
