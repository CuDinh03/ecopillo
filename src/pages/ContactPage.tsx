import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CONTACT, mapEmbedUrl, OPENING_HOURS, SHOWROOMS } from '../data/brand'
import { PATHS } from '../data/links'
import { policyPath } from '../data/policyNav'
import { Icon, ZaloMark } from '../components/ui/Icon'
import { buttonClass, Container } from '../components/ui/primitives'
import { SocialIcons } from '../components/home/SocialLinks'
import { MessageForm, TOPICS, type Topic } from '../components/contact/MessageForm'
import { DealerFinder, LocalBusinessData } from '../components/dealers/DealerFinder'
import { usePageMeta } from '../hooks/usePageMeta'
import { scrollToElement } from '../lib/scroll'

/**
 * Trang Liên hệ mua hàng (mục 9 phản hồi 05/11, phương án A).
 * Gộp trang Liên hệ cũ + điểm bán (trước đây /he-thong-phan-phoi/).
 * Thứ tự: kênh liên hệ → văn phòng/chi nhánh → tìm điểm bán (#diem-ban) → form.
 * /he-thong-phan-phoi/ và /showroom/ 301 về đây; ?gan-toi=1 cuộn tới #diem-ban và hỏi vị trí.
 */

interface ChannelProps {
  href: string
  icon: ReactNode
  label: string
  value: string
  external?: boolean
}

/** Email ngắt dòng sau "ecopillo" (C2, 09/11/2026): "cskh@ecopillo / .com.vn", không bẻ giữa chữ */
function breakEmail(value: string): ReactNode {
  const dot = value.indexOf('.', value.indexOf('@'))
  if (dot < 0) return value
  return (
    <>
      {value.slice(0, dot)}
      <wbr />
      {value.slice(dot)}
    </>
  )
}

/** Ô hotline chàm trên cùng: thứ đầu tiên Quý khách thấy */
function HotlineCard() {
  return (
    <a
      href={CONTACT.hotlineTel}
      className="group flex items-center gap-4 rounded-2xl bg-deep-800 p-4 text-ivory shadow-[var(--shadow-lift)] transition duration-300 hover:-translate-y-0.5 hover:bg-deep-700 sm:p-5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory/15 sm:h-12 sm:w-12">
        <Icon name="phone" size={22} />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-label font-medium tracking-[0.12em] text-ivory/75 uppercase">Hotline</span>
        <span className="tabular mt-1 block text-[1.35rem] font-medium sm:text-[1.5rem]">{CONTACT.hotlineDisplay}</span>
        <span className="mt-0.5 block text-meta text-ivory/80">{OPENING_HOURS} · có Zalo</span>
      </span>
      <Icon name="arrowRight" size={18} className="shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
    </a>
  )
}

/**
 * Ô kênh liên hệ thấp (C2 phương án 2, owner chốt 09/11/2026): biểu tượng cạnh nhãn, giá trị bên dưới.
 * Điện thoại 2×2, từ 640px bốn ô một hàng dưới ô hotline.
 */
function Channel({ href, icon, label, value, external }: ChannelProps) {
  const isEmail = value.includes('@')
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex h-full min-h-[5.75rem] flex-col justify-between gap-2.5 rounded-2xl bg-ivory px-2.5 py-3 text-deep-900 min-[360px]:p-3 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:p-4"
    >
      {/* Biểu tượng nhỏ, chữ giãn vừa: "Điện thoại" nằm một dòng ở cả 320px và ô máy tính */}
      <span className="flex items-center gap-1.5 min-[360px]:gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-deep-800">{icon}</span>
        <span className="text-label font-medium tracking-[0.06em] whitespace-nowrap text-mist-600 uppercase">{label}</span>
      </span>
      {/* Số điện thoại xuống dòng chứ không cắt khi khách bật chữ to (rà 23/10/2026: "không bao giờ cắt số") */}
      <span className={`tabular block leading-tight font-medium ${isEmail ? 'text-small' : 'text-[0.875rem] min-[360px]:text-[0.95rem] sm:text-body'}`}>
        {isEmail ? breakEmail(value) : value}
      </span>
    </a>
  )
}

/** ?chu-de=… chọn sẵn chủ đề khi khách đi từ trang khác sang */
const TOPIC_PARAM: Readonly<Record<string, Topic>> = {
  'dai-ly': 'Đăng ký mở đại lý',
  'khach-san': 'Khách sạn, nhà nghỉ',
  'bao-hanh': 'Bảo hành, đổi hàng',
  'don-hang': 'Hỏi về đơn hàng',
}

