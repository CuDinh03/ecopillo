import { useEffect, useId, useImperativeHandle, useRef, useState, type KeyboardEvent, type Ref } from 'react'
import { Icon } from './Icon'

/**
 * Ô chọn theo màu của web, thay <select> của trình duyệt (danh sách xổ xuống của macOS màu xám, không đổi màu được;
 * owner yêu cầu 15/10/2026). Làm theo mẫu "select-only combobox" của WAI-ARIA: con trỏ đứng ở nút, mũi tên lên/xuống
 * đổi dòng, Enter/Space chọn, Esc đóng, gõ chữ cái để nhảy tới dòng bắt đầu bằng chữ đó.
 * Nút là <button> nên <label htmlFor> vẫn đặt tên được cho ô.
 */

export interface SelectOption {
  value: string
  label: string
  /** Chữ mờ bên phải dòng, ví dụ số điểm bán */
  note?: string
}

export interface SelectHandle {
  focus: () => void
  /** Mở danh sách bằng mã (khi không lấy được vị trí thì mở sẵn danh sách tỉnh) */
  open: () => void
}

type Variant = 'pill' | 'field' | 'inline'

interface SelectProps {
  value: string
  options: readonly SelectOption[]
  onChange: (value: string) => void
  /** Chữ khi chưa chọn (value = ''); có thì thêm dòng đầu để bỏ chọn */
  placeholder?: string
  variant: Variant
  id?: string
  ariaLabel?: string
  ariaInvalid?: boolean
  ariaDescribedBy?: string
  /** Danh sách canh theo mép phải của nút khi đủ chỗ (ô sắp xếp nằm sát mép phải trên máy tính) */
  alignRight?: boolean
  className?: string
  ref?: Ref<SelectHandle>
}

const TRIGGER: Readonly<Record<Variant, string>> = {
  pill: 'h-[3.25rem] w-full rounded-full bg-ivory pr-11 pl-5 text-[0.98rem] ring-1 ring-cream-200 focus-visible:ring-2 focus-visible:ring-deep-700',
  field:
    'mt-2 w-full rounded-xl border bg-ivory py-3.5 pr-11 pl-4 text-[1rem] focus-visible:border-deep-700 focus-visible:ring-4 focus-visible:ring-mist-200',
  inline: 'h-11 rounded-lg pr-6 font-medium focus-visible:ring-2 focus-visible:ring-deep-700',
}

const CHEVRON: Readonly<Record<Variant, string>> = {
  pill: 'right-4 text-deep-700',
  field: 'right-4 mt-1 text-ink-soft',
  inline: 'right-0 text-deep-900',
}

/** Chừa bấy nhiêu px dưới nút; ít hơn thì mở danh sách lên phía trên */
const MIN_SPACE_BELOW = 280
/** Bề rộng ước lượng của danh sách kiểu gọn (sắp xếp), để quyết định canh trái hay phải */
const MIN_LIST_WIDTH = 220
/** Khoảng thời gian gõ liền các chữ để nhảy tới dòng ("ha" → Hà Nội) */
const TYPEAHEAD_MS = 600

const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()

