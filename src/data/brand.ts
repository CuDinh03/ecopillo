import { slugify } from '../lib/slug'
import { liveList, liveObject, type EditableField, type EditableSet } from './liveContent'
import { anh, chu, definePageText, doan } from './pageText/define'

export const BRAND = {
  name: 'Ecopillo',
  company: 'Công ty TNHH Ecopillo Eternal Việt Nam',
  slogan: 'Nâng niu giấc mơ xanh',
  philosophy: ['Tốt', 'Thật', 'Thiện'] as const,
  years: '15+',
  // Owner 18/11/2026: thay 15.000 bằng "hàng trăm nghìn" (mức số thống nhất cả web; tên chương trình "Tri ân 15.000 khách hàng" giữ nguyên); chân trang: "…nâng niu giấc ngủ của hàng trăm nghìn gia đình Việt"
  customers: 'hàng trăm nghìn',
} as const

/**
 * Biên bản chốt mục 39: Ecopillo sẽ thay số hotline mới và gửi riêng địa chỉ, hotline của
 * từng chi nhánh. Khi có số mới chỉ cần sửa 3 dòng hotline/Zalo dưới đây.
 */
const BASE_CONTACT = {
  hotlineDisplay: '0988 832 072',
  zaloUrl: 'https://zalo.me/0988832072',
  /** Số thứ hai. Khách 08/11/2026: "Chỉ để 2 số này: 0988 832 072 hoặc 0922 926 678" (thay 0978 678 378) */
  phoneDisplay: '0922 926 678',
  messengerUrl: 'https://m.me/Ecopillo.com.vn',
  /** Khách 09/11/2026 (Zalo anh Quang): liên hệ qua email này, mọi form đăng ký cũng gửi về đây (thay cskh@ecopillo.com.vn) */
  email: 'ecopillo.com.vn@gmail.com',
  fanpageDisplay: 'facebook.com/Ecopillo.com.vn',
  fanpageUrl: 'https://www.facebook.com/Ecopillo.com.vn',
  tiktokUrl: 'https://www.tiktok.com/@ecopillo.official',
  instagramUrl: 'https://www.instagram.com/ecopillo.com.vn/',
  youtubeUrl: 'https://www.youtube.com/@EcopilloVietNam',
  /** Trang thông báo website với Bộ Công Thương (online.gov.vn), theo web cũ */
  moitUrl: 'https://online.gov.vn/nen-tang/94e80465-51e2-4e05-a37c-b1fc532d4bc3',
  gioMoCua: '8:30–22:00 hằng ngày',
  // Chị Phương 18/11/2026: "Bên chị chỉ thanh toán duy nhất 1 tài khoản", "Giờ đang k cho dùng tiền mặt"
  chuTaiKhoan: 'Công ty TNHH Ecopillo Eternal Việt Nam',
  soTaiKhoan: '88662622',
  nganHang: 'Techcombank',
}

