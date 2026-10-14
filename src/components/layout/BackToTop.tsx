import { useEffect, useRef, useState } from 'react'
import { Icon } from '../ui/Icon'

const SHOW_AFTER = 900

/** Thứ khách có thể bấm: nút nổi mà đè lên thì khách bấm nhầm hoặc không bấm được */
const CONTROL = 'a, button, input, select, textarea, label, [role="button"], [role="tab"]'

/** Nút có đang đè lên một nút, link hay ô nhập nào không (dò lưới 3×3 điểm trên nút, cả mép giữa) */
function coversControl(button: HTMLElement): boolean {
  // Vị trí gốc của nút (offset* bỏ qua transform): lúc ẩn nút trượt xuống 12px, đo theo chỗ đó thì nút
  // cứ ẩn rồi hiện liên tục ở mép một link
  const r = { left: button.offsetLeft, top: button.offsetTop, width: button.offsetWidth, height: button.offsetHeight }
  const inset = 6
  const xs = [r.left + inset, r.left + r.width / 2, r.left + r.width - inset]
  const ys = [r.top + inset, r.top + r.height / 2, r.top + r.height - inset]
  const points = xs.flatMap((x) => ys.map((y): [number, number] => [x, y]))
  return points.some(([x, y]) => {
    const under = document.elementsFromPoint(x, y).find((el) => el !== button && !button.contains(el))
    return under?.closest(CONTROL) != null
  })
}

/**
 * Nút lên đầu trang, hiện khi đã cuộn xuống khá xa.
 * Tự ẩn khi bên dưới nó là một nút hay link (ví dụ nút Zalo của thẻ đại lý), để không che chỗ khách cần bấm.
 */
export function BackToTop({ raised }: { raised: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const button = ref.current
      setIsVisible(window.scrollY > SHOW_AFTER && !!button && !coversControl(button))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Khối "hiện dần" trượt vào chỗ sau khi đã cuộn xong: dò lại khi hiệu ứng kết thúc
    document.addEventListener('transitionend', schedule, true)
    document.addEventListener('animationend', schedule, true)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('transitionend', schedule, true)
      document.removeEventListener('animationend', schedule, true)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Lên đầu trang"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-deep-900 shadow-[var(--shadow-lift)] ring-1 ring-cream-200 backdrop-blur transition duration-500 ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:bg-white md:right-auto md:bottom-6 md:left-6 ${
        raised ? 'bottom-24' : 'bottom-6'
      } ${isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
    >
      <Icon name="arrowRight" size={18} className="-rotate-90" />
    </button>
  )
}
