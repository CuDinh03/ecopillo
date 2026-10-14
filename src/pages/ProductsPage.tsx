import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ColorwayCard } from '../components/products/ColorwayCard'
import { ProductCard } from '../components/products/ProductCard'
import { Icon } from '../components/ui/Icon'
import { buttonClass, Container, FillIn } from '../components/ui/primitives'
import { BEDDING_SETS, collectionRange, type Collection } from '../data/catalog'
import { CATEGORIES, LEGACY_CATEGORY, PRODUCTS, type CategoryId } from '../data/products'
import { COLORWAYS, STORIES_APPROVED, toneById, TONES, type Colorway, type Tone } from '../data/stories'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

const SORTS = [
  { id: 'noi-bat', label: 'Nổi bật' },
  { id: 'gia-tang', label: 'Giá thấp đến cao' },
  { id: 'gia-giam', label: 'Giá cao đến thấp' },
] as const

type SortId = (typeof SORTS)[number]['id']

/** Hai cách tìm bộ chăn ga: theo gam màu hoặc theo bộ sưu tập (thanh lọc mẫu 3, owner chọn 14/10/2026) */
type BrowseMode = 'gam' | 'bo'

const CATEGORY_PARAM = 'danh-muc'
const COLLECTION_PARAM = 'bo-suu-tap'
const SORT_PARAM = 'sap-xep'
const TONE_PARAM = 'gam'
/** Số phối màu hiện mỗi lần khi lọc theo gam hoặc bộ; bấm "Xem thêm" để hiện tiếp */
const COLORWAY_PAGE = 12
/** Số chấm màu nhỏ trên ô bộ sưu tập */
const TILE_DOTS = 5

const isCategory = (v: string | null): v is CategoryId => CATEGORIES.some((c) => c.id === v)

const bySort = <T,>(items: readonly T[], sort: SortId, priceOf: (item: T) => number): readonly T[] => {
  if (sort === 'noi-bat') return items
  const dir = sort === 'gia-tang' ? 1 : -1
  return [...items].sort((a, b) => (priceOf(a) - priceOf(b)) * dir)
}

