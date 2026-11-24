import { PATHS, withSlash } from '../links'
import { liveList, type EditableField, type EditableSet } from '../liveContent'
import { isMenuLink, isSiteLink } from './linkField'

/**
 * Menu chính Ecopillo tự sửa (owner 24/11/2026: khách tự sửa được mọi chi tiết, kể cả menu): đổi chữ, đổi link, đổi thứ tự,
 * ẩn, thêm mục. Dùng cho thanh đầu trang máy tính, menu điện thoại và cột "Khám phá" ở chân trang.
 *
 * Gốc theo các quyết định đã chốt (Header.tsx trước 24/11/2026):
 * - Biên bản chốt mục 48: Showroom đổi thành Hệ thống phân phối; phản hồi 05/11 mục 9 gộp vào "Liên hệ mua hàng".
 * - Góp ý 04/11 mục 3, 13 (owner chọn B + X1 05/11): "Sản phẩm" mở ô xổ năm nhóm (ProductMenu.tsx).
 * - Owner 19/11/2026: Đăng ký mở đại lý, Quà tặng, Tin tức, Hỏi đáp trở lại thanh máy tính; 1024–1279px gom vào nút "Thêm".
 * - Tên ngắn "Giới thiệu", "Khách sạn & dự án" cho vừa thanh ở 1024px (05/11/2026); link giữ như web cũ.
 */

/** Chỗ hiện của một mục trên thanh máy tính */
export type MenuPlace = 'thanh' | 'them' | 'an'

const PLACES: readonly MenuPlace[] = ['thanh', 'them', 'an']

export interface MainMenuItem {
  /** Chữ hiện trên menu */
  ten: string
  /** Đường dẫn trong web (/…) hoặc https://… */
  link: string
  cho: MenuPlace
}

const FIELDS: readonly EditableField[] = [
  { khoa: 'ten', nhan: 'Chữ hiện trên menu', kieu: 'chu', batBuoc: true, goiY: 'Ngắn thôi: thanh máy tính 1024px chỉ đủ chỗ cho chữ ngắn' },
  {
    khoa: 'link',
    nhan: 'Bấm vào thì mở',
    kieu: 'link',
    batBuoc: true,
    goiY: `Trang trong web (bắt đầu bằng /, ví dụ ${PATHS.blog}) hoặc https://… (mở thẻ mới). Mục có link ${PATHS.products} là nút mở ô xổ Sản phẩm.`,
  },
  {
    khoa: 'cho',
    nhan: 'Hiện ở đâu',
    kieu: 'chon',
    batBuoc: true,
    luaChon: PLACES,
    nhanLuaChon: [
      'Luôn nằm trên thanh máy tính',
      'Trên thanh từ màn 1280px; màn nhỏ hơn gom vào nút "Thêm"',
      'Ẩn (không hiện ở thanh, menu điện thoại, chân trang)',
    ],
    goiY: 'Menu điện thoại và cột "Khám phá" ở chân trang hiện mọi mục không ẩn, theo đúng thứ tự này.',
  },
]

const BASE_MENU: readonly MainMenuItem[] = [
  { ten: 'Sản phẩm', link: PATHS.products, cho: 'thanh' },
  { ten: 'Giới thiệu', link: PATHS.about, cho: 'thanh' },
  // Owner đổi tên 15/10/2026: "Khách sạn" → "Khách sạn và dự án"; viết "&" cho gọn thanh (05/11/2026)
  { ten: 'Khách sạn & dự án', link: PATHS.hotel, cho: 'thanh' },
  { ten: 'Liên hệ mua hàng', link: PATHS.contact, cho: 'thanh' },
  { ten: 'Đăng ký mở đại lý', link: PATHS.recruit, cho: 'them' },
  // Khách yêu cầu 16/10/2026: "Quà tặng" thành "Quà tặng và sự kiện" (link giữ /qua-tang/)
  { ten: 'Quà tặng và sự kiện', link: PATHS.gifts, cho: 'them' },
  { ten: 'Tin tức', link: PATHS.blog, cho: 'them' },
  { ten: 'Hỏi đáp', link: PATHS.faq, cho: 'them' },
]

export const MAIN_MENU_SET: EditableSet = {
  khoa: 'menu-chinh',
  nhom: 'Giao diện',
  ten: 'Menu chính',
  moTa:
    'Các mục trên thanh đầu trang, menu điện thoại và cột "Khám phá" ở chân trang: đổi chữ, đổi link, đổi thứ tự, ẩn, thêm, xoá. ' +
    'Thanh máy tính chật: thêm mục mới thì nên chọn "gom vào nút Thêm" và xem lại ở màn 1024px.',
  kieu: 'nhieu',
  goc: BASE_MENU,
  truong: FIELDS,
  tieuDeDong: 'ten',
}

const LIVE_MENU = liveList<MainMenuItem>(MAIN_MENU_SET.khoa, BASE_MENU, FIELDS, () => ({ ten: '', link: '', cho: 'thanh' }))
// Chỉ nhận link trong web hoặc https (ô link của màn hình sửa còn nhận tel:, mailto:, http://)
const VALID_MENU = LIVE_MENU.filter((item) => isMenuLink(item.link))

/** Mọi mục, cả mục ẩn (theo thứ tự Ecopillo xếp) */
export const MAIN_MENU: readonly MainMenuItem[] = VALID_MENU.length ? VALID_MENU : BASE_MENU

/** Các mục đang hiện: menu điện thoại, chân trang */
export const SHOWN_MENU: readonly MainMenuItem[] = MAIN_MENU.filter((item) => item.cho !== 'an')

/** Khoá so trang đang xem: đường dẫn trong web bỏ ?…#…, có "/" cuối; link ngoài giữ nguyên */
export const menuKey = (link: string): string => (isSiteLink(link) ? withSlash(link.split(/[?#]/)[0]) : link)

/** Mục mở ô xổ Sản phẩm */
export const isProductMenuItem = (item: MainMenuItem): boolean => menuKey(item.link) === PATHS.products
