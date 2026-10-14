import { useRef, type MouseEvent } from 'react'
import {
  DEFAULT_DEALER_PHOTO,
  formatKm,
  hoursText,
  KIND_LABEL,
  openStatus,
  telHref,
  zaloHref,
  type Dealer,
} from '../../data/dealers'
import { directionsUrl } from '../../data/brand'
import { Icon, ZaloMark } from '../ui/Icon'
import { buttonClass } from '../ui/primitives'

interface DealerCardProps {
  dealer: Dealer
  /** Khoảng cách tới khách, khi đã biết vị trí */
  km?: number
  selected?: boolean
  /** Bấm vào thẻ (không phải nút) để bản đồ bay tới ghim */
  onSelect?: () => void
  /** Điểm gần khách nhất: điện thoại hiện ảnh rộng, nút to; mọi màn hình có nhãn "Gần Quý khách nhất" */
  featured?: boolean
}

/** Ảnh bìa trên thẻ; bấm vào xem đủ ảnh khi điểm có từ 2 ảnh. flush: ảnh tràn mép thẻ, không bo góc riêng */
function Photos({ dealer, flush = false }: { dealer: Dealer; flush?: boolean }) {
  const corner = flush ? '' : 'rounded-xl sm:rounded-none'
  const dialogRef = useRef<HTMLDialogElement>(null)
  const photos = dealer.anh.length > 0 ? dealer.anh : [DEFAULT_DEALER_PHOTO]
  const cover = (
    <img
      src={photos[0]}
      alt={dealer.anh.length > 0 ? `Cửa hàng ${dealer.ten}` : 'Ecopillo'}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  )
  if (photos.length < 2) return <div className={`h-full overflow-hidden ${corner}`}>{cover}</div>
  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={`relative block h-full w-full overflow-hidden ${corner}`}
        aria-label={`Xem ${photos.length} ảnh ${dealer.ten}`}
      >
        {cover}
        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-deep-900/80 px-2 py-0.5 text-[0.7rem] text-ivory">
          <Icon name="image" size={12} /> {photos.length}
        </span>
      </button>
      <dialog
        ref={dialogRef}
        aria-label={`Ảnh ${dealer.ten}`}
        className="m-auto w-[min(56rem,calc(100%-2rem))] rounded-[1.5rem] bg-ivory p-4 backdrop:bg-deep-950/70 sm:p-6"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-[1.3rem] text-deep-900">{dealer.ten}</p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-50 text-deep-900"
            aria-label="Đóng"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="m-rail mt-4 flex snap-x gap-3 overflow-x-auto">
          {photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${dealer.ten}, ảnh ${i + 1}`}
              loading="lazy"
              className="aspect-[4/3] w-[85%] shrink-0 snap-center rounded-xl object-cover sm:w-[70%]"
            />
          ))}
        </div>
      </dialog>
    </>
  )
}

/** Chỉ đường, Gọi (số riêng của điểm), Zalo */
function Actions({ dealer, className, size = 'sm' }: { dealer: Dealer; className: string; size?: 'sm' | 'md' }) {
  return (
    <div className={`gap-1.5 sm:flex-wrap sm:gap-2 ${className}`}>
      <a
        href={directionsUrl(dealer.dia_chi)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass('primary', size, 'flex-1 max-sm:!px-2 max-sm:text-[0.85rem] sm:flex-none')}
      >
        <Icon name="navigate" size={15} /> Chỉ đường
      </a>
      <a href={telHref(dealer)} className={buttonClass('secondary', size, 'flex-1 max-sm:!px-2 max-sm:text-[0.85rem] sm:flex-none')}>
        <Icon name="phone" size={15} /> Gọi
      </a>
      <a href={zaloHref(dealer)} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', size, 'flex-1 max-sm:!px-2 max-sm:text-[0.85rem] sm:flex-none')}>
        <ZaloMark /> Zalo
      </a>
    </div>
  )
}

export function DealerCard({ dealer, km, selected = false, onSelect, featured = false }: DealerCardProps) {
  const status = openStatus(dealer)
  const official = dealer.loai !== 'dai-ly'

  // Bấm vào vùng trống của thẻ thì chọn; bấm nút, link thì để nút tự làm việc của nó
  const handleClick = (e: MouseEvent) => {
    if (!onSelect || (e.target as HTMLElement).closest('a, button, dialog')) return
    onSelect()
  }

  return (
    <article
      id={`diem-${dealer.id}`}
      onClick={handleClick}
      className={`scroll-mt-32 overflow-hidden rounded-[1.5rem] bg-ivory transition ${onSelect ? 'cursor-pointer' : ''} ${
        selected
          ? 'ring-2 ring-deep-700 shadow-[var(--shadow-lift)]'
          : 'ring-1 ring-cream-200 hover:shadow-[var(--shadow-soft)]'
      }`}
    >
      {/* Thẻ thường trên điện thoại: ảnh nhỏ bên trái. Thẻ gần nhất: ảnh rộng phía trên. Từ sm: ảnh cột trái cao hết thẻ */}
      <div
        className={`grid sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-0 sm:p-0 ${
          featured ? 'grid-cols-1' : 'grid-cols-[64px_minmax(0,1fr)] gap-3 p-4'
        }`}
      >
        <div className={`sm:h-full sm:min-h-[220px] ${featured ? 'h-44' : 'h-16'}`}>
          <Photos dealer={dealer} flush={featured} />
        </div>
        <div className={`flex min-w-0 flex-col sm:p-6 ${featured ? 'p-4 pb-0' : ''}`}>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {featured && (
              <span className="rounded-full bg-mist-100 px-2.5 py-0.5 text-[0.68rem] font-semibold tracking-[0.12em] text-deep-900 uppercase">
                Gần Quý khách nhất
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase ${
                official ? 'bg-deep-800 text-ivory' : 'bg-cream-50 text-deep-800 ring-1 ring-cream-200'
              }`}
            >
              {KIND_LABEL[dealer.loai]}
            </span>
            {km !== undefined && <span className="tabular text-[0.82rem] font-medium text-deep-700">cách khoảng {formatKm(km)}</span>}
          </p>
          <h3 className="font-display mt-2 text-[1.3rem] leading-tight text-deep-900 sm:text-[1.45rem]">{dealer.ten}</h3>
          <p className="mt-1 text-[0.9rem] text-ink-soft">{dealer.dia_chi}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[0.85rem]">
            <span className={`inline-flex items-center gap-1.5 font-medium ${status.open ? 'text-deep-700' : 'text-ink-faint'}`}>
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${status.open ? 'bg-deep-700' : 'bg-ink-faint'}`} />
              {status.text}
            </span>
            {/* Điện thoại: thẻ thường chỉ ghi đang mở hay đóng để thẻ gọn; giờ đầy đủ ở thẻ gần nhất và màn hình lớn */}
            <span className={`text-ink-faint ${featured ? '' : 'max-sm:hidden'}`}>· {hoursText(dealer)}</span>
          </p>
          {dealer.ghi_chu && <p className="mt-1.5 text-[0.85rem] text-deep-900">{dealer.ghi_chu}</p>}
          {/* Máy tính, máy tính bảng: nút nằm trong cột chữ, ảnh cao hết thẻ */}
          <Actions dealer={dealer} className="mt-auto hidden pt-5 sm:flex" />
        </div>
      </div>
      {/* Điện thoại: nút trải đều dưới thẻ, dễ bấm bằng ngón cái */}
      <Actions dealer={dealer} size={featured ? 'md' : 'sm'} className={`flex px-4 pb-4 sm:hidden ${featured ? 'pt-4' : ''}`} />
    </article>
  )
}
