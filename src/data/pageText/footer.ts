import { BRAND } from '../brand'
import { NEAR_ME_URL } from '../dealers'
import { PATHS } from '../links'
import { anh, chu, definePageText, doan } from './define'
import { lienKet } from './linkField'

/** Chữ chân trang (liên hệ lấy từ bộ Thông tin liên hệ, cột Khám phá từ Menu chính, cột Chính sách từ Menu chính sách) */
export const { set: FOOTER_TEXT_SET, text: FOOTER_TEXT } = definePageText(
  'chan-trang',
  'Chân trang',
  'Tên công ty, câu giới thiệu dưới logo, tên các cột, chữ cạnh số điện thoại, dòng chứng nhận, dòng cam kết cuối trang, logo Bộ Công Thương. Các link cột "Khám phá" sửa ở Giao diện → Menu chính.',
  {
    // Owner 18/11/2026: "…nâng niu giấc ngủ của hàng trăm nghìn gia đình Việt"
    gioiThieu: doan('Câu giới thiệu dưới logo (sau tên công ty)', 'Chăn ga gối đệm cao cấp, hơn 15 năm nâng niu giấc ngủ của hàng trăm nghìn gia đình Việt.'),
    chungNhan: chu('Dòng chứng nhận (sau © năm, tên công ty)', 'Đạt chứng nhận ISO 9001:2015 và TQC.'),
    camKet: chu('Dòng cam kết cuối trang', 'Chỉ đổi hàng, không trả hàng hoàn tiền · Kiểm hàng khi nhận · Thanh toán chuyển khoản'),
    anhBoCongThuong: anh('Logo đã thông báo Bộ Công Thương', {
      src: '/images/partners/bo-cong-thuong.png',
      srcSet: '',
      alt: 'Đã thông báo Bộ Công Thương',
    }),
    congTy: chu('Tên công ty (dưới logo, dòng ©)', BRAND.company),
    cotKhamPha: chu('Tên cột Khám phá', 'Khám phá'),
    cotChinhSach: chu('Tên cột Chính sách', 'Chính sách'),
    cotLienHe: chu('Tên cột Liên hệ', 'Liên hệ'),
    cotDiemBan: chu('Tên cột Điểm bán', 'Điểm bán'),
    datHang: chu('Cột Khám phá: link cuối', 'Đặt hàng online'),
    datHangLink: lienKet('Cột Khám phá: link cuối (đường dẫn)', PATHS.order),
    coZalo: chu('Chữ sau số hotline', '· có Zalo'),
    dienThoai: chu('Chữ sau số điện thoại thứ hai', '· điện thoại'),
    guiTin: chu('Link gửi tin nhắn', 'Gửi tin nhắn cho Ecopillo'),
    guiTinLink: lienKet('Link gửi tin nhắn (đường dẫn)', PATHS.contact),
    moCua: chu('Dòng giờ mở cửa', 'Mở cửa {gio}', 'Giữ {gio}: giờ mở cửa ở Thông tin chung → Liên hệ'),
    timDaiLy: chu('Link tìm đại lý', 'Tìm đại lý gần Quý khách'),
    timDaiLyLink: lienKet('Link tìm đại lý (đường dẫn)', NEAR_ME_URL),
    baoMat: chu('Link chính sách cuối trang', 'Chính sách bảo vệ thông tin cá nhân'),
    baoMatLink: lienKet('Link chính sách cuối trang (đường dẫn)', PATHS.privacy),
    boCongThuongNhan: chu('Logo Bộ Công Thương: chữ cho trình đọc màn hình', 'Website đã thông báo Bộ Công Thương'),
  },
)
