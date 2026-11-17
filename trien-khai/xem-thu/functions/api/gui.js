/**
 * Nhận đơn hàng và tin nhắn từ web, chuyển tới Google Apps Script của Ecopillo
 * (ghi Google Trang tính + gửi email từ Gmail Ecopillo). Owner duyệt Q3 ngày 25/10/2026:
 * docs/ke-hoach-ssg-va-wordpress.md. Cách dựng Apps Script: trien-khai/google-apps-script/nhan-form.gs.
 *
 * POST /api/gui, thân JSON:
 *   { loai: 'don-hang', khach: {...}, hang: {...}, tien: {...}, trang, thoiGianDien }
 *   { loai: 'tin-nhan', chuDe, ten, sdt, noiDung, trang, thoiGianDien, bay }
 * Trả: { ok: true, ma, daGui } hoặc { ok: false, loi } (mã HTTP 4xx/5xx).
 *
 * Biến môi trường của dự án Cloudflare Pages (đặt bằng `wrangler pages secret put`):
 *   GOOGLE_SCRIPT_URL   link /exec của Apps Script. Chưa đặt: không gửi đi đâu, trả daGui: false
 *                       (web hiện lời "chưa được gửi đi", như bản xem thử trước nay)
 *   GOOGLE_SCRIPT_KHOA  khoá bí mật, phải trùng thuộc tính KHOA trong Apps Script
 *   LA_XEM_THU          '1' trên bản xem thử: email và dòng trong trang tính ghi "[XEM THỬ]"
 *
 * Giá trong đơn là giá khách thấy trên web lúc đặt; nhân viên vẫn gọi xác nhận trước khi giao (biên bản mục 50).
 */

const MAX_BODY = 16 * 1024
/** Điền nhanh hơn mức này là máy tự điền (người thật cần vài giây để gõ tên và số điện thoại) */
const MIN_FILL_MS = 2500
const PHONE = /^(0|\+84)(3|5|7|8|9)\d{8}$/
const TOPICS = new Set(['Tư vấn chọn mẫu', 'Hỏi về đơn hàng', 'Bảo hành, đổi hàng', 'Khách sạn, nhà nghỉ', 'Đăng ký mở đại lý', 'Khác'])

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

/** Chuỗi gọn: bỏ ký tự điều khiển, cắt độ dài */
const text = (value, max) =>
  typeof value === 'string'
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max)
    : ''

const money = (value) => (Number.isFinite(value) && value >= 0 && value < 1e10 ? Math.round(value) : null)

const normalizePhone = (phone) => phone.replace(/[\s.-]/g, '')

/** Mã dự phòng khi chưa nối Apps Script (Apps Script tự đánh số tăng dần nên không trùng) */
function fallbackCode(now = new Date()) {
  const vn = new Date(now.getTime() + 7 * 3600 * 1000)
  const ddmm = String(vn.getUTCDate()).padStart(2, '0') + String(vn.getUTCMonth() + 1).padStart(2, '0')
  const n = crypto.getRandomValues(new Uint16Array(1))[0] % 9000
  return `EP-${ddmm}-${1000 + n}`
}

function cleanOrder(input) {
  const k = input.khach ?? {}
  const h = input.hang ?? {}
  const t = input.tien ?? {}
  const order = {
    loai: 'don-hang',
    khach: {
      ten: text(k.ten, 80),
      sdt: normalizePhone(text(k.sdt, 20)),
      tinh: text(k.tinh, 60),
      diaChi: text(k.diaChi, 200),
      ghiChu: text(k.ghiChu, 500),
    },
    hang: {
      nhom: text(h.nhom, 60),
      ten: text(h.ten, 120),
      chiTiet: text(h.chiTiet, 160),
      kichThuoc: text(h.kichThuoc, 80),
      soLuong: Number.isInteger(h.soLuong) && h.soLuong > 0 && h.soLuong <= 99 ? h.soLuong : 0,
      donVi: text(h.donVi, 20),
      donGia: money(h.donGia),
      qua: text(h.qua, 160),
    },
    tien: {
      tamTinh: money(t.tamTinh),
      phiGiao: money(t.phiGiao),
      tong: money(t.tong),
      baoGiaKhiGoi: t.baoGiaKhiGoi === true,
    },
  }
  const errors = []
  if (order.khach.ten.length < 2) errors.push('ten')
  if (!PHONE.test(order.khach.sdt)) errors.push('sdt')
  if (!order.khach.tinh) errors.push('tinh')
  if (order.khach.diaChi.length < 6) errors.push('diaChi')
  if (!order.hang.ten || !order.hang.soLuong) errors.push('hang')
  return { value: order, errors }
}