/** Thông tin liên hệ Ecopillo tự sửa trong WordPress (liveContent.ts). Số "tel:" tự lấy từ số hiển thị */
export const CONTACT_SET: EditableSet = {
  khoa: 'lien-he',
  nhom: 'Thông tin chung',
  ten: 'Liên hệ, mạng xã hội',
  moTa: 'Hotline, Zalo, email, link mạng xã hội, giờ mở cửa: hiện ở đầu trang, chân trang, trang Liên hệ, nút gọi.',
  kieu: 'mot',
  goc: BASE_CONTACT,
  truong: [
    { khoa: 'hotlineDisplay', nhan: 'Hotline chính', kieu: 'chu', batBuoc: true, goiY: 'Ghi như muốn hiện, ví dụ 0988 832 072' },
    { khoa: 'phoneDisplay', nhan: 'Số điện thoại thứ hai', kieu: 'chu', batBuoc: true },
    { khoa: 'zaloUrl', nhan: 'Link Zalo', kieu: 'link', batBuoc: true, goiY: 'https://zalo.me/<số điện thoại>' },
    { khoa: 'messengerUrl', nhan: 'Link Messenger', kieu: 'link', batBuoc: true },
    { khoa: 'email', nhan: 'Email liên hệ', kieu: 'chu', batBuoc: true },
    { khoa: 'gioMoCua', nhan: 'Giờ mở cửa', kieu: 'chu', batBuoc: true },
    { khoa: 'fanpageDisplay', nhan: 'Tên fanpage hiện trên web', kieu: 'chu', batBuoc: true },
    { khoa: 'fanpageUrl', nhan: 'Link fanpage Facebook', kieu: 'link', batBuoc: true },
    { khoa: 'tiktokUrl', nhan: 'Link TikTok', kieu: 'link', batBuoc: true },
    { khoa: 'instagramUrl', nhan: 'Link Instagram', kieu: 'link', batBuoc: true },
    { khoa: 'youtubeUrl', nhan: 'Link kênh YouTube', kieu: 'link', batBuoc: true },
    { khoa: 'moitUrl', nhan: 'Link thông báo Bộ Công Thương', kieu: 'link', batBuoc: true },
    { khoa: 'chuTaiKhoan', nhan: 'Tên tài khoản nhận thanh toán', kieu: 'chu', batBuoc: true, goiY: 'Tài khoản duy nhất nhận tiền; hiện ở Chính sách thanh toán, bước đặt hàng' },
    { khoa: 'soTaiKhoan', nhan: 'Số tài khoản', kieu: 'chu', batBuoc: true },
    { khoa: 'nganHang', nhan: 'Ngân hàng', kieu: 'chu', batBuoc: true },
  ] satisfies EditableField[],
}

const telOf = (display: string): string => `tel:${display.replace(/\D/g, '')}`
const LIVE_CONTACT = liveObject(CONTACT_SET.khoa, BASE_CONTACT, CONTACT_SET.truong)

export const CONTACT = {
  ...LIVE_CONTACT,
  hotlineTel: telOf(LIVE_CONTACT.hotlineDisplay),
  phoneTel: telOf(LIVE_CONTACT.phoneDisplay),
}

export interface SocialLink {
  id: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'zalo'
  label: string
  handle: string
  url: string
}

const BASE_SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'facebook', label: 'Facebook', handle: 'Ecopillo.com.vn', url: 'https://www.facebook.com/Ecopillo.com.vn' },
  { id: 'tiktok', label: 'TikTok', handle: '@ecopillo.official', url: 'https://www.tiktok.com/@ecopillo.official' },
  { id: 'instagram', label: 'Instagram', handle: 'ecopillo.com.vn', url: 'https://www.instagram.com/ecopillo.com.vn/' },
  { id: 'youtube', label: 'YouTube', handle: '@EcopilloVietNam', url: 'https://www.youtube.com/@EcopilloVietNam' },
  { id: 'zalo', label: 'Zalo', handle: '0988 832 072', url: 'https://zalo.me/0988832072' },
]

const SOCIAL_IDS = ['facebook', 'tiktok', 'instagram', 'youtube', 'zalo'] as const

export const SOCIAL_SET: EditableSet = {
  khoa: 'mang-xa-hoi',
  nhom: 'Thông tin chung',
  ten: 'Ô mạng xã hội',
  moTa: 'Các ô mạng xã hội ở trang chủ và chân trang. Biểu tượng theo ô "Mạng".',
  kieu: 'nhieu',
  goc: BASE_SOCIAL_LINKS,
  tieuDeDong: 'label',
  truong: [
    { khoa: 'id', nhan: 'Mạng', kieu: 'chon', batBuoc: true, luaChon: SOCIAL_IDS },
    { khoa: 'label', nhan: 'Tên hiện', kieu: 'chu', batBuoc: true },
    { khoa: 'handle', nhan: 'Tên tài khoản', kieu: 'chu', batBuoc: true },
    { khoa: 'url', nhan: 'Link', kieu: 'link', batBuoc: true },
  ] satisfies EditableField[],
}

export const SOCIAL_LINKS: readonly SocialLink[] = liveList(SOCIAL_SET.khoa, BASE_SOCIAL_LINKS, SOCIAL_SET.truong, (i) => ({
  ...(BASE_SOCIAL_LINKS[i] ?? BASE_SOCIAL_LINKS[0]),
}))

