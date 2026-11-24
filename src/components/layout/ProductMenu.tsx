import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { chen } from '../../data/pageText/define'
import { PRODUCT_MENU, PRODUCT_MENU_ALL, PRODUCT_MENU_GIFTS, PRODUCT_MENU_LABELS, type MenuGroup, type MenuRow } from '../../data/productMenu'
import { formatVND } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { Container } from '../ui/primitives'
import { Placeholder } from '../ui/Placeholder'
import { MenuLink } from './MenuLink'

/**
 * Menu "Sản phẩm" xổ ra (góp ý 04/11/2026 mục 3, 13; owner chọn phương án B ngày 05/11/2026).
 * Máy tính: bấm "Sản phẩm" mở ô trắng rộng bằng khung trang, năm cột có ảnh và giá, phần trang phía sau tối đi.
 * Điện thoại: trong menu phủ màn hình, "Sản phẩm" mở ra năm thẻ nhóm, bấm thẻ thì hiện các dòng có giá.
 * Dữ liệu: src/data/productMenu.ts. Mẫu: docs/de-xuat-menu-san-pham-04-11.html.
 */

const PANEL_ID = 'product-menu'

/** "từ 1.200.000đ" (chữ "từ" Ecopillo sửa ở Nội dung web) */
const fromPrice = (min: number): string => `${PRODUCT_MENU_LABELS.from} ${formatVND(min)}`

/** Giá trên một dòng: chữ sẵn (giá liên hệ…), "từ …", hoặc số cố định */
const rowPrice = (row: MenuRow): string => {
  if (row.priceLabel) return row.priceLabel
  return row.isFromPrice ? fromPrice(row.min) : formatVND(row.min)
}

interface DesktopProductMenuProps {
  label: string
  /** Lớp của mục trên thanh (mục "gom vào nút Thêm" chỉ hiện từ 1280px) */
  className?: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  /** Lớp chữ của mục menu (NAV_LINK, NAV_ACTIVE trong Header.tsx) */
  buttonClass: string
}

