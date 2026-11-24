import { Fragment, type ReactNode } from 'react'

interface HighlightProps {
  text: string
  /** Cụm chữ in đậm (tên người…) nếu có trong đoạn */
  strong?: readonly string[]
  /** Cụm chữ in nghiêng (“Chốn Yên”…) nếu có trong đoạn */
  em?: readonly string[]
}

/**
 * Đoạn chữ Ecopillo tự sửa (Nội dung web) vẫn giữ chỗ in đậm, in nghiêng như mẫu đã duyệt: cụm nào còn trong đoạn thì
 * tô, Ecopillo bỏ cụm đó thì thôi (đoạn hiện chữ thường). Cụm cần tô cũng là ô Ecopillo sửa. Không nhận HTML từ dữ liệu.
 */
export function Highlight({ text, strong = [], em = [] }: HighlightProps) {
  // "-": Ecopillo không muốn tô cụm nào (ô cụm chữ ở Nội dung web không để trống được)
  const marks = [...strong.map((w) => ({ w, kind: 'strong' as const })), ...em.map((w) => ({ w, kind: 'em' as const }))].filter((m) => m.w && m.w.trim() !== '-')
  if (!marks.length) return <>{text}</>
  const parts: ReactNode[] = []
  let rest = text
  for (;;) {
    const hits = marks.map((m) => ({ ...m, at: rest.indexOf(m.w) })).filter((m) => m.at >= 0)
    if (!hits.length) break
    const first = hits.reduce((a, b) => (b.at < a.at ? b : a))
    parts.push(rest.slice(0, first.at))
    parts.push(
      first.kind === 'strong' ? (
        <strong className="font-medium text-deep-900">{first.w}</strong>
      ) : (
        <em className="text-deep-900">{first.w}</em>
      ),
    )
    rest = rest.slice(first.at + first.w.length)
  }
  parts.push(rest)
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  )
}

/** Tiêu đề Ecopillo sửa: dấu "|" là chỗ xuống dòng như mẫu đã duyệt ("Mua sắm an tâm | với Ecopillo") */
export function Lines({ text, breakClassName }: { text: string; /** Lớp của chỗ xuống dòng, ví dụ chỉ xuống dòng trên máy tính */ breakClassName?: string }) {
  const parts = text.split('|').map((part) => part.trim())
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              {' '}
              <br className={breakClassName} />
            </>
          )}
          <KeepLastTwo text={part} />
        </Fragment>
      ))}
    </>
  )
}

/** Hai chữ cuối dòng không tách nhau ("lắng nghe Quý khách" không rớt "khách" xuống một mình), như mẫu đã duyệt */
function KeepLastTwo({ text }: { text: string }) {
  const words = text.split(' ').filter(Boolean)
  if (words.length < 3) return <>{text}</>
  return (
    <>
      {words.slice(0, -2).join(' ')} <span className="whitespace-nowrap">{words.slice(-2).join(' ')}</span>
    </>
  )
}
