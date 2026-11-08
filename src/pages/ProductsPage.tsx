import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ColorwayCard } from '../components/products/ColorwayCard'
import { FilterPanel, SORTS, type FilterPanelProps, type SortId } from '../components/products/FilterPanel'
import { GroupTiles } from '../components/products/GroupTiles'
import { MobileFilterBar } from '../components/products/MobileFilterBar'
import { ProductCard } from '../components/products/ProductCard'
import { ProductShelves } from '../components/products/ProductShelves'
import { Icon } from '../components/ui/Icon'
import { Select } from '../components/ui/Select'
import { Container, FillIn } from '../components/ui/primitives'
import { BEDDING_SETS, collectionRange, type Collection } from '../data/catalog'
import {
  CATEGORIES,
  hasPrice,
  inPriceBand,
  LEGACY_CATEGORY,
  priceBandsOf,
  PRODUCTS,
  PRODUCTS_INTRO,
  PRODUCTS_PROMISES,
  type CategoryId,
  type PriceBand,
  type Product,
} from '../data/products'
import { cardCount } from '../data/productShelves'
import { COLORWAYS, STORIES_APPROVED, toneById, type Colorway, type Tone } from '../data/stories'
import { usePageMeta } from '../hooks/usePageMeta'
import { useFirstRender } from '../hooks/useFirstRender'
import { revealDelay } from '../lib/reveal'
import { scrollToElement } from '../lib/scroll'

const CATEGORY_PARAM = 'danh-muc'
const COLLECTION_PARAM = 'bo-suu-tap'
const SORT_PARAM = 'sap-xep'
/**
 * Lọc theo gam màu: bỏ hàng ô gam màu theo yêu cầu khách 16/10/2026 (mục 30: "bỏ đi", trang "lộn xộn khó xem"),
 * chỉ giữ chọn theo bộ sưu tập. Link có ?gam= (nút "Xem cả gam …" ở trang bộ sưu tập) vẫn lọc đúng gam.
 */
const TONE_PARAM = 'gam'
/** Mức giá: ?gia=5-10-trieu, mốc khác nhau theo loại (PRICE_BANDS trong data/products.ts) */
const PRICE_PARAM = 'gia'
/** Trang số mấy của lưới: ?trang=2 */
const PAGE_PARAM = 'trang'
/** Mục 31 (owner chọn kiểu A 17/10/2026): mỗi mẫu một thẻ, 24 thẻ một trang, có số trang như web cũ */
const PAGE_SIZE = 24
/** Số chấm màu nhỏ trên ô bộ sưu tập */
const TILE_DOTS = 5

const isCategory = (v: string | null): v is CategoryId => CATEGORIES.some((c) => c.id === v)

/** Sắp theo giá; giá 0 (chưa có giá, báo khi gọi) luôn xếp cuối dù tăng hay giảm */
const bySort = <T,>(items: readonly T[], sort: SortId, priceOf: (item: T) => number): readonly T[] => {
  if (sort === 'noi-bat') return items
  const dir = sort === 'gia-tang' ? 1 : -1
  return [...items].sort((a, b) => {
    const pa = priceOf(a)
    const pb = priceOf(b)
    if (!pa || !pb) return Number(!pa) - Number(!pb)
    return (pa - pb) * dir
  })
}

