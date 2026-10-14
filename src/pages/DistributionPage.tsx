import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MessageForm } from '../components/contact/MessageForm'
import { DealerCard } from '../components/dealers/DealerCard'
import { DealerMap } from '../components/dealers/DealerMap'
import { ZaloMark, Icon } from '../components/ui/Icon'
import { Breadcrumb } from '../components/ui/PageHero'
import { buttonClass, Container, FillIn, SectionHeading } from '../components/ui/primitives'
import { CONTACT, DISTRIBUTION_FILL_IN, SHOWROOMS } from '../data/brand'
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
} from '../data/dealers'
import { useDealers } from '../hooks/useDealers'
import { scrollToElement } from '../lib/scroll'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Trang Hệ thống phân phối: tìm đại lý gần nhất (thiết kế chốt 13/10/2026).
 * - Nút "Tìm đại lý gần tôi": chỉ hỏi vị trí khi khách bấm (hoặc mở trang với ?gan-toi=1 từ nút ở trang khác).
 *   Vị trí tính khoảng cách ngay trên máy khách, không gửi đi, không lưu.
 * - Không lấy được vị trí: chọn tỉnh/thành (34 tỉnh mới) hoặc gõ tìm không dấu.
 * - Điểm gần nhất xa hơn FAR_KM, hoặc tỉnh chưa có điểm: mời đặt online / nhắn Zalo, kèm tối đa 3 điểm gần nhất.
 */

const AGENT_BENEFITS = [
  'Giá sỉ và chính sách chiết khấu theo sản lượng',
  'Hàng mẫu, catalogue, ảnh và video bán hàng',
  'Đào tạo tư vấn chất liệu Lyocell, kích thước, bảo quản',
  'Hỗ trợ đổi hàng lỗi và bảo hành như khách lẻ',
] as const

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
function LocalBusinessData() {
  const data = SHOWROOMS.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: `Ecopillo ${s.kind} ${s.city}`,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressCountry: 'VN' },
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng },
    telephone: s.hotline ?? CONTACT.hotlineDisplay,
    openingHours: 'Mo-Su 08:30-21:00',
    url: 'https://ecopillo.com.vn/he-thong-phan-phoi',
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
      <p className="mt-3 max-w-xl text-[0.95rem] text-mist-200/90">
        Ecopillo giao hàng toàn quốc, thanh toán khi nhận, miễn phí giao từ 500.000đ. Nhắn Zalo để được tư vấn mẫu qua video.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/dat-hang" className={buttonClass('light', 'md')}>
          Đặt hàng online <Icon name="arrowRight" size={17} />
        </Link>
        <a href={CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('outlineLight', 'md')}>
          <ZaloMark tone="light" /> Nhắn Zalo Ecopillo
        </a>
      </div>
      <p className="mt-6 border-t border-ivory/15 pt-5 text-sm text-mist-200/90">
        Quý khách kinh doanh chăn ga tại đây?{' '}
        <a href="#dang-ky-dai-ly" className="font-medium text-ivory underline underline-offset-4">
          Trở thành đại lý Ecopillo
        </a>
      </p>
    </div>
  )
}