const CHANNELS: readonly (ChannelProps & { key: string })[] = [
  { key: 'phone', href: CONTACT.phoneTel, icon: <Icon name="phone" size={18} />, label: 'Điện thoại', value: CONTACT.phoneDisplay },
  { key: 'zalo', href: CONTACT.zaloUrl, icon: <ZaloMark />, label: 'Zalo', value: CONTACT.hotlineDisplay, external: true },
  {
    key: 'messenger',
    href: CONTACT.messengerUrl,
    icon: <Icon name="messenger" size={18} />,
    label: 'Messenger',
    value: 'Ecopillo.com.vn',
    external: true,
  },
  { key: 'email', href: `mailto:${CONTACT.email}`, icon: <Icon name="mail" size={18} />, label: 'Email', value: CONTACT.email },
]

/** Bản đồ địa chỉ văn phòng / chi nhánh; bấm Hà Nội / TP. HCM để đổi điểm */
function OfficeMap() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const place = SHOWROOMS[index]
  return (
    <div className="overflow-hidden rounded-[2rem] bg-ivory shadow-[var(--shadow-soft)]">
      <iframe
        key={place.id}
        title={`Bản đồ ${place.kind} Ecopillo, ${place.address}`}
        src={mapEmbedUrl(place.address)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block aspect-[4/3] w-full border-0 bg-cream-50"
      />
      <div className="p-5 sm:p-6">
        <div role="group" aria-label="Chọn địa điểm" className="flex flex-wrap gap-2">
          {SHOWROOMS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-meta transition ${
                i === index ? 'bg-deep-800 text-ivory' : 'bg-cream-50 text-deep-900 ring-1 ring-cream-200 hover:ring-deep-700/40'
              }`}
            >
              {s.city}
            </button>
          ))}
        </div>
        <p className="eyebrow mt-4">{place.kind}</p>
        <p className="mt-1.5 font-medium text-deep-900">{place.address}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'sm')}>
            <Icon name="pin" size={16} /> Chỉ đường
          </a>
          <button
            type="button"
            onClick={() => navigate(`${PATHS.contact}#diem-ban`)}
            className={buttonClass('secondary', 'sm')}
          >
            Tìm đại lý gần tôi
          </button>
        </div>
      </div>
    </div>
  )
}

export function ContactPage() {
  const office = SHOWROOMS[0]
  const [params] = useSearchParams()
  const { hash } = useLocation()
  const navigate = useNavigate()
  const topic = TOPIC_PARAM[params.get('chu-de') ?? ''] ?? TOPICS[0]
  usePageMeta(
    'Liên hệ mua hàng',
    'Hotline, Zalo, email, văn phòng Hà Nội và TP. HCM, cùng hệ thống đại lý Ecopillo trên toàn quốc. Gửi tin nhắn, Ecopillo gọi lại trong giờ làm việc.',
  )

  // 301 máy chủ từ /he-thong-phan-phoi/?gan-toi=1 mất #diem-ban: gắn lại neo qua React Router
  // (không dùng history.replaceState — SiteLayout cần hash để ẩn thanh liên hệ dưới đáy)
  useEffect(() => {
    if (params.get('gan-toi') !== '1') return
    if (hash !== '#diem-ban') {
      navigate(`${PATHS.contact}?gan-toi=1#diem-ban`, { replace: true })
      return
    }
    const frame = requestAnimationFrame(() => {
      const el = document.getElementById('diem-ban')
      if (el) scrollToElement(el)
    })
    return () => cancelAnimationFrame(frame)
  }, [params, hash, navigate])

  return (
    <div className="pb-24">
      <LocalBusinessData />

      {/* Đầu trang: lời mời + các kênh liên hệ nhanh */}
      <section aria-labelledby="contact-title">
        {/* Hai cột từ 1280px: ở 1024–1279 cột thẻ chỉ còn ~258px, số điện thoại và email bị gãy dòng (rà máy tính bảng 06/11/2026) */}
        <Container className="grid gap-10 pt-10 pb-14 sm:pt-14 sm:pb-20 xl:grid-cols-12 xl:gap-14">
          <div className="xl:col-span-5">
            <nav aria-label="Đường dẫn" className="flex items-center gap-2 text-sm text-ink-soft">
              <Link to="/" className="-my-3 inline-block py-3 hover:text-deep-900">
                Trang chủ
              </Link>
              <span aria-hidden>/</span>
              <span className="text-deep-900">Liên hệ mua hàng</span>
            </nav>
            <p className="eyebrow mt-8">Liên hệ mua hàng</p>
            <h1 id="contact-title" className="font-display mt-4 text-[2.4rem] leading-[1.05] text-deep-900 sm:text-[3.6rem]">
              Ecopillo luôn{' '}
              <br />
              lắng nghe <span className="whitespace-nowrap">Quý khách</span>
            </h1>
            <p className="mt-5 max-w-md text-body leading-relaxed text-balance text-ink-soft">
              Gọi, nhắn tin, ghé văn phòng hoặc tìm đại lý gần nhất. Bộ phận Chăm sóc khách hàng của Ecopillo Việt Nam
              phản hồi trong giờ làm việc.
            </p>
            <ul className="mt-8 space-y-3 text-body-sm">
              <li className="flex gap-3">
                <Icon name="pin" size={19} className="mt-0.5 shrink-0 text-mist-600" />
                <span className="text-deep-900">
                  <span className="font-medium">Địa chỉ:</span> {office.address}
                  <span className="block text-sm text-ink-soft">{office.kind}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="clock" size={19} className="mt-0.5 shrink-0 text-mist-600" />
                <span className="text-deep-900">Mở cửa {OPENING_HOURS}</span>
              </li>
            </ul>
          </div>

          {/* Hotline trên cùng, bốn kênh 2×2 bên dưới (từ 640px: một hàng bốn ô) */}
          <div className="flex flex-col justify-center gap-3 xl:col-span-7">
            <HotlineCard />
            {/* auto-rows-fr: hai hàng cao bằng nhau dù ô email hai dòng */}
          <ul className="grid auto-rows-fr grid-cols-2 gap-2 min-[360px]:gap-3 sm:grid-cols-4">
              {CHANNELS.map(({ key, ...c }) => (
                <li key={key} className="min-w-0">
                  <Channel {...c} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Văn phòng / chi nhánh */}
      <Container className="pb-6 sm:pb-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <OfficeMap />
          </div>
          <aside className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-[2rem] bg-cream-50 p-6 shadow-[var(--shadow-soft)] sm:p-8">
              <h2 className="font-display text-[1.4rem] text-deep-900">Hỏi nhanh</h2>
              <ul className="mt-2 divide-y divide-line text-body-sm">
                {[
                  ['Giao hàng, thanh toán khi nhận', policyPath('chinh-sach-van-chuyen')],
                  ['Kiểm hàng, đổi hàng', policyPath('chinh-sach-doi-tra-hang-va-hoan-tien')],
                  ['Bảo hành sản phẩm', policyPath('chinh-sach-bao-hanh-san-pham')],
                  ['Chăn ga cho khách sạn, nhà nghỉ', PATHS.hotel],
                  ['Câu hỏi thường gặp', PATHS.faq],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="group flex min-h-11 items-center justify-between gap-3 py-2.5 text-deep-900 hover:underline">
                      {label}
                      <Icon name="arrowRight" size={16} className="shrink-0 opacity-60 transition group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-3 text-sm text-ink-soft">Theo dõi Ecopillo</p>
                <SocialIcons tone="light" />
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Điểm bán / đại lý (trước đây trang Hệ thống phân phối) */}
      <DealerFinder embedded />

      {/* Form gửi tin nhắn */}
      <Container className="mt-6 sm:mt-10">
        <section
          aria-labelledby="message-title"
          className="mx-auto max-w-3xl rounded-[2rem] bg-ivory p-6 shadow-[var(--shadow-soft)] sm:p-10"
        >
          <p className="eyebrow">Để lại lời nhắn</p>
          <h2 id="message-title" className="font-display mt-3 text-[1.9rem] leading-tight text-deep-900 sm:text-[2.3rem]">
            Gửi tin nhắn cho chúng tôi
          </h2>
          <p className="mt-2 mb-8 text-balance text-ink-soft">Chọn điều Quý khách cần, Ecopillo sẽ chuyển đúng người gọi lại.</p>
          <MessageForm key={topic} defaultTopic={topic} />
        </section>
      </Container>
    </div>
  )
}
