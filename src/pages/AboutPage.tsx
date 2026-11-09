import { Link } from 'react-router-dom'
import { CertificateCabinet, PartnerLogos, PressQuotes } from '../components/about/Recognition'
import { Chapter, PullQuote, Prose, STORY_LABEL, StoryFigure, StoryRail } from '../components/about/StoryParts'
import { BrandVideoPlayer, YoutubeChannelLink } from '../components/home/BrandVideo'
import { TrustStrip } from '../components/home/Craft'
import { CountUp } from '../components/ui/CountUp'
import { Icon, type IconName } from '../components/ui/Icon'
import { Breadcrumb } from '../components/ui/PageHero'
import { buttonClass, LinkButton } from '../components/ui/primitives'
import {
  AWARD_IMAGE,
  AWARD_NAME,
  BRAND_PROMISE,
  BRAND_STATS,
  CORE_VALUES,
  CRAFT_QUOTE,
  FOUNDER_IMAGE,
  FOUNDER_LETTER,
  FOUNDER_LETTER_IMAGES,
  FOUNDER_NAME,
  FOUNDER_QUOTE,
  FOUNDER_SIGNATURE,
  LYOCELL_INTRO,
  LYOCELL_TRAITS,
  MISSION,
  MISSION_IMAGE_ABOUT_PAGE,
  MISSION_IMAGE_ABOUT_PAGE_POSITION,
  PHILOSOPHY,
  STORY_OPENING,
  VISION,
  VISION_IMAGE,
} from '../data/about'
import { patternImage, type ImageSource } from '../data/catalog'
import { HOTEL_PARTNERS } from '../data/content'
import { FEATURED_EVENT } from '../data/events'
import { PATHS } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/**
 * Trang Giới thiệu (/gioi-thieu, giữ đường link web cũ) dạng chương sách (mẫu 1, owner chọn 16/10/2026,
 * bìa là ảnh chị Phương tại VTV3 theo yêu cầu owner; mẫu: docs/de-xuat-trang-ve-chung-toi.html).
 * Bìa + mục lục → Lời mở → 6 chương số La Mã → Lời kết mời ghé thăm. Chữ dùng chung với trang chủ ở data/about.ts.
 * Từ 09/11/2026 (mẫu 2, docs/de-xuat-gioi-thieu-dai-ly-09-11.html): mỗi phần một khối trắng nối bằng đường chỉ,
 * xem StoryParts.tsx.
 * Tên chương là chữ nối mạch truyện, chờ Ecopillo duyệt cùng phần câu chuyện.
 */

interface TocItem {
  id: string
  numeral: string
  title: string
  icon: IconName
}

const TOC: readonly TocItem[] = [
  { id: 'loi-mo', numeral: '', title: 'Lời mở: một giấc ngủ không trọn', icon: 'night' },
  { id: 'thu-sang-lap', numeral: '', title: 'Chia sẻ từ người sáng lập', icon: 'feather' },
  { id: 'chuong-1', numeral: 'I', title: 'Người làm nghề', icon: 'feather' },
  { id: 'chuong-2', numeral: 'II', title: 'Chốn Yên', icon: 'home' },
  { id: 'chuong-3', numeral: 'III', title: 'Triết lý kinh doanh', icon: 'community' },
  { id: 'chuong-4', numeral: 'IV', title: 'Từ sợi gỗ đến giấc ngủ', icon: 'leaf' },
  { id: 'chuong-5', numeral: 'V', title: 'Điều chúng tôi theo đuổi', icon: 'compass' },
  { id: 'chuong-6', numeral: 'VI', title: 'Được ghi nhận', icon: 'award' },
  { id: 'loi-ket', numeral: '', title: 'Lời kết: mời Quý khách ghé thăm', icon: 'pin' },
]

const CHON_YEN_IMAGE = patternImage('ED25', 'Phòng ngủ trải bộ chăn ga Eco Doris ED25')
const LYOCELL_IMAGE: ImageSource = { src: '/images/details/lyocell-et01.webp', srcSet: '', alt: 'Cận mặt vải Lyocell trơn bộ Eco Tera ET01' }
const EMBROIDERY_IMAGE: ImageSource = { src: '/images/details/theu-ed25.webp', srcSet: '', alt: 'Cận đường thêu bộ Eco Doris ED25' }
// Tạm dùng ảnh phòng ngủ ED25 cho lời kết, chờ Ecopillo gửi ảnh công ty, văn phòng
const VISIT_IMAGE: ImageSource = {
  src: '/images/details/hero-ed25.webp',
  srcSet: '/images/details/hero-ed25-sm.webp 640w, /images/details/hero-ed25.webp 1200w',
  alt: 'Phòng ngủ trải bộ Eco Doris ED25',
}

