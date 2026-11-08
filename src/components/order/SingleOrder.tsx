import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { PATHS } from '../../data/links'
import { productPath, singleOrderUrl, singleUnitPrice, variantPrice, type Product } from '../../data/products'
import { formatVND } from '../../lib/format'
import { focusField } from '../../lib/scroll'
import {
  createOrderCode,
  createSingleDraft,
  MAX_QUANTITY,
  summarizeSingle,
  validateCustomer,
  type CustomerErrors,
  type CustomerInfo,
  type SingleDraft,
} from '../../lib/order'
import { Icon } from '../ui/Icon'
import { buttonClass, Container } from '../ui/primitives'
import { QuantityStepper } from '../ui/QuantityStepper'
import { Confirmation } from './Confirmation'
import { MobileOrderBar, OrderAssurances } from './OrderChrome'
import { OrderSummary } from './OrderSummary'
import { StepCustomer } from './StepCustomer'

interface SingleOrderProps {
  product: Product
  choiceId: string | null
  thickness: string | null
  quantity: string | null
}

/**
 * Đặt sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm) trên một trang: lựa chọn + thông tin nhận hàng.
 * Cửa hàng gọi xác nhận trước khi giao (biên bản mục 47).
 */
export function SingleOrder({ product, choiceId, thickness, quantity }: SingleOrderProps) {
  const [draft, setDraft] = useState<SingleDraft>(() => createSingleDraft(product, choiceId, thickness, quantity))
  const [errors, setErrors] = useState<CustomerErrors>({})
  const [orderCode, setOrderCode] = useState('')
  const topRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const summary = useMemo(() => summarizeSingle(draft), [draft])

  const needsChoice = Boolean(product.choices || product.variants)
  const hasChoice = !needsChoice || Boolean(summary.line?.sizeLabel && (!product.variants || draft.thickness))

  const update = (patch: Partial<SingleDraft>) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    // Giữ đường dẫn khớp lựa chọn để khách gửi lại link hoặc tải lại trang không mất
    navigate(singleOrderUrl(product, next.choiceId, next.thickness, next.quantity), { replace: true })
  }

  const changeCustomer = (patch: Partial<CustomerInfo>) => {
    setDraft((d) => ({ ...d, customer: { ...d.customer, ...patch } }))
    setErrors((e) => {
      const next = { ...e }
      for (const key of Object.keys(patch) as (keyof CustomerInfo)[]) delete next[key]
      return next
    })
  }

  const submit = () => {
    if (!hasChoice) {
      document.getElementById('chon-lua-chon')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const found = validateCustomer(draft.customer)
    setErrors(found)
    const firstError = Object.keys(found)[0]
    if (firstError) {
      focusField(`f-${firstError}`)
      return
    }
    setOrderCode(createOrderCode())
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ block: 'start' }))
  }

  if (orderCode) {
    return (
      <div ref={topRef} className="scroll-mt-24 bg-ivory py-14 sm:py-20">
        <Container>
          <Confirmation
            orderCode={orderCode}
            summary={summary}
            customer={draft.customer}
            onNewOrder={() => navigate(PATHS.products)}
          />
        </Container>
      </div>
    )
  }

  const choiceLabel = product.choiceLabel ?? 'Kích thước'
  const hint = hasChoice ? null : `Chọn ${choiceLabel.toLowerCase()} để tiếp tục`

  return (
    <div ref={topRef} className="scroll-mt-20 pb-36 lg:pb-24">
      <Container className="pt-8 sm:pt-12">
        <Link to={productPath(product)} className="-my-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-soft hover:text-deep-900">
          <Icon name="arrowLeft" size={15} /> {product.name}
        </Link>
        <h1 className="font-display mt-3 text-[2.2rem] leading-none text-deep-900 sm:text-5xl">Đặt hàng online</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Nhân viên gọi xác nhận đơn trước khi giao. Cần tư vấn?{' '}
          <a href={CONTACT.hotlineTel} className="tabular font-medium text-deep-900 hover:underline">
            {CONTACT.hotlineDisplay}
          </a>{' '}
          (có Zalo)
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12 xl:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-12">
            <section id="chon-lua-chon" aria-labelledby="single-title" className="scroll-mt-28">
              <h2 id="single-title" className="font-display text-[1.6rem] text-deep-900 sm:text-[1.9rem]">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">{product.summary}</p>

              {product.variants && (
                <>
                  <ChoiceGroup
                    label="Kích thước"
                    options={product.variants.sizes.map((s) => ({ id: s, label: s }))}
                    value={draft.choiceId}
                    onChange={(id) => update({ choiceId: id, thickness: draft.thickness ?? product.variants?.thicknesses[0] ?? null })}
                  />
                  <ChoiceGroup
                    label="Độ dày"
                    options={product.variants.thicknesses.map((t) => ({
                      id: t,
                      label: t,
                      price: draft.choiceId && product.variants ? variantPrice(product.variants, draft.choiceId, t) : undefined,
                    }))}
                    value={draft.thickness}
                    onChange={(t) => update({ thickness: t })}
                  />
                </>
              )}
              {product.choices && (
                <ChoiceGroup
                  label={choiceLabel}
                  options={product.choices}
                  value={draft.choiceId}
                  onChange={(id) => update({ choiceId: id })}
                  priceOnCallNote
                />
              )}

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <span className="text-sm font-medium text-deep-900">Số lượng</span>
                <QuantityStepper value={draft.quantity} max={MAX_QUANTITY} onChange={(q) => update({ quantity: q })} />
                {singleUnitPrice(product, draft.choiceId, draft.thickness) !== undefined && hasChoice && (
                  <span className="tabular text-sm text-ink-soft">
                    × {formatVND(singleUnitPrice(product, draft.choiceId, draft.thickness) ?? 0)}
                  </span>
                )}
              </div>
            </section>

            <StepCustomer customer={draft.customer} errors={errors} summary={summary} onChange={changeCustomer} />

            <div className="hidden items-center justify-between gap-4 border-t border-ivory pt-8 lg:flex">
              <p className="text-sm text-ink-soft">{hint}</p>
              <button type="button" onClick={submit} disabled={!hasChoice} className={buttonClass('primary', 'lg')}>
                Đặt hàng
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary summary={summary} showShipping />
            <OrderAssurances deliveryTime={summary.deliveryTime} />
          </aside>
        </div>
      </Container>

      <MobileOrderBar
        amount={summary.subtotal ? summary.total : 0}
        amountLabel={summary.priceOnCall ? 'Giá báo khi gọi xác nhận' : 'Tổng cộng'}
        nextLabel="Đặt hàng"
        hint={hint}
        canContinue={hasChoice}
        onNext={submit}
      />
    </div>
  )
}

interface ChoiceGroupProps {
  label: string
  options: readonly { id: string; label: string; price?: number }[]
  value: string | null
  onChange: (id: string) => void
  /** Lựa chọn chưa có giá: ghi "Báo giá khi gọi" */
  priceOnCallNote?: boolean
}

function ChoiceGroup({ label, options, value, onChange, priceOnCallNote }: ChoiceGroupProps) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-medium text-deep-900">{label}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const active = o.id === value
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.id)}
              className={`flex flex-col items-start rounded-2xl px-4 py-3 text-left transition ${
                active ? 'bg-mist-50 ring-2 ring-deep-800' : 'bg-ivory ring-1 ring-cream-200 hover:ring-mist-400'
              }`}
            >
              <span className="text-sm font-medium text-deep-900">{o.label}</span>
              {(o.price !== undefined || priceOnCallNote) && (
                <span className="tabular mt-0.5 text-meta text-ink-soft">
                  {o.price !== undefined ? formatVND(o.price) : 'Báo giá khi gọi'}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
