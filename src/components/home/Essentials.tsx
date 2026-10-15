import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { COLLECTIONS, ESSENTIALS, GIFT_PROGRAM_NOTE, MATTRESSES, productImage } from '../../data/catalog'
import { formatRange, formatVND } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, ContactButtons, Container, FillIn, SectionHeading } from '../ui/primitives'
import { PRODUCTS, productForEssential, productPath, singleOrderUrl } from '../../data/products'
import { PATHS, productsUrl } from '../../data/links'
import { revealDelay } from '../../lib/reveal'
import { scrollToElement } from '../../lib/scroll'
import { orderLink } from './Collections'
import { MobileTabBar } from './MobileTabBar'

const SUMMER_QUILT_NAME = 'Chăn hè Lyocell'
const SUMMER_QUILT_ID = 'chan-he-lyocell'

/** Tab của khối gộp trên điện thoại: ba nhóm ruột chăn gối, đệm, quà tặng */
type EssentialTab = 'ruot-goi' | 'ruot-chan' | 'chan-topper' | 'dem' | 'qua-tang'

const ESSENTIAL_TABS: readonly { id: EssentialTab; label: string }[] = [
  ...ESSENTIALS.map((g) => ({ id: g.id as EssentialTab, label: g.title })),
  { id: 'dem', label: 'Đệm' },
  { id: 'qua-tang', label: 'Quà tặng' },
]

interface EssentialsProps {
  /**
   * Trang chủ điện thoại (mẫu 2, owner chốt 15/10/2026): gộp Ruột chăn gối, Đệm, Quà tặng thành một khối có tab.
   * Máy tính không đổi. Mọi nhóm vẫn nằm trong trang, chỉ hiện nhóm đang chọn.
   */
  withTabs?: boolean
}

