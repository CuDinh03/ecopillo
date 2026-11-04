import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CertificateBadges, PartnerLogos } from '../components/about/Recognition'
import { MessageForm } from '../components/contact/MessageForm'
import { CrossfadeImage } from '../components/ui/CrossfadeImage'
import { Icon } from '../components/ui/Icon'
import { Breadcrumb } from '../components/ui/PageHero'
import { buttonClass, Container } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { productImage, type ImageSource } from '../data/catalog'
import { HOTEL_PARTNERS } from '../data/content'
import { HOTEL_BENEFITS, HOTEL_EYEBROW, HOTEL_INTRO, HOTEL_INTRO_HEADING, HOTEL_LINEN, HOTEL_PARTNER_POINTS, HOTEL_PHOTOS } from '../data/hotel'
import { productsUrl } from '../data/links'
import { useNearViewport } from '../hooks/useNearViewport'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/**
 * Trang Khách sạn và dự án (biên bản mục 30, 48): chăn ga gối cho khách sạn, resort, nhà nghỉ, dự án.
 * Bố cục kiểu tạp chí (mẫu 1, owner chọn 15/10/2026; mẫu: docs/de-xuat-trang-khach-san-du-an.html):
 * ảnh lớn nửa trang, chữ serif lớn, "sáu lớp đồ vải của một chiếc giường" bấm đổi ảnh, câu trích trên nền chàm,
 * quy trình 5 số nghiêng, form báo giá cạnh ảnh phòng.
 * Form báo giá dùng chung form Liên hệ, chọn sẵn chủ đề "Khách sạn, nhà nghỉ".
 */

interface Layer {
  title: string
  text: string
  /** Chất liệu theo catalog Ecopillo 22.07.2026 (trang 65) */
  material?: string
  /** Link sang danh mục sản phẩm; đồ vải chỉ làm cho khách sạn thì không có danh mục, nút dẫn xuống form báo giá */
  to?: string
  /** Chưa có ảnh (váy giường: owner cho để trống 24/10/2026) thì giữ ảnh của lớp đang mở trước đó */
  image?: ImageSource
}

const LAYERS: readonly Layer[] = [
  {
    title: 'Ga bọc, ga phủ',
    text: 'Trắng tinh hoặc màu theo nhận diện khách sạn.',
    material: HOTEL_LINEN.bedding,
    // Ga trắng khách sạn chưa có trang sản phẩm; trước 04/11/2026 dẫn sang bộ chăn ga gia đình (khách báo nhầm): dẫn xuống form báo giá
    image: HOTEL_PHOTOS.sheets,
  },
  {
    title: 'Vỏ chăn, ruột chăn',
    text: 'Vỏ chăn cùng bộ với ga. Ruột chăn nhẹ, ấm, giặt máy được.',
    to: productsUrl({ 'danh-muc': 'chan' }),
    image: productImage('chan-long-vu-tu-nhien', 'Ruột chăn lông vũ tự nhiên Ecopillo'),
  },
  {
    title: 'Ruột gối, vỏ gối',
    text: 'Vỏ gối cùng bộ. Gối êm vừa, giữ phom sau nhiều lần giặt.',
    to: productsUrl({ 'danh-muc': 'goi' }),
    image: productImage('ruot-goi-long-vu-tu-nhien', 'Ruột gối lông vũ tự nhiên Ecopillo'),
  },
  {
    title: 'Đệm, tấm làm mềm',
    text: 'Đệm và topper nâng đỡ, đúng cỡ giường.',
    to: productsUrl({ 'danh-muc': 'dem' }),
    image: productImage('dem-lo-xo-eco-royal', 'Đệm lò xo Eco Royal'),
  },
  // Hai lớp thêm theo trang 65 catalog (owner chọn kiểu 5B 24/10/2026)
  { title: 'Váy giường, tấm trang trí', text: HOTEL_LINEN.sizes, material: HOTEL_LINEN.valance },
  { title: 'Khăn tắm, khăn tay, khăn mặt', text: HOTEL_LINEN.sizes, material: HOTEL_LINEN.towels, image: HOTEL_PHOTOS.towels },
]

