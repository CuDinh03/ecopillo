import type { ReactNode } from 'react'
import { FREE_BLOCKS } from '../../data/pageLayout'
import { freeIndex, type FreeBlockRow } from '../../data/freeBlocks'
import { HomeLink } from '../home/HomeLink'
import { Lines } from './Highlight'
import { buttonClass, Container } from './primitives'

/**
 * Khối tự do Ecopillo thêm ở Nội dung web → Giao diện → Khối tự do (src/data/freeBlocks.ts).
 * `khung`: "trang" = khối nằm thẳng trong trang (tự có khung bề ngang và khoảng trên dưới);
 * "cot" = khối nằm trong khung có sẵn của trang (danh mục, sản phẩm, chính sách…): chỉ chừa khoảng trên.
 * Khối không có chữ, ảnh, thẻ hay nút nào thì không vẽ.
 */
export type FreeFrame = 'trang' | 'cot'

export function FreeBlock({ id, khung = 'trang' }: { id: string; khung?: FreeFrame }) {
  const index = freeIndex(id)
  const row = index === undefined ? undefined : FREE_BLOCKS[index]
  if (!row || !hasContent(row)) return null
  const dark = row.kieu === 'dai-cham'
  const body = (
    <div id={row.neo} className={`scroll-mt-[5.5rem] ${boxClass(row)}`}>
      <Body row={row} dark={dark} />
    </div>
  )
  if (khung === 'cot') return <section className="mt-16 first:mt-0 sm:mt-20">{body}</section>
  return (
    <section className="py-12 sm:py-16">
      <Container>{body}</Container>
    </section>
  )
}

const hasContent = (row: FreeBlockRow): boolean =>
  Boolean(row.tieuDe || row.nhan || row.doan?.length || row.anh?.src || row.dsAnh?.length || row.the?.length || row.nut?.length)

/** Nền khối: dải chàm luôn nền chàm; hộp trắng / xanh nhạt tách khỏi nền trang bằng bóng mềm */
function boxClass(row: FreeBlockRow): string {
  if (row.kieu === 'dai-cham') return 'rounded-[2rem] bg-deep-900 px-6 py-10 text-ivory sm:px-12 sm:py-14'
  if (row.nen === 'trang') return 'rounded-[2rem] bg-ivory p-6 shadow-[var(--shadow-soft)] sm:p-10'
  if (row.nen === 'xanh') return 'rounded-[2rem] bg-mist-100 p-6 shadow-[var(--shadow-soft)] sm:p-10'
  return ''
}

