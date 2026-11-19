/**
 * Tìm chữ trên web (thanh tìm kiếm, owner chọn B ngày 19/11/2026: docs/de-xuat-tim-kiem-19-11.html).
 * Tìm ngay trên máy khách, không gửi chữ khách gõ đi đâu. Gõ không dấu vẫn ra; hiểu cách gọi miền Nam (nệm, mền, drap, ra, áo gối).
 */

/** Một chữ → chữ thường không dấu (đ → d), ký tự không phải chữ, số thành khoảng trắng. Giữ nguyên độ dài để tô chữ khớp */
const foldChar = (ch: string): string => {
  const base = ch.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
  return /^[a-z0-9]$/.test(base) ? base : ' '
}

/** Chuỗi đã gập, cùng độ dài với chuỗi gốc (mỗi ký tự gốc ra đúng một ký tự) */
export const foldText = (text: string): string => Array.from(text, foldChar).join('')

const wordsOf = (text: string): string[] => foldText(text).split(' ').filter(Boolean)

/**
 * Cách gọi khác vùng miền hoặc khác thói quen → cách gọi trên web. Chữ gốc vẫn được tìm nhưng phải trọn từ
 * ("ra" trong "ra mắt"; "mền" không ra "mệnh").
 */
const ALTERNATIVES: Readonly<Record<string, readonly string[]>> = {
  nem: ['dem'],
  men: ['chan'],
  drap: ['ga'],
  ra: ['ga'],
  ao: ['vo'],
}

/** Chữ khách hay gõ kèm mà tên sản phẩm không có: khớp thì cộng điểm, không khớp vẫn ra kết quả */
const OPTIONAL_WORDS: ReadonlySet<string> = new Set(['giuong', 'mua', 'gia', 'cai', 'chiec', 'loai', 'cho', 'va', 'cua', 'nao', 'tot', 'ecopillo'])

export interface SearchQuery {
  /** Mỗi chữ khách gõ: các cách viết chấp nhận */
  required: readonly (readonly string[])[]
  optional: readonly string[]
  folded: string
}

export const parseQuery = (raw: string): SearchQuery | null => {
  const words = wordsOf(raw)
  if (!words.length) return null
  // Dấu cách cuối = phải trọn từ (xem wordStartIndex)
  const required = words.filter((w) => !OPTIONAL_WORDS.has(w)).map((w) => (ALTERNATIVES[w] ? [`${w} `, ...ALTERNATIVES[w]] : [w]))
  const optional = words.filter((w) => OPTIONAL_WORDS.has(w))
  // Toàn chữ phụ ("giường"): tìm theo chính các chữ đó
  return {
    required: required.length ? required : optional.map((w) => [w]),
    optional: required.length ? optional : [],
    folded: words.join(' '),
  }
}

/** Vị trí đầu một từ trong chuỗi đã gập bắt đầu bằng `prefix` (có dấu cách cuối: đúng trọn từ), -1 nếu không có */
const wordStartIndex = (foldedText: string, prefix: string): number => {
  const folded = `${foldedText} `
  let from = 0
  while (from <= folded.length) {
    const at = folded.indexOf(prefix, from)
    if (at < 0) return -1
    if (at === 0 || folded[at - 1] === ' ') return at
    from = at + 1
  }
  return -1
}

const firstMatch = (folded: string, forms: readonly string[]): { at: number; form: string } | null => {
  for (const form of forms) {
    const at = wordStartIndex(folded, form)
    if (at >= 0) return { at, form }
  }
  return null
}

export interface MatchTarget {
  title: string
  /** Chữ khác để tìm: nhóm, mã mẫu, cách gọi khác */
  keywords?: string
}

/**
 * Điểm khớp, 0 là không khớp. Mọi chữ chính phải khớp ở đầu một từ, cùng trong tên hoặc cùng trong từ khoá.
 * Khớp ở tên hơn khớp ở từ khoá; tên bắt đầu đúng chữ khách gõ, chữ khớp càng sớm, tên càng ngắn càng lên trước.
 */
export const matchScore = (target: MatchTarget, query: SearchQuery): number => {
  const title = foldText(target.title)
  const keywords = foldText(target.keywords ?? '')
  const all = `${title} ${keywords}`
  const titleHits = query.required.map((forms) => firstMatch(title, forms))
  if (titleHits.some((hit) => !hit)) {
    // Khớp nhờ từ khoá thì mọi chữ phải nằm trong từ khoá: tránh "đại lý" ra "Lyocell" (tên) + "đại dương" (màu)
    return query.required.every((forms) => firstMatch(keywords, forms)) ? 1 : 0
  }
  const firstAt = Math.min(...titleHits.map((hit) => hit?.at ?? 0))
  const startsWith = title.trimStart().startsWith(query.folded) ? 20 : 0
  const optionalHits = query.optional.filter((w) => wordStartIndex(all, w) >= 0).length
  return 20 + startsWith + optionalHits * 2 + 10 - Math.min(9, firstAt / 3) - title.length / 60
}

/** Các đoạn [đầu, cuối) tính theo `Array.from(title)` (từng ký tự) cần tô vì khớp chữ khách gõ */
export const highlightRanges = (title: string, query: SearchQuery): [number, number][] => {
  const folded = `${foldText(title)} `
  const ranges: [number, number][] = []
  for (const forms of [...query.required, ...query.optional.map((w) => [w])]) {
    for (const form of forms) {
      let from = 0
      for (;;) {
        const at = folded.indexOf(form, from)
        if (at < 0) break
        if (at === 0 || folded[at - 1] === ' ') ranges.push([at, at + form.trimEnd().length])
        from = at + 1
      }
    }
  }
  return ranges
    .sort((a, b) => a[0] - b[0])
    .reduce<[number, number][]>((merged, range) => {
      const last = merged[merged.length - 1]
      if (last && range[0] <= last[1]) return [...merged.slice(0, -1), [last[0], Math.max(last[1], range[1])]]
      return [...merged, range]
    }, [])
}
