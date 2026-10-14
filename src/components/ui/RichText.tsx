import { FillIn } from './primitives'

/** Hiện một dòng chữ, tô nổi những phần [ĐIỀN …] / [XÁC NHẬN …] Ecopillo cần bổ sung */
export function RichText({ text }: { text: string }) {
  if (!/\[[^\]]+\]/.test(text)) return <>{text}</>
  return (
    <>
      {text.split(/(\[[^\]]+\])/g).map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? <FillIn key={i}>{part}</FillIn> : <span key={i}>{part}</span>,
      )}
    </>
  )
}
