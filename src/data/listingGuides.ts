import { LISTINGS } from './links'
import { liveList, rowKey, type EditableField, type EditableSet } from './liveContent'
/**
 * Phần "Chọn thế nào" ở cuối trang danh mục nhỏ (đệm lò xo, ruột chăn gối…). Khoá là đường link trong LISTINGS (links.ts).
 *
 * Nguồn: đoạn mô tả danh mục trên web cũ (lấy qua API WordPress ngày 15/10/2026, docs/link-web-cu/noi-dung-web-cu/).
 * Giữ ý có ích cho người mua (khác nhau thế nào, hợp với ai), bỏ câu quảng cáo chung chung và lời kể ngôi thứ nhất.
 * Mỗi đoạn ngắn, đọc lướt được; chi tiết từng dòng đệm nằm ở trang sản phẩm.
 */

export interface ListingGuide {
  title: string
  points: readonly { title: string; text: string }[]
}

/** Bản gốc trong code; khối đệm trang chủ (mattressPicker.ts) lấy chữ cách nằm ở đây khi Ecopillo bỏ phần của Đệm Ecopillo */
export const BASE_LISTING_GUIDES: Readonly<Record<string, ListingGuide>> = {
  '/danh-muc-san-pham/dem-ecopillo/': {
    title: 'Chọn đệm theo cách Quý khách thích nằm',
    points: [
      { title: 'Thích êm, ôm người', text: 'Đệm Eco Foam đa tầng: foam đàn hồi ôm theo đường cong cơ thể, nằm "đầm" người.' },
      { title: 'Thích êm mà vẫn đỡ chắc', text: 'Đệm lò xo túi độc lập (24 cm), Eco Luxe (28 cm, mặt Pillow Top) hoặc Eco Royal (29 cm, có lớp cao su và memory foam).' },
      { title: 'Cần nâng đỡ tốt, bền lâu', text: 'Đệm cao su thiên nhiên Eco Latex: đàn hồi tự nhiên, thoáng, không hầm lưng.' },
      { title: 'Thích nằm cứng, gấp gọn', text: 'Đệm bông ép Gấm Thuần Khiết (gập 3) hoặc bông Nano chần foam (gập 2, mặt êm hơn): hợp người lớn tuổi và trẻ nhỏ.' },
      { title: 'Đệm đang cứng quá', text: 'Trải thêm topper Micro Fiber 9 cm, không phải thay đệm.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-lo-xo/': {
    title: 'Đệm lò xo nào hợp Quý khách',
    points: [
      { title: 'Lò xo túi độc lập', text: 'Mỗi lò xo một túi, hoạt động riêng: người bên cạnh trở mình không làm rung cả đệm.' },
      { title: 'Đệm 24 cm, êm vừa', text: 'Đệm lò xo túi độc lập Ecopillo: hợp đa số người, giá dễ tiếp cận, bảo hành 10 năm.' },
      { title: 'Đệm 28 cm, mặt Pillow Top', text: 'Eco Luxe: lõi lò xo túi 16 cm, thêm lớp topper foam 4 cm ôm vai, hông, eo. Êm vừa, hợp cả trẻ em và người hay đau lưng.' },
      { title: 'Đệm 29 cm, êm sâu', text: 'Eco Royal: lò xo phân vùng vai, lưng, hông, thêm lớp cao su và memory foam. Hợp người lớn tuổi, người đau lưng.' },
      { title: 'Nằm thử trước khi mua', text: 'Đệm khó chọn qua ảnh: Quý khách nên nằm thử tại hệ thống phân phối và showroom Ecopillo trên toàn quốc.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-cao-su/': {
    title: 'Vì sao chọn đệm cao su thiên nhiên',
    points: [
      { title: 'Đàn hồi tự nhiên', text: 'Lõi 100% cao su thiên nhiên nâng đỡ đều, nằm lâu không xẹp lún.' },
      { title: 'Thoáng, kháng khuẩn', text: 'Lõi đục lỗ cho khí lưu thông; cao su có tính kháng khuẩn tự nhiên.' },
      { title: 'Vỏ tháo giặt được', text: 'Vỏ ngoài vải lạnh, vỏ trong lưới thoáng có khoá kéo.' },
      { title: 'Ba độ dày', text: '10, 15, 20 cm: dày hơn thì êm và đỡ sâu hơn.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-bong-ep/': {
    title: 'Đệm bông ép hợp với ai',
    points: [
      { title: 'Người thích nằm cứng', text: 'Độ cứng vừa phải, nằm phẳng lưng.' },
      { title: 'Người lớn tuổi, trẻ nhỏ', text: 'Mặt đệm vững, không lún, đỡ cột sống.' },
      { title: 'Nhà cần gọn', text: 'Gấm Thuần Khiết gập 3, bông Nano chần foam gập 2: dễ di chuyển và cất khi không dùng. Vỏ gấm màu trung tính, dễ phối chăn ga.' },
      { title: 'Muốn mặt nằm êm hơn', text: 'Bông Nano chần foam: vỏ chần thêm một lớp foam K43, vẫn giữ độ cứng của đệm bông ép.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-foam/': {
    title: 'Đệm foam là gì',
    points: [
      { title: 'Ôm theo cơ thể', text: 'Foam đàn hồi lún theo đường cong người nằm, giảm áp lực ở vai và hông.' },
      { title: 'Êm và đầm', text: 'Hợp người thích đệm êm, ít nảy.' },
      { title: 'Gọn khi giao', text: 'Đệm nguyên tấm, hút chân không cuộn tròn, mở ra là nở đủ dày.' },
    ],
  },
  // Trang chỉ còn ruột chăn (chị Phương 18/11/2026); chữ lấy từ trang sản phẩm Micro Fiber, Micro Plus
  '/danh-muc-san-pham/san-pham/ruot-chan-goi/': {
    title: 'Chọn ruột chăn',
    points: [
      { title: 'Micro Fiber', text: 'Ấm, nhẹ, giặt máy được.' },
      { title: 'Micro Plus', text: 'Ấm nhanh mà không cần chăn dày nặng; chần điểm tròn nên sợi không dồn, không vón cục.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/': {
    title: 'Năm độ êm của ruột gối Ecopillo',
    points: [
      { title: 'Micro Fiber', text: 'Êm, mềm, giặt máy được. Hợp người dễ dị ứng.' },
      { title: 'Micro Plus', text: 'Đàn hồi, giữ phom, vỏ chống thấm. Gối dùng hằng ngày.' },
      { title: 'Tơ tằm', text: 'Lớp tơ tằm mát ở trên, lớp micro fiber đỡ ở dưới.' },
      { title: 'Cao su thiên nhiên', text: 'Thấp 7 cm, đục lỗ thoáng, đỡ cổ tốt.' },
      { title: 'Lông vũ tự nhiên', text: 'Bồng bềnh nhất, chuẩn khách sạn 5 sao.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/bo-ga-phu/': {
    title: 'Ga phủ hay ga chun',
    points: [
      { title: 'Ga phủ', text: 'Phủ kín mặt và viền đệm, che cả khung giường: phòng ngủ gọn, sang. Ecopillo có ga phủ chần thêu (Eco Doris) và dệt Jacquard (Eco Sweet).' },
      { title: 'Ga chun', text: 'Bo chun ôm mặt đệm, ít xô lệch, thay giặt nhanh. Bộ Eco Flora.' },
      { title: 'Bộ chăn ga gối', text: 'Eco Rosa, Eco Tera, Eco Vera, Eco Liora: đủ ga, vỏ chăn, vỏ gối cùng một hoạ tiết.' },
      { title: 'Đo trước khi đặt', text: 'Đo dài, rộng, dày của đệm. Đệm cỡ lạ: Ecopillo nhận may theo số đo.' },
    ],
  },
}

/* ——— Ecopillo tự sửa (Nội dung web → Chữ từng trang) ———
 * Owner 24/11/2026 ("thêm được thì phải sửa được và xoá được"): thêm phần cho bất kỳ trang danh mục nào, cả trang danh mục
 * Ecopillo tạo sau trong Woo (ô "Trang danh mục", luaChonThem 'danh-muc'); xoá dòng là trang đó không còn phần "Chọn thế nào".
 * Dòng lưu trước đợt này có mã ẩn `path` đã qua sanitize_title ("danh-muc-san-pham-dem-ecopillo"): so bằng rowKey để về đúng trang.
 */

interface GuideRow {
  path: string
  title: string
  points: readonly { title: string; text: string }[]
}

const GUIDE_ROWS: readonly GuideRow[] = Object.entries(BASE_LISTING_GUIDES).map(([path, g]) => ({ path, title: g.title, points: g.points.map((p) => ({ ...p })) }))
const LISTING_PATHS = Object.keys(LISTINGS)
const GUIDE_FIELDS: readonly EditableField[] = [
  {
    khoa: 'path',
    nhan: 'Trang danh mục',
    kieu: 'chon',
    batBuoc: true,
    luaChon: LISTING_PATHS,
    nhanLuaChon: LISTING_PATHS.map((path) => `${LISTINGS[path].title} (${path})`),
    luaChonThem: [{ nguon: 'danh-muc' }],
    goiY: 'Phần hiện ở cuối trang này. Mỗi trang một phần; hai dòng cùng trang thì dòng trên được dùng.',
  },
  { khoa: 'title', nhan: 'Tiêu đề phần', kieu: 'chu', batBuoc: true },
  { khoa: 'points', nhan: 'Các ý', kieu: 'ds-cap', batBuoc: true, cap: ['title', 'text'], nhanCap: ['Chữ đậm', 'Câu giải thích'] },
]
export const LISTING_GUIDES_SET: EditableSet = {
  khoa: 'chu-trang-danh-muc-chon-the-nao',
  nhom: 'Chữ từng trang',
  ten: 'Phần "Chọn thế nào" của danh mục',
  moTa:
    'Phần hướng dẫn chọn ở cuối các trang danh mục nhỏ (và 4 dòng cách nằm của khối đệm trang chủ, lấy từ phần của danh mục Đệm Ecopillo). ' +
    'Thêm dòng và chọn trang để thêm phần cho một trang danh mục (cả trang danh mục mới tạo trong Woo); xoá dòng là trang đó không còn phần này.',
  kieu: 'nhieu',
  goc: GUIDE_ROWS,
  tieuDeDong: 'title',
  truong: GUIDE_FIELDS,
}
const EMPTY_GUIDE: GuideRow = { path: '', title: '', points: [] }
const LIVE_GUIDES = liveList<GuideRow>(LISTING_GUIDES_SET.khoa, GUIDE_ROWS, GUIDE_FIELDS, (_i, row) => GUIDE_ROWS.find((r) => rowKey(r.path) === rowKey(row.path)) ?? EMPTY_GUIDE)

/** Phần "Chọn thế nào" theo link trang danh mục. Chưa lưu: như bản gốc; đã lưu: đúng các dòng Ecopillo giữ (dòng trên thắng) */
export const LISTING_GUIDES: Readonly<Record<string, ListingGuide>> = Object.fromEntries(
  [...LIVE_GUIDES].reverse().map((row) => [row.path, { title: row.title, points: row.points }]),
)
