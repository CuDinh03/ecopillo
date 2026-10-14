import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BackToTop } from './BackToTop'
import { ContactDock } from './ContactDock'
import { Footer } from './Footer'
import { Header } from './Header'
import { PreviewNotice } from './PreviewNotice'

/** Mục đã đổi tên: link cũ vẫn cuộn tới đúng chỗ */
const RENAMED_SECTIONS: Readonly<Record<string, string>> = { showroom: 'he-thong-phan-phoi' }

interface SmoothScroll {
  scrollTo: (target: number, options?: { immediate?: boolean; force?: boolean }) => void
}

declare global {
  interface Window {
    /** public/hieu-ung/ecopillo-hieu-ung.js: cuộn trôi Lenis trên máy tính */
    ecoMotion?: { lenis: () => SmoothScroll | null }
  }
}

/**
 * Lên đầu trang ngay. Cuộn trôi (Lenis) đang chạy thì phải dừng nó và báo vị trí mới,
 * không thì cú lăn chuột trước đó kéo trang mới trôi ngược xuống giữa.
 */
function jumpToTop() {
  const lenis = window.ecoMotion?.lenis()
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

/** Cuộn tới mục khi có #hash, hoặc lên đầu trang khi đổi trang */
function useScrollOnNavigate() {
  const { pathname, hash, state } = useLocation()
  // Đổi chương trong trang bộ sưu tập: link đổi nhưng trang đứng yên (xem CollectionDetail)
  const keepScroll = (state as { keepScroll?: boolean } | null)?.keepScroll === true

  useEffect(() => {
    if (keepScroll) return
    if (!hash) {
      jumpToTop()
      return
    }
    const raw = decodeURIComponent(hash.slice(1))
    const id = RENAMED_SECTIONS[raw] ?? raw
    // Đợi một khung hình để trang mới kịp render trước khi tìm mục
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, keepScroll])
}

export function SiteLayout() {
  useScrollOnNavigate()
  // Hiện dần khi cuộn: do public/hieu-ung/ecopillo-hieu-ung.js lo cho cả trang (thay useScrollReveal)
  const { pathname } = useLocation()
  // Trang đặt hàng và chi tiết sản phẩm có thanh dưới riêng (giá + gọi/Zalo)
  const showDock = !pathname.startsWith('/dat-hang') && !pathname.startsWith('/san-pham/')
  // Trang tìm đại lý: điện thoại bỏ thanh liên hệ dưới đáy, vì mỗi thẻ đã có Gọi/Zalo của đúng điểm đó
  // (thêm hotline chung dễ bấm nhầm) và bản đồ cần chỗ. Máy tính vẫn giữ nút "Liên hệ" nổi.
  const isDealerFinder = pathname.startsWith('/he-thong-phan-phoi')

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-deep-800 focus:px-4 focus:py-2 focus:text-ivory"
      >
        Bỏ qua tới nội dung
      </a>
      <Header />
      <main id="noi-dung" className="flex-1">
        {/*
          Header, chân trang giữ nguyên trong lúc tải gói của trang con.
          Khung chờ cao trọn màn hình (lvh: tính cả lúc thanh địa chỉ điện thoại thu lại) để chân trang nằm dưới
          mép màn hình. Thấp hơn (trước là 70vh) thì chân trang ló lên rồi bị đẩy xuống khi trang hiện ra: CLS 0,17–0,2.
        */}
        <Suspense fallback={<div className="min-h-lvh" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {showDock && <ContactDock mobileBar={!isDealerFinder} />}
      {/* Trên điện thoại có thanh dưới (liên hệ hoặc đặt hàng) thì đẩy nút lên trên nó */}
      <BackToTop raised={!isDealerFinder} />
      <PreviewNotice />
    </div>
  )
}