/**
 * Phim thương hiệu trên kênh YouTube Ecopillo (trang chủ, trang Giới thiệu). Câu dẫn: chị Phương 19/11/2026.
 * Ecopillo tự sửa ở Nội dung web → Chữ từng trang → Phim thương hiệu (pageText/define.ts).
 */
const { set: BRAND_VIDEO_SET_, text: VIDEO } = definePageText(
  'phim',
  'Phim thương hiệu',
  'Khối phim YouTube ở trang chủ và trang Giới thiệu: tiêu đề, câu dẫn, mã phim, ảnh bìa.',
  {
    tieuDe: chu('Tiêu đề khối', 'Một giấc ngủ được nâng niu'),
    danDat: doan('Câu dẫn', 'Xem video để hiểu hơn về chúng tôi.'),
    maPhim: chu('Mã phim YouTube', 'MLo9LwZdmVQ', 'Phần sau "v=" trong link YouTube, ví dụ youtube.com/watch?v=MLo9LwZdmVQ'),
    tenPhim: chu('Tên phim (hiện trên ảnh bìa)', 'Chăn ga gối đệm Ecopillo – Nâng niu giấc mơ xanh'),
    kenh: chu('Dòng nhỏ trên ảnh bìa', 'YouTube · Ecopillo Việt Nam'),
    nutKenh: chu('Chữ link sang kênh YouTube', 'Xem thêm trên kênh YouTube Ecopillo'),
    anhBia: anh('Ảnh bìa', {
      src: '/images/video/bia-phim.webp',
      srcSet: '/images/video/bia-phim-sm.webp 800w, /images/video/bia-phim.webp 1280w',
      alt: 'Đội ngũ Ecopillo tại cửa hàng',
    }),
  },
)
export const BRAND_VIDEO_SET = BRAND_VIDEO_SET_
/** Mã phim chỉ gồm chữ, số, - và _ (đặt vào link nhúng): sai thì dùng mã gốc */
const VIDEO_ID = /^[\w-]{6,20}$/.test(VIDEO.maPhim) ? VIDEO.maPhim : 'MLo9LwZdmVQ'

export const BRAND_VIDEO_LEAD: string = VIDEO.danDat
export const BRAND_VIDEO = { id: VIDEO_ID, title: VIDEO.tenPhim, heading: VIDEO.tieuDe, channel: VIDEO.kenh, channelLink: VIDEO.nutKenh, cover: VIDEO.anhBia }

export const OPENING_HOURS: string = CONTACT.gioMoCua

/** Biên bản chốt mục 28 và 39: đổi "Showroom" thành "Hệ thống phân phối" */
export interface Showroom {
  id: string
  /** Văn phòng đại diện / Chi nhánh / Đại lý (Đà Nẵng, owner chốt 09/11/2026) */
  kind: 'Văn phòng đại diện' | 'Chi nhánh' | 'Đại lý'
  /** Tên trên thẻ ở trang Hệ thống phân phối (data/dealers.ts) */
  dealerName: string
  city: string
  /** Tên tỉnh/thành trong danh sách 34 tỉnh (data/dealers.ts) */
  province: string
  address: string
  /** Toạ độ dán từ Google Maps */
  lat: number
  lng: number
  /** Hotline riêng của điểm; chưa có thì dùng hotline chung */
  hotline?: string
  mapsUrl: string
  imageNote: string
  /** Ảnh thật: bản rộng cho thẻ trang chủ và bản nhỏ cho thẻ đại lý. Bỏ trống thì hiện khung chờ ảnh */
  photo?: { src: string; srcSet: string; alt: string }
  /** Ảnh dọc trên thẻ ngang: chọn phần ảnh được giữ (object-position), ví dụ 'center 22%' */
  photoPosition?: string
}

/** Bản đồ nhúng (không cần khoá API) cho một địa chỉ */
export const mapEmbedUrl = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`Ecopillo ${address}`)}&hl=vi&z=16&output=embed`

/** Bản đồ nhúng ghim đúng toạ độ (điểm bán): tra theo địa chỉ chữ có khi Google đặt lệch, toạ độ thì lấy từ ghim thật */
export const pinEmbedUrl = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}&hl=vi&z=16&output=embed`

