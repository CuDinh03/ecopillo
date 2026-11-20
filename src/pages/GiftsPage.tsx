import { Link } from 'react-router-dom'
import { CorporateGifts } from '../components/gifts/CorporateGifts'
import { EventsStrip } from '../components/home/EventsStrip'
import { ThankYouLetters } from '../components/home/ThankYouLetters'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Placeholder } from '../components/ui/Placeholder'
import { buttonClass, ContactButtons, Container, SectionHeading } from '../components/ui/primitives'
import { collectionById, coverOf } from '../data/catalog'
import { collectionPathById } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'
import { GIFTS_TEXT } from '../data/pageText/gifts'
import { Lines } from '../components/ui/Highlight'
import { Blocks } from '../components/ui/Blocks'
import { GIFTS_ORDER } from '../data/pageLayout'

/**
 * Trang Quà tặng (biên bản mục 34, 48): quà tặng doanh nghiệp, sự kiện (Ecopillo gửi 27/10/2026, mẫu A),
 * thư cảm ơn + ưu đãi 5% (thay khối Tri ân 15.000 khách hàng, mục 11 phản hồi 05/11/2026),
 * sự kiện đồng hành, gợi ý chọn chăn ga làm quà theo dịp.
 */

/** Bộ sưu tập gợi ý cho từng dịp (theo thứ tự dòng); chữ các dịp, dịch vụ Ecopillo sửa ở Nội dung web (GIFTS_TEXT) */
const OCCASION_IDS: readonly (readonly string[])[] = [
  ['eco-doris', 'eco-sweet'],
  ['eco-rosa', 'eco-vera'],
  ['eco-tera', 'eco-liora'],
]
const OCCASIONS = GIFTS_TEXT.dip.slice(0, OCCASION_IDS.length).map((o, i) => ({ ...o, ids: OCCASION_IDS[i] }))

const SERVICE_ICONS = ['box', 'truck', 'ruler'] as const
const SERVICES = GIFTS_TEXT.dichVu.map((item, i) => ({ ...item, icon: SERVICE_ICONS[i % SERVICE_ICONS.length] }))

export function GiftsPage() {
  usePageMeta('Quà tặng và sự kiện', GIFTS_TEXT.moTaGoogle)

  return (
    <div className="pb-24">
      <PageHero
        crumbs={[{ label: 'Quà tặng và sự kiện' }]}
        eyebrow={GIFTS_TEXT.nhan}
        title={<Lines text={GIFTS_TEXT.tieuDe} breakClassName="max-sm:hidden" />}
        lead={GIFTS_TEXT.danDat}
      >
        <a href="#qua-tang" className={buttonClass('primary', 'md', 'mt-8')}>
          {GIFTS_TEXT.nutDau}
          <Icon name="chevronDown" size={17} />
        </a>
      </PageHero>

      {/* Thứ tự khối: Ecopillo đổi ở Nội dung web → Bố cục trang Quà tặng và sự kiện (src/data/pageLayout.ts).
          Sự kiện: mục 34 (khách 16/10/2026), dữ liệu chung với trang chủ (src/data/events.ts) */}
      <Blocks
        order={GIFTS_ORDER}
        blocks={{
          'qua-doanh-nghiep': (
            <CorporateGifts />
          ),
          'thu-cam-on': (
            <ThankYouLetters standalone />
          ),
          'su-kien': (
            <section id="su-kien" className="scroll-mt-24 py-14 sm:py-24">
              <Container>
                <EventsStrip standalone />
              </Container>
            </section>
          ),
          'chon-theo-dip': (
            <section aria-labelledby="occasion-title" className="py-14 sm:py-24">
              <Container>
                <SectionHeading
                  id="occasion-title"
                  eyebrow={GIFTS_TEXT.dipNhan}
                  title={GIFTS_TEXT.dipTieuDe}
                />
                <ul className="m-rail mt-10 grid gap-5 sm:mt-12 lg:grid-cols-3">
                  {OCCASIONS.map((o, i) => {
                    const cover = coverOf(collectionById(o.ids[0])!)
                    return (
                      <li key={o.title} data-reveal style={revealDelay(i)} className="flex flex-col overflow-hidden rounded-[1.75rem] bg-ivory shadow-[var(--shadow-soft)]">
                        <div className="aspect-[4/3]">
                          <Placeholder className="h-full w-full !rounded-none border-0" note={o.title} image={cover} sizes="(min-width: 1024px) 400px, 100vw" />
                        </div>
                        <div className="flex flex-1 flex-col p-6 sm:p-7">
                          <h3 className="font-display text-[1.5rem] leading-tight text-deep-900">{o.title}</h3>
                          <p className="mt-2 text-body-sm leading-relaxed text-ink-soft">{o.text}</p>
                          <div className="mt-auto flex flex-wrap gap-2 pt-5">
                            {o.ids.map((id) => (
                              <Link
                                key={id}
                                to={collectionPathById(id)}
                                className="inline-flex min-h-11 items-center gap-1 rounded-full bg-cream-100 px-3.5 py-1.5 text-small text-deep-800 transition-colors hover:bg-mist-200 active:bg-mist-200"
                              >
                                {collectionById(id)?.name}
                                <Icon name="arrowRight" size={13} />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </Container>
            </section>
          ),
          'dich-vu': (
            <section aria-labelledby="service-title" className="py-14 sm:py-24">
              <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
                <div className="lg:col-span-5">
                  <SectionHeading id="service-title" eyebrow={GIFTS_TEXT.dichVuNhan} title={GIFTS_TEXT.dichVuTieuDe} />
                  <ContactButtons size="md" stretch className="mt-8" callLabel={GIFTS_TEXT.dichVuNutGoi} />
                </div>
                <ul className="grid gap-3 lg:col-span-7">
                  {SERVICES.map((s, i) => (
                    <li key={s.title} data-reveal style={revealDelay(i)} className="flex gap-4 rounded-[1.25rem] bg-mist-50 p-5 shadow-[var(--shadow-soft)] sm:p-6">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-100 text-deep-800">
                        <Icon name={s.icon} size={20} />
                      </span>
                      <span>
                        <span className="block font-medium text-deep-900">{s.title}</span>
                        <span className="mt-1 block text-small leading-relaxed text-ink-soft">{s.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ),
        }}
      />
    </div>
  )
}
