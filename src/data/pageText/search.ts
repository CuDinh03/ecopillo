import { PATHS } from '../links'
import { liveList, type EditableField, type EditableSet } from '../liveContent'
import { chu, definePageText, doan, dsDong } from './define'
import { isMenuLink } from './linkField'

/** Chữ của thanh tìm kiếm (owner chọn phương án B 19/11/2026; SiteSearch.tsx, searchIndex.ts) */
export const { set: SEARCH_TEXT_SET, text: SEARCH_TEXT } = definePageText(
  'tim-kiem',
  'Thanh tìm kiếm',
  'Chữ trong ô tìm (kính lúp trên thanh đầu trang, ô tìm đầu menu điện thoại), gợi ý khi ô còn trống, tên các nhóm kết quả, câu khi không thấy gì. Trang nào tìm được và từ khoá của trang sửa ở mục "Trang tìm được trong ô tìm".',
  {
    oTim: chu('Chữ mờ trong ô tìm (cả ô tìm đầu menu điện thoại)', 'Quý khách muốn tìm sản phẩm gì?'),
    goiY: dsDong('Gợi ý khi ô còn trống ("Khách hay tìm")', ['Đệm lò xo', 'Ruột gối', 'Chăn hè', 'Bộ chăn ga', 'Topper', 'Divan'], 'Mỗi dòng một gợi ý; bấm vào là tìm chữ đó'),
    hayTim: chu('Tiêu đề phần gợi ý', 'Khách hay tìm'),
    nhomSanPham: chu('Tên nhóm kết quả: sản phẩm', 'Sản phẩm'),
    nhomTrang: chu('Tên nhóm kết quả: trang', 'Danh mục và trang'),
    nhomBaiViet: chu('Tên nhóm kết quả: bài viết', 'Bài viết'),
    hienThem: chu('Nút hiện thêm kết quả', 'Hiện thêm {so} {nhom}', 'Giữ {so}: số kết quả còn lại; {nhom}: tên nhóm (viết thường)'),
    khongCoSanPham: chu('Khi không có sản phẩm khớp (vẫn có trang, bài viết)', 'Không có sản phẩm khớp.'),
    khongThay: doan(
      'Khi không thấy gì',
      'Chưa thấy {chu} trên web. Quý khách gọi hoặc nhắn Zalo, nhân viên Ecopillo tư vấn ngay.',
      'Giữ {chu}: chữ Quý khách vừa gõ (in đậm, trong ngoặc kép)',
    ),
    nhanZalo: chu('Nút Zalo khi không thấy gì', 'Nhắn Zalo'),
    dangTai: chu('Lúc đang tải', 'Đang tải…'),
    loiTai: chu('Khi không tải được ô tìm (trước số hotline)', 'Chưa tải được ô tìm. Quý khách thử lại, hoặc gọi'),
    meoPhim: chu('Dòng mẹo dùng phím (máy tính)', 'Mũi tên lên xuống để chọn, Enter để mở, Esc để đóng.'),
    loaiDanhMuc: chu('Dòng phụ dưới kết quả là danh mục sản phẩm', 'Danh mục sản phẩm'),
    loaiNhom: chu('Dòng phụ dưới kết quả là nhóm sản phẩm (trang Sản phẩm lọc theo nhóm)', 'Nhóm sản phẩm'),
    loaiChinhSach: chu('Dòng phụ dưới kết quả là trang chính sách', 'Chính sách'),
    oTimNhan: chu('Ô tìm: tên cho trình đọc màn hình', 'Tìm trên web'),
    ketQuaNhan: chu('Danh sách kết quả: tên cho trình đọc màn hình', 'Kết quả tìm'),
    xoaChu: chu('Nút xoá chữ đã gõ: chữ cho trình đọc màn hình', 'Xoá chữ đã gõ'),
    dongTim: chu('Nút đóng ô tìm: chữ cho trình đọc màn hình', 'Đóng ô tìm'),
    // Chữ của nhóm để tìm (không dùng nhãn "Đệm & topper": gõ "topper" sẽ ra mọi đệm)
    tuNhomBoChanGa: chu('Từ khoá chung của mọi bộ chăn ga', 'bộ chăn ga gối'),
    tuNhomChan: chu('Từ khoá chung của mọi chăn', 'chăn'),
    tuNhomGoi: chu('Từ khoá chung của mọi gối', 'gối'),
    tuNhomDem: chu('Từ khoá chung của mọi đệm, topper', 'đệm', 'Đừng ghi "topper" ở đây: gõ "topper" sẽ ra mọi đệm'),
    tuChinhSach: chu('Từ khoá chung của mọi trang chính sách', 'chính sách'),
    tuHuongDan: chu('Từ khoá: Hướng dẫn mua hàng', 'cách mua đặt hàng'),
    tuGiaoHang: chu('Từ khoá: Giao hàng', 'vận chuyển ship phí ship giao hàng miễn phí'),
    tuThanhToan: chu('Từ khoá: Thanh toán', 'chuyển khoản số tài khoản đặt cọc'),
    tuDoiHang: chu('Từ khoá: Kiểm hàng, đổi hàng', 'đổi trả hoàn tiền kiểm tra hàng'),
    tuBaoHanh: chu('Từ khoá: Bảo hành', 'đổi mới sửa chữa'),
    tuBaoMat: chu('Từ khoá: Bảo vệ thông tin cá nhân', 'bảo mật quyền riêng tư'),
  },
)

