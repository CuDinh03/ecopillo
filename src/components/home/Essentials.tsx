import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import {
  ESSENTIALS,
  productImage,
  type EssentialItem,
} from '../../data/catalog'
import { formatRange } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { Container, SectionHeading } from '../ui/primitives'
import { productForEssential, productPath, singleOrderUrl } from '../../data/products'
import { PATHS } from '../../data/links'
import { revealDelay } from '../../lib/reveal'
import { orderLink } from './Collections'
import { MobileTabBar } from './MobileTabBar'

const SUMMER_QUILT_NAME = 'Chăn hè Lyocell'
const SUMMER_QUILT_ID = 'chan-he-lyocell'

/** Tab bảng giá trên điện thoại (đệm tách ra MattressPicker, C3 02/11/2026). Tab Quà tặng bỏ từ 05/11/2026 (mục 11: thư cảm ơn đứng riêng). */
type EssentialTab = 'ruot-goi' | 'ruot-chan' | 'chan-topper'

const ESSENTIAL_TABS: readonly { id: EssentialTab; label: string }[] = ESSENTIALS.map((g) => ({
  id: g.id as EssentialTab,
  label: g.title,
}))

interface EssentialsProps {
  /**
   * Trang chủ điện thoại (mẫu 2, owner chốt 15/10/2026): bảng giá ruột chăn gối có tab theo nhóm.
   * Đệm tách ra MattressPicker từ 02/11/2026 (C3). Máy tính không dùng tab.
   */
  withTabs?: boolean
}

export function Essentials({ withTabs = false }: EssentialsProps) {
  const [tab, setTab] = useState<EssentialTab>('ruot-goi')
  const shownOnMobile = (id: EssentialTab) => !withTabs || tab === id
  const mobileOnly = (id: EssentialTab) => (shownOnMobile(id) ? '' : 'max-sm:hidden')
  const group = (g: PriceGroup) => <PriceGroupBlock key={g.id} group={g} withTabs={withTabs} className={mobileOnly(g.id)} />
  return (
    <section id="ruot-chan-goi" aria-labelledby="essentials-title" className="py-14 sm:py-24">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHeading
            id="essentials-title"
            className="lg:col-span-7"
            title="Ruột chăn, ruột gối và phụ kiện"
            lead="Phần êm ái bên trong. Chọn độ êm hợp với thói quen ngủ của Quý khách: đặt online ngay, hoặc ghé cửa hàng Ecopillo để nằm thử từng loại gối."
          />
          {/* Một ảnh cho cả bảng giá, chỉ trên máy tính (rà mẫu C 23/10: bảng không còn ảnh, chăn và topper không có ảnh nào trên trang chủ) */}
          <div data-reveal className="hidden aspect-[16/10] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-soft)] lg:col-span-5 lg:block">
            <Placeholder
              className="h-full w-full"
              note={ESSENTIALS_PHOTO.imageNote}
              image={ESSENTIALS_PHOTO.imageKey ? productImage(ESSENTIALS_PHOTO.imageKey, ESSENTIALS_PHOTO.title) : undefined}
              sizes="480px"
            />
          </div>
        </div>

        {withTabs && <MobileTabBar label="Nhóm sản phẩm" tabs={ESSENTIAL_TABS} value={tab} onChange={setTab} className="mt-6" />}

        {/* Bảng giá liền thay cho ba thẻ ảnh (mẫu C, owner duyệt 23/10/2026). Hai cột:
            trái ruột gối, phải ruột chăn + chăn, topper và phụ kiện. Đệm tách ra MattressPicker (C3 02/11). Điện thoại: một nhóm mỗi tab. */}
        <div className={`grid gap-x-16 sm:mt-14 lg:grid-cols-2 ${withTabs ? 'mt-2' : 'mt-8'}`}>
          <div data-reveal className="grid gap-10 sm:gap-12">
            {[PRICE_GROUPS[0]].map(group)}
          </div>
          <div data-reveal style={revealDelay(1)} className="grid gap-10 sm:gap-12 max-lg:mt-10 max-sm:mt-0">
            {[PRICE_GROUPS[1], PRICE_GROUPS[2]].map(group)}
          </div>
        </div>

        <p className="mt-8 flex items-start gap-2 text-sm text-ink-soft sm:mt-12">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-mist-600" />
          {/* Gói chữ vào một khối: không thì mỗi mảnh chữ, link thành một cột riêng của flex và số điện thoại bị bẻ dòng */}
          <span>
            Ruột gối, ruột chăn, topper và phụ kiện đều đặt online được; nhân viên gọi xác nhận trước khi giao. Cần tư vấn độ êm? Gọi
            hoặc nhắn Zalo{' '}
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium whitespace-nowrap text-deep-900 underline underline-offset-4"
            >
              {CONTACT.hotlineDisplay}
            </a>
            .
          </span>
        </p>
      </Container>
    </section>
  )
}

