import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'
import { CONTACT } from '../../data/brand'
import { productsUrl } from '../../data/links'
import { HERO_CATEGORIES, HERO_HEADLINE, HERO_HEADLINE_PREFIX, HERO_IMAGES } from '../../data/heroBanner'
import { HOME_TEXT } from '../../data/pageText/home'

/**
 * Phần đầu trang chủ. Lịch sử: 12/10/2026 ảnh Bảng EC "ảnh trọn khung"; 02/11/2026 cụm logo A2.
 *
 * 16/11/2026: Ecopillo gửi banner mới (images/Banner website.psd), owner chọn A1 (mẫu: docs/de-xuat-banner-moi-16-11.html):
 * đúng như banner, dòng "Chốn yên bắt đầu từ GIẤC NGỦ NGON" + tim, 4 biểu tượng Chăn / Ga / Gối / Đệm bấm sang danh mục, giữ 2 nút.
 * Bỏ cụm logo A2, nên logo trên thanh đầu trang hiện ngay từ đầu (src/components/layout/Header.tsx).
 * Chữ, đường link, đường dẫn ảnh: src/data/heroBanner.ts. Ảnh xuất bằng docs/de-xuat-banner-moi-16-11/xuat-anh-web.py.
 *
 * Hai ý còn lại của Bảng EC (Hệ sinh thái sản phẩm; Vì một giấc ngủ chất lượng hơn) gom vào
 * MỘT dải trắng ngay dưới ảnh.
 */

/** "Hệ sinh thái sản phẩm" lấy ý từ Bảng EC; dòng mô tả chỉ hiện khi rê chuột (title). Link, ảnh cố định; tên, câu Ecopillo sửa (HOME_TEXT) */
const ECOSYSTEM_LINKS: readonly { to: string; thumb: string }[] = [
  { to: productsUrl({ 'danh-muc': 'chan' }), thumb: '/images/products/chan-long-vu-tu-nhien-sm.webp' },
  { to: productsUrl({ 'danh-muc': 'bo-chan-ga' }), thumb: '/images/details/hero-ed25-sm.webp' },
  { to: productsUrl({ 'danh-muc': 'goi' }), thumb: '/images/products/ruot-goi-micro-plus-sm.webp' },
  { to: productsUrl({ 'danh-muc': 'dem' }), thumb: '/images/products/dem-lo-xo-tui-doc-lap-sm.webp' },
]
const ECOSYSTEM = ECOSYSTEM_LINKS.map((link, i) => ({ ...link, ...(HOME_TEXT.heSinhThaiO[i] ?? { name: '', text: '' }) })).filter((item) => item.name)

const DESKTOP_MEDIA = '(min-width: 768px)'
/**
 * 768–1279px: ảnh phủ kín khung cao 400–520px nên rộng tối đa ~1400px (khung × 2,72);
 * từ 1280px: ảnh trọn khung theo bề ngang. Giữ khớp với thẻ preload trong index.html.
 */
const DESKTOP_SIZES = '(min-width: 1280px) 100vw, 1400px'

/**
 * Trình duyệt chỉ tải một file theo bề ngang màn hình (điện thoại: ảnh dọc; máy tính: ảnh ngang).
 * Hai bản (điện thoại, máy tính) dùng đúng một kiểu thẻ này nên cùng chọn một file, không tải hai lần.
 */
