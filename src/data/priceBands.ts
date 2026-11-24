import { slugify } from '../lib/slug'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import type { CategoryId } from './products'

/**
 * Mốc giá của bộ lọc "Mức giá" ở trang Sản phẩm (mẫu 1 "Mốc giá theo từng loại", owner chọn 15/10/2026; mẫu: docs/de-xuat-bo-loc-gia.html).
 * Ecopillo sửa ở Nội dung web → Sản phẩm → "Mức giá: …" (owner 24/11/2026: khách sửa, thêm, xoá được mọi thứ): mỗi nhóm một bộ,
 * mỗi dòng một mốc (chữ trên nút, từ, đến dưới). Mã mốc (trên link ?gia=…) của mốc có sẵn giữ nguyên; mốc mới lấy mã theo chữ trên nút.
 * Không tin mù bản lưu: mốc giá âm, "đến" không lớn hơn "từ" thì bỏ; các mốc xếp lại theo giá tăng dần; bỏ hết thì dùng mốc gốc.
 */

export interface PriceBand {
  /** Dùng trong link: ?gia=5-10-trieu */
  id: string
  label: string
  /** Khoảng [from, to): to = Infinity là "Trên …" */
  from: number
  to: number
}

export type PriceBandGroup = CategoryId | 'tat-ca'

const MILLION = 1_000_000

const band = (id: string, label: string, from: number, to = Infinity): PriceBand => ({ id, label, from, to })

/** Mốc gốc. Mốc đổi theo loại vì giá mỗi loại chênh rất khác nhau (gối vài trăm nghìn, đệm hàng chục triệu) */
const BASE_BANDS: Readonly<Record<PriceBandGroup, readonly PriceBand[]>> = {
  'tat-ca': [
    band('duoi-1-trieu', 'Dưới 1 triệu', 0, MILLION),
    band('1-3-trieu', '1 – 3 triệu', MILLION, 3 * MILLION),
    band('3-6-trieu', '3 – 6 triệu', 3 * MILLION, 6 * MILLION),
    band('6-10-trieu', '6 – 10 triệu', 6 * MILLION, 10 * MILLION),
    band('tren-10-trieu', 'Trên 10 triệu', 10 * MILLION),
  ],
  'bo-chan-ga': [
    band('duoi-5-trieu', 'Dưới 5 triệu', 0, 5 * MILLION),
    band('5-8-trieu', '5 – 8 triệu', 5 * MILLION, 8 * MILLION),
    band('tren-8-trieu', 'Trên 8 triệu', 8 * MILLION),
  ],
  chan: [
    band('duoi-2-trieu', 'Dưới 2 triệu', 0, 2 * MILLION),
    band('2-4-trieu', '2 – 4 triệu', 2 * MILLION, 4 * MILLION),
    band('tren-4-trieu', 'Trên 4 triệu', 4 * MILLION),
  ],
  goi: [
    band('duoi-500k', 'Dưới 500 nghìn', 0, 500_000),
    band('500k-1-trieu', '500 nghìn – 1 triệu', 500_000, MILLION),
    band('tren-1-trieu', 'Trên 1 triệu', MILLION),
  ],
  dem: [
    band('duoi-5-trieu', 'Dưới 5 triệu', 0, 5 * MILLION),
    band('5-10-trieu', '5 – 10 triệu', 5 * MILLION, 10 * MILLION),
    band('10-20-trieu', '10 – 20 triệu', 10 * MILLION, 20 * MILLION),
    band('tren-20-trieu', 'Trên 20 triệu', 20 * MILLION),
  ],
}

/** Tên nhóm trong màn hình sửa (chỉ hiện trong wp-admin) */
const GROUP_NAMES: Readonly<Record<PriceBandGroup, string>> = {
  'tat-ca': 'khi xem Tất cả',
  'bo-chan-ga': 'nhóm Bộ chăn ga',
  chan: 'nhóm Chăn',
  goi: 'nhóm Gối',
  dem: 'nhóm Đệm & topper',
}

const GROUPS: readonly PriceBandGroup[] = ['tat-ca', 'bo-chan-ga', 'chan', 'goi', 'dem']