/** Chăn hè đi luồng chọn mẫu; ruột gối, ruột chăn, topper, phụ kiện đặt theo kích thước */
const essentialOrderUrl = (name: string): string => {
  if (name === SUMMER_QUILT_NAME) return orderLink(SUMMER_QUILT_ID)
  const product = productForEssential(name)
  return product ? singleOrderUrl(product) : PATHS.order
}

/** Một dòng của bảng giá: tên (link sang trang sản phẩm nếu có), giá, ghi chú, link đặt mua */
interface PriceRow {
  name: string
  note: string
  price: string
  productTo?: string
  orderTo: string
}

interface PriceGroup {
  id: EssentialTab
  title: string
  subtitle: string
  rows: readonly PriceRow[]
}

const essentialRow = (item: EssentialItem): PriceRow => {
  const product = productForEssential(item.name)
  return {
    name: item.name,
    note: item.note,
    price: formatRange(item.min, item.max),
    productTo: product ? productPath(product) : undefined,
    orderTo: essentialOrderUrl(item.name),
  }
}

/** Thứ tự: ruột gối, ruột chăn, chăn, topper và phụ kiện (khớp hàng tab điện thoại; đệm tách ra MattressPicker) */
const PRICE_GROUPS: readonly PriceGroup[] = ESSENTIALS.map((g) => ({
  id: g.id as EssentialTab,
  title: g.title,
  subtitle: g.subtitle,
  rows: g.items.map(essentialRow),
}))

/** Ảnh đầu bảng giá: ruột chăn (nhóm chưa có ảnh nào khác trên trang chủ) */
const ESSENTIALS_PHOTO = ESSENTIALS.find((g) => g.id === 'ruot-chan') ?? ESSENTIALS[0]

interface PriceGroupBlockProps {
  group: PriceGroup
  withTabs: boolean
  className?: string
}

function PriceGroupBlock({ group, withTabs, className = '' }: PriceGroupBlockProps) {
  return (
    <div className={className}>
      {/* Điện thoại có tab: tên nhóm đã nằm trên tab, không nhắc lại */}
      <h3 className={`font-display text-[1.7rem] text-deep-900 ${withTabs ? 'max-sm:sr-only' : ''}`}>{group.title}</h3>
      <p className={`text-sm text-ink-soft ${withTabs ? 'max-sm:mt-4' : 'mt-1'} sm:mt-1`}>{group.subtitle}</p>
      <ul className="mt-4 divide-y divide-line border-t border-line">
        {group.rows.map((row) => (
          <li key={row.name} className="py-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              {row.productTo ? (
                <Link
                  to={row.productTo}
                  className="-my-2 py-2 font-medium text-deep-900 decoration-mist-300 underline-offset-4 hover:underline"
                >
                  {row.name}
                </Link>
              ) : (
                <span className="font-medium text-deep-900">{row.name}</span>
              )}
              <span className="tabular ml-auto shrink-0 text-right text-body-sm text-deep-800">{row.price}</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between gap-4">
              <span className="text-meta text-ink-soft">{row.note}</span>
              <Link
                to={row.orderTo}
                aria-label={`Đặt mua ${row.name}`}
                className="-my-2.5 inline-flex shrink-0 items-center gap-1 py-2.5 text-meta font-medium text-mist-600 underline-offset-4 hover:underline"
              >
                Đặt mua <Icon name="arrowRight" size={13} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

