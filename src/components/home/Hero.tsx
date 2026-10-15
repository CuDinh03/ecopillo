import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'
import { PATHS, productsUrl } from '../../data/links'

/**
 * Phần đầu trang chủ — bản chốt 12/10/2026, phương án "ảnh trọn khung": ảnh Bảng EC hiện đủ, rõ,
 * không phủ lớp mờ; chữ nằm vào khoảng trời bên trái ảnh (màn hình rộng) hoặc ngay trên ảnh (điện thoại).
 *
 * Thứ bậc: 1 câu chính "Nâng niu giấc mơ xanh" → 1 dòng nghiêng "Chốn yên…" → 2 nút.
 * Hai ý còn lại của Bảng EC (Hệ sinh thái sản phẩm; Vì một giấc ngủ chất lượng hơn) gom vào
 * MỘT dải trắng ngay dưới ảnh.
 */

/** "Hệ sinh thái sản phẩm" lấy ý từ Bảng EC; dòng mô tả chỉ hiện khi rê chuột (title) */
const ECOSYSTEM: readonly { name: string; text: string; to: string; thumb: string }[] = [
  { name: 'Chăn', text: 'Nhẹ nhàng, ấm áp', to: productsUrl({ 'danh-muc': 'chan' }), thumb: '/images/products/chan-long-vu-tu-nhien-sm.webp' },
  { name: 'Ga', text: 'Mềm mại, thoáng mát', to: productsUrl({ 'danh-muc': 'bo-chan-ga' }), thumb: '/images/details/hero-ed25-sm.webp' },
  { name: 'Gối', text: 'Nâng niu từng giấc ngủ', to: productsUrl({ 'danh-muc': 'goi' }), thumb: '/images/products/ruot-goi-micro-plus-sm.webp' },
  { name: 'Đệm', text: 'Nâng đỡ chuẩn cột sống', to: productsUrl({ 'danh-muc': 'dem' }), thumb: '/images/products/dem-lo-xo-tui-doc-lap-sm.webp' },
]

const VALUES = ['Tốt', 'Thật', 'Thiện'] as const

// TODO: chờ Ecopillo xác nhận 3 kháng gồm những gì (chữ lấy nguyên từ Bảng EC)
const BENEFITS: readonly { icon: IconName; text: string }[] = [
  { icon: 'leaf', text: 'Vải Lyocell nhập khẩu' },
  { icon: 'shield', text: '3 kháng vượt trội' },
  { icon: 'air', text: 'Thoáng mát' },
]

const MOBILE_SRC = '/images/hero/bang-ec-ai-mobile-900.webp'
// Bản 1800px / 3200px cắt lại từ ảnh gốc Bảng EC cho màn hình nét cao (điện thoại, Retina) để ảnh không bị nhoè
const MOBILE_SRCSET = '/images/hero/bang-ec-ai-mobile-900.webp 900w, /images/hero/bang-ec-ai-mobile-1800.webp 1771w'
const DESKTOP_SRCSET =
  '/images/hero/bang-ec-ai-desktop-1600.webp 1600w, /images/hero/bang-ec-ai-desktop-2400.webp 2400w, /images/hero/bang-ec-ai-desktop-3200.webp 3200w'
const DESKTOP_MEDIA = '(min-width: 768px)'
/**
 * 768–1279px: ảnh phủ kín khung cao 440–540px nên rộng tối đa ~1460px (540 × 2,7);
 * từ 1280px: ảnh trọn khung theo bề ngang. Giữ khớp với thẻ preload trong index.html.
 */
const DESKTOP_SIZES = '(min-width: 1280px) 100vw, 1460px'

/** Trình duyệt chỉ tải một file theo bề ngang màn hình (điện thoại: ảnh 900px; máy tính: ảnh ngang) */
function HeroPicture({ className }: { className: string }) {
  return (
    <picture>
      <source media={DESKTOP_MEDIA} srcSet={DESKTOP_SRCSET} sizes={DESKTOP_SIZES} />
      {/* Điện thoại: ảnh phủ kín cao ~660px nên bề ngang hiển thị khoảng 770px */}
      <img
        src={MOBILE_SRC}
        srcSet={MOBILE_SRCSET}
        sizes="770px"
        width={900}
        height={775}
        alt=""
        fetchPriority="high"
        decoding="async"
        className={className}
      />
    </picture>
  )
}

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

