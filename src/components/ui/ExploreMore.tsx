import { Link } from 'react-router-dom'
import type { RelatedGroup } from '../../data/related'
import { Icon } from './Icon'

/**
 * Khối "Khám phá thêm" cuối trang: các nhóm link qua lại (sản phẩm, danh mục, cẩm nang, chính sách).
 * Máy tính chia cột theo nhóm; điện thoại xếp dọc, link chữ có vùng bấm đủ 40px.
 */
export function ExploreMore({ groups, className = '' }: { groups: readonly RelatedGroup[]; className?: string }) {
  const shown = groups.filter((g) => g.links.length > 0)
  if (shown.length === 0) return null
  return (
    <nav aria-labelledby="explore-title" className={`mt-16 border-t border-line pt-10 sm:mt-20 sm:pt-12 ${className}`}>
      <h2 id="explore-title" className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[2rem]">
        Khám phá thêm
      </h2>
      <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
        {shown.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h3 className="eyebrow">{group.title}</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex min-h-10 items-center justify-between gap-3 py-2.5 text-body-sm text-deep-900 transition-colors hover:text-deep-700"
                  >
                    <span className="min-w-0">
                      <span className="block leading-snug group-hover:underline group-hover:underline-offset-4">{link.label}</span>
                      {link.note && <span className="mt-0.5 block text-label text-ink-faint">{link.note}</span>}
                    </span>
                    <Icon
                      name="arrowRight"
                      size={15}
                      className="shrink-0 text-mist-600 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  )
}
