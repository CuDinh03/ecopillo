import { markLiveDiffers } from './liveData'

/**
 * Nội dung Ecopillo tự sửa trong WordPress (owner 18/11/2026: "giao diện là khung, khách cần tự chỉnh dữ liệu";
 * giai đoạn 2 của docs/ke-hoach-khach-tu-sua-du-lieu.md).
 *
 * Mỗi bộ dữ liệu sửa được khai báo "các ô" (EditableField) ngay cạnh dữ liệu gốc (brand.ts, dealers.ts…).
 * Lúc build, src/data/contentFrame.ts ghi các ô + giá trị gốc ra noi-dung-goc.json; plugin WordPress
 * (trien-khai/wordpress-plugin/ecopillo-giao-dien-moi/noi-dung.php) dựng màn hình sửa theo đó, lưu trong WordPress
 * và ghi vào file /wp-content/uploads/ecopillo-du-lieu/du-lieu.js (`window.__ECO_NOI_DUNG__`), nạp trước gói JS.
 * Bộ nào Ecopillo chưa lưu thì không có trong file: web dùng dữ liệu trong code như cũ.
 *
 * Không tin mù file đó: mỗi ô được kiểm đúng kiểu; ô sai thì giữ giá trị gốc, dòng thiếu ô bắt buộc thì bỏ dòng.
 */

export type FieldKind =
  /** Một dòng chữ */
  | 'chu'
  /** Đoạn chữ nhiều dòng */
  | 'doan'
  /** Đường link: https://…, /duong-dan/, tel:, mailto: */
  | 'link'
  | 'so'
  /** Ảnh từ Thư viện WordPress: { src, srcSet, alt } */
  | 'anh'
  /** Chọn một trong `luaChon` */
  | 'chon'
  /** Tích nhiều ô trong `luaChon` (mảng giá trị, theo thứ tự `luaChon`) */
  | 'chon-nhieu'
  /** Giờ "08:30" */
  | 'gio'
  /** Ngày nghỉ trong tuần: mảng số 0 (Chủ nhật) … 6 */
  | 'ngay-nghi'
  /** Danh sách ảnh (chỉ link ảnh) */
  | 'ds-anh'
  /** Nhiều đoạn văn (mảng chữ); màn hình sửa: cách đoạn bằng một dòng trống */
  | 'doan-nhieu'
  /** Danh sách mỗi dòng một ý (mảng chữ) */
  | 'ds-dong'
  /** Danh sách cặp (mảng đối tượng hai khoá `cap`); màn hình sửa: mỗi dòng "ô 1 | ô 2" */
  | 'ds-cap'
  /** Màu "#rrggbb" (màn hình sửa: ô chọn màu) */
  | 'mau'

export interface EditableField {
  khoa: string
  nhan: string
  kieu: FieldKind
  batBuoc?: boolean
  /** Một dòng gợi ý dưới ô */
  goiY?: string
  luaChon?: readonly string[]
  /** Chữ hiện cho từng lựa chọn (cùng thứ tự `luaChon`); không có thì hiện chính giá trị */
  nhanLuaChon?: readonly string[]
  /** ds-cap: tên hai khoá của mỗi cặp và nhãn của chúng */
  cap?: readonly [string, string]
  nhanCap?: readonly [string, string]
}

/**
 * Một bộ dữ liệu Ecopillo sửa được: màn hình sửa trong WordPress dựng từ đây (src/data/contentFrame.ts ghi ra lúc build).
 * `goc` là giá trị trong code, cũng là giá trị ban đầu của màn hình sửa và giá trị khi bấm "Trả về nội dung gốc".
 */
