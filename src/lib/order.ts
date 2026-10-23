import {
  collectionById,
  GIFTS,
  imageOfPattern,
  isPatternSoldOut,
  isSizeSoldOut,
  setPrice,
  SHEET_LABELS,
  sizeById,
  SIZES,
  unitOf,
  type Collection,
  type Gift,
  type ImageSource,
  type Pattern,
  type SheetStyle,
  type SizeId,
} from '../data/catalog'
import { categoryLabel, isValidSingleChoice, singleUnitPrice, type Product } from '../data/products'
import { DELIVERY_TIME, provinceById, shippingFee, type Province } from './shipping'

export const MAX_QUANTITY = 10

/** Hiện thay cho giá khi lựa chọn chưa có giá (đệm theo kích thước) */
export const PRICE_ON_CALL = 'Báo khi gọi xác nhận'

export interface CustomerInfo {
  name: string
  phone: string
  provinceId: string
  address: string
  note: string
}

/** Đơn bộ chăn ga / chăn hè: chọn bộ sưu tập → mẫu → kích thước */
export interface OrderDraft {
  collectionId: string | null
  patternCode: string | null
  size: SizeId | null
  /** Ga phủ chần hay ga chun chần; chỉ đổi được ở bộ có hasFittedOption (mục 28) */
  sheet: SheetStyle
  quantity: number
  customer: CustomerInfo
}

/** Đơn sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm): lựa chọn đã chọn ở trang sản phẩm */
export interface SingleDraft {
  product: Product
  choiceId: string | null
  thickness: string | null
  quantity: number
  customer: CustomerInfo
}

export const EMPTY_CUSTOMER: CustomerInfo = { name: '', phone: '', provinceId: '', address: '', note: '' }

const clampQuantity = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Number.isFinite(n) ? Math.round(n) : 1))

/** Bản nháp mới; mẫu và kích thước chỉ được nhận nếu hợp lệ và còn hàng */
export const createDraft = (
  collectionId: string | null,
  patternCode: string | null = null,
  size: string | null = null,
  sheet: string | null = null,
): OrderDraft => {
  const collection = collectionById(collectionId)
  const pattern = collection?.patterns.find((p) => p.code === patternCode && !isPatternSoldOut(p))
  const sizeId = SIZES.find((s) => s.id === size)?.id
  return {
    collectionId: collection ? collection.id : null,
    patternCode: pattern ? pattern.code : null,
    size: pattern && sizeId && !isSizeSoldOut(pattern, sizeId) ? sizeId : null,
    sheet: collection?.hasFittedOption && sheet === 'chun' ? 'chun' : 'phu',
    quantity: 1,
    customer: EMPTY_CUSTOMER,
  }
}

export const createSingleDraft = (
  product: Product,
  choiceId: string | null,
  thickness: string | null,
  quantity: string | null,
): SingleDraft => {
  const valid = isValidSingleChoice(product, choiceId, thickness)
  return {
    product,
    choiceId: valid ? choiceId : null,
    thickness: valid ? thickness : null,
    quantity: clampQuantity(Number(quantity ?? 1)),
    customer: EMPTY_CUSTOMER,
  }
}

/** Một dòng hàng trong đơn, dùng chung cho tóm tắt đơn và màn hình cảm ơn */
export interface OrderLine {
  kindLabel: string
  name: string
  /** Ví dụ "ER25 · Kem" hoặc "160 × 200 cm · 9 cm" */
  detail: string
  image?: ImageSource
  tint?: string
  imageNote: string
  /** Nhãn kích thước để hiện trong bảng tóm tắt */
  sizeLabel: string | null
  quantity: number
  unit: string
  /** null: chưa có giá cho lựa chọn này, nhân viên báo khi gọi xác nhận */
  unitPrice: number | null
  gift?: Gift
  giftCount: number
}

export interface OrderSummaryData {
  /** Chỉ có ở đơn bộ chăn ga */
  collection?: Collection
  pattern?: Pattern
  size: SizeId | null
  line?: OrderLine
  quantity: number
  unitPrice: number
  /** Tạm tính; 0 khi chưa chọn đủ hoặc chưa có giá */
  subtotal: number
  /** true khi giá chưa có, nhân viên báo khi gọi */
  priceOnCall: boolean
  gift?: Gift
  giftCount: number
  province?: Province
  shippingFee: number
  total: number
  deliveryTime?: string
}

const withShipping = (
  base: Omit<OrderSummaryData, 'shippingFee' | 'total' | 'province' | 'deliveryTime'>,
  provinceId: string,
  /** Giá thấp nhất có thể của đơn, để biết có được miễn phí giao không khi chưa có giá chính xác */
  floorValue: number,
): OrderSummaryData => {
  const province = provinceById(provinceId)
  // Chưa chọn đủ để có giá (tạm tính 0, không có giá sàn) thì chưa tính phí giao
  const value = base.subtotal || floorValue
  const fee = base.line && value > 0 ? shippingFee(value) : 0
  return {
    ...base,
    province,
    shippingFee: fee,
    total: base.subtotal + (base.subtotal ? fee : 0),
    deliveryTime: province ? DELIVERY_TIME[province.region] : undefined,
  }
}

