import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { Container, LinkButton } from '../components/ui/primitives'
import { PATHS } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { COMMON_TEXT } from '../data/pageText/common'
import { NOT_FOUND_TEXT } from '../data/pageText/notFound'
import { Blocks } from '../components/ui/Blocks'
import { NOT_FOUND_ORDER } from '../data/pageLayout'

/**
 * Lối đi tiếp gần nhất cho khách bấm phải đường link cũ (biên bản mục 07: không để khách kẹt ở trang lỗi).
 * Chữ từng link Ecopillo sửa ở Nội dung web (NOT_FOUND_TEXT.goiY, cùng thứ tự); dòng để trống thì bỏ link đó.
 */
const SUGGESTION_PATHS = [PATHS.products, PATHS.blog, PATHS.faq, PATHS.contact] as const
const SUGGESTIONS = SUGGESTION_PATHS.flatMap((to, i) => {
  const label = NOT_FOUND_TEXT.goiY[i]?.trim()
  return label ? [{ to, label }] : []
})

export function NotFoundPage() {
  usePageMeta('Không tìm thấy trang', undefined, { notFound: true })
  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="eyebrow">{NOT_FOUND_TEXT.nhan}</p>
      <h1 className="font-display mt-4 text-[2.2rem] text-deep-900">{COMMON_TEXT.loi404TieuDe}</h1>
      <p className="mt-4 text-ink-soft">{COMMON_TEXT.loi404Chu}</p>
      {/* Thứ tự, ẩn / hiện: Nội dung web → Giao diện → Bố cục trang không tìm thấy (đợt E6) */}
      <Blocks
        order={NOT_FOUND_ORDER}
        blocks={{
          'goi-y': (
            <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="inline-flex items-center gap-1 rounded-full bg-cream-50 px-4 py-2 text-small text-deep-900 ring-1 ring-cream-200 transition hover:ring-deep-700/40"
                  >
                    {s.label}
                    <Icon name="arrowRight" size={13} className="opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          ),
          'trang-chu': (
            <LinkButton to="/" className="mt-8">
              {NOT_FOUND_TEXT.nutTrangChu}
            </LinkButton>
          ),
        }}
      />
    </Container>
  )
}
