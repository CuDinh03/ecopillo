import type { ReactNode } from 'react'
import type { ImageSource } from '../../data/catalog'
import { Icon, type IconName } from '../ui/Icon'

/**
 * Các khối dựng trang Giới thiệu (mẫu 2, owner chọn 09/11/2026; mẫu: docs/de-xuat-gioi-thieu-dai-ly-09-11.html).
 * Khách chê bản chương sách cũ "lộn xộn", "bố cục rời rạc", "số I II to quá": nay mỗi chương là một khối trắng,
 * các khối nối bằng một đường chỉ chàm bên trái, số chương là vòng tròn nhỏ nằm trên đường chỉ.
 * Câu trích mọi chương cùng một kiểu ô xanh nhạt; nhãn chương in đậm màu chàm đậm.
 */

/** Nhãn nhỏ in đậm trong khối (Sứ mệnh, Tầm nhìn, Giá trị cốt lõi…): chị Phương 09/11/2026 "in đậm" */
export const STORY_LABEL = 'text-label font-bold tracking-[0.14em] text-deep-900 uppercase'

/**
 * Dải chứa các chương. Đường chỉ: điện thoại cách mép trái 19px, máy tính 51px; tâm vòng số nằm đúng trên đường.
 * Đầu đường bắt đầu ở tâm vòng đầu tiên, cuối đường dừng gần đáy khối cuối.
 */
export function StoryRail({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[860px] pt-4 pr-4 pl-10 before:absolute before:top-[5.1rem] before:bottom-10 before:left-[19px] before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-deep-700 before:to-deep-700/25 sm:pt-8 sm:pr-8 sm:pl-[88px] sm:before:top-[7.1rem] sm:before:left-[51px]">
      {children}
    </div>
  )
}

interface ChapterProps {
  /** Mã neo cho mục lục, ví dụ "chuong-1" */
  id: string
  /** Số La Mã; bỏ trống ở Lời mở, Thư, Phim: vòng tròn hiện biểu tượng thay số */
  numeral?: string
  /** Biểu tượng trong vòng tròn khi không có số chương */
  icon: IconName
  eyebrow: string
  title: ReactNode
  /** Tiêu đề chỉ cho trình đọc màn hình (Lời mở: nhãn đã đủ nghĩa) */
  isTitleHidden?: boolean
  children: ReactNode
}

export function Chapter({ id, numeral, icon, eyebrow, title, isTitleHidden = false, children }: ChapterProps) {
  const titleId = `${id}-tieu-de`
  return (
    <section id={id} aria-labelledby={titleId} className="relative scroll-mt-[5.5rem] pt-9">
      {/* Vòng số trên đường chỉ; viền màu nền để đường chỉ như chui sau vòng */}
      <span
        aria-hidden="true"
        className="absolute top-12 -left-9 grid h-[34px] w-[34px] place-items-center rounded-full bg-deep-900 text-[0.95rem] text-ivory shadow-[0_0_0_4px_var(--color-page)] sm:top-[3.75rem] sm:-left-[58px] sm:h-11 sm:w-11 sm:text-[1.15rem] sm:shadow-[0_0_0_6px_var(--color-page)]"
      >
        {numeral ? <span className="font-display leading-none italic">{numeral}</span> : <Icon name={icon} size={16} />}
      </span>
      <div className="rounded-[1.25rem] bg-ivory px-[18px] pt-[22px] pb-6 shadow-[var(--shadow-soft)] sm:rounded-[1.5rem] sm:px-9 sm:pt-8 sm:pb-9">
        <header data-reveal="left">
          {/* Gạch ngắn canh dòng đầu: nhãn dài xuống dòng trên điện thoại thì gạch không trôi xuống giữa */}
          <p className={`flex items-start gap-2 ${STORY_LABEL}`}>
            <span aria-hidden="true" className="mt-[0.6em] h-0.5 w-[22px] shrink-0 rounded-full bg-deep-700" />
            {numeral ? `Chương ${numeral} · ${eyebrow}` : eyebrow}
          </p>
          <h2
            id={titleId}
            className={isTitleHidden ? 'sr-only' : 'font-display mt-2.5 text-[2rem] leading-[1.1] text-balance text-deep-900 sm:text-[2.6rem]'}
          >
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  )
}

/** Đoạn văn của chương; dropCap: chữ cái đầu to như sách in */
export function Prose({ children, dropCap = false }: { children: ReactNode; dropCap?: boolean }) {
  return (
    <p
      data-reveal
      className={`mt-4 text-body leading-[1.8] text-ink-soft sm:text-[1.0625rem] [&_strong]:font-medium [&_strong]:text-deep-900 ${
        dropCap
          ? 'first-letter:font-display first-letter:float-left first-letter:pt-1.5 first-letter:pr-2.5 first-letter:text-[4.4em] first-letter:leading-[0.78] first-letter:text-deep-900'
          : ''
      }`}
    >
      {children}
    </p>
  )
}

/** Ảnh trong khối chương, chú thích nghiêng bên dưới căn trái */
export function StoryFigure({ image, caption, aspect = 'aspect-[16/10]', position }: { image: ImageSource; caption: string; aspect?: string; position?: string }) {
  return (
    <figure data-reveal className="mt-6">
      <div className={`${aspect} overflow-hidden rounded-2xl bg-mist-100`}>
        <img
          src={image.src}
          srcSet={image.srcSet || undefined}
          sizes={image.srcSet ? '(min-width: 860px) 680px, 100vw' : undefined}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          style={position ? { objectPosition: position } : undefined}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="font-display mt-2.5 text-body-sm text-ink-faint italic">{caption}</figcaption>
    </figure>
  )
}

/**
 * Câu nổi bật trong ô xanh nhạt, cùng một kiểu ở mọi chương (thay hai đường kẻ cũ và hộp trắng lạc màu ở chương II).
 * isQuote=false: câu định nghĩa, không phải lời trích (Chốn Yên), dùng thẻ p thay blockquote.
 */
export function PullQuote({ children, isQuote = true }: { children: ReactNode; isQuote?: boolean }) {
  const Tag = isQuote ? 'blockquote' : 'p'
  return (
    <Tag
      data-reveal
      className="font-display mt-6 rounded-2xl bg-mist-100 p-[18px] text-center text-[1.2rem] leading-[1.35] text-balance text-deep-900 italic sm:px-6 sm:py-[22px] sm:text-[1.4rem]"
    >
      {children}
    </Tag>
  )
}
