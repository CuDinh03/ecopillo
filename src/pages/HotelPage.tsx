import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageForm } from '../components/contact/MessageForm'
import { CrossfadeImage } from '../components/ui/CrossfadeImage'
import { Icon } from '../components/ui/Icon'
import { Breadcrumb } from '../components/ui/PageHero'
import { buttonClass, Container, FillIn } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { patternImage, productImage, type ImageSource } from '../data/catalog'
import { HOTEL_PARTNERS } from '../data/content'
import { HOTEL_BENEFITS, HOTEL_EYEBROW, HOTEL_INTRO, HOTEL_INTRO_HEADING } from '../data/hotel'
import { productsUrl } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/**
 * Trang Khách sạn và dự án (biên bản mục 30, 48): chăn ga gối cho khách sạn, resort, nhà nghỉ, dự án.
 * Bố cục kiểu tạp chí (mẫu 1, owner chọn 15/10/2026; mẫu: docs/de-xuat-trang-khach-san-du-an.html):
 * ảnh lớn nửa trang, chữ serif lớn, "bốn lớp của một chiếc giường" bấm đổi ảnh, câu trích trên nền chàm,
 * quy trình 5 số nghiêng, form báo giá cạnh ảnh phòng.
 * Form báo giá dùng chung form Liên hệ, chọn sẵn chủ đề "Khách sạn, nhà nghỉ".
 */

interface Layer {
  title: string
  text: string
  to: string
  image: ImageSource
}

const LAYERS: readonly Layer[] = [
  {
    title: 'Ga bọc, ga phủ',
    text: 'Trắng tinh hoặc màu theo nhận diện khách sạn.',
    to: productsUrl({ 'danh-muc': 'bo-chan-ga' }),
    image: patternImage('ES06', 'Phòng ngủ trải bộ chăn ga Eco Sweet ES06 trắng ngà'),
  },
  {
    title: 'Vỏ chăn, ruột chăn',
    text: 'Ruột chăn nhẹ, ấm, giặt máy được.',
    to: productsUrl({ 'danh-muc': 'chan' }),
    image: productImage('chan-long-vu-tu-nhien', 'Ruột chăn lông vũ tự nhiên Ecopillo'),
  },
  {
    title: 'Ruột gối, vỏ gối',
    text: 'Gối êm vừa, giữ phom sau nhiều lần giặt.',
    to: productsUrl({ 'danh-muc': 'goi' }),
    image: productImage('ruot-goi-long-vu-tu-nhien', 'Ruột gối lông vũ tự nhiên Ecopillo'),
  },
  {
    title: 'Đệm, tấm làm mềm',
    text: 'Đệm và topper nâng đỡ, đúng cỡ giường.',
    to: productsUrl({ 'danh-muc': 'dem' }),
    image: productImage('dem-lo-xo-eco-royal', 'Đệm lò xo Eco Royal'),
  },
]

const STEPS: readonly { title: string; text: string }[] = [
  { title: 'Khảo sát, tư vấn', text: 'Nhận số phòng, cỡ giường, phong cách; gửi mẫu vải để chọn.' },
  { title: 'Báo giá, may mẫu', text: 'Báo giá theo số lượng, may một bộ mẫu để duyệt chất liệu và màu.' },
  { title: 'Sản xuất', text: 'May theo số đo đã chốt, kiểm từng bộ trước khi đóng gói.' },
  { title: 'Giao, trải thử', text: 'Giao tận nơi, trải thử trên giường mẫu trước khi nghiệm thu.' },
  { title: 'Bổ sung, bảo hành', text: 'Bổ sung đúng mẫu khi cần, bảo hành theo hợp đồng.' },
]

const HERO_IMAGE = patternImage('ED10', 'Bộ ga phủ Eco Doris ED10 trắng tinh, phong cách phòng khách sạn')
const DETAIL_IMAGE = { src: '/images/details/vai-ed25.webp', alt: 'Cận chất vải Lyocell của bộ Eco Doris ED25' }
const QUOTE_IMAGE = patternImage('ET05', 'Phòng ngủ trải bộ chăn ga Eco Tera ET05 trắng ngà')

const twoDigits = (n: number) => String(n).padStart(2, '0')

export function HotelPage() {
  usePageMeta(
    'Chăn ga gối khách sạn và dự án',
    'Ecopillo chuyên cung cấp chăn, ga, gối, đệm số lượng lớn cho khách sạn, resort, nhà nghỉ và dự án lưu trú: đường may 4 mũi/cm, giải pháp đồng bộ, báo giá ưu đãi theo số lượng.',
  )

  return (
    // Không chừa khoảng dưới: phần báo giá tràn hết bề ngang, nối thẳng xuống chân trang
    <div>
      <HotelHero />
      <Partners />
      <BedLayers />
      <Reasons />
      <Steps />
      <Quote />
    </div>
  )
}

