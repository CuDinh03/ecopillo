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
 * Về chúng tôi, Hệ thống phân phối, Khách sạn, Quà tặng, Hỏi đáp nay là trang riêng (trang chủ vẫn giữ phần tóm tắt).
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: PATHS.products, label: 'Sản phẩm', primary: true },
  { href: PATHS.about, label: 'Về chúng tôi', primary: true },
  { href: PATHS.distribution, label: 'Hệ thống phân phối', primary: true },
  { href: PATHS.hotel, label: 'Khách sạn', primary: true },
  { href: '/#bo-suu-tap', label: 'Bộ sưu tập' },
  { href: '/#ruot-chan-goi', label: 'Ruột chăn gối' },
  { href: PATHS.gifts, label: 'Quà tặng' },
  { href: PATHS.blog, label: 'Tin tức' },
  { href: PATHS.faq, label: 'Hỏi đáp' },
  // Giữ trang Liên hệ như web cũ (yêu cầu của Ecopillo ngày 12/10)
  { href: PATHS.contact, label: 'Liên hệ', primary: true },
]

const PRIMARY_ITEMS = NAV_ITEMS.filter((item) => item.primary)
const MORE_ITEMS = NAV_ITEMS.filter((item) => !item.primary)

const NAV_LINK =
  'relative inline-flex items-center rounded-full px-3.5 py-2 text-[0.9rem] whitespace-nowrap transition-colors hover:bg-mist-100 hover:text-deep-900'

/** Mục đang chọn: nền nhạt + gạch chân chàm */
const NAV_ACTIVE =
  'bg-mist-100 font-medium text-deep-900 after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-deep-800'

const navClass = (active: boolean) => `${NAV_LINK} ${active ? NAV_ACTIVE : 'text-ink-soft'}`

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
        className={`${navClass(MORE_ITEMS.some((i) => i.href === activeHref))} gap-1 ${isOpen ? 'bg-mist-100 text-deep-900' : ''}`}
      >
        Thêm
        <Icon name="chevronDown" size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul
          id="more-menu"
          className="reveal absolute top-full right-0 mt-2 w-52 rounded-2xl bg-ivory p-2 shadow-[var(--shadow-lift)] ring-1 ring-cream-200"
        >
          {MORE_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={item.href === activeHref ? 'location' : undefined}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[0.9rem] transition-colors hover:bg-mist-100 hover:text-deep-900 ${
                  item.href === activeHref ? 'bg-mist-100 font-medium text-deep-900' : 'text-ink-soft'
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

  const solid = isScrolled || isMenuOpen
  const activeHref = useActiveHref()

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
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
          <a
            href={CONTACT.hotlineTel}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-deep-800 transition-colors hover:bg-mist-100 md:inline-flex lg:hidden xl:inline-flex"
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
            id="mobile-menu"
            className="reveal fixed inset-x-0 top-[4.5rem] bottom-0 z-50 overflow-y-auto bg-page lg:hidden"
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
                        <span className="tabular text-xs text-ink-faint">0{index + 1}</span>
                        <span className="font-display text-[1.6rem]">{item.label}</span>
                        {item.href === activeHref && <span className="ml-auto h-2 w-2 self-center rounded-full bg-mist-600" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto space-y-3 pt-8 pb-10">
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