export function ProductsPage() {
  usePageMeta('Sản phẩm', 'Bộ chăn ga, chăn, gối, đệm Ecopillo: vải Lyocell mềm mát, giá rõ theo từng kích thước, đặt online thanh toán khi nhận.')
  const [params, setParams] = useSearchParams()
  const rawCategory = params.get(CATEGORY_PARAM)
  const category = isCategory(rawCategory) ? rawCategory : rawCategory ? (LEGACY_CATEGORY[rawCategory] ?? null) : null
  const sort: SortId = SORTS.some((s) => s.id === params.get(SORT_PARAM)) ? (params.get(SORT_PARAM) as SortId) : 'noi-bat'
  const bands = priceBandsOf(category)
  const band = bands.find((b) => b.id === params.get(PRICE_PARAM))

  // Chỉ bộ chăn ga và chăn hè mới có phối màu; chăn hè là một bộ duy nhất nên không có hàng chọn bộ sưu tập
  const hasColorways = category === null || category === 'bo-chan-ga' || category === 'chan'
  const canBrowseByCollection = hasColorways && category !== 'chan'
  const tone = hasColorways ? toneById(params.get(TONE_PARAM)) : undefined
  const collection = canBrowseByCollection ? BEDDING_SETS.find((c) => c.id === params.get(COLLECTION_PARAM)) : undefined
  const gridRef = useRef<HTMLParagraphElement>(null)
  // Hiện dần chỉ chạy lần đầu vào trang. Đổi bộ lọc, sắp xếp, sang trang là thao tác hay dùng:
  // kết quả phải hiện ngay, không trắng cả lưới rồi hiện lại (rà theo Emil Kowalski 23/10/2026)
  const isFirstGrid = useFirstRender(params.toString())

  /*
   * Mục 31 (khách 16/10/2026: "như web cũ ok hơn", "k gộp đâu", "ít sp lắm"), owner chọn kiểu A 17/10/2026:
   * bộ chăn ga và chăn hè hiện mỗi phối màu một thẻ thay cho một thẻ gộp cả bộ; gối, đệm, chăn lẻ vẫn một thẻ mỗi sản phẩm.
   * Thứ tự "Nổi bật": phối màu theo thứ tự bộ trong catalog.ts, rồi các sản phẩm lẻ. Mẫu: docs/de-xuat-trang-san-pham-khong-gop.html
   */
  const itemsAnyPrice = useMemo(() => gridItems(category, tone, collection), [category, tone, collection])
  const items = useMemo(
    () => bySort(itemsAnyPrice.filter((item) => !band || isInBand(item, band)), sort, (item) => rangeOf(item).min),
    [itemsAnyPrice, band, sort],
  )
  /** Số trên nút mức giá: đếm đúng số thẻ sẽ hiện bên dưới */
  const countInBand = (b: PriceBand) => itemsAnyPrice.filter((item) => isInBand(item, b)).length
  /** Số trên dòng bộ sưu tập trong khối lọc: tính cả mức giá đang chọn */
  const countInCollection = (c: Collection | undefined) =>
    gridItems(category, tone, c).filter((item) => !band || isInBand(item, band)).length

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const rawPage = Number(params.get(PAGE_PARAM))
  const page = Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= pageCount ? rawPage : 1
  const first = (page - 1) * PAGE_SIZE
  const pageItems = items.slice(first, first + PAGE_SIZE)

  /*
   * Mục "Tất cả" dạng kệ (phương án 1 + 2, owner chốt 02/11/2026): bốn ô nhóm + bốn kệ thẻ gộp, đệm/chăn/gối hiện ngay.
   * Chỉ khi chưa chọn loại, mức giá, bộ, gam, sắp xếp khác "Nổi bật", và không có ?trang= (SSG cũng không có query → vào đây).
   * Lọc / ?danh-muc= / phân trang vẫn ra lưới mỗi phối màu một thẻ như mục 31.
   */
  const isShelfMode =
    category === null && !band && !collection && !tone && sort === 'noi-bat' && !params.has(PAGE_PARAM)

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    // Đổi bộ lọc thì về trang 1
    next.delete(PAGE_PARAM)
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setParams(next, { replace: true })
    revealGrid()
  }
  // Lọc từ cột phải hay bảng lọc khi đang ở dưới sâu: đưa đầu lưới lên dưới thanh đầu trang (đợi trang vẽ lại rồi mới đo)
  const revealGrid = () =>
    requestAnimationFrame(() => {
      const grid = gridRef.current
      if (document.querySelector('dialog[open]')) return
      if (grid && grid.getBoundingClientRect().top < parseFloat(getComputedStyle(grid).scrollMarginTop)) scrollToElement(grid)
    })
  // Mốc giá mỗi loại khác nhau nên đổi loại thì bỏ mức giá
  const pickCategory = (id: CategoryId | null) =>
    update({
      [CATEGORY_PARAM]: id,
      [COLLECTION_PARAM]: null,
      [PRICE_PARAM]: null,
      ...(id === 'goi' || id === 'dem' ? { [TONE_PARAM]: null } : {}),
    })
  // Sang trang khác: giữ lịch sử để nút quay lại về trang trước, cuộn lên đầu lưới
  const goToPage = (n: number) => {
    const next = new URLSearchParams(params)
    if (n > 1) next.set(PAGE_PARAM, String(n))
    else next.delete(PAGE_PARAM)
    setParams(next)
    if (gridRef.current) scrollToElement(gridRef.current)
  }

  const isFiltered = Boolean(tone || collection)
  const clearAll = () => update({ [CATEGORY_PARAM]: null, [PRICE_PARAM]: null, [COLLECTION_PARAM]: null, [TONE_PARAM]: null })
  const panel: Omit<FilterPanelProps, 'idPrefix'> = {
    category,
    categoryCount: cardCount,
    onCategory: pickCategory,
    bands,
    band,
    bandCount: countInBand,
    onBand: (b) => update({ [PRICE_PARAM]: band?.id === b.id ? null : b.id }),
    collections: canBrowseByCollection ? BEDDING_SETS : null,
    collection,
    collectionCount: countInCollection,
    onCollection: (c) => update({ [COLLECTION_PARAM]: c?.id ?? null, [TONE_PARAM]: null }),
    sort,
    onSort: (v) => update({ [SORT_PARAM]: v === 'noi-bat' ? null : v }),
    onClear: category || band || isFiltered ? clearAll : undefined,
  }
  const activeCount = [band, collection, tone].filter(Boolean).length + (sort === 'noi-bat' ? 0 : 1)
  const unit = isFiltered ? 'phối màu' : 'sản phẩm'
  const scopeLabel =
    collection && tone ? ` ${collection.name}, ${tone.phrase}` : collection ? ` của ${collection.name}` : tone ? ` ${tone.phrase}` : ''
  const countLabel =
    items.length > PAGE_SIZE
      ? `Hiển thị ${first + 1}–${first + pageItems.length} của ${items.length} ${unit}${scopeLabel}`
      : `${items.length} ${unit}${scopeLabel}`
  const resultLabel = band ? `${countLabel}, giá ${band.label.replace(/^\S+/, (w) => w.toLowerCase())}` : countLabel

  return (
    <div className="pb-24">
      <section>
        <Container className="pt-10 pb-12 sm:pt-14 sm:pb-16">
          <nav aria-label="Đường dẫn" className="flex items-center gap-2 text-sm text-ink-soft">
            <Link to="/" className="hover:text-deep-900">
              Trang chủ
            </Link>
            <Icon name="arrowRight" size={13} className="text-ink-faint" />
            <span className="text-deep-900">Sản phẩm</span>
          </nav>
          <h1 className="font-display mt-4 text-[2.4rem] leading-tight text-deep-900 sm:text-[3.6rem]">
            Sản phẩm Ecopillo
          </h1>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
            <p className="max-w-2xl text-ink-soft">{PRODUCTS_INTRO}</p>
            {/* Điện thoại: bốn cam kết gộp trong một khối trắng cho đầu trang ngắn lại */}
            <ul aria-label="Ecopillo cam kết" className="grid gap-x-2 gap-y-2.5 rounded-2xl bg-ivory p-4 shadow-[var(--shadow-soft)] sm:grid-cols-2 sm:gap-y-2 sm:bg-transparent sm:p-0 sm:shadow-none">
              {PRODUCTS_PROMISES.map((promise) => (
                <li key={promise} className="flex gap-2 text-small leading-snug text-ink-soft sm:rounded-2xl sm:bg-ivory sm:px-3.5 sm:py-3 sm:shadow-[var(--shadow-soft)]">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-mist-600" />
                  {promise}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container className="pt-2 sm:pt-8">
        {/* Điện thoại: thanh lọc dính dưới thanh đầu trang (cách A). Mục "Tất cả" dạng kệ: thay hàng nút loại bằng dòng tóm tắt, tránh trùng ô nhóm */}
        <MobileFilterBar
          panel={{ ...panel, idPrefix: 'loc-dt', hideCategory: isShelfMode }}
          activeCount={activeCount}
          resultCount={items.length}
          onClose={revealGrid}
          summary={isShelfMode ? 'Tất cả sản phẩm' : undefined}
        />

        {/* 640–1279px: khối lọc phía trên lưới như trước. Từ 1280px khối lọc là cột dính bên phải (bên dưới).
            Mục "Tất cả" dạng kệ: ẩn tab loại và hàng bộ sưu tập (đã có ô nhóm + nút đầu kệ), giữ sắp xếp + mức giá. */}
        <div className="hidden sm:block xl:hidden">
          {/* Hàng 1: loại sản phẩm (tab gạch chân) bên trái, sắp xếp bên phải */}
          <div className="flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:items-end">
            {!isShelfMode && (
              <div
                role="group"
                aria-label="Danh mục"
                className="-mx-5 flex min-w-0 flex-1 gap-6 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] sm:mx-0 sm:px-0"
              >
                {[{ id: null, label: 'Tất cả' } as const, ...CATEGORIES].map((c) => {
                  const active = category === c.id
                  return (
                    <button
                      key={c.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => pickCategory(c.id)}
                      className={`-mb-px inline-flex h-11 shrink-0 items-center gap-1.5 border-b-2 text-body-sm whitespace-nowrap transition-colors ${
                        active ? 'border-deep-800 font-medium text-deep-900' : 'border-transparent text-ink-faint hover:text-deep-900'
                      }`}
                    >
                      {c.label}
                      <span className="tabular text-xs">{cardCount(c.id)}</span>
                    </button>
                  )
                })}
              </div>
            )}
            <SortSelect value={sort} onChange={(v) => update({ [SORT_PARAM]: v === 'noi-bat' ? null : v })} />
          </div>

          <PriceBands
            bands={bands}
            active={band}
            countOf={countInBand}
            onPick={(b) => update({ [PRICE_PARAM]: band?.id === b.id ? null : b.id })}
          />

          {/* Hàng chọn bộ sưu tập: lưới ô đều nhau, chia cột cố định nên không rớt dòng */}
          {!isShelfMode && canBrowseByCollection && (
            <section aria-labelledby="browse-title" className="mt-7 sm:mt-9">
              <h2 id="browse-title" className="font-display text-[1.45rem] leading-tight text-deep-900 sm:text-[1.8rem]">
                Quý khách tìm theo bộ sưu tập
              </h2>
              <div role="group" aria-label="Bộ sưu tập" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
                <Tile active={!collection} onPick={() => update({ [COLLECTION_PARAM]: null })} title="Tất cả bộ" note="Mọi bộ sưu tập" />
                {BEDDING_SETS.map((c) => (
                  <CollectionTile
                    key={c.id}
                    collection={c}
                    disabled={band !== undefined && !inPriceBand(collectionRange(c), band) && collection?.id !== c.id}
                    active={collection?.id === c.id}
                    onPick={() => update({ [COLLECTION_PARAM]: collection?.id === c.id ? null : c.id, [TONE_PARAM]: null })}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/*
          Từ 1280px: lưới bên trái, cột lọc bên phải dính dưới thanh đầu trang (owner duyệt 20/10/2026).
          Khối lưới này chỉ chứa kết quả và cột lọc, nên cột dính chỉ đi hết phần kết quả (bẫy sticky trong lưới: CLAUDE.md).
          Cột lọc đứng trước kết quả trong HTML (bàn phím, trình đọc màn hình đi qua bộ lọc trước), CSS đặt sang phải.
        */}
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start xl:gap-x-8">
          <aside
            aria-label="Bộ lọc"
            data-lenis-prevent
            className="hidden xl:sticky xl:top-[5.75rem] xl:col-start-2 xl:row-start-1 xl:mt-6 xl:block xl:max-h-[calc(100dvh-5.75rem-6.5rem)] xl:overflow-y-auto xl:overscroll-contain xl:[scrollbar-width:thin] xl:[scrollbar-color:var(--color-line)_transparent] xl:rounded-[1.5rem] xl:bg-ivory xl:p-5 xl:shadow-[var(--shadow-lift)]"
          >
            <FilterPanel {...panel} idPrefix="loc-cot" hideCategory={isShelfMode} />
          </aside>
          <div className="min-w-0 xl:col-start-1 xl:row-start-1">
            {isShelfMode ? (
              <>
                {/* Neo cuộn cho revealGrid khi đổi lọc từ cột phải / bảng lọc */}
                <p ref={gridRef} className="sr-only scroll-mt-[5.5rem]" aria-live="polite">
                  Tất cả sản phẩm
                </p>
                <GroupTiles />
                <ProductShelves onPick={pickCategory} reveal={isFirstGrid} />
              </>
            ) : (
              <>
                <p ref={gridRef} className="mt-6 flex scroll-mt-[5.5rem] flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-soft">
                  <span aria-live="polite">{resultLabel}</span>
                  {isFiltered && (
                    <button
                      type="button"
                      onClick={() => update({ [TONE_PARAM]: null, [COLLECTION_PARAM]: null })}
                      className="-my-2 py-2 font-medium text-deep-900 underline underline-offset-4"
                    >
                      {band ? 'Xoá lọc màu' : 'Xoá lọc'}
                    </button>
                  )}
                  {band && (
                    <button type="button" onClick={() => update({ [PRICE_PARAM]: null })} className="-my-2 py-2 font-medium text-deep-900 underline underline-offset-4">
                      Xoá lọc giá
                    </button>
                  )}
                  {tone && !STORIES_APPROVED && <FillIn>[ECOPILLO DUYỆT CÁCH CHIA GAM MÀU]</FillIn>}
                </p>

                {items.length === 0 ? (
                  <div className="mt-6 rounded-[1.5rem] border border-dashed border-line p-10 text-center text-ink-soft">
                    Không có sản phẩm phù hợp.{' '}
                    <button type="button" onClick={() => setParams({}, { replace: true })} className="font-medium text-deep-900 underline">
                      Xoá bộ lọc
                    </button>
                  </div>
                ) : (
                  <>
                    <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                      {pageItems.map((item, i) => (
                        <li
                          key={itemKey(item)}
                          data-reveal={isFirstGrid ? '' : undefined}
                          style={isFirstGrid ? revealDelay(i, 70) : undefined}
                          className="flex"
                        >
                          <div className="flex w-full flex-col [&>article]:flex-1">
                            {item.kind === 'colorway' ? <ColorwayCard colorway={item.colorway} /> : <ProductCard product={item.product} />}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {pageCount > 1 && <Pagination page={page} count={pageCount} onPick={goToPage} />}
                  </>
                )}
              </>
            )}
          </div>
        </div>
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
  /** Phần màu phía trên ô (các chấm màu của bộ) */
  children?: ReactNode
}

/** Ô lọc: mọi ô trong một lưới cao bằng nhau, tên một dòng, dòng phụ bên dưới (loại bộ; không ghi số phối màu, khách 05/11/2026) */
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
      <span className="mt-auto block w-full px-3 pt-2.5 text-small leading-tight font-medium text-deep-900 sm:px-3.5 sm:text-body-sm">{title}</span>
      <span className="block w-full px-3 pb-2.5 text-label text-ink-faint sm:px-3.5 sm:text-label">{note}</span>
    </button>
  )
}

interface CollectionTileProps {
  collection: Collection
  active: boolean
  onPick: () => void
  /** Bộ không có cỡ nào trong mức giá đang chọn */
  disabled?: boolean
}

function CollectionTile({ collection, active, onPick, disabled }: CollectionTileProps) {
  return (
    <Tile active={active} onPick={onPick} title={collection.name} note={collection.kindLabel} disabled={disabled}>
      <span aria-hidden="true" className="flex px-3 pt-3 sm:px-3.5">
        {collection.patterns.slice(0, TILE_DOTS).map((p) => (
          <span key={p.code} className="-mr-1 h-4 w-4 rounded-full ring-1 ring-ivory" style={{ backgroundColor: p.swatch } as CSSProperties} />
        ))}
      </span>
    </Tile>
  )
}

/** Thẻ trong lưới: một phối màu (bộ chăn ga, chăn hè) hoặc một sản phẩm lẻ (gối, đệm, chăn) */
type GridItem = { kind: 'colorway'; colorway: Colorway } | { kind: 'product'; product: Product }

const rangeOf = (item: GridItem): { min: number; max: number } =>
  item.kind === 'colorway' ? collectionRange(item.colorway.collection) : item.product

/** Thẻ chưa có giá (báo khi gọi) không thuộc mốc giá nào */
const isInBand = (item: GridItem, b: PriceBand): boolean =>
  (item.kind === 'colorway' || hasPrice(item.product)) && inPriceBand(rangeOf(item), b)

/** Thẻ của lưới theo loại, gam, bộ sưu tập (chưa xét mức giá). Gối, đệm, chăn lẻ không có gam, bộ nên bị loại khi lọc theo hai thứ đó */
const gridItems = (category: CategoryId | null, tone: Tone | undefined, collection: Collection | undefined): GridItem[] =>
  PRODUCTS.filter((p) => !category || p.category === category).flatMap((p): GridItem[] =>
    p.collection
      ? COLORWAYS.filter(
          (c) =>
            c.collection.id === p.collection?.id && (!tone || c.story.tone === tone.id) && (!collection || c.collection.id === collection.id),
        ).map((colorway) => ({ kind: 'colorway', colorway }))
      : tone || collection
        ? []
        : [{ kind: 'product', product: p }],
  )

const itemKey = (item: GridItem): string =>
  item.kind === 'colorway' ? `${item.colorway.collection.id}/${item.colorway.pattern.code}` : item.product.slug

/** Số trang như web cũ: nút trước, các số trang, nút sau */
function Pagination({ page, count, onPick }: { page: number; count: number; onPick: (page: number) => void }) {
  const pageButton = 'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-body-sm transition'
  return (
    <nav aria-label="Trang" className="mt-10 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => onPick(page - 1)}
        disabled={page === 1}
        aria-label="Trang trước"
        className={`${pageButton} bg-ivory text-deep-900 shadow-[var(--shadow-soft)] disabled:opacity-40`}
      >
        <Icon name="arrowLeft" size={16} />
      </button>
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPick(n)}
          aria-current={n === page ? 'page' : undefined}
          aria-label={`Trang ${n}`}
          className={`${pageButton} tabular ${n === page ? 'bg-deep-800 font-medium text-ivory' : 'bg-ivory text-deep-900 shadow-[var(--shadow-soft)] hover:bg-mist-100'}`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPick(page + 1)}
        disabled={page === count}
        aria-label="Trang sau"
        className={`${pageButton} bg-ivory text-deep-900 shadow-[var(--shadow-soft)] disabled:opacity-40`}
      >
        <Icon name="arrowRight" size={16} />
      </button>
    </nav>
  )
}

interface PriceBandsProps {
  bands: readonly PriceBand[]
  active: PriceBand | undefined
  countOf: (band: PriceBand) => number
  onPick: (band: PriceBand) => void
}

/**
 * Hàng nút mức giá dưới tab loại. Mỗi nút ghi sẵn số món; mốc không có gì thì mờ nên không ra trang trống.
 * Bấm lại nút đang chọn để bỏ lọc. Điện thoại: chữ "Mức giá" ở trên, hàng nút vuốt ngang.
 */
function PriceBands({ bands, active, countOf, onPick }: PriceBandsProps) {
  return (
    <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:gap-4">
      <span id="price-band-label" className="eyebrow shrink-0">
        Mức giá
      </span>
      <div
        role="group"
        aria-labelledby="price-band-label"
        className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {bands.map((b) => {
          const isActive = active?.id === b.id
          const count = countOf(b)
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={isActive}
              disabled={count === 0 && !isActive}
              onClick={() => onPick(b)}
              className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-small whitespace-nowrap transition duration-300 ease-[var(--ease-soft)] disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive ? 'bg-deep-800 text-ivory' : 'bg-ivory text-deep-900 ring-1 ring-cream-200 enabled:hover:ring-deep-700'
              }`}
            >
              {b.label}
              <span className={`tabular text-label ${isActive ? 'text-ivory/70' : 'text-ink-faint'}`}>{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const SORT_OPTIONS = SORTS.map((s) => ({ value: s.id, label: s.label }))

/** Sắp xếp: một dòng chữ gọn thay cho ô chọn có viền; danh sách xổ xuống theo màu của web (ui/Select) */
function SortSelect({ value, onChange }: { value: SortId; onChange: (value: string) => void }) {
  return (
    <div className="inline-flex h-11 shrink-0 items-center gap-1.5 self-start text-sm text-ink-soft sm:self-auto">
      <span aria-hidden="true">Sắp xếp:</span>
      <Select variant="inline" value={value} options={SORT_OPTIONS} onChange={onChange} ariaLabel="Sắp xếp" alignRight />
    </div>
  )
}
