import { Icon, type IconName } from '../ui/Icon'
import { CRAFT_QUOTE, LYOCELL_INTRO, LYOCELL_TRAITS } from '../../data/about'
import { revealDelay } from '../../lib/reveal'
import { Placeholder } from '../ui/Placeholder'
import { Container, SectionHeading } from '../ui/primitives'
import { HOME_TEXT } from '../../data/pageText/home'

/** Biểu tượng theo thứ tự ô; chữ các ô Ecopillo sửa ở Nội dung web (HOME_TEXT.camKet), ô thứ 6 trở đi dùng lại từ đầu */
const TRUST_ICONS: readonly IconName[] = ['award', 'certified', 'stitch', 'ruler', 'truck']
const TRUST: readonly { icon: IconName; title: string; text: string }[] = HOME_TEXT.camKet.map((item, i) => ({
  icon: TRUST_ICONS[i % TRUST_ICONS.length],
  ...item,
}))

/**
 * Mỗi ô: biểu tượng ở trên, chữ căn giữa bên dưới, các ô rộng bằng nhau và cách vạch ngăn như nhau,
 * để tiêu đề không bị chạm vạch và các dòng mô tả xuống dòng đều nhau.
 * Khách 04/11/2026 "làm nổi bật phần này": đặt trong khối trắng nổi (nền cả web xanh), biểu tượng nền chàm, tiêu đề to và đậm hơn.
 */
