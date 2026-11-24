import { chu, definePageText, doan } from './define'

/*
 * Chữ giao diện trang Sản phẩm, trang sản phẩm lẻ và trang bộ sưu tập (đợt chữ từng trang 24/11/2026:
 * "khách tự sửa mọi chi tiết", kể cả chữ đọc cho người khiếm thị). Chữ gốc là chữ đang có trên web.
 * Chỗ có {…} là chỗ web tự chèn số, tên, mã; ghi rõ trong gợi ý của từng ô.
 */

/** Trang Sản phẩm (/san-pham/): đường dẫn, bộ lọc, kệ, thẻ, số trang */
export const { set: PRODUCT_LIST_TEXT_SET, text: PRODUCT_LIST_TEXT } = definePageText(
  'san-pham-loc',
  'Trang Sản phẩm: bộ lọc, kệ, thẻ',
  'Đường dẫn đầu trang, bộ lọc (cột phải trên máy tính, bảng trượt trên điện thoại), sắp xếp, mức giá, dòng kết quả lọc, kệ từng nhóm, thẻ sản phẩm, số trang.',
  {
    duongDanTrangChu: chu('Đường dẫn: chữ "Trang chủ"', 'Trang chủ', 'Dùng ở trang Sản phẩm, trang sản phẩm lẻ và trang bộ sưu tập.'),
    duongDanSanPham: chu(
      'Đường dẫn: chữ "Sản phẩm"',
      'Sản phẩm',
      'Dùng ở trang Sản phẩm (cũng là tên tab trình duyệt), trang danh mục, trang sản phẩm lẻ và trang bộ sưu tập.',
    ),
    ariaDuongDan: chu('Tên vùng đường dẫn (trình đọc màn hình)', 'Đường dẫn'),
    ariaCamKet: chu('Tên danh sách 4 cam kết đầu trang (trình đọc màn hình)', 'Ecopillo cam kết'),

    boLoc: chu('Bộ lọc: tiêu đề, nút mở trên điện thoại', 'Bộ lọc'),
    ariaBangLoc: chu('Bảng lọc trên điện thoại: tên bảng (trình đọc màn hình)', 'Bộ lọc sản phẩm'),
    dangBat: chu('Nút Bộ lọc trên điện thoại: chữ đọc trước số lựa chọn đang bật (trình đọc màn hình)', 'đang bật'),
    xemKetQua: chu('Bảng lọc trên điện thoại: nút cuối bảng', 'Xem kết quả'),
    xoaLoc: chu('Nút "Xoá lọc"', 'Xoá lọc'),
    xoaLocMau: chu('Nút bỏ lọc màu khi đang lọc cả giá', 'Xoá lọc màu'),
    xoaLocGia: chu('Nút bỏ lọc giá', 'Xoá lọc giá'),
    loaiSanPham: chu('Bộ lọc: tên nhóm loại sản phẩm', 'Loại sản phẩm'),
    ariaDanhMuc: chu('Hàng tab loại sản phẩm (máy tính bảng): tên hàng (trình đọc màn hình)', 'Danh mục'),
    tatCa: chu('Lựa chọn "Tất cả" loại sản phẩm', 'Tất cả'),
    tatCaSanPham: chu('Dòng tóm tắt trên thanh lọc điện thoại khi xem Tất cả', 'Tất cả sản phẩm'),
    mucGia: chu('Bộ lọc: tên nhóm mức giá', 'Mức giá'),
    boSuuTap: chu('Bộ lọc: tên nhóm bộ sưu tập', 'Bộ sưu tập'),
    tatCaBo: chu('Lựa chọn "Tất cả bộ"', 'Tất cả bộ'),
    tatCaBoGhiChu: chu('Ô "Tất cả bộ" (máy tính bảng): dòng nhỏ', 'Mọi bộ sưu tập'),
    sapXep: chu('Sắp xếp: tên nhóm', 'Sắp xếp'),
    sxNoiBat: chu('Sắp xếp: Nổi bật', 'Nổi bật'),
    sxGiaTang: chu('Sắp xếp: giá tăng (danh sách xổ xuống)', 'Giá thấp đến cao'),
    sxGiaTangNgan: chu('Sắp xếp: giá tăng (nút gọn trong bộ lọc)', 'Giá tăng'),
    sxGiaGiam: chu('Sắp xếp: giá giảm (danh sách xổ xuống)', 'Giá cao đến thấp'),
    sxGiaGiamNgan: chu('Sắp xếp: giá giảm (nút gọn trong bộ lọc)', 'Giá giảm'),

    ketQuaBoVaGam: chu('Dòng kết quả: lọc cả bộ và gam màu', 'Phối màu {bo}, {gam}', '{bo} là tên bộ sưu tập, {gam} là cụm chữ gam màu.'),
    ketQuaBo: chu('Dòng kết quả: lọc theo bộ', 'Phối màu của {bo}', '{bo} là tên bộ sưu tập.'),
    ketQuaGam: chu('Dòng kết quả: lọc theo gam màu', 'Phối màu {gam}', '{gam} là cụm chữ gam màu.'),
    ketQuaChiGia: chu('Dòng kết quả: chỉ lọc giá', 'Sản phẩm'),
    ketQuaGia: chu('Dòng kết quả: có lọc giá', '{loc}, giá {muc}', '{loc} là phần đầu dòng (một trong các ô "Dòng kết quả" ở trên), {muc} là mức giá đang chọn.'),
    khongCoSanPham: chu('Khi không có sản phẩm hợp bộ lọc', 'Không có sản phẩm phù hợp.'),
    xoaBoLoc: chu('Nút bỏ hết bộ lọc khi không có sản phẩm', 'Xoá bộ lọc'),

    ariaPhanTrang: chu('Số trang: tên vùng (trình đọc màn hình)', 'Trang'),
    trangTruoc: chu('Số trang: nút trước (trình đọc màn hình)', 'Trang trước'),
    trangSau: chu('Số trang: nút sau (trình đọc màn hình)', 'Trang sau'),
    trangSo: chu('Số trang: từng nút số (trình đọc màn hình)', 'Trang {so}', '{so} là số trang.'),

    ariaNhomSanPham: chu('4 ô nhóm đầu mục Tất cả: tên vùng (trình đọc màn hình)', 'Nhóm sản phẩm'),
    xemTheoPhoiMau: chu('Kệ Bộ chăn ga: nút đầu kệ và tiêu đề thẻ cuối kệ', 'Xem theo phối màu'),
    xemTatCaPhoiMau: chu('Kệ Bộ chăn ga: dòng bấm trên thẻ cuối kệ', 'Xem tất cả phối màu'),
    chiXem: chu('Kệ Đệm, Chăn, Gối: nút đầu kệ', 'Chỉ xem {ten}', '{ten} là tên ngắn của nhóm (sửa ở "Sản phẩm: tên nhóm, giá, mức giá, gam màu").'),
    nhieuPhoiMau: chu('Thẻ trên kệ: nhãn của bộ có nhiều phối màu', 'Nhiều phối màu'),
    xemThe: chu('Thẻ sản phẩm: chữ "Xem" góc phải (máy tính)', 'Xem'),
    xemTatCaSanPham: chu('Trang danh mục (đệm lò xo, ruột gối…): nút cuối trang', 'Xem tất cả sản phẩm'),
  },
)

