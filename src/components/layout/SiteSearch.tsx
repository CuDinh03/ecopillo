import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import type { SearchEntry, SearchKind } from '../../data/searchIndex'
import { highlightRanges, matchScore, parseQuery, type SearchQuery } from '../../lib/searchText'
import { Icon, ZaloMark } from '../ui/Icon'

/**
 * Thanh tìm kiếm (anh Quang Zalo 19/11/2026: "Thanh tìm kiếm nội bộ trong web. đặt ở menu đầu trang";
 * owner chọn phương án B cùng ngày, docs/de-xuat-tim-kiem-19-11.html).
 * Điện thoại: lớp phủ cả màn hình, ô tìm trên cùng. Máy tính: bảng trắng thả xuống dưới thanh đầu trang, trang phía sau tối đi.
 * Tìm trên máy khách (src/lib/searchText.ts), dữ liệu src/data/searchIndex.ts chỉ nạp khi mở.
 */

interface SiteSearchProps {
  onClose: () => void
  /** Mép dưới thanh đầu trang (px): bảng máy tính bắt đầu từ đây */
  top: number
}

interface GroupSpec {
  kind: SearchKind
  label: string
  limit: number
}

const GROUPS: readonly GroupSpec[] = [
  { kind: 'san-pham', label: 'Sản phẩm', limit: 6 },
  { kind: 'trang', label: 'Danh mục và trang', limit: 5 },
  { kind: 'bai-viet', label: 'Bài viết', limit: 4 },
]

type Results = Readonly<Record<SearchKind, readonly SearchEntry[]>>