export interface EditableSet {
  khoa: string
  /** Nhóm trên menu WordPress */
  nhom: string
  ten: string
  moTa: string
  kieu: 'mot' | 'nhieu'
  truong: readonly EditableField[]
  goc: unknown
  /** Danh sách: ô làm tiêu đề mỗi dòng trong màn hình sửa */
  tieuDeDong?: string
  /** Danh sách: ô mã ẩn giữ nguyên qua các lần sửa (ảnh, lựa chọn đã lưu bám theo mã) */
  khoaDong?: string
  /**
   * Bộ màu (theme.ts): ô màu → biến CSS. Plugin ghi các biến vào mau.css; `alpha` là độ trong (đường kẻ, chữ phụ pha từ màu chàm)
   */
  bienCss?: Readonly<Record<string, readonly { bien: string; alpha?: number }[]>>
  /** Danh sách được xoá hết (lưu 0 dòng): chuyển hướng, SEO… (đợt E3). Không có thì plugin không cho lưu danh sách rỗng */
  coTheTrong?: boolean
  /** Dòng gắn cố định theo vị trí / theo link (banner 4 nhóm, đầu trang chính sách…): màn hình sửa ẩn nút thêm, xoá dòng */
  khongThemXoa?: boolean
  /** Như trên, và thứ tự dòng không có nghĩa: ẩn cả nút Lên / Xuống */
  khongDoiThuTu?: boolean
  /** Bộ màu: cặp chữ / nền phải đủ tương phản (WCAG), không đủ thì plugin không lưu. `chu`, `nen` là mã ô hoặc "#ffffff" */
  kiemTuongPhan?: readonly { chu: string; nen: string; toiThieu: number; nhan: string }[]
}

export interface EditableImage {
  src: string
  srcSet: string
  alt: string
}

const MAX_TEXT = 4000

/**
 * Mã dòng (khoaDong) sau khi plugin lưu: noi-dung.php làm sạch bằng sanitize_title, nên "/danh-muc-san-pham/x/" thành
 * "danh-muc-san-pham-x". So mã dòng luôn qua hàm này ở cả hai phía.
 */
export const rowKey = (value: unknown): string =>
  typeof value === 'string'
    ? value
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : ''

const isLink = (v: string): boolean => /^(https:\/\/|http:\/\/|\/(?!\/)|tel:|mailto:)/.test(v) && !/[\s<>"]/.test(v)

/** Giá trị một ô sau khi kiểm; undefined = ô sai hoặc trống */
export function cleanField(field: EditableField, value: unknown): unknown {
  switch (field.kieu) {
    case 'chu':
    case 'doan': {
      if (typeof value !== 'string') return undefined
      const text = value.trim().slice(0, MAX_TEXT)
      return text || undefined
    }
    case 'link':
      return typeof value === 'string' && value.trim() && isLink(value.trim()) ? value.trim() : undefined
    case 'so':
      return typeof value === 'number' && Number.isFinite(value) ? value : undefined
    case 'chon':
      return typeof value === 'string' && field.luaChon?.includes(value) ? value : undefined
    case 'chon-nhieu': {
      if (!Array.isArray(value)) return undefined
      const picked = new Set(value.filter((v): v is string => typeof v === 'string'))
      const items = (field.luaChon ?? []).filter((option) => picked.has(option))
      return items.length ? items : undefined
    }
    case 'gio':
      return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined
    case 'ngay-nghi':
      return Array.isArray(value) ? [...new Set(value.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6))].sort() : undefined
    case 'ds-anh':
      return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && isLink(v)).slice(0, 8) : undefined
    case 'doan-nhieu':
    case 'ds-dong': {
      if (!Array.isArray(value)) return undefined
      const items = value.filter((v): v is string => typeof v === 'string').map((v) => v.trim().slice(0, MAX_TEXT)).filter(Boolean).slice(0, 60)
      return items.length ? items : undefined
    }
    case 'ds-cap': {
      const [a, b] = field.cap ?? ['a', 'b']
      if (!Array.isArray(value)) return undefined
      const pairs = value
        .map((v) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {}))
        .filter((v) => typeof v[a] === 'string' && typeof v[b] === 'string' && (v[a] as string).trim() && (v[b] as string).trim())
        .map((v) => ({ [a]: (v[a] as string).trim().slice(0, MAX_TEXT), [b]: (v[b] as string).trim().slice(0, MAX_TEXT) }))
        .slice(0, 60)
      return pairs.length ? pairs : undefined
    }
    case 'mau':
      return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim().toLowerCase() : undefined
    case 'anh': {
      if (!value || typeof value !== 'object') return undefined
      const { src, srcSet, alt } = value as Record<string, unknown>
      if (typeof src !== 'string' || !isLink(src)) return undefined
      const set = typeof srcSet === 'string' && !/[<>"]/.test(srcSet) ? srcSet : ''
      return { src, srcSet: set, alt: typeof alt === 'string' ? alt.slice(0, 300) : '' } satisfies EditableImage
    }
  }
}

