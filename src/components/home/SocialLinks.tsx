import { SOCIAL_LINKS } from '../../data/brand'
import { Icon } from '../ui/Icon'

/** Hàng icon nhỏ dùng ở chân trang và menu điện thoại */
export function SocialIcons({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const style =
    tone === 'light'
      ? 'bg-deep-800 text-mist-100 hover:bg-deep-700 hover:text-ivory'
      : 'bg-mist-100 text-deep-900 hover:bg-mist-200'
  return (
    <ul className="flex flex-wrap gap-2">
      {SOCIAL_LINKS.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ecopillo trên ${s.label}`}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${style}`}
          >
            {s.id === 'zalo' ? <span className="text-label font-medium">Zalo</span> : <Icon name={s.id} size={17} />}
          </a>
        </li>
      ))}
    </ul>
  )
}
