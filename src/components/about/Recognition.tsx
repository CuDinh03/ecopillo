import { useRef, useState } from 'react'
import { CERTIFICATES, FOUNDER_HONOURS, type Certificate } from '../../data/about'
import type { Partner } from '../../data/content'
import { PRESS } from '../../data/press'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'

/**
 * Các khối "được ghi nhận" lấy từ catalog Ecopillo 22.07.2026 (owner chọn 24/10/2026, mẫu docs/de-xuat-phan-moi-catalog.html):
 * tủ chứng nhận (kiểu 1A), hàng logo báo đổi câu trích (2A), lưới logo đối tác (3A, 3B).
 */

/** Hộp xem to một giấy chứng nhận (thẻ <dialog> của trình duyệt: giữ focus bên trong, Esc để đóng) */
function useCertificateViewer() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [shown, setShown] = useState<Certificate | null>(null)
  const open = (certificate: Certificate) => {
    setShown(certificate)
    dialogRef.current?.showModal()
  }
  const viewer = (
    <dialog
      ref={dialogRef}
      aria-label={shown ? `Giấy ${shown.name}` : 'Giấy chứng nhận'}
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(34rem,calc(100%-2rem))] rounded-[1.5rem] bg-ivory p-4 backdrop:bg-deep-950/70 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[1.3rem] leading-tight text-deep-900">{shown?.name}</p>
          <p className="mt-1 text-small text-ink-soft">{shown?.text}</p>
        </div>
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
          src={`${shown.image}.webp`}
          alt={`Bản chụp giấy ${shown.name}`}
          decoding="async"
          className="mx-auto mt-4 max-h-[calc(100svh-12rem)] w-auto rounded-lg bg-white object-contain shadow-[var(--shadow-soft)]"
        />
      )}
    </dialog>
  )
  return { open, viewer }
}

interface CertificateCardProps {
  certificate: Certificate
  onOpen: (certificate: Certificate) => void
  compact?: boolean
  index: number
}

function CertificateCard({ certificate, onOpen, compact = false, index }: CertificateCardProps) {
  return (
    <li data-reveal style={revealDelay(index)}>
      <button
        type="button"
        onClick={() => onOpen(certificate)}
        aria-label={`Xem giấy ${certificate.name}`}
        className="group block h-full w-full rounded-2xl bg-ivory p-2.5 text-left shadow-[var(--shadow-soft)] transition duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-3"
      >
        <span className="block aspect-[3/4] overflow-hidden rounded-xl bg-mist-100 p-2 sm:p-3">
          <img
            src={`${certificate.image}-sm.webp`}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
          />
        </span>
        <span className={`block px-1 ${compact ? 'pt-2.5 pb-1' : 'pt-3 pb-1.5'}`}>
          <span className={`block leading-tight text-deep-900 ${compact ? 'text-small font-medium' : 'font-display text-[1.15rem]'}`}>
            {certificate.name}
          </span>
          <span className={`mt-1 block leading-snug text-ink-soft ${compact ? 'text-label' : 'text-small'}`}>{certificate.text}</span>
        </span>
      </button>
    </li>
  )
}

/** 1A: tủ chứng nhận, ba giấy chất lượng to, bốn ghi nhận dành cho chị Phương nhỏ hơn; bấm giấy nào xem to giấy đó */
export function CertificateCabinet() {
  const { open, viewer } = useCertificateViewer()
  return (
    <>
      <ul className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
        {CERTIFICATES.map((c, i) => (
          <CertificateCard key={c.image} certificate={c} onOpen={open} index={i} />
        ))}
      </ul>
      <p className="eyebrow mt-10 flex items-center gap-2">
        <Icon name="community" size={15} className="text-deep-700" /> Ghi nhận dành cho chị Phạm Thị Phương
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FOUNDER_HONOURS.map((c, i) => (
          <CertificateCard key={c.image} certificate={c} onOpen={open} index={i} compact />
        ))}
      </ul>
      {viewer}
    </>
  )
}

/**
 * Phần thu nhỏ ở trang Khách sạn và dự án: ba giấy chất lượng, ảnh thật thay biểu tượng, bấm xem to.
 * `showImages={false}`: chưa gắn ảnh (khung giữ nguyên cỡ), để trang tự gắn khi khách cuộn tới gần (xem useNearViewport).
 */
