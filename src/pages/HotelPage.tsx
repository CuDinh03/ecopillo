import { Link } from 'react-router-dom'
import { MessageForm } from '../components/contact/MessageForm'
import { Icon, type IconName } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Placeholder } from '../components/ui/Placeholder'
import { buttonClass, Container, FillIn, SectionHeading } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { patternImage } from '../data/catalog'
import { HOTEL_PARTNERS } from '../data/content'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/**
 * Trang Khách sạn (biên bản mục 30, 48): chăn ga gối cho khách sạn, resort, nhà nghỉ.
 * Form báo giá dùng chung form Liên hệ, chọn sẵn chủ đề "Khách sạn, nhà nghỉ".
 */

const REASONS: readonly { icon: IconName; title: string; text: string }[] = [
  { icon: 'ruler', title: 'May theo kích thước', text: 'Đo và may đúng cỡ giường của từng hạng phòng, kể cả giường kích thước lạ.' },
  { icon: 'stitch', title: 'Bền qua nhiều lần giặt', text: 'Đường may 4 mũi chắc, phẳng; chọn vải hợp với tần suất giặt công nghiệp.' },
  { icon: 'leaf', title: 'Vải Lyocell mát, mềm', text: 'Khách lưu trú cảm nhận rõ độ mềm mát, thoáng khí ngay đêm đầu tiên.' },
  { icon: 'box', title: 'Đồng bộ toàn dự án', text: 'Một mẫu, một màu cho toàn bộ phòng; bổ sung thêm về sau vẫn đúng màu.' },
]

const LINES: readonly { title: string; text: string; to: string }[] = [
  { title: 'Ga bọc, ga phủ', text: 'Trắng tinh hoặc màu theo nhận diện khách sạn.', to: '/san-pham?danh-muc=bo-chan-ga' },
  { title: 'Vỏ chăn, ruột chăn', text: 'Ruột chăn nhẹ, ấm, giặt máy được.', to: '/san-pham?danh-muc=chan' },
  { title: 'Ruột gối, vỏ gối', text: 'Gối êm vừa, giữ phom sau nhiều lần giặt.', to: '/san-pham?danh-muc=goi' },
  { title: 'Đệm, tấm làm mềm', text: 'Đệm và topper nâng đỡ, đúng cỡ giường.', to: '/san-pham?danh-muc=dem' },
]

const STEPS: readonly { title: string; text: string }[] = [
  { title: 'Khảo sát, tư vấn', text: 'Nhận số phòng, cỡ giường, phong cách; gửi mẫu vải để chọn.' },
  { title: 'Báo giá, may mẫu', text: 'Báo giá theo số lượng, may một bộ mẫu để duyệt chất liệu và màu.' },
  { title: 'Sản xuất', text: 'May theo số đo đã chốt, kiểm từng bộ trước khi đóng gói.' },
  { title: 'Giao, trải thử', text: 'Giao tận nơi, trải thử trên giường mẫu trước khi nghiệm thu.' },
  { title: 'Bổ sung, bảo hành', text: 'Bổ sung đúng mẫu khi cần, bảo hành theo hợp đồng.' },
]