export function TrustStrip() {
  return (
    <section aria-label={HOME_TEXT.camKetDoc} className="pb-2">
      <Container>
        <ul className="grid grid-cols-2 overflow-hidden rounded-[1.5rem] bg-ivory shadow-[var(--shadow-soft)] lg:grid-cols-5">
          {TRUST.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={revealDelay(i)}
              className={`flex flex-col items-center gap-3 px-3 py-6 text-center sm:py-8 lg:px-4 ${
                i % 2 === 1 ? 'border-l border-line' : ''
              } ${i > 0 ? 'lg:border-l lg:border-line' : ''} ${i >= 2 ? 'border-t border-line lg:border-t-0' : ''} ${
                i === TRUST.length - 1 && TRUST.length % 2 === 1 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-deep-800 text-ivory sm:h-14 sm:w-14">
                <Icon name={item.icon} size={24} />
              </span>
              <span className="block">
                <span className="block text-small font-semibold text-balance text-deep-900 sm:text-body">{item.title}</span>
                <span className="mx-auto mt-1 hidden max-w-[14rem] text-small leading-snug text-balance text-ink-soft sm:block">
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

/** "Hàng trăm nghìn" → "Hàng trăm" + xuống dòng + "nghìn" */
function lastWordOnNewLine(text: string) {
  const at = text.lastIndexOf(' ')
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <br />
      {text.slice(at + 1)}
    </>
  )
}

export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="py-14 sm:py-24">
      <Container>
        {/* Hai cột từ 1280px: ở 1024–1279 cột chữ của ô "Đường may", "Dệt Jacquard" chỉ còn ~115px, tiêu đề gãy 3 dòng (rà máy tính bảng 06/11/2026) */}
        <div className="grid gap-8 sm:gap-14 xl:grid-cols-12 xl:gap-10">
          <div className="xl:col-span-5">
            {/* Gắn data-nosnippet lên đoạn giới thiệu vải Lyocell (owner chốt 27/11/2026): tránh Google cắt đoạn này làm mô tả trang chủ
                thay cho câu mô tả thương hiệu ngày 18/11 ở đầu trang */}
            <SectionHeading
              id="story-title"
              title={HOME_TEXT.chatLieuTieuDe}
              lead={LYOCELL_INTRO}
              leadNoSnippet
            />
            <blockquote data-reveal style={revealDelay(1)} className="mt-6 border-l-2 sm:mt-8 border-mist-600 pl-5 font-display text-[1.35rem] leading-snug text-deep-800 italic">
              “{CRAFT_QUOTE}”
            </blockquote>
            <div className="mt-10 hidden items-center gap-5 rounded-2xl bg-mist-50 p-5 shadow-[var(--shadow-soft)] sm:flex">
              {/* Owner 18/11/2026: "Hàng trăm nghìn" thay "15.000+" (chữ, không còn số đếm tăng dần) */}
              <p className="shrink-0 font-display text-[2rem] leading-[1.05] text-deep-900">
                {/* Chữ cuối xuống dòng như mẫu đã duyệt ("Hàng trăm / nghìn") */}
                {lastWordOnNewLine(HOME_TEXT.soKhach)}
              </p>
              <p className="text-sm leading-snug text-ink-soft">{HOME_TEXT.soKhachChu}</p>
            </div>
          </div>

          {/* Bento chất liệu. Điện thoại: dải vuốt ngang (m-rail) không có nút nào bên trong, nên tự nhận tiêu điểm để cuộn được bằng phím */}
          <div
            tabIndex={0}
            role="group"
            aria-label={HOME_TEXT.chatLieuDoc}
            className="m-rail grid gap-4 focus-visible:outline-2 focus-visible:outline-deep-700 sm:grid-cols-6 xl:col-span-7"
          >
            <article data-reveal className="relative overflow-hidden rounded-[1.75rem] bg-deep-800 text-ivory sm:col-span-6 sm:grid sm:grid-cols-[1.35fr_1fr]">
              <div className="p-7 sm:p-9">
                <p className="eyebrow !text-mist-300">{HOME_TEXT.lyocellNhan}</p>
                <h3 className="font-display mt-3 text-[1.7rem] leading-tight">{HOME_TEXT.lyocellTieuDe}</h3>
                <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 sm:mt-6 sm:gap-y-4">
                  {LYOCELL_TRAITS.map((t) => (
                    <div key={t.title}>
                      <dt className="flex items-center gap-1.5 text-sm font-medium text-ivory">
                        <Icon name="leaf" size={14} className="text-mist-300" />
                        {t.title}
                      </dt>
                      <dd className="mt-1 hidden text-meta leading-snug text-mist-200/85 sm:block">{t.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="ecm-parallax aspect-[16/10] sm:aspect-auto sm:min-h-56 sm:rounded-l-[1.75rem]">
                <Placeholder
                  tone="deep"
                  className="h-full w-full"
                  note="Ảnh cận chất vải Lyocell"
                  image={HOME_TEXT.anhLyocell}
                />
              </div>
            </article>

            <article data-reveal style={revealDelay(1)} className="flex flex-col overflow-hidden rounded-[1.75rem] bg-cream-100 sm:col-span-3">
              <div className="ecm-parallax aspect-[5/3] rounded-b-[1.75rem]">
                <Placeholder
                  className="h-full w-full"
                  note="Ảnh cận họa tiết chần thêu độc quyền"
                  image={HOME_TEXT.anhTheu}
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-deep-900">{HOME_TEXT.theuTieuDe}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{HOME_TEXT.theuChu}</p>
              </div>
            </article>

            {/* Hai ô có ảnh minh hoạ (khách yêu cầu 16/10/2026, mục 7 và 8). Máy tính: ảnh trái, chữ phải để hai ô cao bằng ô "Chần thêu"; điện thoại: ảnh trên như ô "Chần thêu" */}
            <div className="contents sm:col-span-3 sm:grid sm:gap-4">
              <article data-reveal style={revealDelay(2)} className="flex flex-col overflow-hidden rounded-[1.75rem] sm:grid sm:grid-cols-[2fr_3fr] bg-mist-100">
                <Placeholder
                  className="aspect-[5/3] w-full rounded-b-[1.75rem] sm:aspect-auto sm:h-full sm:min-h-36 sm:rounded-none"
                  note="Ảnh cận đường may"
                  image={HOME_TEXT.anhDuongMay}
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 40vw, 300px"
                />
                <div className="p-5">
                  <Icon name="stitch" size={20} className="text-mist-600" />
                  <h3 className="font-display mt-2 text-[1.35rem] leading-tight text-deep-900">{HOME_TEXT.duongMayTieuDe}</h3>
                  <p className="mt-1.5 text-small leading-relaxed text-ink-soft">{HOME_TEXT.duongMayChu}</p>
                </div>
              </article>
              <article data-reveal style={revealDelay(3)} className="flex flex-col overflow-hidden rounded-[1.75rem] sm:grid sm:grid-cols-[2fr_3fr] bg-ivory shadow-[var(--shadow-soft)]">
                <Placeholder
                  className="aspect-[5/3] w-full rounded-b-[1.75rem] sm:aspect-auto sm:h-full sm:min-h-36 sm:rounded-none"
                  note="Ảnh cận hoa văn dệt Jacquard"
                  image={HOME_TEXT.anhJacquard}
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 40vw, 300px"
                  // Giữ nhãn tròn "ES 06" góc dưới trái trong khung (Ecopillo trả lời 23/10/2026)
                  position="left center"
                />
                <div className="p-5">
                  <Icon name="weave" size={20} className="text-brass-500" />
                  <h3 className="font-display mt-2 text-[1.35rem] leading-tight text-deep-900">{HOME_TEXT.jacquardTieuDe}</h3>
                  <p className="mt-1.5 text-small leading-relaxed text-ink-soft">{HOME_TEXT.jacquardChu}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