const search = (index: readonly SearchEntry[], query: SearchQuery): Results => {
  const ranked = index
    .map((entry) => ({ entry, score: matchScore(entry, query) - (entry.penalty ?? 0) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.entry)
  return {
    'san-pham': ranked.filter((e) => e.kind === 'san-pham'),
    trang: ranked.filter((e) => e.kind === 'trang'),
    'bai-viet': ranked.filter((e) => e.kind === 'bai-viet'),
  }
}

/** Tên có tô đậm phần khớp chữ khách gõ */
function Highlighted({ title, query }: { title: string; query: SearchQuery }) {
  const chars = Array.from(title)
  const ranges = highlightRanges(title, query)
  if (!ranges.length) return <>{title}</>
  const parts = ranges.flatMap(([start, end], i) => {
    const before = chars.slice(i === 0 ? 0 : ranges[i - 1][1], start).join('')
    return [before, <mark key={start} className="bg-transparent font-semibold text-mist-600">{chars.slice(start, end).join('')}</mark>]
  })
  return (
    <>
      {parts}
      {chars.slice(ranges[ranges.length - 1][1]).join('')}
    </>
  )
}

function Thumb({ entry }: { entry: SearchEntry }) {
  const size = entry.kind === 'bai-viet' ? 'h-12 w-[4.5rem]' : 'h-14 w-14'
  if (!entry.image)
    return (
      <span aria-hidden className={`${size} grid shrink-0 place-items-center rounded-xl bg-mist-100 text-deep-900/50`}>
        <Icon name={entry.kind === 'san-pham' ? 'bed' : 'book'} size={20} />
      </span>
    )
  return (
    <img
      src={entry.image.src}
      srcSet={entry.image.srcSet || undefined}
      sizes="72px"
      alt=""
      loading="lazy"
      decoding="async"
      width={72}
      height={56}
      className={`${size} shrink-0 rounded-xl bg-mist-100 object-cover`}
    />
  )
}

export function SiteSearch({ onClose, top }: SiteSearchProps) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<readonly SearchEntry[] | null>(null)
  const [suggestions, setSuggestions] = useState<readonly string[]>([])
  const [hasFailed, setHasFailed] = useState(false)
  /** Dòng đang chọn bằng mũi tên; -1 = chưa chọn, Enter mở dòng đầu */
  const [activeIndex, setActiveIndex] = useState(-1)
  const [expanded, setExpanded] = useState<ReadonlySet<SearchKind>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const listId = useId()

  useEffect(() => {
    let isCurrent = true
    import('../../data/searchIndex')
      .then((m) => {
        if (!isCurrent) return
        setIndex(m.SEARCH_INDEX)
        setSuggestions(m.SEARCH_SUGGESTIONS)
      })
      .catch(() => isCurrent && setHasFailed(true))
    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  const parsed = useMemo(() => parseQuery(query), [query])
  const results = useMemo(() => (index && parsed ? search(index, parsed) : null), [index, parsed])

  /** Các dòng đang hiện của từng nhóm */
  const shownOf = (group: GroupSpec): readonly SearchEntry[] => {
    const all = results?.[group.kind] ?? []
    return expanded.has(group.kind) ? all : all.slice(0, group.limit)
  }
  /** Mọi dòng đang hiện, theo thứ tự trên màn hình: để mũi tên lên xuống, Enter */
  const visible = GROUPS.flatMap(shownOf)
  /** Số thứ tự dòng đầu của từng nhóm trong `visible` */
  const offsets = GROUPS.map((_, i) => GROUPS.slice(0, i).reduce((n, g) => n + shownOf(g).length, 0))

  const changeQuery = (value: string) => {
    setQuery(value)
    setActiveIndex(-1)
    setExpanded(new Set())
  }

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!visible.length) return
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((i) => (i < 0 ? (step > 0 ? 0 : visible.length - 1) : (i + step + visible.length) % visible.length))
    } else if (e.key === 'Enter') {
      const entry = visible[Math.max(0, activeIndex)]
      if (!entry) return
      e.preventDefault()
      navigate(entry.to)
      onClose()
    }
  }

  const total = results ? GROUPS.reduce((n, g) => n + results[g.kind].length, 0) : 0
  const activeEntry = visible[activeIndex]
  const optionId = (i: number) => `${listId}-${i}`

  const renderGroup = (group: GroupSpec, offset: number) => {
    const all = results?.[group.kind] ?? []
    if (!all.length || !parsed) return null
    const shown = shownOf(group)
    const isProducts = group.kind === 'san-pham'
    return (
      <div key={group.kind} role="group" aria-labelledby={`${listId}-${group.kind}`} className="mt-5 first:mt-0">
        <p id={`${listId}-${group.kind}`} className="mb-1.5 flex justify-between px-2 text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">
          {group.label}
          <span className="tabular">{all.length}</span>
        </p>
        <div className={isProducts ? 'lg:grid lg:grid-cols-2 lg:gap-x-2' : ''}>
          {shown.map((entry, i) => {
            const at = offset + i
            const isActive = at === activeIndex
            return (
              <Link
                key={`${entry.kind}${entry.to}${entry.title}`}
                id={optionId(at)}
                role="option"
                aria-selected={isActive}
                to={entry.to}
                onClick={onClose}
                onPointerMove={() => setActiveIndex(at)}
                className={`flex items-center gap-3 rounded-2xl px-2 py-1.5 text-deep-900 transition-colors ${isActive ? 'bg-mist-100' : 'hover:bg-mist-100'}`}
              >
                {entry.kind !== 'trang' && <Thumb entry={entry} />}
                <span className="min-w-0">
                  <span className={`block leading-snug font-medium ${entry.kind === 'bai-viet' ? 'line-clamp-2 text-small' : ''}`}>
                    <Highlighted title={entry.title} query={parsed} />
                  </span>
                  {entry.meta && <span className="tabular mt-0.5 block text-xs text-ink-soft">{entry.meta}</span>}
                </span>
              </Link>
            )
          })}
        </div>
        {all.length > shown.length && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => new Set([...prev, group.kind]))}
            className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-small font-semibold text-mist-600 hover:underline"
          >
            Hiện thêm {all.length - shown.length} {group.label.toLowerCase()}
            <Icon name="chevronDown" size={15} />
          </button>
        )}
      </div>
    )
  }

  const body = () => {
    if (hasFailed)
      return (
        <p className="px-2 py-4 text-ink-soft">
          Chưa tải được ô tìm. Quý khách thử lại, hoặc gọi{' '}
          <a href={CONTACT.hotlineTel} className="font-semibold text-deep-900 underline">
            {CONTACT.hotlineDisplay}
          </a>
          .
        </p>
      )
    if (!index) return <p className="px-2 py-4 text-ink-soft">Đang tải…</p>
    if (!parsed)
      return (
        <div>
          <p className="mb-2 px-2 text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">Khách hay tìm</p>
          <div className="flex flex-wrap gap-2 px-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  changeQuery(s)
                  inputRef.current?.focus()
                }}
                className="rounded-full bg-ivory px-3.5 py-1.5 text-small text-deep-900 shadow-[var(--shadow-soft)] transition-colors hover:bg-mist-100 lg:bg-mist-100 lg:shadow-none lg:hover:bg-page"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )
    if (!total)
      return (
        <div className="px-2 py-4">
          <p className="text-ink-soft">
            Chưa thấy <span className="font-semibold text-deep-900">“{query.trim()}”</span> trên web. Quý khách gọi hoặc nhắn Zalo, nhân viên
            Ecopillo tư vấn ngay.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={CONTACT.hotlineTel} className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-small font-medium text-ivory">
              <Icon name="phone" size={16} />
              <span className="tabular">{CONTACT.hotlineDisplay}</span>
            </a>
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-small font-medium text-deep-900 shadow-[var(--shadow-soft)]"
            >
              <ZaloMark /> Nhắn Zalo
            </a>
          </div>
        </div>
      )
    return (
      <div id={`${listId}-ds`} role="listbox" aria-label="Kết quả tìm" className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div>{renderGroup(GROUPS[0], offsets[0]) ?? <p className="px-2 py-2 text-small text-ink-soft lg:py-0">Không có sản phẩm khớp.</p>}</div>
        <div className="mt-5 lg:mt-0">
          {renderGroup(GROUPS[1], offsets[1])}
          {renderGroup(GROUPS[2], offsets[2])}
        </div>
      </div>
    )
  }

  return createPortal(
    <>
      {/* Lớp tối phía sau (máy tính). Dưới thanh đầu trang (z-40) như ô xổ Sản phẩm */}
      <div aria-hidden className="fade-in fixed inset-0 z-[35] hidden bg-deep-900/25 lg:block" onPointerDown={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tìm trên web"
        style={{ '--tim-top': `${Math.round(top)}px`, animationDuration: '200ms' } as CSSProperties}
        className="fade-in fixed inset-0 z-50 flex flex-col bg-page lg:pointer-events-none lg:top-[var(--tim-top)] lg:bottom-auto lg:block lg:bg-transparent"
      >
        <div className="flex min-h-0 flex-1 flex-col lg:mx-auto lg:block lg:w-full lg:max-w-[1240px] lg:px-10 lg:pt-2">
          <div className="flex min-h-0 flex-1 flex-col lg:pointer-events-auto lg:max-h-[calc(100dvh-var(--tim-top)-1.5rem)] lg:rounded-3xl lg:bg-ivory lg:shadow-[var(--shadow-lift)]">
            <div className="flex items-center gap-2 bg-page/95 px-4 py-2.5 shadow-[0_1px_0_rgb(45_46_141/0.1)] lg:bg-transparent lg:px-6 lg:pt-5 lg:pb-3 lg:shadow-none">
              <label className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-full border-[1.5px] border-transparent bg-ivory pr-1.5 pl-4 shadow-[var(--shadow-soft)] focus-within:border-brand-blue lg:bg-mist-100 lg:shadow-none">
                <Icon name="search" size={19} className="shrink-0 text-deep-900" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => changeQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  enterKeyHint="search"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Quý khách muốn tìm sản phẩm gì?"
                  aria-label="Tìm trên web"
                  role="combobox"
                  aria-expanded={visible.length > 0}
                  aria-controls={`${listId}-ds`}
                  aria-activedescendant={activeEntry ? optionId(activeIndex) : undefined}
                  className="min-w-0 flex-1 bg-transparent text-base text-deep-900 outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Xoá chữ đã gõ"
                    onClick={() => {
                      changeQuery('')
                      inputRef.current?.focus()
                    }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-deep-900 hover:bg-mist-100 lg:hover:bg-ivory"
                  >
                    <Icon name="close" size={17} />
                  </button>
                )}
              </label>
              <button
                type="button"
                aria-label="Đóng ô tìm"
                onClick={onClose}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-deep-900 transition-colors hover:bg-mist-100"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] lg:px-4 lg:pt-1 lg:pb-5">
              {body()}
              <p className="mt-4 hidden px-2 text-xs text-ink-faint lg:block">
                Mũi tên lên xuống để chọn, Enter để mở, Esc để đóng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