export function HotelPage() {
  usePageMeta(
    'Chăn ga gối khách sạn',
    'Ecopillo may chăn ga gối đệm theo kích thước cho khách sạn, resort, nhà nghỉ: vải Lyocell, đường may 4 mũi, đồng bộ toàn dự án, báo giá riêng.',
  )

  return (
    <div className="pb-24">
      <PageHero
        tone="deep"
        crumbs={[{ label: 'Khách sạn' }]}
        eyebrow="Khách sạn · Resort · Nhà nghỉ"
        title={
          <>
            Giấc ngủ năm sao
            <br />
            <em className="text-mist-300">cho khách lưu trú</em>
          </>
        }
        lead="Ecopillo cung cấp chăn ga gối đệm số lượng lớn cho khách sạn, resort và nhà nghỉ, may theo kích thước từng hạng phòng."
        aside={
          <div data-reveal className="ecm-parallax aspect-[16/11] overflow-hidden rounded-[2rem]">
            <Placeholder
              tone="deep"
              className="h-full w-full"
              note="Ảnh phòng khách sạn đối tác sử dụng chăn ga Ecopillo"
              image={patternImage('ED10', 'Bộ ga phủ Eco Doris ED10 trắng tinh, phong cách phòng khách sạn')}
              sizes="(min-width: 1024px) 600px, 100vw"
              priority
            />
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#bao-gia" className={buttonClass('light', 'lg')}>
            Nhận báo giá
            <Icon name="arrowRight" size={18} />
          </a>
          <a href={CONTACT.hotlineTel} className={buttonClass('outlineLight', 'lg')}>
            <Icon name="phone" size={18} />
            {CONTACT.hotlineDisplay}
          </a>
        </div>
      </PageHero>

      <section aria-label="Khách sạn đã đồng hành" className="border-b border-cream-200 bg-cream-50 py-8 sm:py-10">
        <Container className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
          <p className="eyebrow shrink-0">Đã đồng hành cùng</p>
          <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
            {HOTEL_PARTNERS.map((p) => (
              <li key={p.name} className="flex h-16 items-center justify-center rounded-xl bg-ivory px-4 py-2 ring-1 ring-cream-200 sm:h-20">
                <img src={p.logo} alt={`Logo ${p.name}`} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="reason-title" className="py-14 sm:py-24">
        <Container>
          <SectionHeading
            id="reason-title"
            eyebrow="Vì sao chọn Ecopillo"
            title={
              <>
                Bền cho vận hành, <span className="text-mist-600 italic">êm cho khách nghỉ</span>
              </>
            }
          />
          <ul className="m-rail mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((r, i) => (
              <li key={r.title} data-reveal style={revealDelay(i)} className="rounded-[1.5rem] bg-ivory p-6 ring-1 ring-cream-200 sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist-100 text-deep-800">
                  <Icon name={r.icon} size={22} />
                </span>
                <h3 className="font-display mt-5 text-[1.3rem] leading-tight text-deep-900">{r.title}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{r.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="line-title" className="bg-cream-50 py-14 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionHeading
              id="line-title"
              eyebrow="Sản phẩm cho phòng"
              title="Đủ bộ cho một chiếc giường"
              lead="Chọn trọn bộ hoặc từng món. Mỗi món đều may được theo cỡ giường của khách sạn."
            />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {LINES.map((l, i) => (
              <li key={l.title} data-reveal style={revealDelay(i)}>
                <Link
                  to={l.to}
                  className="group flex h-full items-center justify-between gap-4 rounded-[1.25rem] bg-ivory p-5 ring-1 ring-cream-200 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] sm:p-6"
                >
                  <span>
                    <span className="block font-medium text-deep-900">{l.title}</span>
                    <span className="mt-1 block text-[0.88rem] text-ink-soft">{l.text}</span>
                  </span>
                  <Icon name="arrowRight" size={18} className="shrink-0 text-deep-800 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="step-title" className="py-14 sm:py-24">
        <Container>
          <SectionHeading id="step-title" eyebrow="Cách làm việc" title="Từ khảo sát đến nghiệm thu" />
          <ol className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal style={revealDelay(i)} className="relative rounded-[1.5rem] bg-mist-50 p-6 ring-1 ring-mist-200">
                <span className="font-display text-[2.4rem] leading-none text-mist-600 italic">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-medium text-deep-900">{s.title}</h3>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm">
            <FillIn>[ECOPILLO DUYỆT QUY TRÌNH, SỐ LƯỢNG TỐI THIỂU VÀ THỜI GIAN MAY CHO ĐƠN KHÁCH SẠN]</FillIn>
          </p>
        </Container>
      </section>

      <Container>
        <section
          id="bao-gia"
          aria-labelledby="quote-title"
          className="grid scroll-mt-28 gap-10 overflow-hidden rounded-[2rem] bg-deep-900 p-6 text-ivory sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14"
        >
          <div className="lg:col-span-5">
            <SectionHeading
              id="quote-title"
              tone="dark"
              eyebrow="Nhận báo giá"
              title="Gửi yêu cầu cho dự án của Quý khách"
              lead="Ghi số phòng, cỡ giường và món cần may. Bộ phận dự án gọi lại, gửi mẫu vải và báo giá riêng."
            />
            <ul className="mt-8 space-y-3 text-[0.95rem]">
              <li>
                <a href={CONTACT.hotlineTel} className="flex items-center gap-3 hover:underline">
                  <Icon name="phone" size={18} className="text-mist-300" />
                  <span className="tabular">{CONTACT.hotlineDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:underline">
                  <Icon name="mail" size={18} className="text-mist-300" />
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] bg-ivory p-6 text-deep-900 sm:p-8 lg:col-span-7">
            <MessageForm
              defaultTopic="Khách sạn, nhà nghỉ"
              placeholder="Ví dụ: khách sạn 40 phòng ở Đà Nẵng, 20 giường 1m6 và 20 giường 1m8, cần ga bọc, vỏ chăn, ruột gối…"
              submitLabel="Gửi yêu cầu báo giá"
            />
          </div>
        </section>
      </Container>
    </div>
  )
}