function HeroPicture({ className }: { className: string }) {
  return (
    <picture>
      <source media={DESKTOP_MEDIA} srcSet={HERO_IMAGES.desktopSrcSet} sizes={DESKTOP_SIZES} />
      {/* Điện thoại: ảnh phủ hết bề ngang khung */}
      <img
        src={HERO_IMAGES.mobileSrc}
        srcSet={HERO_IMAGES.mobileSrcSet}
        sizes="100vw"
        width={900}
        height={1500}
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
 * Dòng tiêu đề '"Chốn Yên" bắt đầu từ Giấc ngủ ngon' + dải lụa, tim (banner 20/11/2026): ảnh cắt từ file thiết kế (font của banner máy không có).
 * Tiêu đề cấp 1 đọc thành "Chăn ga gối đệm cao cấp Ecopillo: “Chốn Yên” bắt đầu từ giấc ngủ ngon" (phần đầu ẩn, chỉ Google
 * và trình đọc màn hình thấy), để trang chủ vẫn có tên hãng trong H1.
 * Trang chỉ có một thẻ <h1> (bản điện thoại, vì Google xếp hạng theo bản điện thoại);
 * bản máy tính là tiêu đề cấp 1 bằng role.
 */
/**
 * Hai bản (điện thoại, máy tính) cùng một chuỗi sizes để trình duyệt chọn cùng một file, không tải hai lần.
 * Điện thoại: rộng tối đa 22rem; máy tính: 39% bề ngang khung (dòng chữ 20/11 rộng 810 / 2069 px của banner).
 */
const HEADLINE_SIZES = '(min-width: 768px) clamp(296px, 39vw, 800px), min(calc(100vw - 40px), 352px)'

function Headline({ isMain, className }: { isMain: boolean; className: string }) {
  const content = (
    <>
      <span className="sr-only">{HERO_HEADLINE_PREFIX}</span>
      <img
        src={HERO_IMAGES.headlineSrc}
        srcSet={HERO_IMAGES.headlineSrcSet}
        sizes={HEADLINE_SIZES}
        width={1000}
        height={281}
        alt={HERO_HEADLINE}
        decoding="async"
        className={`block h-auto ${className}`}
      />
    </>
  )
  return isMain ? (
    <h1 className="hero-in">{content}</h1>
  ) : (
    <p role="heading" aria-level={1} className="hero-in">
      {content}
    </p>
  )
}

interface CategoryRowSize {
  /** Khung cả hàng */
  row: string
  /** Vòng tròn biểu tượng */
  circle: string
  name: string
  text: string
}

/**
 * Bốn biểu tượng Chăn / Ga / Gối / Đệm như banner, bấm sang danh mục.
 * Vòng tròn vẽ bằng CSS (màu xanh nhạt của bộ nhận diện, gần đúng dải màu trong file thiết kế) để luôn nét;
 * nét vẽ bên trong là ảnh tách từ file thiết kế.
 */
function CategoryRow({ size }: { size: CategoryRowSize }) {
  return (
    <ul style={delay(80)} className={`hero-in ${size.row}`}>
      {HERO_CATEGORIES.map((c) => (
        <li key={c.name}>
          <Link
            to={c.to}
            className="group flex flex-col items-center rounded-2xl text-center text-deep-900 outline-offset-4"
          >
            <span
              className={`relative block rounded-full bg-[linear-gradient(153deg,var(--color-page),var(--color-mist-100)_52%,var(--color-page))] shadow-[0_6px_16px_-10px_rgb(45_46_141/0.45)] ring-1 ring-deep-900/15 transition duration-300 ease-[var(--ease-soft)] group-hover:-translate-y-1 group-hover:ring-deep-900/35 group-active:scale-95 ${size.circle}`}
            >
              <img src={c.icon} alt="" width={200} height={200} decoding="async" className="absolute inset-0 size-full" />
            </span>
            <span className={`font-medium leading-tight ${size.name}`}>{c.name}</span>
            <span className={`leading-snug text-ink-soft ${size.text}`}>{c.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Điện thoại: bốn ô chia đều bề ngang */
const MOBILE_ROW: CategoryRowSize = {
  row: 'mt-5 grid w-full grid-cols-4 gap-1',
  circle: 'size-[3.25rem]',
  name: 'mt-1.5 text-[0.95rem]',
  text: 'text-meta',
}

/** Máy tính: co theo bề ngang khung (cqi), như tỉ lệ trong banner */
const DESKTOP_ROW: CategoryRowSize = {
  row: 'mt-[clamp(1rem,2.3cqi,2.25rem)] flex gap-[clamp(0.75rem,2cqi,2.25rem)] [&>li]:w-[clamp(5rem,8.6cqi,10rem)]',
  circle: 'size-[clamp(3rem,4.6cqi,5.5rem)]',
  name: 'mt-[clamp(0.375rem,0.6cqi,0.75rem)] text-[clamp(1rem,1.5cqi,1.6rem)]',
  text: 'text-[clamp(0.8125rem,1.15cqi,1.25rem)] whitespace-nowrap',
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
          {HOME_TEXT.heSinhThai}<span className="hidden sm:inline"> · {HOME_TEXT.heSinhThaiPhu}</span>
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
          {HOME_TEXT.giaTriTieuDe}
        </h2>
        {/*
          Như bảng hiệu: mỗi chữ kèm một câu ngắn bên dưới (mục 5, khách yêu cầu 16/10/2026); ô trắng như ô Hệ sinh thái.
          Chị Phương 17/11/2026 bỏ dòng "Vải Lyocell nhập khẩu · 3 kháng vượt trội · Thoáng mát" dưới ba ô: "ở dưới có rồi, để cho gọn".
        */}
        <ul className="grid flex-1 grid-cols-3 gap-2 bg-brand-gold/10 p-2 sm:gap-2.5 sm:p-2.5">
          {HOME_TEXT.giaTri.map((v) => (
            <li key={v.word} className={`flex flex-col items-center justify-center px-1 py-2 text-center sm:px-1.5 ${GOLD_CELL}`}>
              <span className="font-display block text-[1.25rem] leading-tight text-deep-900 sm:text-[1.45rem]">{v.word}</span>
              <span className="mt-0.5 block text-meta leading-snug text-ink-soft">{v.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/**
 * Điện thoại (A1 16/11/2026): ảnh dọc dựng riêng, trời phía trên, cảnh giường phía dưới.
 * Tiêu đề, 4 biểu tượng, 2 nút nằm trên phần trời; không phủ lớp mờ lên ảnh.
 * Xếp bằng flex, không dùng absolute: khách bật chữ to (200%) thì khung tự cao theo, chữ không chồng lên nhau.
 */
function MobileTop() {
  return (
    <div className="relative flex min-h-[clamp(600px,166.67vw,860px)] flex-col md:hidden">
      <HeroPicture className="absolute inset-0 h-full w-full object-cover object-bottom" />
      <div className="relative flex flex-col items-center px-5 pt-[5.25rem]">
        <Headline isMain className="w-[min(100%,22rem)]" />
        <CategoryRow size={MOBILE_ROW} />
        <div style={delay(160)} className="hero-in mt-5 grid w-full grid-cols-2 gap-2.5">
          <a href="#bo-suu-tap" className={buttonClass('primary', 'md', 'px-3')}>
            Xem bộ sưu tập
          </a>
          {/* Mục 3: thay "Đặt hàng online"; điện thoại rút còn "Gọi ngay" để hai nút vẫn một hàng (owner chốt 17/10/2026) */}
          <a href={CONTACT.hotlineTel} className={buttonClass('light', 'md', 'px-3')}>
            <Icon name="phone" size={16} />
            Gọi ngay
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Máy tính. Từ 1280px ảnh trọn khung theo bề ngang, chữ đặt đúng chỗ trong banner (lề trái 9,4%, rộng 36%), nên khi màn hình
 * rộng hơn khung nội dung 1240px chữ vẫn không lấn sang giường.
 * 768–1279px: ảnh phủ kín khung cao 400–520px; 768–1023px neo 30% bề ngang (lá cây không lấn vào hàng biểu tượng),
 * từ 1024px neo phải, để chữ nằm trên trời, cô gái và giường luôn trọn trong khung (đo ở 768, 900, 1024, 1279px).
 */
export function Hero() {
  return (
    <section aria-label="Ecopillo, chốn yên bắt đầu từ giấc ngủ ngon" className="relative -mt-[4.5rem] bg-gradient-to-b from-hero-sky-top to-hero-sky-bottom">
      <MobileTop />

      <div className="@container relative hidden overflow-hidden md:block md:h-[clamp(400px,40vw,520px)] xl:h-auto">
        <HeroPicture className="absolute inset-0 h-full w-full object-cover object-[30%_center] lg:object-right xl:static xl:block xl:aspect-[2069/760] xl:h-auto" />

        {/* Chừa chỗ cho thanh đầu trang trong suốt phía trên */}
        <div className="absolute inset-0 z-10 flex items-center pt-[4.5rem] pl-8 lg:pl-10 xl:pl-[9.4%]">
          <div>
            <Headline isMain={false} className="-ml-[2.7cqi] w-[clamp(18.5rem,39.15cqi,50rem)]" />
            <CategoryRow size={DESKTOP_ROW} />
            <div style={delay(160)} className="hero-in mt-[clamp(1.25rem,2.4cqi,2.5rem)] flex gap-3">
              <a href="#bo-suu-tap" className={buttonClass('primary', 'md', 'xl:h-14 xl:px-7 xl:text-base')}>
                Xem bộ sưu tập
                <Icon name="arrowRight" size={18} />
              </a>
              <a href={CONTACT.hotlineTel} className={buttonClass('secondary', 'md', 'xl:h-14 xl:px-7 xl:text-base')}>
                <Icon name="phone" size={18} />
                Gọi ngay cho chúng tôi
              </a>
            </div>
          </div>
        </div>
      </div>

      <Container className="relative pt-1 pb-10 md:pt-6">
        <BangEcBar />
      </Container>
    </section>
  )
}
