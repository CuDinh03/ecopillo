export const BRAND = {
  name: 'Ecopillo',
  company: 'Công ty TNHH Ecopillo Eternal Việt Nam',
  slogan: 'Nâng niu giấc mơ xanh',
  philosophy: ['Tốt', 'Thật', 'Thiện'] as const,
  years: '15+',
  customers: '15.000+',
} as const

/**
 * Biên bản chốt mục 39: Ecopillo sẽ thay số hotline mới và gửi riêng địa chỉ, hotline của
 * từng chi nhánh. Khi có số mới chỉ cần sửa 3 dòng hotline/Zalo dưới đây.
 */
export const CONTACT = {
  hotlineDisplay: '0988 832 072',
  hotlineTel: 'tel:0988832072',
  zaloUrl: 'https://zalo.me/0988832072',
  /** Số điện thoại thứ hai, giữ như trang Liên hệ web cũ */
  phoneDisplay: '0978 678 378',
  phoneTel: 'tel:0978678378',
  messengerUrl: 'https://m.me/Ecopillo.com.vn',
  email: 'cskh@ecopillo.com.vn',
  fanpageDisplay: 'facebook.com/Ecopillo.com.vn',
  fanpageUrl: 'https://www.facebook.com/Ecopillo.com.vn',
  tiktokUrl: 'https://www.tiktok.com/@ecopillo.official',
  instagramUrl: 'https://www.instagram.com/ecopillo.com.vn/',
  youtubeUrl: 'https://www.youtube.com/@EcopilloVietNam',
  /** Trang thông báo website với Bộ Công Thương (online.gov.vn), theo web cũ */
  moitUrl: 'https://online.gov.vn/nen-tang/94e80465-51e2-4e05-a37c-b1fc532d4bc3',
} as const

export interface SocialLink {
  id: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'zalo'
  label: string
  handle: string
  url: string
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'facebook', label: 'Facebook', handle: 'Ecopillo.com.vn', url: 'https://www.facebook.com/Ecopillo.com.vn' },
  { id: 'tiktok', label: 'TikTok', handle: '@ecopillo.official', url: 'https://www.tiktok.com/@ecopillo.official' },
  { id: 'instagram', label: 'Instagram', handle: 'ecopillo.com.vn', url: 'https://www.instagram.com/ecopillo.com.vn/' },
  { id: 'youtube', label: 'YouTube', handle: '@EcopilloVietNam', url: 'https://www.youtube.com/@EcopilloVietNam' },
  { id: 'zalo', label: 'Zalo', handle: '0988 832 072', url: 'https://zalo.me/0988832072' },
]

/** Phim thương hiệu trên kênh YouTube Ecopillo */
export const BRAND_VIDEO = {
  id: 'MLo9LwZdmVQ',
  title: 'Chăn ga gối đệm Ecopillo – Nâng niu giấc mơ xanh',
} as const

export const OPENING_HOURS = '8:30–22:00 hằng ngày'

/** Biên bản chốt mục 28 và 39: đổi "Showroom" thành "Hệ thống phân phối" */
export interface Showroom {
  id: string
  /** Văn phòng đại diện / Chi nhánh */
  kind: 'Văn phòng đại diện' | 'Chi nhánh'
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
export const SHOWROOMS: readonly Showroom[] = [
  {
    id: 'ha-noi',
    kind: 'Văn phòng đại diện',
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
    city: 'TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    // Địa chỉ đủ theo catalog Ecopillo 22.07.2026
    address: '257A6 Nguyễn Văn Lượng, KDC Cityland Park Hills, Phường Gò Vấp, TP. HCM',
    lat: 10.838376,
    lng: 106.6677514,
    hotline: '0869 088 508',
    mapsUrl: directionsUrl('257A6 Nguyễn Văn Lượng, KDC Cityland Park Hills, Phường Gò Vấp, TP. HCM'),
    imageNote: 'Ảnh mặt tiền và không gian trưng bày chi nhánh Gò Vấp (chờ Ecopillo gửi)',
    // Khách chọn 16/10/2026 (mục 15): ảnh dọc, thẻ ngang chỉ hiện phần biển hiệu và cửa
    photo: {
      src: '/images/stores/tp-hcm-1.webp',
      srcSet: '/images/stores/tp-hcm-1-sm.webp 360w, /images/stores/tp-hcm-1.webp 674w',
      alt: 'Mặt tiền chi nhánh Ecopillo, 257A6 Nguyễn Văn Lượng, Gò Vấp',
    },
  },
]

