import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { PATHS } from '../../data/links'
import { productPath, singleOrderUrl, singleUnitPrice, variantPrice, type Product } from '../../data/products'
import { formatVND } from '../../lib/format'
import { SEND_ERROR_ID, useSendOrder } from '../../hooks/useSendOrder'
import { focusField } from '../../lib/scroll'
import {
  createSingleDraft,
  MAX_QUANTITY,
  summarizeSingle,
  validateCustomer,
  type CustomerErrors,
  type CustomerInfo,
  type SingleDraft,
} from '../../lib/order'
import { Icon } from '../ui/Icon'
import { SendFailed } from '../ui/SendFailed'
import { buttonClass, Container } from '../ui/primitives'
import { QuantityStepper } from '../ui/QuantityStepper'
import { Confirmation } from './Confirmation'
import { MobileOrderBar, OrderAssurances } from './OrderChrome'
import { OrderSummary } from './OrderSummary'
import { StepCustomer } from './StepCustomer'
import { ORDER_TEXT } from '../../data/pageText/order'
import { ORDER_STEPS_TEXT as T, ORDER_SUMMARY_TEXT } from '../../data/pageText/orderFlow'
import { chen } from '../../data/pageText/define'
import { STOCK_TEXT } from '../../data/pageText/stock'
import { isChoiceSoldOut, isFullySoldOut, isVariantOptionSoldOut } from '../../lib/stock'
import { ORDER_SHOWN } from '../../data/pageLayout'

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
  const order = useSendOrder()
  const topRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const summary = useMemo(() => summarizeSingle(draft), [draft])

  const needsChoice = Boolean(product.choices || product.variants)
  const hasChoice = !needsChoice || Boolean(summary.line?.sizeLabel && (!product.variants || draft.thickness))
  // Hết hàng Ecopillo báo trong Woo (đợt F): lựa chọn đang chọn hết, hoặc cả sản phẩm hết, thì không gửi đơn
  const allOut = isFullySoldOut(product)
  const soldOut = allOut || isChoiceSoldOut(product, draft.choiceId, draft.thickness)
  const canOrder = hasChoice && !soldOut

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

  const submit = async () => {
    if (soldOut) return
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
    await order.send(draft.customer, summary)
  }

  // Gửi xong: màn hình cảm ơn thay chỗ form, đưa khách về đầu khung
  useEffect(() => {
    if (order.result) requestAnimationFrame(() => topRef.current?.scrollIntoView({ block: 'start' }))
  }, [order.result])

  if (order.result) {
    return (
      <div ref={topRef} className="scroll-mt-24 bg-ivory py-14 sm:py-20">
        <Container>
          <Confirmation
            orderCode={order.result.code}
            delivered={order.result.delivered}
            summary={summary}
            customer={draft.customer}
            onNewOrder={() => navigate(PATHS.products)}
          />
        </Container>
      </div>
    )
  }

  const choiceLabel = product.choiceLabel ?? T.leKichThuoc
  const hint = allOut
    ? STOCK_TEXT.caSanPhamHet
    : soldOut
      ? chen(STOCK_TEXT.luaChonHet, { chon: summary.line?.sizeLabel ?? '' })
      : hasChoice
        ? null
        : chen(T.leGoiY, { luaChon: choiceLabel.toLowerCase() })

  return (
    <div ref={topRef} className="scroll-mt-20 pb-36 lg:pb-24">
      <Container className="pt-8 sm:pt-12">
        <Link to={productPath(product)} className="-my-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-soft hover:text-deep-900">
          <Icon name="arrowLeft" size={15} /> {product.name}
        </Link>
        <h1 className="font-display mt-3 text-[2.2rem] leading-none text-deep-900 sm:text-5xl">{ORDER_TEXT.tieuDe}</h1>
        <p className="mt-3 text-sm text-ink-soft">
          {T.leXacNhan}
          {/* Ẩn / hiện: Nội dung web → Giao diện → Bố cục trang Đặt hàng (đợt E6) */}
          {ORDER_SHOWN.has('hotline') && (
            <>
              {' '}
              {T.canTuVan}{' '}
              <a href={CONTACT.hotlineTel} className="tabular font-medium text-deep-900 hover:underline">
                {CONTACT.hotlineDisplay}
              </a>{' '}
              {T.coZalo}
            </>
          )}
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
                    label={T.leKichThuoc}
                    options={product.variants.sizes.map((s) => ({ id: s, label: s }))}
                    value={draft.choiceId}
                    onChange={(id) => update({ choiceId: id, thickness: draft.thickness ?? product.variants?.thicknesses[0] ?? null })}
                    isSoldOut={(id) => isVariantOptionSoldOut(product, id, draft.thickness)}
                  />
                  <ChoiceGroup
                    label={T.leDoDay}
                    options={product.variants.thicknesses.map((t) => ({
                      id: t,
                      label: t,
                      price: draft.choiceId && product.variants ? variantPrice(product.variants, draft.choiceId, t) : undefined,
                    }))}
                    value={draft.thickness}
                    onChange={(t) => update({ thickness: t })}
                    isSoldOut={(t) => isVariantOptionSoldOut(product, draft.choiceId, t)}
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
                  isSoldOut={(id) => isChoiceSoldOut(product, id)}
                />
              )}

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <span className="text-sm font-medium text-deep-900">{T.soLuong}</span>
                <QuantityStepper value={draft.quantity} max={MAX_QUANTITY} onChange={(q) => update({ quantity: q })} />
                {singleUnitPrice(product, draft.choiceId, draft.thickness) !== undefined && hasChoice && (
                  <span className="tabular text-sm text-ink-soft">
                    × {formatVND(singleUnitPrice(product, draft.choiceId, draft.thickness) ?? 0)}
                  </span>
                )}
              </div>
            </section>

            <StepCustomer customer={draft.customer} errors={errors} summary={summary} onChange={changeCustomer} />
            {order.failed && (
              <div id={SEND_ERROR_ID} className="scroll-mt-[5.5rem] scroll-mb-40">
                <SendFailed what={T.donHang} />
              </div>
            )}

            <div className="hidden items-center justify-between gap-4 border-t border-ivory pt-8 lg:flex">
              <p className="text-sm text-ink-soft">{hint}</p>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={!canOrder || order.sending}
                aria-busy={order.sending}
                className={buttonClass('primary', 'lg')}
              >
                {order.sending ? T.nutDangGui : T.nutDatHang}
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
        amountLabel={summary.priceOnCall ? T.leGiaKhiGoi : ORDER_SUMMARY_TEXT.tongCong}
        nextLabel={order.sending ? T.nutDangGui : T.nutDatHang}
        hint={hint}
        canContinue={canOrder && !order.sending}
        onNext={() => void submit()}
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
  /** Lựa chọn tạm hết hàng (đợt F): ô mờ, ghi "Tạm hết hàng", không bấm được (trừ ô đang chọn) */
  isSoldOut?: (id: string) => boolean
}

function ChoiceGroup({ label, options, value, onChange, priceOnCallNote, isSoldOut }: ChoiceGroupProps) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-medium text-deep-900">{label}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const active = o.id === value
          const soldOut = isSoldOut?.(o.id) ?? false
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              disabled={soldOut && !active}
              onClick={() => onChange(o.id)}
              className={`flex flex-col items-start rounded-2xl px-4 py-3 text-left transition ${
                active ? 'bg-mist-50 ring-2 ring-deep-800' : 'bg-ivory ring-1 ring-cream-200 hover:ring-mist-400'
              } ${soldOut ? 'cursor-not-allowed opacity-55' : ''}`}
            >
              <span className={`text-sm font-medium text-deep-900 ${soldOut ? 'line-through' : ''}`}>{o.label}</span>
              {soldOut ? (
                <span className="mt-0.5 text-meta text-ink-soft">{STOCK_TEXT.tamHet}</span>
              ) : (o.price !== undefined || priceOnCallNote) && (
                <span className="tabular mt-0.5 text-meta text-ink-soft">
                  {o.price !== undefined ? formatVND(o.price) : T.leBaoGia}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
