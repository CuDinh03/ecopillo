import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Confirmation } from '../components/order/Confirmation'
import { OrderSummary } from '../components/order/OrderSummary'
import { StepCustomer } from '../components/order/StepCustomer'
import { StepPattern } from '../components/order/StepPattern'
import { StepSize } from '../components/order/StepSize'
import { Stepper, type StepNumber } from '../components/order/Stepper'
import { Icon } from '../components/ui/Icon'
import { buttonClass, Container } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { collectionById, isSizeSoldOut, type SizeId } from '../data/catalog'
import { productBySlug } from '../data/products'
import {
  createDraft,
  createOrderCode,
  MAX_QUANTITY,
  summarize,
  validateCustomer,
  type CustomerErrors,
  type CustomerInfo,
  type OrderDraft,
} from '../lib/order'
import { SingleOrder } from '../components/order/SingleOrder'
import { MobileOrderBar, OrderAssurances } from '../components/order/OrderChrome'
import { usePageMeta } from '../hooks/usePageMeta'

const COLLECTION_PARAM = 'bo-suu-tap'
const MOBILE_QUERY = '(max-width: 1023px)'
const PATTERN_PARAM = 'mau'
const SIZE_PARAM = 'kich-thuoc'

type View = StepNumber | 'done'

const PRODUCT_PARAM = 'san-pham'

export function OrderPage() {
  usePageMeta('Đặt hàng online')
  const [searchParams] = useSearchParams()
  // Biên bản mục 47: ruột gối, ruột chăn, topper, đệm cũng đặt online được
  const product = productBySlug(searchParams.get(PRODUCT_PARAM) ?? undefined)
  if (product && !product.collection) {
    return (
      <SingleOrder
        key={product.slug}
        product={product}
        choiceId={searchParams.get('lua-chon')}
        thickness={searchParams.get('do-day')}
        quantity={searchParams.get('so-luong')}
      />
    )
  }
  return <SetOrder initialCollection={product?.collection?.id ?? null} />
}