export function Select({
  value,
  options,
  onChange,
  placeholder,
  variant,
  id,
  ariaLabel,
  ariaInvalid,
  ariaDescribedBy,
  alignRight = false,
  className = '',
  ref,
}: SelectProps) {
  const listId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typed = useRef({ text: '', at: 0 })
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  // Canh phải chỉ khi bên trái nút đủ chỗ cho danh sách; điện thoại ô nằm sát trái thì canh trái để không lòi ra ngoài
  const [toRight, setToRight] = useState(alignRight)
  const items: readonly SelectOption[] = placeholder !== undefined ? [{ value: '', label: placeholder }, ...options] : options
  const selectedIndex = Math.max(
    0,
    items.findIndex((o) => o.value === value),
  )
  const [active, setActive] = useState(selectedIndex)
  const current = items.find((o) => o.value === value)
  const isEmpty = !current || current.value === ''

  const openList = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    setDropUp(rect ? window.innerHeight - rect.bottom < MIN_SPACE_BELOW && rect.top > window.innerHeight - rect.bottom : false)
    setToRight(alignRight && (rect ? rect.right >= MIN_LIST_WIDTH : true))
    setActive(selectedIndex)
    setOpen(true)
  }

  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus({ preventScroll: true }),
    open: () => {
      buttonRef.current?.focus({ preventScroll: true })
      openList()
    },
  }))

  const choose = (index: number) => {
    const option = items[index]
    if (option && option.value !== value) onChange(option.value)
    setOpen(false)
  }

  // Bấm ra ngoài thì đóng
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!buttonRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // Giữ dòng đang trỏ trong khung danh sách (cuộn riêng khung, không cuộn cả trang)
  useEffect(() => {
    const list = listRef.current
    const row = list?.children[active] as HTMLElement | undefined
    if (!open || !list || !row) return
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop
    else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight
    }
  }, [open, active])

  const typeAhead = (key: string) => {
    const now = Date.now()
    const text = (now - typed.current.at > TYPEAHEAD_MS ? '' : typed.current.text) + fold(key)
    typed.current = { text, at: now }
    const from = open ? active : selectedIndex
    // Gõ thêm chữ thì xét cả dòng đang trỏ ("q" → Quảng Ngãi, "qua" vẫn ở Quảng Ngãi); gõ chữ mới thì sang dòng kế
    const start = text.length > 1 ? from : from + 1
    const order = [...items.keys()].map((i) => (start + i) % items.length)
    const hit = order.find((i) => fold(items[i].label).startsWith(text)) ?? order.find((i) => fold(items[i].label).startsWith(text[0]))
    if (hit === undefined) return
    if (open) setActive(hit)
    else onChange(items[hit].value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = items.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        typeAhead(e.key)
      }
      return
    }
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      PageDown: () => setActive((i) => Math.min(last, i + 8)),
      PageUp: () => setActive((i) => Math.max(0, i - 8)),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: () => setOpen(false),
    }
    if (moves[e.key]) {
      e.preventDefault()
      moves[e.key]()
    } else if (e.key === 'Tab') {
      setOpen(false)
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      typeAhead(e.key)
    }
  }

  return (
    <div className={`relative ${variant === 'inline' ? 'inline-block' : 'block'} ${className}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`relative block cursor-pointer truncate text-left transition outline-none ${TRIGGER[variant]} ${
          isEmpty && variant !== 'inline' ? 'text-ink-faint' : 'text-deep-900'
        } ${variant === 'field' ? (ariaInvalid ? 'border-alert ring-4 ring-alert-soft' : 'border-cream-300') : ''}`}
      >
        {current?.label ?? placeholder ?? ''}
        <Icon
          name="chevronDown"
          size={variant === 'inline' ? 15 : 18}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 transition-transform duration-200 ${CHEVRON[variant]} ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          data-lenis-prevent
          className={`absolute z-40 max-h-72 min-w-full overflow-y-auto overscroll-contain rounded-2xl bg-ivory p-1.5 shadow-[var(--shadow-lift)] ring-1 ring-cream-200 ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${toRight ? 'right-0' : 'left-0'} ${variant === 'inline' ? 'w-max' : ''}`}
        >
          {items.map((o, i) => {
            const selected = o.value === value
            return (
              <li
                key={o.value || '__trong'}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={selected}
                // Giữ con trỏ ở nút khi bấm chuột vào dòng
                onMouseDown={(e) => e.preventDefault()}
                onMouseMove={() => active !== i && setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[0.92rem] whitespace-nowrap ${
                  i === active ? 'bg-mist-100' : ''
                } ${selected ? 'font-medium text-deep-900' : o.value === '' ? 'text-ink-soft' : 'text-deep-900'}`}
              >
                <Icon name="check" size={15} className={`shrink-0 text-deep-700 ${selected ? '' : 'invisible'}`} />
                <span className="flex-1">{o.label}</span>
                {o.note && <span className="tabular text-[0.78rem] text-ink-faint">{o.note}</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