export function CertificateBadges({ showImages = true }: { showImages?: boolean }) {
  const { open, viewer } = useCertificateViewer()
  return (
    <>
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {CERTIFICATES.map((c) => (
          <li key={c.image}>
            <button
              type="button"
              onClick={() => open(c)}
              aria-label={`Xem giấy ${c.name}`}
              className="flex h-full w-full flex-col items-center gap-2 rounded-xl bg-ivory p-2.5 text-center shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)] sm:flex-row sm:gap-3 sm:p-3 sm:text-left"
            >
              <img
                src={showImages ? `${c.image}-sm.webp` : undefined}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-14 w-10 shrink-0 rounded bg-mist-100 object-contain p-0.5 sm:h-16 sm:w-12"
              />
              <span>
                <span className="block text-meta leading-snug font-medium text-deep-900 sm:text-body-sm">{c.short}</span>
                <span className="mt-0.5 hidden text-label text-ink-faint sm:block">Bấm xem giấy</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {viewer}
    </>
  )
}

/** 2A: hàng logo báo, bấm logo đổi câu trích; logo đang chọn hiện màu, logo khác xám nhạt */
export function PressQuotes() {
  const [active, setActive] = useState(0)
  const article = PRESS[active]
  return (
    <div className="mt-8">
      <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pt-1 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
        {PRESS.map((p, i) => {
          const isActive = i === active
          return (
            <li key={p.outlet} className="w-[42%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                aria-pressed={isActive}
                aria-label={`Câu trích của ${p.outlet}`}
                onClick={() => setActive(i)}
                className={`group flex h-16 w-full items-center justify-center rounded-xl bg-ivory px-3 py-2 shadow-[var(--shadow-soft)] transition active:scale-[0.97] sm:h-[4.5rem] ${
                  isActive ? 'ring-2 ring-deep-900' : ''
                }`}
              >
                <img
                  src={p.logo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`max-h-full max-w-full object-contain transition duration-200 ${
                    isActive ? '' : 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ul>
      {/* key: đổi báo thì câu trích hiện dần lại */}
      <figure key={article.outlet} className="fade-in mt-2 rounded-2xl bg-ivory p-6 shadow-[var(--shadow-soft)] sm:p-8" aria-live="polite">
        <blockquote className="font-display text-[1.25rem] leading-snug text-pretty text-deep-900 italic sm:text-[1.55rem]">
          <span aria-hidden="true" className="mb-1 block text-[3rem] leading-[0.6] text-deep-700 not-italic">
            “
          </span>
          {article.quote}
        </blockquote>
        <figcaption className="mt-4 text-small text-ink-soft">
          {article.speaker && `${article.speaker} · `}
          {article.outlet}
          {article.date && ` · ${article.date}`}
        </figcaption>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-deep-900 transition hover:bg-mist-100"
          >
            Đọc bài trên {article.outlet}
            <Icon name="arrowRight" size={15} />
          </a>
        )}
      </figure>
    </div>
  )
}

interface PartnerLogosProps {
  partners: readonly Partner[]
  className?: string
  itemClassName?: string
  /** `false`: chưa gắn ảnh (ô giữ nguyên cỡ), như CertificateBadges */
  showImages?: boolean
}

/** Lưới logo đối tác (4 cột máy tính, 2 cột điện thoại); dùng chung trang chủ, Về chúng tôi, Khách sạn và dự án */
export function PartnerLogos({ partners, className = '', itemClassName = 'h-16 sm:h-20', showImages = true }: PartnerLogosProps) {
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {partners.map((p, i) => (
        <li
          key={p.name}
          data-reveal
          style={revealDelay(i % 4)}
          className={`flex items-center justify-center rounded-xl bg-ivory px-4 py-2.5 shadow-[var(--shadow-soft)] ${itemClassName}`}
        >
          {/* Chưa gắn ảnh thì ẩn thẻ, kẻo trình duyệt hiện chữ thay thế trong ô */}
          <img
            src={showImages ? p.logo : undefined}
            alt={`Logo ${p.name}`}
            loading="lazy"
            decoding="async"
            className={`max-h-full max-w-full object-contain ${showImages ? '' : 'invisible'}`}
          />
        </li>
      ))}
    </ul>
  )
}
