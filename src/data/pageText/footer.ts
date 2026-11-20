import { anh, chu, definePageText, doan } from './define'

/** Chữ chân trang (tên công ty, liên hệ, đường link lấy từ bộ Thông tin liên hệ và menu) */
export const { set: FOOTER_TEXT_SET, text: FOOTER_TEXT } = definePageText(
  'chan-trang',
  'Chân trang',
  'Câu giới thiệu dưới logo, dòng chứng nhận, dòng cam kết cuối trang, logo Bộ Công Thương.',
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
  },
)
