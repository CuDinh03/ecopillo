import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { collectionById, coverOf, ESSENTIALS, type EssentialItem, type ImageSource } from '../../data/catalog'
import { collectionPath, PATHS } from '../../data/links'
import { productForEssential, productPath } from '../../data/products'
import { formatVND } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { Container, SectionHeading } from '../ui/primitives'

/**
 * Ruột chăn, ruột gối và phụ kiện ở trang chủ. Chị Phương (Zalo 09/11/2026 15:30): "phần này e cho hiển thị như đệm và chăn ga
 * đk không chứ c thấy hơi loạn". Owner chọn mẫu 1 (docs/de-xuat-ruot-chan-goi-09-11.html), thay bảng giá chữ hai cột:
 * ba nhóm xếp dọc, mỗi nhóm một hàng ô ảnh vuông cùng kiểu ô Bộ sưu tập chăn ga (Collections.tsx).
 * Máy tính thấy 4 ô một lúc (ruột gối 5 món thì vuốt sang), điện thoại vuốt ngang gần 2 ô. Bấm ô sang trang sản phẩm.
 */

const SUMMER_QUILT_NAME = 'Chăn hè Lyocell'
const SUMMER_QUILT = collectionById('chan-he-lyocell')

/** "Xem tất cả" của từng nhóm: trang danh mục nhỏ (LISTINGS trong links.ts) có đúng các sản phẩm của nhóm */
const GROUP_LINKS: Readonly<Record<string, string>> = {
  'ruot-goi': '/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/',
  'ruot-chan': '/danh-muc-san-pham/san-pham/ruot-chan-goi/',
  'chan-topper': '/danh-muc-san-pham/san-pham/chan-topper-phu-kien/',
}

interface EssentialTile {
  name: string
  note: string
  price: string
  to: string
  image?: ImageSource
  imageNote: string
}

/** Một khoảng giá thì ghi "từ" giá thấp nhất (chi tiết từng cỡ ở trang sản phẩm) */
const priceText = (item: EssentialItem): string => (item.min === item.max ? formatVND(item.min) : `từ ${formatVND(item.min)}`)

/** Chăn hè là bộ sưu tập có phối màu, không phải sản phẩm lẻ: ảnh bìa và trang của bộ đó */
const toTile = (item: EssentialItem): EssentialTile => {
  const base = { name: item.name, note: item.note, price: priceText(item) }
  if (item.name === SUMMER_QUILT_NAME && SUMMER_QUILT) {
    return { ...base, to: collectionPath(SUMMER_QUILT), image: coverOf(SUMMER_QUILT), imageNote: item.name }
  }
  const product = productForEssential(item.name)
  // Tên trong ESSENTIALS ngắn ("Micro Fiber"), tên ô dùng tên đầy đủ của trang sản phẩm ("Ruột gối Micro Fiber")
  return product
    ? { ...base, name: product.name, to: productPath(product), image: product.image, imageNote: product.imageNote }
    : { ...base, to: PATHS.products, imageNote: item.name }
}

const GROUPS = ESSENTIALS.map((g) => ({
  id: g.id,
  title: g.title,
  subtitle: g.subtitle,
  to: GROUP_LINKS[g.id] ?? PATHS.products,
  tiles: g.items.map(toTile),
}))

