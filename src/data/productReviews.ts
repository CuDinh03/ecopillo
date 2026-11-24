import { liveList, type EditableField, type EditableImage, type EditableSet } from './liveContent'
import { chu, definePageText, dsDong } from './pageText/define'
import { ALL_PRODUCTS } from './products'

/**
 * Nhận xét, chấm điểm từng sản phẩm (biên bản mục 42). Ecopillo tự thêm, xoá, đổi thứ tự ở Nội dung web → Sản phẩm
 * (owner 24/11/2026: "khách tự sửa mọi chi tiết"). Chỉ đưa nhận xét thật, có khách đồng ý đăng.
 * Danh sách gốc rỗng: trước đây là nhận xét mẫu (đã bỏ, không hiện: owner 28/10/2026 bỏ nhãn chờ thì nhận xét mẫu thành bịa).
 * Sản phẩm có ít nhất một nhận xét mới hiện khối "Nhận xét của khách" (trang sản phẩm lẻ, trang bộ sưu tập).
 */

export interface ProductReview {
  /** Mã sản phẩm (link sản phẩm lẻ, hoặc mã bộ sưu tập) */
  sanPham: string
  ten: string
  noiO?: string
  /** "1" … "5" */
  sao: string
  loi: string
  ngay?: string
  /** Cỡ / mẫu khách đã mua */
  daMua?: string
  /** Điểm theo 4 tiêu chí (cùng thứ tự với tên tiêu chí ở bộ chữ dưới), "1" … "5" */
  diem1?: string
  diem2?: string
  diem3?: string
  diem4?: string
  anh?: EditableImage
}

/** Tên 4 tiêu chí gốc: cũng là nhãn các ô điểm ở màn hình sửa */
const BASE_CRITERIA = ['Chất liệu', 'Đường may, hoàn thiện', 'Đúng như ảnh', 'Giao hàng, đóng gói'] as const

export const { set: PRODUCT_REVIEW_TEXT_SET, text: PRODUCT_REVIEW_TEXT } = definePageText(
  'nhan-xet-san-pham',
  'Nhận xét sản phẩm: tiêu chí, chữ',
  'Tên các tiêu chí chấm điểm ở khối "Nhận xét của khách" trên trang sản phẩm, trang bộ sưu tập. Tiêu đề khối, chữ số sao ở bộ "Trang sản phẩm: chọn cỡ, đặt mua, ảnh"; các nhận xét ở bộ "Nhận xét từng sản phẩm".',
  {
    tieuChi: dsDong(
      'Tên 4 tiêu chí chấm điểm (mỗi dòng một tiêu chí)',
      BASE_CRITERIA,
      'Dòng 1 ứng với ô "Điểm tiêu chí 1" của từng nhận xét, dòng 2 với ô 2… Tiêu chí không có nhận xét nào chấm thì không hiện.',
    ),
    anhKhach: chu('Ảnh khách gửi: chữ thay ảnh (Google, trình đọc màn hình)', 'Ảnh {ten} gửi Ecopillo', '{ten} là tên khách'),
  },
)

const STARS = ['5', '4', '3', '2', '1'] as const
const STAR_LABELS = STARS.map((s) => `${s} sao`)

const scoreField = (i: number): EditableField => ({
  khoa: `diem${i + 1}`,
  nhan: `Điểm tiêu chí ${i + 1} (${BASE_CRITERIA[i]})`,
  kieu: 'chon',
  luaChon: STARS,
  nhanLuaChon: STAR_LABELS,
  ...(i === 0 ? { goiY: 'Không bắt buộc. Tên tiêu chí sửa ở Chữ từng trang → Nhận xét sản phẩm: tiêu chí, chữ.' } : {}),
})

const FIELDS: readonly EditableField[] = [
  {
    khoa: 'sanPham',
    nhan: 'Sản phẩm',
    kieu: 'chon',
    batBuoc: true,
    luaChon: ALL_PRODUCTS.map((p) => p.slug),
    nhanLuaChon: ALL_PRODUCTS.map((p) => p.name),
    // Sản phẩm lẻ, bộ Ecopillo tạo trong Woo sau lần dựng cũng chọn được (đợt G)
    luaChonThem: [{ nguon: 'san-pham' }, { nguon: 'bo-suu-tap' }],
  },
  { khoa: 'ten', nhan: 'Tên khách', kieu: 'chu', batBuoc: true, goiY: 'Ví dụ Chị Minh Anh. Chỉ đăng khi khách đồng ý.' },
  { khoa: 'noiO', nhan: 'Nơi ở', kieu: 'chu', goiY: 'Ví dụ Cầu Giấy, Hà Nội' },
  { khoa: 'sao', nhan: 'Số sao', kieu: 'chon', batBuoc: true, luaChon: STARS, nhanLuaChon: STAR_LABELS },
  { khoa: 'loi', nhan: 'Lời khách', kieu: 'doan', batBuoc: true },
  { khoa: 'ngay', nhan: 'Ngày nhận xét', kieu: 'chu', goiY: 'Ví dụ 20/11/2026. Để trống thì không hiện.' },
  { khoa: 'daMua', nhan: 'Cỡ đã mua', kieu: 'chu', goiY: 'Ví dụ 180 × 200 cm. Để trống thì không hiện.' },
  ...BASE_CRITERIA.map((_, i) => scoreField(i)),
  { khoa: 'anh', nhan: 'Ảnh khách gửi', kieu: 'anh', goiY: 'Không bắt buộc.' },
]

const BASE_REVIEWS: readonly ProductReview[] = []

export const PRODUCT_REVIEWS_SET: EditableSet = {
  khoa: 'nhan-xet-san-pham',
  nhom: 'Sản phẩm',
  ten: 'Nhận xét từng sản phẩm',
  moTa: 'Nhận xét, chấm điểm của khách trên trang sản phẩm, trang bộ sưu tập. Sản phẩm có nhận xét mới hiện khối "Nhận xét của khách". Chỉ đưa lời khách thật, có khách đồng ý.',
  kieu: 'nhieu',
  goc: BASE_REVIEWS,
  tieuDeDong: 'ten',
  coTheTrong: true,
  truong: FIELDS,
}

const PRODUCT_REVIEWS: readonly ProductReview[] = liveList(
  PRODUCT_REVIEWS_SET.khoa,
  BASE_REVIEWS,
  FIELDS,
  (): ProductReview => ({ sanPham: '', ten: '', sao: '', loi: '' }),
)

/** Nhận xét của một sản phẩm, theo thứ tự Ecopillo xếp */
export const reviewsOf = (slug: string): readonly ProductReview[] => PRODUCT_REVIEWS.filter((r) => r.sanPham === slug)

/** Điểm tiêu chí thứ i (0…3) của một nhận xét, không chấm thì undefined */
export const criterionScore = (review: ProductReview, i: number): number | undefined => {
  const value = [review.diem1, review.diem2, review.diem3, review.diem4][i]
  return value ? Number(value) : undefined
}
