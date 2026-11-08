/**
 * Mô tả trang cho Google (thẻ description, og:description) của trang sản phẩm và trang phối màu.
 * Owner chọn công thức C2 ngày 08/11/2026 (docs/de-xuat-seo-08-11.html):
 * "{câu đầu, tối đa 70 ký tự}. {tên}, giá {giá}. Thanh toán khi nhận hàng." Google cắt mô tả quanh 160 ký tự.
 * Dữ liệu cấu trúc (JSON-LD) vẫn dùng đoạn giới thiệu đầy đủ, không dùng hàm này.
 */

const LEAD_MAX = 70
const DESCRIPTION_MAX = 160
const PAYMENT_NOTE = ' Thanh toán khi nhận hàng.'
/** Cắt ở dấu phẩy, dấu hai chấm mà phần còn lại ngắn hơn mức này thì câu cụt quá, cắt ở khoảng trắng thay */
const MIN_CLAUSE = 25
/**
 * Chữ nối không được đứng cuối câu khi phải cắt ở khoảng trắng ("…tinh khôi gợi", "…truyền thống mà"):
 * gặp thì bỏ luôn chữ đó (đo 99 trang sản phẩm 08/11/2026)
 */
const DANGLING_WORDS = new Set([
  'mà', 'và', 'với', 'của', 'trên', 'cùng', 'những', 'các', 'một', 'gợi', 'trong', 'cho',
  'là', 'được', 'như', 'tựa', 'hình', 'nền', 'từ', 'đến', 'khi', 'nơi', 'đầy', 'rất',
])

const trimEnd = (text: string): string => text.trim().replace(/[\s.,;:!?–-]+$/u, '')

/** Cắt ở khoảng trắng cuối trước mốc, rồi bỏ các chữ nối còn treo ở cuối */
function cutAtWord(head: string, max: number): string {
  const space = head.lastIndexOf(' ')
  const words = trimEnd(head.slice(0, space > 0 ? space : max)).split(' ')
  while (words.length > 1 && DANGLING_WORDS.has(words[words.length - 1].toLowerCase())) words.pop()
  return trimEnd(words.join(' '))
}

/**
 * Câu đầu của đoạn chữ, tối đa 70 ký tự: dài hơn thì cắt ở dấu phẩy hoặc dấu hai chấm cuối cùng trước mốc 70,
 * không có thì cắt ở khoảng trắng
 */
export function leadSentence(text: string, max: number = LEAD_MAX): string {
  const first = trimEnd(text.match(/^.+?[.!?](?=\s|$)/u)?.[0] ?? text)
  if (first.length <= max) return first
  const head = first.slice(0, max + 1)
  const clause = Math.max(head.lastIndexOf(','), head.lastIndexOf(':'))
  if (clause >= MIN_CLAUSE) return trimEnd(head.slice(0, clause))
  return cutAtWord(head, max)
}

/** Ghép mô tả: câu đầu + tên + giá + cách thanh toán; quá 160 ký tự thì bỏ câu thanh toán */
export function productMetaDescription(lead: string, name: string, price: string): string {
  const base = `${leadSentence(lead)}. ${name}, giá ${price}.`
  const full = `${base}${PAYMENT_NOTE}`
  return full.length <= DESCRIPTION_MAX ? full : base
}