export function Essentials() {
  return (
    <section id="ruot-chan-goi" aria-labelledby="essentials-title" className="py-14 sm:py-24">
      <Container>
        <SectionHeading
          id="essentials-title"
          title="Ruột chăn, ruột gối và phụ kiện"
          lead="Phần êm ái bên trong. Chọn độ êm hợp với thói quen ngủ của Quý khách: đặt online ngay, hoặc ghé cửa hàng Ecopillo để nằm thử từng loại gối."
        />

        <div className="mt-8 grid gap-10 sm:mt-12 sm:gap-14">
          {GROUPS.map((group) => (
            <EssentialRow key={group.id} group={group} />
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 text-sm text-ink-soft sm:mt-10">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-mist-600" />
          {/* Gói chữ vào một khối: không thì mỗi mảnh chữ, link thành một cột riêng của flex và số điện thoại bị bẻ dòng */}
          <span>
            Ruột gối, ruột chăn, topper và phụ kiện đều đặt online được; nhân viên gọi xác nhận trước khi giao. Cần tư vấn độ êm? Gọi
            hoặc nhắn Zalo{' '}
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
      </Container>
    </section>
  )
}

type Group = (typeof GROUPS)[number]

const RAIL_BUTTON =
  'flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-deep-900 shadow-[var(--shadow-soft)] transition hover:bg-mist-100 active:scale-95 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-700'

/**
 * Một nhóm: tiêu đề, "Xem tất cả", hàng ô vuốt ngang. Hàng dài hơn khung (ruột gối 5 món trên máy tính) thì có nút ‹ ›
 * cạnh "Xem tất cả" để khách biết còn ô phía sau (cùng ý owner hỏi cho dãy ảnh nhỏ trang sản phẩm 09/11/2026).
 * Điện thoại không cần nút: ô thứ ba lấp ló ở mép phải đã cho biết vuốt được.
 */
function EssentialRow({ group }: { group: Group }) {
  const listRef = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ canPrev: false, canNext: false })

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const update = () =>
      setEdge({ canPrev: list.scrollLeft > 4, canNext: list.scrollLeft + list.clientWidth < list.scrollWidth - 4 })
    update()
    list.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      list.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Mỗi lần bấm sang đúng một ô (bề ngang ô + khoảng cách)
  const step = (dir: 1 | -1) => {
    const list = listRef.current
    const first = list?.firstElementChild as HTMLElement | null
    if (!list || !first) return
    list.scrollBy({ left: dir * (first.offsetWidth + parseFloat(getComputedStyle(list).columnGap || '0')), behavior: 'smooth' })
  }
  const hasArrows = edge.canPrev || edge.canNext

  return (
    <div role="group" aria-labelledby={`essentials-${group.id}`}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 id={`essentials-${group.id}`} className="font-display text-[1.45rem] leading-tight text-deep-900 sm:text-[1.7rem]">
            {group.title}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{group.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to={group.to}
            aria-label={`Xem tất cả ${group.title.toLowerCase()}`}
            className="-my-2 inline-flex items-center gap-1 py-2 text-sm font-medium whitespace-nowrap text-deep-700 underline-offset-4 hover:underline"
          >
            Xem tất cả <Icon name="arrowRight" size={15} />
          </Link>
          {hasArrows && (
            <span className="hidden gap-2 sm:flex">
              <button type="button" onClick={() => step(-1)} disabled={!edge.canPrev} aria-label={`${group.title}: xem ô trước`} className={RAIL_BUTTON}>
                <Icon name="arrowLeft" size={16} />
              </button>
              <button type="button" onClick={() => step(1)} disabled={!edge.canNext} aria-label={`${group.title}: xem ô sau`} className={RAIL_BUTTON}>
                <Icon name="arrowRight" size={16} />
              </button>
            </span>
          )}
        </div>
      </div>
      {/* Một hàng vuốt ngang: máy tính 4 ô, máy tính bảng 3 ô, điện thoại 46% bề ngang, tràn ra hai mép màn hình */}
      <ul
        ref={listRef}
        className="-mx-5 mt-4 grid scroll-px-5 auto-cols-[46%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain px-5 pt-1 pb-3 [scrollbar-width:none] snap-x snap-mandatory sm:mx-0 sm:scroll-px-0 sm:auto-cols-[calc((100%-2*1rem)/3)] sm:gap-4 sm:px-0 lg:auto-cols-[calc((100%-3*1.25rem)/4)] lg:gap-5"
      >
        {group.tiles.map((tile, i) => (
          <li key={tile.name} data-reveal style={revealDelay(i)} className="min-w-0 snap-start">
            <EssentialCard tile={tile} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Ô ảnh vuông, cùng khuôn với ô Bộ sưu tập chăn ga (CollectionTile) */
function EssentialCard({ tile }: { tile: EssentialTile }) {
  return (
    <Link
      to={tile.to}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 sm:rounded-[1.75rem]"
    >
      <span className="relative block aspect-square overflow-hidden">
        <span className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <Placeholder className="h-full w-full" image={tile.image} note={tile.imageNote} sizes="(min-width: 1024px) 290px, (min-width: 640px) 33vw, 46vw" />
        </span>
      </span>
      <span className="flex flex-1 flex-col px-3 pt-2.5 pb-3 sm:px-5 sm:pt-4 sm:pb-5">
        <span className="font-display text-[1.1rem] leading-tight text-deep-900 sm:text-[1.35rem]">{tile.name}</span>
        <span className="mt-1 text-label text-ink-soft sm:text-meta">{tile.note}</span>
        <span className="tabular mt-auto pt-2 text-small font-medium text-deep-900">{tile.price}</span>
      </span>
    </Link>
  )
}
