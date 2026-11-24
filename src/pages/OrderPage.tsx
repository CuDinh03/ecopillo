import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Confirmation } from '../components/order/Confirmation'
import { OrderSummary } from '../components/order/OrderSummary'
import { StepCustomer } from '../components/order/StepCustomer'
import { StepPattern } from '../components/order/StepPattern'
import { StepSize } from '../components/order/StepSize'
import { Stepper, type StepNumber } from '../components/order/Stepper'
import { Icon } from '../components/ui/Icon'
import { SendFailed } from '../components/ui/SendFailed'
import { buttonClass, Container } from '../components/ui/primitives'
import { CONTACT } from '../data/brand'
import { collectionById, COLLECTIONS, isSizeSoldOut, type SheetStyle, type SizeId } from '../data/catalog'
import { isProductShown, productBySlug } from '../data/products'
import {
  createDraft,
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
import { SEND_ERROR_ID, useSendOrder } from '../hooks/useSendOrder'
import { focusField, scrollToElement } from '../lib/scroll'
import { useHydrated, useHydratedSearchParams } from '../hooks/useHydratedSearchParams'
import { ORDER_TEXT } from '../data/pageText/order'
import { ORDER_STEPS_TEXT as T, ORDER_SUMMARY_TEXT } from '../data/pageText/orderFlow'
import { chen } from '../data/pageText/define'
import { ORDER_SHOWN } from '../data/pageLayout'

const COLLECTION_PARAM = 'bo-suu-tap'
const MOBILE_QUERY = '(max-width: 1023px)'
const PATTERN_PARAM = 'mau'
const SIZE_PARAM = 'kich-thuoc'
const SHEET_PARAM = 'kieu-ga'

type View = StepNumber | 'done'

const PRODUCT_PARAM = 'san-pham'

export function OrderPage() {
  // Mô tả riêng 08/11/2026 (C2, chờ Ecopillo duyệt): trước đó trang này dùng chung mô tả trang chủ
  usePageMeta(ORDER_TEXT.tieuDe, ORDER_TEXT.moTaGoogle)
  const [searchParams] = useHydratedSearchParams()
  const hydrated = useHydrated()
  // Biên bản mục 47: ruột gối, ruột chăn, topper, đệm cũng đặt online được
  // Sản phẩm Ecopillo đã gỡ trong Woo (đợt E2) thì không đặt được qua link cũ
  const linked = productBySlug(searchParams.get(PRODUCT_PARAM) ?? undefined)
  const product = linked && isProductShown(linked.slug) ? linked : undefined
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
  // Bản nháp, bước đầu tiên lấy từ tham số trong useState: gắn lại một lần sau khi React gắn vào trang để nhận tham số thật
  return <SetOrder key={hydrated ? 'client' : 'ssr'} initialCollection={product?.collection?.id ?? null} />
}

function SetOrder({ initialCollection }: { initialCollection: string | null }) {
  const [searchParams, setSearchParams] = useHydratedSearchParams()
  const [draft, setDraft] = useState<OrderDraft>(() =>
    createDraft(
      searchParams.get(COLLECTION_PARAM) ?? initialCollection,
      searchParams.get(PATTERN_PARAM),
      searchParams.get(SIZE_PARAM),
      searchParams.get(SHEET_PARAM),
    ),
  )
  // Đến từ trang chi tiết đã chọn mẫu: vào thẳng bước kích thước & số lượng
  const [view, setView] = useState<View>(() => (draft.patternCode ? 2 : 1))
  const [errors, setErrors] = useState<CustomerErrors>({})
  const order = useSendOrder()
  const topRef = useRef<HTMLDivElement>(null)

  const summary = useMemo(() => summarize(draft), [draft])

  // Bấm "Đặt mua" ở trang chủ khi đang ở trang này: cập nhật bộ sưu tập theo đường dẫn
  const paramCollection = searchParams.get(COLLECTION_PARAM)
  useEffect(() => {
    if (paramCollection && COLLECTIONS.some((c) => c.id === paramCollection)) {
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
  const selectSheet = (sheet: SheetStyle) => setDraft((d) => ({ ...d, sheet }))
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

  // Chưa chọn đủ mà bấm "tiếp": không tắt nút (nút tắt thì trình đọc màn hình bỏ qua, khách không biết vì sao),
  // mà cuộn tới phần còn thiếu và đọc lời nhắc, như bước 3 đưa focus về ô sai (rà 23/10/2026)
  const [missingNote, setMissingNote] = useState<string | null>(null)
  const showMissing = (anchor: string, note: string) => {
    setMissingNote(note)
    const target = document.getElementById(anchor)
    if (target) scrollToElement(target)
  }

  const goNext = () => {
    if (view === 1 && summary.pattern) setView(2)
    else if (view === 1) showMissing(summary.collection ? 'chon-mau' : 'chon-bo', summary.collection ? T.nhacChonMau : T.nhacChonBo)
    else if (view === 2 && summary.size) setView(3)
    else if (view === 2) showMissing('chon-kich-thuoc', T.nhacChonCo)
    else if (view === 3) void submit()
  }

  const goBack = () => {
    if (view === 2) setView(1)
    else if (view === 3) setView(2)
  }

  const submit = async () => {
    const found = validateCustomer(draft.customer)
    setErrors(found)
    const firstError = Object.keys(found)[0]
    if (firstError) {
      focusField(`f-${firstError}`)
      return
    }
    await order.send(draft.customer, summary)
  }

  // Gửi xong thì sang màn hình cảm ơn (đổi bước để hiệu ứng cuộn về đầu khung chạy như khi đổi bước)
  useEffect(() => {
    if (order.result) setView('done')
  }, [order.result])

  const startOver = () => {
    setDraft(createDraft(null))
    setErrors({})
    setSearchParams({}, { replace: true })
    order.reset()
    setView(1)
  }

  // Chỉ sang 'done' khi đã có kết quả gửi (hiệu ứng ngay trên)
  if (view === 'done') {
    return (
      <div ref={topRef} className="scroll-mt-24 py-14 sm:py-20">
        <Container>
          <Confirmation
            orderCode={order.result?.code ?? ''}
            delivered={order.result?.delivered ?? false}
            summary={summary}
            customer={draft.customer}
            onNewOrder={startOver}
          />
        </Container>
      </div>
    )
  }

  const nextLabel =
    view === 1 ? T.nutBuoc1 : view === 2 ? T.nutBuoc2 : order.sending ? T.nutDangGui : T.nutDatHang
  const hint =
    view === 1 && !summary.pattern
      ? summary.collection
        ? T.goiYChonMau
        : T.goiYChonBo
      : view === 2 && !summary.size
        ? T.goiYChonCo
        : null

  return (
    <div ref={topRef} className="scroll-mt-20 pb-36 lg:pb-24">
      <Container className="pt-8 sm:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link to="/" className="-my-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-soft hover:text-deep-900">
              <Icon name="arrowLeft" size={15} /> {T.trangChu}
            </Link>
            <h1 className="font-display mt-3 text-[2.2rem] leading-none text-deep-900 sm:text-5xl">{ORDER_TEXT.tieuDe}</h1>
          </div>
          {/* Ẩn / hiện: Nội dung web → Giao diện → Bố cục trang Đặt hàng (đợt E6) */}
          {ORDER_SHOWN.has('hotline') && (
            <p className="hidden text-sm text-ink-soft md:block">
              {T.canTuVan}{' '}
              <a href={CONTACT.hotlineTel} className="tabular font-medium text-deep-900 hover:underline">
                {CONTACT.hotlineDisplay}
              </a>{' '}
              {T.coZalo}
            </p>
          )}
        </div>

        <div className="mt-8 sm:mt-10">
          <Stepper current={view} onGoTo={setView} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12 xl:grid-cols-[1fr_380px]">
          <div key={view} className="reveal min-w-0">
            {missingNote && !canContinue && (
              <p role="alert" className="mb-6 rounded-2xl bg-alert-soft px-4 py-3 text-body-sm text-alert">
                {missingNote}
              </p>
            )}
            {view > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-deep-900"
              >
                <Icon name="arrowLeft" size={15} /> {chen(T.quayLai, { so: view - 1 })}
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
            {view === 2 && <StepSize summary={summary} sheet={draft.sheet} onSelectSheet={selectSheet} onSelectSize={selectSize} onChangeQuantity={changeQuantity} />}
            {view === 3 && (
              <StepCustomer
                customer={draft.customer}
                errors={errors}
                summary={summary}
                onChange={changeCustomer}
              />
            )}
            {view === 3 && order.failed && (
              <div id={SEND_ERROR_ID} className="mt-8 scroll-mb-40 scroll-mt-[5.5rem]">
                <SendFailed what={T.donHang} />
              </div>
            )}

            {/* Nút điều hướng trên máy tính — điện thoại dùng thanh dưới */}
            <div className="mt-12 hidden items-center justify-between gap-4 border-t border-ivory pt-8 lg:flex">
              <p className="text-sm text-ink-soft">{hint}</p>
              <button
                type="button"
                onClick={goNext}
                aria-disabled={!canContinue || order.sending}
                aria-busy={order.sending}
                className={buttonClass('primary', 'lg', canContinue && !order.sending ? '' : 'opacity-45')}
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
        amountLabel={view === 3 ? ORDER_SUMMARY_TEXT.tongCong : ORDER_SUMMARY_TEXT.tamTinh}
        nextLabel={nextLabel}
        hint={hint}
        canContinue={canContinue && !order.sending}
        onNext={goNext}
      />
    </div>
  )
}
