import { useState } from 'react'
import { CONTACT } from '../../data/brand'
import {
  COLLECTIONS,
  collectionRange,
  GIFTS,
  imageOfPattern,
  isPatternSoldOut,
  SIZES,
  isSizeSoldOut,
  type Collection,
} from '../../data/catalog'
import { formatMillions } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'

interface StepPatternProps {
  collectionId: string | null
  patternCode: string | null
  onSelectCollection: (id: string) => void
  onSelectPattern: (code: string) => void
}

/** Bộ nhiều mẫu (Eco Rosa) chỉ hiện trước một phần cho gọn trên điện thoại */
const INITIAL_PATTERNS = 12

export function StepPattern({ collectionId, patternCode, onSelectCollection, onSelectPattern }: StepPatternProps) {
  const collection = COLLECTIONS.find((c) => c.id === collectionId)
  const [expandedFor, setExpandedFor] = useState<string | null>(null)
  const selectedIndex = collection?.patterns.findIndex((p) => p.code === patternCode) ?? -1
  const showAll = expandedFor === collectionId || selectedIndex >= INITIAL_PATTERNS
  const patterns = collection ? (showAll ? collection.patterns : collection.patterns.slice(0, INITIAL_PATTERNS)) : []
  const hiddenCount = (collection?.patterns.length ?? 0) - patterns.length

  return (
    <div className="space-y-12">
      <fieldset id="chon-bo" className="scroll-mt-28">
        <legend className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">Chọn bộ sưu tập</legend>
        <p className="mt-1 text-sm text-ink-soft">Giá hiển thị từ kích thước nhỏ nhất (1m6).</p>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4">
          {COLLECTIONS.map((c) => (
            <CollectionOption
              key={c.id}
              collection={c}
              checked={c.id === collectionId}
              onSelect={() => onSelectCollection(c.id)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset id="chon-mau" className="scroll-mt-28">
        <legend className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">
          Chọn mẫu{collection ? <span className="text-mist-600 italic"> · {collection.name}</span> : null}
        </legend>

        {!collection ? (
          <p className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-line p-6 text-sm text-ink-soft">
            <Icon name="arrowLeft" size={18} className="rotate-90 text-mist-600" />
            Chọn một bộ sưu tập ở trên để xem các mẫu.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-ink-soft">{collection.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {patterns.map((p) => {
                const soldOut = isPatternSoldOut(p)
                const someSoldOut = !soldOut && SIZES.some((s) => isSizeSoldOut(p, s.id))
                const checked = p.code === patternCode
                return (
                  <label
                    key={p.code}
                    className={`group relative flex flex-col rounded-[1.25rem] bg-ivory p-2 ring-1 transition duration-300 ${
                      soldOut
                        ? 'cursor-not-allowed opacity-60 ring-cream-200'
                        : checked
                          ? 'cursor-pointer shadow-[var(--shadow-soft)] ring-2 ring-deep-800'
                          : 'cursor-pointer ring-cream-200 hover:ring-mist-400'
                    } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mist-600`}
                  >
                    <input
                      type="radio"
                      name="pattern"
                      value={p.code}
                      checked={checked}
                      disabled={soldOut}
                      onChange={() => onSelectPattern(p.code)}
                      className="sr-only"
                    />
                    <div className="relative aspect-[4/3] rounded-[0.9rem]">
                      <Placeholder
                        compact
                        className="h-full w-full"
                        tint={p.swatch}
                        note={`Ảnh mẫu ${p.code}`}
                        image={imageOfPattern(collection, p)}
                        sizes="(min-width: 1280px) 190px, (min-width: 640px) 30vw, 45vw"
                      />
                      {checked && (
                        <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-deep-800 text-ivory">
                          <Icon name="check" size={15} strokeWidth={2.2} />
                        </span>
                      )}
                      {p.isNew && !soldOut && (
                        <span className="absolute top-2 left-2 rounded-full bg-ivory px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-deep-800 uppercase">
                          Mới
                        </span>
                      )}
                      {soldOut && (
                        <span className="absolute inset-x-2 top-2 rounded-full bg-deep-900/85 px-2 py-1 text-center text-[0.68rem] font-medium text-ivory">
                          Tạm hết hàng
                        </span>
                      )}
                    </div>
                    <span className="px-1.5 pt-3 pb-1.5">
                      <span className="block font-medium tracking-wide text-deep-900">{p.code}</span>
                      <span className="block text-[0.8rem] leading-snug text-ink-soft">{p.colorName}</span>
                      {someSoldOut && (
                        <span className="mt-1 block text-[0.7rem] text-alert">Một số kích thước tạm hết</span>
                      )}
                    </span>
                  </label>
                )
              })}
            </div>
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setExpandedFor(collection.id)}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-deep-800/20 px-5 text-sm font-medium text-deep-900 transition hover:border-deep-800/50"
              >
                Xem thêm {hiddenCount} mẫu
                <Icon name="chevronDown" size={16} />
              </button>
            )}
            <p className="mt-5 text-sm text-ink-soft">
              Muốn xem ảnh thật từng mẫu hoặc mẫu khác tại hệ thống phân phối Ecopillo? Nhắn Zalo{' '}
              <a
                href={CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-deep-900 underline underline-offset-4"
              >
                {CONTACT.hotlineDisplay}
              </a>
              .
            </p>
          </>
        )}
      </fieldset>
    </div>
  )
}

interface CollectionOptionProps {
  collection: Collection
  checked: boolean
  onSelect: () => void
}

function CollectionOption({ collection, checked, onSelect }: CollectionOptionProps) {
  const { min } = collectionRange(collection)
  const gift = GIFTS[collection.gift]
  return (
    <label
      className={`relative flex cursor-pointer flex-col rounded-2xl p-4 transition duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mist-600 ${
        checked ? 'bg-deep-800 text-ivory shadow-[var(--shadow-soft)]' : 'bg-cream-50 shadow-[var(--shadow-soft)] hover:ring-mist-400'
      }`}
    >
      <input type="radio" name="collection" checked={checked} onChange={onSelect} className="sr-only" />
      <span className={`text-[0.65rem] tracking-[0.12em] uppercase ${checked ? 'text-mist-300' : 'text-mist-600'}`}>
        {collection.kindLabel}
      </span>
      <span className={`font-display mt-1 text-[1.2rem] leading-tight ${checked ? 'text-ivory' : 'text-deep-900'}`}>
        {collection.name}
      </span>
      <span className={`tabular mt-2 text-[0.82rem] ${checked ? 'text-mist-100' : 'text-ink-soft'}`}>
        từ {formatMillions(min)}
      </span>
      {gift.perSet > 0 && (
        <span className={`mt-1.5 flex items-center gap-1 text-[0.72rem] ${checked ? 'text-brass-100' : 'text-brass-600'}`}>
          <Icon name="gift" size={12} /> Có quà
        </span>
      )}
    </label>
  )
}
