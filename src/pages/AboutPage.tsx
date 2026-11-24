import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ProductProcess } from '../components/about/ProductProcess'
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
import { HOTEL_PARTNERS } from '../data/content'
import { FEATURED_EVENT } from '../data/events'
import { PATHS } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'
import { BRAND_VIDEO, BRAND_VIDEO_LEAD } from '../data/brand'
import { ABOUT_PAGE_TEXT, ABOUT_PAGE_TEXT_SET } from '../data/pageText/aboutPage'
import { Highlight } from '../components/ui/Highlight'
import { chen } from '../data/pageText/define'
import { ABOUT_ORDER } from '../data/pageLayout'

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

/** Chữ gốc của sáu chương: Ecopillo xoá bớt dòng thì chương thiếu dùng lại tên gốc */
const CHAPTERS_GOC = (ABOUT_PAGE_TEXT_SET.goc as { chuong: readonly { nhan: string; ten: string }[] }).chuong

/** Tên chương I–VI (nhãn nhỏ + tên) Ecopillo sửa ở Nội dung web; thiếu dòng thì giữ chữ gốc */
const CHAPTER_IDS = ['chuong-1', 'chuong-2', 'chuong-3', 'chuong-4', 'chuong-5', 'chuong-6'] as const
const CHAPTER_ICONS: readonly IconName[] = ['feather', 'home', 'community', 'leaf', 'compass', 'award']
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const
const chapter = (i: number) => ABOUT_PAGE_TEXT.chuong[i] ?? CHAPTERS_GOC[i]

/*
 * Thứ tự, ẩn / hiện các khối: Ecopillo chọn ở Nội dung web → Giao diện → Bố cục trang Giới thiệu (đợt E6, owner 24/11/2026;
 * trước đó thứ tự chương cố định). Số La Mã chạy theo thứ tự đang hiện: ẩn hay đổi chỗ chương thì số đánh lại từ I.
 * Mã neo (#chuong-1…) đi theo nội dung chương, không đổi.
 */
const isChapterId = (id: string): id is (typeof CHAPTER_IDS)[number] => (CHAPTER_IDS as readonly string[]).includes(id)
const NUMERAL_OF: Readonly<Record<string, string>> = Object.fromEntries(
  ABOUT_ORDER.filter(isChapterId).map((id, k) => [id, NUMERALS[k] ?? '']),
)
const numeralOf = (id: (typeof CHAPTER_IDS)[number]) => NUMERAL_OF[id] ?? ''

/** Khối nằm trên đường chỉ; các khối này đứng liền nhau thì chung một đường chỉ */
const RAIL_IDS: ReadonlySet<string> = new Set(['loi-mo', 'thu-sang-lap', ...CHAPTER_IDS, 'phim'])

/** Gom các khối liền nhau trên đường chỉ thành một nhóm (thứ tự gốc: một đường chỉ từ Lời mở đến chương VI) */
interface Run {
  rail: boolean
  ids: readonly string[]
}
const RUNS: readonly Run[] = ABOUT_ORDER.reduce<readonly Run[]>((runs, id) => {
  const rail = RAIL_IDS.has(id)
  const last = runs[runs.length - 1]
  return rail && last?.rail ? [...runs.slice(0, -1), { rail, ids: [...last.ids, id] }] : [...runs, { rail, ids: [id] }]
}, [])

/** Dòng mục lục của từng khối (Phim, dải cam kết không có dòng) */
const TOC_ITEMS: Readonly<Record<string, Omit<TocItem, 'numeral'>>> = {
  'loi-mo': { id: 'loi-mo', title: ABOUT_PAGE_TEXT.mucLoiMo, icon: 'night' },
  'thu-sang-lap': { id: 'thu-sang-lap', title: ABOUT_PAGE_TEXT.mucThu, icon: 'feather' },
  ...Object.fromEntries(CHAPTER_IDS.map((id, i) => [id, { id, title: chapter(i).ten, icon: CHAPTER_ICONS[i] }])),
  'loi-ket': { id: 'loi-ket', title: ABOUT_PAGE_TEXT.mucLoiKet, icon: 'pin' },
}

const TOC: readonly TocItem[] = ABOUT_ORDER.flatMap((id) => {
  const item = TOC_ITEMS[id]
  return item ? [{ ...item, numeral: isChapterId(id) ? numeralOf(id) : '' }] : []
})

