import { useState } from 'react'
import type { CustomerInfo, OrderSummaryData } from '../lib/order'
import { scrollToElement } from '../lib/scroll'
import { sendOrder, type SendResult } from '../lib/sendForm'
import { provinceById } from '../lib/shipping'
import { trackOrder } from '../lib/tracking'

/** id khung báo lỗi gửi đơn, để cuộn tới khi gửi không được (khách bấm ở thanh dưới trên điện thoại) */
export const SEND_ERROR_ID = 'loi-gui-don'

interface SendOrderState {
  sending: boolean
  failed: boolean
  /** Có kết quả là đã gửi xong: hiện màn hình cảm ơn */
  result: SendResult | null
  send: (customer: CustomerInfo, summary: OrderSummaryData) => Promise<void>
  reset: () => void
}

/** Gửi đơn (bộ chăn ga hoặc sản phẩm lẻ) một lần, giữ trạng thái đang gửi / lỗi / đã gửi */
export function useSendOrder(): SendOrderState {
  // Lúc mở trang đặt hàng: hàm nhận đơn dùng để nhận biết máy tự điền
  const [startedAt] = useState(() => Date.now())
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  const send = async (customer: CustomerInfo, summary: OrderSummaryData) => {
    if (sending) return
    setSending(true)
    setFailed(false)
    try {
      const sent = await sendOrder({
        customer,
        provinceName: provinceById(customer.provinceId)?.name ?? '',
        summary,
        startedAt,
      })
      setResult(sent)
      if (sent.delivered) trackOrder(sent.code, summary.subtotal ? summary.total : null, summary.line?.name ?? '')
    } catch {
      setFailed(true)
      requestAnimationFrame(() => {
        const box = document.getElementById(SEND_ERROR_ID)
        if (box) scrollToElement(box, 'nearest')
      })
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setResult(null)
    setFailed(false)
  }

  return { sending, failed, result, send, reset }
}