export function AboutPage() {
  usePageMeta(
    'Giới thiệu',
    // Mô tả viết tay 08/11/2026 (C2, chờ Ecopillo duyệt): dưới 160 ký tự để Google không cắt
    'Hơn 15 năm làm chăn ga gối đệm, triết lý Tốt · Thật · Thiện, vải Lyocell, chứng nhận ISO 9001:2015 và TQC. Câu chuyện của Ecopillo.',
  )

  return (
    <>
      <Cover />
      <TableOfContents />

      <StoryRail>
        <Chapter id="loi-mo" icon="night" eyebrow="Lời mở" title="Lời mở: một giấc ngủ không trọn" isTitleHidden>
          <Prose dropCap>{STORY_OPENING}</Prose>
        </Chapter>

        <FounderLetter />

        <Chapter
          id="chuong-1"
          numeral="I"
          icon="feather"
          eyebrow="Người sáng lập"
          title={
            <>
              Người làm nghề
            </>
          }
        >
          <Prose>
            Người đặt nền móng cho thương hiệu là <strong>{FOUNDER_NAME}</strong>, hơn 15 năm trong nghề chăn ga, từ sản xuất đến bán lẻ.
            Chị luôn trăn trở làm sao để mỗi sản phẩm giúp khách hàng tạo dựng một <em className="text-deep-900">“Chốn Yên”</em>.
          </Prose>
          <PullQuote>“{FOUNDER_QUOTE}”</PullQuote>
        </Chapter>

        <Chapter
          id="chuong-2"
          numeral="II"
          icon="home"
          eyebrow="Khát vọng"
          title={
            <>
              Chốn Yên
            </>
          }
        >
          {/* Câu định nghĩa cùng kiểu ô trích các chương (trước là hộp trắng lạc màu) */}
          <PullQuote isQuote={false}>“Chốn Yên”: nơi giấc ngủ lành mạnh được vun đắp và cơ thể được phục hồi trọn vẹn.</PullQuote>
          <Prose>{BRAND_PROMISE}</Prose>
          <StoryFigure image={CHON_YEN_IMAGE} caption="Một Chốn Yên: phòng ngủ trải bộ Eco Doris ED25." />
        </Chapter>

        <Chapter
          id="chuong-3"
          numeral="III"
          icon="community"
          eyebrow="Tốt · Thật · Thiện"
          title={
            <>
              {/* Tên chương theo web cũ (khách 05/11/2026: "triết lý kinh doanh") */}
              Triết lý kinh doanh
            </>
          }
        >
          {/* Chữ Tốt / Thật / Thiện đứng thẳng, đậm 600 (chị Phương 09/11/2026 chê chữ nghiêng to) */}
          <ol className="mt-6 border-b border-line">
            {PHILOSOPHY.map((p, i) => (
              <li key={p.word} data-reveal style={revealDelay(i)} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-5">
                <p className="font-display text-[1.7rem] leading-none text-deep-900 sm:text-[2.1rem]">{p.word}</p>
                <p className="text-body leading-relaxed text-ink-soft">{p.text}</p>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter
          id="chuong-4"
          numeral="IV"
          icon="leaf"
          eyebrow="Chất liệu và tay nghề"
          title={
            <>
              Từ sợi gỗ đến giấc ngủ
            </>
          }
        >
          <Prose>{LYOCELL_INTRO}</Prose>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            {[LYOCELL_IMAGE, EMBROIDERY_IMAGE].map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className={`aspect-[3/4] w-full rounded-2xl bg-mist-100 object-cover ${i === 1 ? 'mt-8 sm:mt-12' : ''}`}
              />
            ))}
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
            {LYOCELL_TRAITS.map((t) => (
              <div key={t.title}>
                <dt className="font-display flex items-center gap-2 text-[1.15rem] text-deep-900">
                  <Icon name="leaf" size={15} className="text-deep-700" />
                  {t.title}
                </dt>
                <dd className="mt-1 text-small leading-relaxed text-ink-soft">{t.text}</dd>
              </div>
            ))}
          </dl>
          <PullQuote>“{CRAFT_QUOTE}”</PullQuote>
        </Chapter>

        {/* Phim thương hiệu cùng kiểu khối như các chương (trước là một dải riêng giống trang chủ) */}
        <Chapter id="phim" icon="play" eyebrow="Phim thương hiệu" title="Một giấc ngủ được nâng niu">
          <Prose>Ba phút để cảm nhận chất vải Lyocell, đường chần thêu và không gian phòng ngủ Ecopillo.</Prose>
          <BrandVideoPlayer className="mt-6 rounded-2xl" />
          <YoutubeChannelLink />
        </Chapter>

        <Chapter
          id="chuong-5"
          numeral="V"
          icon="compass"
          eyebrow="Sứ mệnh, tầm nhìn"
          title={
            <>
              Điều chúng tôi theo đuổi
            </>
          }
        >
          <div className="mt-6 grid gap-7 sm:grid-cols-2">
            {[
              { label: 'Sứ mệnh', paragraphs: MISSION, image: MISSION_IMAGE_ABOUT_PAGE, position: MISSION_IMAGE_ABOUT_PAGE_POSITION },
              { label: 'Tầm nhìn', paragraphs: [VISION], image: VISION_IMAGE, position: undefined },
            ].map((m, i) => (
              <article key={m.label} data-reveal style={revealDelay(i)}>
                <img
                  src={m.image.src}
                  srcSet={m.image.srcSet || undefined}
                  alt={m.image.alt}
                  loading="lazy"
                  decoding="async"
                  style={m.position ? { objectPosition: m.position } : undefined}
                  className="aspect-[3/2] w-full rounded-xl bg-mist-100 object-cover"
                />
                <p className={`mt-4 ${STORY_LABEL}`}>{m.label}</p>
                {/* Chữ thường của web, không nghiêng (chị Phương 09/11/2026: "in thường, điều chỉnh font chữ") */}
                {m.paragraphs.map((text) => (
                  <p key={text} className="mt-2 text-body-sm leading-[1.75] text-ink-soft">
                    {text}
                  </p>
                ))}
              </article>
            ))}
          </div>
          {/* Giá trị cốt lõi: lưới 2 × 2 ô xanh nhạt có số (mẫu 2, chị Phương 09/11/2026 "in đậm") */}
          <p className={`mt-9 ${STORY_LABEL}`}>Giá trị cốt lõi</p>
          <ol className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {CORE_VALUES.map((v, i) => (
              <li key={v.title} data-reveal style={revealDelay(i)} className="flex gap-3 rounded-[0.875rem] bg-mist-100 p-3.5">
                <span aria-hidden="true" className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-ivory text-[0.9rem] font-semibold text-deep-900">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold text-deep-900">{v.title}</span>
                  <span className="mt-0.5 block text-meta leading-relaxed text-ink-soft">{v.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter
          id="chuong-6"
          numeral="VI"
          icon="award"
          eyebrow="Chứng nhận, đối tác"
          title={
            <>
              Được ghi nhận
            </>
          }
        >
          <Recognition />
        </Chapter>
      </StoryRail>

      <div className="mt-16 sm:mt-24">
        <TrustStrip />
      </div>

      <Closing />
    </>
  )
}

/** Bìa: chữ bên trái, ảnh chị Phương tại VTV3 bên phải (owner chọn 16/10/2026) */
function Cover() {
  return (
    <header aria-labelledby="page-title" className="grid grid-cols-1 border-b border-line lg:min-h-[min(40rem,calc(100svh-4.5rem))] lg:grid-cols-[7fr_5fr]">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100 lg:order-2 lg:aspect-auto">
        <img
          src={FOUNDER_IMAGE.src}
          srcSet={FOUNDER_IMAGE.srcSet}
          sizes="(min-width: 1024px) 42vw, 100vw"
          alt={FOUNDER_IMAGE.alt}
          fetchPriority="high"
          decoding="async"
          style={{ objectPosition: '30% 30%' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute right-4 bottom-3 rounded-full bg-ivory/90 px-3 py-1 text-label text-deep-900 lg:right-6 lg:bottom-5">
          Chị Phạm Thị Phương tại VTV3
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-center px-5 pt-7 pb-10 sm:px-8 lg:py-16 lg:pr-14 lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
        <Breadcrumb items={[{ label: 'Giới thiệu' }]} />
        <p className="eyebrow mt-8 flex items-center gap-2">
          <Icon name="book" size={15} className="text-deep-700" /> Câu chuyện Ecopillo
        </p>
        <h1 id="page-title" className="font-display mt-4 text-[2.6rem] leading-[1.02] text-balance text-deep-900 sm:text-[3.6rem] xl:text-[3.9rem]">
          Hơn 15 năm <span className="block">nâng niu giấc ngủ Việt</span>
        </h1>
        <p className="mt-5 max-w-md text-body leading-relaxed text-ink-soft">
          Ecopillo Eternal Việt Nam làm chăn ga gối đệm từ chất liệu thiên nhiên, với một mong muốn giản dị: mỗi gia đình có một chốn yên để ngủ ngon.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#muc-luc" className={buttonClass('primary', 'lg')}>
            <Icon name="book" size={18} />
            Đọc câu chuyện
          </a>
          <LinkButton to={PATHS.products} variant="secondary" size="lg">
            Xem sản phẩm
          </LinkButton>
        </div>
      </div>
    </header>
  )
}

function TableOfContents() {
  return (
    <nav id="muc-luc" aria-label="Mục lục" className="scroll-mt-[4.5rem] border-b border-line py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-5 sm:px-8 lg:grid-cols-[12rem_1fr] lg:gap-8 lg:px-10">
        <p className="eyebrow flex items-center gap-2">
          <Icon name="list" size={15} className="text-deep-700" /> Mục lục
        </p>
        <ol className="sm:columns-2 sm:gap-10">
          {TOC.map((t) => (
            <li key={t.id} className="break-inside-avoid">
              <a href={`#${t.id}`} className="group grid grid-cols-[2.8rem_1fr_auto] items-center border-t border-line py-2.5">
                <span className="font-display text-[1.15rem] text-deep-700 italic">
                  {t.numeral || <Icon name={t.icon} size={15} className="text-deep-700" />}
                </span>
                <span className="font-display text-lead text-deep-900 transition-colors group-hover:text-deep-700">{t.title}</span>
                <Icon name="arrowRight" size={15} className="text-deep-700 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

function Recognition() {
  return (
    <>
      <ul className="mt-8 grid grid-cols-3 gap-3 text-center">
        {BRAND_STATS.map((s) => (
          <li key={s.label} data-reveal>
            <p className="font-display text-[1.9rem] leading-none whitespace-nowrap text-deep-900 sm:text-[2.4rem]">
              <CountUp value={s.value} />
            </p>
            <p className="mt-2 text-label leading-snug text-ink-soft sm:text-small">{s.label}</p>
          </li>
        ))}
      </ul>
      <figure data-reveal className="mt-10">
        <img
          src={AWARD_IMAGE.src}
          srcSet={AWARD_IMAGE.srcSet || undefined}
          alt={AWARD_IMAGE.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[2/1] w-full rounded-2xl bg-mist-100 object-cover"
        />
        <figcaption className="font-display mt-2.5 text-body-sm text-ink-faint italic">Lễ công bố {AWARD_NAME}.</figcaption>
      </figure>
      {/* 1A: tủ chứng nhận, ảnh giấy cắt từ catalog 22.07.2026 (owner chọn 24/10/2026) */}
      <CertificateCabinet />
      {/* 2A: báo chí, bấm logo đổi câu trích */}
      <p className={`mt-12 flex items-center gap-2 ${STORY_LABEL}`}>
        <Icon name="quote" size={15} className="text-deep-700" /> Báo chí nói về Ecopillo
      </p>
      <h3 className="font-display mt-3 text-[1.6rem] leading-tight text-deep-900 sm:text-[2rem]">
        Người khác kể về chúng tôi
      </h3>
      <PressQuotes />
      {/* Đối tác (3A): May 10, DBV Insurance không phải khách sạn nên gọi chung là đối tác */}
      <p className={`mt-12 flex items-center gap-2 ${STORY_LABEL}`}>
        <Icon name="building" size={15} className="text-deep-700" /> Đối tác
      </p>
      <Prose>Ngoài các gia đình, Ecopillo may chăn ga gối theo kích thước cho khách sạn, khu nghỉ dưỡng và doanh nghiệp trên cả nước.</Prose>
      {/* Trong khối trắng: ô logo xanh nhạt, không bóng (như ô Giá trị cốt lõi) */}
      <PartnerLogos partners={HOTEL_PARTNERS} className="mt-6" itemClassName="h-16 sm:h-20 !bg-mist-100 !shadow-none" />
      <Link to={PATHS.hotel} className={buttonClass('secondary', 'md', 'mt-6')}>
        <Icon name="building" size={17} />
        Khách sạn và dự án
        <Icon name="arrowRight" size={17} />
      </Link>
    </>
  )
}

/** Lời kết: mời ghé thăm, nền chàm cạnh ảnh phòng ngủ */
function Closing() {
  return (
    <section id="loi-ket" aria-labelledby="loi-ket-tieu-de" className="grain relative grid scroll-mt-[4.5rem] grid-cols-1 overflow-hidden bg-deep-900 text-ivory lg:grid-cols-[7fr_5fr]">
      <div className="relative min-w-0 px-5 py-14 sm:px-8 sm:py-20 lg:pr-14 lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
        <p className="eyebrow flex items-center gap-2 !text-mist-300">
          <Icon name="pin" size={15} /> Lời kết · Ghé thăm Ecopillo
        </p>
        <h2 id="loi-ket-tieu-de" className="font-display mt-4 text-[2.1rem] leading-tight sm:text-[2.8rem]">
          Chạm tay vào chất vải trước khi chọn
        </h2>
        <p className="mt-4 max-w-md text-mist-200/90">
          Cảm nhận độ mềm mát của Lyocell, nằm thử gối và đệm, được tư vấn mẫu hợp với phòng ngủ của Quý khách.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton to={`${PATHS.contact}#diem-ban`} variant="light">
            <Icon name="pin" size={17} />
            Liên hệ mua hàng
          </LinkButton>
          <LinkButton to={PATHS.products} variant="outlineLight">
            <Icon name="bed" size={17} />
            Xem sản phẩm
          </LinkButton>
          <LinkButton to={PATHS.contact} variant="outlineLight">
            <Icon name="mail" size={17} />
            Liên hệ
          </LinkButton>
        </div>
      </div>
      <div className="relative aspect-[16/10] lg:aspect-auto">
        <img
          src={VISIT_IMAGE.src}
          srcSet={VISIT_IMAGE.srcSet}
          sizes="(min-width: 1024px) 42vw, 100vw"
          alt={VISIT_IMAGE.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  )
}

/**
 * Thư "Chia sẻ từ người sáng lập" (yêu cầu sửa mục 11, khách gửi 16/10/2026): phần riêng ngay sau Lời mở, chữ nguyên văn.
 * Ảnh: chương trình "Chăn ấm yêu thương" như trang khách gửi (cùng ảnh với sự kiện nổi bật, src/data/events.ts).
 */
function FounderLetter() {
  return (
    <Chapter id="thu-sang-lap" icon="feather" eyebrow="Thư" title="Chia sẻ từ người sáng lập">
      <blockquote className="mt-2">
        {FOUNDER_LETTER.map((paragraph) => (
          <Prose key={paragraph.slice(0, 24)}>{paragraph}</Prose>
        ))}
      </blockquote>
      {/* Hai ảnh đi kèm thư trong catalog, cùng một chương trình nên chung một chú thích */}
      <figure data-reveal className="mt-6 overflow-hidden rounded-2xl bg-mist-100">
        <div className="grid gap-1 sm:grid-cols-2">
          {FOUNDER_LETTER_IMAGES.map((image) => (
            <img
              key={image.src}
              src={image.src}
              srcSet={image.srcSet}
              sizes="(min-width: 760px) 350px, 100vw"
              alt={image.alt}
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full object-cover"
            />
          ))}
        </div>
        <figcaption className="font-display px-4 py-3 text-center text-body-sm text-ink-faint italic">
          {FEATURED_EVENT.title} · {FEATURED_EVENT.when}.
        </figcaption>
      </figure>
      <p data-reveal className="font-display mt-8 text-center text-[1.35rem] leading-snug text-deep-800">
        <span className="mx-auto mb-5 block h-px w-40 bg-deep-700/40" aria-hidden="true" />
        {FOUNDER_SIGNATURE[0]}
        <span className="mt-1 block text-body-sm text-ink-soft italic">
          {FOUNDER_SIGNATURE[1]} · {FOUNDER_SIGNATURE[2]}
        </span>
      </p>
    </Chapter>
  )
}
