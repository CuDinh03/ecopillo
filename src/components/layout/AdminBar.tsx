import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Thanh quản trị cho người đăng nhập WordPress (anh Quang 18/11/2026, plugin 1.7.2: thanh-quan-tri.php).
 * Chỉ hỏi WordPress khi trình duyệt có cookie đánh dấu `eco_qt` (plugin đặt lúc người có quyền đăng nhập). Khách không có
 * cookie nên không phát sinh yêu cầu nào; máy chủ kiểm quyền thật rồi mới trả link. Bản xem thử, `pnpm dev` không có
 * WordPress nên không bao giờ hiện.
 */

interface AdminLink {
  nhan: string
  url: string
  /** "Sửa trang này": làm nổi */
  noi?: boolean
}

interface AdminBarData {
  ten: string
  links: readonly AdminLink[]
  thoat: string
}

const COOKIE = 'eco_qt'
const ENDPOINT = '/wp-admin/admin-ajax.php?action=eco_thanh_qt&duong='

const hasMarker = (): boolean => typeof document !== 'undefined' && document.cookie.split('; ').includes(`${COOKIE}=1`)

/** Đăng nhập đã hết mà cookie còn: xoá để lần sau khỏi hỏi */
const clearMarker = (): void => {
  document.cookie = `${COOKIE}=; Max-Age=0; path=/; SameSite=Lax`
}

/** Chỉ nhận link trong web này (dữ liệu từ máy chủ vẫn kiểm lại) */
const isSameSite = (url: string): boolean => {
  try {
    return new URL(url, window.location.origin).origin === window.location.origin
  } catch {
    return false
  }
}

const parse = (raw: unknown): AdminBarData | null => {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  if (data.hien !== true || !Array.isArray(data.links) || typeof data.thoat !== 'string') return null
  const links = data.links
    .filter((l): l is AdminLink => !!l && typeof l === 'object' && typeof l.nhan === 'string' && typeof l.url === 'string')
    .filter((l) => isSameSite(l.url))
  return { ten: typeof data.ten === 'string' ? data.ten : '', links, thoat: isSameSite(data.thoat) ? data.thoat : '' }
}

export function AdminBar() {
  const { pathname } = useLocation()
  const [data, setData] = useState<AdminBarData | null>(null)

  useEffect(() => {
    if (!hasMarker()) return
    const controller = new AbortController()
    fetch(ENDPOINT + encodeURIComponent(pathname), { credentials: 'same-origin', signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((raw) => {
        const parsed = parse(raw)
        if (!parsed) clearMarker()
        setData(parsed)
      })
      .catch(() => {
        // Mạng lỗi hoặc đã chuyển trang: giữ thanh cũ (nếu có), không làm phiền khách
      })
    return () => controller.abort()
  }, [pathname])

  if (!data) return null
  return (
    <nav aria-label="Quản trị" className="relative z-50 bg-deep-900 text-[0.8125rem] text-ivory">
      <div className="flex items-center gap-1 overflow-x-auto px-3 py-1.5 whitespace-nowrap sm:px-5">
        <span className="mr-2 font-semibold text-mist-200">Quản trị{data.ten ? ` · ${data.ten}` : ''}</span>
        {data.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            className={`rounded-full px-3 py-1 transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-mist-200 ${
              link.noi ? 'bg-white text-deep-900 hover:bg-mist-100' : ''
            }`}
          >
            {link.nhan}
          </a>
        ))}
        {data.thoat && (
          <a href={data.thoat} className="ml-auto rounded-full px-3 py-1 text-mist-200 transition hover:bg-white/15">
            Đăng xuất
          </a>
        )}
      </div>
    </nav>
  )
}