const STEPS: readonly { title: string; text: string }[] = [
  { title: 'Khảo sát, tư vấn', text: 'Nhận số phòng, cỡ giường, phong cách; gửi mẫu vải để chọn.' },
  { title: 'Báo giá, may mẫu', text: 'Báo giá theo số lượng, may một bộ mẫu để duyệt chất liệu và màu.' },
  { title: 'Sản xuất', text: 'May theo số đo đã chốt, kiểm từng bộ trước khi đóng gói.' },
  { title: 'Giao, trải thử', text: 'Giao tận nơi, trải thử trên giường mẫu trước khi nghiệm thu.' },
  { title: 'Bổ sung, bảo hành', text: 'Bổ sung đúng mẫu khi cần, bảo hành theo hợp đồng.' },
]

const HERO_IMAGE = HOTEL_PHOTOS.hero
const DETAIL_IMAGE = { src: '/images/details/vai-ed25.webp', alt: 'Cận chất vải Lyocell của bộ Eco Doris ED25' }
const QUOTE_IMAGE = HOTEL_PHOTOS.quote

const twoDigits = (n: number) => String(n).padStart(2, '0')

const layerLinkClass = (isActive: boolean) =>
  `flex h-10 w-10 items-center justify-center rounded-full text-deep-800 transition hover:bg-mist-100 ${
    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'
  }`

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
    <section aria-labelledby="page-title" className="grid grid-cols-1 border-b border-line lg:min-h-[min(40rem,calc(100svh-4.5rem))] lg:grid-cols-2">
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
      </div>
      {/* Lề trái bằng lề Container của trang để chữ thẳng hàng với các phần bên dưới */}
      <div className="flex flex-col justify-center px-5 pt-7 pb-10 sm:px-8 lg:py-16 lg:pr-12 lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
        <Breadcrumb items={[{ label: 'Khách sạn và dự án' }]} />
        <p className="eyebrow mt-8">{HOTEL_EYEBROW}</p>
        <h1 id="page-title" className="font-display mt-4 text-[2.6rem] leading-[1.02] text-balance text-deep-900 sm:text-[3.6rem] xl:text-[4rem]">
          Giấc ngủ năm sao <span className="block">cho khách lưu trú</span>
        </h1>
        {/* Viết thường như câu dẫn, trước in hoa giãn chữ chạy hai dòng khó đọc (B10, owner duyệt 24/10/2026) */}
        <p className="mt-5 max-w-sm text-lead leading-snug font-medium text-balance text-deep-800">{HOTEL_INTRO_HEADING}</p>
        {/* Chỉ đoạn đầu: đủ 3 đoạn thì phần đầu cao thêm, ảnh bị cắt lệch (owner báo 17/10/2026). Đoạn 2, 3 ở phần nền chàm */}
        <p className="mt-3 max-w-md text-body leading-relaxed text-ink-soft">{HOTEL_INTRO[0]}</p>
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

/**
 * Đối tác (kiểu 3B, owner chọn 24/10/2026): ba ý chính từ catalog 22.07.2026 cạnh lưới logo đối tác; ngay dưới là ba giấy chất lượng
 * thu nhỏ, bấm xem to (phần C của chứng chỉ). Mục 13: khách sạn vào trang phải thấy Ecopillo đã làm cho ai và có tiêu chuẩn gì.
 */
