import { SOCIAL_LINKS } from '../../data/brand'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Container } from '../ui/primitives'

/** Khối "Theo dõi Ecopillo" — các kênh mạng xã hội, đặt nổi bật ở trang chủ */
export function SocialStrip() {
  return (
    <section aria-labelledby="social-title" className="border-y border-line py-10 sm:py-14">
      <Container className="flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-sm">
          <p className="eyebrow">Kết nối</p>
          <h2 id="social-title" className="font-display mt-3 text-[1.8rem] leading-tight text-deep-900 sm:text-[2.1rem]">
            Theo dõi Ecopillo
          </h2>
          <p className="mt-2 text-sm text-ink-soft">Mẫu mới, ưu đãi và mẹo chăm sóc chăn ga mỗi tuần.</p>
        </div>
        <ul className="hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5">
          {SOCIAL_LINKS.map((s, i) => (
            <li key={s.id} data-reveal style={revealDelay(i, 70)}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3.5 ring-1 ring-cream-200 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[var(--shadow-soft)] hover:ring-mist-300"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-800 text-ivory transition group-hover:bg-deep-700">
                  {s.id === 'zalo' ? (
                    <span className="text-[0.62rem] font-medium">Zalo</span>
                  ) : (
                    <Icon name={s.id} size={18} />
                  )}
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-medium text-deep-900">{s.label}</span>
                  <span className="block truncate text-[0.75rem] text-ink-soft">{s.handle}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="sm:hidden">
          <SocialIcons tone="dark" />
        </div>
      </Container>
    </section>
  )
}

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
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${style}`}
          >
            {s.id === 'zalo' ? <span className="text-[0.6rem] font-medium">Zalo</span> : <Icon name={s.id} size={17} />}
          </a>
        </li>
      ))}
    </ul>
  )
}
