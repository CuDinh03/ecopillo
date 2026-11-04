import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { PATHS, withSlash } from '../../data/links'
import { POLICY_ALIASES, POLICY_PAGES } from '../../data/policyNav'
import { Icon, ZaloMark } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'
import { SocialIcons } from '../home/SocialLinks'
import { Logo } from './Logo'
import { DesktopProductMenu, MobileProductMenu } from './ProductMenu'

interface NavItem {
  href: string
  label: string
}

/**
 * Biên bản chốt mục 48: Showroom đổi thành Hệ thống phân phối.
 * Góp ý 04/11/2026 mục 3, 13 (owner chọn B + X1 ngày 05/11/2026, mẫu docs/de-xuat-menu-san-pham-04-11.html):
 * "Sản phẩm" mở ô xổ năm nhóm (ProductMenu.tsx); bỏ mục "Thêm", thay bằng link "Đăng ký đại lý".
 * Tin tức, Quà tặng, Hỏi đáp rời thanh máy tính nhưng vẫn ở menu điện thoại, chân trang (Quà tặng còn ở cuối ô xổ Sản phẩm).
 * Hai link nhảy tới mục trên trang chủ (Bộ sưu tập, Ruột chăn gối) bỏ: nay nằm trong ô xổ Sản phẩm.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: PATHS.products, label: 'Sản phẩm' },
  // Tên ngắn cho vừa thanh ở 1024px (05/11/2026); link /gioi-thieu/ giữ nguyên
  { href: PATHS.about, label: 'Giới thiệu' },
  { href: PATHS.distribution, label: 'Hệ thống phân phối' },
  // Owner đổi tên 15/10/2026: "Khách sạn" → "Khách sạn và dự án"; viết "&" cho gọn thanh (05/11/2026)
  { href: PATHS.hotel, label: 'Khách sạn & dự án' },
  { href: PATHS.recruit, label: 'Đăng ký đại lý' },
  // Khách yêu cầu 16/10/2026: "Quà tặng" thành "Quà tặng và sự kiện" (link giữ /qua-tang/)
  { href: PATHS.gifts, label: 'Quà tặng và sự kiện' },
  { href: PATHS.blog, label: 'Tin tức' },
  { href: PATHS.faq, label: 'Hỏi đáp' },
  // Giữ trang Liên hệ như web cũ (yêu cầu của Ecopillo ngày 12/10)
  { href: PATHS.contact, label: 'Liên hệ' },
]

/** Thanh menu máy tính, sau nút "Sản phẩm" (theo mẫu: Liên hệ đứng trước Đăng ký đại lý) */
const BAR_HREFS: readonly string[] = [PATHS.about, PATHS.distribution, PATHS.hotel, PATHS.contact, PATHS.recruit]
const BAR_ITEMS = BAR_HREFS.flatMap((href) => NAV_ITEMS.filter((item) => item.href === href))

/**
 * Mục 10 (khách 16/10/2026: chữ menu "nhạt lắm k rõ"), owner chọn kiểu A 17/10: chữ đủ màu chàm, nét 500, không thêm nền.
 * Giữ cỡ 0.9rem; đệm ngang 0.75rem (05/11/2026, thêm "Đăng ký đại lý") để thanh không tràn ngang ở 1024px.
 * Mẫu: docs/de-xuat-menu-dam-hon.html
 */
const NAV_LINK =
  'relative inline-flex items-center rounded-full px-3 py-2 text-small font-medium whitespace-nowrap text-deep-900 transition-colors hover:bg-mist-100'

/** Mục đang chọn: nền nhạt + gạch chân chàm */
const NAV_ACTIVE =
  'bg-mist-100 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-deep-800'

const navClass = (active: boolean) => `${NAV_LINK} ${active ? NAV_ACTIVE : ''}`

