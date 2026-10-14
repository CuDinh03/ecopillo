import type { CSSProperties } from 'react'

/** Độ trễ so le cho các thẻ cùng hàng khi hiện dần (0, 90, 180, 270ms rồi lặp lại) */
export const revealDelay = (index: number, step = 90): CSSProperties =>
  ({ '--reveal-delay': `${(index % 4) * step}ms` }) as CSSProperties
