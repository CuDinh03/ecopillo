import { useState } from 'react'
import { Link } from 'react-router-dom'
import { staticImage, type ImageSource } from '../../data/catalog'
import { PATHS } from '../../data/links'
import { revealDelay } from '../../lib/reveal'
import { Icon, type IconName } from '../ui/Icon'
import { MobileMore } from '../ui/MobileMore'
import { Placeholder } from '../ui/Placeholder'
import { Container, FillIn, SectionHeading } from '../ui/primitives'

/* Nội dung theo trang Giới thiệu và trang chủ cũ của ecopillo.com.vn */

const PHILOSOPHY = [
  { word: 'Tốt', text: 'trong chất lượng sản phẩm: nguyên liệu chọn lọc, từng chi tiết được chế tác kỹ lưỡng.' },
  { word: 'Thật', text: 'trong cam kết với khách hàng: chính trực, tận tâm và minh bạch.' },
  { word: 'Thiện', text: 'trong cách chọn vật liệu và hành động: hướng tới cộng đồng và môi trường.' },
] as const

const VALUES: readonly { icon: IconName; title: string; text: string }[] = [
  { icon: 'award', title: 'Chất lượng vượt trội', text: 'Nguyên liệu tự nhiên, công nghệ tiên tiến.' },
  { icon: 'recycle', title: 'Bảo vệ môi trường', text: 'Vật liệu bền vững, quy trình thân thiện, sản phẩm dùng lâu bền.' },
  { icon: 'lightbulb', title: 'Đổi mới, sáng tạo', text: 'Cải tiến chất liệu và thiết kế từ góp ý của khách hàng.' },
  { icon: 'community', title: 'Kết nối cộng đồng xanh', text: 'Lan toả lối sống và tiêu dùng bền vững.' },
]

const FOUNDER_IMAGE: ImageSource = {
  src: '/images/about/chi-phuong.webp',
  srcSet: '/images/about/chi-phuong-sm.webp 800w, /images/about/chi-phuong.webp 1309w',
  alt: 'Chị Phạm Thị Phương, người sáng lập Ecopillo, tại VTV3',
}

