import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

interface NavMoreItem {
  href: string
  label: string
}

interface NavMoreMenuProps {
  items: readonly NavMoreItem[]
  activeHref: string | null
  /** Lớp chữ của mục menu (NAV_LINK, NAV_ACTIVE trong Header.tsx) */
  buttonClass: string
}

const PANEL_ID = 'nav-more-menu'

/**
 * Máy tính nhỏ (1024–1279px): thanh không đủ chỗ cho cả tám mục (đo 19/11/2026), nên Quà tặng và sự kiện, Tin tức, Hỏi đáp
 * gom vào nút "Thêm". Từ 1280px ba mục này nằm thẳng trên thanh và nút này ẩn (Header.tsx).
 */
export function NavMoreMenu({ items, activeHref, buttonClass }: NavMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const isOutside = (target: EventTarget | null) => !ref.current?.contains(target as Node)
    const onPointer = (e: PointerEvent) => isOutside(e.target) && setIsOpen(false)
    const onFocus = (e: FocusEvent) => isOutside(e.target) && setIsOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setIsOpen(false)
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
  }, [isOpen])

  const hasActive = items.some((item) => item.href === activeHref)

  return (
    <li ref={ref} className="relative xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        onClick={() => setIsOpen((open) => !open)}
        className={`${buttonClass} gap-1 ${isOpen || hasActive ? 'bg-mist-100' : ''}`}
      >
        Thêm
        <Icon name="chevronDown" size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul
          id={PANEL_ID}
          className="pop-in absolute top-full right-0 z-10 mt-2 w-60 origin-top-right rounded-3xl bg-ivory p-2 shadow-[var(--shadow-lift)]"
        >
          {items.map((item) => {
            const isActive = item.href === activeHref
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-small font-medium text-deep-900 transition-colors hover:bg-mist-100 ${
                    isActive ? 'bg-mist-100' : ''
                  }`}
                >
                  {item.label}
                  {isActive && <span className="h-2 w-2 rounded-full bg-mist-600" />}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
