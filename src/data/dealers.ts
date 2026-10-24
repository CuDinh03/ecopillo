/**
 * Điểm bán Ecopillo cho tính năng "Tìm đại lý gần tôi" (thiết kế chốt 13/10/2026; bản thiết kế gốc không còn trong project,
 * bố cục hiện tại ghi ở mục "Hệ thống phân phối" của docs/ban-do-du-an.md).
 *
 * Trường dữ liệu đặt đúng như endpoint WordPress sẽ trả (/wp-json/ecopillo/v1/dai-ly), để khi nối
 * chỉ cần đổi nguồn. Danh sách dưới đây là bản dựng sẵn, dùng làm dự phòng khi WordPress không trả lời.
 */

import { CONTACT, SHOWROOMS } from './brand'
import { slugify } from '../lib/slug'
import { PATHS } from './links'

export type DealerKind = 'van-phong' | 'chi-nhanh' | 'dai-ly'

export interface Dealer {
  id: string
  ten: string
  loai: DealerKind
  dia_chi: string
  /** Tên tỉnh/thành, đúng như trong PROVINCES */
  tinh: string
  lat: number
  lng: number
  /** Số riêng của điểm, dạng hiển thị "0988 832 072" */
  dien_thoai: string
  /** Bỏ trống thì dùng số điện thoại */
  zalo?: string
  /** "08:30". Bỏ trống khi đại lý chưa báo giờ: thẻ mời gọi trước, không tự đặt giờ */
  gio_mo?: string
  /** "21:00" */
  gio_dong?: string
  /** Ngày nghỉ trong tuần: 0 = Chủ nhật … 6 = Thứ bảy */
  ngay_nghi: readonly number[]
  /** 0 đến 3 ảnh, ảnh đầu là ảnh đại diện */
  anh: readonly string[]
  ghi_chu?: string
}

export const KIND_LABEL: Readonly<Record<DealerKind, string>> = {
  'van-phong': 'Văn phòng đại diện',
  'chi-nhanh': 'Chi nhánh',
  'dai-ly': 'Đại lý',
}

/** Điểm gần nhất xa hơn mức này thì coi như khu vực chưa có đại lý */
export const FAR_KM = 50

/** Nút "Tìm đại lý gần tôi" ở trang khác: mở trang và hỏi vị trí ngay */
export const NEAR_ME_URL = `${PATHS.distribution}?gan-toi=1`

/** Hiện bấy nhiêu điểm đầu, còn lại sau nút "Xem thêm" */
export const PAGE_SIZE = 10

/** Ảnh dùng khi điểm chưa có ảnh: đội ngũ Ecopillo tại cửa hàng */
export const DEFAULT_DEALER_PHOTO = '/images/video/bia-phim-sm.webp'

export interface ProvinceInfo {
  id: string
  name: string
  /** Toạ độ trung tâm hành chính (ước lượng), để tìm điểm gần nhất khi tỉnh chưa có đại lý */
  lat: number
  lng: number
}

// 34 tỉnh, thành từ 01/07/2025, xếp từ Bắc vào Nam (dùng cho thứ tự mặc định của danh sách)
const PROVINCE_ROWS: readonly [string, number, number][] = [
  ['Lai Châu', 22.396, 103.458],
  ['Điện Biên', 21.386, 103.023],
  ['Lào Cai', 21.722, 104.911],
  ['Tuyên Quang', 21.823, 105.214],
  ['Cao Bằng', 22.666, 106.258],
  ['Lạng Sơn', 21.853, 106.761],
  ['Thái Nguyên', 21.594, 105.848],
  ['Sơn La', 21.327, 103.914],
  ['Phú Thọ', 21.322, 105.401],
  ['Quảng Ninh', 20.951, 107.08],
  ['Bắc Ninh', 21.273, 106.194],
  ['Hà Nội', 21.028, 105.854],
  ['Hải Phòng', 20.845, 106.688],
  ['Hưng Yên', 20.446, 106.342],
  ['Ninh Bình', 20.251, 105.975],
  ['Thanh Hóa', 19.807, 105.776],
  ['Nghệ An', 18.679, 105.681],
  ['Hà Tĩnh', 18.343, 105.906],
  ['Quảng Trị', 17.468, 106.622],
  ['Huế', 16.463, 107.59],
  ['Đà Nẵng', 16.054, 108.202],
  ['Quảng Ngãi', 15.12, 108.792],
  ['Gia Lai', 13.782, 109.219],
  ['Đắk Lắk', 12.667, 108.038],
  ['Khánh Hòa', 12.238, 109.197],
  ['Lâm Đồng', 11.94, 108.458],
  ['Đồng Nai', 10.957, 106.843],
  ['TP. Hồ Chí Minh', 10.776, 106.7],
  ['Tây Ninh', 10.535, 106.413],
  ['Đồng Tháp', 10.36, 106.36],
  ['Vĩnh Long', 10.254, 105.972],
  ['Cần Thơ', 10.045, 105.747],
  ['An Giang', 10.012, 105.081],
  ['Cà Mau', 9.177, 105.15],
]

