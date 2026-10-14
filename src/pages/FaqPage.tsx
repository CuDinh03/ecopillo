import { Link } from 'react-router-dom'
import { Faq } from '../components/home/Showrooms'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { POLICY_NAV } from '../data/policyNav'
import { usePageMeta } from '../hooks/usePageMeta'

/** Trang Hỏi đáp: câu hỏi thường gặp (biên bản mục 43) + lối tắt sang các trang chính sách */
export function FaqPage() {
  usePageMeta('Hỏi đáp', 'Câu hỏi thường gặp khi mua chăn ga gối đệm Ecopillo: giao hàng, kiểm hàng, đổi hàng, thanh toán khi nhận, may theo kích thước, bảo hành.')
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Hỏi đáp' }]}
        eyebrow="Hỏi đáp"
        title={
          <>
            Mua sắm an tâm
            <br />
            <em className="text-deep-700">với Ecopillo</em>
          </>
        }
        lead="Những câu Quý khách hỏi nhiều nhất về giao hàng, kiểm hàng, đổi hàng, thanh toán và bảo hành."
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {POLICY_NAV.map((p) => (
            <li key={p.to}>
              <Link
                to={p.to}
                className="inline-flex items-center gap-1 rounded-full bg-ivory px-4 py-2 text-[0.88rem] text-deep-900 ring-1 ring-cream-200 transition hover:ring-deep-700/40"
              >
                {p.label}
                <Icon name="arrowRight" size={13} className="opacity-60" />
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>
      <Faq standalone />
    </>
  )
}
