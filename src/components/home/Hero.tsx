import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'
import { CONTACT } from '../../data/brand'
import { VALUES_SHORT } from '../../data/about'
import { productsUrl } from '../../data/links'

/**
 * Phần đầu trang chủ — bản chốt 12/10/2026, phương án "ảnh trọn khung": ảnh Bảng EC hiện đủ, rõ,
 * không phủ lớp mờ; chữ nằm vào khoảng trời bên trái ảnh (màn hình rộng) hoặc ngay trên ảnh (điện thoại).
 *
 * Khách yêu cầu 02/11/2026, owner chọn A2 (mẫu: docs/de-xuat-dau-trang-va-dem-02-11.html): chữ đầu trang là MỘT cụm như logo,
 * canh giữa theo nhau: dòng đỏ "Chăn ga gối đệm cao cấp" → hình chữ ECOPILLO ETERNAL → câu viết tay "Nâng niu giấc mơ xanh"
 * nhỏ hơn chữ Ecopillo (trước đó câu viết tay to nhất, khách xem tưởng là tên hãng). Bỏ dòng "Chốn yên…".
 * Ở trang chủ, logo nhỏ trên thanh đầu trang ẩn khi cụm này còn trên màn hình (src/components/layout/Header.tsx).
 *
 * Câu viết tay dùng đúng font của dòng slogan trong logo (1FTV VIP Betterlett, lớp font-slogan, src/index.css; mục 2).
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

/**
 * Chữ đầu trang hiện dần ngay khi trang vẽ lần đầu, chỉ bằng CSS (lớp hero-in, src/index.css), không chờ JS hiện dần
 * nạp xong: trước đó máy chậm phải tới ~1,5s chữ mới đậm đủ (rà 23/10/2026; HIEU-UNG-GHI-CHU.md mục 3.4).
 */
const delay = (ms: number) => ({ '--hero-delay': `${ms}ms` }) as CSSProperties

/**
 * Cụm chữ đầu trang (A2, 02/11/2026). Tiêu đề cấp 1 gồm dòng đỏ và hình chữ Ecopillo (alt), nên Google đọc được
 * "Chăn ga gối đệm cao cấp Ecopillo Eternal"; câu viết tay nằm ngoài tiêu đề.
 * Hình chữ cắt từ images/Logo-Ecopillo-Viet-Nam-1080x447.png, bỏ dòng slogan (có width/height để không xô bố cục).
 * Font viết tay chỉ có đúng các chữ của câu này: đổi chữ thì phải cắt lại font (src/index.css).
 */
const LOGO_SRC = '/images/brand/logo-ecopillo-chu-980.webp'
const LOGO_SRCSET = '/images/brand/logo-ecopillo-chu-480.webp 480w, /images/brand/logo-ecopillo-chu-980.webp 980w'

interface LockupSize {
  /** Cỡ dòng đỏ */
  tagline: string
  /** Bề ngang hình chữ Ecopillo, kèm `sizes` khớp với bề ngang đó */
  logo: string
  logoSizes: string
  /** Cỡ câu viết tay */
  slogan: string
}

function Lockup({ size, isMain }: { size: LockupSize; isMain: boolean }) {
  const title = (
    <>
      <span
        className={`hero-in block leading-tight font-medium tracking-[0.12em] text-tagline uppercase ${size.tagline}`}
      >
        Chăn ga gối đệm cao cấp
      </span>{' '}
      <img
        src={LOGO_SRC}
        srcSet={LOGO_SRCSET}
        sizes={size.logoSizes}
        width={980}
        height={239}
        alt="Ecopillo Eternal"
        style={delay(60)}
        className={`hero-in mx-auto mt-[0.45em] block h-auto ${size.logo}`}
      />
    </>
  )
  return (
    <div data-hero-lockup className="flex w-max max-w-full flex-col items-center text-center">
      {/*
        Trang chỉ có một thẻ <h1> (bản điện thoại, vì Google xếp hạng theo bản điện thoại).
        Bản máy tính là tiêu đề cấp 1 cho trình đọc màn hình bằng role; HomePage bỏ bản đang ẩn sau khi gắn React.
      */}
      {isMain ? (
        <h1 id="hero-title-m">{title}</h1>
      ) : (
        <p id="hero-title" role="heading" aria-level={1}>
          {title}
        </p>
      )}
      <p style={delay(120)} className={`hero-in font-slogan mt-[0.3em] leading-[1.18] font-normal text-deep-900 ${size.slogan}`}>
        Nâng niu giấc mơ xanh
      </p>
    </div>
  )
}

