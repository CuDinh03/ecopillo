import { directionsUrl, pinEmbedUrl } from '../../data/brand'
import { KIND_LABEL, telHref, type Dealer } from '../../data/dealers'
import { Icon } from '../ui/Icon'
import { buttonClass } from '../ui/primitives'

interface DealerMapProps {
  /** Điểm đang xem; chưa có thì hiện khung trống */
  dealer: Dealer | undefined
  className?: string
}

/**
 * Bản đồ Google Maps nhúng cho điểm đang chọn, cùng cách làm với trang Liên hệ (khách yêu cầu 15/10/2026).
 * Không cần khoá API. Ghim đặt theo toạ độ (Google tra địa chỉ chữ có khi lệch), "Chỉ đường" đi theo địa chỉ chữ.
 */
export function DealerMap({ dealer, className = '' }: DealerMapProps) {
  return (
    <div className={`overflow-hidden rounded-[1.75rem] bg-ivory shadow-[var(--shadow-soft)] ${className}`}>
      {dealer ? (
        <iframe
          key={dealer.id}
          title={`Bản đồ ${dealer.ten}, ${dealer.dia_chi}`}
          src={pinEmbedUrl(dealer.lat, dealer.lng)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block aspect-[4/3] w-full border-0 bg-cream-50 lg:aspect-auto lg:h-[min(28rem,calc(100svh-20rem))]"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-cream-50 lg:aspect-auto lg:h-[min(28rem,calc(100svh-20rem))]" />
      )}
      {dealer && (
        <div className="p-5 sm:p-6">
          <p className="eyebrow">{KIND_LABEL[dealer.loai]}</p>
          <p className="font-display mt-1.5 text-[1.3rem] leading-tight text-deep-900">{dealer.ten}</p>
          <p className="mt-1 text-[0.92rem] text-ink-soft">{dealer.dia_chi}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={directionsUrl(dealer.dia_chi)} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'sm')}>
              <Icon name="pin" size={16} /> Chỉ đường
            </a>
            <a href={telHref(dealer)} className={buttonClass('secondary', 'sm')}>
              <Icon name="phone" size={15} /> Gọi {dealer.dien_thoai}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
