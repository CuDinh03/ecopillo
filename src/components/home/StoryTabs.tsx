import { useState } from 'react'
import { Container } from '../ui/primitives'
import { About } from './About'
import { BrandVideo } from './BrandVideo'
import { Hospitality } from './Hospitality'
import { MobileTabBar } from './MobileTabBar'
import { HOME_TEXT } from '../../data/pageText/home'

const TAB_IDS = ['cau-chuyen', 'phim', 'khach-san'] as const
type TabId = (typeof TAB_IDS)[number]

/** Chữ thẻ Ecopillo sửa (HOME_TEXT.veEcopilloThe, theo thứ tự); thiếu dòng thì dùng chữ gốc */
const BASE_TAB_LABELS: Readonly<Record<TabId, string>> = { 'cau-chuyen': 'Câu chuyện', phim: 'Phim', 'khach-san': 'Khách sạn' }
const TABS: readonly { id: TabId; label: string }[] = TAB_IDS.map((id, i) => ({ id, label: HOME_TEXT.veEcopilloThe[i] ?? BASE_TAB_LABELS[id] }))

/**
 * Trang chủ điện thoại: ba khối thương hiệu (Về chúng tôi, Phim, Khách sạn) gộp thành một dải có tab,
 * Chất liệu (BrandStory) đã lên ngay sau dải cam kết (khách 04/11/2026), không còn là tab.
 * đặt sau phần sản phẩm (mẫu 2). Mọi khối vẫn nằm đủ trong trang, chỉ hiện một khối mỗi lúc.
 */
export function StoryTabs() {
  const [tab, setTab] = useState<TabId>('cau-chuyen')
  const panel = (id: TabId) => (tab === id ? '' : 'hidden')
  return (
    <div>
      <Container className="pt-14">
        {/* Tốt · Thật · Thiện đã có ở dải đầu trang: không nhắc lại ở đây (khách báo "lặp 2 lần" 04/11/2026) */}
        <p className="font-display text-[2rem] leading-tight text-deep-900">{HOME_TEXT.veEcopillo}</p>
        <MobileTabBar label={HOME_TEXT.veEcopillo} tabs={TABS} value={tab} onChange={setTab} className="mt-5" />
      </Container>
      <div className={panel('cau-chuyen')}>
        <About moreLink />
      </div>
      <div className={panel('phim')}>
        <BrandVideo />
      </div>
      <div className={panel('khach-san')}>
        <Hospitality />
      </div>
    </div>
  )
}