function cleanMessage(input) {
  const message = {
    loai: 'tin-nhan',
    chuDe: TOPICS.has(input.chuDe) ? input.chuDe : 'Khác',
    ten: text(input.ten, 80),
    sdt: normalizePhone(text(input.sdt, 20)),
    noiDung: text(input.noiDung, 2000),
  }
  const errors = []
  if (message.ten.length < 2) errors.push('ten')
  if (!PHONE.test(message.sdt)) errors.push('sdt')
  if (message.noiDung.length < 5) errors.push('noiDung')
  return { value: message, errors }
}

/** Chỉ nhận từ chính trang web này (chặn trang khác gửi hộ) */
function sameOrigin(request) {
  const origin = request.headers.get('Origin')
  return !origin || origin === new URL(request.url).origin
}

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, loi: 'nguon' }, 403)
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return json({ ok: false, loi: 'kieu' }, 415)

  const raw = await request.text()
  if (raw.length > MAX_BODY) return json({ ok: false, loi: 'qua-dai' }, 413)
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    return json({ ok: false, loi: 'json' }, 400)
  }
  if (!input || typeof input !== 'object') return json({ ok: false, loi: 'json' }, 400)

  const cleaned =
    input.loai === 'don-hang' ? cleanOrder(input) : input.loai === 'tin-nhan' ? cleanMessage(input) : null
  if (!cleaned) return json({ ok: false, loi: 'loai' }, 400)
  if (cleaned.errors.length) return json({ ok: false, loi: 'thieu', truong: cleaned.errors }, 422)

  // Máy tự điền (ô bẫy có chữ, hoặc điền quá nhanh): trả như đã nhận để máy không thử lại, nhưng không gửi đi
  const filledMs = Number(input.thoiGianDien)
  if (text(input.bay, 200) || !Number.isFinite(filledMs) || filledMs < MIN_FILL_MS) {
    return json({ ok: true, ma: cleaned.value.loai === 'don-hang' ? fallbackCode() : '', daGui: false })
  }

  const ma = cleaned.value.loai === 'don-hang' ? fallbackCode() : ''
  if (!env.GOOGLE_SCRIPT_URL || !env.GOOGLE_SCRIPT_KHOA) return json({ ok: true, ma, daGui: false })

  const payload = {
    ...cleaned.value,
    khoa: env.GOOGLE_SCRIPT_KHOA,
    trang: text(input.trang, 300),
    xemThu: env.LA_XEM_THU === '1',
    trinhDuyet: text(request.headers.get('User-Agent') ?? '', 200),
  }

  try {
    // Apps Script trả 302 sang googleusercontent.com; fetch tự đi theo và đọc kết quả JSON
    const response = await fetch(env.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || !result?.ok) {
      console.error('Apps Script từ chối', response.status, result?.loi)
      return json({ ok: false, loi: 'google' }, 502)
    }
    return json({ ok: true, ma: text(result.ma, 30) || ma, daGui: true })
  } catch (error) {
    console.error('Không gọi được Apps Script', String(error))
    return json({ ok: false, loi: 'google' }, 502)
  }
}

export function onRequest() {
  return json({ ok: false, loi: 'phuong-thuc' }, 405)
}
