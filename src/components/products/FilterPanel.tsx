import type { CSSProperties, ReactNode } from 'react'
import type { Collection } from '../../data/catalog'
import { CATEGORIES, type CategoryId, type PriceBand } from '../../data/products'

export const SORTS = [
  { id: 'noi-bat', label: 'Nổi bật', short: 'Nổi bật' },
  { id: 'gia-tang', label: 'Giá thấp đến cao', short: 'Giá tăng' },
  { id: 'gia-giam', label: 'Giá cao đến thấp', short: 'Giá giảm' },
] as const

export type SortId = (typeof SORTS)[number]['id']

/** Số chấm màu cạnh tên bộ sưu tập */
const COLLECTION_DOTS = 4

export interface FilterPanelProps {
  /** Tiền tố id: khối lọc có thể có hai bản cùng lúc (cột phải và bảng trượt) */
  idPrefix: string
  category: CategoryId | null
  categoryCount: (id: CategoryId | null) => number
  onCategory: (id: CategoryId | null) => void
  bands: readonly PriceBand[]
  band: PriceBand | undefined
  bandCount: (band: PriceBand) => number
  onBand: (band: PriceBand) => void
  /** null: loại đang xem không chia theo bộ (chăn, gối, đệm), ẩn cả nhóm */
  collections: readonly Collection[] | null
  collection: Collection | undefined
  collectionCount: (collection: Collection | undefined) => number
  onCollection: (collection: Collection | undefined) => void
  sort: SortId
  onSort: (sort: SortId) => void
  /** Có lọc gì thì hiện "Xoá lọc" */
  onClear?: () => void
  /** Ẩn nhóm "Loại sản phẩm": mục "Tất cả" dạng kệ đã có ô nhóm và nút đầu kệ (02/11/2026, tránh trùng nút) */
  hideCategory?: boolean
}

/**
 * Khối lọc dùng chung cho cột dính bên phải (máy tính từ 1280px) và bảng trượt (điện thoại).
 * Owner duyệt phác thảo 18/10/2026: docs/phac-thao-bo-loc-di-theo.html. Lọc đổi ngay, số đếm trên mỗi lựa chọn là số thẻ sẽ hiện.
 */
export function FilterPanel(props: FilterPanelProps) {
  const { idPrefix, category, categoryCount, onCategory, bands, band, bandCount, onBand } = props
  const { collections, collection, collectionCount, onCollection, sort, onSort, onClear, hideCategory } = props
  const id = (name: string) => `${idPrefix}-${name}`
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[1.35rem] leading-none text-deep-900">Bộ lọc</h2>
        {onClear && (
          <button type="button" onClick={onClear} className="-my-2 py-2 text-meta font-medium text-ink-soft underline underline-offset-4 hover:text-deep-900">
            Xoá lọc
          </button>
        )}
      </div>

      {!hideCategory && (
        <FilterGroup id={id('loai')} label="Loại sản phẩm" isFirst>
          {[{ id: null, label: 'Tất cả' } as const, ...CATEGORIES].map((c) => (
            <ChoiceRow key={c.label} isActive={category === c.id} count={categoryCount(c.id)} onPick={() => onCategory(c.id)}>
              {c.label}
            </ChoiceRow>
          ))}
        </FilterGroup>
      )}

      <FilterGroup id={id('gia')} label="Mức giá" isFirst={hideCategory}>
        <div className="flex flex-wrap gap-1.5">
          {bands.map((b) => {
            const isActive = band?.id === b.id
            const count = bandCount(b)
            return (
              <button
                key={b.id}
                type="button"
                aria-pressed={isActive}
                disabled={count === 0 && !isActive}
                onClick={() => onBand(b)}
                className={`inline-flex h-9 items-center gap-1 rounded-full px-3 text-meta whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  isActive ? 'bg-deep-800 text-ivory' : 'bg-mist-100 text-deep-900 enabled:hover:bg-mist-200'
                }`}
              >
                {b.label}
                <span className={`tabular text-label ${isActive ? 'text-ivory/75' : 'text-ink-faint'}`}>{count}</span>
              </button>
            )
          })}
        </div>
      </FilterGroup>

      {collections && (
        <FilterGroup id={id('bo')} label="Bộ sưu tập">
          <ChoiceRow isActive={!collection} count={collectionCount(undefined)} onPick={() => onCollection(undefined)}>
            Tất cả bộ
          </ChoiceRow>
          {collections.map((c) => {
            const isActive = collection?.id === c.id
            const count = collectionCount(c)
            return (
              <ChoiceRow key={c.id} isActive={isActive} count={count} disabled={count === 0 && !isActive} onPick={() => onCollection(isActive ? undefined : c)}>
                <span aria-hidden="true" className="flex shrink-0">
                  {c.patterns.slice(0, COLLECTION_DOTS).map((p) => (
                    <span key={p.code} className="-mr-1 h-3.5 w-3.5 rounded-full ring-[1.5px] ring-ivory" style={{ backgroundColor: p.swatch } as CSSProperties} />
                  ))}
                </span>
                <span className="ml-2">{c.name}</span>
              </ChoiceRow>
            )
          })}
        </FilterGroup>
      )}

      <FilterGroup id={id('sap-xep')} label="Sắp xếp">
        <div className="grid grid-cols-3 rounded-xl bg-mist-100 p-1">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={sort === s.id}
              aria-label={s.label}
              onClick={() => onSort(s.id)}
              className={`h-9 rounded-[0.6rem] text-meta transition ${
                sort === s.id ? 'bg-ivory font-medium text-deep-900 shadow-[var(--shadow-soft)]' : 'text-ink-soft hover:text-deep-900'
              }`}
            >
              {s.short}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  )
}

interface FilterGroupProps {
  id: string
  label: string
  isFirst?: boolean
  children: ReactNode
}

function FilterGroup({ id, label, isFirst, children }: FilterGroupProps) {
  return (
    <div role="group" aria-labelledby={id} className={isFirst ? 'mt-4' : 'mt-4 border-t border-line pt-4'}>
      <p id={id} className="eyebrow mb-2">
        {label}
      </p>
      {children}
    </div>
  )
}

interface ChoiceRowProps {
  isActive: boolean
  count: number
  disabled?: boolean
  onPick: () => void
  children: ReactNode
}

/** Một dòng chọn một: chấm tròn, tên, số lượng bên phải */
function ChoiceRow({ isActive, count, disabled, onPick, children }: ChoiceRowProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onPick}
      className={`-mx-2 flex min-h-10 w-[calc(100%+1rem)] items-center gap-2.5 rounded-xl px-2 text-left text-small text-deep-900 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive ? 'bg-mist-100 font-medium' : 'enabled:hover:bg-mist-100'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-[18px] w-[18px] shrink-0 rounded-full transition-shadow ${
          isActive ? 'shadow-[inset_0_0_0_5px_var(--color-deep-900)]' : 'shadow-[inset_0_0_0_1.5px_rgb(45_46_141/0.35)]'
        }`}
      />
      <span className="flex min-w-0 items-center">{children}</span>
      <span className="tabular ml-auto text-label font-normal text-ink-faint">{count}</span>
    </button>
  )
}
