import { chu, definePageText, doan, dsDong } from './define'

/**
 * Chữ trang Sản phẩm (ecopillo.com.vn/san-pham/). Đoạn giới thiệu và 4 cam kết của web cũ, đổi "bạn" thành "Quý khách"
 * (khách yêu cầu 16/10/2026 mục 31: "như web cũ ok hơn"; Ecopillo đã xác nhận 17/10/2026).
 */
export const { set: PRODUCTS_PAGE_TEXT_SET, text: PRODUCTS_PAGE_TEXT } = definePageText(
  'san-pham',
  'Trang Sản phẩm',
  'Tiêu đề, mô tả Google, đoạn giới thiệu, 4 cam kết đầu trang Sản phẩm và trang danh mục.',
  {
    moTaGoogle: doan(
      'Mô tả trên Google',
      'Bộ chăn ga, chăn, gối, đệm Ecopillo: vải Lyocell mềm mát, giá rõ theo từng kích thước, đặt online, nhân viên gọi xác nhận.',
    ),
    tieuDe: chu('Tiêu đề', 'Sản phẩm Ecopillo', 'Cũng là nhãn nhỏ trên tên các trang danh mục'),
    gioiThieu: doan(
      'Đoạn giới thiệu',
      'Mỗi sản phẩm chăn ga gối đệm Ecopillo là một tác phẩm được thiết kế và hoàn thiện chỉn chu, để mang đến một không gian “Chốn Yên” cho gia đình Quý khách: đầy yêu thương và ấm áp, nơi nghỉ ngơi sau một ngày dài làm việc.',
    ),
    camKet: dsDong('4 cam kết', [
      'Chất liệu tuyển chọn cao cấp bậc nhất trên thị trường',
      'Hoàn thiện tỉ mỉ bởi những thợ lành nghề hơn 10 năm kinh nghiệm',
      'Cập nhật sản phẩm theo xu hướng của thị trường',
      'Giao hàng nhanh chóng, nhận đặt hàng theo kích thước riêng',
    ]),
    timTheoBo: chu('Tiêu đề hàng chọn bộ sưu tập', 'Quý khách tìm theo bộ sưu tập'),
    phoiMau: chu('Trang danh mục: tiêu đề hàng phối màu', 'Một vài phối màu'),
  },
)
