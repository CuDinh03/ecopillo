import { liveObject, type EditableField, type EditableSet, type FieldKind } from '../liveContent'

/**
 * Chữ và ảnh từng trang Ecopillo tự sửa ở Nội dung web → nhóm "Chữ từng trang" (owner 20/11/2026: "đảm bảo tất cả mọi thứ
 * trên web, khách đều tự chỉnh sửa được"; đợt A trong docs/ke-hoach-khach-tu-sua-du-lieu.md mục 5).
 *
 * Mỗi trang một bộ: khai các ô kèm chữ gốc, nhận lại đối tượng chữ đã ghép phần Ecopillo sửa. Mọi ô đều "bắt buộc" theo nghĩa
 * của liveContent.ts: ô Ecopillo để trống thì web dùng chữ gốc (không bao giờ hiện một khối trống).
 * Chữ gốc là chữ đang có trên web: HTML dựng sẵn (Google đọc) giữ chữ gốc tới lần dựng sau, khách luôn thấy chữ mới.
 */

type TextKind = Extract<FieldKind, 'chu' | 'doan' | 'doan-nhieu' | 'ds-dong' | 'ds-cap' | 'anh' | 'link' | 'ds-anh' | 'chon' | 'chon-nhieu'>

export interface TextField<T> {
  nhan: string
  kieu: TextKind
  goc: T
  goiY?: string
  cap?: readonly [string, string]
  nhanCap?: readonly [string, string]
  /** Ô chọn: các giá trị và chữ hiện cho từng giá trị */
  luaChon?: readonly string[]
  nhanLuaChon?: readonly string[]
  /** Lựa chọn thêm lấy lúc chạy (sản phẩm, bộ Ecopillo tạo trong Woo sau lần dựng): EditableField.luaChonThem */
  luaChonThem?: EditableField['luaChonThem']
}

/** Ô một dòng chữ */
export const chu = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'chu', goc, goiY })
/** Đoạn chữ nhiều dòng */
export const doan = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'doan', goc, goiY })
/** Nhiều đoạn văn */
export const doanNhieu = (nhan: string, goc: readonly string[], goiY?: string): TextField<readonly string[]> => ({
  nhan,
  kieu: 'doan-nhieu',
  goc,
  goiY,
})
/** Danh sách mỗi dòng một ý */
export const dsDong = (nhan: string, goc: readonly string[], goiY?: string): TextField<readonly string[]> => ({ nhan, kieu: 'ds-dong', goc, goiY })
/** Danh sách cặp "ô 1 | ô 2" */
export const dsCap = <A extends string, B extends string>(
  nhan: string,
  cap: readonly [A, B],
  nhanCap: readonly [string, string],
  goc: readonly Readonly<Record<A | B, string>>[],
  goiY?: string,
): TextField<readonly Readonly<Record<A | B, string>>[]> => ({ nhan, kieu: 'ds-cap', cap, nhanCap, goc, goiY })

export interface PageImage {
  src: string
  srcSet: string
  alt: string
}
/** Danh sách ảnh (mỗi dòng một link ảnh, nút "Thêm ảnh từ Thư viện"; tối đa 8) */
export const dsAnh = (nhan: string, goc: readonly string[], goiY?: string): TextField<readonly string[]> => ({ nhan, kieu: 'ds-anh', goc, goiY })

/** Đường link: /duong-dan/, https://…, tel:, mailto:, hoặc #khoi-trong-trang (nút cuộn tới khối đó) */
export const link = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'link', goc, goiY })

/** Chọn một trong các lựa chọn (ví dụ một sản phẩm); giá trị lạ hoặc trống thì web dùng giá trị gốc */
export const chon = (nhan: string, luaChon: readonly string[], nhanLuaChon: readonly string[], goc: string, goiY?: string): TextField<string> => ({
  nhan,
  kieu: 'chon',
  luaChon,
  nhanLuaChon,
  goc,
  goiY,
})

/**
 * Tích nhiều lựa chọn. Web nhận các ô đã tích theo thứ tự `luaChon`, nên đặt các giá trị gốc lên đầu `luaChon` theo đúng thứ tự
 * đang hiện. Bỏ tích hết thì web dùng giá trị gốc.
 */
export const chonNhieu = (
  nhan: string,
  luaChon: readonly string[],
  nhanLuaChon: readonly string[],
  goc: readonly string[],
  goiY?: string,
): TextField<readonly string[]> => ({ nhan, kieu: 'chon-nhieu', luaChon, nhanLuaChon, goc, goiY })

/** Ảnh chọn từ Thư viện WordPress */
export const anh = (nhan: string, goc: PageImage, goiY?: string): TextField<PageImage> => ({ nhan, kieu: 'anh', goc, goiY })

type Fields = Readonly<Record<string, TextField<unknown>>>
type TextOf<F extends Fields> = { readonly [K in keyof F]: F[K]['goc'] }

export const PAGE_TEXT_GROUP = 'Chữ từng trang'

/**
 * Khai một bộ chữ trang. `khoa` là tên lưu trong WordPress, không đổi sau khi đã lên web (đổi là mất phần Ecopillo đã sửa).
 */
export function definePageText<F extends Fields>(khoa: string, ten: string, moTa: string, fields: F): { set: EditableSet; text: TextOf<F> } {
  const goc = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.goc])) as TextOf<F>
  const truong: EditableField[] = Object.entries(fields).map(([key, f]) => ({
    khoa: key,
    nhan: f.nhan,
    kieu: f.kieu,
    batBuoc: true,
    ...(f.goiY ? { goiY: f.goiY } : {}),
    ...(f.cap ? { cap: f.cap, nhanCap: f.nhanCap } : {}),
    ...(f.luaChon ? { luaChon: f.luaChon, nhanLuaChon: f.nhanLuaChon } : {}),
    ...(f.luaChonThem ? { luaChonThem: f.luaChonThem } : {}),
  }))
  const set: EditableSet = { khoa: `chu-trang-${khoa}`, nhom: PAGE_TEXT_GROUP, ten, moTa, kieu: 'mot', goc, truong }
  return { set, text: liveObject(set.khoa, goc, truong) }
}

/**
 * Ô đã chuyển khỏi một bộ chữ trang sang bộ danh sách riêng (thêm, xoá, đổi thứ tự được): đọc phần Ecopillo đã lưu ở ô cũ
 * để làm dữ liệu ban đầu của bộ mới. Chưa lưu bộ mới thì web vẫn hiện đúng như trước khi chuyển.
 */
export function legacyPageText<F extends Fields>(khoa: string, fields: F): TextOf<F> {
  return definePageText(khoa, '', '', fields).text
}

/**
 * Chữ có chỗ chèn số / tên (đợt E4): ô ghi "Xem thêm {so} câu hỏi", code gọi chen(text, { so: 5 }).
 * Chỗ chèn Ecopillo xoá mất thì câu vẫn hiện (thiếu số), không lỗi; chỗ chèn lạ giữ nguyên chữ. Ghi rõ các chỗ chèn trong gợi ý của ô.
 */
export const chen = (template: string, values: Readonly<Record<string, string | number>>): string =>
  template.replace(/\{([a-zA-Z]+)\}/g, (whole: string, key: string) => (key in values ? String(values[key]) : whole))
