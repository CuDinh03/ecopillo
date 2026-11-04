import type { MouseEvent } from 'react'
import { formatVND } from '../../lib/format'
import { scrollToElement } from '../../lib/scroll'
import { SHELVES, type Shelf } from '../../data/productShelves'
import { Placeholder } from '../ui/Placeholder'

const tileNote = (shelf: Shelf): string => {
  if (shelf.category === 'bo-chan-ga') return `${shelf.products.length} bộ · ${shelf.count} mẫu`
  if (shelf.category === 'dem') return `${shelf.count} mẫu · từ ${formatVND(shelf.min)}`
  return `${shelf.count} mẫu`
}

/**
 * Bốn ô ảnh nhóm đầu mục "Tất cả" (phương án 1 + 2, owner chốt 02/11/2026): bấm ô thì cuộn tới kệ của nhóm đó.
 * Ô Đệm có viền trắng cho nổi hơn (khách: "phần đệm tìm mãi mới thấy"). Điện thoại 2×2, từ 640px một hàng 4 ô.
 */
export function GroupTiles() {
  const goTo = (e: MouseEvent<HTMLAnchorElement>, shelf: Shelf) => {
    const target = document.getElementById(shelf.id)
    if (!target) return
    e.preventDefault()
    scrollToElement(target)
  }
  return (
    <nav aria-label="Nhóm sản phẩm" className="mt-5 sm:mt-6">
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {SHELVES.map((shelf) => (
          <li key={shelf.category}>
            <a
              href={`#${shelf.id}`}
              onClick={(e) => goTo(e, shelf)}
              className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist-600 ${
                shelf.category === 'dem' ? 'ring-[3px] ring-ivory' : ''
              }`}
            >
              <Placeholder
                className="absolute inset-0 h-full w-full !rounded-none border-0 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                tone="mist"
                note={shelf.label}
                image={{ ...shelf.tileImage, alt: '' }}
                sizes="(min-width: 640px) 240px, 50vw"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-deep-950/0 from-40% to-deep-950/80" />
              <span className="absolute inset-x-3 bottom-2.5 text-ivory sm:inset-x-3.5 sm:bottom-3">
                {/* Khổ 320px: chữ đậm 600 rộng hơn, "Đệm & topper" ở 1,15rem rớt hai dòng và bị mép ô cắt (04/11/2026) */}
                <span className="font-display block text-[1.05rem] leading-tight min-[360px]:text-[1.15rem] sm:text-[1.2rem] lg:text-[1.35rem]">
                  {shelf.label}
                </span>
                <span className="tabular block text-label opacity-90">{tileNote(shelf)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