/** Điện thoại: cụm chữ chiếm khoảng 3/4 bề ngang như mẫu A2 */
const MOBILE_LOCKUP: LockupSize = {
  tagline: 'text-[clamp(0.95rem,4.6vw,1.2rem)]',
  logo: 'w-[min(76vw,22rem)]',
  logoSizes: '(max-width: 767px) min(76vw, 352px)',
  slogan: 'text-[clamp(1.75rem,9vw,2.35rem)]',
}

/**
 * Màn hình rộng: co theo bề ngang để cả cụm nằm gọn trong khoảng trời bên trái ảnh,
 * không chạm chùm lá (lá bắt đầu ở khoảng 41% bề ngang ảnh).
 */
const DESKTOP_LOCKUP: LockupSize = {
  tagline: 'text-[clamp(1rem,1.55vw,1.4rem)]',
  logo: 'w-[clamp(18rem,30vw,29rem)]',
  logoSizes: 'clamp(288px, 30vw, 464px)',
  slogan: 'text-[clamp(1.9rem,3vw,2.9rem)]',
}

/** Khung vàng dùng chung cho hai khối của dải: viền vàng, tiêu đề trên dải vàng, ruột vàng nhạt */
const GOLD_FRAME = 'flex flex-col overflow-hidden rounded-2xl border-2 border-brand-gold'
const GOLD_TITLE = 'bg-brand-gold px-3.5 py-1.5 text-label font-medium tracking-[0.14em] text-deep-900 uppercase sm:px-4'
const GOLD_CELL = 'rounded-xl bg-ivory shadow-[0_6px_14px_-10px_rgb(45_46_141/0.45)]'

/**
 * Dải trắng duy nhất: Hệ sinh thái sản phẩm | Vì một giấc ngủ chất lượng hơn.
 * Chị Phương 09/11/2026: "bên tốt thật thiện e cũng làm khung cam như bên hệ sinh thái cho cân": hai khối cùng khung vàng,
 * cao bằng nhau, bỏ vạch ngăn giữa.
 */
