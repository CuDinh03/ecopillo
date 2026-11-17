import { IS_PREVIEW } from '../data/preview'
import { createOrderCode, normalizePhone, type CustomerInfo, type OrderSummaryData } from './order'

/**
 * Gửi đơn hàng và tin nhắn về Ecopillo qua /api/gui. Hai nơi nhận, cùng thân JSON và câu trả:
 * - Web thật ecopillo.com.vn (từ 18/11/2026): plugin WordPress trien-khai/wordpress-plugin/ecopillo-giao-dien-moi/nhan-form.php
 *   → lưu mục "Đơn web" trong wp-admin (phải đăng nhập mới xem) + email về hộp thư Ecopillo. Không gửi sang dịch vụ khác.
 * - Bản xem thử: hàm Cloudflare trien-khai/xem-thu/functions/api/gui.js → Google Apps Script → Trang tính + email.
 *
 * - Chạy `pnpm dev`: không có hàm Cloudflare, nên không gửi; trả daGui: false để màn hình cảm ơn ghi "chưa gửi đi".
 * - Bản xem thử: hàm chưa nối Apps Script thì cũng trả daGui: false (cùng lời ghi chú).
 * - Bản chạy thật: daGui: false nghĩa là đơn KHÔNG tới Ecopillo, nên coi là lỗi để khách gọi hoặc nhắn Zalo,
 *   không bao giờ hiện "đã nhận đơn" khi chưa gửi được.
 */

const ENDPOINT = '/api/gui'
const TIMEOUT_MS = 25000

export interface SendResult {
  /** Mã đơn Apps Script cấp (tăng dần); tin nhắn thì rỗng */
  code: string
  /** true khi đã ghi vào trang tính của Ecopillo */
  delivered: boolean
}

export class SendError extends Error {}

interface OrderInput {
  customer: CustomerInfo
  provinceName: string
  summary: OrderSummaryData
  /** Lúc bắt đầu điền (Date.now()), để hàm nhận biết máy tự điền */
  startedAt: number
}

interface MessageInput {
  topic: string
  name: string
  phone: string
  message: string
  /** Ô bẫy ẩn: người thật để trống */
  trap: string
  startedAt: number
}

const pageUrl = () => (typeof window === 'undefined' ? '' : window.location.href)

async function post(body: Record<string, unknown>): Promise<SendResult> {
  let response: Response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    throw new SendError('mang')
  }
  const result: unknown = await response.json().catch(() => null)
  if (!response.ok || !result || typeof result !== 'object' || (result as { ok?: unknown }).ok !== true) {
    throw new SendError('may-chu')
  }
  const { ma, daGui } = result as { ma?: unknown; daGui?: unknown }
  const sent: SendResult = { code: typeof ma === 'string' ? ma : '', delivered: daGui === true }
  if (!sent.delivered && !IS_PREVIEW) throw new SendError('chua-noi')
  return sent
}

/** Dev không có /api/gui: giả như bản xem thử chưa nối, để thử giao diện */
const devResult = (isOrder: boolean): Promise<SendResult> =>
  new Promise((resolve) => setTimeout(() => resolve({ code: isOrder ? createOrderCode() : '', delivered: false }), 400))

export function sendOrder({ customer, provinceName, summary, startedAt }: OrderInput): Promise<SendResult> {
  if (import.meta.env.DEV) return devResult(true)
  const line = summary.line
  return post({
    loai: 'don-hang',
    khach: {
      ten: customer.name,
      sdt: normalizePhone(customer.phone),
      tinh: provinceName,
      diaChi: customer.address,
      ghiChu: customer.note,
    },
    hang: {
      nhom: line?.kindLabel ?? '',
      ten: line?.name ?? '',
      chiTiet: line?.detail ?? '',
      kichThuoc: line?.sizeLabel ?? '',
      soLuong: line?.quantity ?? 0,
      donVi: line?.unit ?? '',
      donGia: line?.unitPrice ?? null,
      qua: summary.gift && summary.giftCount ? `${summary.giftCount} ${summary.gift.unit} ${summary.gift.item}` : '',
    },
    tien: {
      tamTinh: summary.subtotal || null,
      phiGiao: summary.subtotal ? summary.shippingFee : null,
      tong: summary.subtotal ? summary.total : null,
      baoGiaKhiGoi: summary.priceOnCall,
    },
    trang: pageUrl(),
    thoiGianDien: Date.now() - startedAt,
  })
}

export function sendMessage({ topic, name, phone, message, trap, startedAt }: MessageInput): Promise<SendResult> {
  if (import.meta.env.DEV) return devResult(false)
  return post({
    loai: 'tin-nhan',
    chuDe: topic,
    ten: name,
    sdt: normalizePhone(phone),
    noiDung: message,
    bay: trap,
    trang: pageUrl(),
    thoiGianDien: Date.now() - startedAt,
  })
}