/** Trang sản phẩm lẻ, phần dùng chung với trang bộ sưu tập, khung xem ảnh, nút số lượng */
export const { set: PRODUCT_DETAIL_TEXT_SET, text: PRODUCT_DETAIL_TEXT } = definePageText(
  'san-pham-chi-tiet',
  'Trang sản phẩm: chọn cỡ, đặt mua, ảnh',
  'Chữ trên trang sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm) và các phần dùng chung với trang bộ sưu tập: chọn kích thước, nút đặt mua, thẻ thông tin, thanh mua trên điện thoại, dãy ảnh, khung xem ảnh toàn màn hình, nhận xét, nút số lượng.',
  {
    kichThuoc: chu('Tên nhóm chọn kích thước', 'Kích thước', 'Cũng dùng ở trang bộ sưu tập.'),
    doDay: chu('Tên nhóm chọn độ dày (đệm)', 'Độ dày'),
    baoGiaKhiGoi: chu('Ô kích thước chưa có giá: chữ thay giá', 'Báo giá khi gọi'),
    baoGiaChinhXac: chu('Chọn cỡ chưa có giá (sản phẩm chưa có giá)', 'Nhân viên báo giá chính xác khi gọi xác nhận đơn.'),
    baoGiaCo: doan(
      'Chọn cỡ chưa có giá (sản phẩm có giá các cỡ khác)',
      'Giá cỡ {co} theo độ dày và dòng đệm: nhân viên báo giá chính xác khi gọi xác nhận đơn.',
      '{co} là kích thước Quý khách vừa chọn.',
    ),
    moTaGoogleGiaKhiGoi: chu('Mô tả Google của sản phẩm chưa có giá: chữ sau "giá"', 'báo khi gọi xác nhận'),
    khongTimThay: chu('Tên tab trình duyệt khi link sản phẩm không còn', 'Không tìm thấy trang'),
    datMua: chu('Nút đặt mua', 'Đặt mua', 'Trang bộ sưu tập ghi thêm mã phối màu sau chữ này.'),
    tuVan: chu('Nút nhắn Zalo cạnh nút đặt mua', 'Tư vấn'),
    tamHetHang: chu('Phối màu hết hàng: chữ thay nút đặt mua', '{ma} tạm hết hàng', '{ma} là mã phối màu, ví dụ ER25.'),
    timDaiLy: chu('Dòng tìm đại lý: chữ gạch chân', 'Tìm đại lý gần Quý khách'),
    trongBoGom: chu('Thẻ thông tin: tiêu đề "Trong bộ gồm" (bộ chăn ga)', 'Trong bộ gồm'),
    chatLieu: chu('Thẻ thông tin: tiêu đề chất liệu', 'Chất liệu & đặc điểm'),
    giaoHang: chu('Thẻ thông tin: tiêu đề giao hàng', 'Giao hàng, đổi trả & bảo hành'),
    baoHanhTu: chu('Thẻ giao hàng: chữ trước thời hạn bảo hành', 'Bảo hành tính từ ngày mua:'),
    thongSoBaoHanh: chu(
      'Thẻ giao hàng: tên thông số dùng làm thời hạn bảo hành',
      'Bảo hành',
      'Thông số sản phẩm (WooCommerce → thuộc tính) mang tên này thì web lấy giá trị làm thời hạn bảo hành. Không có thì lấy theo nhóm sản phẩm.',
    ),
    xemTatCa: chu('Phần sản phẩm gợi ý: link "Xem tất cả"', 'Xem tất cả'),
    ariaGoiHotline: chu('Thanh mua điện thoại: nút gọi (trình đọc màn hình)', 'Gọi hotline {so}', '{so} là số hotline.'),
    ariaZalo: chu('Thanh mua điện thoại: nút Zalo (trình đọc màn hình)', 'Nhắn Zalo Ecopillo'),

    anhTruoc: chu('Dãy ảnh, khung xem ảnh: nút ảnh trước (trình đọc màn hình)', 'Ảnh trước'),
    anhSau: chu('Dãy ảnh, khung xem ảnh: nút ảnh sau (trình đọc màn hình)', 'Ảnh sau'),
    xemAnh: chu('Dãy ảnh nhỏ: từng ảnh (trình đọc màn hình)', 'Xem ảnh {so}', '{so} là số thứ tự ảnh.'),
    anhSo: chu('Dãy ảnh nhỏ: chữ khi ảnh chưa tải được', 'Ảnh {so}', '{so} là số thứ tự ảnh.'),
    ariaDayAnh: chu(
      'Dãy ảnh nhỏ: tên dãy (trình đọc màn hình)',
      'Ảnh sản phẩm, đang xem ảnh {so} trên {tong}',
      '{so} là ảnh đang xem, {tong} là số ảnh.',
    ),
    ariaKhungAnh: chu('Khung xem ảnh sản phẩm lẻ: tên khung (trình đọc màn hình)', 'Ảnh {ten}', '{ten} là tên sản phẩm.'),
    phongToAnh: chu('Nút phóng to ảnh chính (trình đọc màn hình)', 'Phóng to ảnh'),
    dong: chu('Khung xem ảnh: nút Đóng', 'Đóng'),
    goiYDienThoai: chu('Khung xem ảnh: hướng dẫn trên điện thoại', 'Chụm 2 ngón hoặc chạm 2 lần để phóng · vuốt ngang đổi ảnh'),
    goiYMayTinh: chu('Khung xem ảnh: hướng dẫn trên máy tính', 'Bấm vào ảnh để phóng, rê chuột để soi · phím ← → đổi ảnh'),
    ariaChonAnh: chu('Khung xem ảnh: dãy ảnh nhỏ (trình đọc màn hình)', 'Chọn ảnh'),

    nhanXet: chu('Nhận xét: tiêu đề', 'Nhận xét của khách'),
    soNhanXet: chu('Nhận xét: dòng cạnh điểm', '/ 5 · {so} nhận xét', '{so} là số nhận xét.'),
    soSao: chu('Nhận xét: số sao (trình đọc màn hình)', '{so} trên 5 sao', '{so} là số sao.'),
    daMuaCo: chu('Nhận xét: cỡ khách đã mua', 'Đã mua cỡ {co}', '{co} là kích thước.'),

    giamSoLuong: chu('Nút giảm số lượng (trình đọc màn hình)', 'Giảm số lượng'),
    soLuong: chu('Ô số lượng (trình đọc màn hình)', 'Số lượng'),
    tangSoLuong: chu('Nút tăng số lượng (trình đọc màn hình)', 'Tăng số lượng'),
  },
)

