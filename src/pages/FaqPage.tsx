import { Link } from 'react-router-dom'
import { Faq } from '../components/home/Showrooms'
import { JsonLd } from '../components/seo/JsonLd'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { FAQS } from '../data/content'
import { POLICY_NAV } from '../data/policyNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { faqLd } from '../lib/structuredData'
import { PATHS } from '../data/links'
import { FAQ_PAGE_TEXT } from '../data/pageText/faq'
import { Lines } from '../components/ui/Highlight'
import { FAQ_FREE_END, FAQ_FREE_START, FAQ_ORDER } from '../data/pageLayout'
import { Blocks } from '../components/ui/Blocks'

/** Ẩn / hiện các khối: Ecopillo chọn ở Nội dung web → Giao diện → Bố cục trang Hỏi đáp (đợt E6; chỉ hai khối nên không đổi chỗ) */
const FAQ_SHOWN: ReadonlySet<string> = new Set(FAQ_ORDER)

/** Trang Hỏi đáp: câu hỏi thường gặp (biên bản mục 43) + lối tắt sang các trang chính sách */
export function FaqPage() {
  usePageMeta('Hỏi đáp', FAQ_PAGE_TEXT.moTaGoogle)
  return (
    <>
      <PageHero
        crumbs={[{ label: FAQ_PAGE_TEXT.duongDan }]}
        eyebrow={FAQ_PAGE_TEXT.nhan}
        title={<Lines text={FAQ_PAGE_TEXT.tieuDe} />}
        lead={FAQ_PAGE_TEXT.danDat}
      >
        {FAQ_SHOWN.has('loi-tat') && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {/* Chị Phương 18/11/2026: bỏ nút Bảo vệ thông tin cá nhân ở đây (trang vẫn có ở chân trang, bước đặt hàng) */}
            {POLICY_NAV.filter((p) => p.to !== PATHS.privacy).map((p, i) => (
              <li key={`${i}-${p.to}`}>
                <Link
                  to={p.to}
                  className="inline-flex min-h-11 items-center gap-1 rounded-full bg-ivory px-4 py-2 text-small text-deep-900 ring-1 ring-cream-200 transition hover:ring-deep-700/40"
                >
                  {p.label}
                  <Icon name="arrowRight" size={13} className="opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageHero>
      {/* Khối tự do Ecopillo đặt "đầu trang" (Nội dung web → Giao diện → Khối tự do) */}
      <Blocks order={FAQ_FREE_START} blocks={{}} />
      {/* Ẩn câu hỏi thì bỏ luôn dữ liệu có cấu trúc (Google chỉ nhận câu hỏi có trên trang) */}
      {FAQ_SHOWN.has('cau-hoi') && (
        <>
          <Faq standalone />
          <JsonLd data={faqLd(FAQS)} />
        </>
      )}
      {/* Khối tự do Ecopillo đặt "cuối trang" (Nội dung web → Giao diện → Khối tự do) */}
      <Blocks order={FAQ_FREE_END} blocks={{}} />
    </>
  )
}
