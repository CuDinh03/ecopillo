import { useId, useRef, useState, type KeyboardEvent } from 'react'
import {
  HOTEL_LINEN,
  HOTEL_WHITE_GOODS,
  type HotelWhiteGoodsGroup,
  type HotelWhiteGoodsGroupId,
  type HotelWhiteGoodsItem,
} from '../../data/hotel'
import { CONTACT } from '../../data/brand'
import { scrollToElement } from '../../lib/scroll'
import { CrossfadeImage } from '../ui/CrossfadeImage'
import { Icon } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'

const DETAIL_IMAGE = { src: '/images/details/vai-ed25.webp', alt: 'Cận chất vải Lyocell của bộ Eco Doris ED25' }

const twoDigits = (n: number) => String(n).padStart(2, '0')

/**
 * Khối "Hàng trắng" trang Khách sạn và dự án (phản hồi 05/11 mục 12, phương án C):
 * ba tab theo nhóm, ảnh lớn đổi theo tab, mỗi món "Giá liên hệ" + mũi tên báo giá.
 * Thay khối "Một chiếc giường, sáu lớp đồ vải".
 */
export function WhiteGoods({ onQuote }: { onQuote: (message: string) => void }) {
  const [activeId, setActiveId] = useState<HotelWhiteGoodsGroupId>(HOTEL_WHITE_GOODS[0].id)
  const group = HOTEL_WHITE_GOODS.find((g) => g.id === activeId) ?? HOTEL_WHITE_GOODS[0]
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const requestQuote = (item?: HotelWhiteGoodsItem) => {
    const label = item
      ? item.chips?.length
        ? `${item.name} ${item.chips.join(' · ')}`
        : item.name
      : group.label
    onQuote(`Cần báo giá: ${label}`)
    const target = document.getElementById('bao-gia')
    if (target) scrollToElement(target, 'start')
  }

  const selectTab = (id: HotelWhiteGoodsGroupId, index: number) => {
    setActiveId(id)
    tabRefs.current[index]?.focus()
  }

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = HOTEL_WHITE_GOODS.length - 1
    let next = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    else return
    e.preventDefault()
    selectTab(HOTEL_WHITE_GOODS[next].id, next)
  }

  return (
    <section aria-labelledby="white-goods-title" className="py-14 sm:py-24">
      {/* minmax(0,…): thanh tab không xuống dòng nên cột "auto" bị kéo rộng theo, tràn ngang trên điện thoại */}
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-20">
        <div className="relative mr-4 lg:mr-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[0.35rem] bg-cream-100 sm:aspect-[5/4]">
            {/* group.temporaryImage: ảnh tạm, chỉ đánh dấu trong dữ liệu, không hiện nhãn (owner 28/10) */}
            <CrossfadeImage image={group.image} sizes="(min-width: 1024px) 640px, 100vw" />
          </div>
          <img
            src={DETAIL_IMAGE.src}
            alt={DETAIL_IMAGE.alt}
            loading="lazy"
            decoding="async"
            className="absolute -right-4 -bottom-6 aspect-square w-[42%] border-[6px] border-ivory object-cover shadow-[var(--shadow-lift)] lg:-right-10 lg:-bottom-10 lg:w-[38%]"
          />
        </div>

        <div>
          <header data-reveal="left">
            <p className="eyebrow">Hàng trắng khách sạn</p>
            <h2 id="white-goods-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.9rem]">
              Hàng trắng cho phòng lưu trú
            </h2>
            <p className="mt-4 max-w-md text-body leading-relaxed text-ink-soft">
              Đệm, đồ vải trên giường và đồ phòng tắm. Giá báo theo số phòng, cỡ giường và số lượng.
            </p>
          </header>

          <div
            role="tablist"
            aria-label="Nhóm hàng trắng"
            className="mt-6 flex max-w-full gap-1.5 overflow-x-auto rounded-full bg-ivory p-1.5 shadow-[var(--shadow-soft)] [scrollbar-width:none]"
          >
            {HOTEL_WHITE_GOODS.map((g, i) => {
              const selected = g.id === activeId
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${g.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${g.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(g.id, i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`shrink-0 rounded-full px-4 py-2 text-body-sm font-medium whitespace-nowrap transition-colors ${
                    selected ? 'bg-deep-800 text-ivory' : 'text-deep-900 hover:bg-mist-100'
                  }`}
                >
                  {g.label}
                </button>
              )
            })}
          </div>

          {/* Mỗi nhóm một tabpanel; panel không chọn dùng thuộc tính hidden (vẫn nằm trong HTML) */}
          {HOTEL_WHITE_GOODS.map((g) => (
            <GroupPanel
              key={g.id}
              group={g}
              baseId={baseId}
              hidden={g.id !== activeId}
              onQuoteItem={requestQuote}
            />
          ))}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => requestQuote()} className={buttonClass('primary', 'lg')}>
              Liên hệ báo giá
              <Icon name="arrowRight" size={18} />
            </button>
            <a href={CONTACT.hotlineTel} className={buttonClass('secondary', 'lg')}>
              <Icon name="phone" size={18} />
              {CONTACT.hotlineDisplay}
            </a>
          </div>
          <p className="mt-3 text-small text-ink-soft">{HOTEL_LINEN.sizes}</p>
        </div>
      </Container>
    </section>
  )
}

function GroupPanel({
  group,
  baseId,
  hidden,
  onQuoteItem,
}: {
  group: HotelWhiteGoodsGroup
  baseId: string
  hidden: boolean
  onQuoteItem: (item: HotelWhiteGoodsItem) => void
}) {
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${group.id}`}
      aria-labelledby={`${baseId}-tab-${group.id}`}
      hidden={hidden}
      className={hidden ? undefined : 'mt-5'}
    >
      <p className="text-small text-ink-soft">{group.blurb}</p>
      <ol className="mt-3 border-b border-line">
        {group.items.map((item, i) => (
          <li key={item.name} className="border-t border-line">
            <div className="grid grid-cols-[2.6rem_1fr_auto] items-baseline gap-x-3 py-4">
              <span className="font-display row-span-2 text-[1.35rem] leading-none text-deep-700 italic">{twoDigits(i + 1)}</span>
              <div className="min-w-0">
                <p className="font-display text-[1.25rem] leading-snug text-deep-900">{item.name}</p>
                {item.chips && (
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.chips.map((chip) => (
                      <span key={chip} className="rounded-full bg-mist-100 px-2.5 py-0.5 text-meta font-medium text-deep-800">
                        {chip}
                      </span>
                    ))}
                  </span>
                )}
                {item.note && <p className="mt-1 text-small text-ink-soft">{item.note}</p>}
                {/* Điện thoại: chữ "Giá liên hệ" dưới tên (bên phải chỉ còn mũi tên) */}
                <p className="mt-1 text-small font-semibold text-deep-900 sm:hidden">Giá liên hệ</p>
              </div>
              <div className="flex items-center gap-2 self-center">
                <span className="hidden text-small font-semibold text-deep-900 sm:inline">Giá liên hệ</span>
                <button
                  type="button"
                  aria-label={`Liên hệ báo giá ${item.name}`}
                  onClick={() => onQuoteItem(item)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-deep-800 transition hover:bg-mist-100"
                >
                  <Icon name="arrowRight" size={18} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
