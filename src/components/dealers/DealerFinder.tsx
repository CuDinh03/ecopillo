import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DealerCard } from './DealerCard'
import { DealerMap } from './DealerMap'
import { ZaloMark, Icon } from '../ui/Icon'
import { Select, type SelectHandle } from '../ui/Select'
import { buttonClass, Container } from '../ui/primitives'
import { CONTACT, SHOWROOMS } from '../../data/brand'
import { PATHS, SITE_ORIGIN } from '../../data/links'
import {
  FAR_KM,
  formatKm,
  matchesQuery,
  PAGE_SIZE,
  PROVINCES,
  provinceById,
  sortByDistance,
  type Dealer,
  type LatLng,
} from '../../data/dealers'
import { useDealers } from '../../hooks/useDealers'
import { scrollToElement } from '../../lib/scroll'

/**
 * Khối tìm điểm bán (thiết kế chốt 13/10/2026).
 * Từ 05/11/2026 (mục 9 phương án A) nằm trong trang Liên hệ mua hàng (#diem-ban);
 * /he-thong-phan-phoi/ 301 về /lien-he/#diem-ban.
 * - Nút "Tìm đại lý gần tôi": chỉ hỏi vị trí khi khách bấm (hoặc ?gan-toi=1).
 * - Không lấy được vị trí: chọn tỉnh/thành hoặc gõ tìm không dấu.
 * - Điểm gần nhất xa hơn FAR_KM, hoặc tỉnh chưa có điểm: mời đặt online / nhắn Zalo.
 */

type Geo = 'idle' | 'locating' | 'failed'

const PROVINCE_KEY = 'ecopillo-tinh'

const readProvince = () => {
  try {
    const id = localStorage.getItem(PROVINCE_KEY) ?? ''
    return provinceById(id) ? id : ''
  } catch {
    return ''
  }
}

const saveProvince = (id: string) => {
  try {
    if (id) localStorage.setItem(PROVINCE_KEY, id)
    else localStorage.removeItem(PROVINCE_KEY)
  } catch {
    /* trình duyệt chặn lưu: bỏ qua */
  }
}

const sortedProvinces = [...PROVINCES].sort((a, b) => a.name.localeCompare(b.name, 'vi'))

interface Row {
  dealer: Dealer
  km?: number
}

/** Dữ liệu cấu trúc LocalBusiness cho Văn phòng đại diện và Chi nhánh */
export function LocalBusinessData() {
  const data = SHOWROOMS.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: `Ecopillo ${s.kind} ${s.city}`,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressCountry: 'VN' },
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng },
    telephone: s.hotline ?? CONTACT.hotlineDisplay,
    openingHours: 'Mo-Su 08:30-22:00',
    // URL chuẩn sau khi gộp: trang Liên hệ mua hàng, neo điểm bán
    url: `${SITE_ORIGIN}${PATHS.contact}#diem-ban`,
  }))
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

/** Khối "Khu vực của Quý khách chưa có đại lý" */
function NoDealerNearby({ place }: { place?: string }) {
  return (
    <div className="rounded-[1.75rem] bg-deep-900 p-6 text-ivory sm:p-8">
      <p className="font-display text-[1.5rem] leading-tight sm:text-[1.75rem]">
        {place ? `${place} chưa có đại lý Ecopillo` : 'Khu vực của Quý khách chưa có đại lý Ecopillo'}
      </p>
      <p className="mt-3 max-w-xl text-body-sm text-mist-200/90">
        Ecopillo giao hàng toàn quốc, thanh toán khi nhận, miễn phí giao từ 500.000đ. Nhắn Zalo để được tư vấn mẫu qua video.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={PATHS.order} className={buttonClass('light', 'md')}>
          Đặt hàng online <Icon name="arrowRight" size={17} />
        </Link>
        <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('outlineLight', 'md')}>
          <ZaloMark tone="light" /> Nhắn Zalo Ecopillo
        </a>
      </div>
      <p className="mt-6 border-t border-ivory/15 pt-5 text-sm text-mist-200/90">
        Quý khách kinh doanh chăn ga tại đây?{' '}
        <Link to={PATHS.recruit} className="font-medium text-ivory underline underline-offset-4">
          Trở thành đại lý Ecopillo
        </Link>
      </p>
    </div>
  )
}

interface DealerFinderProps {
  /**
   * true = khối nhúng trong trang Liên hệ (không Breadcrumb/h1 riêng, id=diem-ban).
   * false = trang riêng (cũ; hiện chỉ còn qua 301).
   */
  embedded?: boolean
}

