import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Container } from './primitives'

export interface Crumb {
  label: string
  to?: string
}

/** Đường dẫn "Trang chủ / …" ở đầu mỗi trang con */
export function Breadcrumb({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Đường dẫn" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-deep-900">
            Trang chủ
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {item.to ? (
              <Link to={item.to} className="hover:text-deep-900">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-deep-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface PageHeroProps {
  crumbs: readonly Crumb[]
  eyebrow: string
  /** Tiêu đề trang: dòng thứ hai nghiêng, màu nhấn, giống trang Liên hệ */
  title: ReactNode
  lead?: ReactNode
  /** Cột phải (ảnh, thẻ số liệu…); không có thì tiêu đề chiếm cả hàng */
  aside?: ReactNode
  /** Nội dung thêm dưới đoạn dẫn (nút, danh sách) */
  children?: ReactNode
  tone?: 'cream' | 'deep'
  id?: string
}

/** Đầu trang con: cùng khuôn với trang Liên hệ để cả web đồng bộ */
export function PageHero({ crumbs, eyebrow, title, lead, aside, children, tone = 'cream', id = 'page-title' }: PageHeroProps) {
  const deep = tone === 'deep'
  return (
    <section
      aria-labelledby={id}
      className={deep ? 'grain relative overflow-hidden bg-deep-900 text-ivory' : 'border-b border-cream-200 bg-cream-50'}
    >
      <Container
        className={`relative grid gap-10 pt-10 pb-14 sm:pt-14 sm:pb-20 ${aside ? 'lg:grid-cols-12 lg:items-center lg:gap-14' : ''}`}
      >
        <div className={aside ? 'lg:col-span-6' : 'max-w-3xl'}>
          <div className={deep ? '[&_a]:text-mist-200 [&_a:hover]:text-ivory [&_nav]:text-mist-300 [&_[aria-current]]:text-ivory' : ''}>
            <Breadcrumb items={crumbs} />
          </div>
          <p className={`eyebrow mt-8 ${deep ? '!text-mist-300' : ''}`}>{eyebrow}</p>
          <h1
            id={id}
            className={`font-display mt-4 text-[2.4rem] leading-[1.05] text-balance sm:text-[3.4rem] ${deep ? 'text-ivory' : 'text-deep-900'}`}
          >
            {title}
          </h1>
          {lead && (
            <p className={`mt-5 max-w-xl text-[1.02rem] leading-relaxed ${deep ? 'text-mist-200/90' : 'text-ink-soft'}`}>{lead}</p>
          )}
          {children}
        </div>
        {aside && <div className="lg:col-span-6">{aside}</div>}
      </Container>
    </section>
  )
}
