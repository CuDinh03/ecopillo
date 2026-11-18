import { liveObject, type EditableField, type EditableSet } from './liveContent'

/**
 * Chữ dùng chung trên mọi trang sản phẩm và trang phối màu (src/components/products/DetailParts.tsx):
 * 4 cam kết dưới nút Đặt mua, thẻ "Giao hàng, đổi trả & bảo hành", thời hạn bảo hành theo nhóm.
 * Anh Quang 18/11/2026: "phần Giao hàng, đổi trả & bảo hành giống nhau ở tất cả các sản phẩm"; theo nguyên tắc
 * "giao diện là khung" (docs/ke-hoach-khach-tu-sua-du-lieu.md) Ecopillo tự sửa ở menu Nội dung web.
 * Bảo hành theo biên bản mục 38 (đệm 5–15 năm, chăn ga 90 ngày); gối chưa có thời hạn nên để trống (không hiện dòng).
 * Một sản phẩm cần thời hạn riêng: thuộc tính "Bảo hành" trong WooCommerce (sản phẩm lẻ đăng mới) thắng giá trị ở đây.
 */

interface ProductCommonInfo {
  camKet: readonly string[]
  giaoHang: readonly string[]
  baoHanhDem: string
  baoHanhChanGa: string
  baoHanhGoi: string
}

const BASE_PRODUCT_COMMON: ProductCommonInfo = {
  camKet: ['Thanh toán khi nhận hàng', 'Miễn phí giao từ 500.000đ', 'Kiểm hàng, trải thử khi nhận', 'Đổi hàng trong 7 ngày'],
  giaoHang: [
    'Thanh toán khi nhận hàng (COD) toàn quốc, không thu phí thu hộ. Nhân viên gọi xác nhận đơn trước khi giao.',
    'Miễn phí giao toàn quốc cho đơn từ 500.000đ. Nội thành Hà Nội, TP. HCM giao trong ngày; phía Bắc 2–3 ngày, phía Nam 3–5 ngày.',
    'Kiểm hàng cùng nhân viên giao, được trải thử lên giường. Giao sai được từ chối nhận, không mất tiền.',
    'Chỉ đổi, không trả hàng hoàn tiền. Báo lỗi trong 24 giờ, gửi đổi trong 7 ngày, còn nguyên tem mác, chưa giặt.',
  ],
  baoHanhDem: '5–15 năm tuỳ dòng đệm',
  baoHanhChanGa: '90 ngày',
  baoHanhGoi: '',
}

export const PRODUCT_COMMON_SET: EditableSet = {
  khoa: 'trang-san-pham-chung',
  nhom: 'Trang chính sách',
  ten: 'Giao hàng, đổi trả & bảo hành trên trang sản phẩm',
  moTa: 'Chữ giống nhau trên mọi trang sản phẩm: 4 cam kết ngắn dưới nút Đặt mua, thẻ "Giao hàng, đổi trả & bảo hành", thời hạn bảo hành theo nhóm. Sản phẩm cần thời hạn riêng thì thêm thuộc tính "Bảo hành" trong WooCommerce. Đây chỉ là chữ: mức miễn phí giao lúc đặt hàng vẫn tính theo cách cũ, muốn đổi mức đó thì báo bên làm web.',
  kieu: 'mot',
  goc: BASE_PRODUCT_COMMON,
  truong: [
    { khoa: 'camKet', nhan: 'Cam kết ngắn dưới nút Đặt mua', kieu: 'ds-dong', batBuoc: true, goiY: 'Mỗi dòng một ý, nên giữ 4 ý ngắn.' },
    { khoa: 'giaoHang', nhan: 'Thẻ "Giao hàng, đổi trả & bảo hành"', kieu: 'ds-dong', batBuoc: true, goiY: 'Mỗi dòng một ý.' },
    { khoa: 'baoHanhDem', nhan: 'Bảo hành đệm, topper', kieu: 'chu', goiY: 'Dòng đệm đã ghi bảo hành riêng (ví dụ Eco Fresh 7 năm) giữ thời hạn riêng đó. Để trống thì không hiện dòng bảo hành.' },
    { khoa: 'baoHanhChanGa', nhan: 'Bảo hành chăn ga, ruột chăn', kieu: 'chu', goiY: 'Để trống thì không hiện dòng bảo hành.' },
    { khoa: 'baoHanhGoi', nhan: 'Bảo hành gối, vỏ gối', kieu: 'chu', goiY: 'Để trống thì không hiện dòng bảo hành.' },
  ] satisfies EditableField[],
}

const INFO = liveObject(PRODUCT_COMMON_SET.khoa, BASE_PRODUCT_COMMON, PRODUCT_COMMON_SET.truong)

export const TRUST_POINTS: readonly string[] = INFO.camKet
export const DELIVERY_POINTS: readonly string[] = INFO.giaoHang

/** Thời hạn bảo hành theo nhóm sản phẩm; chuỗi rỗng là không hiện dòng (ô Ecopillo xoá trống thì liveObject bỏ ô) */
export const WARRANTY_BY_CATEGORY: Readonly<Record<string, string>> = {
  'bo-chan-ga': INFO.baoHanhChanGa ?? '',
  chan: INFO.baoHanhChanGa ?? '',
  dem: INFO.baoHanhDem ?? '',
  goi: INFO.baoHanhGoi ?? '',
}