/** Một mốc trong màn hình sửa. `den` trống: mốc "Trên …" */
interface BandRow {
  ma: string
  nhan: string
  tu: number
  den?: number
}

const toRow = (b: PriceBand): BandRow => ({ ma: b.id, nhan: b.label, tu: b.from, ...(Number.isFinite(b.to) ? { den: b.to } : {}) })

const FIELDS: readonly EditableField[] = [
  { khoa: 'nhan', nhan: 'Chữ trên nút', kieu: 'chu', batBuoc: true, goiY: 'Ví dụ "5 – 8 triệu", "Trên 8 triệu".' },
  {
    khoa: 'tu',
    nhan: 'Từ (đồng)',
    kieu: 'so',
    batBuoc: true,
    goiY: 'Giá thấp nhất của mốc, tính bằng đồng, ví dụ 5000000 (5 triệu). Mốc đầu tiên ghi 0. Không được âm.',
  },
  {
    khoa: 'den',
    nhan: 'Đến dưới (đồng)',
    kieu: 'so',
    goiY: 'Ví dụ 8000000: sản phẩm giá đúng 8 triệu thuộc mốc sau. Phải lớn hơn ô "Từ". Để trống: mốc "Trên …" (thường là mốc cuối).',
  },
]

const setOf = (group: PriceBandGroup): EditableSet => ({
  khoa: `muc-gia-${group}`,
  nhom: 'Sản phẩm',
  ten: `Mức giá ${GROUP_NAMES[group]}`,
  moTa:
    `Các nút "Mức giá" trong bộ lọc trang Sản phẩm ${GROUP_NAMES[group]}. Mỗi dòng một mốc: thêm, xoá, đổi chữ, đổi khoảng giá. ` +
    'Một sản phẩm có nhiều cỡ thuộc mọi mốc có ít nhất một cỡ nằm trong. Web tự xếp các mốc theo giá tăng dần; mốc sai (giá âm, "đến" không lớn hơn "từ") không hiện.',
  kieu: 'nhieu',
  goc: BASE_BANDS[group].map(toRow),
  truong: FIELDS,
  tieuDeDong: 'nhan',
  khoaDong: 'ma',
})

export const PRICE_BAND_SETS: readonly EditableSet[] = GROUPS.map(setOf)

const EMPTY_ROW: BandRow = { ma: '', nhan: '', tu: 0 }

/** Bản Ecopillo đã lưu → mốc giá: bỏ mốc sai, mã trùng thì thêm số, xếp theo giá tăng dần */
function bandsOf(group: PriceBandGroup, set: EditableSet): readonly PriceBand[] {
  const base = BASE_BANDS[group]
  const baseRows = set.goc as readonly BandRow[]
  const rows = liveList<BandRow>(set.khoa, baseRows, FIELDS, (_i, row) => baseRows.find((r) => r.ma && r.ma === row.ma) ?? { ...EMPTY_ROW })
  if (rows === baseRows) return base
  const used = new Set<string>()
  const bands = rows.flatMap((row, i): PriceBand[] => {
    const from = Math.round(row.tu)
    const to = row.den === undefined ? Infinity : Math.round(row.den)
    if (!(from >= 0) || !(to > from)) return []
    const wanted = row.ma || slugify(row.nhan) || `muc-${i + 1}`
    let id = wanted
    for (let n = 2; used.has(id); n += 1) id = `${wanted}-${n}`
    used.add(id)
    return [{ id, label: row.nhan, from, to }]
  })
  // sort ổn định: hai mốc cùng "từ" giữ thứ tự Ecopillo xếp
  return bands.length ? [...bands].sort((a, b) => a.from - b.from) : base
}

/** Mốc giá từng nhóm (đã ghép bản Ecopillo sửa) */
export const PRICE_BANDS: Readonly<Record<PriceBandGroup, readonly PriceBand[]>> = Object.fromEntries(
  GROUPS.map((group, i) => [group, bandsOf(group, PRICE_BAND_SETS[i])]),
) as Record<PriceBandGroup, readonly PriceBand[]>
