/**
 * Điểm bán Ecopillo cho tính năng "Tìm đại lý gần tôi" (thiết kế chốt 13/10/2026,
 * /mnt/project-files/de-xuat/he-thong-phan-phoi/thiet-ke-tim-dai-ly.html).
 *
 * Trường dữ liệu đặt đúng như endpoint WordPress sẽ trả (/wp-json/ecopillo/v1/dai-ly), để khi nối
 * chỉ cần đổi nguồn. Danh sách dưới đây là bản dựng sẵn, dùng làm dự phòng khi WordPress không trả lời.
 */

import { CONTACT, SHOWROOMS } from './brand'
import { slugify } from '../lib/slug'

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
  /** "08:30" */
  gio_mo: string
  /** "21:00" */
  gio_dong: string
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
export const NEAR_ME_URL = '/he-thong-phan-phoi?gan-toi=1'

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
  gio_dong: '21:00',
  ngay_nghi: [],
  anh: [],
  ghi_chu: 'Có trưng bày đệm, gối để nằm thử',
}))

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

/** Danh sách dựng sẵn (dự phòng khi WordPress không trả lời): hiện chỉ có 2 điểm thật, đại lý thêm sau */
export const DEALERS: readonly Dealer[] = sortDefault(OFFICIAL)

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

export const openStatus = (d: Dealer, now = new Date()): OpenStatus => {
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
  const base = `${shortTime(d.gio_mo)}–${shortTime(d.gio_dong)}`
  if (d.ngay_nghi.length === 0) return `${base} hằng ngày`
  return `${base}, nghỉ ${d.ngay_nghi.map((n) => WEEKDAYS[n]).join(', ')}`
}
