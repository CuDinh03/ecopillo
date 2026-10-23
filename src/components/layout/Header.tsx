import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { PATHS, withSlash } from '../../data/links'
import { POLICY_ALIASES, POLICY_PAGES } from '../../data/policyNav'
import { Icon, ZaloMark } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'
import { useActiveSection } from '../../hooks/useActiveSection'
import { SocialIcons } from '../home/SocialLinks'
import { Logo } from './Logo'

interface NavItem {
  href: string
  label: string
  /** Hiện thẳng trên thanh menu máy tính; còn lại nằm trong mục "Thêm" */
  primary?: boolean
}

/**
 * Biên bản chốt mục 48: Showroom đổi thành Hệ thống phân phối; Quà tặng đang chỉnh nên vào mục "Thêm".
 * Về chúng tôi, Hệ thống phân phối, Khách sạn và dự án, Quà tặng, Hỏi đáp nay là trang riêng (trang chủ vẫn giữ phần tóm tắt).
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: PATHS.products, label: 'Sản phẩm', primary: true },
  { href: PATHS.about, label: 'Về chúng tôi', primary: true },
  { href: PATHS.distribution, label: 'Hệ thống phân phối', primary: true },
  // Owner đổi tên 15/10/2026: "Khách sạn" → "Khách sạn và dự án"
  { href: PATHS.hotel, label: 'Khách sạn và dự án', primary: true },
  { href: '/#bo-suu-tap', label: 'Bộ sưu tập' },
  { href: '/#ruot-chan-goi', label: 'Ruột chăn gối' },
  // Khách yêu cầu 16/10/2026: "Quà tặng" thành "Quà tặng và sự kiện" (link giữ /qua-tang/)
  { href: PATHS.gifts, label: 'Quà tặng và sự kiện' },
  { href: PATHS.blog, label: 'Tin tức' },
  { href: PATHS.faq, label: 'Hỏi đáp' },
  // Giữ trang Liên hệ như web cũ (yêu cầu của Ecopillo ngày 12/10)
  { href: PATHS.contact, label: 'Liên hệ', primary: true },
]

const PRIMARY_ITEMS = NAV_ITEMS.filter((item) => item.primary)
const MORE_ITEMS = NAV_ITEMS.filter((item) => !item.primary)

/**
 * Mục 10 (khách 16/10/2026: chữ menu "nhạt lắm k rõ"), owner chọn kiểu A 17/10: chữ đủ màu chàm, nét 500, không thêm nền.
 * Giữ cỡ 0.9rem: to hơn hoặc giãn khoảng cách thì thanh đầu trang tràn ngang ở 1024px. Mẫu: docs/de-xuat-menu-dam-hon.html
 */
const NAV_LINK =
  'relative inline-flex items-center rounded-full px-3.5 py-2 text-small font-medium whitespace-nowrap text-deep-900 transition-colors hover:bg-mist-100'

/** Mục đang chọn: nền nhạt + gạch chân chàm */
const NAV_ACTIVE =
  'bg-mist-100 after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-deep-800'

const navClass = (active: boolean) => `${NAV_LINK} ${active ? NAV_ACTIVE : ''}`

const SECTION_IDS = NAV_ITEMS.filter((i) => i.href.startsWith('/#')).map((i) => i.href.slice(2))

/** Liên kết menu nào đang ứng với trang / mục khách đang xem */
function useActiveHref(): string | null {
  const { pathname } = useLocation()
  const section = useActiveSection(SECTION_IDS, pathname === '/')
  const path = withSlash(pathname)
  const page = NAV_ITEMS.find((i) => i.href !== '/' && !i.href.startsWith('/#') && path.startsWith(i.href))
  if (page) return page.href
  // Bộ sưu tập, danh mục nhỏ và trang từng sản phẩm của web cũ nằm dưới mục Sản phẩm
  if (path.startsWith('/danh-muc-san-pham/') || path.startsWith('/san-pham/')) return PATHS.products
  // Các trang chính sách nằm dưới mục Hỏi đáp
  const slug = path.slice(1, -1)
  if (path === PATHS.privacy || POLICY_PAGES.some((p) => p.slug === slug) || POLICY_ALIASES[slug]) return PATHS.faq
  return section ? `/#${section}` : null
}

/** Mục "Thêm" — gom các liên kết ít dùng vào một menu thả xuống */
function MoreMenu({ activeHref }: { activeHref: string | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const location = useLocation()

  useEffect(() => setIsOpen(false), [location])

  useEffect(() => {
    if (!isOpen) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <li ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="more-menu"
        onClick={() => setIsOpen((open) => !open)}
        className={`${navClass(MORE_ITEMS.some((i) => i.href === activeHref))} gap-1 ${isOpen ? 'bg-mist-100' : ''}`}
      >
        Thêm
        <Icon name="chevronDown" size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul
          id="more-menu"
          className="pop-in absolute top-full right-0 mt-2 w-52 origin-top-right rounded-2xl bg-ivory p-2 shadow-[var(--shadow-lift)]"
        >
          {MORE_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={item.href === activeHref ? 'location' : undefined}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-small font-medium text-deep-900 transition-colors hover:bg-mist-100 ${
                  item.href === activeHref ? 'bg-mist-100' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

const SCROLL_THRESHOLD = 12

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  useEffect(() => setIsMenuOpen(false), [location])

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
        <Logo />

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {PRIMARY_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={navClass(item.href === activeHref)}
                  aria-current={item.href === activeHref ? (item.href.startsWith('/#') ? 'location' : 'page') : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <MoreMenu activeHref={activeHref} />
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
                  {NAV_ITEMS.map((item, index) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        aria-current={item.href === activeHref ? 'location' : undefined}
                        className={`flex items-baseline gap-4 py-4 ${item.href === activeHref ? 'text-mist-600' : 'text-deep-900'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="tabular text-xs text-ink-faint">{String(index + 1).padStart(2, '0')}</span>
                        <span className="font-display text-[1.6rem]">{item.label}</span>
                        {item.href === activeHref && <span className="ml-auto h-2 w-2 self-center rounded-full bg-mist-600" />}
                      </Link>
                    </li>
                  ))}
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