function read(): Readonly<Record<string, unknown>> {
  if (typeof window === 'undefined') return {}
  const raw = (window as { __ECO_NOI_DUNG__?: unknown }).__ECO_NOI_DUNG__
  return raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
}

const LIVE = read()

const isEmpty = (v: unknown): boolean =>
  v === undefined || v === '' || (Array.isArray(v) && v.length === 0) || (!!v && typeof v === 'object' && 'src' in v && !(v as { src: unknown }).src)

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b)

/** Ghép các ô Ecopillo đã sửa lên một đối tượng gốc. Ô sai kiểu, ô trống không bắt buộc thì giữ gốc */
function mergeItem<T extends object>(base: T, input: unknown, fields: readonly EditableField[]): T | undefined {
  if (!input || typeof input !== 'object') return undefined
  const source = input as Record<string, unknown>
  const next: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const field of fields) {
    if (!(field.khoa in source)) continue
    const value = cleanField(field, source[field.khoa])
    if (value === undefined) {
      if (field.batBuoc && (base as Record<string, unknown>)[field.khoa] === undefined) return undefined
      // Ô không bắt buộc bị xoá trống: bỏ ô đó (ví dụ bỏ link bài, bỏ giờ mở cửa, bỏ gạch đầu dòng của một phần)
      if (!field.batBuoc && isEmpty(source[field.khoa])) delete next[field.khoa]
      continue
    }
    next[field.khoa] = value
  }
  // Ô bắt buộc phải có giá trị (dòng mới thêm mà để trống tên, thiếu ảnh thì bỏ dòng)
  if (fields.some((f) => f.batBuoc && isEmpty(next[f.khoa]))) return undefined
  return next as T
}

/** Một bộ dữ liệu dạng một đối tượng (thông tin liên hệ, banner) */
export function liveObject<T extends object>(key: string, base: T, fields: readonly EditableField[]): T {
  const merged = mergeItem(base, LIVE[key], fields)
  if (!merged || same(merged, base)) return base
  markLiveDiffers()
  return merged
}

/**
 * Một bộ dữ liệu dạng danh sách (đại lý, sự kiện, báo chí, đánh giá). Ecopillo đã lưu thì danh sách lưu thay hẳn danh sách gốc
 * (thêm, xoá, đổi thứ tự được); mỗi dòng ghép lên `template` để có đủ ô mà màn hình sửa không có (ảnh dự phòng…).
 */
export function liveList<T extends object>(
  key: string,
  base: readonly T[],
  fields: readonly EditableField[],
  template: (index: number, row: Record<string, unknown>) => T,
): readonly T[] {
  const input = LIVE[key]
  if (!Array.isArray(input)) return base
  const rows = input
    .slice(0, 300)
    .map((row, i) => mergeItem(template(i, (row ?? {}) as Record<string, unknown>), row, fields))
    .filter((row): row is T => row !== undefined)
  if (!rows.length || same(rows, base)) return base
  markLiveDiffers()
  return rows
}