/** Đầu trang: chữ bên trái, ảnh phòng tràn nửa phải (điện thoại: ảnh trên, chữ dưới) */
function HotelHero() {
  return (
    <section aria-labelledby="page-title" className="grid grid-cols-1 border-b border-cream-200 lg:min-h-[min(40rem,calc(100svh-4.5rem))] lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden lg:order-2 lg:aspect-auto">
        <img
          src={HERO_IMAGE.src}
          srcSet={HERO_IMAGE.srcSet}
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt={HERO_IMAGE.alt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Góc phải: góc trái dưới ảnh có dấu mã mẫu in sẵn */}
        <span className="absolute right-4 bottom-3 rounded-full bg-ivory/90 px-3 py-1 text-[0.72rem] text-deep-900 lg:right-6 lg:bottom-5">
          Eco Doris ED10 · Trắng tinh
        </span>
      </div>
      {/* Lề trái bằng lề Container của trang để chữ thẳng hàng với các phần bên dưới */}
      <div className="flex flex-col justify-center px-5 pt-7 pb-10 sm:px-8 lg:py-16 lg:pr-12 lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
        <Breadcrumb items={[{ label: 'Khách sạn và dự án' }]} />
        <p className="eyebrow mt-8">{HOTEL_EYEBROW}</p>
        <h1 id="page-title" className="font-display mt-4 text-[2.6rem] leading-[1.02] text-balance text-deep-900 sm:text-[3.4rem] xl:text-[4rem]">
          Giấc ngủ năm sao <em className="block text-deep-700">cho khách lưu trú</em>
        </h1>
        <p className="mt-5 text-[0.8rem] font-semibold tracking-[0.12em] text-deep-700 uppercase">{HOTEL_INTRO_HEADING}</p>
        <div className="mt-3 max-w-lg space-y-3 text-[1rem] leading-relaxed text-ink-soft">
          {HOTEL_INTRO.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#bao-gia" className={buttonClass('primary', 'lg')}>
            Nhận báo giá
            <Icon name="arrowRight" size={18} />
          </a>
          <a href={CONTACT.hotlineTel} className={buttonClass('secondary', 'lg')}>
            <Icon name="phone" size={18} />
            {CONTACT.hotlineDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section aria-label="Khách sạn đã đồng hành" className="border-b border-cream-200 py-6 sm:py-8">
      <Container className="grid gap-4 lg:grid-cols-[12rem_1fr] lg:items-center">
        <p className="eyebrow">Đã đồng hành cùng</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HOTEL_PARTNERS.map((p) => (
            <li key={p.name} className="flex h-16 items-center justify-center rounded-xl bg-ivory px-4 py-2 ring-1 ring-cream-200 sm:h-20">
              <img src={p.logo} alt={`Logo ${p.name}`} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** "Một chiếc giường, bốn lớp êm": bấm lớp nào, ảnh lớn đổi theo; mỗi lớp có link sang danh mục sản phẩm */
function BedLayers() {
  const [active, setActive] = useState(0)
  const layer = LAYERS[active]
  return (
    <section aria-labelledby="layer-title" className="py-14 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-20">
        <div className="relative mr-4 lg:mr-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[0.35rem] bg-cream-100 sm:aspect-[5/4]">
            <CrossfadeImage image={layer.image} sizes="(min-width: 1024px) 640px, 100vw" />
          </div>
          <img
            src={DETAIL_IMAGE.src}
            alt={DETAIL_IMAGE.alt}
            loading="lazy"
            decoding="async"
            className="absolute -right-4 -bottom-6 aspect-square w-[42%] border-[6px] border-ivory object-cover shadow-[var(--shadow-lift)] lg:-right-10 lg:-bottom-10 lg:w-[38%]"
          />
        </div>
        <div>
          <header data-reveal="left">
            <p className="eyebrow">Sản phẩm cho phòng</p>
            <h2 id="layer-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.75rem]">
              Một chiếc giường, <em className="text-deep-700">bốn lớp êm</em>
            </h2>
          </header>
          <ol className="mt-6 border-b border-cream-200">
            {LAYERS.map((l, i) => {
              const isActive = i === active
              return (
                <li key={l.title} className="border-t border-cream-200">
                  <div className="grid grid-cols-[2.6rem_1fr_auto] items-baseline gap-x-3 py-4">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActive(i)}
                      className="group col-span-2 grid grid-cols-subgrid items-baseline text-left"
                    >
                      <span className="font-display row-span-2 text-[1.35rem] leading-none text-deep-700 italic">{twoDigits(i + 1)}</span>
                      <span
                        className={`font-display text-[1.25rem] leading-snug transition-colors ${
                          isActive ? 'text-deep-700' : 'text-deep-900 group-hover:text-deep-700'
                        }`}
                      >
                        {l.title}
                      </span>
                      <span className="col-start-2 mt-1 text-[0.86rem] text-ink-soft">{l.text}</span>
                    </button>
                    <Link
                      to={l.to}
                      aria-label={`Xem ${l.title.toLowerCase()}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-deep-800 transition hover:bg-mist-100 ${
                        isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                      }`}
                    >
                      <Icon name="arrowRight" size={18} />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}

/** Câu trích lớn trên nền chàm, bốn lợi ích (chữ Ecopillo gửi, mục 39) xếp hai cột */
function Reasons() {
  return (
    <section aria-labelledby="reason-title" className="grain relative overflow-hidden bg-deep-900 py-16 text-ivory sm:py-24">
      <Container className="relative grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <h2 id="reason-title" data-reveal="left" className="font-display text-[2.1rem] leading-[1.12] italic sm:text-[3.1rem]">
          “Bền cho vận hành, <em className="text-mist-300">êm cho khách nghỉ.</em>”
        </h2>
        <ul className="grid gap-7 sm:grid-cols-2 sm:gap-x-9">
          {HOTEL_BENEFITS.map((benefit, i) => (
            <li key={benefit} data-reveal style={revealDelay(i)} className="flex gap-3 border-t border-ivory/25 pt-4">
              <Icon name="check" size={18} strokeWidth={2.2} className="mt-1 shrink-0 text-mist-300" />
              <span className="font-display text-[1.2rem] leading-snug">{benefit}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function Steps() {
  return (
    <section aria-labelledby="step-title" className="py-16 sm:py-24">
      <Container>
        <header data-reveal="left">
          <p className="eyebrow">Cách làm việc</p>
          <h2 id="step-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.75rem]">
            Từ khảo sát <em className="text-deep-700">đến nghiệm thu</em>
          </h2>
        </header>
        <ol className="mt-8 grid lg:mt-12 lg:grid-cols-5 lg:gap-6">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              style={revealDelay(i)}
              className="grid grid-cols-[3.4rem_1fr] gap-x-3 border-t border-cream-200 py-4 lg:grid-cols-1 lg:border-t-2 lg:border-deep-800 lg:pt-5"
            >
              <span className="font-display text-[2.3rem] leading-none text-deep-700 italic lg:mb-3 lg:text-[3.2rem]">{twoDigits(i + 1)}</span>
              <div>
                <h3 className="font-medium text-deep-900">{s.title}</h3>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm">
          <FillIn>[ECOPILLO DUYỆT QUY TRÌNH, SỐ LƯỢNG TỐI THIỂU VÀ THỜI GIAN MAY CHO ĐƠN KHÁCH SẠN]</FillIn>
        </p>
      </Container>
    </section>
  )
}

/** Form báo giá cạnh ảnh phòng, tràn hết bề ngang trang */
function Quote() {
  return (
    <section id="bao-gia" aria-labelledby="quote-title" className="grid scroll-mt-[4.5rem] grid-cols-1 bg-mist-50 lg:grid-cols-[5fr_7fr]">
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
        <img
          src={QUOTE_IMAGE.src}
          srcSet={QUOTE_IMAGE.srcSet}
          sizes="(min-width: 1024px) 42vw, 100vw"
          alt={QUOTE_IMAGE.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 px-5 py-12 sm:px-8 sm:py-16 lg:py-20 lg:pr-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] lg:pl-14">
        <header data-reveal="left">
          <p className="eyebrow">Nhận báo giá</p>
          <h2 id="quote-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.6rem]">
            Gửi yêu cầu cho <em className="text-deep-700">dự án của Quý khách</em>
          </h2>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-ink-soft">
            Ghi số phòng, cỡ giường và món cần may. Bộ phận dự án gọi lại, gửi mẫu vải và báo giá riêng.
          </p>
        </header>
        <div className="mt-8 rounded-[1.5rem] bg-ivory p-5 ring-1 ring-cream-200 sm:p-8">
          <MessageForm
            defaultTopic="Khách sạn, nhà nghỉ"
            placeholder="Ví dụ: khách sạn 40 phòng ở Đà Nẵng, 20 giường 1m6 và 20 giường 1m8, cần ga bọc, vỏ chăn, ruột gối…"
            submitLabel="Gửi yêu cầu báo giá"
          />
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
          <li>
            <a href={CONTACT.hotlineTel} className="inline-flex items-center gap-2 text-deep-900 hover:underline">
              <Icon name="phone" size={17} className="text-deep-700" />
              <span className="tabular">{CONTACT.hotlineDisplay}</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 text-deep-900 hover:underline">
              <Icon name="mail" size={17} className="text-deep-700" />
              {CONTACT.email}
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