function SetOrder({ initialCollection }: { initialCollection: string | null }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [draft, setDraft] = useState<OrderDraft>(() =>
    createDraft(
      searchParams.get(COLLECTION_PARAM) ?? initialCollection,
      searchParams.get(PATTERN_PARAM),
      searchParams.get(SIZE_PARAM),
    ),
  )
  // Đến từ trang chi tiết đã chọn mẫu: vào thẳng bước kích thước & số lượng
  const [view, setView] = useState<View>(() => (draft.patternCode ? 2 : 1))
  const [errors, setErrors] = useState<CustomerErrors>({})
  const [orderCode, setOrderCode] = useState('')
  const topRef = useRef<HTMLDivElement>(null)

  const summary = useMemo(() => summarize(draft), [draft])

  // Bấm "Đặt mua" ở trang chủ khi đang ở trang này: cập nhật bộ sưu tập theo đường dẫn
  const paramCollection = searchParams.get(COLLECTION_PARAM)
  useEffect(() => {
    if (paramCollection && collectionById(paramCollection)) {
      setDraft((d) =>
        d.collectionId === paramCollection ? d : { ...d, collectionId: paramCollection, patternCode: null, size: null },
      )
    }
  }, [paramCollection])

  // Lựa chọn bị xoá (đổi bộ sưu tập) thì lùi về bước còn thiếu
  useEffect(() => {
    if (view === 2 && !summary.pattern) setView(1)
    if (view === 3 && !summary.size) setView(summary.pattern ? 2 : 1)
  }, [view, summary.pattern, summary.size])

  // Đổi bước thì đưa người dùng về đầu khung đặt hàng (bỏ qua lần render đầu)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [view])

  const selectCollection = (id: string) => {
    setDraft((d) => ({ ...d, collectionId: id, patternCode: null, size: null }))
    setSearchParams({ [COLLECTION_PARAM]: id }, { replace: true })
    // Trên điện thoại, lưới mẫu nằm dưới màn hình — cuộn xuống giúp người dùng
    if (window.matchMedia(MOBILE_QUERY).matches) {
      requestAnimationFrame(() =>
        document.getElementById('chon-mau')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  const selectPattern = (code: string) => {
    setDraft((d) => {
      const pattern = collectionById(d.collectionId)?.patterns.find((p) => p.code === code)
      const keepSize = pattern && d.size && !isSizeSoldOut(pattern, d.size) ? d.size : null
      return { ...d, patternCode: code, size: keepSize }
    })
  }

  const selectSize = (size: SizeId) => setDraft((d) => ({ ...d, size }))
  const changeQuantity = (quantity: number) =>
    setDraft((d) => ({ ...d, quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)) }))
  const changeCustomer = (patch: Partial<CustomerInfo>) => {
    setDraft((d) => ({ ...d, customer: { ...d.customer, ...patch } }))
    // Xoá lỗi của ô vừa sửa để người dùng thấy phản hồi ngay
    setErrors((e) => {
      const next = { ...e }
      for (const key of Object.keys(patch) as (keyof CustomerInfo)[]) delete next[key]
      return next
    })
  }

  const canContinue =
    view === 1 ? Boolean(summary.pattern) : view === 2 ? Boolean(summary.size) : view === 3

  const goNext = () => {
    if (view === 1 && summary.pattern) setView(2)
    else if (view === 2 && summary.size) setView(3)
    else if (view === 3) submit()
  }

  const goBack = () => {
    if (view === 2) setView(1)
    else if (view === 3) setView(2)
  }

  const submit = () => {
    const found = validateCustomer(draft.customer)
    setErrors(found)
    const firstError = Object.keys(found)[0]
    if (firstError) {
      document.getElementById(`f-${firstError}`)?.focus()
      return
    }
    setOrderCode(createOrderCode())
    setView('done')
  }

  const startOver = () => {
    setDraft(createDraft(null))
    setErrors({})
    setSearchParams({}, { replace: true })
    setView(1)
  }

  if (view === 'done') {
    return (
      <div ref={topRef} className="scroll-mt-24 py-14 sm:py-20">
        <Container>
          <Confirmation orderCode={orderCode} summary={summary} customer={draft.customer} onNewOrder={startOver} />
        </Container>
      </div>
    )
  }

  const nextLabel = view === 1 ? 'Chọn kích thước' : view === 2 ? 'Nhập thông tin nhận' : 'Đặt hàng'
  const hint =
    view === 1 && !summary.pattern
      ? summary.collection
        ? 'Chọn một mẫu để tiếp tục'
        : 'Chọn bộ sưu tập và mẫu'
      : view === 2 && !summary.size
        ? 'Chọn kích thước còn hàng'
        : null

  return (
    <div ref={topRef} className="scroll-mt-20 pb-36 lg:pb-24">
      <Container className="pt-8 sm:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-deep-900">
              <Icon name="arrowLeft" size={15} /> Trang chủ
            </Link>
            <h1 className="font-display mt-3 text-[2.2rem] leading-none text-deep-900 sm:text-5xl">Đặt hàng online</h1>
          </div>
          <p className="hidden text-sm text-ink-soft md:block">
            Cần tư vấn?{' '}
            <a href={CONTACT.hotlineTel} className="tabular font-medium text-deep-900 hover:underline">
              {CONTACT.hotlineDisplay}
            </a>{' '}
            (có Zalo)
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <Stepper current={view} onGoTo={setView} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12 xl:grid-cols-[1fr_380px]">
          <div key={view} className="reveal min-w-0">
            {view > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-deep-900"
              >
                <Icon name="arrowLeft" size={15} /> Quay lại bước {view - 1}
              </button>
            )}

            {view === 1 && (
              <StepPattern
                collectionId={draft.collectionId}
                patternCode={draft.patternCode}
                onSelectCollection={selectCollection}
                onSelectPattern={selectPattern}
              />
            )}
            {view === 2 && <StepSize summary={summary} onSelectSize={selectSize} onChangeQuantity={changeQuantity} />}
            {view === 3 && (
              <StepCustomer
                customer={draft.customer}
                errors={errors}
                summary={summary}
                onChange={changeCustomer}
              />
            )}

            {/* Nút điều hướng trên máy tính — điện thoại dùng thanh dưới */}
            <div className="mt-12 hidden items-center justify-between gap-4 border-t border-ivory pt-8 lg:flex">
              <p className="text-sm text-ink-soft">{hint}</p>
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className={buttonClass('primary', 'lg')}
              >
                {nextLabel}
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary summary={summary} showShipping={view === 3} />
            <OrderAssurances deliveryTime={view === 3 ? summary.deliveryTime : undefined} />
          </aside>
        </div>
      </Container>

      <MobileOrderBar
        amount={view === 3 ? summary.total : summary.subtotal}
        amountLabel={view === 3 ? 'Tổng cộng' : 'Tạm tính'}
        nextLabel={nextLabel}
        hint={hint}
        canContinue={canContinue}
        onNext={goNext}
      />
    </div>
  )
}