export const PROVINCES: readonly ProvinceInfo[] = PROVINCE_ROWS.map(([name, lat, lng]) => ({
  id: slugify(name),
  name,
  lat,
  lng,
}))

const provinceOrder = new Map(PROVINCES.map((p, i) => [p.name, i]))
export const provinceById = (id: string) => PROVINCES.find((p) => p.id === id)

/** Văn phòng Hà Nội và Chi nhánh TP. HCM: điểm chính hãng */
const OFFICIAL: readonly Dealer[] = SHOWROOMS.map((s) => ({
  id: s.id,
  ten: s.kind === 'Văn phòng đại diện' ? 'Ecopillo Hà Nội' : 'Ecopillo Gò Vấp',
  loai: s.kind === 'Văn phòng đại diện' ? 'van-phong' : 'chi-nhanh',
  dia_chi: s.address,
  tinh: s.province,
  lat: s.lat,
  lng: s.lng,
  dien_thoai: s.hotline ?? CONTACT.hotlineDisplay,
  gio_mo: '08:30',
  gio_dong: '22:00',
  ngay_nghi: [],
  anh: s.photo ? [s.photo.src.replace('.webp', '-sm.webp')] : [],
  ghi_chu: 'Có trưng bày đệm, gối để nằm thử',
}))

/**
 * Ảnh cửa hàng Ecopillo gửi qua Zalo 16/10/2026 (yêu cầu sửa mục 16–23), ảnh đầu là ảnh đại diện.
 * Nén bằng tools/nen-anh-khach-gui-2026-10-16.py. Điểm chưa có ảnh dùng DEFAULT_DEALER_PHOTO.
 * [XÁC NHẬN]: Đà Nẵng (2 ảnh trong nằm ở mép ảnh chụp tin nhắn), Quyết Hương (khách ghi "Hải dương"),
 * Thu Vũ (khách ghi "Hải phòng") là ghép theo tin nhắn, chờ Ecopillo xác nhận.
 * Hiên Long (khách ghi "Bắc ninh"): chưa có file gốc, ảnh cắt từ ảnh chụp tin nhắn (24/10/2026); có file gốc thì nén lại.
 */
const storePhotos = (id: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `/images/stores/${id}-${i + 1}-sm.webp`)

const AGENT_PHOTOS: Readonly<Record<string, readonly string[]>> = {
  'phu-ly': storePhotos('phu-ly', 2),
  'quoc-oai': storePhotos('quoc-oai', 2),
  'nguyen-hue': storePhotos('nguyen-hue', 2),
  'da-nang': storePhotos('da-nang', 3),
  'quy-nhon': storePhotos('quy-nhon', 1),
  'quyet-huong': storePhotos('quyet-huong', 1),
  'thu-vu': storePhotos('thu-vu', 1),
  'hien-long': storePhotos('hien-long', 1),
}

/** Thứ tự mặc định: Văn phòng Hà Nội, Chi nhánh TP. HCM, rồi các đại lý theo tỉnh từ Bắc vào Nam */
export const sortDefault = (list: readonly Dealer[]): Dealer[] => {
  const rank = (d: Dealer) => (d.loai === 'van-phong' ? 0 : d.loai === 'chi-nhanh' ? 1 : 2)
  return [...list].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (provinceOrder.get(a.tinh) ?? 99) - (provinceOrder.get(b.tinh) ?? 99) ||
      a.ten.localeCompare(b.ten, 'vi'),
  )
}

