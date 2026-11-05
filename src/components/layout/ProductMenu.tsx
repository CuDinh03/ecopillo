import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { PRODUCT_MENU, PRODUCT_MENU_ALL, PRODUCT_MENU_GIFTS, type MenuGroup, type MenuRow } from '../../data/productMenu'
import { formatVND } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { Container } from '../ui/primitives'
import { Placeholder } from '../ui/Placeholder'

/**
 * Menu "Sản phẩm" xổ ra (góp ý 04/11/2026 mục 3, 13; owner chọn phương án B ngày 05/11/2026).
 * Máy tính: bấm "Sản phẩm" mở ô trắng rộng bằng khung trang, năm cột có ảnh và giá, phần trang phía sau tối đi.
 * Điện thoại: trong menu phủ màn hình, "Sản phẩm" mở ra năm thẻ nhóm, bấm thẻ thì hiện các dòng có giá.
 * Dữ liệu: src/data/productMenu.ts. Mẫu: docs/de-xuat-menu-san-pham-04-11.html.
 */

const PANEL_ID = 'product-menu'

/** Giá trên một dòng: "từ …" khi còn giá cao hơn theo kích thước, mẫu */
const rowPrice = (row: MenuRow): string => (row.isFromPrice ? `từ ${formatVND(row.min)}` : formatVND(row.min))

interface DesktopProductMenuProps {
  label: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  /** Lớp chữ của mục menu (NAV_LINK, NAV_ACTIVE trong Header.tsx) */
  buttonClass: string
}

