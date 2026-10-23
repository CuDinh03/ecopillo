import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT, DISTRIBUTION_FILL_IN, OPENING_HOURS, SHOWROOMS } from '../../data/brand'
import { FAQS } from '../../data/content'
import { PATHS } from '../../data/links'
import { DEALERS, dealerCountLabel, NEAR_ME_URL } from '../../data/dealers'
import { revealDelay } from '../../lib/reveal'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { buttonClass, ContactButtons, Container, FillIn, SectionHeading } from '../ui/primitives'

const isFillIn = (text: string) => text.startsWith('[') && text.endsWith(']')

/** Hiện đoạn văn, tô nổi những phần [ĐIỀN …] / [XÁC NHẬN …] */
function RichLine({ text }: { text: string }) {
  if (isFillIn(text)) return <FillIn>{text}</FillIn>
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) => (isFillIn(part) ? <FillIn key={i}>{part}</FillIn> : <span key={i}>{part}</span>))}
    </>
  )
}

export function Showrooms() {
  return (
    <section id="he-thong-phan-phoi" aria-labelledby="phan-phoi-title" className="py-14 sm:py-24">
      <Container>
        <SectionHeading
          id="phan-phoi-title"
          title="Hệ thống phân phối"
          lead="Chạm tay vào chất vải tại Ecopillo: cảm nhận độ mềm mát của vải Lyocell, nằm thử gối và đệm, được tư vấn mẫu hợp với phòng ngủ của Quý khách."
        />
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm">
            <FillIn>{DISTRIBUTION_FILL_IN}</FillIn>
          </p>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <Link to={NEAR_ME_URL} className={buttonClass('primary', 'md')}>
              <Icon name="locate" size={17} />
              Tìm đại lý gần tôi
            </Link>
            <span className="text-sm text-ink-soft">{dealerCountLabel(DEALERS.length)}</span>
          </div>
        </div>

        <div className="m-rail mt-8 grid gap-6 sm:mt-14 lg:grid-cols-2">
          {SHOWROOMS.map((s, i) => (
            <article key={s.id} data-reveal style={revealDelay(i)} className="overflow-hidden rounded-[2rem] bg-ivory shadow-[var(--shadow-soft)]">
              <div className="flex h-full flex-col">
                {/* Có ảnh thật thì hiện cả trên điện thoại; chưa có thì khung chờ ảnh, điện thoại ẩn cho gọn */}
                <div className={`aspect-[2/1] sm:aspect-[16/9] ${s.photo ? '' : 'max-sm:hidden'}`}>
                  <Placeholder
                    className="h-full w-full !rounded-none border-0"
                    tone={i === 0 ? 'mist' : 'cream'}
                    note={s.imageNote}
                    image={s.photo}
                    sizes="(min-width: 1024px) 600px, 100vw"
                    position={s.id === 'tp-hcm' ? 'center 22%' : undefined}
                  />
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <p className="eyebrow">{s.kind}</p>
                  <h3 className="font-display mt-3 text-[1.85rem] text-deep-900">{s.city}</h3>
                  <ul className="mt-5 space-y-3 text-body-sm">
                    <li className="flex gap-3">
                      <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-mist-600" />
                      <span className="text-deep-900">{s.address}</span>
                    </li>
                    <li className="flex gap-3">
                      <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-mist-600" />
                      <span className="text-deep-900">Mở cửa {OPENING_HOURS}</span>
                    </li>
                    <li className="flex gap-3">
                      <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-mist-600" />
                      <a href={s.hotline ? `tel:${s.hotline.replace(/\D/g, '')}` : CONTACT.hotlineTel} className="tabular -my-2.5 inline-block py-2.5 text-deep-900 hover:underline">
                        {s.hotline ?? CONTACT.hotlineDisplay}
                      </a>
                    </li>
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2 pt-7">
                    <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'sm')}>
                      <Icon name="pin" size={16} />
                      Chỉ đường
                    </a>
                    <a href={s.hotline ? `tel:${s.hotline.replace(/\D/g, '')}` : CONTACT.hotlineTel} className={buttonClass('secondary', 'sm')}>
                      Gọi đặt lịch xem hàng
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

/** Trang chủ điện thoại: hiện ngần này câu, các câu sau nằm sau nút Xem thêm (vẫn có trong trang) */
const FAQ_COMPACT = 4

/**
 * standalone: dùng trên trang Hỏi đáp (đã có tiêu đề trang), đổi tiêu đề cột trái cho khỏi lặp.
 * compact: trang chủ điện thoại (mẫu 2), câu đầu không mở sẵn, chỉ hiện FAQ_COMPACT câu.
 */
export function Faq({ standalone = false, compact = false }: { standalone?: boolean; compact?: boolean }) {
  const [showAll, setShowAll] = useState(false)
  const isHidden = (i: number) => compact && !showAll && i >= FAQ_COMPACT
  return (
    <section id="hoi-dap" aria-labelledby="faq-title" className={standalone ? 'py-14 sm:py-24' : 'py-14 sm:py-24'}>
      <Container className="grid gap-8 sm:gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="faq-title"
              title={standalone ? 'Câu trả lời nhanh' : 'Câu hỏi thường gặp'}
            />
            <p className="mt-5 text-ink-soft">
              {!standalone && 'Mua sắm an tâm với Ecopillo. '}Chưa thấy câu trả lời Quý khách cần? Gọi hoặc nhắn Zalo, Ecopillo phản hồi ngay.
            </p>
            <ContactButtons size="md" stretch className="mt-7" />
            {!standalone && (
              <Link to={PATHS.faq} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-deep-800 hover:underline">
                Xem chính sách giao hàng, đổi hàng, bảo hành <Icon name="arrowRight" size={14} />
              </Link>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul data-reveal className="divide-y divide-ivory border-y border-ivory">
            {FAQS.map((f, i) => (
              <li key={f.q} className={isHidden(i) ? 'max-sm:hidden' : ''}>
                <details className="group" open={i === 0 && !compact}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left">
                    <span className="flex gap-4">
                      <span className="tabular pt-1 text-xs text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-[1.15rem] leading-snug text-deep-900 sm:text-[1.3rem]">{f.q}</span>
                    </span>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-100 text-deep-800 transition-transform duration-300 group-open:rotate-45">
                      <Icon name="plus" size={18} />
                    </span>
                  </summary>
                  <div className="space-y-3 pr-12 pb-7 pl-8 text-body-sm leading-relaxed text-ink-soft sm:pl-9">
                    {f.a.map((line) => (
                      <p key={line}>
                        <RichLine text={line} />
                      </p>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>
          {compact && !showAll && FAQS.length > FAQ_COMPACT && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-deep-800 sm:hidden"
            >
              Xem thêm {FAQS.length - FAQ_COMPACT} câu hỏi <Icon name="chevronDown" size={15} />
            </button>
          )}
        </div>
      </Container>
    </section>
  )
}
