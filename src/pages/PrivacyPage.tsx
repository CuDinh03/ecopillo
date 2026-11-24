import { CONTACT, SHOWROOMS } from '../data/brand'
import { PRIVACY_SECTIONS, PRIVACY_TEXT } from '../data/pageText/privacy'
import { PolicyLayout } from '../components/policy/PolicyLayout'
import { RichText } from '../components/ui/RichText'
import { usePageMeta } from '../hooks/usePageMeta'
import { Blocks } from '../components/ui/Blocks'
import { PRIVACY_ORDER } from '../data/pageLayout'

/** Chữ trang: src/data/pageText/privacy.ts (Ecopillo tự sửa ở Nội dung web → Trang chính sách) */
export function PrivacyPage() {
  usePageMeta(PRIVACY_TEXT.tieuDe, PRIVACY_TEXT.moTaGoogle)
  return (
    <PolicyLayout
      title={PRIVACY_TEXT.tieuDe}
      intro={PRIVACY_TEXT.moDau}
    >
      <div className="space-y-12">
        {/* Thứ tự, ẩn / hiện: Nội dung web → Giao diện → Bố cục nội dung trang Bảo vệ thông tin cá nhân (đợt E6) */}
        <Blocks
          order={PRIVACY_ORDER}
          blocks={{
            muc: (
              <>
                {PRIVACY_SECTIONS.map((section) => (
                  <section key={section.title}>
                    <h2 className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[1.85rem]">{section.title}</h2>
                    <ul className="chu-deu mt-4 space-y-2.5 leading-relaxed text-ink-soft">
                      {section.body.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-600" />
                          <span>
                            <RichText text={line} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </>
            ),
            'lien-he': (
              <section>
                <h2 className="font-display text-[1.6rem] leading-tight text-deep-900 sm:text-[1.85rem]">{PRIVACY_TEXT.lienHeTieuDe}</h2>
                <ul className="mt-4 space-y-2 leading-relaxed text-ink-soft">
                  <li>
                    Hotline/Zalo:{' '}
                    <a href={CONTACT.hotlineTel} className="-my-2 inline-flex min-h-11 items-center tabular text-deep-900 underline underline-offset-2">
                      {CONTACT.hotlineDisplay}
                    </a>
                  </li>
                  <li>
                    Email:{' '}
                    <a href={`mailto:${CONTACT.email}`} className="-my-2 inline-flex min-h-11 items-center text-deep-900 underline underline-offset-2">
                      {CONTACT.email}
                    </a>
                  </li>
                  <li>
                    {SHOWROOMS[0].kind}: {SHOWROOMS[0].address}
                  </li>
                </ul>
              </section>
            ),
          }}
        />
      </div>
    </PolicyLayout>
  )
}