export interface SearchPage {
  ten: string
  link: string
  /** Chữ khách hay gõ khi tìm trang đó */
  tuKhoa?: string
}

const PAGE_FIELDS: readonly EditableField[] = [
  { khoa: 'ten', nhan: 'Tên hiện trong kết quả', kieu: 'chu', batBuoc: true },
  { khoa: 'link', nhan: 'Bấm vào thì mở', kieu: 'link', batBuoc: true, goiY: 'Trang trong web, bắt đầu bằng /' },
  { khoa: 'tuKhoa', nhan: 'Từ khoá', kieu: 'chu', goiY: 'Chữ khách hay gõ khi tìm trang này, cách nhau bằng dấu cách' },
]

/** Trang không phải danh mục, không phải chính sách (danh mục và chính sách tự có trong ô tìm) */
const BASE_PAGES: readonly SearchPage[] = [
  { ten: 'Liên hệ mua hàng', link: PATHS.contact, tuKhoa: 'điểm bán đại lý cửa hàng showroom địa chỉ hệ thống phân phối số điện thoại hotline' },
  { ten: 'Đặt hàng online', link: PATHS.order, tuKhoa: 'mua online đặt mua giỏ hàng' },
  { ten: 'Giới thiệu Ecopillo', link: PATHS.about, tuKhoa: 'về chúng tôi công ty câu chuyện thương hiệu' },
  { ten: 'Khách sạn & dự án', link: PATHS.hotel, tuKhoa: 'khách sạn nhà nghỉ homestay resort dự án' },
  { ten: 'Đăng ký mở đại lý', link: PATHS.recruit, tuKhoa: 'tuyển đại lý hợp tác nhượng quyền kinh doanh' },
  { ten: 'Quà tặng và sự kiện', link: PATHS.gifts, tuKhoa: 'quà tặng doanh nghiệp quà tết quà cưới sự kiện tri ân' },
  { ten: 'Tin tức', link: PATHS.blog, tuKhoa: 'bài viết cẩm nang' },
  { ten: 'Hỏi đáp', link: PATHS.faq, tuKhoa: 'câu hỏi thường gặp' },
]

export const SEARCH_PAGES_SET: EditableSet = {
  khoa: 'tim-kiem-trang',
  nhom: 'Giao diện',
  ten: 'Trang tìm được trong ô tìm',
  moTa:
    'Các trang (ngoài sản phẩm, danh mục, chính sách, bài viết: những thứ đó tự có) hiện trong nhóm "Danh mục và trang" của ô tìm, kèm từ khoá khách hay gõ. Thêm trang mới, đổi tên, đổi từ khoá.',
  kieu: 'nhieu',
  goc: BASE_PAGES,
  truong: PAGE_FIELDS,
  tieuDeDong: 'ten',
}

/** Chỉ nhận trang trong web hoặc https */
export const SEARCH_PAGES: readonly SearchPage[] = liveList<SearchPage>(SEARCH_PAGES_SET.khoa, BASE_PAGES, PAGE_FIELDS, () => ({
  ten: '',
  link: '',
  tuKhoa: '',
})).filter((page) => isMenuLink(page.link))
