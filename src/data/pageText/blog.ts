import { chu, definePageText, doan } from './define'

/** Chữ đầu trang Tin tức (bài viết sửa trong WordPress → Bài viết) */
export const { set: BLOG_TEXT_SET, text: BLOG_TEXT } = definePageText(
  'tin-tuc',
  'Trang Tin tức',
  'Tiêu đề, đoạn dẫn, mô tả Google của trang Tin tức. Bài viết sửa ở WordPress → Bài viết.',
  {
    moTaGoogle: doan('Mô tả trên Google', 'Kiến thức về vải Lyocell, cách chọn kích thước chăn ga, giặt và bảo quản để giấc ngủ luôn êm, mát.'),
    nhan: chu('Nhãn nhỏ', 'Tin tức · Cẩm nang'),
    tieuDe: chu('Tiêu đề', 'Cẩm nang | cho giấc ngủ ngon', 'Dấu | là chỗ xuống dòng'),
    danDat: doan('Đoạn dẫn', 'Hiểu về chất liệu, chọn đúng kích thước và chăm sóc chăn ga gối đệm để dùng bền, ngủ êm.'),
  },
)
