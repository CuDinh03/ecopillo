import { Link } from 'react-router-dom'
import {
  MATTRESS_ALL_PATH,
  MATTRESS_CHIPS,
  MATTRESS_FEATURED,
  MATTRESS_PICKER_LEAD,
  MATTRESS_PICKER_TITLE,
  MATTRESS_PREFERENCES,
} from '../../data/mattressPicker'
import { formatVND } from '../../lib/format'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, Container, SectionHeading } from '../ui/primitives'

/**
 * Khối đệm trang chủ (C3, owner chốt 02/11/2026): mẫu lớn Eco Luxe + 4 dòng cách nằm + chip nhóm + "Xem tất cả đệm".
 * Đặt đầu DesktopHome / MobileHome; không thêm Đệm vào menu. Điện thoại xếp dọc, chip vuốt ngang.
 */
export function MattressPicker() {
  return (
    <section id="chon-dem" aria-labelledby="chon-dem-title" className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <SectionHeading
            id="chon-dem-title"
            className="sm:max-w-2xl"
            title={MATTRESS_PICKER_TITLE}
            lead={MATTRESS_PICKER_LEAD}
          />
          <Link to={MATTRESS_ALL_PATH} className={buttonClass('primary', 'md', 'shrink-0 self-start max-sm:hidden')}>
            {/* max-sm:hidden chứ không phải hidden: BTN_BASE có inline-flex đè lên hidden, điện thoại hiện hai nút */}
            Xem tất cả đệm
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          {/* Mẫu lớn Eco Luxe — [XÁC NHẬN mẫu đặt lớn] */}
          <Link
            to={MATTRESS_FEATURED.to}
            data-reveal
            className="group relative block overflow-hidden rounded-[1.75rem] bg-ivory shadow-[var(--shadow-soft)] transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist-600"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Placeholder
                className="absolute inset-0 h-full w-full !rounded-none border-0 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                tone="mist"
                note={MATTRESS_FEATURED.name}
                image={MATTRESS_FEATURED.image}
                sizes="(min-width: 1024px) 560px, 100vw"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-deep-950/80 from-25% to-deep-950/0" />
              <span className="absolute inset-x-5 bottom-4 text-ivory sm:inset-x-6 sm:bottom-5">
                <span className="eyebrow !text-mist-200">Nổi bật</span>
                <span className="font-display mt-1.5 block text-[1.55rem] leading-tight sm:text-[1.85rem]">{MATTRESS_FEATURED.name}</span>
              </span>
            </div>
            <div className="flex flex-col gap-2 p-5 sm:p-6">
              <p className="text-body-sm leading-relaxed text-ink-soft">{MATTRESS_FEATURED.text}</p>
              <p className="tabular text-body-sm font-semibold text-deep-900">từ {formatVND(MATTRESS_FEATURED.min)}</p>
            </div>
          </Link>

          <div data-reveal style={revealDelay(1)} className="flex flex-col rounded-[1.75rem] bg-ivory p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <p className="eyebrow">Quý khách thích nằm thế nào?</p>
            <ul className="mt-3.5 flex flex-1 flex-col divide-y divide-line">
              {MATTRESS_PREFERENCES.map((row) => (
                <li key={row.to}>
                  <Link
                    to={row.to}
                    className="group -mx-2 flex gap-3.5 rounded-xl px-2 py-3.5 transition-colors hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist-600 sm:gap-4"
                  >
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Placeholder
                        className="absolute inset-0 h-full w-full !rounded-none border-0"
                        tone="mist"
                        note={row.productName}
                        image={{ ...row.thumb, alt: '' }}
                        sizes="64px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-deep-900 group-hover:text-mist-600">{row.title}</span>
                      <span className="mt-0.5 line-clamp-2 text-meta leading-snug text-ink-soft">{row.text}</span>
                      <span className="tabular mt-1.5 block text-label font-semibold text-deep-900">từ {formatVND(row.min)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <ul
            aria-label="Nhóm đệm"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 py-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {/* Chị Phương 09/11/2026: "cho nền hoặc chữ đậm hơn": chữ đậm + viền chàm mảnh để nút nổi khỏi nền xanh */}
            {MATTRESS_CHIPS.map((chip) => (
              <li key={chip.to} className="shrink-0">
                <Link
                  to={chip.to}
                  className="inline-flex h-10 items-center rounded-full bg-ivory px-4 text-small font-semibold text-deep-900 shadow-[var(--shadow-soft)] ring-1 ring-deep-900/15 transition duration-300 ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  {chip.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to={MATTRESS_ALL_PATH} className={buttonClass('primary', 'md', 'w-full justify-center sm:hidden')}>
            Xem tất cả đệm
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