export function Essentials({ withTabs = false }: EssentialsProps) {
  const { hash } = useLocation()
  // Mở thẳng tab Quà tặng khi đi từ link #qua-tang
  const [tab, setTab] = useState<EssentialTab>(hash === '#qua-tang' ? 'qua-tang' : 'ruot-goi')
  // Đi từ link #qua-tang: tab vừa mở nên mục mới có chiều cao, cuộn lại tới đúng chỗ
  useEffect(() => {
    if (!withTabs || hash !== '#qua-tang') return
    setTab('qua-tang')
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById('qua-tang')
      if (target) scrollToElement(target)
    })
    return () => cancelAnimationFrame(frame)
  }, [withTabs, hash])
  const shownOnMobile = (id: EssentialTab) => !withTabs || tab === id
  const mobileOnly = (id: EssentialTab) => (shownOnMobile(id) ? '' : 'max-sm:hidden')
  return (
    <>
    <section id="ruot-chan-goi" aria-labelledby="essentials-title" className={withTabs && tab === 'qua-tang' ? 'pt-14 sm:py-32' : 'py-14 sm:py-32'}>
      <Container>
        <SectionHeading
          id="essentials-title"
          eyebrow="Ruột chăn · ruột gối · topper"
          title={
            <>
              Phần êm ái <span className="text-mist-600 italic">bên trong</span>
            </>
          }
          lead="Chọn độ êm hợp với thói quen ngủ của Quý khách. Đặt online ngay, hoặc ghé cửa hàng Ecopillo để nằm thử từng loại gối."
        />

        {withTabs && <MobileTabBar label="Nhóm sản phẩm" tabs={ESSENTIAL_TABS} value={tab} onChange={setTab} className="mt-6" />}

        <div className={`mt-8 grid gap-5 sm:mt-14 lg:grid-cols-3 ${withTabs ? 'max-sm:mt-5' : 'm-rail'}`}>
          {ESSENTIALS.map((group, i) => (
            <article
              key={group.id}
              data-reveal
              style={revealDelay(i)}
              className={`flex flex-col rounded-[1.75rem] bg-cream-50 p-3 ring-1 ring-cream-200 ${mobileOnly(group.id as EssentialTab)}`}
            >
              <div className="aspect-[16/9] rounded-[1.35rem]">
                <Placeholder
                  className="h-full w-full"
                  note={group.imageNote}
                  image={group.imageKey ? productImage(group.imageKey, group.title) : undefined}
                  sizes="(min-width: 1024px) 380px, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col px-4 pt-6 pb-4">
                <h3 className="font-display text-[1.7rem] text-deep-900">{group.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{group.subtitle}</p>
                <ul className="mt-6 divide-y divide-cream-200">
                  {group.items.map((item) => (
                    <li key={item.name} className="py-3.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <ItemName name={item.name} />
                        <span className="tabular ml-auto shrink-0 text-right text-[0.92rem] text-deep-800">
                          {formatRange(item.min, item.max)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-4">
                        <span className="text-[0.8rem] text-ink-soft">{item.note}</span>
                        <Link
                          to={essentialOrderUrl(item.name)}
                          aria-label={`Đặt mua ${item.name}`}
                          className="-my-2.5 inline-flex shrink-0 items-center gap-1 py-2.5 text-[0.8rem] font-medium text-mist-600 underline-offset-4 hover:underline"
                        >
                          Đặt mua <Icon name="arrowRight" size={13} />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className={`mt-6 flex items-start gap-2 text-sm text-ink-soft ${withTabs && (tab === 'dem' || tab === 'qua-tang') ? 'max-sm:hidden' : ''}`}>
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-mist-600" />
          {/* Gói chữ vào một khối: không thì mỗi mảnh chữ, link thành một cột riêng của flex và số điện thoại bị bẻ dòng */}
          <span>
            Ruột gối, ruột chăn, topper và đệm đều đặt online được; nhân viên gọi xác nhận trước khi giao. Cần tư vấn độ
            êm? Gọi hoặc nhắn Zalo{' '}
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium whitespace-nowrap text-deep-900 underline underline-offset-4"
            >
              {CONTACT.hotlineDisplay}
            </a>
            .
          </span>
        </p>

        <div className={mobileOnly('dem')}>
          <Mattresses />
        </div>
      </Container>
    </section>
    {withTabs && (
      <div className={mobileOnly('qua-tang')}>
        <Gifts />
      </div>
    )}
    </>
  )
}

/** Chăn hè đi luồng chọn mẫu; ruột gối, ruột chăn, topper đặt theo kích thước */
const essentialOrderUrl = (name: string): string => {
  if (name === SUMMER_QUILT_NAME) return orderLink(SUMMER_QUILT_ID)
  const product = productForEssential(name)
  return product ? singleOrderUrl(product) : PATHS.order
}

const mattressProduct = (note: string) => PRODUCTS.find((p) => p.category === 'dem' && p.summary === note)

function ItemName({ name }: { name: string }) {
  const product = productForEssential(name)
  if (!product) return <span className="font-medium whitespace-nowrap text-deep-900">{name}</span>
  return (
    <Link
      to={productPath(product)}
      className="-my-2 py-2 font-medium whitespace-nowrap text-deep-900 decoration-mist-300 underline-offset-4 hover:underline"
    >
      {name}
    </Link>
  )
}

function Mattresses() {
  return (
    <div data-reveal className="mt-10 overflow-hidden rounded-[2rem] bg-mist-100 sm:mt-20 lg:grid lg:grid-cols-[0.9fr_1.4fr]">
      <div className="flex flex-col justify-between gap-6 p-6 sm:gap-8 sm:p-10">
        <div>
          <p className="eyebrow">Đệm</p>
          <h3 className="font-display mt-3 text-[2rem] text-deep-900">Đặt online hoặc nằm thử</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
            Chọn đệm và kích thước, đặt ngay trên web: nhân viên gọi xác nhận và báo giá chính xác theo độ dày. Muốn
            nằm thử trước? Ghé cửa hàng Ecopillo tại Hà Nội hoặc TP. HCM.
          </p>
        </div>
        <ContactButtons size="sm" callLabel="Gọi tư vấn đệm" />
      </div>
      <ul className="grid grid-cols-2 gap-px bg-mist-200">
        {MATTRESSES.map((m) => {
          const product = mattressProduct(m.note)
          return (
          <li key={m.name} className="relative bg-mist-50 p-5 transition-colors hover:bg-ivory sm:p-7">
            <Icon name="bed" size={22} className="text-mist-600" />
            <p className="mt-4 text-[0.92rem] leading-snug font-medium text-deep-900 sm:text-base">
              {product ? (
                <Link to={productPath(product)} className="after:absolute after:inset-0">
                  {m.name}
                </Link>
              ) : (
                m.name
              )}
            </p>
            <p className="mt-1 hidden text-[0.82rem] leading-snug text-ink-soft sm:block">{m.note}</p>
            <p className="tabular mt-4 text-sm text-deep-800">
              từ <span className="block text-base font-medium sm:inline sm:text-lg">{formatVND(m.from)}</span>
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-medium text-mist-600">
              Xem và đặt mua <Icon name="arrowRight" size={13} />
            </span>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

const MICRO_PLUS = ESSENTIALS.flatMap((g) => g.items).find((i) => i.name === 'Micro Plus')
const MICRO_PLUS_VALUE = MICRO_PLUS ? `Trị giá ${formatRange(MICRO_PLUS.min, MICRO_PLUS.max)} mỗi chiếc` : ''

const GIFT_TIERS = [
  { count: '1', gift: 'vỏ gối ôm cao cấp', value: 'Vỏ gối ôm 80×100 đồng bộ', ids: ['eco-flora'] },
  { count: '1', gift: 'ruột gối Micro Plus', value: MICRO_PLUS_VALUE, ids: ['eco-rosa', 'eco-tera', 'eco-vera'] },
  { count: '2', gift: 'ruột gối Micro Plus', value: MICRO_PLUS_VALUE, ids: ['eco-doris', 'eco-sweet', 'eco-liora'] },
] as const

const nameOf = (id: string) => COLLECTIONS.find((c) => c.id === id)?.name ?? id

interface GiftsProps {
  /** Trang Quà tặng: nút dẫn sang danh sách bộ chăn ga thay vì cuộn tới mục Bộ sưu tập của trang chủ */
  standalone?: boolean
}

export function Gifts({ standalone = false }: GiftsProps) {
  return (
    <section id="qua-tang" aria-labelledby="gifts-title" className={standalone ? 'scroll-mt-24 py-14 sm:py-24' : 'pb-14 sm:pb-32'}>
      <Container>
        <div className="grain relative overflow-hidden rounded-[2.25rem] bg-brass-100 px-5 py-10 sm:px-12 sm:py-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 h-80 w-80 rounded-full border border-brass-500/25"
          />
          <div
            aria-hidden="true"
            className="absolute -top-10 -right-10 h-52 w-52 rounded-full border border-dashed border-brass-500/30"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow !text-brass-600">Chương trình tri ân</p>
              <h2 id="gifts-title" className="font-display mt-4 text-[2rem] text-deep-900 sm:text-[2.75rem]">
                Tri ân 15.000 khách hàng
              </h2>
              <p className="mt-4 text-ink-soft">
                Mỗi bộ chăn ga đều kèm quà. Số lượng quà có hạn, áp dụng đến khi hết quà.{' '}
                <FillIn>{GIFT_PROGRAM_NOTE}</FillIn>
              </p>
            </div>
            {standalone ? (
              <Link to={productsUrl({ 'danh-muc': 'bo-chan-ga' })} className={buttonClass('primary', 'md', 'self-start lg:self-auto')}>
                Xem bộ chăn ga
                <Icon name="arrowRight" size={17} />
              </Link>
            ) : (
              <a href="#bo-suu-tap" className={buttonClass('primary', 'md', 'self-start lg:self-auto')}>
                Chọn bộ sưu tập
                <Icon name="arrowRight" size={17} />
              </a>
            )}
          </div>

          <ol className="m-rail relative mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
            {GIFT_TIERS.map((tier, i) => (
              <li
                key={tier.ids.join()}
                data-reveal
                style={revealDelay(i)}
                className={`flex gap-5 rounded-[1.5rem] bg-ivory p-5 shadow-[var(--shadow-soft)] sm:p-7 lg:flex-col lg:gap-0 ${
                  i === 2 ? 'ring-2 ring-brass-500/60' : ''
                }`}
              >
                <div className="flex shrink-0 items-start gap-3 lg:items-center">
                  <span className="font-display text-[3.4rem] leading-none text-deep-900 lg:text-6xl">{tier.count}</span>
                  <span className="mt-2 hidden h-10 w-10 items-center justify-center rounded-full bg-brass-100 text-brass-600 lg:mt-0 lg:flex">
                    <Icon name="gift" size={18} />
                  </span>
                </div>
                <div className="min-w-0 flex-1 lg:mt-4">
                  <p className="font-medium text-deep-900 first-letter:uppercase">{tier.gift}</p>
                  <p className="mt-0.5 text-[0.8rem] text-ink-soft">{tier.value}</p>
                  <div className="stitch my-4 text-cream-300" aria-hidden="true" />
                  <p className="text-[0.68rem] tracking-[0.14em] text-ink-faint uppercase">Khi mua</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {tier.ids.map((id) => (
                      <li key={id}>
                        <Link
                          to={orderLink(id)}
                          className="inline-block rounded-full bg-cream-100 px-3 py-1 text-[0.8rem] text-deep-800 transition-colors hover:bg-mist-200"
                        >
                          {nameOf(id)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
