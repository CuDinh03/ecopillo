import { Link } from 'react-router-dom'
import { patternImage } from '../../data/catalog'
import { HOTEL_PARTNERS } from '../../data/content'
import { PATHS } from '../../data/links'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { ContactButtons, Container, SectionHeading } from '../ui/primitives'

const BENEFITS = [
  'May theo kích thước giường của từng hạng phòng',
  'Đồng bộ mẫu, màu cho toàn bộ dự án',
  'Báo giá riêng cho đơn số lượng lớn',
  'Tư vấn chất liệu theo công suất phòng',
] as const

export function Hospitality() {
  return (
    <section
      id="khach-san"
      aria-labelledby="hotel-title"
      className="grain relative overflow-hidden bg-deep-900 py-14 text-ivory sm:py-32"
    >
      <Container className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <SectionHeading
            id="hotel-title"
            tone="dark"
            eyebrow="Khách sạn · Resort · Nhà nghỉ"
            title={
              <>
                Giấc ngủ năm sao <span className="text-mist-300 italic">cho khách lưu trú</span>
              </>
            }
            lead="Ecopillo cung cấp chăn ga gối số lượng lớn cho khách sạn, resort và nhà nghỉ, với chất liệu Lyocell và đường may 4 mũi/cm bền đẹp."
          />
          <ul data-reveal className="mt-9 grid gap-3 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b} className="flex gap-3 text-[0.92rem] text-mist-100">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-deep-700 text-mist-300">
                  <Icon name="check" size={12} strokeWidth={2.2} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <ContactButtons
            variant="onDark"
            size="lg"
            stretch
            className="mt-10"
            callLabel="Gọi nhận báo giá"
            zaloLabel="Gửi yêu cầu qua Zalo"
          />
          <Link
            to={PATHS.hotel}
            className="mt-4 -mb-2 inline-flex items-center gap-1.5 py-2 text-[0.95rem] font-medium text-mist-200 underline-offset-4 hover:text-ivory hover:underline"
          >
            Xem giải pháp cho khách sạn <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <div className="lg:col-span-6">
          <div data-reveal style={revealDelay(1)} className="ecm-parallax aspect-[16/10] rounded-[2rem] sm:aspect-[5/4]">
            <Placeholder
              tone="deep"
              className="h-full w-full"
              note="Ảnh phòng khách sạn đối tác sử dụng chăn ga Ecopillo"
              image={patternImage('ED10', 'Bộ ga phủ Eco Doris ED10 trắng tinh, phong cách phòng khách sạn')}
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
        </div>
      </Container>

      <Container className="mt-10 sm:mt-20">
        <p className="eyebrow !text-mist-400">Đã đồng hành cùng</p>
        <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {HOTEL_PARTNERS.map((partner, i) => (
            <li
              key={partner.name}
              data-reveal
              style={revealDelay(i)}
              className="flex h-20 items-center justify-center overflow-hidden rounded-2xl bg-ivory px-4 py-3 sm:h-32 sm:px-5 sm:py-4 shadow-[var(--shadow-soft)] sm:h-32"
            >
              <img
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full rounded-md object-contain"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