/** Tính toàn bộ số liệu của đơn bộ chăn ga — hàm thuần, không có tác dụng phụ */
export const summarize = (draft: OrderDraft): OrderSummaryData => {
  const collection = collectionById(draft.collectionId)
  const pattern = collection?.patterns.find((p) => p.code === draft.patternCode)
  const size = pattern && draft.size && !isSizeSoldOut(pattern, draft.size) ? draft.size : null
  const sheet: SheetStyle = collection?.hasFittedOption ? draft.sheet : 'phu'
  const price = collection && pattern && size ? setPrice(collection, pattern, size, sheet) : undefined
  const priceOnCall = Boolean(size) && price === undefined
  const unitPrice = price ?? 0
  const subtotal = unitPrice * draft.quantity
  const gift = collection && collection.gift !== 'none' ? GIFTS[collection.gift] : undefined
  const giftCount = gift ? gift.perSet * draft.quantity : 0
  const line: OrderLine | undefined = collection
    ? {
        kindLabel: collection.kindLabel,
        name: collection.name,
        detail: pattern
          ? [pattern.code, pattern.colorName, collection.hasFittedOption ? SHEET_LABELS[sheet] : null].filter(Boolean).join(' · ')
          : 'Chưa chọn mẫu',
        image: imageOfPattern(collection, pattern),
        tint: pattern?.swatch,
        imageNote: pattern ? `Ảnh ${pattern.code}` : 'Ảnh bộ sưu tập',
        sizeLabel: size ? sizeById(size).label : null,
        quantity: draft.quantity,
        unit: unitOf(collection),
        unitPrice: unitPrice || null,
        gift,
        giftCount,
      }
    : undefined

  return withShipping(
    {
      collection,
      pattern,
      size,
      line,
      quantity: draft.quantity,
      unitPrice,
      subtotal,
      priceOnCall,
      gift,
      giftCount,
    },
    draft.customer.provinceId,
    subtotal,
  )
}

/** Tính số liệu đơn sản phẩm lẻ */
export const summarizeSingle = (draft: SingleDraft): OrderSummaryData => {
  const { product, choiceId, thickness, quantity } = draft
  const price = singleUnitPrice(product, choiceId, thickness)
  const choiceLabel = product.variants ? choiceId : product.choices?.find((c) => c.id === choiceId)?.label ?? null
  const sizeLabel = [choiceLabel, thickness].filter(Boolean).join(' · ') || null
  const hasChoice = isValidSingleChoice(product, choiceId, thickness)
  const priceOnCall = hasChoice && price === undefined
  const unitPrice = price ?? 0
  const subtotal = unitPrice * quantity
  const line: OrderLine = {
    kindLabel: categoryLabel(product.category),
    name: product.name,
    detail: sizeLabel ?? (product.choices || product.variants ? 'Chưa chọn kích thước' : 'Một cỡ'),
    image: product.image,
    imageNote: product.imageNote,
    sizeLabel,
    quantity,
    unit: product.category === 'dem' && !product.name.startsWith('Topper') ? 'tấm' : 'chiếc',
    unitPrice: price ?? null,
    giftCount: 0,
  }
  return withShipping(
    { size: null, line, quantity, unitPrice, subtotal, priceOnCall, giftCount: 0 },
    draft.customer.provinceId,
    // Chưa chọn kích thước thì chưa tính phí giao (trước đây hiện 50.000đ khi tạm tính còn trống)
    hasChoice ? product.min * quantity : 0,
  )
}

export type CustomerErrors = Partial<Record<keyof CustomerInfo, string>>

const PHONE_PATTERN = /^(0|\+84)(3|5|7|8|9)\d{8}$/

export const normalizePhone = (phone: string) => phone.replace(/[\s.-]/g, '')

export const isValidPhone = (phone: string) => PHONE_PATTERN.test(normalizePhone(phone))

export const validateCustomer = (c: CustomerInfo): CustomerErrors => {
  const errors: CustomerErrors = {}
  if (c.name.trim().length < 2) errors.name = 'Vui lòng nhập họ tên người nhận.'
  if (!PHONE_PATTERN.test(normalizePhone(c.phone)))
    errors.phone = 'Số điện thoại chưa đúng, ví dụ 0988 832 072.'
  if (!provinceById(c.provinceId)) errors.provinceId = 'Vui lòng chọn tỉnh/thành nhận hàng.'
  if (c.address.trim().length < 6) errors.address = 'Vui lòng nhập số nhà, đường, phường/xã.'
  return errors
}

/** Mã đơn dễ đọc qua điện thoại, ví dụ EP-1010-4827 */
export const createOrderCode = (now = new Date()) => {
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const rand = String(Math.floor(1000 + Math.random() * 9000))
  return `EP-${dd}${mm}-${rand}`
}
