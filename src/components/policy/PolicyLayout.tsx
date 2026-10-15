import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { POLICY_NAV } from '../../data/policyNav'
import { relatedForPolicy } from '../../data/related'
import { ExploreMore } from '../ui/ExploreMore'
import { PageHero } from '../ui/PageHero'
import { ContactButtons, Container } from '../ui/primitives'

interface PolicyLayoutProps {
  title: string
  intro: ReactNode
  /** Dòng nhỏ dưới đoạn dẫn, ví dụ ngày áp dụng */
  meta?: ReactNode
  children: ReactNode
}

/** Khuôn chung cho các trang chính sách: menu chính sách bên trái, nội dung bên phải */
export function PolicyLayout({ title, intro, meta, children }: PolicyLayoutProps) {
  const { pathname } = useLocation()
  return (
    <div className="pb-24">
      <PageHero crumbs={[{ label: 'Chính sách' }, { label: title }]} eyebrow="Chính sách mua hàng" title={title} lead={intro}>
        {meta}
      </PageHero>

      <Container className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-12 lg:gap-14">
        <aside className="min-w-0 lg:col-span-3">
          <nav aria-label="Các chính sách" className="lg:sticky lg:top-28">
            <p className="eyebrow hidden lg:block">Các chính sách</p>
            <ul className="m-rail -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-5 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
              {POLICY_NAV.map((item) => (
                <li key={item.to} className="shrink-0">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-full px-4 py-2 text-[0.9rem] whitespace-nowrap transition lg:rounded-xl lg:px-4 lg:py-2.5 ${
                        isActive
                          ? 'bg-deep-800 font-medium text-ivory'
                          : 'bg-cream-50 text-deep-900 ring-1 ring-cream-200 hover:ring-deep-700/40 lg:bg-transparent lg:ring-0 lg:hover:bg-mist-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 lg:col-span-9">
          <article className="max-w-3xl">{children}</article>

          <div className="mt-14 flex max-w-3xl flex-col gap-5 rounded-[2rem] bg-cream-50 p-6 ring-1 ring-cream-200 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-[1.4rem] text-deep-900">Còn điều chưa rõ?</p>
              <p className="mt-1 text-sm text-ink-soft">Gọi hoặc nhắn Zalo, Ecopillo trả lời ngay trong giờ làm việc.</p>
            </div>
            <ContactButtons size="md" stretch />
          </div>

          <ExploreMore groups={relatedForPolicy(pathname)} className="max-w-3xl" />
        </div>
      </Container>
    </div>
  )
}