function Partners() {
  // Ảnh logo, giấy chứng nhận chỉ gắn khi khách cuộn tới gần: để ảnh bìa đầu trang có trọn đường truyền
  const [imagesRef, showImages] = useNearViewport<HTMLDivElement>()
  return (
    <section aria-labelledby="partners-title" className="border-b border-line py-14 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[5fr_6fr] lg:items-start lg:gap-16">
        <div>
          <header data-reveal="left">
            <p className="eyebrow">Đối tác của chúng tôi</p>
            <h2 id="partners-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.6rem]">
              Đối tác tin cậy của khách sạn, khu nghỉ dưỡng
            </h2>
          </header>
          <dl className="mt-6 border-b border-line">
            {HOTEL_PARTNER_POINTS.map((point, i) => (
              <div key={point.value} data-reveal style={revealDelay(i)} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[9.5rem_1fr] sm:gap-5">
                <dt className="font-display text-[1.5rem] leading-tight text-deep-900">{point.value}</dt>
                <dd className="text-small leading-relaxed text-ink-soft sm:pt-1">{point.text}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div ref={imagesRef} className="grid gap-8">
          <PartnerLogos partners={HOTEL_PARTNERS} itemClassName="h-20 sm:h-24" showImages={showImages} />
          <div>
            <p className="eyebrow">Chứng nhận, danh hiệu</p>
            <div className="mt-4">
              <CertificateBadges showImages={showImages} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/** "Một chiếc giường, sáu lớp đồ vải": bấm lớp nào, ảnh lớn đổi theo (lớp chưa có ảnh giữ ảnh trước); mỗi lớp có link sang danh mục sản phẩm */
function BedLayers() {
  const [active, setActive] = useState(0)
  // Lớp chưa có ảnh thì giữ ảnh của lớp có ảnh gần nhất phía trên
  const image = [...LAYERS.slice(0, active + 1)].reverse().find((l) => l.image)?.image ?? HOTEL_PHOTOS.sheets
  return (
    <section aria-labelledby="layer-title" className="py-14 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-20">
        <div className="relative mr-4 lg:mr-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[0.35rem] bg-cream-100 sm:aspect-[5/4]">
            <CrossfadeImage image={image} sizes="(min-width: 1024px) 640px, 100vw" />
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
            <h2 id="layer-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.9rem]">
              Một chiếc giường, sáu lớp đồ vải
            </h2>
          </header>
          <ol className="mt-6 border-b border-line">
            {LAYERS.map((l, i) => {
              const isActive = i === active
              return (
                <li key={l.title} className="border-t border-line">
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
                      {l.material && <span className="col-start-2 mt-1 text-small font-medium text-deep-800">{l.material}</span>}
                      <span className="col-start-2 mt-1 text-small text-ink-soft">{l.text}</span>
                    </button>
                    {l.to ? (
                      <Link to={l.to} aria-label={`Xem ${l.title.toLowerCase()}`} className={layerLinkClass(isActive)}>
                        <Icon name="arrowRight" size={18} />
                      </Link>
                    ) : (
                      <a href="#bao-gia" aria-label={`Nhận báo giá ${l.title.toLowerCase()}`} className={layerLinkClass(isActive)}>
                        <Icon name="arrowRight" size={18} />
                      </a>
                    )}
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

/** Câu trích lớn trên nền chàm kèm đoạn 2, 3 của chữ giới thiệu; bốn lợi ích (chữ Ecopillo gửi, mục 39) xếp hai cột */
function Reasons() {
  return (
    <section aria-labelledby="reason-title" className="grain relative overflow-hidden bg-deep-900 py-16 text-ivory sm:py-24">
      <Container className="relative grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div data-reveal="left">
          <h2 id="reason-title" className="font-display text-[2.1rem] leading-[1.12] italic sm:text-[3.1rem]">
            “Bền cho vận hành, êm cho khách nghỉ.”
          </h2>
          <div className="mt-6 space-y-3 text-body-sm leading-relaxed text-mist-200/90">
            {HOTEL_INTRO.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <ul className="grid content-start gap-7 sm:grid-cols-2 sm:gap-x-9 lg:self-center">
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
          <h2 id="step-title" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.9rem]">
            Từ khảo sát đến nghiệm thu
          </h2>
        </header>
        <ol className="mt-8 grid lg:mt-12 lg:grid-cols-5 lg:gap-6">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              style={revealDelay(i)}
              className="grid grid-cols-[3.4rem_1fr] gap-x-3 border-t border-line py-4 lg:grid-cols-1 lg:border-t-2 lg:border-deep-800 lg:pt-5"
            >
              <span className="font-display text-[2.3rem] leading-none text-deep-700 italic lg:mb-3 lg:text-[3.2rem]">{twoDigits(i + 1)}</span>
              <div>
                <h3 className="font-medium text-deep-900">{s.title}</h3>
                <p className="mt-1 text-small leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-small text-ink-soft">Số lượng tối thiểu và thời gian may Ecopillo báo theo từng dự án, cùng với báo giá.</p>
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
            Gửi yêu cầu cho dự án của Quý khách
          </h2>
          <p className="mt-4 max-w-xl text-body-sm leading-relaxed text-ink-soft">
            Ghi số phòng, cỡ giường và món cần may. Bộ phận dự án gọi lại, gửi mẫu vải và báo giá riêng.
          </p>
        </header>
        <div className="mt-8 rounded-[1.5rem] bg-ivory p-5 shadow-[var(--shadow-soft)] sm:p-8">
          <MessageForm
            defaultTopic="Khách sạn, nhà nghỉ"
            placeholder="Ví dụ: khách sạn 40 phòng ở Đà Nẵng, 20 giường 1m6 và 20 giường 1m8, cần ga bọc, vỏ chăn, ruột gối…"
            submitLabel="Gửi yêu cầu báo giá"
          />
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body-sm">
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
