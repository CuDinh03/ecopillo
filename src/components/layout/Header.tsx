import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { PATHS, withSlash } from '../../data/links'
import { HEADER_TEXT } from '../../data/pageText/header'
import { isProductMenuItem, menuKey, SHOWN_MENU } from '../../data/pageText/mainMenu'
import { SEARCH_TEXT } from '../../data/pageText/search'
import { POLICY_ALIASES, POLICY_PAGES } from '../../data/policyNav'
import { Icon, ZaloMark } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'
import { SocialIcons } from '../home/SocialLinks'
import { Logo } from './Logo'
import { MenuLink } from './MenuLink'
import { NavMoreMenu } from './NavMoreMenu'
import { DesktopProductMenu, MobileProductMenu } from './ProductMenu'
import { SiteSearch } from './SiteSearch'

/**
 * Các mục menu Ecopillo tự sửa (Giao diện → Menu chính, src/data/pageText/mainMenu.ts; lịch sử quyết định ghi ở đó).
 * Thanh máy tính: mục "luôn trên thanh" và mục "gom vào nút Thêm" theo thứ tự Ecopillo xếp. Mục "gom" nằm thẳng trên thanh
 * từ 1280px; 1024–1279px không đủ chỗ (đo 19/11/2026: thiếu 42px khi có nút kính lúp) nên vào nút "Thêm" (NavMoreMenu.tsx).
 */
const BAR_ITEMS = SHOWN_MENU
const MORE_ITEMS = SHOWN_MENU.filter((item) => item.cho === 'them')

/**
 * Mục 10 (khách 16/10/2026: chữ menu "nhạt lắm k rõ"), owner chọn kiểu A 17/10: chữ đủ màu chàm, nét 500, không thêm nền.
 * Giữ cỡ 0.9rem; đệm ngang 0.75rem (05/11/2026, thêm "Đăng ký đại lý") để thanh không tràn ngang ở 1024px.
 * Mẫu: docs/de-xuat-menu-dam-hon.html
 */
const NAV_LINK =
  'relative inline-flex items-center rounded-full px-2 py-2 text-small 2xl:px-2.5 font-medium whitespace-nowrap text-deep-900 transition-colors hover:bg-mist-100'

/** Mục đang chọn: nền nhạt + gạch chân chàm */
const NAV_ACTIVE =
  'bg-mist-100 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-deep-800'

const navClass = (active: boolean) => `${NAV_LINK} ${active ? NAV_ACTIVE : ''}`

/** Liên kết menu nào đang ứng với trang khách đang xem */
function useActiveHref(): string | null {
  const { pathname } = useLocation()
  const path = withSlash(pathname)
  // Chỉ so mục trỏ trong web; bỏ trang chủ (mọi đường dẫn đều bắt đầu bằng "/")
  const page = SHOWN_MENU.map((i) => menuKey(i.link)).find((key) => key !== '/' && key.startsWith('/') && path.startsWith(key))
  if (page) return page
  // Bộ sưu tập, danh mục nhỏ và trang từng sản phẩm của web cũ nằm dưới mục Sản phẩm
  if (path.startsWith('/danh-muc-san-pham/') || path.startsWith('/san-pham/')) return PATHS.products
  // Các trang chính sách nằm dưới mục Hỏi đáp
  const slug = path.slice(1, -1)
  if (path === PATHS.privacy || POLICY_PAGES.some((p) => p.slug === slug) || POLICY_ALIASES[slug]) return PATHS.faq
  return null
}

