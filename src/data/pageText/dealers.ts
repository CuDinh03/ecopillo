import type { Showroom } from '../brand'
import { anh, chu, definePageText, doan, dsDong } from './define'

/**
 * Chữ khối "Điểm bán" (tìm đại lý gần tôi) ở trang Liên hệ mua hàng: nút, ô tìm, dòng tóm tắt, thẻ điểm bán, bản đồ,
 * nhãn loại điểm, giờ mở cửa. Nhãn, tiêu đề khối ở bộ "Chữ chung nhiều trang"; danh sách đại lý ở bộ "Đại lý".
 * Đợt E5 (owner 24/11/2026: "khách được tuỳ chỉnh toàn bộ bằng wp-admin tất cả các chỗ").
 */
export const { set: DEALER_TEXT_SET, text: DEALER_TEXT } = definePageText(
  'diem-ban',
  'Khối Điểm bán (tìm đại lý)',
  'Nút "Tìm đại lý gần tôi", ô chọn tỉnh, ô tìm, dòng tóm tắt, thẻ điểm bán, bản đồ, nhãn loại điểm, giờ mở cửa của khối Điểm bán (trang Liên hệ mua hàng).',
  {
    nutGanToi: chu('Nút tìm gần tôi', 'Tìm đại lý gần tôi'),
    dangTimViTri: chu('Nút tìm gần tôi: chữ khi đang tìm', 'Đang tìm vị trí…'),
    chonTinh: chu('Ô chọn tỉnh: chữ mờ', 'Chọn tỉnh/thành'),
    ganToiMoiTinh: chu('Ô chọn tỉnh: chữ mờ khi đã biết vị trí', 'Gần tôi nhất (mọi tỉnh)'),
    soDiemTinh: chu('Ô chọn tỉnh: số điểm cạnh tên tỉnh', '{so} điểm', '{so} là số điểm bán của tỉnh'),
    oTim: chu('Ô tìm: chữ mờ', 'Gõ tên đường, phường, quận cũ…'),
    khongLayViTri: doan('Dòng báo khi không lấy được vị trí', 'Không lấy được vị trí. Quý khách chọn tỉnh/thành bên dưới nhé.'),
    viTriRiengTu: doan('Dòng dưới nút tìm', 'Vị trí chỉ dùng để tìm đại lý gần Quý khách, không lưu lại.'),
    tomTatXa: chu('Tóm tắt: điểm gần nhất ở xa', 'Điểm gần nhất cách khoảng {km}', '{km} là khoảng cách, ví dụ 128 km'),
    tomTatGanTinh: chu('Tóm tắt: tỉnh chưa có điểm', 'Các điểm gần {noi} nhất', '{noi} là tên tỉnh/thành'),
    tomTatKhongThay: chu('Tóm tắt: không thấy điểm', 'Không thấy điểm nào khớp'),
    tomTatGanNhat: chu('Tóm tắt: đã biết vị trí', '{so} điểm, gần nhất cách {km}', '{so} là số điểm, {km} là khoảng cách'),
    tomTatTinh: chu('Tóm tắt: đã chọn tỉnh', '{so} điểm tại {noi}', '{so} là số điểm, {noi} là tên tỉnh/thành'),
    tomTatToanQuoc: chu('Tóm tắt: chưa chọn gì', '{so} điểm trên toàn quốc', '{so} là số điểm'),
    xemDanhSach: chu('Điện thoại: nút xem danh sách', 'Danh sách'),
    xemBanDo: chu('Điện thoại: nút xem bản đồ', 'Bản đồ'),
    chuaCoTaiNoi: chu('Chưa có đại lý: tiêu đề khi đã chọn tỉnh', '{noi} chưa có đại lý Ecopillo', '{noi} là tên tỉnh/thành'),
    chuaCoKhuVuc: chu('Chưa có đại lý: tiêu đề khi tìm gần tôi', 'Khu vực của Quý khách chưa có đại lý Ecopillo'),
    nutDatOnline: chu('Chưa có đại lý: nút đặt hàng', 'Đặt hàng online'),
    nutNhanZalo: chu('Chưa có đại lý: nút Zalo', 'Nhắn Zalo Ecopillo'),
    kinhDoanhHoi: chu('Chưa có đại lý: câu mời làm đại lý', 'Quý khách kinh doanh chăn ga tại đây?'),
    kinhDoanhLink: chu('Chưa có đại lý: chữ link làm đại lý', 'Trở thành đại lý Ecopillo'),
    hoacGheNhieu: chu('Dòng trên các điểm gần nhất (nhiều điểm)', 'Hoặc ghé {so} điểm gần nhất:', '{so} là số điểm'),
    hoacGheMot: chu('Dòng trên điểm gần nhất (một điểm)', 'Hoặc ghé điểm gần nhất:'),
    khongThayCo: chu('Không thấy điểm: câu khi gõ tìm', 'Không thấy điểm nào có “{tu}”.', '{tu} là chữ Quý khách gõ'),
    khongThayCoTai: chu('Không thấy điểm: câu khi gõ tìm trong một tỉnh', 'Không thấy điểm nào có “{tu}” tại {noi}.', '{tu} là chữ gõ, {noi} là tên tỉnh'),
    xemTatCa: chu('Không thấy điểm: chữ nút xem tất cả', 'Xem tất cả điểm'),
    diemKhac: chu('Dòng trên các điểm sau điểm gần nhất', '{so} điểm khác', '{so} là số điểm'),
    xemThem: chu('Nút xem thêm', 'Xem thêm {so} điểm', '{so} là số điểm hiện thêm'),
    ganNhat: chu('Thẻ điểm gần nhất: nhãn trên thẻ', 'Gần Quý khách nhất'),
    cachKhoang: chu('Thẻ điểm: khoảng cách', 'cách khoảng {km}', '{km} là khoảng cách'),
    nutChiDuong: chu('Thẻ điểm, bản đồ: nút chỉ đường', 'Chỉ đường'),
    nutGoi: chu('Thẻ điểm: nút gọi', 'Gọi'),
    nutZalo: chu('Thẻ điểm: nút Zalo', 'Zalo'),
    banDoGoi: chu('Bản đồ: nút gọi', 'Gọi {so}', '{so} là số điện thoại của điểm'),
    loaiVanPhong: chu('Nhãn loại điểm: văn phòng', 'Văn phòng đại diện'),
    loaiChiNhanh: chu('Nhãn loại điểm: chi nhánh', 'Chi nhánh'),
    loaiDaiLy: chu('Nhãn loại điểm: đại lý', 'Đại lý'),
    anhMacDinh: anh('Ảnh thẻ điểm chưa có ảnh', { src: '/images/video/bia-phim-sm.webp', srcSet: '', alt: 'Ecopillo' }),
    ghiChuVanPhong: chu('Văn phòng, chi nhánh: ghi chú trên thẻ', 'Có trưng bày đệm, gối để nằm thử'),
    gioMoVanPhong: chu('Văn phòng, chi nhánh: giờ mở cửa', '08:30', 'Dạng 08:30'),
    gioDongVanPhong: chu('Văn phòng, chi nhánh: giờ đóng cửa', '22:00', 'Dạng 22:00'),
    chuaBaoGio: chu('Giờ: chữ khi đại lý chưa báo giờ', 'Quý khách gọi trước khi ghé'),
    dangMo: chu('Giờ: đang mở cửa', 'Đang mở cửa · đến {gio}', '{gio} là giờ đóng cửa'),
    daDongHomNay: chu('Giờ: đã đóng, mở lại trong ngày', 'Đã đóng cửa, mở lại {gio}', '{gio} là giờ mở cửa'),
    daDongMoLai: chu('Giờ: đã đóng, mở lại hôm khác', 'Đã đóng cửa, mở lại {gio} {khi}', '{gio} là giờ mở cửa, {khi} là "sáng mai" hoặc tên thứ'),
    sangMai: chu('Giờ: chữ "sáng mai"', 'sáng mai'),
    tamNghi: chu('Giờ: điểm nghỉ cả tuần', 'Tạm nghỉ'),
    gioHangNgay: chu('Giờ: mở hằng ngày', '{mo}–{dong} hằng ngày', '{mo}, {dong} là giờ mở, giờ đóng'),
    gioNgayNghi: chu('Giờ: có ngày nghỉ', '{mo}–{dong}, nghỉ {ngay}', '{mo}, {dong} là giờ mở, giờ đóng; {ngay} là các ngày nghỉ'),
    thu: dsDong(
      'Tên các ngày trong tuần (đúng 7 dòng, bắt đầu Chủ nhật)',
      ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
      'Đúng 7 dòng: Chủ nhật, Thứ hai … Thứ bảy',
    ),
    soDiemHon: chu('Trang chủ: số điểm (từ 20 điểm)', 'Hơn {so} điểm trên toàn quốc', '{so} là số điểm làm tròn xuống hàng chục'),
    soDiem: chu('Trang chủ: số điểm (dưới 20 điểm)', '{so} điểm trên toàn quốc', '{so} là số điểm'),
    // Chữ cho trình đọc màn hình, chữ thay ảnh, tên bản đồ (không hiện trên màn hình)
    xemAnhDoc: chu('Thẻ điểm: nút xem ảnh (trình đọc màn hình)', 'Xem {so} ảnh {ten}', '{so} là số ảnh, {ten} là tên điểm'),
    khungAnhDoc: chu('Thẻ điểm: tên khung xem ảnh (trình đọc màn hình)', 'Ảnh {ten}', '{ten} là tên điểm'),
    anhThuTu: chu('Thẻ điểm: chữ thay từng ảnh', '{ten}, ảnh {so}', '{ten} là tên điểm, {so} là số thứ tự ảnh'),
    banDoTen: chu('Bản đồ: tên khung bản đồ (trình đọc màn hình)', 'Bản đồ {ten}, {diaChi}', '{ten} là tên điểm, {diaChi} là địa chỉ'),
    moOTimDoc: chu('Điện thoại: nút mở ô tìm (trình đọc màn hình)', 'Tìm theo tên đường, phường, quận'),
    dongOTimDoc: chu('Điện thoại: nút đóng ô tìm (trình đọc màn hình)', 'Đóng ô tìm theo tên đường'),
    cachXemDoc: chu('Điện thoại: hàng nút Danh sách / Bản đồ (trình đọc màn hình)', 'Cách xem'),
    chonDiemDoc: chu('Điện thoại: hàng chọn điểm trên bản đồ (trình đọc màn hình)', 'Chọn điểm trên bản đồ'),
    oTimDoc: chu('Ô tìm: tên ô cho trình đọc màn hình', 'Gõ tên đường, phường hoặc quận'),
  },
)

/**
 * Chữ loại của văn phòng, chi nhánh (ô "Loại" ở bộ Văn phòng, chi nhánh là mã cố định): dùng nhãn loại điểm ở trên,
 * để trang chủ, trang Liên hệ, chân trang hiện đúng chữ Ecopillo sửa
 */
export const showroomKindText = (kind: Showroom['kind']): string =>
  kind === 'Văn phòng đại diện' ? DEALER_TEXT.loaiVanPhong : kind === 'Chi nhánh' ? DEALER_TEXT.loaiChiNhanh : kind === 'Đại lý' ? DEALER_TEXT.loaiDaiLy : kind