/** Nút "Đọc câu chuyện" đầu trang: tới mục lục; Ecopillo ẩn mục lục thì tới khối đầu tiên */
const READ_TARGET = ABOUT_ORDER.includes('muc-luc') ? 'muc-luc' : (ABOUT_ORDER[0] ?? 'muc-luc')

/** Phần giới thiệu đầu trang (chị Phương 19/11/2026, thay "Hơn 15 năm nâng niu giấc ngủ Việt") */
const INTRO = {
  title: ABOUT_PAGE_TEXT.tieuDe,
  subtitle: ABOUT_PAGE_TEXT.tieuDePhu,
  paragraphs: ABOUT_PAGE_TEXT.gioiThieu,
  signOff: ABOUT_PAGE_TEXT.kyTen,
}

export function AboutPage() {
  usePageMeta('Giới thiệu', ABOUT_PAGE_TEXT.moTaGoogle)

  // Mỗi khối một mã (ABOUT_ORDER trong src/data/pageLayout.ts); Ecopillo đổi thứ tự, ẩn khối ở Nội dung web
  const blocks: Readonly<Record<string, ReactNode>> = {
    'muc-luc': <TableOfContents />,
    'loi-mo': (
      <Chapter id="loi-mo" icon="night" eyebrow={ABOUT_PAGE_TEXT.loiMoNhan} title={ABOUT_PAGE_TEXT.mucLoiMo} isTitleHidden>
        <Prose dropCap>{STORY_OPENING}</Prose>
      </Chapter>
    ),
    'thu-sang-lap': <FounderLetter />,
    'chuong-1': (
      <Chapter
        id="chuong-1"
        numeral={numeralOf('chuong-1')}
        icon="feather"
        eyebrow={chapter(0).nhan}
        title={chapter(0).ten}
      >
        <Prose>
          <Highlight text={ABOUT_PAGE_TEXT.nguoiSangLap} strong={[ABOUT_PAGE_TEXT.nguoiSangLapDam]} em={[ABOUT_PAGE_TEXT.nguoiSangLapNghieng]} />
        </Prose>
        <PullQuote>“{FOUNDER_QUOTE}”</PullQuote>
      </Chapter>
    ),
    'chuong-2': (
      <Chapter
        id="chuong-2"
        numeral={numeralOf('chuong-2')}
        icon="home"
        eyebrow={chapter(1).nhan}
        title={chapter(1).ten}
      >
        {/* Câu định nghĩa cùng kiểu ô trích các chương (trước là hộp trắng lạc màu) */}
        <PullQuote isQuote={false}>{ABOUT_PAGE_TEXT.chonYen}</PullQuote>
        <Prose>{BRAND_PROMISE}</Prose>
        <StoryFigure image={ABOUT_PAGE_TEXT.anhChonYen} caption={ABOUT_PAGE_TEXT.chuThichChonYen} />
      </Chapter>
    ),
    'chuong-3': (
      <Chapter
        id="chuong-3"
        numeral={numeralOf('chuong-3')}
        icon="community"
        eyebrow={chapter(2).nhan}
        title={chapter(2).ten}
      >
        {/* Chữ Tốt / Thật / Thiện đứng thẳng, đậm 600 (chị Phương 09/11/2026 chê chữ nghiêng to) */}
        <ol className="mt-6 border-b border-line">
          {PHILOSOPHY.map((p, i) => (
            <li key={p.word} data-reveal style={revealDelay(i)} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-5">
              <p className="font-display text-[1.7rem] leading-none text-deep-900 sm:text-[2.1rem]">{p.word}</p>
              <p className="chu-deu text-body leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
      </Chapter>
    ),
    'chuong-4': (
      <Chapter
        id="chuong-4"
        numeral={numeralOf('chuong-4')}
        icon="leaf"
        eyebrow={chapter(3).nhan}
        title={chapter(3).ten}
      >
        <Prose>{LYOCELL_INTRO}</Prose>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          {[ABOUT_PAGE_TEXT.anhChatLieu1, ABOUT_PAGE_TEXT.anhChatLieu2].map((img, i) => (
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
        {/* Quy trình 7 bước: sau 4 ô đặc tính, trước câu trích (cách 1, chị Phương chọn 12/11/2026) */}
        <ProductProcess />
        <PullQuote>“{CRAFT_QUOTE}”</PullQuote>
      </Chapter>
    ),
    // Phim thương hiệu cùng kiểu khối như các chương (trước là một dải riêng giống trang chủ)
    'phim': (
      <Chapter id="phim" icon="play" eyebrow={ABOUT_PAGE_TEXT.phimNhan} title={BRAND_VIDEO.heading}>
        {/* Chị Phương 19/11/2026 */}
        <Prose>{BRAND_VIDEO_LEAD}</Prose>
        <BrandVideoPlayer className="mt-6 rounded-2xl" />
        <YoutubeChannelLink />
      </Chapter>
    ),
    'chuong-5': (
      <Chapter
        id="chuong-5"
        numeral={numeralOf('chuong-5')}
        icon="compass"
        eyebrow={chapter(4).nhan}
        title={chapter(4).ten}
      >
        <div className="mt-6 grid gap-7 sm:grid-cols-2">
          {[
            { label: ABOUT_PAGE_TEXT.suMenhNhan, paragraphs: MISSION, image: MISSION_IMAGE_ABOUT_PAGE, position: MISSION_IMAGE_ABOUT_PAGE_POSITION },
            { label: ABOUT_PAGE_TEXT.tamNhinNhan, paragraphs: [VISION], image: VISION_IMAGE, position: undefined },
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
                <p key={text} className="chu-deu mt-2 text-body-sm leading-[1.75] text-ink-soft">
                  {text}
                </p>
              ))}
            </article>
          ))}
        </div>
        {/* Giá trị cốt lõi: lưới 2 × 2 ô xanh nhạt có số (mẫu 2, chị Phương 09/11/2026 "in đậm") */}
        <p className={`mt-9 ${STORY_LABEL}`}>{ABOUT_PAGE_TEXT.giaTriNhan}</p>
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
    ),
    'chuong-6': (
      <Chapter
        id="chuong-6"
        numeral={numeralOf('chuong-6')}
        icon="award"
        eyebrow={chapter(5).nhan}
        title={chapter(5).ten}
      >
        <Recognition />
      </Chapter>
    ),
    'cam-ket': (
      <div className="mt-16 sm:mt-24">
        <TrustStrip />
      </div>
    ),
    'loi-ket': <Closing />,
  }

  return (
    <>
      <Cover />
      {RUNS.map((run) =>
        run.rail ? (
          <StoryRail key={run.ids.join(' ')}>
            {run.ids.map((id) => (
              <Fragment key={id}>{blocks[id]}</Fragment>
            ))}
          </StoryRail>
        ) : (
          <Fragment key={run.ids[0]}>{blocks[run.ids[0]]}</Fragment>
        ),
      )}
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
          {ABOUT_PAGE_TEXT.chuThichAnh}
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-center px-5 pt-7 pb-10 sm:px-8 lg:py-16 lg:pr-14 lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
        <Breadcrumb items={[{ label: ABOUT_PAGE_TEXT.duongDan }]} />
        <p className="eyebrow mt-8 flex items-center gap-2">
          <Icon name="book" size={15} className="text-deep-700" /> {ABOUT_PAGE_TEXT.nhan}
        </p>
        {/* Chữ chị Phương gửi Zalo 19/11/2026 ("Phần giới thiệu sửa lại giúp c"), giữ nguyên văn */}
        <h1 id="page-title" className="font-display mt-4 text-[2.6rem] leading-[1.02] text-balance text-deep-900 sm:text-[3.6rem] xl:text-[3.9rem]">
          {INTRO.title}
        </h1>
        <p className="mt-4 max-w-lg font-display text-[1.3rem] leading-snug text-deep-800 italic sm:text-[1.45rem]">{INTRO.subtitle}</p>
        <div className="mt-5 max-w-lg space-y-3 text-body leading-relaxed text-ink-soft">
          {INTRO.paragraphs.map((text) => (
            <p key={text} className="chu-deu">
              {text}
            </p>
          ))}
          <p className="font-medium text-deep-900">{INTRO.signOff}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`#${READ_TARGET}`} className={buttonClass('primary', 'lg')}>
            <Icon name="book" size={18} />
            {ABOUT_PAGE_TEXT.nutDocChuyen}
          </a>
          <LinkButton to={PATHS.products} variant="secondary" size="lg">
            {ABOUT_PAGE_TEXT.nutXemSanPham}
          </LinkButton>
        </div>
      </div>
    </header>
  )
}

function TableOfContents() {
  return (
    <nav id="muc-luc" aria-label={ABOUT_PAGE_TEXT.mucLucNhan} className="scroll-mt-[4.5rem] border-b border-line py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-5 sm:px-8 lg:grid-cols-[12rem_1fr] lg:gap-8 lg:px-10">
        <p className="eyebrow flex items-center gap-2">
          <Icon name="list" size={15} className="text-deep-700" /> {ABOUT_PAGE_TEXT.mucLucNhan}
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
            {/* Giá trị là chữ ("Hàng trăm nghìn", owner 18/11/2026): cỡ nhỏ hơn, cho xuống dòng; số thì giữ một dòng.
                Khung cao bằng dòng số, chữ bám đáy, để ba nhãn bên dưới thẳng hàng */}
            <p
              className={`flex min-h-[1.9rem] items-end justify-center font-display text-deep-900 sm:min-h-[2.4rem] ${
                /^\d/.test(s.value)
                  ? 'text-[1.9rem] leading-none whitespace-nowrap sm:text-[2.4rem]'
                  : 'text-[0.95rem] leading-[1.1] text-balance sm:text-[1.35rem]'
              }`}
            >
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
        <figcaption className="font-display mt-2.5 text-body-sm text-ink-faint italic">{chen(ABOUT_PAGE_TEXT.giaiThuongChuThich, { ten: AWARD_NAME })}</figcaption>
      </figure>
      {/* 1A: tủ chứng nhận, ảnh giấy cắt từ catalog 22.07.2026 (owner chọn 24/10/2026) */}
      <CertificateCabinet />
      {/* 2A: báo chí, bấm logo đổi câu trích */}
      <p className={`mt-12 flex items-center gap-2 ${STORY_LABEL}`}>
        <Icon name="quote" size={15} className="text-deep-700" /> {ABOUT_PAGE_TEXT.baoChiNhan}
      </p>
      <h3 className="font-display mt-3 text-[1.6rem] leading-tight text-deep-900 sm:text-[2rem]">
        {ABOUT_PAGE_TEXT.baoChiTieuDe}
      </h3>
      <PressQuotes />
      {/* Đối tác (3A): May 10, DBV Insurance không phải khách sạn nên gọi chung là đối tác */}
      <p className={`mt-12 flex items-center gap-2 ${STORY_LABEL}`}>
        <Icon name="building" size={15} className="text-deep-700" /> {ABOUT_PAGE_TEXT.doiTacNhan}
      </p>
      <Prose>{ABOUT_PAGE_TEXT.doiTacChu}</Prose>
      {/* Trong khối trắng: ô logo xanh nhạt, không bóng (như ô Giá trị cốt lõi) */}
      <PartnerLogos partners={HOTEL_PARTNERS} className="mt-6" itemClassName="h-16 sm:h-20 !bg-mist-100 !shadow-none" />
      <Link to={PATHS.hotel} className={buttonClass('secondary', 'md', 'mt-6')}>
        <Icon name="building" size={17} />
        {ABOUT_PAGE_TEXT.nutKhachSan}
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
          <Icon name="pin" size={15} /> {ABOUT_PAGE_TEXT.loiKetNhan}
        </p>
        <h2 id="loi-ket-tieu-de" className="font-display mt-4 text-[2.1rem] leading-tight sm:text-[2.8rem]">
          {ABOUT_PAGE_TEXT.loiKetTieuDe}
        </h2>
        <p className="mt-4 max-w-md text-mist-200/90">{ABOUT_PAGE_TEXT.loiKetChu}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton to={`${PATHS.contact}#diem-ban`} variant="light">
            <Icon name="pin" size={17} />
            {ABOUT_PAGE_TEXT.loiKetNutDiemBan}
          </LinkButton>
          <LinkButton to={PATHS.products} variant="outlineLight">
            <Icon name="bed" size={17} />
            {ABOUT_PAGE_TEXT.nutXemSanPham}
          </LinkButton>
          <LinkButton to={PATHS.contact} variant="outlineLight">
            <Icon name="mail" size={17} />
            {ABOUT_PAGE_TEXT.loiKetNutLienHe}
          </LinkButton>
        </div>
      </div>
      <div className="relative aspect-[16/10] lg:aspect-auto">
        <img
          src={ABOUT_PAGE_TEXT.anhLoiKet.src}
          srcSet={ABOUT_PAGE_TEXT.anhLoiKet.srcSet}
          sizes="(min-width: 1024px) 42vw, 100vw"
          alt={ABOUT_PAGE_TEXT.anhLoiKet.alt}
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
    <Chapter id="thu-sang-lap" icon="feather" eyebrow={ABOUT_PAGE_TEXT.thuNhan} title={ABOUT_PAGE_TEXT.mucThu}>
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
