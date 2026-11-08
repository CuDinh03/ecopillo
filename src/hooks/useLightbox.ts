import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Mở / đóng khung xem ảnh toàn màn hình (C3, owner chốt 09/11/2026) và nối với nút Back của điện thoại:
 * mở khung thì thêm một mục vào lịch sử (cùng đường link), bấm Back là đóng khung chứ không rời trang.
 * Đóng bằng nút "Đóng" hoặc Esc thì tự lùi mục đó, để lịch sử không dư mục.
 */

const HISTORY_KEY = 'ecoLightbox'

type HistoryState = Record<string, unknown> | null

const historyToken = (): unknown => (window.history.state as HistoryState)?.[HISTORY_KEY]

export interface LightboxControl {
  isOpen: boolean
  open: () => void
  close: () => void
}

export function useLightbox(): LightboxControl {
  const [isOpen, setIsOpen] = useState(false)
  // Mã của mục lịch sử đang mở; null = khung đang đóng (hoặc đang đóng dở)
  const tokenRef = useRef<string | null>(null)

  const open = useCallback(() => {
    if (tokenRef.current) return
    const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    tokenRef.current = token
    // Giữ nguyên state của react-router (key, idx): bộ định tuyến không coi đây là trang mới
    const routerState = (window.history.state as HistoryState) ?? {}
    window.history.pushState({ ...routerState, [HISTORY_KEY]: token }, '')
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    const token = tokenRef.current
    if (!token) return
    tokenRef.current = null
    setIsOpen(false)
    // Mục của khung vẫn đang là mục hiện tại: lùi lại để Back lần sau đi đúng trang trước
    if (historyToken() === token) window.history.back()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    // Bấm Back (hoặc vuốt lùi) khi khung đang mở: rời mục của khung → đóng khung
    const onPopState = () => {
      const token = tokenRef.current
      if (!token || historyToken() === token) return
      tokenRef.current = null
      setIsOpen(false)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isOpen])

  return { isOpen, open, close }
}