/**
 * Đại lý theo danh sách Ecopillo gửi 15/10/2026 (file "danh sach dai ly.xlsx"). Toạ độ lấy từ ghim của link Google Maps
 * trong file; điểm không có link thì tra theo địa chỉ chữ. Chưa có giờ mở cửa, Zalo, ảnh: thẻ dùng ảnh mặc định,
 * Zalo theo số điện thoại, giờ mở cửa để trống (không tự đặt giờ).
 * Chưa đưa lên: "Ecopillo Hải Phòng" (địa chỉ "đang cập nhật", số trùng với Quyết Hương). Có địa chỉ thì thêm một dòng.
 */
const AGENTS: readonly Dealer[] = (
  [
    // [id, tên, địa chỉ, tỉnh, lat, lng, điện thoại]
    ['da-nang', 'Ecopillo Đà Nẵng', '254 Lê Văn Hiến, Ngũ Hành Sơn, Đà Nẵng', 'Đà Nẵng', 16.0295615, 108.2471201, '0934 767 110'],
    ['hien-long', 'Ecopillo Hiên Long', 'E7-E8 Chợ Dầu, Lê Quang Đạo, Từ Sơn, Bắc Ninh', 'Bắc Ninh', 21.11749, 105.96335, '0356 658 198'],
    ['minh-khai', 'Ecopillo Minh Khai', '81 Minh Khai, Bạch Mai, Hà Nội', 'Hà Nội', 20.9954183, 105.8528493, '0916 292 286'],
    // File ghi số 57, ghim Google Maps đặt ở số 54 Đồng Bụt: [XÁC NHẬN SỐ NHÀ ĐẠI LÝ QUỐC OAI]
    ['quoc-oai', 'Ecopillo Quốc Oai', '57 Đồng Bụt, Kiều Phú, Hà Nội', 'Hà Nội', 20.9947168, 105.608156, '0968 846 637'],
    // File chưa có số riêng: tạm dùng hotline chung [ECOPILLO GỬI SỐ ĐIỆN THOẠI ĐẠI LÝ PHỦ LÝ]
    ['phu-ly', 'Ecopillo Phủ Lý', '68 Lê Duẩn, Phủ Lý, Ninh Bình', 'Ninh Bình', 20.5315568, 105.9218988, CONTACT.hotlineDisplay],
    ['quy-nhon', 'Ecopillo Quy Nhơn', '383A Nguyễn Thái Học, Quy Nhơn Nam, Gia Lai', 'Gia Lai', 13.7633226, 109.2137616, '0962 331 353'],
    ['thu-vu', 'Ecopillo Thu Vũ', '21 Trại Lẻ, Lê Chân, Hải Phòng', 'Hải Phòng', 20.8341097, 106.684671, '0945 903 389'],
    ['thanh-hue', 'Ecopillo Thanh Huệ', 'Thôn Hạc Sơn, Cẩm Bình, Cẩm Thuỷ, Thanh Hóa', 'Thanh Hóa', 20.2128842, 105.4386151, '0352 134 028'],
    ['duy-linh', 'Ecopillo Duy Linh', '394 Lê Hoàn, Phường Hạc Thành, Thanh Hóa', 'Thanh Hóa', 19.7987749, 105.7775673, '0911 462 243'],
    ['vo-chi-cong', 'Ecopillo Võ Chí Công', '136 Võ Chí Công, Tây Hồ, Hà Nội', 'Hà Nội', 21.0532633, 105.804741, '0919 351 089'],
    ['quyet-huong', 'Ecopillo Quyết Hương', '75 Lê Duẩn, Khu đô thị Ecopark, Tân Hưng, Hải Phòng', 'Hải Phòng', 20.9178034, 106.3391007, '0962 612 768'],
    // File chỉ ghi khu đô thị, chưa có toà và số căn; toạ độ là giữa khu: [ECOPILLO GỬI ĐỊA CHỈ ĐỦ ĐẠI LÝ VINSMART CITY]
    ['vinsmart-city', 'Ecopillo Vinsmart City', 'Vinhomes Smart City, Tây Mỗ, Hà Nội', 'Hà Nội', 21.0051592, 105.7385205, '0973 463 586'],
    ['nguyen-hue', 'Ecopillo Nguyễn Huệ', 'Nam Hồng 2, Phường Bắc Giang, Bắc Ninh', 'Bắc Ninh', 21.2948239, 106.1981358, '0357 165 947'],
    ['quang-ninh', 'Ecopillo Quảng Ninh', 'Số 3 đường 25/4, Phường Hồng Gai, Quảng Ninh', 'Quảng Ninh', 20.9522182, 107.0775786, '0973 678 882'],
  ] as const
).map(([id, ten, dia_chi, tinh, lat, lng, dien_thoai]) => ({
  id,
  ten,
  loai: 'dai-ly',
  dia_chi,
  tinh,
  lat,
  lng,
  dien_thoai,
  ngay_nghi: [],
  anh: AGENT_PHOTOS[id] ?? [],
}))

