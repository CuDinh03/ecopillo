import { SOCIAL_LINKS } from '../../data/brand'
import { Icon } from '../ui/Icon'

/**
 * Nền mỗi vòng theo màu hãng (anh Quang, Zalo 19/11/2026: "Youtube màu đỏ"; owner chọn phương án A 20/11/2026).
 * Mạng Ecopillo thêm ở Nội dung web mà chưa có màu ở đây thì dùng chàm.
 */
const BRAND_BG: Readonly<Record<string, string>> = {
  facebook: 'bg-facebook',
  tiktok: 'bg-tiktok',
  instagram: 'bg-instagram',
  youtube: 'bg-youtube',
  zalo: 'bg-zalo',
}

/** Hàng icon nhỏ dùng ở chân trang, trang Liên hệ và menu điện thoại; cùng màu trên nền chàm và nền sáng */
export function SocialIcons() {
  return (
    <ul className="flex flex-wrap gap-2">
      {SOCIAL_LINKS.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ecopillo trên ${s.label}`}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-ivory transition hover:-translate-y-0.5 hover:brightness-110 ${
              BRAND_BG[s.id] ?? 'bg-deep-800'
            }`}
          >
            {s.id === 'zalo' ? <span className="text-label font-medium">Zalo</span> : <Icon name={s.id} size={17} />}
          </a>
        </li>
      ))}
    </ul>
  )
}
