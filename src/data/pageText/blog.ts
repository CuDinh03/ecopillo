import { chu, definePageText, doan } from './define'

/** Chữ trang Tin tức, thẻ bài viết và các chữ quanh một bài viết (bài viết sửa trong WordPress → Bài viết) */
export const { set: BLOG_TEXT_SET, text: BLOG_TEXT } = definePageText(
  'tin-tuc',
  'Trang Tin tức',
  'Tiêu đề, đoạn dẫn, mô tả Google, nút lọc, nút xem thêm của trang Tin tức; chữ trên thẻ bài và quanh một bài viết. Bài viết sửa ở WordPress → Bài viết.',
  {
    moTaGoogle: doan('Mô tả trên Google', 'Kiến thức về vải Lyocell, cách chọn kích thước chăn ga, giặt và bảo quản để giấc ngủ luôn êm, mát.'),
    duongDan: chu('Đường dẫn đầu trang: tên trang Tin tức', 'Tin tức'),
    nhan: chu('Nhãn nhỏ', 'Tin tức · Cẩm nang'),
    tieuDe: chu('Tiêu đề', 'Cẩm nang | cho giấc ngủ ngon', 'Dấu | là chỗ xuống dòng'),
    danDat: doan('Đoạn dẫn', 'Hiểu về chất liệu, chọn đúng kích thước và chăm sóc chăn ga gối đệm để dùng bền, ngủ êm.'),
    locTatCa: chu('Nút lọc: tất cả bài', 'Tất cả'),
    xemThem: chu('Nút xem thêm bài', 'Xem thêm bài viết'),
    dangXem: chu('Dòng dưới nút xem thêm', 'Đang xem {so} / {tong} bài', '{so} là số bài đang hiện, {tong} là tổng số bài'),
    phutDoc: chu('Thẻ bài, đầu bài: thời gian đọc', '{so} phút đọc', '{so} là số phút'),
    docBai: chu('Thẻ bài: chữ cuối thẻ', 'Đọc bài'),
    quanTam: chu('Cuối bài: nhãn link liên quan', 'Có thể Quý khách quan tâm'),
    baiKhac: chu('Cuối bài: tiêu đề bài viết khác', 'Bài viết khác'),
    tatCaBai: chu('Cuối bài: link tất cả bài viết', 'Tất cả bài viết'),
    dangTai: chu('Bài viết: chữ khi đang tải thân bài', 'Đang tải bài viết…'),
    loiTai: doan('Bài viết: chữ khi không tải được thân bài', 'Chưa tải được nội dung bài. Quý khách tải lại trang giúp Ecopillo.'),
    chuDeDoc: chu('Hàng nút lọc: tên cho trình đọc màn hình', 'Chủ đề'),
    bangCuon: chu('Bài viết: tên bảng cho trình đọc màn hình', 'Bảng, cuộn ngang để xem hết', 'Bảng rộng trong thân bài được cuộn ngang trên điện thoại'),
  },
)