/** Liên kết menu nào đang ứng với trang khách đang xem */
function useActiveHref(): string | null {
  const { pathname } = useLocation()
  const path = withSlash(pathname)
  const page = NAV_ITEMS.find((i) => path.startsWith(i.href))
  if (page) return page.href
  // Bộ sưu tập, danh mục nhỏ và trang từng sản phẩm của web cũ nằm dưới mục Sản phẩm
  if (path.startsWith('/danh-muc-san-pham/') || path.startsWith('/san-pham/')) return PATHS.products
  // Các trang chính sách nằm dưới mục Hỏi đáp
  const slug = path.slice(1, -1)
  if (path === PATHS.privacy || POLICY_PAGES.some((p) => p.slug === slug) || POLICY_ALIASES[slug]) return PATHS.faq
  return null
}

const SCROLL_THRESHOLD = 12

/**
 * Trang chủ (A2, owner chọn 02/11/2026): còn thấy cụm chữ ECOPILLO lớn ở phần đầu (Hero.tsx, `data-hero-lockup`)
 * thì logo nhỏ trên thanh đầu trang ẩn, để màn hình đầu chỉ có một logo; cụm đó khuất dưới thanh đầu trang thì logo hiện lại.
 * Lúc dựng sẵn HTML trang chủ đã ẩn sẵn, không nháy logo. Trang khác giữ như cũ.
 */
