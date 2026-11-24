import { PATHS, productsUrl } from '../links'
import { policyPath } from '../policyNav'
import { chu, definePageText, dsCap } from './define'

/**
 * Chữ khung dùng ở nhiều trang: đường dẫn "Trang chủ / …" đầu trang con, khối "Khám phá thêm" cuối trang (related.ts),
 * hộp báo gửi không được (SendFailed.tsx).
 */
export const { set: PAGE_FRAME_TEXT_SET, text: PAGE_FRAME_TEXT } = definePageText(
  'khung-trang',
  'Đường dẫn, "Khám phá thêm", báo gửi lỗi',
  'Chữ "Trang chủ" đầu đường dẫn ở mọi trang con, khối "Khám phá thêm" cuối trang sản phẩm, danh mục, bài viết, chính sách (tên nhóm, link mua hàng), hộp báo khi đơn hàng / tin nhắn chưa gửi được.',
  {
    trangChu: chu('Đường dẫn: chữ đầu tiên', 'Trang chủ'),
    duongDanNhan: chu('Đường dẫn: tên cho trình đọc màn hình', 'Đường dẫn'),
    khamPha: chu('Khối cuối trang: tiêu đề', 'Khám phá thêm'),
    nhomBoSuuTapKhac: chu('Nhóm "Bộ sưu tập khác" (trang bộ sưu tập)', 'Bộ sưu tập khác'),
    nhomCungNhom: chu('Nhóm "Cùng nhóm" (trang sản phẩm lẻ)', 'Cùng nhóm'),
    nhomCamNang: chu('Nhóm "Cẩm nang"', 'Cẩm nang'),
    nhomMuaHang: chu('Nhóm "Mua hàng"', 'Mua hàng'),
    nhomDanhMucCungNhom: chu('Nhóm "Danh mục cùng nhóm" (trang danh mục)', 'Danh mục cùng nhóm'),
    nhomBoSuuTap: chu('Nhóm "Bộ sưu tập" (trang danh mục)', 'Bộ sưu tập'),
    nhomSanPhamLienQuan: chu('Nhóm "Sản phẩm liên quan" (bài viết)', 'Sản phẩm liên quan'),
    nhomDocThem: chu('Nhóm "Đọc thêm" (bài viết)', 'Đọc thêm'),
    nhomChinhSachKhac: chu('Nhóm "Chính sách khác" (trang chính sách)', 'Chính sách khác'),
    nhomMuaSam: chu('Nhóm "Mua sắm" (trang chính sách)', 'Mua sắm'),
    phutDoc: chu('Dòng phụ dưới bài viết', '{so} phút đọc', 'Giữ {so}: số phút đọc'),
    tatCaBoChanGa: chu('Link "Tất cả bộ chăn ga"', 'Tất cả bộ chăn ga'),
    tatCaChan: chu('Link "Tất cả chăn"', 'Tất cả chăn'),
    tatCaGoi: chu('Link "Tất cả gối"', 'Tất cả gối'),
    tatCaDem: chu('Link "Tất cả đệm và topper"', 'Tất cả đệm và topper'),
    tatCaNhom: chu('Link "Tất cả …" của nhóm Ecopillo thêm (bộ Nhóm sản phẩm)', 'Tất cả {ten}', 'Giữ {ten}: tên ngắn của nhóm'),
    hoiDap: chu('Link "Hỏi đáp" trong nhóm Chính sách khác', 'Hỏi đáp'),
    linkMuaHang: dsCap(
      'Các link nhóm "Mua hàng"',
      ['ten', 'link'],
      ['Chữ', 'Link (bắt đầu bằng / hoặc https://)'],
      [
        { ten: 'Hướng dẫn mua hàng', link: policyPath('huong-dan-mua-hang') },
        { ten: 'Giao hàng, kiểm hàng khi nhận', link: policyPath('chinh-sach-van-chuyen') },
        { ten: 'Kiểm hàng, đổi hàng', link: policyPath('chinh-sach-doi-tra-hang-va-hoan-tien') },
        { ten: 'Bảo hành', link: policyPath('chinh-sach-bao-hanh-san-pham') },
        { ten: 'Tìm đại lý gần Quý khách', link: `${PATHS.contact}#diem-ban` },
      ],
      'Mỗi dòng "chữ | link". Dòng có link sai thì không hiện.',
    ),
    linkMuaSam: dsCap(
      'Các link nhóm "Mua sắm" (trang chính sách)',
      ['ten', 'link'],
      ['Chữ', 'Link (bắt đầu bằng / hoặc https://)'],
      [
        { ten: 'Bộ chăn ga', link: productsUrl({ 'danh-muc': 'bo-chan-ga' }) },
        { ten: 'Ruột chăn gối', link: '/danh-muc-san-pham/san-pham/ruot-chan-goi/' },
        { ten: 'Đệm Ecopillo', link: '/danh-muc-san-pham/dem-ecopillo/' },
        { ten: 'Đặt hàng online', link: PATHS.order },
      ],
      'Mỗi dòng "chữ | link". Dòng có link sai thì không hiện.',
    ),
    chuaGui: chu(
      'Hộp báo gửi lỗi: câu đầu',
      'Chưa gửi được {gi}. Thông tin Quý khách nhập vẫn còn, xin bấm gửi lại sau ít phút.',
      'Giữ {gi}: "đơn hàng" hoặc "tin nhắn"',
    ),
    canNgay: chu('Hộp báo gửi lỗi: chữ trước số hotline', 'Cần ngay, Quý khách gọi'),
    hoac: chu('Hộp báo gửi lỗi: chữ giữa số hotline và link Zalo', 'hoặc'),
    nhanZalo: chu('Hộp báo gửi lỗi: link Zalo', 'nhắn Zalo'),
    khungAnhDoc: chu(
      'Khung ảnh chưa có ảnh: chữ cho trình đọc màn hình',
      'Khung ảnh: {ghiChu}',
      '{ghiChu} là dòng ghi chú trong khung (sản phẩm chưa có ảnh). Gắn ảnh cho sản phẩm trong WooCommerce thì khung này không còn.',
    ),
  },
)
