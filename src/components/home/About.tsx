import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  BRAND_PROMISE,
  CORE_VALUES,
  FOUNDER_IMAGE,
  FOUNDER_QUOTE,
  MISSION,
  MISSION_IMAGE,
  STORY_OPENING,
  isLongText,
  VISION,
  VISION_IMAGE,
  AWARD_IMAGE,
  AWARD_NAME,
  VALUES_IMAGE,
  VALUES_IMAGE_POSITION,
} from '../../data/about'
import type { ImageSource } from '../../data/catalog'
import { PATHS } from '../../data/links'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { EventsStrip } from './EventsStrip'
import { MobileMore } from '../ui/MobileMore'
import { Placeholder } from '../ui/Placeholder'
import { Container, SectionHeading } from '../ui/primitives'
import { HOME_TEXT } from '../../data/pageText/home'
import { ABOUT_PAGE_TEXT } from '../../data/pageText/aboutPage'
import { Highlight } from '../ui/Highlight'

/* Chữ, ảnh dùng chung với trang Giới thiệu: data/about.ts */

/** moreLink: trên trang chủ thêm lối sang trang Giới thiệu đầy đủ */
export function About({ moreLink = false }: { moreLink?: boolean }) {
  // Điện thoại: chỉ hiện đoạn đầu, bấm để đọc tiếp cho trang ngắn hơn
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <section id="ve-chung-toi" aria-labelledby="about-title" className="py-14 sm:py-24">
      <Container>
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="relative lg:col-span-5">
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)] sm:aspect-[4/5]">
              {/* Biên bản mục 29: ảnh chị Phạm Thị Phương trên VTV3 */}
              <Placeholder
                className="h-full w-full"
                tone="mist"
                note="Ảnh chị Phạm Thị Phương trên VTV3"
                image={FOUNDER_IMAGE}
                sizes="(min-width: 1024px) 480px, 100vw"
                position="30% 30%"
              />
            </div>
            <blockquote className="relative -mt-16 ml-6 max-w-xs rounded-[1.5rem] bg-deep-900 p-6 text-ivory shadow-[var(--shadow-lift)] sm:ml-auto sm:-mr-6 lg:-mr-10">
              <Icon name="quote" size={26} className="text-mist-300" />
              <p className="font-display mt-3 text-[1.3rem] leading-snug">
                {FOUNDER_QUOTE}
              </p>
            </blockquote>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <SectionHeading
              id="about-title"
              title={HOME_TEXT.veChungToiTieuDe}
            />
            <div data-reveal style={revealDelay(1)} className="chu-deu mt-5 max-w-2xl space-y-5 text-body leading-relaxed text-ink-soft">
              <p>{STORY_OPENING}</p>
              <div className={isExpanded ? 'space-y-5' : 'hidden space-y-5 sm:block'}>
                <p>
                  <Highlight text={HOME_TEXT.nguoiSangLap} strong={[HOME_TEXT.nguoiSangLapDam]} em={[HOME_TEXT.nguoiSangLapNghieng]} />
                </p>
                <p>{BRAND_PROMISE}</p>
              </div>
              {!isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="-my-2.5 inline-flex items-center gap-1 py-2.5 text-sm font-medium text-deep-800 sm:hidden"
                >
                  {HOME_TEXT.nutDocTiep} <Icon name="chevronDown" size={15} />
                </button>
              )}
            </div>

            {/* Tốt · Thật · Thiện đã có ở dải đầu trang (Hero): bỏ ở đây cho khỏi lặp (khách báo "lặp 2 lần" 04/11/2026). Bản dài còn ở trang Giới thiệu */}
            {moreLink && (
              <Link
                to={PATHS.about}
                className="mt-6 -mb-2 inline-flex items-center gap-1.5 py-2 text-body-sm font-medium text-deep-800 underline-offset-4 hover:underline"
              >
                {HOME_TEXT.nutGioiThieu} <Icon name="arrowRight" size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Điện thoại: sứ mệnh, tầm nhìn, giá trị cốt lõi nằm sau nút (vẫn có trong trang) */}
        <MobileMore label={HOME_TEXT.nutSuMenh} buttonClassName="mt-6">
        {/* Mục 12 (owner chọn kiểu A 17/10/2026): bốn thẻ cùng một khuôn, lưới 2×2. Mẫu: docs/de-xuat-bon-khoi-ve-chung-toi.html */}
        <div
          tabIndex={0}
          role="group"
          aria-label={[ABOUT_PAGE_TEXT.suMenhNhan, ABOUT_PAGE_TEXT.tamNhinNhan, ABOUT_PAGE_TEXT.giaTriNhan, HOME_TEXT.danhHieuNhan].join(', ')}
          className="m-rail mt-12 grid gap-5 focus-visible:outline-2 focus-visible:outline-deep-700 sm:mt-20 lg:grid-cols-2"
        >
          {/* Nhãn ba thẻ dùng chung với trang Giới thiệu (ABOUT_PAGE_TEXT, chương V) */}
          <MissionCard label={ABOUT_PAGE_TEXT.suMenhNhan} image={MISSION_IMAGE}>
            {MISSION.map((para) => (
              <MissionText key={para} isLong>
                {para}
              </MissionText>
            ))}
          </MissionCard>
          <MissionCard label={ABOUT_PAGE_TEXT.tamNhinNhan} image={VISION_IMAGE}>
            <MissionText isLong={isLongText(VISION)}>{VISION}</MissionText>
          </MissionCard>
          <MissionCard label={ABOUT_PAGE_TEXT.giaTriNhan} image={VALUES_IMAGE} position={VALUES_IMAGE_POSITION}>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {CORE_VALUES.map((v) => (
                <li key={v.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory/12 text-mist-300">
                    <Icon name={v.icon} size={17} />
                  </span>
                  <span>
                    <span className="block font-medium">{v.title}</span>
                    <span className="mt-0.5 hidden text-meta leading-snug text-ivory/80 sm:block">{v.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </MissionCard>
          <MissionCard label={HOME_TEXT.danhHieuNhan} image={AWARD_IMAGE}>
            <MissionText>{AWARD_NAME}</MissionText>
            <span className="mt-5 flex items-center gap-2">
              <img
                src={HOME_TEXT.anhChungNhan1.src}
                alt={HOME_TEXT.anhChungNhan1.alt}
                loading="lazy"
                className="h-12 w-12 rounded-lg bg-white object-contain p-1"
              />
              <img
                src={HOME_TEXT.anhChungNhan2.src}
                alt={HOME_TEXT.anhChungNhan2.alt}
                loading="lazy"
                className="h-12 w-auto rounded-lg bg-white object-contain p-1"
              />
            </span>
          </MissionCard>
        </div>
        </MobileMore>

        {/* Mục 35: sự kiện đồng hành, hiện cả trên điện thoại */}
        <EventsStrip />
      </Container>
    </section>
  )
}

interface MissionCardProps {
  label: string
  image: ImageSource
  position?: string
  children: ReactNode
}

function MissionText({ children, isLong = false }: { children: ReactNode; isLong?: boolean }) {
  const size = isLong ? 'text-[1.08rem] leading-relaxed sm:text-[1.15rem]' : 'text-[1.35rem] leading-snug sm:text-[1.55rem]'
  return <p className={`font-display mt-3 max-w-xl ${size}`}>{children}</p>
}

/**
 * Một khuôn chung cho cả bốn thẻ: ảnh 3:2 phía trên, nền chàm, nhãn nhỏ, chữ trắng.
 * Ảnh Sứ mệnh, Tầm nhìn là ảnh thật 3:2 (owner chọn 06/11/2026) nên hiện trọn; ảnh Giá trị cốt lõi vuông thì căn bằng `position`.
 */
function MissionCard({ label, image, position, children }: MissionCardProps) {
  return (
    <article data-reveal className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-deep-900 text-ivory">
      <div className="ecm-parallax relative aspect-[3/2] overflow-hidden">
        <Placeholder
          className="h-full w-full !rounded-none transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
          note={label}
          image={image}
          position={position}
        />
      </div>
      <div className="flex-1 p-7 sm:p-9">
        <p className="eyebrow !text-mist-300">{label}</p>
        {children}
      </div>
    </article>
  )
}