/** Danh sách dựng sẵn (dự phòng khi WordPress không trả lời) */
export const DEALERS: readonly Dealer[] = sortDefault([...OFFICIAL, ...AGENTS])

/**
 * Quyền lợi đại lý: Ecopillo gửi qua Zalo 16/10/2026 (thay cả danh sách cũ).
 * Chỉ sửa chính tả và bỏ chữ "Được" đầu dòng, giữ đúng ý.
 */
export const AGENT_BENEFITS: readonly string[] = [
  'Giá chiết khấu cơ bản và chính sách theo từng gói',
  'Hàng mẫu, catalogue, ảnh và video sản phẩm',
  'Đào tạo sản phẩm, đào tạo bán hàng, có sẵn kịch bản bán hàng',
  'Hỗ trợ bán hàng online',
  'Hỗ trợ biển bảng và một phần giá kệ theo từng gói hàng',
  'Độc quyền theo từng khu vực',
  'Hỗ trợ đổi hàng nếu khó bán',
  'Không cần ôm tồn, không lo đọng vốn',
  'Chi phí vốn rất thấp',
]

/**
 * Mô hình phân phối theo catalog Ecopillo 22.07.2026 (trang 3), khối ở trang Tuyển đại lý (owner chọn kiểu B 24/10/2026).
 * Owner cho phép công bố "50 nhà phân phối". Không đặt con số này ở trang Hệ thống phân phối: trang đó liệt kê
 * các điểm đã có địa chỉ (DEALERS), khách lẻ thấy 50 mà chỉ tìm được 14 điểm sẽ thắc mắc.
 * Ghim trên bản đồ catalog là tượng trưng, không trùng các điểm thật: chú thích bản đồ ghi rõ.
 */
export const DISTRIBUTOR_COUNT = 50

export const SALES_CHANNELS: readonly { title: string; text: string }[] = [
  {
    title: 'Mua trực tiếp',
    text: 'Showroom bán lẻ, Facebook và các sàn thương mại điện tử: tư vấn tận nơi, chính sách thống nhất trên cả hệ thống.',
  },
  { title: 'Dự án và lưu trú', text: 'Giải pháp chăn ga gối đệm đồng bộ, bền bỉ cho khách sạn, nhà nghỉ, homestay và resort.' },
  {
    title: 'Đại lý, nhà phân phối',
    text: `Hệ thống ${DISTRIBUTOR_COUNT} nhà phân phối và các đại lý, cửa hàng trên toàn quốc, đồng bộ sản phẩm, hình ảnh và chính sách bán hàng.`,
  },
]

export const DISTRIBUTION_MAP = {
  src: '/images/distribution/ban-do-phan-phoi.webp',
  alt: 'Bản đồ Việt Nam đánh dấu văn phòng Hà Nội, chi nhánh TP. Hồ Chí Minh và các vùng có nhà phân phối Ecopillo',
  width: 563,
  height: 900,
} as const