function BangEcBar() {
  return (
    <div
      style={delay(240)}
      className="hero-in grid gap-4 rounded-[1.5rem] bg-ivory/92 p-4 shadow-[var(--shadow-lift)] ring-1 ring-ivory backdrop-blur-md sm:p-5 lg:grid-cols-[1.25fr_1fr] lg:gap-5 lg:px-6 lg:py-5"
    >
      {/*
        Mục 4 (khách yêu cầu 16/10/2026), kiểu B owner chọn 17/10/2026 (mẫu: docs/de-xuat-dau-trang-chu-goi-4.html):
        một khung vàng bao cả bốn ô, tiêu đề nằm trên dải vàng ở đầu khung, bốn ô to hơn trước.
        Vàng #FFC271 ngoài quà tặng, ưu đãi: ngoại lệ owner duyệt cho riêng dải này.
      */}
      <section aria-labelledby="hero-ecosystem" className={GOLD_FRAME}>
        <h2 id="hero-ecosystem" className={GOLD_TITLE}>
          Hệ sinh thái sản phẩm<span className="hidden sm:inline"> · cho giấc ngủ trọn vẹn</span>
        </h2>
        <ul className="grid flex-1 grid-cols-4 gap-2 bg-brand-gold/10 p-2 sm:gap-2.5 sm:p-2.5">
          {ECOSYSTEM.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                title={item.text}
                className={`group flex flex-col items-center gap-1.5 p-1.5 pb-2 text-center text-body-sm font-medium text-deep-900 transition hover:-translate-y-0.5 hover:text-deep-700 ${GOLD_CELL}`}
              >
                <img
                  src={item.thumb}
                  alt=""
                  width={640}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-full rounded-lg object-cover"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="hero-quality" className={GOLD_FRAME}>
        <h2 id="hero-quality" className={GOLD_TITLE}>
          Vì một giấc ngủ chất lượng hơn
        </h2>
        <div className="flex flex-1 flex-col gap-2 bg-brand-gold/10 p-2 sm:gap-2.5 sm:p-2.5">
          {/* Như bảng hiệu: mỗi chữ kèm một câu ngắn bên dưới (mục 5, khách yêu cầu 16/10/2026); ô trắng như ô Hệ sinh thái */}
          <ul className="grid flex-1 grid-cols-3 gap-2 sm:gap-2.5">
            {VALUES_SHORT.map((v) => (
              <li key={v.word} className={`flex flex-col items-center justify-center px-1 py-2 text-center sm:px-1.5 ${GOLD_CELL}`}>
                <span className="font-display block text-[1.25rem] leading-tight text-deep-900 sm:text-[1.45rem]">{v.word}</span>
                <span className="mt-0.5 block text-meta leading-snug text-ink-soft">{v.text}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-1 text-meta text-deep-800">
            {BENEFITS.map((b) => (
              <li key={b.text} className="inline-flex items-center gap-1.5">
                <Icon name={b.icon} size={15} className="text-mist-600" />
                {b.text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

/**
 * Điện thoại — mẫu A: ảnh phủ kín, cụm chữ đặt trên phần rèm trắng, 2 nút ở chân ảnh
 * (trên nền chăn gối trắng, để chữ không đè lên tóc người mẫu). Không phủ lớp mờ lên ảnh.
 */
function MobileTop() {
  return (
    <div className="relative flex min-h-[min(660px,82svh)] flex-col md:hidden">
      <HeroPicture className="absolute inset-0 h-full w-full object-cover object-[88%_center]" />
      <div className="relative px-5 pt-[6.25rem]">
        <Lockup size={MOBILE_LOCKUP} isMain />
      </div>
      {/* Xếp bằng flex, không dùng absolute: khách bật chữ to (200%) thì khung tự cao theo, chữ không chồng lên nhau */}
      <div className="relative mt-auto px-5 pt-6 pb-5">
        <div style={delay(180)} className="hero-in flex flex-wrap gap-2.5 [&>a]:flex-1 [&>a]:basis-[9rem]">
          <a href="#bo-suu-tap" className={buttonClass('primary', 'md')}>
            Xem bộ sưu tập
          </a>
          {/* Mục 3: thay "Đặt hàng online"; điện thoại rút còn "Gọi ngay" để hai nút vẫn một hàng (owner chốt 17/10/2026) */}
          <a href={CONTACT.hotlineTel} className={buttonClass('light', 'md')}>
            <Icon name="phone" size={16} />
            Gọi ngay
          </a>
        </div>
      </div>
    </div>
  )
}

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
            <Lockup size={DESKTOP_LOCKUP} isMain={false} />
            <div style={delay(180)} className="hero-in mt-7 flex gap-3">
              <a href="#bo-suu-tap" className={buttonClass('primary', 'lg')}>
                Xem bộ sưu tập
                <Icon name="arrowRight" size={18} />
              </a>
              <a href={CONTACT.hotlineTel} className={buttonClass('secondary', 'lg')}>
                <Icon name="phone" size={18} />
                Gọi ngay cho chúng tôi
              </a>
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
