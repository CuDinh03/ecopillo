import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { Container, LinkButton } from '../components/ui/primitives'
import { usePageMeta } from '../hooks/usePageMeta'

/** Lối đi tiếp gần nhất cho khách bấm phải đường link cũ (biên bản mục 07: không để khách kẹt ở trang lỗi) */
const SUGGESTIONS = [
  { to: '/san-pham', label: 'Sản phẩm' },
  { to: '/tin-tuc', label: 'Tin tức, cẩm nang' },
  { to: '/hoi-dap', label: 'Hỏi đáp, chính sách' },
  { to: '/lien-he', label: 'Liên hệ' },
] as const

export function NotFoundPage() {
  usePageMeta('Không tìm thấy trang')
  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="eyebrow">Lỗi 404</p>
      <h1 className="font-display mt-4 text-[2.2rem] text-deep-900">Trang này đã đi ngủ mất rồi</h1>
      <p className="mt-4 text-ink-soft">Đường dẫn không tồn tại hoặc đã được đổi. Quý khách thử một trong các trang dưới đây.</p>
      <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <li key={s.to}>
            <Link
              to={s.to}
              className="inline-flex items-center gap-1 rounded-full bg-cream-50 px-4 py-2 text-[0.9rem] text-deep-900 ring-1 ring-cream-200 transition hover:ring-deep-700/40"
            >
              {s.label}
              <Icon name="arrowRight" size={13} className="opacity-60" />
            </Link>
          </li>
        ))}
      </ul>
      <LinkButton to="/" className="mt-8">
        Về trang chủ
      </LinkButton>
    </Container>
  )
}