export function DesktopProductMenu({ label, isOpen, onOpenChange, buttonClass }: DesktopProductMenuProps) {
  const ref = useRef<HTMLLIElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const isOutside = (target: EventTarget | null) => !ref.current?.contains(target as Node)
    const onPointer = (e: PointerEvent) => isOutside(e.target) && onOpenChange(false)
    // Dùng bàn phím Tab ra khỏi ô xổ thì đóng
    const onFocus = (e: FocusEvent) => isOutside(e.target) && onOpenChange(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      onOpenChange(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onOpenChange])

  const close = () => onOpenChange(false)

  return (
    // Không đặt `relative` ở đây: ô xổ bám theo <header> (sticky) để rộng bằng khung trang
    <li ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        onClick={() => onOpenChange(!isOpen)}
        className={`${buttonClass} gap-1 ${isOpen ? 'bg-mist-100' : ''}`}
      >
        {label}
        <Icon name="chevronDown" size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          {/* Khung ngoài rộng hết header nhưng không nhận bấm: bấm ra hai bên ô xổ là bấm vào lớp tối, ô đóng lại */}
          <div id={PANEL_ID} className="pointer-events-none absolute inset-x-0 top-full z-10 pt-2">
            <Container>
              <div
                data-lenis-prevent
                className="pointer-events-auto pop-in max-h-[calc(100dvh-6rem)] origin-top overflow-y-auto overscroll-contain rounded-3xl bg-ivory px-6 pt-6 pb-5 shadow-[var(--shadow-lift)]"
              >
                <ul className="grid grid-cols-5 gap-5 xl:gap-6">
                  {PRODUCT_MENU.map((group) => (
                    <li key={group.id} className="min-w-0">
                      <DesktopGroup group={group} onNavigate={close} />
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-4 text-small">
                  <Link
                    to={PRODUCT_MENU_ALL.to}
                    onClick={close}
                    className="inline-flex items-center gap-1.5 font-semibold text-mist-600 underline-offset-4 hover:underline"
                  >
                    {PRODUCT_MENU_ALL.label}
                    <Icon name="arrowRight" size={16} />
                  </Link>
                  <p className="text-ink-soft">
                    {PRODUCT_MENU_GIFTS.lead}{' '}
                    <Link to={PRODUCT_MENU_GIFTS.to} onClick={close} className="font-semibold text-mist-600 underline-offset-4 hover:underline">
                      {PRODUCT_MENU_GIFTS.label}
                    </Link>
                  </p>
                </div>
              </div>
            </Container>
          </div>
          {/* Lớp tối phía sau. Đưa ra ngoài <header>: header có backdrop-blur nên phần tử fixed bên trong bị cắt theo header */}
          {createPortal(<div aria-hidden className="fade-in fixed inset-0 z-[35] bg-deep-900/25" />, document.body)}
        </>
      )}
    </li>
  )
}

function DesktopGroup({ group, onNavigate }: { group: MenuGroup; onNavigate: () => void }) {
  return (
    <>
      <Link to={group.to} onClick={onNavigate} tabIndex={-1} aria-hidden className="group block overflow-hidden rounded-2xl">
        <Placeholder
          image={{ ...group.image, alt: '' }}
          note={group.title}
          tone="mist"
          sizes="(min-width: 1240px) 220px, 18vw"
          className="aspect-[16/10] w-full transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
        />
      </Link>
      <h3 className="mt-3 mb-1.5 font-display text-[1.06rem] leading-tight font-semibold text-deep-900">
        <Link to={group.to} onClick={onNavigate} className="hover:text-mist-600">
          {group.title}
        </Link>
      </h3>
      <ul>
        {group.rows.map((row) => (
          <li key={row.to}>
            <Link
              to={row.to}
              onClick={onNavigate}
              className="-mx-2 flex flex-wrap items-baseline justify-between gap-x-2 rounded-lg px-2 py-1.5 text-small text-deep-900 transition-colors hover:bg-mist-100"
            >
              <span>{row.label}</span>
              <span className="tabular text-xs whitespace-nowrap text-ink-faint">{rowPrice(row)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

interface MobileProductMenuProps {
  label: string
  number: string
  isActive: boolean
  onNavigate: () => void
}

/** Mục "Sản phẩm" trong menu điện thoại: bấm để mở năm thẻ nhóm */
export function MobileProductMenu({ label, number, isActive, onNavigate }: MobileProductMenuProps) {
  // Đang ở trang sản phẩm thì mở sẵn
  const [isOpen, setIsOpen] = useState(isActive)
  // Thẻ Đệm mở sẵn (khách: "phần đệm tìm mãi mới thấy")
  const [openGroup, setOpenGroup] = useState<string | null>(PRODUCT_MENU[0]?.id ?? null)

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-product-menu"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-baseline gap-4 py-4 text-left ${isActive ? 'text-mist-600' : 'text-deep-900'}`}
      >
        <span className="tabular text-xs text-ink-faint">{number}</span>
        <span className="font-display text-[1.6rem]">{label}</span>
        <Icon name={isOpen ? 'minus' : 'plus'} size={22} className="ml-auto self-center text-mist-600" />
      </button>
      {isOpen && (
        <div id="mobile-product-menu" className="fade-in grid gap-2 pb-4">
          {PRODUCT_MENU.map((group) => (
            <MobileGroup
              key={group.id}
              group={group}
              isOpen={openGroup === group.id}
              onToggle={() => setOpenGroup((id) => (id === group.id ? null : group.id))}
              onNavigate={onNavigate}
            />
          ))}
          <Link
            to={PRODUCT_MENU_ALL.to}
            onClick={onNavigate}
            className="inline-flex items-center justify-center gap-1.5 py-3 text-small font-semibold text-mist-600"
          >
            {PRODUCT_MENU_ALL.label}
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      )}
    </>
  )
}

interface MobileGroupProps {
  group: MenuGroup
  isOpen: boolean
  onToggle: () => void
  onNavigate: () => void
}

function MobileGroup({ group, isOpen, onToggle, onNavigate }: MobileGroupProps) {
  const listId = `mobile-product-${group.id}`
  // Nhóm có trang riêng mà chưa dòng nào trỏ tới (Đệm, Bộ ga phủ, Ruột chăn gối): thêm link xem cả nhóm
  const hasOwnPage = !group.rows.some((row) => row.to === group.to)
  return (
    <div className="rounded-2xl bg-ivory shadow-[var(--shadow-soft)]">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={onToggle}
        className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 py-2 pr-3 pl-2 text-left"
      >
        <Placeholder image={{ ...group.image, alt: '' }} note={group.title} tone="mist" sizes="48px" className="h-12 w-12 rounded-xl" />
        <span className="min-w-0">
          <span className="block font-semibold text-deep-900">{group.title}</span>
          <span className="block text-xs text-ink-faint">
            <span className="whitespace-nowrap">từ {formatVND(group.min)}</span>
          </span>
        </span>
        <Icon name="plus" size={20} className={`text-mist-600 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      {isOpen && (
        <ul id={listId} className="px-3.5 pb-2 pl-[4.25rem]">
          {group.rows.map((row) => (
            <li key={row.to} className="border-t border-line">
              <Link to={row.to} onClick={onNavigate} className="flex items-baseline justify-between gap-2 py-2.5 text-small text-deep-900">
                <span className="min-w-0">{row.label}</span>
                <span className="tabular text-xs whitespace-nowrap text-ink-faint">{rowPrice(row)}</span>
              </Link>
            </li>
          ))}
          {hasOwnPage && (
            <li className="border-t border-line">
              <Link to={group.to} onClick={onNavigate} className="flex items-center gap-1.5 py-2.5 text-small font-semibold text-mist-600">
                Xem cả nhóm {group.title}
                <Icon name="arrowRight" size={15} />
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
