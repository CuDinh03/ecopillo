import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { Icon, ZaloMark } from './Icon'

/** Đánh dấu nội dung còn chờ chủ shop điền/xác nhận — để nổi bật, dễ tìm */
export function FillIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <mark
      className={`rounded-md border border-dashed border-brass-500/70 bg-brass-100 px-1.5 py-0.5 text-[0.85em] font-medium text-brass-600 [box-decoration-break:clone] ${className}`}
    >
      {children}
    </mark>
  )
}

const BTN_BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition duration-300 ease-[var(--ease-soft)] active:scale-[0.98] active:duration-[var(--dur-press)] disabled:cursor-not-allowed disabled:opacity-45'

const BTN_VARIANTS = {
  primary:
    'bg-deep-800 text-ivory shadow-[var(--shadow-soft)] hover:bg-deep-700 hover:shadow-[var(--shadow-lift)]',
  secondary: 'border border-deep-800/20 bg-ivory text-deep-800 hover:border-deep-800/50 hover:bg-white',
  ghost: 'text-deep-800 hover:bg-mist-100',
  light: 'bg-ivory text-deep-900 hover:bg-white shadow-[var(--shadow-soft)]',
  outlineLight: 'border border-ivory/35 text-ivory hover:bg-ivory/10 hover:border-ivory/70',
} as const

const BTN_SIZES = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-body-sm',
  lg: 'h-14 px-7 text-base',
} as const

export type ButtonVariant = keyof typeof BTN_VARIANTS
export type ButtonSize = keyof typeof BTN_SIZES

export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') =>
  `${BTN_BASE} ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${extra}`

interface LinkButtonProps {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function LinkButton({ to, children, variant, size, className }: LinkButtonProps) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  )
}

interface ContactButtonsProps {
  variant?: 'onLight' | 'onDark'
  /** Trên điện thoại, hai nút giãn hết chiều ngang cho dễ bấm */
  stretch?: boolean
  size?: ButtonSize
  className?: string
  zaloLabel?: string
  callLabel?: string
}

/** Cặp nút Gọi hotline + Zalo dùng lại nhiều nơi */
export function ContactButtons({
  variant = 'onLight',
  size = 'md',
  className = '',
  callLabel = `Gọi ${CONTACT.hotlineDisplay}`,
  zaloLabel = 'Nhắn Zalo',
  stretch = false,
}: ContactButtonsProps) {
  const onDark = variant === 'onDark'
  const grow = stretch ? 'flex-1 sm:flex-none' : ''
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={CONTACT.hotlineTel} className={buttonClass(onDark ? 'light' : 'primary', size, grow)}>
        <Icon name="phone" size={18} />
        {callLabel}
      </a>
      <a
        href={CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(onDark ? 'outlineLight' : 'secondary', size, grow)}
      >
        <ZaloMark tone={onDark ? 'light' : 'dark'} />
        {zaloLabel}
      </a>
    </div>
  )
}

interface SectionHeadingProps {
  /** Nhãn nhỏ trên tiêu đề: chỉ đặt khi mang thông tin, không nhắc lại tiêu đề (mẫu C trang chủ, owner duyệt 23/10/2026) */
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  id?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
  id,
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center'
  const dark = tone === 'dark'
  return (
    // Tiêu đề căn trái trượt vào từ trái, căn giữa thì nhích lên (hieu-ung, câu 1B)
    <header data-reveal={centered ? '' : 'left'} className={`${centered ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${dark ? '!text-mist-300' : ''}`}>{eyebrow}</p>}
      <h2
        id={id}
        className={`font-display text-[2rem] sm:text-[2.9rem] ${eyebrow ? 'mt-4' : ''} ${
          dark ? 'text-ivory' : 'text-deep-900'
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-5 text-body leading-relaxed ${dark ? 'text-mist-200/90' : 'text-ink-soft'} ${
            centered ? 'mx-auto' : ''
          } max-w-xl`}
        >
          {lead}
        </p>
      )}
    </header>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>
}
