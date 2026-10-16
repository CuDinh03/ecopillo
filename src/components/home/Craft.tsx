import { Icon, type IconName } from '../ui/Icon'
import { CRAFT_QUOTE, LYOCELL_INTRO, LYOCELL_TRAITS } from '../../data/about'
import { staticImage } from '../../data/catalog'
import { revealDelay } from '../../lib/reveal'
import { CountUp } from '../ui/CountUp'
import { Placeholder } from '../ui/Placeholder'
import { Container, SectionHeading } from '../ui/primitives'

const TRUST: readonly { icon: IconName; title: string; text: string }[] = [
  // "3 kháng vượt trội" đã lên phần đầu trang (3 ý Bảng EC); con số thương hiệu chuyển xuống đây
  { icon: 'award', title: '15+ năm trong nghề', text: 'Hơn 15.000 khách hàng tin dùng' },
  { icon: 'certified', title: 'ISO 9001:2015\u00a0·\u00a0TQC', text: 'Quy trình sản xuất được chứng nhận' },
  { icon: 'stitch', title: 'Đường may 4 mũi/cm', text: 'Chắc, phẳng, bền qua nhiều lần giặt' },
  { icon: 'ruler', title: 'May theo kích thước', text: 'Vừa khít mọi chiếc giường' },
  { icon: 'truck', title: 'Kiểm hàng khi nhận', text: 'Được trải thử lên giường trước khi trả tiền' },
]

/**
 * Mỗi ô: biểu tượng ở trên, chữ căn giữa bên dưới, các ô rộng bằng nhau và cách vạch ngăn như nhau,
 * để tiêu đề không bị chạm vạch và các dòng mô tả xuống dòng đều nhau.
 */
export function TrustStrip() {
  return (
    <section aria-label="Cam kết của Ecopillo" className="border-y border-cream-200 bg-cream-50">
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-5">
          {TRUST.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={revealDelay(i)}
              className={`flex flex-col items-center gap-2.5 px-3 py-5 text-center sm:gap-3 sm:py-7 lg:px-4 ${
                i % 2 === 1 ? 'border-l border-cream-200' : ''
              } ${i > 0 ? 'lg:border-l lg:border-cream-200' : ''} ${i >= 2 ? 'border-t border-cream-200 lg:border-t-0' : ''} ${
                i === TRUST.length - 1 && TRUST.length % 2 === 1 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-mist-600 ring-1 ring-cream-200">
                <Icon name={item.icon} size={19} />
              </span>
              <span className="block">
                <span className="block text-[0.84rem] font-medium text-balance text-deep-900 sm:text-[0.9rem]">{item.title}</span>
                <span className="mx-auto mt-1 hidden max-w-[14rem] text-[0.8rem] leading-snug text-balance text-ink-soft sm:block">
                  {item.text}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="py-14 sm:py-32">
      <Container>
        <div className="grid gap-8 sm:gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              id="story-title"
              eyebrow="Chất liệu & tay nghề"
              title={
                <>
                  Từ thiên nhiên <span className="text-mist-600 italic">đến giấc ngủ</span>
                </>
              }
              lead={LYOCELL_INTRO}
            />
            <blockquote data-reveal style={revealDelay(1)} className="mt-6 border-l-2 sm:mt-8 border-mist-300 pl-5 font-display text-[1.35rem] leading-snug text-deep-800 italic">
              “{CRAFT_QUOTE}”
            </blockquote>
            <div className="mt-10 hidden items-center gap-5 rounded-2xl bg-mist-50 p-5 ring-1 ring-mist-200 sm:flex">
              <p className="font-display text-[2.5rem] leading-none text-deep-900">
                <CountUp value="15.000+" />
              </p>
              <p className="text-sm leading-snug text-ink-soft">
                gia đình, khách sạn và resort đã chọn Ecopillo cho phòng ngủ của mình.
              </p>
            </div>
          </div>

          {/* Bento chất liệu */}
          <div className="m-rail grid gap-4 sm:grid-cols-6 lg:col-span-7">
            <article data-reveal className="relative overflow-hidden rounded-[1.75rem] bg-deep-800 text-ivory sm:col-span-6 sm:grid sm:grid-cols-[1.35fr_1fr]">
              <div className="p-7 sm:p-9">
                <p className="eyebrow !text-mist-300">Chất liệu</p>
                <h3 className="font-display mt-3 text-[1.7rem] leading-tight">Lyocell từ sợi gỗ tự nhiên</h3>
                <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 sm:mt-6 sm:gap-y-4">
                  {LYOCELL_TRAITS.map((t) => (
                    <div key={t.title}>
                      <dt className="flex items-center gap-1.5 text-sm font-medium text-ivory">
                        <Icon name="leaf" size={14} className="text-mist-300" />
                        {t.title}
                      </dt>
                      <dd className="mt-1 hidden text-[0.8rem] leading-snug text-mist-200/85 sm:block">{t.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="ecm-parallax aspect-[16/10] sm:aspect-auto sm:min-h-56 sm:rounded-l-[1.75rem]">
                <Placeholder
                  tone="deep"
                  className="h-full w-full"
                  note="Ảnh cận chất vải Lyocell"
                  image={staticImage('/images/details/lyocell-et01.webp', 'Cận mặt vải Lyocell trơn bộ Eco Tera ET01')}
                />
              </div>
            </article>

            <article data-reveal style={revealDelay(1)} className="flex flex-col overflow-hidden rounded-[1.75rem] bg-cream-100 sm:col-span-3">
              <div className="ecm-parallax aspect-[5/3] rounded-b-[1.75rem]">
                <Placeholder
                  className="h-full w-full"
                  note="Ảnh cận họa tiết chần thêu độc quyền"
                  image={staticImage('/images/details/theu-ed25.webp', 'Họa tiết thêu chim và hoa trên bộ Eco Doris ED25')}
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-deep-900">Chần thêu độc quyền</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Họa tiết do Ecopillo tự thiết kế, chần thủ công và thêu tỉ mỉ, không trùng lặp ngoài thị trường.
                </p>
              </div>
            </article>

            <div className="contents sm:col-span-3 sm:grid sm:gap-4">
              <article data-reveal style={revealDelay(2)} className="relative overflow-hidden rounded-[1.75rem] bg-mist-100 p-6">
                <Icon name="stitch" size={150} strokeWidth={1} className="absolute -right-6 -bottom-6 text-mist-300/60 sm:hidden" />
                <Icon name="stitch" size={22} className="relative text-mist-600" />
                <h3 className="font-display relative mt-3 text-2xl text-deep-900">Đường may 4 mũi/cm</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">
                  Mép vải được khoá chắc, không sổ chỉ, giữ form đẹp sau nhiều năm.
                </p>
              </article>
              <article data-reveal style={revealDelay(3)} className="relative overflow-hidden rounded-[1.75rem] bg-ivory p-6 ring-1 ring-cream-200">
                <Icon name="weave" size={150} strokeWidth={1} className="absolute -right-6 -bottom-6 text-brass-100 sm:hidden" />
                <Icon name="weave" size={22} className="relative text-brass-500" />
                <h3 className="font-display relative mt-3 text-2xl text-deep-900">Dệt Jacquard</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">
                  Ở dòng Eco Sweet, hoa văn được dệt thẳng vào sợi, nổi khối tinh tế.
                </p>
              </article>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
