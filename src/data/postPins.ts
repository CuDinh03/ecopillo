import { liveObject, type EditableField, type EditableSet } from './liveContent'
import { CODE_POST_SLUGS } from './posts'

/**
 * Bài ghim đầu trang Tin tức (owner 25/11/2026: "soát kỹ, không bỏ sót chi tiết nào để anh chị toàn quyền tự chỉnh sửa").
 * Trước 25/11/2026 ba bài dựng sẵn (posts.ts) luôn đứng đầu, sau đó bài WordPress mới nhất trước. Nay Ecopillo chọn bài ghim
 * (bài nào, thứ tự nào) ở Nội dung web → Bài viết; mặc định đúng ba bài đó nên chưa sửa thì trang Tin tức không đổi.
 * Bài dựng sẵn không còn ghim thì xuống cuối danh sách (bài dựng sẵn không có ngày đăng để xếp cùng bài WordPress).
 */

const FIELDS: readonly EditableField[] = [
  {
    khoa: 'bai',
    nhan: 'Bài ghim đầu trang Tin tức (mỗi dòng một bài)',
    kieu: 'ds-dong',
    goiY: 'Dán link bài (ví dụ https://ecopillo.com.vn/vai-lyocell-la-gi/) hoặc phần cuối link (vai-lyocell-la-gi), mỗi dòng một bài, theo thứ tự muốn hiện. Xoá hết dòng: không ghim bài nào, trang Tin tức xếp bài mới nhất trước. Link không phải bài đang hiện thì bỏ qua.',
  },
]

export const POST_PINS_SET: EditableSet = {
  khoa: 'tin-tuc-bai-ghim',
  nhom: 'Bài viết',
  ten: 'Tin tức: bài ghim đầu trang',
  moTa: 'Các bài đứng đầu trang Tin tức (và đầu từng mục khi lọc), theo thứ tự ở đây. Các bài còn lại xếp mới nhất trước.',
  kieu: 'mot',
  goc: { bai: CODE_POST_SLUGS },
  truong: FIELDS,
  coTheTrong: true,
}

/** Link hay tên bài Ecopillo dán → tên bài (phần cuối link) */
const slugOf = (raw: string): string =>
  raw
    .trim()
    .replace(/^https?:\/\/[^/]+/i, '')
    .split(/[?#]/)[0]
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .pop()
    ?.toLowerCase() ?? ''

// Ô để trống (xoá hết dòng): liveObject bỏ ô, bai thành undefined = không ghim bài nào
const RAW = liveObject<{ bai?: readonly string[] }>(POST_PINS_SET.khoa, { bai: CODE_POST_SLUGS }, FIELDS)

/** Tên các bài ghim theo thứ tự Ecopillo xếp (chưa lọc bài có thật) */
export const PINNED_POST_SLUGS: readonly string[] = [...new Set((RAW.bai ?? []).map(slugOf).filter(Boolean))]