export function DesktopProductMenu({ label, className, isOpen, onOpenChange, buttonClass }: DesktopProductMenuProps) {
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
    <li ref={ref} className={className}>
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
                  <MenuLink
                    href={PRODUCT_MENU_ALL.to}
                    onClick={close}
                    className="inline-flex items-center gap-1.5 font-semibold text-mist-600 underline-offset-4 hover:underline"
                  >
                    {PRODUCT_MENU_ALL.label}
                    <Icon name="arrowRight" size={16} />
                  </MenuLink>
                  <p className="text-ink-soft">
                    {PRODUCT_MENU_GIFTS.lead}{' '}
                    <MenuLink href={PRODUCT_MENU_GIFTS.to} onClick={close} className="font-semibold text-mist-600 underline-offset-4 hover:underline">
                      {PRODUCT_MENU_GIFTS.label}
                    </MenuLink>
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

/** Một dòng trong cột: tên + giá (hoặc priceLabel) */
function DesktopRow({ row, onNavigate }: { row: MenuRow; onNavigate: () => void }) {
  return (
    <li>
      <MenuLink
        href={row.to}
        onClick={onNavigate}
        className="-mx-2 flex flex-wrap items-baseline justify-between gap-x-2 rounded-lg px-2 py-1.5 text-small text-deep-900 transition-colors hover:bg-mist-100"
      >
        <span>{row.label}</span>
        <span className="tabular text-xs whitespace-nowrap text-ink-faint">{rowPrice(row)}</span>
      </MenuLink>
    </li>
  )
}

function DesktopGroup({ group, onNavigate }: { group: MenuGroup; onNavigate: () => void }) {
  return (
    <>
      <MenuLink href={group.to} onClick={onNavigate} tabIndex={-1} aria-hidden className="group block overflow-hidden rounded-2xl">
        <Placeholder
          image={{ ...group.image, alt: '' }}
          note={group.title}
          tone="mist"
          sizes="(min-width: 1240px) 220px, 18vw"
          className="aspect-[16/10] w-full transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
        />
      </MenuLink>
      <h3 className="mt-3 mb-1.5 font-display text-[1.06rem] leading-tight font-semibold text-deep-900">
        <MenuLink href={group.to} onClick={onNavigate} className="hover:text-mist-600">
          {group.title}
        </MenuLink>
      </h3>
      {group.sections?.length ? (
        <div className="grid gap-3">
          {group.sections.map((section) => (
            <div key={section.title}>
              <p className="text-[0.68rem] font-semibold tracking-[0.08em] text-mist-600 uppercase">{section.title}</p>
              {section.note && <p className="mt-0.5 text-[0.7rem] leading-snug text-ink-faint">{section.note}</p>}
              <ul className="mt-1">
                {section.rows.map((row) => (
                  <DesktopRow key={`${section.title}-${row.to}-${row.label}`} row={row} onNavigate={onNavigate} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul>
          {group.rows.map((row) => (
            <DesktopRow key={`${row.to}-${row.label}`} row={row} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
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
  // Thẻ Đệm mở sẵn (khách: "phần đệm tìm mãi mới thấy").
  // Mỗi nhóm mở, đóng riêng: trước đây mở nhóm này thì nhóm trên tự đóng, danh sách co lại và dòng vừa bấm trôi
  // lên khỏi màn hình (chị Phương 18/11/2026: "nó nhảy lên trên bắt m lướt xuống")
  const [openGroups, setOpenGroups] = useState<ReadonlySet<string>>(() => new Set(PRODUCT_MENU[0] ? [PRODUCT_MENU[0].id] : []))
  const toggleGroup = (id: string) =>
    setOpenGroups((open) => {
      const next = new Set(open)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

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
              isOpen={openGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
              onNavigate={onNavigate}
            />
          ))}
          <MenuLink
            href={PRODUCT_MENU_ALL.to}
            onClick={onNavigate}
            className="inline-flex items-center justify-center gap-1.5 py-3 text-small font-semibold text-mist-600"
          >
            {PRODUCT_MENU_ALL.label}
            <Icon name="arrowRight" size={16} />
          </MenuLink>
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

/** Khoảng chừa ở mép khung menu khi tự cuộn cho thấy nhóm vừa mở */
const REVEAL_GAP = 12

/**
 * Nhóm vừa mở mà phần dưới khuất đáy khung menu: cuộn khung lên vừa đủ thấy hết, nhưng không đẩy dòng tiêu đề nhóm
 * ra khỏi khung (nhóm dài hơn khung thì tiêu đề nằm sát mép trên).
 */
function revealInMenu(card: HTMLElement) {
  const box = card.closest<HTMLElement>('#mobile-menu')
  if (!box) return
  const cardRect = card.getBoundingClientRect()
  const boxRect = box.getBoundingClientRect()
  const hiddenBelow = cardRect.bottom - boxRect.bottom + REVEAL_GAP
  const roomAbove = cardRect.top - boxRect.top - REVEAL_GAP
  const delta = Math.min(hiddenBelow, roomAbove)
  if (delta <= 0) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  box.scrollBy({ top: delta, behavior: reduce ? 'auto' : 'smooth' })
}

function MobileGroup({ group, isOpen, onToggle, onNavigate }: MobileGroupProps) {
  const listId = `mobile-product-${group.id}`
  const cardRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(isOpen)
  useEffect(() => {
    // Chỉ cuộn khi khách vừa bấm mở, không cuộn với nhóm mở sẵn lúc hiện menu
    if (isOpen && !wasOpen.current && cardRef.current) revealInMenu(cardRef.current)
    wasOpen.current = isOpen
  }, [isOpen])
  const flatRows = group.sections?.length ? group.sections.flatMap((s) => s.rows) : group.rows
  // Nhóm có trang riêng mà chưa dòng nào trỏ tới: thêm link xem cả nhóm
  const hasOwnPage = !flatRows.some((row) => row.to === group.to)
  const groupPrice =
    group.min > 0 ? fromPrice(group.min) : flatRows.find((r) => r.priceLabel)?.priceLabel ?? ''
  const headClass = 'grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 py-2 pr-3 pl-2 text-left'
  const head = (
    <>
      <Placeholder image={{ ...group.image, alt: '' }} note={group.title} tone="mist" sizes="48px" className="h-12 w-12 rounded-xl" />
      <span className="min-w-0">
        <span className="block font-semibold text-deep-900">{group.title}</span>
        {groupPrice && (
          <span className="block text-xs text-ink-faint">
            <span className="whitespace-nowrap">{groupPrice}</span>
          </span>
        )}
      </span>
    </>
  )

  /*
   * Nhóm chỉ có một lựa chọn (Sản phẩm khách sạn): bấm vào sang trang luôn, không mở thêm một dòng con.
   * Chị Phương (Zalo 17/11/2026): "phải bấm thêm 1 lần nữa, nhiều khi khách tưởng k có gì".
   */
  if (flatRows.length === 1) {
    return (
      <MenuLink href={flatRows[0].to} onClick={onNavigate} className={`rounded-2xl bg-ivory shadow-[var(--shadow-soft)] ${headClass}`}>
        {head}
        <Icon name="arrowRight" size={20} className="text-mist-600" />
      </MenuLink>
    )
  }

  return (
    <div ref={cardRef} className="rounded-2xl bg-ivory shadow-[var(--shadow-soft)]">
      <button type="button" aria-expanded={isOpen} aria-controls={listId} onClick={onToggle} className={headClass}>
        {head}
        <Icon name="plus" size={20} className={`text-mist-600 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      {isOpen && (
        <div id={listId} className="px-3.5 pb-2 pl-[4.25rem]">
          {group.sections?.length ? (
            group.sections.map((section) => (
              <div key={section.title} className="border-t border-line pt-2 first:border-t-0 first:pt-0">
                <p className="pt-1 text-[0.68rem] font-semibold tracking-[0.08em] text-mist-600 uppercase">{section.title}</p>
                {section.note && <p className="mt-0.5 text-[0.7rem] leading-snug text-ink-faint">{section.note}</p>}
                <ul>
                  {section.rows.map((row) => (
                    <li key={`${section.title}-${row.to}-${row.label}`} className="border-t border-line first:border-t-0">
                      <MenuLink href={row.to} onClick={onNavigate} className="flex items-baseline justify-between gap-2 py-2.5 text-small text-deep-900">
                        <span className="min-w-0">{row.label}</span>
                        <span className="tabular text-xs whitespace-nowrap text-ink-faint">{rowPrice(row)}</span>
                      </MenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <ul>
              {group.rows.map((row) => (
                <li key={`${row.to}-${row.label}`} className="border-t border-line">
                  <MenuLink href={row.to} onClick={onNavigate} className="flex items-baseline justify-between gap-2 py-2.5 text-small text-deep-900">
                    <span className="min-w-0">{row.label}</span>
                    <span className="tabular text-xs whitespace-nowrap text-ink-faint">{rowPrice(row)}</span>
                  </MenuLink>
                </li>
              ))}
            </ul>
          )}
          {hasOwnPage && (
            <div className="border-t border-line">
              <MenuLink href={group.to} onClick={onNavigate} className="flex items-center gap-1.5 py-2.5 text-small font-semibold text-mist-600">
                {chen(PRODUCT_MENU_LABELS.seeGroup, { nhom: group.title })}
                <Icon name="arrowRight" size={15} />
              </MenuLink>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