function useLogoHiddenAtHero(pathname: string): boolean {
  const isHome = pathname === '/'
  const [isLockupVisible, setIsLockupVisible] = useState(isHome)

  useEffect(() => {
    // Hai bản Hero (điện thoại, máy tính) có thể cùng nằm trong trang trước khi gắn React; bản đang ẩn không bao giờ giao nhau
    const lockups = isHome ? Array.from(document.querySelectorAll('[data-hero-lockup]')) : []
    if (lockups.length === 0 || typeof IntersectionObserver === 'undefined') {
      setIsLockupVisible(false)
      return
    }
    const visible = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
        setIsLockupVisible(visible.size > 0)
      },
      // Chừa phần thanh đầu trang (cao 4.5rem): cụm chữ trượt hết vào dưới thanh thì coi như đã khuất
      { rootMargin: '-72px 0px 0px 0px' },
    )
    lockups.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isHome])

  return isHome && isLockupVisible
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsProductMenuOpen(false)
  }, [location])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isMenuOpen])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Menu phủ cả màn hình: phần trang phía dưới (nội dung, chân trang, thanh liên hệ) không cho Tab tới (rà 23/10/2026:
  // trước đó còn 137 phần tử bị che vẫn nhận focus). Đóng menu khi focus đang trong menu thì trả focus về nút menu.
  useEffect(() => {
    if (!isMenuOpen) return
    const header = headerRef.current
    const behind = Array.from(header?.parentElement?.children ?? []).filter((el): el is HTMLElement => el !== header && el instanceof HTMLElement)
    behind.forEach((el) => (el.inert = true))
    const menu = menuRef.current
    const menuButton = menuButtonRef.current
    return () => {
      behind.forEach((el) => (el.inert = false))
      // Lúc này menu đã bị gỡ khỏi trang nên focus trong menu rơi về <body>
      const active = document.activeElement
      if (!active || active === document.body || menu?.contains(active)) menuButton?.focus()
    }
  }, [isMenuOpen])

  const solid = isScrolled || isMenuOpen
  const activeHref = useActiveHref()
  // Mở menu điện thoại thì luôn hiện logo (menu phủ cả cụm chữ ở phần đầu)
  const isLogoHidden = useLogoHiddenAtHero(location.pathname) && !isMenuOpen

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-200 ${
        solid
          ? 'bg-page/95 shadow-[0_1px_0_rgb(45_46_141/0.1)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <Container className="flex h-[4.5rem] items-center justify-between gap-4">
        <span
          inert={isLogoHidden}
          className={`transition-opacity duration-300 ${isLogoHidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        >
          <Logo />
        </span>

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            <DesktopProductMenu
              label={NAV_ITEMS[0].label}
              isOpen={isProductMenuOpen}
              onOpenChange={setIsProductMenuOpen}
              buttonClass={navClass(activeHref === PATHS.products)}
            />
            {BAR_ITEMS.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className={navClass(item.href === activeHref)} aria-current={item.href === activeHref ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/*
            Mục 9 (khách yêu cầu 16/10/2026: "sđt để xanh như đặt hàng"): nút nền, cùng cỡ nút "Đặt hàng".
            Nền chàm sáng, "Đặt hàng" nền chàm đậm, để hai nút xanh cạnh nhau vẫn phân biệt được.
          */}
          <a
            href={CONTACT.hotlineTel}
            className="hidden h-10 items-center gap-2 rounded-full bg-brand-blue px-4 text-sm font-medium text-ivory shadow-[var(--shadow-soft)] transition duration-300 hover:bg-deep-800 hover:shadow-[var(--shadow-lift)] active:scale-[0.98] md:inline-flex lg:hidden xl:inline-flex"
          >
            <Icon name="phone" size={17} />
            <span className="tabular whitespace-nowrap">{CONTACT.hotlineDisplay}</span>
          </a>
          {/* Điện thoại đã có nút Đặt hàng ở thanh dưới */}
          <span className="hidden sm:block">
            <NavLink to={PATHS.order} className={buttonClass('primary', 'sm')}>
              Đặt hàng
            </NavLink>
          </span>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-deep-900 transition-colors hover:bg-mist-100 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </Container>
      {isMenuOpen &&
        // Đưa ra ngoài <header>: header có backdrop-blur nên phần tử fixed bên trong bị cắt theo header
        createPortal(
          <div
            ref={menuRef}
            id="mobile-menu"
            data-lenis-prevent
            style={{ animationDuration: '220ms' }}
            className="fade-in fixed inset-x-0 top-[4.5rem] bottom-0 z-50 overflow-y-auto overscroll-contain bg-page lg:hidden"
          >
            <Container className="flex min-h-full flex-col py-6">
              <nav aria-label="Menu di động">
                <ul className="divide-y divide-ivory">
                  {NAV_ITEMS.map((item, index) => {
                    const number = String(index + 1).padStart(2, '0')
                    const isActive = item.href === activeHref
                    return (
                      <li key={item.href}>
                        {item.href === PATHS.products ? (
                          <MobileProductMenu label={item.label} number={number} isActive={isActive} onNavigate={() => setIsMenuOpen(false)} />
                        ) : (
                          <Link
                            to={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex items-baseline gap-4 py-4 ${isActive ? 'text-mist-600' : 'text-deep-900'}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="tabular text-xs text-ink-faint">{number}</span>
                            <span className="font-display text-[1.6rem]">{item.label}</span>
                            {isActive && <span className="ml-auto h-2 w-2 self-center rounded-full bg-mist-600" />}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <div className="mt-auto space-y-3 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
                <Link to={PATHS.order} className={buttonClass('primary', 'lg', 'w-full')} onClick={() => setIsMenuOpen(false)}>
                  Đặt hàng online
                  <Icon name="arrowRight" size={18} />
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a href={CONTACT.hotlineTel} className={buttonClass('secondary', 'md')}>
                    <Icon name="phone" size={17} /> Gọi ngay
                  </a>
                  <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'md')}>
                    <ZaloMark /> Nhắn Zalo
                  </a>
                </div>
                <p className="text-center text-sm text-ink-soft">
                  Hotline / Zalo <span className="tabular font-medium text-deep-900">{CONTACT.hotlineDisplay}</span>
                </p>
                <div className="flex justify-center pt-2">
                  <SocialIcons tone="dark" />
                </div>
              </div>
            </Container>
          </div>,
          document.body,
        )}
    </header>
  )
}
