import { useEffect, useState } from 'react'
import { DEALERS, sortDefault, type Dealer } from '../data/dealers'

/**
 * Danh sách điểm bán. Khi đặt VITE_DEALERS_URL (ví dụ /wp-json/ecopillo/v1/dai-ly) thì lấy từ WordPress,
 * nhân viên thêm, sửa, ẩn đại lý trong trang quản trị là web tự cập nhật. WordPress không trả lời thì
 * dùng danh sách dựng sẵn trong data/dealers.ts.
 */
const ENDPOINT: string | undefined = import.meta.env.VITE_DEALERS_URL

const isDealer = (d: unknown): d is Dealer => {
  if (!d || typeof d !== 'object') return false
  const x = d as Record<string, unknown>
  return (
    typeof x.id === 'string' &&
    typeof x.ten === 'string' &&
    typeof x.dia_chi === 'string' &&
    typeof x.lat === 'number' &&
    typeof x.lng === 'number' &&
    typeof x.dien_thoai === 'string'
  )
}

export function useDealers(): readonly Dealer[] {
  const [dealers, setDealers] = useState<readonly Dealer[]>(DEALERS)

  useEffect(() => {
    if (!ENDPOINT) return
    const controller = new AbortController()
    fetch(ENDPOINT, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: unknown) => {
        const list = Array.isArray(data) ? data.filter(isDealer) : []
        if (list.length > 0) {
          setDealers(
            sortDefault(
              list.map((d) => ({ ...d, ngay_nghi: d.ngay_nghi ?? [], anh: d.anh ?? [], gio_mo: d.gio_mo || '08:30', gio_dong: d.gio_dong || '21:00' })),
            ),
          )
        }
      })
      .catch(() => {
        /* giữ danh sách dựng sẵn */
      })
    return () => controller.abort()
  }, [])

  return dealers
}