/** moreLink: trên trang chủ thêm lối sang trang Giới thiệu đầy đủ */
export function About({ moreLink = false }: { moreLink?: boolean }) {
  // Điện thoại: chỉ hiện đoạn đầu, bấm để đọc tiếp cho trang ngắn hơn
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <section id="ve-chung-toi" aria-labelledby="about-title" className="py-14 sm:py-32">
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
                Mỗi sản phẩm làm ra đều bắt đầu từ sự tử tế.
              </p>
            </blockquote>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <SectionHeading
              id="about-title"
              eyebrow="Về chúng tôi"
              title={
                <>
                  Từ trái tim một người <span className="text-mist-600 italic">làm nghề lâu năm</span>
                </>
              }
            />
            <p data-reveal className="mt-5">
              <FillIn>[ECOPILLO ĐANG DUYỆT LẠI CÂU CHỮ PHẦN CÂU CHUYỆN THƯƠNG HIỆU]</FillIn>
            </p>
            <div data-reveal style={revealDelay(1)} className="mt-5 max-w-2xl space-y-5 text-[1.02rem] leading-relaxed text-ink-soft">
              <p>
                Một giấc ngủ không trọn đôi khi chẳng bắt đầu từ điều gì lớn lao: chiếc ga quá thô ráp, đứa trẻ trằn
                trọc vì chăn bí nóng, hay người lớn mang cả áp lực vào giấc ngủ sau một ngày dài.
              </p>
              <div className={isExpanded ? 'space-y-5' : 'hidden space-y-5 sm:block'}>
                <p>
                  Người đặt nền móng cho thương hiệu là <strong className="font-medium text-deep-900">chị Phạm Thị Phương</strong>,
                  hơn 15 năm trong nghề chăn ga, từ sản xuất đến bán lẻ. Chị luôn trăn trở làm sao để mỗi sản phẩm giúp
                  khách hàng tạo dựng một <em className="text-deep-900">“Chốn Yên”</em>: nơi giấc ngủ lành mạnh được vun
                  đắp và cơ thể được phục hồi trọn vẹn.
                </p>
                <p>
                  Từ đó, Ecopillo® ra đời với một cam kết: mỗi sản phẩm làm ra đều bắt đầu từ sự tử tế, và kết thúc bằng
                  sự bình yên trong giấc ngủ của mọi gia đình.
                </p>
              </div>
              {!isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="-my-2.5 inline-flex items-center gap-1 py-2.5 text-sm font-medium text-deep-800 sm:hidden"
                >
                  Đọc tiếp câu chuyện <Icon name="chevronDown" size={15} />
                </button>
              )}
            </div>

            <ol className="m-rail mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
              {PHILOSOPHY.map((p, i) => (
                <li key={p.word} data-reveal style={revealDelay(i)} className="rounded-[1.25rem] bg-mist-50 p-5 ring-1 ring-mist-200">
                  <p className="font-display text-[2rem] leading-none text-mist-600 italic">{p.word}</p>
                  <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-soft">{p.text}</p>
                </li>
              ))}
            </ol>
            {moreLink && (
              <Link
                to={PATHS.about}
                className="mt-5 -mb-2 inline-flex items-center gap-1.5 py-2 text-[0.95rem] font-medium text-deep-800 underline-offset-4 hover:underline"
              >
                Xem trang Giới thiệu đầy đủ <Icon name="arrowRight" size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Điện thoại: sứ mệnh, tầm nhìn, giá trị cốt lõi nằm sau nút (vẫn có trong trang) */}
        <MobileMore label="Sứ mệnh, tầm nhìn, giá trị cốt lõi" buttonClassName="mt-6">
        <div className="m-rail mt-12 grid gap-5 sm:mt-20 lg:grid-cols-2">
          <MissionCard
            label="Sứ mệnh"
            text="Mang đến giải pháp chăn ga gối đệm vừa nâng niu giấc ngủ, vừa góp phần bảo vệ môi trường."
            image={staticImage('/images/about/su-menh.webp', 'Sứ mệnh Ecopillo: thay màu cho yêu thương')}
          />
          <MissionCard
            label="Tầm nhìn"
            text="Trở thành thương hiệu chăn ga gối đệm hàng đầu, kết hợp chất lượng vượt trội với trách nhiệm môi trường, đồng hành cùng các gia đình Việt."
            image={staticImage('/images/about/tam-nhin.webp', 'Tầm nhìn Ecopillo')}
            position="50% 0%"
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div data-reveal className="rounded-[1.75rem] bg-cream-50 p-7 ring-1 ring-cream-200 sm:p-9">
            <p className="eyebrow">Giá trị cốt lõi</p>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {VALUES.map((v) => (
                <li key={v.title} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-mist-600 ring-1 ring-cream-200">
                    <Icon name={v.icon} size={18} />
                  </span>
                  <span>
                    <span className="block font-medium text-deep-900">{v.title}</span>
                    <span className="mt-0.5 hidden text-[0.85rem] leading-snug text-ink-soft sm:block">{v.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <figure data-reveal style={revealDelay(1)} className="overflow-hidden rounded-[1.75rem] bg-deep-900 text-ivory">
            <div className="aspect-[2/1]">
              <Placeholder
                className="h-full w-full !rounded-none"
                note="Ảnh lễ trao danh hiệu"
                image={staticImage(
                  '/images/about/thuong-hieu-dan-dau.webp',
                  'Ecopillo tại lễ công bố Thương hiệu dẫn đầu Việt Nam 2025',
                )}
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-4 p-6">
              <span>
                <span className="block text-[0.7rem] tracking-[0.16em] text-mist-300 uppercase">Danh hiệu</span>
                <span className="font-display mt-1 block text-xl">Thương hiệu dẫn đầu Việt Nam 2025</span>
              </span>
              <span className="flex items-center gap-2">
                <img
                  src="/images/partners/iso-9001.webp"
                  alt="Chứng nhận ISO 9001:2015"
                  loading="lazy"
                  className="h-12 w-12 rounded-lg bg-white object-contain p-1"
                />
                <img
                  src="/images/partners/tqc.webp"
                  alt="Chứng nhận TQC"
                  loading="lazy"
                  className="h-12 w-auto rounded-lg bg-white object-contain p-1"
                />
              </span>
            </figcaption>
          </figure>
        </div>
        </MobileMore>
      </Container>
    </section>
  )
}

interface MissionCardProps {
  label: string
  text: string
  image: ReturnType<typeof staticImage>
  position?: string
}

/**
 * Hai ảnh là banner có chữ viết tay nên khung giữ tỉ lệ 3:2: ảnh Sứ mệnh (3:2) hiện trọn,
 * ảnh Tầm nhìn (vuông) neo mép trên để dòng chữ trong ảnh không bị cắt.
 */
function MissionCard({ label, text, image, position }: MissionCardProps) {
  return (
    <article data-reveal className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-deep-900 text-ivory">
      <div className="ecm-parallax aspect-[3/2] overflow-hidden">
        <Placeholder
          className="h-full w-full !rounded-none transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
          note={label}
          image={image}
          position={position}
        />
      </div>
      <div className="p-7 sm:p-9">
        <p className="eyebrow !text-mist-300">{label}</p>
        <p className="font-display mt-3 max-w-lg text-[1.35rem] leading-snug sm:text-[1.55rem]">{text}</p>
      </div>
    </article>
  )
}