export function DistributionPage() {
  usePageMeta(
    'Tìm đại lý gần nhất',
    'Tìm đại lý, văn phòng và chi nhánh Ecopillo gần Quý khách nhất: chỉ đường, gọi, nhắn Zalo. Đến nằm thử gối, đệm và chạm tay vào vải Lyocell.',
  )
  const dealers = useDealers()
  const [params] = useSearchParams()
  const [me, setMe] = useState<LatLng | null>(null)
  const [geo, setGeo] = useState<Geo>('idle')
  const [provinceId, setProvinceId] = useState(readProvince)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list')
  const [desktopMap, setDesktopMap] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  // Tăng mỗi lần có kết quả mới do khách chủ động (định vị xong, chọn tỉnh): điện thoại cuộn tới kết quả
  const [resultsTick, setResultsTick] = useState(0)
  const selectRef = useRef<HTMLSelectElement>(null)
  const asideRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const pickedRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const province = provinceById(provinceId)

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
    const select = selectRef.current
    if (!select) return
    select.focus({ preventScroll: true })
    try {
      select.showPicker()
    } catch {
      /* trình duyệt không cho mở danh sách bằng mã: đã đưa con trỏ vào ô */
    }
  }, [geo])

  // Máy tính: chỉ tải bản đồ khi khối bản đồ sắp hiện
  useEffect(() => {
    const aside = asideRef.current
    if (!aside || desktopMap) return
    const wide = window.matchMedia('(min-width: 1024px)')
    if (!('IntersectionObserver' in window)) {
      setDesktopMap(wide.matches)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && wide.matches) setDesktopMap(true)
      },
      { rootMargin: '300px' },
    )
    io.observe(aside)
    return () => io.disconnect()
  }, [desktopMap])

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
  const mapDealers = useMemo(() => view.rows.map((r) => r.dealer), [view.rows])

  // Bấm ghim trên bản đồ: sáng thẻ tương ứng và cuộn vào tầm nhìn
  const selectFromMap = useCallback(
    (id: string) => {
      setSelectedId(id)
      const index = view.rows.findIndex((r) => r.dealer.id === id)
      if (index >= limit) setLimit(index + 1)
      if (window.matchMedia('(min-width: 1024px)').matches) {
        requestAnimationFrame(() => {
          const card = document.getElementById(`diem-${id}`)
          if (card) scrollToElement(card, 'nearest')
        })
      }
    },
    [view.rows, limit],
  )

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

  const selectedRow = view.rows.find((r) => r.dealer.id === selectedId)

  // Điện thoại, tab Bản đồ: đưa bản đồ lên sát dưới thanh đầu trang để thấy trọn
  useEffect(() => {
    if (mobileView !== 'map' || window.matchMedia('(min-width: 1024px)').matches) return
    requestAnimationFrame(() => asideRef.current && scrollToElement(asideRef.current))
  }, [mobileView])

  // Điện thoại: bấm ghim thì kéo thẻ của điểm đó vào tầm nhìn (thẻ nằm dưới bản đồ)
  useEffect(() => {
    if (mobileView !== 'map' || !selectedId || window.matchMedia('(min-width: 1024px)').matches) return
    requestAnimationFrame(() => pickedRef.current && scrollToElement(pickedRef.current, 'nearest'))
  }, [mobileView, selectedId])

  return (
    <div className="pb-24">
      <LocalBusinessData />

      {/* Đầu trang: tìm kiếm gọn, trên điện thoại nằm trong màn hình đầu tiên */}
      <section aria-labelledby="page-title" className="border-b border-cream-200 bg-cream-50">
        <Container className="pt-6 pb-7 sm:pt-12 sm:pb-12">
          <Breadcrumb items={[{ label: 'Hệ thống phân phối' }]} />
          <h1 id="page-title" className="font-display mt-4 text-[2rem] sm:mt-6 leading-[1.1] text-balance text-deep-900 sm:text-[2.8rem]">
            Tìm Ecopillo <em className="text-deep-700">gần Quý khách</em>
          </h1>
          <p className="mt-2 text-[1.02rem] text-ink-soft sm:mt-3">Nằm thử gối, đệm và chạm tay vào vải Lyocell.</p>

          <div className="mt-5 grid gap-3 sm:mt-6 lg:grid-cols-[auto_minmax(0,0.8fr)_minmax(0,1fr)] lg:items-center">
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
            {/* Điện thoại: ô gõ chữ thu vào nút kính lúp cạnh ô tỉnh (ít người gõ, chiếm chỗ màn hình đầu).
                Máy tính: lg:contents trả ô tỉnh về làm một cột của lưới, nút kính lúp ẩn đi. */}
            <div className="flex gap-2 lg:contents">
              <label className="relative block min-w-0 flex-1">
                <span className="sr-only">Chọn tỉnh/thành</span>
                <select
                  ref={selectRef}
                  value={provinceId}
                  onChange={(e) => chooseProvince(e.target.value)}
                  className="h-[3.25rem] w-full appearance-none rounded-full bg-ivory pr-11 pl-5 text-[0.98rem] text-deep-900 ring-1 ring-cream-200 transition outline-none focus:ring-2 focus:ring-deep-700"
                >
                  <option value="">{me ? 'Gần tôi nhất (mọi tỉnh)' : 'Chọn tỉnh/thành'}</option>
                  {sortedProvinces.map((p) => {
                    const count = dealers.filter((d) => d.tinh === p.name).length
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name}
                        {count > 0 ? ` (${count})` : ''}
                      </option>
                    )
                  })}
                </select>
                <Icon name="chevronDown" size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-deep-700" />
              </label>
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
                className="h-[3.25rem] w-full rounded-full bg-ivory pr-5 pl-11 text-[0.98rem] text-deep-900 ring-1 ring-cream-200 transition outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-deep-700"
              />
            </label>
          </div>

          <div aria-live="polite" className="mt-3 text-[0.85rem]">
            {geo === 'failed' ? (
              <p className="font-medium text-deep-900">Không lấy được vị trí. Quý khách chọn tỉnh/thành bên dưới nhé.</p>
            ) : (
              <p className="text-ink-faint">Vị trí chỉ dùng để tìm đại lý gần Quý khách, không lưu lại.</p>
            )}
          </div>
          <p className="mt-4 max-w-3xl text-sm">
            <FillIn>{DISTRIBUTION_FILL_IN}</FillIn>
          </p>
        </Container>
      </section>

      <Container className="mt-6 sm:mt-10">
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
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition ${
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
          <div ref={listRef} className={`space-y-4 lg:col-span-7 ${mobileView === 'map' ? 'max-lg:hidden' : ''}`}>
            {view.mode !== 'list' && (
              <>
                <NoDealerNearby place={view.mode === 'empty-province' ? province?.name : undefined} />
                <p className="pt-2 font-medium text-deep-900">
                  {view.rows.length > 1 ? `Hoặc ghé ${view.rows.length} điểm gần nhất:` : 'Hoặc ghé điểm gần nhất:'}
                </p>
              </>
            )}

            {view.mode === 'list' && view.total === 0 && (
              <div className="rounded-[1.5rem] bg-cream-50 p-6 ring-1 ring-cream-200">
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

          {/* Bản đồ: máy tính đứng yên bên phải; điện thoại chỉ tải khi mở tab Bản đồ, cao vừa khoảng
              giữa thanh đầu trang (4.5rem) và đáy màn hình (trang này không có thanh liên hệ), chừa 2rem */}
          <aside ref={asideRef} className={`scroll-mt-[5.5rem] lg:col-span-5 ${mobileView === 'map' ? '' : 'max-lg:hidden'}`}>
            <div className="lg:sticky lg:top-28">
              {desktopMap || mobileView === 'map' ? (
                <DealerMap
                  dealers={mapDealers}
                  selectedId={selectedId}
                  onSelect={selectFromMap}
                  me={me}
                  className="h-[max(18rem,calc(100svh-6.5rem-env(safe-area-inset-bottom)))] rounded-[1.75rem] ring-1 ring-cream-200 md:h-[60svh] lg:h-[calc(100svh-9rem)]"
                />
              ) : (
                <div className="h-[calc(100svh-9rem)] rounded-[1.75rem] bg-cream-50 ring-1 ring-cream-200" />
              )}
              {/* Điện thoại: bấm ghim thì hiện thẻ của điểm đó ngay dưới bản đồ */}
              {mobileView === 'map' && selectedRow && (
                <div ref={pickedRef} className="mt-4 scroll-mb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden">
                  <DealerCard dealer={selectedRow.dealer} km={selectedRow.km} selected />
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>

      <Container className="mt-16 sm:mt-24">
        <section
          id="dang-ky-dai-ly"
          aria-labelledby="agent-title"
          className="scroll-mt-28 grid gap-10 rounded-[2rem] bg-cream-50 p-6 ring-1 ring-cream-200 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14"
        >
          <div className="lg:col-span-5">
            <SectionHeading
              id="agent-title"
              eyebrow="Hợp tác"
              title={
                <>
                  Trở thành <span className="text-mist-600 italic">đại lý Ecopillo</span>
                </>
              }
              lead="Ecopillo tìm đối tác phân phối chăn ga gối đệm cao cấp tại các tỉnh, thành. Để lại thông tin, bộ phận kinh doanh sẽ gọi lại."
            />
            <ul className="mt-8 space-y-3">
              {AGENT_BENEFITS.map((b) => (
                <li key={b} className="flex gap-3 text-[0.95rem] text-deep-900">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-deep-800 text-ivory">
                    <Icon name="check" size={12} strokeWidth={2.2} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <FillIn>[ECOPILLO XÁC NHẬN QUYỀN LỢI ĐẠI LÝ TRƯỚC KHI ĐĂNG]</FillIn>
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-ivory p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:col-span-7">
            <MessageForm
              defaultTopic="Đăng ký đại lý"
              placeholder="Ví dụ: cửa hàng chăn ga tại Nam Định, diện tích 60 m², muốn nhận bảng giá sỉ…"
              submitLabel="Gửi đăng ký"
            />
          </div>
        </section>
      </Container>
    </div>
  )
}