const SCROLL_THRESHOLD = 12

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  /** Mép dưới thanh đầu trang lúc mở ô tìm; null = ô tìm đóng */
  const [searchTop, setSearchTop] = useState<number | null>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
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
    setSearchTop(null)
  }, [location])

  const openSearch = () => {
    setIsMenuOpen(false)
    setIsProductMenuOpen(false)
    setSearchTop(headerRef.current?.getBoundingClientRect().bottom ?? 72)
  }
  const closeSearch = useCallback(() => {
    setSearchTop(null)
    searchButtonRef.current?.focus({ preventScroll: true })
  }, [])

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
      // Lúc này menu đã bị gỡ khỏi trang nên focus trong menu rơi về <body>.
      // preventScroll: trả focus về nút menu mà để trình duyệt cuộn thì trang nhảy lên vài trăm px (rà điện thoại 05/11/2026)
      const active = document.activeElement
      if (!active || active === document.body || menu?.contains(active)) menuButton?.focus({ preventScroll: true })
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
      {/* Khung rộng hơn Container (1240px) để thanh đủ tám mục (19/11/2026); ô xổ Sản phẩm vẫn theo Container */}
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1520px] items-center justify-between gap-2 px-5 sm:gap-3 lg:gap-2 2xl:gap-3 sm:px-8 lg:px-10">
        {/* Logo luôn hiện, cả ở trang chủ (banner 16/11/2026 không còn cụm chữ ECOPILLO lớn như A2 02/11) */}
        <Logo />

        <nav aria-label={HEADER_TEXT.dieuHuong} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-0 2xl:gap-0.5">
            {BAR_ITEMS.map((item, index) => {
              const key = menuKey(item.link)
              const isActive = key === activeHref
              // Mục "gom vào nút Thêm": thẳng trên thanh từ 1280px
              const place = item.cho === 'them' ? 'hidden xl:block' : undefined
              return isProductMenuItem(item) ? (
                <DesktopProductMenu
                  key={`${index}-${key}`}
                  label={item.ten}
                  className={place}
                  isOpen={isProductMenuOpen}
                  onOpenChange={setIsProductMenuOpen}
                  buttonClass={navClass(isActive)}
                />
              ) : (
                <li key={`${index}-${key}`} className={place}>
                  <MenuLink href={item.link} className={navClass(isActive)} aria-current={isActive ? 'page' : undefined}>
                    {item.ten}
                  </MenuLink>
                </li>
              )
            })}
            <NavMoreMenu items={MORE_ITEMS} activeHref={activeHref} buttonClass={navClass(false)} />
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/*
            Mục 9 (khách yêu cầu 16/10/2026: "sđt để xanh như đặt hàng"): nút nền, cùng cỡ nút "Đặt hàng".
            Nền chàm sáng, "Đặt hàng" nền chàm đậm, để hai nút xanh cạnh nhau vẫn phân biệt được.
            Từ 19/11/2026 (thanh thêm ba mục) nút chỉ hiện ở điện thoại ngang, máy tính bảng và màn từ 1480px: màn 1024–1479px
            không đủ chỗ (đo 19/11); số hotline vẫn luôn hiện ở khung liên hệ góc phải (ContactDock.tsx, owner chọn A ngày 18/11).
          */}
          <a
            href={CONTACT.hotlineTel}
            className="hidden h-10 items-center gap-2 rounded-full bg-brand-blue px-4 text-sm font-medium text-ivory shadow-[var(--shadow-soft)] transition duration-300 hover:bg-deep-800 hover:shadow-[var(--shadow-lift)] active:scale-[0.98] md:max-lg:inline-flex min-[1480px]:inline-flex"
          >
            <Icon name="phone" size={17} />
            <span className="tabular whitespace-nowrap">{CONTACT.hotlineDisplay}</span>
          </a>
          {/* Điện thoại đã có nút Đặt hàng ở thanh dưới */}
          <span className="hidden sm:block">
            <MenuLink href={HEADER_TEXT.datHangLink} isNav className={buttonClass('primary', 'sm')}>
              {HEADER_TEXT.datHang}
            </MenuLink>
          </span>
          {/* Thanh tìm kiếm, phương án B (19/11/2026): luôn hiện; điện thoại cạnh nút menu, máy tính đứng đầu nhóm nút bên phải */}
          <button
            ref={searchButtonRef}
            type="button"
            aria-label={HEADER_TEXT.moTim}
            aria-haspopup="dialog"
            aria-expanded={searchTop !== null}
            onClick={openSearch}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-deep-900 transition-colors hover:bg-mist-100 lg:order-first lg:h-10 lg:w-10 lg:bg-ivory lg:shadow-[var(--shadow-soft)] lg:hover:bg-mist-100"
          >
            <Icon name="search" size={20} />
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-deep-900 transition-colors hover:bg-mist-100 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? HEADER_TEXT.dongMenu : HEADER_TEXT.moMenu}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>
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
              {/* Ô tìm đầu menu như mẫu Ecopillo gửi (demluxury.com.vn): bấm vào mở lớp tìm */}
              <button
                type="button"
                onClick={openSearch}
                className="mb-2 flex h-12 w-full items-center gap-2.5 rounded-full bg-ivory px-4 text-left text-base text-ink-faint shadow-[var(--shadow-soft)]"
              >
                <Icon name="search" size={19} className="text-deep-900" />
                {SEARCH_TEXT.oTim}
              </button>
              <nav aria-label={HEADER_TEXT.menuDiDong}>
                <ul className="divide-y divide-ivory">
                  {SHOWN_MENU.map((item, index) => {
                    const number = String(index + 1).padStart(2, '0')
                    const key = menuKey(item.link)
                    const isActive = key === activeHref
                    return (
                      <li key={`${index}-${key}`}>
                        {isProductMenuItem(item) ? (
                          <MobileProductMenu label={item.ten} number={number} isActive={isActive} onNavigate={() => setIsMenuOpen(false)} />
                        ) : (
                          <MenuLink
                            href={item.link}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex items-baseline gap-4 py-4 ${isActive ? 'text-mist-600' : 'text-deep-900'}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="tabular text-xs text-ink-faint">{number}</span>
                            <span className="font-display text-[1.6rem]">{item.ten}</span>
                            {isActive && <span className="ml-auto h-2 w-2 self-center rounded-full bg-mist-600" />}
                          </MenuLink>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <div className="mt-auto space-y-3 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
                <MenuLink href={HEADER_TEXT.datHangLink} className={buttonClass('primary', 'lg', 'w-full')} onClick={() => setIsMenuOpen(false)}>
                  {HEADER_TEXT.datHangOnline}
                  <Icon name="arrowRight" size={18} />
                </MenuLink>
                <div className="grid grid-cols-2 gap-3">
                  <a href={CONTACT.hotlineTel} className={buttonClass('secondary', 'md')}>
                    <Icon name="phone" size={17} className="text-call" /> {HEADER_TEXT.goiNgay}
                  </a>
                  <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'md')}>
                    <ZaloMark /> {HEADER_TEXT.nhanZalo}
                  </a>
                </div>
                <p className="text-center text-sm text-ink-soft">
                  {HEADER_TEXT.hotlineZalo} <span className="tabular font-medium text-deep-900">{CONTACT.hotlineDisplay}</span>
                </p>
                <div className="flex justify-center pt-2">
                  <SocialIcons />
                </div>
              </div>
            </Container>
          </div>,
          document.body,
        )}
      {searchTop !== null && <SiteSearch top={searchTop} onClose={closeSearch} />}
    </header>
  )
}