/** Trang bộ sưu tập (bộ chăn ga, chăn hè) và trang từng phối màu */
export const { set: COLLECTION_PAGE_TEXT_SET, text: COLLECTION_PAGE_TEXT } = definePageText(
  'trang-bo-suu-tap',
  'Trang bộ sưu tập',
  'Chữ giao diện trang bộ sưu tập và trang từng phối màu: dòng dẫn về bộ, hàng chọn màu, nút trên ảnh, kích thước hết hàng, phần cùng gam màu. Tên, câu chuyện từng bộ, từng mẫu sửa trong WooCommerce.',
  {
    dongVeBo: chu('Trang phối màu trên điện thoại: dòng dẫn về bộ', 'Bộ {ten}', '{ten} là tên bộ sưu tập.'),
    chonMauDong: chu('Trang phối màu trên điện thoại: chữ sau tên bộ', 'chọn màu'),
    chonMau: chu('Hàng chọn màu: tiêu đề trên điện thoại', 'Chọn màu'),
    cacMauSac: chu('Hàng chọn màu: tiêu đề trên máy tính', 'Các màu sắc của bộ sưu tập {ten}', '{ten} là tên bộ sưu tập.'),
    vuotNgang: chu('Hàng chọn màu: dòng nhỏ trên điện thoại', 'Vuốt ngang để xem thêm màu'),
    ariaChuong: chu(
      'Hàng chọn màu: từng thẻ (trình đọc màn hình)',
      'Chương {so}: {ten}, {mau} {ma}',
      '{so} là số thứ tự, {ten} là tên câu chuyện, {mau} là tên màu, {ma} là mã phối màu.',
    ),
    tamHet: chu('Hàng chọn màu: chữ sau mã phối màu đã hết', 'tạm hết'),
    chuongTruoc: chu('Ảnh lớn: nút phối màu trước (trình đọc màn hình)', 'Chương trước'),
    chuongSau: chu('Ảnh lớn: nút phối màu sau (trình đọc màn hình)', 'Chương sau'),
    phongToAnh: chu('Ảnh lớn: nút phóng to (trình đọc màn hình)', 'Phóng to ảnh {ma}', '{ma} là mã phối màu.'),
    ariaKhungAnh: chu('Khung xem ảnh: tên khung (trình đọc màn hình)', 'Ảnh phối màu {ma} · {mau}', '{ma} là mã phối màu, {mau} là tên màu.'),
    docTiep: chu('Câu chuyện phối màu trên điện thoại: nút mở hết', 'Đọc tiếp'),
    coHetHang: chu('Ô kích thước đã hết', 'Tạm hết hàng'),
    themCungGam: chu('Phần cùng gam màu: tiêu đề', 'Thêm {gam} ở bộ khác', '{gam} là cụm chữ gam màu (sửa ở "Sản phẩm: tên nhóm, giá, mức giá, gam màu").'),
    xemCaGam: chu('Phần cùng gam màu: link xem hết', 'Xem cả {gam}', '{gam} là cụm chữ gam màu.'),
    giongNhau: chu('Tiêu đề trên các thẻ thông tin chung', 'Giống nhau ở mọi phối màu'),
  },
)
