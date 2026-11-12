import { PROCESS_GATE_RESULTS, PRODUCT_PROCESS, PRODUCT_PROCESS_TITLE, type ProcessStep } from '../../data/about'
import { Icon } from '../ui/Icon'
import { STORY_LABEL } from './StoryParts'

/**
 * Quy trình phát triển sản phẩm 7 bước trong chương IV trang Giới thiệu (mẫu A, chị Phương chọn 12/11/2026,
 * mẫu: docs/de-xuat-quy-trinh-7-buoc-12-11.html). Danh sách dọc nối bằng đường chỉ, chia 3 chặng.
 * Chị Phương: bỏ dòng tóm tắt "vì dài quá", "hiển thị hết mà không cần kích vào": mọi mô tả hiện sẵn, không có nút mở.
 * Bước duyệt mẫu nổi bật, kèm Đạt / Không đạt và đường quay lại bước 1.
 */
export function ProductProcess() {
  let stepNumber = 0
  return (
    <section aria-labelledby="quy-trinh-tieu-de" className="mt-10 border-t border-line pt-8">
      <h3 id="quy-trinh-tieu-de" data-reveal className="font-display text-[1.6rem] leading-[1.15] text-balance text-deep-900 sm:text-[2rem]">
        {PRODUCT_PROCESS_TITLE}
      </h3>
      {PRODUCT_PROCESS.map((stage, stageIndex) => (
        <div key={stage.name} className="mt-6">
          <p data-reveal className={`${STORY_LABEL} text-deep-700`}>
            Chặng {stageIndex + 1}
            <span className="font-display ml-2 text-[1rem] font-normal tracking-normal text-ink-faint normal-case italic">{stage.name}</span>
          </p>
          {/* Đường chỉ nối các vòng biểu tượng: tâm vòng 16px (điện thoại) / 20px (máy tính) */}
          <ol className="relative mt-3 before:absolute before:top-5 before:bottom-5 before:left-[15px] before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-deep-900 before:to-deep-900/20 sm:before:left-[19px]">
            {stage.steps.map((step) => {
              stepNumber += 1
              return <ProcessRow key={step.title} step={step} number={stepNumber} />
            })}
          </ol>
        </div>
      ))}
    </section>
  )
}

function ProcessRow({ step, number }: { step: ProcessStep; number: number }) {
  const isGate = step.isGate === true
  return (
    <>
      <li data-reveal className="relative flex gap-3 py-2.5 sm:gap-4">
        <span
          aria-hidden="true"
          className={`relative z-[1] grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-[0_0_0_4px_var(--color-ivory)] sm:h-10 sm:w-10 ${
            isGate ? 'bg-deep-900 text-ivory' : 'bg-mist-100 text-deep-900'
          }`}
        >
          <Icon name={step.icon} size={17} />
        </span>
        <div className={`min-w-0 flex-1 ${isGate ? 'rounded-2xl bg-mist-100 p-3.5 ring-[1.5px] ring-deep-700 ring-inset sm:p-4' : 'pt-0.5 sm:pt-1.5'}`}>
          <p className="font-display text-[0.95rem] leading-none text-ink-faint italic">Bước {number}</p>
          <p className="mt-1 text-[1.05rem] leading-snug font-semibold text-deep-900">{step.title}</p>
          <p className="mt-1.5 text-body-sm leading-relaxed text-ink-soft">{step.text}</p>
          {isGate && <GateResults />}
        </div>
      </li>
      {isGate && (
        <li className="flex items-center gap-2 pb-1 pl-11 text-small font-medium text-deep-700 sm:pl-14">
          <Icon name="back" size={17} />
          Không đạt thì quay lại bước 1 (R&amp;D)
        </li>
      )}
    </>
  )
}

function GateResults() {
  const { pass, fail } = PROCESS_GATE_RESULTS
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      <p className="rounded-xl bg-deep-900 px-3.5 py-2.5 text-small text-ivory">
        <b className="block text-label tracking-[0.12em] uppercase">{pass.label}</b>
        {pass.text}
      </p>
      <p className="rounded-xl border-[1.5px] border-dashed border-deep-700 bg-ivory px-3.5 py-2.5 text-small text-deep-900">
        <b className="block text-label tracking-[0.12em] uppercase">{fail.label}</b>
        {fail.text}
      </p>
    </div>
  )
}
