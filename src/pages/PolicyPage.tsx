import { PolicyLayout } from '../components/policy/PolicyLayout'
import { RichText } from '../components/ui/RichText'
import { useLocation } from 'react-router-dom'
import { policyBySlug } from '../data/policies'
import { POLICY_ALIASES } from '../data/policyNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { NotFoundPage } from './NotFoundPage'

/** Một trang chính sách (giao hàng, thanh toán, đổi hàng, bảo hành, hướng dẫn mua hàng), chọn theo đường link */
export function PolicyPage() {
  const { pathname } = useLocation()
  const path = pathname.replace(/^\/|\/$/g, '')
  const alias = POLICY_ALIASES[path]
  const policy = policyBySlug(alias?.slug ?? path)
  const title = alias?.title ?? policy?.title
  usePageMeta(title ?? null, policy?.description)
  if (!policy || !title) return <NotFoundPage />
  return (
    <PolicyLayout title={title} intro={policy.intro}>
      <ul className="grid gap-3 sm:grid-cols-3">
        {policy.highlights.map((h) => (
          <li key={h.label} className="rounded-[1.25rem] bg-mist-50 p-5 shadow-[var(--shadow-soft)]">
            <p className="font-display text-[1.6rem] leading-tight text-deep-900">
              <RichText text={h.value} />
            </p>
            <p className="mt-1.5 text-small leading-snug text-ink-soft">{h.label}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 space-y-12">
        {policy.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[1.85rem]">{section.title}</h2>
            {section.body?.map((line) => (
              <p key={line} className="mt-4 leading-relaxed text-ink-soft">
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
    </PolicyLayout>
  )
}