export function DealerFinder({ embedded = false }: DealerFinderProps) {
  const dealers = useDealers()
  const [params] = useSearchParams()
  const [me, setMe] = useState<LatLng | null>(null)
  const [geo, setGeo] = useState<Geo>('idle')
  // Tỉnh nhớ lần trước: đọc sau khi gắn vào trình duyệt (useEffect), không đọc lúc dựng sẵn HTML trên máy chủ
  const [provinceId, setProvinceId] = useState('')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list')
  const [searchOpen, setSearchOpen] = useState(false)
  // Tăng mỗi lần có kết quả mới do khách chủ động (định vị xong, chọn tỉnh): điện thoại cuộn tới kết quả
  const [resultsTick, setResultsTick] = useState(0)
  const selectRef = useRef<SelectHandle>(null)
  const asideRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setProvinceId(readProvince())
  }, [])

  const province = provinceById(provinceId)
  // Tỉnh có điểm bán ghi số điểm bên phải dòng
  const provinceOptions = useMemo(
    () =>
      sortedProvinces.map((p) => {
        const count = dealers.filter((d) => d.tinh === p.name).length
        return { value: p.id, label: p.name, note: count > 0 ? `${count} điểm` : undefined }
      }),
    [dealers],
  )

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeo('failed')
      return
    }
    setGeo('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeo('idle')
        setProvinceId('')
        setQuery('')
        setSelectedId(null)
        setLimit(PAGE_SIZE)
        setSearchOpen(false)
        setResultsTick((n) => n + 1)
      },
      // Từ chối, không xác định được, hết giờ: đều mời chọn tỉnh, không hiện lỗi kỹ thuật
      () => setGeo('failed'),
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false },
    )
  }, [])

  // Đi từ nút "Tìm đại lý gần tôi" ở trang khác (?gan-toi=1): khách vừa chủ động bấm nên hỏi vị trí ngay
  const askedOnOpen = useRef(false)
  useEffect(() => {
    if (params.get('gan-toi') === '1' && !askedOnOpen.current) {
      askedOnOpen.current = true
      locate()
    }
  }, [params, locate])

  // Không lấy được vị trí: mở sẵn ô chọn tỉnh
  useEffect(() => {
    if (geo !== 'failed') return
    selectRef.current?.open()
  }, [geo])

  const chooseProvince = (id: string) => {
    setProvinceId(id)
    saveProvince(id)
    setSelectedId(null)
    setLimit(PAGE_SIZE)
    if (geo === 'failed') setGeo('idle')
    setResultsTick((n) => n + 1)
  }

  // Điện thoại: phần tìm kiếm chiếm gần hết màn hình đầu, nên có kết quả thì đưa khách tới đó
  useEffect(() => {
    if (resultsTick === 0 || window.matchMedia('(min-width: 1024px)').matches) return
    requestAnimationFrame(() => resultsRef.current && scrollToElement(resultsRef.current))
  }, [resultsTick])

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchOpen(false)
      setQuery('')
      return
    }
    setSearchOpen(true)
    requestAnimationFrame(() => searchRef.current?.focus())
  }

  const view = useMemo(() => {
    const filtered = dealers.filter((d) => (!province || d.tinh === province.name) && matchesQuery(d, query))
    const rows: Row[] = me ? sortByDistance(filtered, me) : filtered.map((dealer) => ({ dealer }))
    const nearest = rows[0]?.km
    const searching = query.trim() !== ''

    // "Gần tôi" mà điểm gần nhất vẫn quá xa: mời đặt online, kèm 3 điểm gần nhất.
    // Khách đã tự chọn tỉnh thì tỉnh đó xa mấy cũng là ý khách, không báo "khu vực chưa có đại lý".
    if (me && !province && !searching && nearest !== undefined && nearest > FAR_KM) {
      return { mode: 'far' as const, rows: rows.slice(0, 3), total: rows.length, nearest }
    }
    // Tỉnh chưa có điểm: 3 điểm gần trung tâm tỉnh đó nhất (khớp với dòng "Các điểm gần … nhất")
    if (province && !searching && filtered.length === 0) {
      return { mode: 'empty-province' as const, rows: sortByDistance(dealers, province).slice(0, 3), total: 0, nearest: undefined }
    }
    return { mode: 'list' as const, rows, total: rows.length, nearest }
  }, [dealers, province, query, me])

  const shown = view.mode === 'list' ? view.rows.slice(0, limit) : view.rows
  // Đang "gần tôi" (biết vị trí, chưa chọn tỉnh, không gõ tìm): điểm đầu là câu trả lời chính ("Gần Quý khách nhất").
  // Khách tự chọn tỉnh thì đang duyệt tỉnh đó, điểm đầu có thể ở rất xa: giữ danh sách thường.
  const hasFeatured = view.mode === 'list' && me !== null && !province && query.trim() === '' && shown.length > 0

  const summary =
    view.mode === 'far'
      ? `Điểm gần nhất cách khoảng ${formatKm(view.nearest ?? 0)}`
      : view.mode === 'empty-province'
        ? `Các điểm gần ${province?.name ?? ''} nhất`
        : view.total === 0
          ? 'Không thấy điểm nào khớp'
          : me && view.nearest !== undefined
            ? `${view.total} điểm, gần nhất cách ${formatKm(view.nearest)}`
            : province
              ? `${view.total} điểm tại ${province.name}`
              : `${view.total} điểm trên toàn quốc`

  // Bản đồ hiện điểm khách vừa bấm; chưa bấm thì hiện điểm đầu danh sách (gần nhất khi đã định vị)
  const mapDealer = (view.rows.find((r) => r.dealer.id === selectedId) ?? view.rows[0])?.dealer

  // Điện thoại, tab Bản đồ: đưa bản đồ lên sát dưới thanh đầu trang để thấy trọn
  useEffect(() => {
    if (mobileView !== 'map' || window.matchMedia('(min-width: 1024px)').matches) return
    requestAnimationFrame(() => asideRef.current && scrollToElement(asideRef.current))
  }, [mobileView])

  return (
    <section
      id="diem-ban"
      aria-labelledby={embedded ? 'diem-ban-title' : 'page-title'}
      className={embedded ? 'scroll-mt-[5.5rem] py-14 sm:py-24' : undefined}
    >
      {!embedded && <LocalBusinessData />}

      <Container className={embedded ? undefined : 'pt-6 pb-7 sm:pt-12 sm:pb-12'}>
        {embedded ? (
          <header className="max-w-2xl">
            <p className="eyebrow">Điểm bán</p>
            <h2 id="diem-ban-title" className="font-display mt-3 text-[1.9rem] leading-tight text-deep-900 sm:text-[2.4rem]">
              Tìm Ecopillo gần Quý khách
            </h2>
            <p className="mt-2 text-body text-ink-soft">Nằm thử gối, đệm và chạm tay vào vải Lyocell.</p>
          </header>
        ) : (
          <>
            <h1 id="page-title" className="font-display mt-4 text-[2rem] leading-[1.1] text-balance text-deep-900 sm:mt-6 sm:text-[2.8rem]">
              Tìm Ecopillo gần Quý khách
            </h1>
            <p className="mt-2 text-body text-ink-soft sm:mt-3">Nằm thử gối, đệm và chạm tay vào vải Lyocell.</p>
          </>
        )}

        <div className={`${embedded ? 'mt-6 sm:mt-8' : 'mt-5 sm:mt-6'} grid gap-3 lg:grid-cols-[auto_minmax(0,0.8fr)_minmax(0,1fr)] lg:items-center`}>
          <div>
            <button
              type="button"
              onClick={locate}
              disabled={geo === 'locating'}
              aria-busy={geo === 'locating'}
              className={buttonClass('primary', 'lg', 'w-full disabled:cursor-wait disabled:opacity-80 lg:w-auto')}
            >
              <Icon name="locate" size={19} />
              {geo === 'locating' ? 'Đang tìm vị trí…' : 'Tìm đại lý gần tôi'}
            </button>
          </div>
          {/* Điện thoại: ô gõ chữ thu vào nút kính lúp cạnh ô tỉnh.
              Máy tính: lg:contents trả ô tỉnh về làm một cột của lưới, nút kính lúp ẩn đi. */}
          <div className="flex gap-2 lg:contents">
            <Select
              ref={selectRef}
              variant="pill"
              value={provinceId}
              onChange={chooseProvince}
              placeholder={me ? 'Gần tôi nhất (mọi tỉnh)' : 'Chọn tỉnh/thành'}
              options={provinceOptions}
              ariaLabel="Chọn tỉnh/thành"
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={toggleSearch}
              aria-expanded={searchOpen}
              aria-controls="o-tim-diem"
              aria-label={searchOpen ? 'Đóng ô tìm theo tên đường' : 'Tìm theo tên đường, phường, quận'}
              className={`flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full ring-1 transition lg:hidden ${
                searchOpen ? 'bg-deep-800 text-ivory ring-deep-800' : 'bg-ivory text-deep-900 ring-cream-200'
              }`}
            >
              <Icon name={searchOpen ? 'close' : 'search'} size={19} />
            </button>
          </div>
          <label id="o-tim-diem" className={`relative block ${searchOpen ? '' : 'max-lg:hidden'}`}>
            <span className="sr-only">Gõ tên đường, phường hoặc quận</span>
            <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-deep-700" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedId(null)
                setLimit(PAGE_SIZE)
              }}
              placeholder="Gõ tên đường, phường, quận cũ…"
              className="h-[3.25rem] w-full rounded-full bg-ivory pr-5 pl-11 text-base text-deep-900 ring-1 ring-cream-200 transition outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-deep-700"
            />
          </label>
        </div>

        <div aria-live="polite" className="mt-3 text-small">
          {geo === 'failed' ? (
            <p className="font-medium text-deep-900">Không lấy được vị trí. Quý khách chọn tỉnh/thành bên dưới nhé.</p>
          ) : (
            <p className="text-ink-faint">Vị trí chỉ dùng để tìm đại lý gần Quý khách, không lưu lại.</p>
          )}
        </div>
      </Container>

      <Container className={embedded ? 'mt-6 sm:mt-8' : 'mt-6 sm:mt-10'}>
        <div ref={resultsRef} className="flex scroll-mt-[5.5rem] flex-wrap items-center justify-between gap-3">
          <p className="font-medium text-deep-900" aria-live="polite">
            {summary}
          </p>
          <div role="tablist" aria-label="Cách xem" className="flex rounded-full bg-cream-50 p-1 ring-1 ring-cream-200 lg:hidden">
            {(['list', 'map'] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={mobileView === v}
                onClick={() => setMobileView(v)}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition active:scale-[0.97] ${
                  mobileView === v ? 'bg-deep-800 text-ivory' : 'text-deep-900'
                }`}
              >
                <Icon name={v === 'list' ? 'list' : 'map'} size={15} />
                {v === 'list' ? 'Danh sách' : 'Bản đồ'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div ref={listRef} className={`min-w-0 space-y-4 lg:col-span-7 ${mobileView === 'map' ? 'max-lg:hidden' : ''}`}>
            {view.mode !== 'list' && (
              <>
                <NoDealerNearby place={view.mode === 'empty-province' ? province?.name : undefined} />
                <p className="pt-2 font-medium text-deep-900">
                  {view.rows.length > 1 ? `Hoặc ghé ${view.rows.length} điểm gần nhất:` : 'Hoặc ghé điểm gần nhất:'}
                </p>
              </>
            )}

            {view.mode === 'list' && view.total === 0 && (
              <div className="rounded-[1.5rem] bg-cream-50 p-6 shadow-[var(--shadow-soft)]">
                <p className="text-deep-900">
                  Không thấy điểm nào có “{query}”{province ? ` tại ${province.name}` : ''}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    chooseProvince('')
                  }}
                  className="mt-3 text-sm font-medium text-deep-700 underline underline-offset-4"
                >
                  Xem tất cả điểm
                </button>
              </div>
            )}

            {shown.map((r, i) => (
              <Fragment key={r.dealer.id}>
                {hasFeatured && i === 1 && (
                  <p className="pt-3 font-medium text-deep-900">{view.total - 1} điểm khác</p>
                )}
                <DealerCard
                  dealer={r.dealer}
                  km={r.km}
                  featured={hasFeatured && i === 0}
                  selected={r.dealer.id === selectedId}
                  onSelect={() => setSelectedId(r.dealer.id)}
                />
              </Fragment>
            ))}

            {view.mode === 'list' && view.total > limit && (
              <button type="button" onClick={() => setLimit((n) => n + PAGE_SIZE)} className={buttonClass('secondary', 'md', 'w-full')}>
                Xem thêm {Math.min(PAGE_SIZE, view.total - limit)} điểm
              </button>
            )}
          </div>

          {/* Bản đồ Google nhúng: máy tính đứng yên bên phải, bấm thẻ nào thì hiện điểm đó.
              Điện thoại: tab Bản đồ, chọn điểm bằng hàng nút vuốt ngang phía trên */}
          <aside ref={asideRef} className={`min-w-0 scroll-mt-[5.5rem] lg:col-span-5 ${mobileView === 'map' ? '' : 'max-lg:hidden'}`}>
            <div className="lg:sticky lg:top-28">
              {view.rows.length > 1 && (
                <div role="group" aria-label="Chọn điểm trên bản đồ" className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] lg:hidden">
                  {view.rows.map((r) => (
                    <button
                      key={r.dealer.id}
                      type="button"
                      aria-pressed={r.dealer.id === mapDealer?.id}
                      onClick={() => setSelectedId(r.dealer.id)}
                      className={`h-10 shrink-0 rounded-full px-3.5 text-meta whitespace-nowrap transition ${
                        r.dealer.id === mapDealer?.id ? 'bg-deep-800 text-ivory' : 'bg-cream-50 text-deep-900 shadow-[var(--shadow-soft)]'
                      }`}
                    >
                      {r.dealer.ten.replace(/^Ecopillo /, '')}
                    </button>
                  ))}
                </div>
              )}
              <DealerMap dealer={mapDealer} />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