/** "Hơn N điểm trên toàn quốc": làm tròn xuống hàng chục khi từ 20 điểm */
export const dealerCountLabel = (count: number) =>
  count >= 20 ? `Hơn ${Math.floor(count / 10) * 10} điểm trên toàn quốc` : `${count} điểm trên toàn quốc`

/* ---------- Khoảng cách ---------- */

export interface LatLng {
  lat: number
  lng: number
}

/** Đường chim bay (Haversine), km */
export const distanceKm = (a: LatLng, b: LatLng): number => {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

/** Dưới 10 km: 1 chữ số thập phân; từ 10 km: số nguyên. "5,1 km", "128 km" */
export const formatKm = (km: number): string =>
  km < 10 ? `${km.toLocaleString('vi-VN', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km` : `${Math.round(km).toLocaleString('vi-VN')} km`

export const sortByDistance = <T extends LatLng>(list: readonly T[], from: LatLng) =>
  [...list].map((d) => ({ dealer: d, km: distanceKm(from, d) })).sort((a, b) => a.km - b.km)

/* ---------- Tìm chữ không dấu ---------- */

export const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/** Gõ "go vap" vẫn ra "Gò Vấp"; mọi từ gõ vào đều phải có trong tên, địa chỉ hoặc tỉnh */
export const matchesQuery = (d: Dealer, query: string) => {
  const words = fold(query).split(' ').filter(Boolean)
  if (words.length === 0) return true
  const hay = ` ${fold(`${d.ten} ${d.dia_chi} ${d.tinh}`)} `
  return words.every((w) => hay.includes(` ${w}`))
}

/* ---------- Liên hệ ---------- */

const digits = (phone: string) => phone.replace(/\D/g, '')
export const telHref = (d: Dealer) => `tel:${digits(d.dien_thoai)}`
export const zaloHref = (d: Dealer) => `https://zalo.me/${digits(d.zalo || d.dien_thoai)}`

/* ---------- Giờ mở cửa (tính theo giờ Việt Nam, không theo giờ máy khách) ---------- */

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
const WEEKDAY_INDEX: Readonly<Record<string, number>> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const vnNow = (now: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return { day: WEEKDAY_INDEX[get('weekday')] ?? 0, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** "08:30" → "8:30" */
export const shortTime = (hhmm: string) => hhmm.replace(/^0/, '')

export interface OpenStatus {
  open: boolean
  text: string
}

/** Chữ thay cho giờ mở cửa khi đại lý chưa báo giờ */
export const NO_HOURS_TEXT = 'Quý khách gọi trước khi ghé'

/** null khi đại lý chưa báo giờ mở cửa */
export const openStatus = (d: Dealer, now = new Date()): OpenStatus | null => {
  if (!d.gio_mo || !d.gio_dong) return null
  const { day, minutes } = vnNow(now)
  const opens = toMinutes(d.gio_mo)
  const closes = toMinutes(d.gio_dong)
  const closedToday = d.ngay_nghi.includes(day)
  if (!closedToday && minutes >= opens && minutes < closes) {
    return { open: true, text: `Đang mở cửa · đến ${shortTime(d.gio_dong)}` }
  }
  // Tìm lần mở cửa kế tiếp: còn trong hôm nay (chưa tới giờ mở) hoặc ngày làm việc kế tiếp
  if (!closedToday && minutes < opens) return { open: false, text: `Đã đóng cửa, mở lại ${shortTime(d.gio_mo)}` }
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7
    if (d.ngay_nghi.includes(next)) continue
    const when = i === 1 ? 'sáng mai' : WEEKDAYS[next]
    return { open: false, text: `Đã đóng cửa, mở lại ${shortTime(d.gio_mo)} ${when}` }
  }
  return { open: false, text: 'Tạm nghỉ' }
}

export const hoursText = (d: Dealer) => {
  if (!d.gio_mo || !d.gio_dong) return NO_HOURS_TEXT
  const base = `${shortTime(d.gio_mo)}–${shortTime(d.gio_dong)}`
  if (d.ngay_nghi.length === 0) return `${base} hằng ngày`
  return `${base}, nghỉ ${d.ngay_nghi.map((n) => WEEKDAYS[n]).join(', ')}`
}