/** Dòng đỏ — cùng màu chữ "ETERNAL" trong logo */
function Tagline() {
  return (
    <p data-reveal className="flex items-center gap-3 text-[0.72rem] font-semibold tracking-[0.2em] text-tagline uppercase">
      <span className="h-px w-8 bg-tagline" aria-hidden="true" />
      Chăn ga gối đệm cao cấp
    </p>
  )
}

const SUBLINE = 'Chốn yên, bắt đầu từ giấc ngủ ngon'

const BAR_LABEL = 'text-[0.68rem] font-medium tracking-[0.18em] text-mist-600 uppercase'

/** Dải trắng duy nhất: Hệ sinh thái sản phẩm | Vì một giấc ngủ chất lượng hơn */
function BangEcBar() {
  return (
    <div
      data-reveal
      style={delay(320)}
      className="grid gap-5 rounded-[1.5rem] bg-ivory/92 p-4 shadow-[var(--shadow-lift)] ring-1 ring-ivory backdrop-blur-md sm:p-5 lg:grid-cols-[1.25fr_auto_1fr] lg:items-center lg:gap-7 lg:px-7 lg:py-5"
    >
      <section aria-labelledby="hero-ecosystem">
        <h2 id="hero-ecosystem" className={BAR_LABEL}>
          Hệ sinh thái sản phẩm<span className="hidden sm:inline"> · cho giấc ngủ trọn vẹn</span>
        </h2>
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
          {ECOSYSTEM.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                title={item.text}
                className="group flex flex-col items-center gap-1.5 rounded-xl text-center text-[0.85rem] font-medium text-deep-900 transition sm:flex-row sm:gap-2.5 sm:bg-cream-50 sm:py-1.5 sm:pr-4 sm:pl-1.5 sm:hover:bg-cream-200"
              >
                <img
                  src={item.thumb}
                  alt=""
                  width={640}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-full rounded-xl object-cover sm:h-10 sm:w-10 sm:rounded-lg"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <span aria-hidden="true" className="h-px bg-cream-200 lg:h-16 lg:w-px" />

      <section aria-labelledby="hero-quality">
        <h2 id="hero-quality" className={BAR_LABEL}>
          Vì một giấc ngủ chất lượng hơn
        </h2>
        <p className="font-display mt-1.5 text-[1.45rem] leading-tight text-deep-900">
          {VALUES.map((v, i) => (
            <span key={v}>
              {i > 0 && (
                <span aria-hidden="true" className="mx-2 text-mist-600/40">
                  ·
                </span>
              )}
              {v}
            </span>
          ))}
        </p>
        <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8rem] text-ink-soft">
          {BENEFITS.map((b) => (
            <li key={b.text} className="inline-flex items-center gap-1.5">
              <Icon name={b.icon} size={15} className="text-mist-600" />
              {b.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/**
 * Điện thoại — mẫu A: ảnh phủ kín, câu chính đặt trên phần rèm trắng, dòng nghiêng và 2 nút ở chân ảnh
 * (trên nền chăn gối trắng, để chữ không đè lên tóc người mẫu). Không phủ lớp mờ lên ảnh.
 * Câu chính co theo bề ngang để "giấc mơ xanh" luôn nằm một dòng, kể cả ở 320px.
 */
function MobileTop() {
  return (
    <div className="relative h-[min(660px,82svh)] md:hidden">
      <HeroPicture className="absolute inset-0 h-full w-full object-cover object-[88%_center]" />
      <div className="relative px-5 pt-[6.25rem]">
        <Tagline />
        <h1
          id="hero-title-m"
          data-reveal
          style={delay(90)}
          className="font-display mt-3 text-[clamp(2.4rem,12.3vw,3rem)] leading-[1.02] text-deep-900"
        >
          Nâng niu
          <br />
          <span className="text-mist-600 italic">giấc mơ xanh</span>
        </h1>
      </div>
      <div className="absolute inset-x-5 bottom-5">
        <p data-reveal style={delay(160)} className="font-display text-[clamp(1rem,4.5vw,1.1rem)] text-deep-700 italic">
          {SUBLINE}
        </p>
        <div data-reveal style={delay(240)} className="mt-3 grid grid-cols-2 gap-2.5">
          <a href="#bo-suu-tap" className={buttonClass('primary', 'md')}>
            Xem bộ sưu tập
          </a>
          <Link to={PATHS.order} className={buttonClass('light', 'md')}>
            Đặt hàng online
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Cỡ câu chính trên màn hình rộng: co nhẹ theo bề ngang để chữ luôn nằm gọn trong khoảng trời
 * bên trái ảnh, không chạm vào chùm lá (lá bắt đầu ở khoảng 41% bề ngang ảnh).
 */
const TITLE_WIDE = 'xl:text-[clamp(3.4rem,calc(91px-1.5vw),4.5rem)]'

/**
 * Màn hình hẹp hơn 1280px (máy tính thu nhỏ cửa sổ, máy tính bảng): ảnh trọn khung thì quá thấp để chứa chữ,
 * nên khung được nâng lên 440–540px, ảnh phủ kín và neo phải để cô gái luôn ở bên phải.
 * Chùm lá khi đó lấn vào chỗ chữ, nên chỉ làm dịu một vùng hình bầu dục ngay sau khối chữ.
 * Trước 14/10/2026 là một dải màu trời phủ kín 44–68% bề ngang, làm cả nửa trái ảnh (rèm, lá) mờ hẳn
 * so với bản đủ cỡ; owner báo "thu nhỏ màn hình thì ảnh mờ một phần".
 * Từ 1280px trở lên lớp này tắt, ảnh rõ hoàn toàn như bản chốt.
 */
const NARROW_TEXT_GLOW =
  'bg-[radial-gradient(ellipse_46%_62%_at_22%_56%,rgb(235_246_253/0.92)_0%,rgb(235_246_253/0.75)_45%,transparent_100%)]'

export function Hero() {
  return (
    <section
      aria-label="Ecopillo, Nâng niu giấc mơ xanh"
      className="relative -mt-[4.5rem] bg-gradient-to-b from-hero-sky-top to-hero-sky-bottom"
    >
      <MobileTop />

      <div className="relative hidden overflow-hidden md:block md:h-[clamp(440px,44vw,540px)] xl:h-auto">
        <HeroPicture className="absolute inset-0 h-full w-full object-cover object-right xl:static xl:block xl:aspect-[2400/888] xl:h-auto" />
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 xl:hidden ${NARROW_TEXT_GLOW}`} />

        {/* Chữ luôn đặt vào khoảng trời bên trái ảnh, chừa chỗ cho header trong suốt phía trên */}
        <Container className="absolute inset-0 z-10 flex items-center pt-[4.5rem]">
          <div>
            <Tagline />
            <h1
              id="hero-title"
              data-reveal
              style={delay(90)}
              className={`font-display mt-5 text-[3.5rem] leading-[1.02] text-deep-900 lg:text-[4rem] ${TITLE_WIDE}`}
            >
              Nâng niu
              <br />
              <span className="text-mist-600 italic">giấc mơ xanh</span>
            </h1>
            <p data-reveal style={delay(160)} className="font-display mt-3 text-[1.35rem] text-deep-700 italic">
              {SUBLINE}
            </p>
            <div data-reveal style={delay(240)} className="mt-7 flex gap-3">
              <a href="#bo-suu-tap" className={buttonClass('primary', 'lg')}>
                Xem bộ sưu tập
                <Icon name="arrowRight" size={18} />
              </a>
              <Link to={PATHS.order} className={buttonClass('secondary', 'lg')}>
                Đặt hàng online
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative pt-1 pb-10 md:pt-6">
        <BangEcBar />
      </Container>
    </section>
  )
}
