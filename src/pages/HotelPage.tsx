import { useState } from 'react'
import { CertificateBadges, PartnerLogos } from '../components/about/Recognition'
import { MessageForm } from '../components/contact/MessageForm'
import { HotelProducts } from '../components/hotel/HotelProducts'
import { WhiteGoods } from '../components/hotel/WhiteGoods'
import { scrollToElement } from '../lib/scroll'
import { Icon } from '../components/ui/Icon'
import { Breadcrumb } from '../components/ui/PageHero'
import { buttonClass, Container } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { HOTEL_PARTNERS } from '../data/content'
import { HOTEL_BENEFITS, HOTEL_EYEBROW, HOTEL_INTRO, HOTEL_INTRO_HEADING, HOTEL_PARTNER_POINTS, HOTEL_PHOTOS } from '../data/hotel'
import { useNearViewport } from '../hooks/useNearViewport'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/**
 * Trang Khách sạn và dự án (biên bản mục 30, 48): chăn ga gối cho khách sạn, resort, nhà nghỉ, dự án.
 * Bố cục kiểu tạp chí (mẫu 1, owner chọn 15/10/2026): ảnh lớn nửa trang, chữ serif lớn,
 * khối Hàng trắng ba tab (phản hồi 05/11 mục 12, phương án C — thay "sáu lớp đồ vải"),
 * chín sản phẩm của danh mục khách sạn web cũ (khách yêu cầu 09/11/2026),
 * câu trích trên nền chàm, quy trình 5 số nghiêng, form báo giá cạnh ảnh phòng.
 * Form báo giá dùng chung form Liên hệ, chọn sẵn chủ đề "Khách sạn, nhà nghỉ".
 */

const STEPS: readonly { title: string; text: string }[] = [
  { title: 'Khảo sát, tư vấn', text: 'Nhận số phòng, cỡ giường, phong cách; gửi mẫu vải để chọn.' },
  { title: 'Báo giá, may mẫu', text: 'Báo giá theo số lượng, may một bộ mẫu để duyệt chất liệu và màu.' },
  { title: 'Sản xuất', text: 'May theo số đo đã chốt, kiểm từng bộ trước khi đóng gói.' },
  { title: 'Giao, trải thử', text: 'Giao tận nơi, trải thử trên giường mẫu trước khi nghiệm thu.' },
  { title: 'Bổ sung, bảo hành', text: 'Bổ sung đúng mẫu khi cần, bảo hành theo hợp đồng.' },
]

const HERO_IMAGE = HOTEL_PHOTOS.hero
const QUOTE_IMAGE = HOTEL_PHOTOS.quote

const twoDigits = (n: number) => String(n).padStart(2, '0')

export function HotelPage() {
  usePageMeta(
    'Chăn ga gối khách sạn và dự án',
    // Mô tả viết tay 08/11/2026 (C2, chờ Ecopillo duyệt)
    'Ecopillo cung cấp chăn ga gối đệm số lượng lớn cho khách sạn, resort, nhà nghỉ: đường may 4 mũi/cm, giải pháp đồng bộ, báo giá theo số lượng.',
  )
  // Chữ điền sẵn vào form khi bấm "Liên hệ báo giá" từ một món Hàng trắng
  const [quotePrefill, setQuotePrefill] = useState({ message: '', key: 0 })
  const prefillQuote = (message: string) => setQuotePrefill((prev) => ({ message, key: prev.key + 1 }))
  // Thẻ "Giá liên hệ" ở khối Sản phẩm: điền sẵn form rồi cuộn xuống (Hàng trắng tự cuộn trong component của nó)
  const quoteProduct = (name: string) => {
    prefillQuote(`Cần báo giá: ${name}`)
    const target = document.getElementById('bao-gia')
    if (target) scrollToElement(target, 'start')
  }

  return (
    // Không chừa khoảng dưới: phần báo giá tràn hết bề ngang, nối thẳng xuống chân trang
    <div>
      <HotelHero />
      <Partners />
      <WhiteGoods onQuote={prefillQuote} />
      <HotelProducts onQuote={quoteProduct} />
      <Reasons />
      <Steps />
      <Quote defaultMessage={quotePrefill.message} prefillKey={quotePrefill.key} />
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
        {/*
          Đúng hai dòng ở mọi bề ngang (chị Phương 09/11/2026: "cái này có thể ghi 2 dòng đk k", "4 dòng hơi dài").
          Mỗi nửa câu rộng ~8,5 lần cỡ chữ; cột chữ máy tính chỉ rộng 532px nên cỡ chữ theo bề ngang, tối đa 3,6rem.
        */}
        <h1
          id="page-title"
          className="font-display mt-4 text-[clamp(2rem,9.6vw,2.6rem)] leading-[1.05] text-deep-900 sm:text-[3.6rem] lg:text-[clamp(3rem,4.6vw,3.6rem)]"
        >
          <span className="block">Giấc ngủ năm sao</span> <span className="block">cho khách lưu trú</span>
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
function Quote({ defaultMessage, prefillKey }: { defaultMessage: string; prefillKey: number }) {
  return (
    <section id="bao-gia" aria-labelledby="quote-title" className="grid scroll-mt-[5.5rem] grid-cols-1 bg-mist-50 lg:grid-cols-[5fr_7fr]">
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
            defaultMessage={defaultMessage}
            prefillKey={prefillKey}
            placeholder="Ví dụ: khách sạn 40 phòng ở Đà Nẵng, 20 giường 1m6 và 20 giường 1m8, cần ga bọc, vỏ chăn, ruột gối…"
            submitLabel="Gửi yêu cầu báo giá"
          />
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body-sm">
          <li>
            <a href={CONTACT.hotlineTel} className="inline-flex min-h-11 items-center gap-2 text-deep-900 hover:underline">
              <Icon name="phone" size={17} className="text-deep-700" />
              <span className="tabular">{CONTACT.hotlineDisplay}</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-11 items-center gap-2 text-deep-900 hover:underline">
              <Icon name="mail" size={17} className="text-deep-700" />
              {CONTACT.email}
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
