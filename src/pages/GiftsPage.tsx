import { Link } from 'react-router-dom'
import { Gifts } from '../components/home/Essentials'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Placeholder } from '../components/ui/Placeholder'
import { buttonClass, ContactButtons, Container, FillIn, SectionHeading } from '../components/ui/primitives'
import { collectionById, coverOf } from '../data/catalog'
import { collectionPathById } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/**
 * Trang Quà tặng (biên bản mục 34, 48): chương trình tri ân đang được Ecopillo chỉnh lại,
 * nên trang gồm phần quà hiện có + gợi ý chọn chăn ga làm quà theo dịp.
 */

const OCCASIONS = [
  {
    title: 'Quà cưới',
    text: 'Bộ chăn ga dệt Jacquard hoa văn nổi hoặc dòng cao nhất, cho căn phòng đầu tiên của đôi vợ chồng trẻ.',
    ids: ['eco-doris', 'eco-sweet'],
  },
  {
    title: 'Quà tân gia',
    text: 'Nhiều mẫu, nhiều màu để hợp với phòng ngủ mới. Có thể nhờ Ecopillo tư vấn theo ảnh phòng.',
    ids: ['eco-rosa', 'eco-vera'],
  },
  {
    title: 'Biếu cha mẹ, dịp Tết',
    text: 'Màu trơn, sắc nhã, vải mềm mát dễ chịu cho người lớn tuổi; kèm ruột gối êm nâng đỡ cổ vai.',
    ids: ['eco-tera', 'eco-liora'],
  },
] as const

const SERVICES = [
  { icon: 'box', title: 'Hộp đóng gói chỉn chu', text: 'Mỗi bộ đều đóng hộp, sẵn sàng để tặng.' },
  { icon: 'truck', title: 'Giao tận tay người nhận', text: 'Ghi địa chỉ người nhận khi đặt, thanh toán khi nhận hoặc nhờ nhân viên gọi xác nhận.' },
  { icon: 'ruler', title: 'Chưa rõ cỡ giường?', text: 'Gọi Ecopillo hỏi cách đo, hoặc đổi cỡ trong 7 ngày nếu chưa sử dụng.' },
] as const

export function GiftsPage() {
  usePageMeta('Quà tặng và sự kiện', 'Chương trình tri ân 15.000 khách hàng và gợi ý chọn chăn ga gối Ecopillo làm quà cưới, quà tân gia, quà biếu Tết.')

  return (
    <div className="pb-24">
      <PageHero
        crumbs={[{ label: 'Quà tặng và sự kiện' }]}
        eyebrow="Quà tặng và sự kiện"
        title={
          <>
            Món quà cho
            <br />
            <em className="text-deep-700">những giấc ngủ thương yêu</em>
          </>
        }
        lead="Mỗi bộ chăn ga Ecopillo đều kèm quà tri ân. Và một bộ chăn ga đẹp cũng là món quà được dùng mỗi ngày, nhắc người nhận nhớ tới Quý khách."
      >
        <a href="#qua-tang" className={buttonClass('primary', 'md', 'mt-8')}>
          Xem quà tri ân
          <Icon name="chevronDown" size={17} />
        </a>
      </PageHero>

      <Gifts standalone />

      <section aria-labelledby="occasion-title" className="py-14 sm:py-24">
        <Container>
          <SectionHeading
            id="occasion-title"
            eyebrow="Gợi ý chọn quà"
            title={
              <>
                Chọn theo <span className="text-mist-600 italic">từng dịp</span>
              </>
            }
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
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{o.text}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {o.ids.map((id) => (
                        <Link
                          key={id}
                          to={collectionPathById(id)}
                          className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-3.5 py-1.5 text-[0.85rem] text-deep-800 transition-colors hover:bg-mist-200"
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

      <section aria-labelledby="service-title" className="py-14 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading id="service-title" eyebrow="Tặng dễ dàng" title="Ecopillo lo phần còn lại" />
            <ContactButtons size="md" stretch className="mt-8" callLabel="Gọi tư vấn quà" />
            <p className="mt-5 text-sm">
              <FillIn>[ECOPILLO XÁC NHẬN: CÓ GÓI QUÀ, VIẾT THIỆP THEO YÊU CẦU KHÔNG]</FillIn>
            </p>
          </div>
          <ul className="grid gap-3 lg:col-span-7">
            {SERVICES.map((s, i) => (
              <li key={s.title} data-reveal style={revealDelay(i)} className="flex gap-4 rounded-[1.25rem] bg-mist-50 p-5 shadow-[var(--shadow-soft)] sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist-100 text-deep-800">
                  <Icon name={s.icon} size={20} />
                </span>
                <span>
                  <span className="block font-medium text-deep-900">{s.title}</span>
                  <span className="mt-1 block text-[0.9rem] leading-relaxed text-ink-soft">{s.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </div>
  )
}
