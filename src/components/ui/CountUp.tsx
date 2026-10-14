import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** Ví dụ "15.000+", "15+": phần số đếm tăng dần, phần chữ giữ nguyên */
  value: string
  durationMs?: number
}

const vi = new Intl.NumberFormat('vi-VN')

/** Số đếm tăng dần khi cuộn tới (như khối số liệu trên alinavn.com) */
export function CountUp({ value, durationMs = 1400 }: CountUpProps) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const target = match ? Number(match[1].replace(/\./g, '')) : 0
  const suffix = match ? match[2] : ''
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !match) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs)
          const eased = 1 - Math.pow(1 - t, 3)
          setCurrent(Math.round(target * eased))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        setCurrent(0)
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs])

  if (!match) return <>{value}</>
  return (
    <span ref={ref} className="tabular">
      {/* Số thật cho trình đọc màn hình và khi chưa chạy hiệu ứng */}
      <span aria-hidden="true">{vi.format(current ?? target)}{suffix}</span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
