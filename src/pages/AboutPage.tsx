import { Link } from 'react-router-dom'
import { About } from '../components/home/About'
import { BrandVideo } from '../components/home/BrandVideo'
import { TrustStrip } from '../components/home/Craft'
import { CountUp } from '../components/ui/CountUp'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Placeholder } from '../components/ui/Placeholder'
import { buttonClass, Container, FillIn, LinkButton, SectionHeading } from '../components/ui/primitives'
import { HOTEL_PARTNERS } from '../data/content'
import { PATHS } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/**
 * Trang Giới thiệu (/gioi-thieu, giữ đường link web cũ). Ghép câu chuyện thương hiệu, triết lý
 * Tốt · Thật · Thiện, sứ mệnh, tầm nhìn (biên bản mục 11, 29, 41), phim thương hiệu và chứng nhận (mục 31).
 */

const STATS = [
  { value: '15+', label: 'năm trong nghề chăn ga gối đệm' },
  { value: '15.000+', label: 'gia đình, khách sạn tin dùng' },
  { value: '2', label: 'văn phòng tại Hà Nội và TP. HCM' },
] as const

const CERTIFICATES = [
  {
    name: 'ISO 9001:2015',
    text: 'Hệ thống quản lý chất lượng trong sản xuất được chứng nhận theo tiêu chuẩn quốc tế.',
    logo: '/images/partners/iso-9001.webp',
  },
  {
    name: 'TQC',
    text: 'Chứng nhận chất lượng sản phẩm, hàng hoá phù hợp tiêu chuẩn.',
    logo: '/images/partners/tqc.webp',
  },
  {
    name: 'Thương hiệu dẫn đầu Việt Nam 2025',
    text: 'Danh hiệu ghi nhận chất lượng sản phẩm và uy tín với khách hàng.',
    logo: null,
  },
] as const

export function AboutPage() {
  usePageMeta(
    'Giới thiệu',
    'Ecopillo: hơn 15 năm làm chăn ga gối đệm, triết lý Tốt · Thật · Thiện, vải Lyocell thân thiện môi trường, chứng nhận ISO 9001:2015 và TQC.',
  )

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Giới thiệu' }]}
        eyebrow="Về chúng tôi"
        title={
          <>
            Hơn 15 năm
            <br />
            <em className="text-deep-700">nâng niu giấc ngủ Việt</em>
          </>
        }
        lead="Ecopillo Eternal Việt Nam làm chăn ga gối đệm từ chất liệu thiên nhiên, với một mong muốn giản dị: mỗi gia đình có một chốn yên để ngủ ngon."
        aside={
          <ul className="grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((s, i) => (
              <li
                key={s.label}
                data-reveal
                style={revealDelay(i)}
                className={`rounded-[1.5rem] p-4 sm:p-5 ${i === 1 ? 'bg-deep-800 text-ivory' : 'bg-ivory ring-1 ring-cream-200'}`}
              >
                <p className={`font-display text-[1.6rem] leading-none whitespace-nowrap sm:text-[2.2rem] ${i === 1 ? 'text-ivory' : 'text-deep-900'}`}>
                  <CountUp value={s.value} />
                </p>
                <p className={`mt-2 text-[0.78rem] leading-snug sm:text-[0.88rem] ${i === 1 ? 'text-mist-200' : 'text-ink-soft'}`}>
                  {s.label}
                </p>
              </li>
            ))}
          </ul>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#ve-chung-toi" className={buttonClass('primary', 'md')}>
            Đọc câu chuyện
            <Icon name="chevronDown" size={17} />
          </a>
          <LinkButton to={PATHS.products} variant="secondary">
            Xem sản phẩm
          </LinkButton>
        </div>
      </PageHero>

      <About />

      <BrandVideo />

      <section aria-labelledby="cert-title" className="py-14 sm:py-28">
        <Container>
          <SectionHeading
            id="cert-title"
            eyebrow="Chứng nhận"
            title={
              <>
                Chất lượng <span className="text-mist-600 italic">có giấy tờ chứng minh</span>
              </>
            }
            lead="Ecopillo công khai các chứng nhận để Quý khách yên tâm về nguồn gốc và quy trình làm ra từng sản phẩm."
          />
          <p className="mt-5 text-sm">
            <FillIn>[ECOPILLO GỬI BẢN CHỤP GIẤY CHỨNG NHẬN ĐỂ ĐỐI CHIẾU ĐÚNG TÊN, NĂM CẤP]</FillIn>
          </p>
          <ul className="m-rail mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3">
            {CERTIFICATES.map((c, i) => (
              <li
                key={c.name}
                data-reveal
                style={revealDelay(i)}
                className="flex gap-5 rounded-[1.75rem] bg-cream-50 p-6 ring-1 ring-cream-200 sm:p-8 lg:flex-col"
              >
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-[var(--shadow-soft)]">
                  {c.logo ? (
                    <img src={c.logo} alt={`Chứng nhận ${c.name}`} loading="lazy" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <Icon name="award" size={34} className="text-mist-600" />
                  )}
                </span>
                <span>
                  <span className="font-display block text-[1.35rem] leading-tight text-deep-900">{c.name}</span>
                  <span className="mt-2 block text-[0.92rem] leading-relaxed text-ink-soft">{c.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="partner-title" className="bg-cream-50 py-14 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              id="partner-title"
              eyebrow="Khách hàng, đối tác"
              title="Đồng hành cùng khách sạn, resort"
              lead="Ngoài các gia đình, Ecopillo may chăn ga gối theo kích thước cho khách sạn, resort và nhà nghỉ trên cả nước."
            />
            <Link to={PATHS.hotel} className={buttonClass('primary', 'md', 'mt-8')}>
              Giải pháp cho khách sạn
              <Icon name="arrowRight" size={17} />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 lg:col-span-7">
            {HOTEL_PARTNERS.map((p, i) => (
              <li
                key={p.name}
                data-reveal
                style={revealDelay(i)}
                className="flex h-24 items-center justify-center rounded-2xl bg-ivory px-5 py-4 shadow-[var(--shadow-soft)] sm:h-32"
              >
                <img src={p.logo} alt={`Logo ${p.name}`} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <TrustStrip />

      <section aria-labelledby="visit-title" className="py-14 sm:py-24">
        <Container>
          <div className="grid overflow-hidden rounded-[2rem] bg-deep-900 text-ivory lg:grid-cols-2">
            <div className="p-7 sm:p-12">
              <p className="eyebrow !text-mist-300">Ghé thăm Ecopillo</p>
              <h2 id="visit-title" className="font-display mt-4 text-[2rem] leading-tight sm:text-[2.6rem]">
                Chạm tay vào chất vải trước khi chọn
              </h2>
              <p className="mt-4 max-w-md text-mist-200/90">
                Cảm nhận độ mềm mát của Lyocell, nằm thử gối và đệm, được tư vấn mẫu hợp với phòng ngủ của Quý khách.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton to={PATHS.distribution} variant="light">
                  <Icon name="pin" size={17} />
                  Hệ thống phân phối
                </LinkButton>
                <LinkButton to={PATHS.contact} variant="outlineLight">
                  Liên hệ
                </LinkButton>
              </div>
            </div>
            {/* Ảnh giữ chỗ cho ảnh công ty (biên bản: chờ Ecopillo gửi); khung cao theo phần chữ bên cạnh */}
            <div className="relative min-h-[240px]">
              <Placeholder
                tone="deep"
                className="absolute inset-0 h-full w-full !rounded-none"
                note="Ảnh công ty, văn phòng (chờ Ecopillo gửi)"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
