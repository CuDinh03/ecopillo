import type { InfoSection } from './productInfo'

/**
 * Phần "Hiểu kỹ trước khi chọn" dạng chữ để Ecopillo sửa trong ô của trang sửa sản phẩm Woo (noi-dung-woo.php):
 *   ## Tên phần
 *   - một ý gạch đầu dòng
 *   Một đoạn văn
 * Dòng trống bỏ qua. Dùng ở cả hai chiều: điền sẵn (khung giá) và đọc lại (liveData → products.ts).
 */
export const infoToText = (sections: readonly InfoSection[]): string =>
  sections
    .map((s) => [`## ${s.title}`, ...(s.body ?? []), ...(s.list ?? []).map((item) => `- ${item}`)].join('\n'))
    .join('\n\n')

export function textToInfo(text: string): InfoSection[] {
  const sections: { title: string; body: string[]; list: string[] }[] = []
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('## ')) {
      sections.push({ title: line.slice(3).trim().slice(0, 120), body: [], list: [] })
      continue
    }
    if (!sections.length) sections.push({ title: 'Thông tin', body: [], list: [] })
    const current = sections[sections.length - 1]
    if (/^[-•*]\s+/.test(line)) current.list.push(line.replace(/^[-•*]\s+/, '').slice(0, 1000))
    else current.body.push(line.slice(0, 2000))
  }
  return sections
    .filter((s) => s.title && (s.body.length || s.list.length))
    .slice(0, 12)
    .map((s) => ({ title: s.title, ...(s.body.length ? { body: s.body } : {}), ...(s.list.length ? { list: s.list } : {}) }))
}
