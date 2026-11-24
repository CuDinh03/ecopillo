import { PolicyLayout } from '../components/policy/PolicyLayout'
import { RichText } from '../components/ui/RichText'
import { Navigate, useLocation } from 'react-router-dom'
import { hiddenPageTarget } from '../data/links'
import { policyBySlug } from '../data/policies'
import { POLICY_ALIASES } from '../data/policyNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { NotFoundPage } from './NotFoundPage'
import { Blocks } from '../components/ui/Blocks'
import { POLICY_CONTENT_ORDER } from '../data/pageLayout'

/** Một trang chính sách (giao hàng, thanh toán, đổi hàng, bảo hành, hướng dẫn mua hàng), chọn theo đường link */
export function PolicyPage() {
  const { pathname } = useLocation()
  const path = pathname.replace(/^\/|\/$/g, '')
  const alias = POLICY_ALIASES[path]
  const policy = policyBySlug(alias?.slug ?? path)
  const title = alias?.title ?? policy?.title
  usePageMeta(title ?? null, alias?.description ?? policy?.description)
  // Trang Ecopillo đã ẩn (bộ "Đầu các trang chính sách"): về trang Hỏi đáp như máy chủ trả 301 (trang-wp.php)
  const hidden = hiddenPageTarget(pathname)
  if (hidden) return <Navigate to={hidden} replace />
  if (!policy || !title) return <NotFoundPage />
  return (
    <PolicyLayout title={title} intro={policy.intro}>
      {/* Thứ tự, ẩn / hiện thẻ số và các mục: Nội dung web → Giao diện → Bố cục nội dung trang chính sách (đợt E6) */}
      <Blocks
        order={POLICY_CONTENT_ORDER}
        blocks={{
          the: (
            <>
              {/* 3 thẻ: một hàng; nhiều hơn (Bảo hành 5 thẻ, chị Phương 18/11/2026): 2 cột máy tính bảng, 3 cột máy tính */}
              <ul className={`mt-12 grid gap-3 first:mt-0 ${policy.highlights.length > 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-3'}`}>
                {policy.highlights.map((h) => (
                  <li key={h.label} className="rounded-[1.25rem] bg-mist-50 p-5 shadow-[var(--shadow-soft)]">
                    <p className="font-display text-[1.6rem] leading-tight text-deep-900">
                      <RichText text={h.value} />
                    </p>
                    <p className="mt-1.5 text-small leading-snug text-ink-soft">{h.label}</p>
                  </li>
                ))}
              </ul>
            </>
          ),
          muc: (
            <div className="mt-12 space-y-12 first:mt-0">
              {policy.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[1.85rem]">{section.title}</h2>
                  {section.body?.map((line) => (
                    <p key={line} className="chu-deu mt-4 leading-relaxed text-ink-soft">
                      <RichText text={line} />
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 space-y-2.5 leading-relaxed text-ink-soft">
                      {section.list.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-600" />
                          <span>
                            <RichText text={line} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.steps && (
                    <ol className="mt-5 space-y-4">
                      {section.steps.map((step, i) => (
                        <li key={step.title} className="flex gap-4">
                          <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-800 text-lead text-ivory">
                            {i + 1}
                          </span>
                          <span className="pt-1.5">
                            <span className="block font-medium text-deep-900">{step.title}</span>
                            <span className="mt-1 block leading-relaxed text-ink-soft">{step.text}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}
            </div>
          ),
        }}
      />
    </PolicyLayout>
  )
}
