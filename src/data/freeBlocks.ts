import { isLink, liveList, rowKey, type EditableField, type EditableImage, type EditableSet } from './liveContent'

/**
 * Khối tự do (owner 24/11/2026: "khách muốn tự chỉnh sửa toàn bộ web", sau đợt G): Ecopillo tự thêm khối mới vào trang
 * mà không cần bên làm web. Mỗi khối chọn một kiểu dựng sẵn (chữ, chữ + ảnh, ảnh lớn, lưới ảnh, thẻ, dải nền chàm),
 * một nền, và nơi đặt "sau khối … của trang …" (đặt được nhiều nơi). Kiểu dáng theo bộ nhận diện (màu, font Ecopillo chọn ở
 * Giao diện), nên khối mới không lạc với trang. Vẽ ở src/components/ui/FreeBlock.tsx; chèn vào thứ tự trang ở pageLayout.ts.
 */

export type FreeKind = 'chu' | 'chu-anh' | 'anh-rong' | 'luoi-anh' | 'the' | 'dai-cham'
export type FreeBackground = 'trong' | 'trang' | 'xanh'

export interface FreeBlockRow {
  ten: string
  viTri: readonly string[]
  hien: string
  kieu: FreeKind
  nen?: FreeBackground
  anhBen?: 'trai' | 'phai'
  canGiua?: string
  nhan?: string
  tieuDe?: string
  doan?: readonly string[]
  anh?: EditableImage
  dsAnh?: readonly string[]
  the?: readonly { tieuDe: string; moTa: string }[]
  nut?: readonly { chu: string; link: string }[]
  neo?: string
}

/** Một chỗ đặt khối: `<mã bố cục>@dau` (đầu phần đổi được của trang) hoặc `<mã bố cục>@<mã khối>` (ngay sau khối đó) */
export interface FreePlace {
  value: string
  label: string
}

const KINDS: readonly FreeKind[] = ['chu', 'chu-anh', 'anh-rong', 'luoi-anh', 'the', 'dai-cham']
const KIND_LABELS = [
  'Chữ (tiêu đề, đoạn văn, nút)',
  'Chữ và một ảnh cạnh nhau',
  'Một ảnh lớn kèm chú thích',
  'Lưới ảnh (2 đến 8 ảnh)',
  'Các thẻ ý (tiêu đề + mô tả)',
  'Dải nền chàm (câu nổi bật, lời mời, nút)',
]