export function ProductsPage() {
  usePageMeta('Sản phẩm', 'Bộ chăn ga, chăn, gối, đệm Ecopillo: vải Lyocell mềm mát, giá rõ theo từng kích thước, đặt online thanh toán khi nhận.')
  const [params, setParams] = useSearchParams()
  const rawCategory = params.get(CATEGORY_PARAM)
  const category = isCategory(rawCategory) ? rawCategory : rawCategory ? (LEGACY_CATEGORY[rawCategory] ?? null) : null
  const sort: SortId = SORTS.some((s) => s.id === params.get(SORT_PARAM)) ? (params.get(SORT_PARAM) as SortId) : 'noi-bat'

  // Chỉ bộ chăn ga và chăn hè mới có phối màu; chăn hè là một bộ duy nhất nên không có cách tìm "theo bộ sưu tập"
  const hasColorways = category === null || category === 'bo-chan-ga' || category === 'chan'
  const canBrowseByCollection = hasColorways && category !== 'chan'
  const tone = hasColorways ? toneById(params.get(TONE_PARAM)) : undefined
  const collection = canBrowseByCollection ? BEDDING_SETS.find((c) => c.id === params.get(COLLECTION_PARAM)) : undefined
  const [modeChoice, setModeChoice] = useState<BrowseMode>('gam')
  const mode: BrowseMode = !canBrowseByCollection || tone ? 'gam' : collection ? 'bo' : modeChoice
  const [colorwayLimit, setColorwayLimit] = useState(COLORWAY_PAGE)

  // Phối màu thuộc nhóm đang xem: bộ chăn ga, chăn hè, hoặc cả hai khi xem "Tất cả"
  const scope = useMemo(
    () => COLORWAYS.filter((c) => !category || (category === 'chan') === (c.collection.kind === 'chan-he')),
    [category],
  )
  const isShowingColorways = Boolean(tone || collection)
  const colorways = useMemo(() => {
    if (!tone && !collection) return []
    const filtered = scope.filter((c) => (!tone || c.story.tone === tone.id) && (!collection || c.collection.id === collection.id))
    return bySort(filtered, sort, (c) => collectionRange(c.collection).min)
  }, [scope, tone, collection, sort])
  const products = useMemo(
    () =>
      bySort(
        PRODUCTS.filter((p) => !category || p.category === category),
        sort,
        (p) => p.min,
      ),
    [category, sort],
  )

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setColorwayLimit(COLORWAY_PAGE)
    setParams(next, { replace: true })
  }
  const pickCategory = (id: CategoryId | null) =>
    update({ [CATEGORY_PARAM]: id, [COLLECTION_PARAM]: null, ...(id === 'goi' || id === 'dem' ? { [TONE_PARAM]: null } : {}) })
  const switchMode = (next: BrowseMode) => {
    setModeChoice(next)
    update({ [TONE_PARAM]: null, [COLLECTION_PARAM]: null })
  }

  const resultLabel = !isShowingColorways
    ? `${products.length} sản phẩm`
    : collection && tone
      ? `${colorways.length} phối màu ${collection.name}, ${tone.phrase}`
      : collection
        ? `${colorways.length} phối màu của ${collection.name}`
        : `${colorways.length} ${tone?.phrase.replace(/^gam /, 'phối màu gam ')}`

  return (
    <div className="pb-24">
      <section className="border-b border-cream-200 bg-cream-50">
        <Container className="pt-10 pb-12 sm:pt-14 sm:pb-16">
          <nav aria-label="Đường dẫn" className="flex items-center gap-2 text-sm text-ink-soft">
            <Link to="/" className="hover:text-deep-900">
              Trang chủ
            </Link>
            <Icon name="arrowRight" size={13} className="text-ink-faint" />
            <span className="text-deep-900">Sản phẩm</span>
          </nav>
          <h1 className="font-display mt-4 text-[2.4rem] leading-tight text-deep-900 sm:text-[3.4rem]">
            Sản phẩm <span className="text-mist-600 italic">Ecopillo</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Bộ chăn ga Lyocell, chăn, gối, đệm và topper. Mọi sản phẩm đều đặt online được, nhân viên gọi xác nhận trước
            khi giao, Quý khách thanh toán khi nhận hàng.
          </p>
        </Container>
      </section>

      <Container className="pt-6 sm:pt-8">
        {/* Hàng 1: loại sản phẩm (tab gạch chân) bên trái, sắp xếp bên phải */}
        <div className="flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:items-end">
          <div
            role="group"
            aria-label="Danh mục"
            className="-mx-5 flex min-w-0 flex-1 gap-6 overflow-x-auto border-b border-cream-200 px-5 [scrollbar-width:none] sm:mx-0 sm:px-0"
          >
            {[{ id: null, label: 'Tất cả' } as const, ...CATEGORIES].map((c) => {
              const active = category === c.id
              return (
                <button
                  key={c.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pickCategory(c.id)}
                  className={`-mb-px inline-flex h-11 shrink-0 items-center gap-1.5 border-b-2 text-[0.95rem] whitespace-nowrap transition-colors ${
                    active ? 'border-deep-800 font-medium text-deep-900' : 'border-transparent text-ink-faint hover:text-deep-900'
                  }`}
                >
                  {c.label}
                  <span className="tabular text-xs">{PRODUCTS.filter((p) => !c.id || p.category === c.id).length}</span>
                </button>
              )
            })}
          </div>
          <SortSelect value={sort} onChange={(v) => update({ [SORT_PARAM]: v === 'noi-bat' ? null : v })} />
        </div>

        {/* Hàng 2: câu hỏi + công tắc; hàng 3: lưới ô đều nhau, chia cột cố định nên không rớt dòng */}
        {hasColorways && (
          <section aria-labelledby="browse-title" className="mt-7 sm:mt-9">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <h2 id="browse-title" className="font-display text-[1.45rem] leading-tight text-deep-900 sm:text-[1.8rem]">
                Quý khách tìm theo <span className="text-mist-600 italic">{mode === 'gam' ? 'gam màu' : 'bộ sưu tập'}</span>
              </h2>
              {canBrowseByCollection && (
                <div role="group" aria-label="Cách tìm" className="inline-flex rounded-full bg-cream-50 p-1 ring-1 ring-cream-200">
                  {(['gam', 'bo'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mode === m}
                      onClick={() => switchMode(m)}
                      className={`h-10 rounded-full px-4 text-sm transition ${mode === m ? 'bg-deep-800 text-ivory' : 'text-deep-900'}`}
                    >
                      {m === 'gam' ? 'Gam màu' : 'Bộ sưu tập'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {mode === 'gam' ? (
              <div role="group" aria-label="Gam màu" className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
                {TONES.map((t) => (
                  <ToneTile
                    key={t.id}
                    tone={t}
                    count={scope.filter((c) => c.story.tone === t.id).length}
                    active={tone?.id === t.id}
                    onPick={() => update({ [TONE_PARAM]: tone?.id === t.id ? null : t.id, [COLLECTION_PARAM]: null })}
                  />
                ))}
              </div>
            ) : (
              <div role="group" aria-label="Bộ sưu tập" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
                <Tile active={!collection} onPick={() => update({ [COLLECTION_PARAM]: null })} title="Tất cả bộ" note={`${BEDDING_SETS.length} bộ sưu tập`} />
                {BEDDING_SETS.map((c) => (
                  <CollectionTile
                    key={c.id}
                    collection={c}
                    active={collection?.id === c.id}
                    onPick={() => update({ [COLLECTION_PARAM]: collection?.id === c.id ? null : c.id, [TONE_PARAM]: null })}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-soft">
          <span aria-live="polite">{resultLabel}</span>
          {isShowingColorways && (
            <button
              type="button"
              onClick={() => update({ [TONE_PARAM]: null, [COLLECTION_PARAM]: null })}
              className="-my-2 py-2 font-medium text-deep-900 underline underline-offset-4"
            >
              Xoá lọc
            </button>
          )}
          {hasColorways && mode === 'gam' && !STORIES_APPROVED && <FillIn>[ECOPILLO DUYỆT CÁCH CHIA GAM MÀU]</FillIn>}
        </p>

        {isShowingColorways ? (
          <ColorwayGrid colorways={colorways} limit={colorwayLimit} onMore={() => setColorwayLimit((n) => n + COLORWAY_PAGE)} />
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-cream-300 p-10 text-center text-ink-soft">
            Không có sản phẩm phù hợp.{' '}
            <button type="button" onClick={() => setParams({}, { replace: true })} className="font-medium text-deep-900 underline">
              Xoá bộ lọc
            </button>
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {products.map((p, i) => (
              <li key={p.slug} data-reveal style={revealDelay(i, 70)} className="flex">
                <div className="flex w-full flex-col [&>article]:flex-1">
                  <ProductCard product={p} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  )
}

interface TileProps {
  active: boolean
  onPick: () => void
  title: string
  note: string
  disabled?: boolean
  /** Phần màu phía trên ô (dải gam màu hoặc các chấm màu của bộ) */
  children?: ReactNode
}

/** Ô lọc: mọi ô trong một lưới cao bằng nhau, tên một dòng, số lượng ở dòng dưới */
function Tile({ active, onPick, title, note, disabled, children }: TileProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onPick}
      className={`flex h-full min-h-[4.25rem] flex-col overflow-hidden rounded-2xl bg-ivory text-left transition duration-300 ease-[var(--ease-soft)] disabled:cursor-not-allowed disabled:opacity-45 ${
        active ? 'ring-2 ring-deep-800' : 'ring-1 ring-cream-200 enabled:hover:ring-deep-700'
      }`}
    >
      {children}
      <span className="mt-auto block w-full px-3 pt-2.5 text-[0.85rem] leading-tight font-medium text-deep-900 sm:px-3.5 sm:text-[0.92rem]">{title}</span>
      <span className="block w-full px-3 pb-2.5 text-[0.7rem] text-ink-faint sm:px-3.5 sm:text-[0.74rem]">{note}</span>
    </button>
  )
}

function ToneTile({ tone, count, active, onPick }: { tone: Tone; count: number; active: boolean; onPick: () => void }) {
  return (
    <Tile active={active} onPick={onPick} title={tone.label} note={`${count} phối màu`} disabled={count === 0}>
      <span aria-hidden="true" className="block h-9 w-full sm:h-11" style={{ background: tone.swatch }} />
    </Tile>
  )
}

function CollectionTile({ collection, active, onPick }: { collection: Collection; active: boolean; onPick: () => void }) {
  return (
    <Tile active={active} onPick={onPick} title={collection.name} note={`${collection.patterns.length} phối màu`}>
      <span aria-hidden="true" className="flex px-3 pt-3 sm:px-3.5">
        {collection.patterns.slice(0, TILE_DOTS).map((p) => (
          <span key={p.code} className="-mr-1 h-4 w-4 rounded-full ring-1 ring-ivory" style={{ backgroundColor: p.swatch } as CSSProperties} />
        ))}
      </span>
    </Tile>
  )
}

function ColorwayGrid({ colorways, limit, onMore }: { colorways: readonly Colorway[]; limit: number; onMore: () => void }) {
  if (colorways.length === 0) {
    return (
      <div className="mt-6 rounded-[1.5rem] border border-dashed border-cream-300 p-10 text-center text-ink-soft">Chưa có phối màu phù hợp.</div>
    )
  }
  return (
    <>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {colorways.slice(0, limit).map((colorway) => (
          <li key={`${colorway.collection.id}/${colorway.pattern.code}`}>
            <ColorwayCard colorway={colorway} />
          </li>
        ))}
      </ul>
      {colorways.length > limit && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={onMore} className={buttonClass('secondary', 'lg')}>
            Xem thêm {Math.min(COLORWAY_PAGE, colorways.length - limit)} phối màu
          </button>
        </div>
      )}
    </>
  )
}

/** Sắp xếp: một dòng chữ gọn thay cho ô chọn có viền, vẫn là <select> thật để dùng được bằng bàn phím */
function SortSelect({ value, onChange }: { value: SortId; onChange: (value: string) => void }) {
  return (
    <label className="relative inline-flex h-11 shrink-0 items-center gap-1.5 self-start text-sm text-ink-soft sm:self-auto">
      Sắp xếp:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 cursor-pointer appearance-none rounded-lg bg-transparent pr-6 font-medium text-deep-900 focus-visible:ring-2 focus-visible:ring-deep-700 focus-visible:outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={15} className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-deep-900" />
    </label>
  )
}
