import type { ReactNode } from 'react'
import type { ImageSource } from '../../data/catalog'
import { Icon, type IconName } from '../ui/Icon'

/**
 * Các khối dựng trang Giới thiệu dạng chương sách (mẫu 1, owner chọn 16/10/2026; mẫu: docs/de-xuat-trang-ve-chung-toi.html).
 * Cột chữ hẹp như trang sách, số chương La Mã lớn, ảnh rộng hơn cột chữ xen giữa các chương.
 */

/** Bề rộng cột chữ của một chương (khoảng 65 ký tự mỗi dòng) */
export const STORY_COLUMN = 'mx-auto w-full max-w-[760px] px-5 sm:px-8'

interface ChapterProps {
  /** Mã neo cho mục lục, ví dụ "chuong-1" */
  id: string
  /** Số La Mã; bỏ trống ở Lời mở */
  numeral?: string
  /** Biểu tượng nhỏ cạnh số chương, cùng bộ icon của web */
  icon: IconName
  eyebrow: string
  title: ReactNode
  children: ReactNode
}

export function Chapter({ id, numeral, icon, eyebrow, title, children }: ChapterProps) {
  return (
    <section id={id} aria-labelledby={`${id}-tieu-de`} className={`${STORY_COLUMN} scroll-mt-[5.5rem] pt-16 sm:pt-24`}>
      <header data-reveal="left">
        {numeral && (
          <p aria-hidden="true" className="font-display text-[4.6rem] leading-[0.9] text-deep-700 italic sm:text-[7rem]">
            {numeral}
          </p>
        )}
        <p className="eyebrow mt-3 flex items-center gap-2">
          <Icon name={icon} size={15} className="text-deep-700" />
          {numeral ? `Chương ${numeral} · ${eyebrow}` : eyebrow}
        </p>
        <h2 id={`${id}-tieu-de`} className="font-display mt-3 text-[2rem] leading-[1.1] text-balance text-deep-900 sm:text-[3rem]">
          {title}
        </h2>
      </header>
      {children}
    </section>
  )
}

/** Đoạn văn của chương; dropCap: chữ cái đầu to như sách in */
export function Prose({ children, dropCap = false }: { children: ReactNode; dropCap?: boolean }) {
  return (
    <p
      data-reveal
      className={`mt-5 text-body leading-[1.8] text-ink-soft sm:text-lead [&_strong]:font-medium [&_strong]:text-deep-900 ${
        dropCap
          ? 'first-letter:font-display first-letter:float-left first-letter:pt-1.5 first-letter:pr-2.5 first-letter:text-[4.4em] first-letter:leading-[0.78] first-letter:text-deep-900'
          : ''
      }`}
    >
      {children}
    </p>
  )
}

/** Ảnh rộng hơn cột chữ, có chú thích nghiêng bên dưới */
export function StoryFigure({ image, caption, aspect = 'aspect-[16/10]', position }: { image: ImageSource; caption: string; aspect?: string; position?: string }) {
  return (
    <figure data-reveal className="mx-auto mt-12 w-full max-w-[1080px] px-5 sm:mt-16 sm:px-8 lg:px-14">
      <div className={`${aspect} overflow-hidden rounded-[0.35rem] bg-cream-100`}>
        <img
          src={image.src}
          srcSet={image.srcSet || undefined}
          sizes={image.srcSet ? '(min-width: 1080px) 1000px, 100vw' : undefined}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          style={position ? { objectPosition: position } : undefined}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="font-display mt-3 text-center text-body-sm text-ink-faint italic">{caption}</figcaption>
    </figure>
  )
}

/** Câu trích giữa hai đường kẻ, có dấu ngoặc của bộ icon */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote data-reveal className="mt-10 border-y border-line py-7 text-center">
      <Icon name="quote" size={24} className="mx-auto text-deep-700/60" />
      <p className="font-display mt-3 text-[1.55rem] leading-snug text-balance text-deep-900 italic sm:text-[1.85rem]">{children}</p>
    </blockquote>
  )
}