const fieldsFor = (places: readonly FreePlace[]): readonly EditableField[] => [
  { khoa: 'ten', nhan: 'Tên khối (chỉ để nhận ra ở đây, không hiện trên web)', kieu: 'chu', batBuoc: true },
  {
    khoa: 'viTri',
    nhan: 'Đặt ở đâu',
    kieu: 'chon-nhieu',
    batBuoc: true,
    luaChon: places.map((p) => p.value),
    nhanLuaChon: places.map((p) => p.label),
    goiY: 'Tích một hay nhiều chỗ. Khối nằm ngay sau khối đã chọn, kể cả khi khối đó đang ẩn. Trang chủ máy tính và điện thoại là hai bố cục riêng: muốn hiện cả hai thì tích cả hai.',
  },
  { khoa: 'hien', nhan: 'Trên web', kieu: 'chon', batBuoc: true, luaChon: ['co', 'khong'], nhanLuaChon: ['Hiện', 'Ẩn'] },
  { khoa: 'kieu', nhan: 'Kiểu khối', kieu: 'chon', batBuoc: true, luaChon: KINDS, nhanLuaChon: KIND_LABELS },
  {
    khoa: 'nen',
    nhan: 'Nền',
    kieu: 'chon',
    luaChon: ['trong', 'trang', 'xanh'],
    nhanLuaChon: ['Không nền (nền chung của web)', 'Hộp trắng', 'Hộp xanh nhạt'],
    goiY: 'Dải nền chàm luôn có nền chàm.',
  },
  {
    khoa: 'anhBen',
    nhan: 'Ảnh nằm bên nào (kiểu chữ và ảnh)',
    kieu: 'chon',
    luaChon: ['phai', 'trai'],
    nhanLuaChon: ['Bên phải', 'Bên trái'],
    goiY: 'Trên điện thoại ảnh luôn nằm trên chữ.',
  },
  { khoa: 'canGiua', nhan: 'Căn chữ', kieu: 'chon', luaChon: ['trai', 'giua'], nhanLuaChon: ['Căn trái', 'Căn giữa'] },
  { khoa: 'nhan', nhan: 'Dòng nhỏ trên tiêu đề', kieu: 'chu' },
  { khoa: 'tieuDe', nhan: 'Tiêu đề', kieu: 'chu', goiY: 'Muốn xuống dòng ở đâu thì gõ dấu | ở đó.' },
  { khoa: 'doan', nhan: 'Đoạn văn', kieu: 'doan-nhieu', goiY: 'Cách đoạn bằng một dòng trống. Kiểu ảnh lớn: đây là chú thích ảnh.' },
  { khoa: 'anh', nhan: 'Ảnh (kiểu chữ và ảnh, ảnh lớn)', kieu: 'anh', goiY: 'Nhớ điền chữ thay ảnh (alt) trong Thư viện cho Google và người đọc màn hình.' },
  { khoa: 'dsAnh', nhan: 'Các ảnh (kiểu lưới ảnh, tối đa 8)', kieu: 'ds-anh' },
  {
    khoa: 'the',
    nhan: 'Các thẻ (kiểu thẻ ý)',
    kieu: 'ds-cap',
    cap: ['tieuDe', 'moTa'],
    nhanCap: ['Tiêu đề thẻ', 'Mô tả'],
  },
  {
    khoa: 'nut',
    nhan: 'Nút bấm',
    kieu: 'ds-cap',
    cap: ['chu', 'link'],
    nhanCap: ['Chữ trên nút', 'Bấm vào thì mở'],
    goiY: 'Nút đầu tiên nổi nhất. Link: /duong-dan/ trong web, https://… ngoài web, tel:…, hoặc #ma-khoi để cuộn tới khối trong trang.',
  },
  {
    khoa: 'neo',
    nhan: 'Mã khối (để nút khác cuộn tới bằng #ma-khoi)',
    kieu: 'chu',
    goiY: 'Không bắt buộc. Chỉ chữ thường không dấu và gạch nối, ví dụ uu-dai-thang-12.',
  },
]

/** Bộ "Khối tự do" và các khối Ecopillo đã lưu; `places`: mọi chỗ đặt (pageLayout.ts dựng từ bố cục các trang) */
export function defineFreeBlocks(places: readonly FreePlace[]): { set: EditableSet; rows: readonly FreeBlockRow[] } {
  const fields = fieldsFor(places)
  const set: EditableSet = {
    khoa: 'khoi-tu-do',
    nhom: 'Giao diện',
    ten: 'Khối tự do (thêm khối mới vào trang)',
    moTa: 'Thêm khối mới vào bất kỳ trang nào: chọn kiểu khối, nền, chỗ đặt rồi điền chữ, ảnh, nút. Sửa, ẩn, xoá, đổi thứ tự (khối cùng chỗ đặt hiện theo thứ tự ở đây) bất cứ lúc nào.',
    kieu: 'nhieu',
    goc: [],
    tieuDeDong: 'ten',
    coTheTrong: true,
    truong: fields,
  }
  const rows = liveList<FreeBlockRow>(set.khoa, [], fields, () => ({ ten: '', viTri: [], hien: 'co', kieu: 'chu' })).map((row) =>
    ({
      ...row,
      neo: row.neo ? rowKey(row.neo) || undefined : undefined,
      // ô cặp không tự kiểm link: bỏ nút có link lạ (javascript:…), ảnh lưới đã kiểm ở ds-anh
      nut: row.nut?.filter((b) => isLink(b.link.trim())).map((b) => ({ chu: b.chu, link: b.link.trim() })),
    }),
  )
  return { set, rows }
}

/** Mã của khối tự do thứ i trong thứ tự trang */
export const freeId = (index: number): string => `tu-do-${index}`
export const freeIndex = (id: string): number | undefined => {
  const match = /^tu-do-(\d+)$/.exec(id)
  return match ? Number(match[1]) : undefined
}
export const isFreeBlockId = (id: string): boolean => freeIndex(id) !== undefined
