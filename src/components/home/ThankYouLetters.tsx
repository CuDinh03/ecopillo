import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { THANK_YOU, THANK_YOU_CARDS } from '../../data/thankYou'
import type { ImageSource } from '../../data/catalog'
import { productsUrl } from '../../data/links'
import { buttonClass, Container } from '../ui/primitives'
import { Icon } from '../ui/Icon'

/**
 * Thư cảm ơn + ưu đãi 5% (mục 11 phản hồi 05/11/2026, owner chọn kiểu A).
 * Thay khối "Tri ân 15.000 khách hàng" (quà kèm). Hai thiệp xoè bên trái, chữ bên phải.
 * Dùng chung trang chủ và trang Quà tặng và sự kiện.
 */

interface ThankYouLettersProps {
  /** Trang Quà tặng: nút dẫn sang danh sách bộ chăn ga thay vì cuộn tới #bo-suu-tap */
  standalone?: boolean
}

function CardButton({
  image,
  className,
  onOpen,
}: {
  image: ImageSource
  className?: string
  onOpen: (image: ImageSource) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      aria-label={`Xem to ${image.alt.split(':')[0].toLowerCase()}`}
      className={`overflow-hidden rounded-xl border-[6px] border-white bg-white shadow-[var(--shadow-lift)] transition duration-500 ease-[var(--ease-soft)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-mist-600 ${className ?? ''}`}
    >
      <img
        src={image.src}
        srcSet={image.srcSet || undefined}
        sizes="(min-width: 1024px) 230px, 150px"
        alt={image.alt}
        width={1000}
        height={1400}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
      />
    </button>
  )
}

export function ThankYouLetters({ standalone = false }: ThankYouLettersProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [shown, setShown] = useState<ImageSource | null>(null)

  const open = (image: ImageSource) => {
    setShown(image)
    dialogRef.current?.showModal()
  }

  return (
    <section
      id="qua-tang"
      aria-labelledby="thank-you-title"
      className={standalone ? 'scroll-mt-24 py-14 sm:py-24' : 'pb-14 sm:pb-24'}
    >
      <Container>
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[2.25rem] bg-ivory px-5 py-10 shadow-[var(--shadow-soft)] sm:px-10 sm:py-12 lg:grid-cols-[5fr_7fr] lg:gap-14 lg:px-16 lg:py-16">
          {/* Hai thiệp xoè như vừa mở phong bì */}
          <div className="group/xoe relative mx-auto h-[268px] w-full max-w-[320px] sm:h-[320px] sm:max-w-[380px] lg:mx-0 lg:h-[430px] lg:max-w-none">
            <CardButton
              image={THANK_YOU_CARDS.front}
              onOpen={open}
              className="absolute top-1.5 left-[4%] w-[150px] -rotate-[7deg] transition duration-500 ease-[var(--ease-soft)] group-hover/xoe:-translate-x-3.5 group-hover/xoe:-rotate-[10deg] sm:w-[180px] lg:top-2.5 lg:left-[6%] lg:w-[230px]"
            />
            <CardButton
              image={THANK_YOU_CARDS.inside}
              onOpen={open}
              className="absolute top-5 left-[38%] w-[150px] rotate-[5deg] transition duration-500 ease-[var(--ease-soft)] group-hover/xoe:translate-x-3.5 group-hover/xoe:rotate-[7deg] sm:w-[180px] lg:top-8 lg:w-[230px]"
            />
          </div>

          <div>
            <span className="inline-block rounded-full bg-brass-100 px-3 py-0.5 text-[0.78rem] font-semibold tracking-wide text-deep-800">
              {THANK_YOU.eyebrow}
            </span>
            <h2 id="thank-you-title" className="font-display mt-3.5 max-w-[16ch] text-[1.75rem] leading-[1.08] text-deep-900 sm:text-[2.2rem] lg:text-[2.6rem]">
              {THANK_YOU.title}
            </h2>
            <p className="font-display mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-deep-800 italic sm:text-[1.12rem]">
              “{THANK_YOU.quote}”
            </p>
            <p className="mt-3.5 max-w-[56ch] text-[0.86rem] leading-relaxed text-ink-soft sm:text-[0.95rem]">
              {THANK_YOU.body}
            </p>
            {/* Không hiện nhãn chờ (owner 28/10): đơn nào kèm thư, mã / hạn dùng chờ Ecopillo (câu hỏi Excel) */}
            <p className="mt-3.5 text-[0.84rem] leading-relaxed text-ink-faint">{THANK_YOU.howToUseLead}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={() => open(THANK_YOU_CARDS.inside)} className={buttonClass('primary', 'md', 'justify-center')}>
                {THANK_YOU.viewLabel}
              </button>
              {standalone ? (
                <Link to={productsUrl({ 'danh-muc': 'bo-chan-ga' })} className={buttonClass('secondary', 'md', 'justify-center')}>
                  Xem bộ chăn ga
                  <Icon name="arrowRight" size={17} />
                </Link>
              ) : (
                <a href="#bo-suu-tap" className={buttonClass('secondary', 'md', 'justify-center')}>
                  {THANK_YOU.chooseLabel}
                  <Icon name="arrowRight" size={17} />
                </a>
              )}
            </div>
            {standalone && (
              <p className="mt-4 text-meta text-ink-faint">
                Quà tặng doanh nghiệp, sự kiện vẫn ở phần trên trang này ·{' '}
                <a href="#qua-tang-doanh-nghiep" className="underline underline-offset-4 hover:text-deep-800">
                  xem lại
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </Container>

      <dialog
        ref={dialogRef}
        aria-label={shown ? shown.alt.split(':')[0] : 'Thư cảm ơn'}
        className="m-auto max-h-[calc(100svh-2rem)] w-[min(28rem,calc(100%-2rem))] rounded-[1.5rem] bg-ivory p-3 backdrop:bg-deep-950/70 sm:p-5"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-[1.15rem] leading-tight text-deep-900">
            {shown?.alt.split(':')[0] ?? 'Thư cảm ơn'}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-100 text-deep-900"
            aria-label="Đóng"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        {shown && (
          <img
            src={shown.src}
            srcSet={shown.srcSet || undefined}
            sizes="(min-width: 640px) 420px, 90vw"
            alt={shown.alt}
            width={1000}
            height={1400}
            decoding="async"
            className="mx-auto mt-3 max-h-[calc(100svh-10rem)] w-auto rounded-lg bg-white object-contain shadow-[var(--shadow-soft)]"
          />
        )}
      </dialog>
    </section>
  )
}
