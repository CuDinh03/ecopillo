import { Icon } from '../ui/Icon'

export type StepNumber = 1 | 2 | 3

export const STEPS: readonly { n: StepNumber; label: string; short: string }[] = [
  { n: 1, label: 'Chọn bộ sưu tập & mẫu', short: 'Chọn mẫu' },
  { n: 2, label: 'Kích thước & số lượng', short: 'Kích thước' },
  { n: 3, label: 'Thông tin nhận hàng', short: 'Nhận hàng' },
]

interface StepperProps {
  current: StepNumber
  onGoTo: (step: StepNumber) => void
}

export function Stepper({ current, onGoTo }: StepperProps) {
  return (
    <nav aria-label="Các bước đặt hàng">
      <ol className="grid grid-cols-3 gap-2 sm:gap-3">
        {STEPS.map((step) => {
          const done = step.n < current
          const active = step.n === current
          return (
            <li key={step.n}>
              <button
                type="button"
                disabled={!done}
                onClick={() => onGoTo(step.n)}
                aria-current={active ? 'step' : undefined}
                className={`group flex w-full flex-col gap-2.5 text-left disabled:cursor-default ${done ? 'cursor-pointer' : ''}`}
              >
                <span
                  className={`h-1 w-full rounded-full transition-colors duration-500 ${
                    done || active ? 'bg-deep-800' : 'bg-cream-200'
                  }`}
                />
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-medium transition-colors ${
                      done
                        ? 'bg-mist-200 text-deep-900 group-hover:bg-mist-300'
                        : active
                          ? 'bg-deep-800 text-ivory'
                          : 'bg-mist-100 text-ink-faint'
                    }`}
                  >
                    {done ? <Icon name="check" size={13} strokeWidth={2.2} /> : step.n}
                  </span>
                  <span
                    className={`text-[0.78rem] leading-tight sm:text-sm ${
                      active ? 'font-medium text-deep-900' : done ? 'text-deep-800' : 'text-ink-faint'
                    }`}
                  >
                    <span className="sm:hidden">{step.short}</span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