/**
 * Chỉ đường theo địa chỉ chữ (Google tự tìm đúng số nhà), trên điện thoại mở thẳng ứng dụng Google Maps.
 * Không dùng toạ độ: toạ độ chỉ để đặt ghim và tính khoảng cách, nhập lệch vài trăm mét là đưa khách tới sai chỗ.
 */
export const directionsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`

// Toạ độ lấy từ ghim Google Maps của đúng địa chỉ (14/10/2026). Đổi địa chỉ thì lấy lại toạ độ: tìm địa chỉ trên
// Google Maps, đọc cặp số sau !3d và !4d trong link (hoặc bấm chuột phải vào ghim → dòng toạ độ đầu tiên).
const BASE_SHOWROOMS: readonly Showroom[] = [
  {
    id: 'ha-noi',
    kind: 'Văn phòng đại diện',
    dealerName: 'Ecopillo Hà Nội',
    city: 'Hà Nội',
    province: 'Hà Nội',
    address: '273 Xã Đàn, Đống Đa, Hà Nội',
    lat: 21.0173721,
    lng: 105.8303755,
    mapsUrl: directionsUrl('273 Xã Đàn, Đống Đa, Hà Nội'),
    imageNote: 'Ảnh mặt tiền và bên trong văn phòng 273 Xã Đàn (chờ Ecopillo gửi)',
    // Khách chọn ảnh chính 16/10/2026 (yêu cầu sửa mục 14)
    photo: {
      src: '/images/stores/ha-noi-1.webp',
      srcSet: '/images/stores/ha-noi-1-sm.webp 640w, /images/stores/ha-noi-1.webp 1200w',
      alt: 'Đội ngũ Ecopillo tại văn phòng 273 Xã Đàn, Hà Nội',
    },
  },
  {
    id: 'tp-hcm',
    kind: 'Chi nhánh',
    // Chị Phương (Zalo 12/11/2026): cả TP. HCM có một chi nhánh nên ghi tên thành phố, không ghi quận
    dealerName: 'Ecopillo Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    // Địa chỉ đủ theo catalog Ecopillo 22.07.2026
    address: '257A6 Nguyễn Văn Lượng, KDC Cityland Park Hills, Phường Gò Vấp, TP. HCM',
    lat: 10.838376,
    lng: 106.6677514,
    // Khách gửi số mới qua Zalo 12/11/2026
    hotline: '0973 255 508',
    mapsUrl: directionsUrl('257A6 Nguyễn Văn Lượng, KDC Cityland Park Hills, Phường Gò Vấp, TP. HCM'),
    imageNote: 'Ảnh mặt tiền chi nhánh TP. Hồ Chí Minh',
    // Chị Phương chọn 12/11/2026: ảnh ngày khai trương (ảnh ngang, nén bằng tools/nen-anh-cua-hang-hcm-2026-11-12.py)
    photo: {
      src: '/images/stores/tp-hcm-1.webp',
      srcSet: '/images/stores/tp-hcm-1-sm.webp 640w, /images/stores/tp-hcm-1.webp 1200w',
      alt: 'Ngày khai trương chi nhánh Ecopillo Hồ Chí Minh, 257A6 Nguyễn Văn Lượng, Gò Vấp',
    },
    photoPosition: 'center 40%',
  },
  {
    // Đại lý Đà Nẵng (chị Phương 09/11/2026: "sửa thành đại lý", owner duyệt). Vẫn đứng đầu danh sách cùng Hà Nội, TP. HCM
    // vì có ảnh và hotline riêng (sortDefault trong data/dealers.ts). Không tính vào "2 văn phòng" ở BRAND_STATS.
    id: 'da-nang',
    kind: 'Đại lý',
    dealerName: 'Ecopillo Đà Nẵng',
    city: 'Đà Nẵng',
    province: 'Đà Nẵng',
    address: '254 Lê Văn Hiến, Ngũ Hành Sơn, Đà Nẵng',
    lat: 16.0295615,
    lng: 108.2471201,
    hotline: '0934 767 110',
    mapsUrl: directionsUrl('254 Lê Văn Hiến, Ngũ Hành Sơn, Đà Nẵng'),
    imageNote: 'Ảnh mặt tiền đại lý Đà Nẵng (chờ Ecopillo gửi)',
    // Ảnh khách gửi qua Zalo 16/10/2026, chỉ có bản nhỏ 360×640 [ECOPILLO GỬI ẢNH GỐC ĐẠI LÝ ĐÀ NẴNG]
    photo: {
      src: '/images/stores/da-nang-1-sm.webp',
      srcSet: '/images/stores/da-nang-1-sm.webp 360w',
      alt: 'Mặt tiền đại lý Ecopillo, 254 Lê Văn Hiến, Ngũ Hành Sơn, Đà Nẵng',
    },
    photoPosition: 'center 30%',
  },
]

const SHOWROOM_KINDS = ['Văn phòng đại diện', 'Chi nhánh', 'Đại lý'] as const

export const SHOWROOM_SET: EditableSet = {
  khoa: 'van-phong',
  nhom: 'Thông tin chung',
  ten: 'Văn phòng, chi nhánh',
  moTa: 'Các điểm có ảnh lớn ở trang chủ và đầu danh sách điểm bán (Văn phòng Hà Nội, Chi nhánh Hồ Chí Minh, Đại lý Đà Nẵng). Đại lý khác: mục "Đại lý".',
  kieu: 'nhieu',
  goc: BASE_SHOWROOMS,
  tieuDeDong: 'dealerName',
  khoaDong: 'id',
  truong: [
    { khoa: 'dealerName', nhan: 'Tên', kieu: 'chu', batBuoc: true },
    { khoa: 'kind', nhan: 'Loại', kieu: 'chon', batBuoc: true, luaChon: SHOWROOM_KINDS },
    { khoa: 'address', nhan: 'Địa chỉ', kieu: 'chu', batBuoc: true, goiY: 'Nút "Chỉ đường" đi theo địa chỉ này' },
    { khoa: 'city', nhan: 'Thành phố (hiện trên thẻ)', kieu: 'chu', batBuoc: true },
    { khoa: 'province', nhan: 'Tỉnh/thành (để tìm điểm gần)', kieu: 'chu', batBuoc: true, goiY: 'Đúng tên tỉnh trong danh sách 34 tỉnh, ví dụ Hà Nội, TP. Hồ Chí Minh' },
    { khoa: 'lat', nhan: 'Vĩ độ', kieu: 'so', batBuoc: true, goiY: 'Lấy từ ghim Google Maps (số sau !3d trong link)' },
    { khoa: 'lng', nhan: 'Kinh độ', kieu: 'so', batBuoc: true, goiY: 'Số sau !4d trong link Google Maps' },
    { khoa: 'hotline', nhan: 'Hotline riêng', kieu: 'chu', goiY: 'Để trống: dùng hotline chung' },
    { khoa: 'photo', nhan: 'Ảnh', kieu: 'anh' },
    { khoa: 'photoPosition', nhan: 'Phần ảnh được giữ khi cắt', kieu: 'chu', goiY: 'Ví dụ center 30% (ảnh dọc trên thẻ ngang)' },
  ] satisfies EditableField[],
}

/** Văn phòng, chi nhánh Ecopillo tự sửa; link chỉ đường luôn theo địa chỉ chữ */
export const SHOWROOMS: readonly Showroom[] = liveList(SHOWROOM_SET.khoa, BASE_SHOWROOMS, SHOWROOM_SET.truong, (i, row): Showroom => {
  const base = BASE_SHOWROOMS.find((s) => s.id === row.id) ?? BASE_SHOWROOMS[i]
  const name = typeof row.dealerName === 'string' ? row.dealerName : ''
  return base && base.id === row.id
    ? { ...base }
    : { id: slugify(name) || `diem-${i + 1}`, kind: 'Đại lý', dealerName: name, city: '', province: '', address: '', lat: 0, lng: 0, mapsUrl: '', imageNote: '' }
}).map((s) => ({ ...s, mapsUrl: directionsUrl(s.address) }))