function Body({ row, dark }: { row: FreeBlockRow; dark: boolean }) {
  const centered = row.canGiua === 'giua' || (row.kieu === 'dai-cham' && row.canGiua !== 'trai')
  const text = <TextPart row={row} dark={dark} centered={centered && row.kieu !== 'chu-anh'} />
  switch (row.kieu) {
    case 'chu-anh':
      if (!row.anh?.src) return text
      return (
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className={row.anhBen === 'trai' ? 'lg:order-2' : ''}>{text}</div>
          <img
            data-reveal
            src={row.anh.src}
            srcSet={row.anh.srcSet || undefined}
            sizes="(min-width: 1024px) 560px, 100vw"
            alt={row.anh.alt}
            loading="lazy"
            decoding="async"
            className={`aspect-[4/3] w-full rounded-[1.75rem] bg-mist-100 object-cover max-lg:order-first ${row.anhBen === 'trai' ? 'lg:order-1' : ''}`}
          />
        </div>
      )
    case 'anh-rong':
      return (
        <figure>
          <Heading row={row} dark={dark} centered={centered} />
          {row.anh?.src && (
            <img
              data-reveal
              src={row.anh.src}
              srcSet={row.anh.srcSet || undefined}
              sizes="(min-width: 1240px) 1160px, 100vw"
              alt={row.anh.alt}
              loading="lazy"
              decoding="async"
              className={`w-full rounded-[1.75rem] bg-mist-100 object-cover ${row.tieuDe || row.nhan ? 'mt-8' : ''}`}
            />
          )}
          {row.doan?.length ? (
            <figcaption className={`mt-4 text-small leading-relaxed text-ink-soft ${centered ? 'text-center' : ''}`}>{row.doan.join(' ')}</figcaption>
          ) : null}
          <Buttons row={row} dark={dark} centered={centered} />
        </figure>
      )
    case 'luoi-anh':
      return (
        <>
          {text}
          {row.dsAnh?.length ? (
            <ul className={`grid grid-cols-2 gap-3 sm:gap-4 ${row.dsAnh.length >= 3 ? 'lg:grid-cols-3' : ''} ${hasText(row) ? 'mt-8' : ''}`}>
              {row.dsAnh.map((src, i) => (
                <li key={`${i}-${src}`} data-reveal>
                  <img src={src} alt={row.tieuDe ? row.tieuDe.replace(/\|/g, ' ') : ''} loading="lazy" decoding="async" className="aspect-square w-full rounded-2xl bg-mist-100 object-cover" />
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )
    case 'the':
      return (
        <>
          {text}
          {row.the?.length ? (
            <ul className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${row.the.length >= 3 ? 'lg:grid-cols-3' : ''} ${hasText(row) ? 'mt-8' : ''}`}>
              {row.the.map((card, i) => (
                <li
                  key={`${i}-${card.tieuDe}`}
                  data-reveal
                  className={`rounded-[1.5rem] p-6 ${row.nen === 'trang' ? 'bg-mist-100' : 'bg-ivory shadow-[var(--shadow-soft)]'}`}
                >
                  <p className="font-display text-[1.3rem] leading-snug text-deep-900">{card.tieuDe}</p>
                  <p className="mt-2 text-body-sm leading-relaxed text-ink-soft">{card.moTa}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )
    default:
      return text
  }
}

const hasText = (row: FreeBlockRow): boolean => Boolean(row.tieuDe || row.nhan || row.doan?.length || row.nut?.length)

function TextPart({ row, dark, centered }: { row: FreeBlockRow; dark: boolean; centered: boolean }) {
  if (!hasText(row)) return null
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <Heading row={row} dark={dark} centered={centered} />
      {row.doan?.map((p, i) => (
        <p
          key={`${i}-${p.slice(0, 24)}`}
          data-reveal
          className={`${i === 0 && (row.tieuDe || row.nhan) ? 'mt-5' : 'mt-4'} text-body leading-relaxed whitespace-pre-line ${dark ? 'text-mist-200/90' : 'text-ink-soft'}`}
        >
          {p}
        </p>
      ))}
      <Buttons row={row} dark={dark} centered={centered} />
    </div>
  )
}

function Heading({ row, dark, centered }: { row: FreeBlockRow; dark: boolean; centered: boolean }): ReactNode {
  if (!row.tieuDe && !row.nhan) return null
  return (
    <header data-reveal className={centered ? 'mx-auto max-w-2xl text-center' : ''}>
      {row.nhan && <p className={`eyebrow ${dark ? '!text-mist-300' : ''}`}>{row.nhan}</p>}
      {row.tieuDe && (
        <h2 className={`font-display text-[1.9rem] leading-[1.12] text-balance sm:text-[2.5rem] ${row.nhan ? 'mt-4' : ''} ${dark ? 'text-ivory' : 'text-deep-900'}`}>
          <Lines text={row.tieuDe} />
        </h2>
      )}
    </header>
  )
}

function Buttons({ row, dark, centered }: { row: FreeBlockRow; dark: boolean; centered: boolean }) {
  if (!row.nut?.length) return null
  return (
    <div data-reveal className={`mt-7 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}>
      {row.nut.map((b, i) => (
        <HomeLink
          key={`${i}-${b.link}`}
          to={b.link}
          className={buttonClass(i === 0 ? (dark ? 'light' : 'primary') : dark ? 'outlineLight' : 'secondary', 'md')}
        >
          {b.chu}
        </HomeLink>
      ))}
    </div>
  )
}
