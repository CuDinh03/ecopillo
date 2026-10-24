import { useState } from 'react'
import { VALUES_SHORT } from '../../data/about'
import { Container } from '../ui/primitives'
import { About } from './About'
import { BrandVideo } from './BrandVideo'
import { BrandStory } from './Craft'
import { Hospitality } from './Hospitality'
import { MobileTabBar } from './MobileTabBar'

const TABS = [
  { id: 'cau-chuyen', label: 'Câu chuyện' },
  { id: 'phim', label: 'Phim' },
  { id: 'chat-lieu', label: 'Chất liệu' },
  { id: 'khach-san', label: 'Khách sạn' },
] as const

type TabId = (typeof TABS)[number]['id']

/**
 * Trang chủ điện thoại: bốn khối thương hiệu (Về chúng tôi, Phim, Chất liệu, Khách sạn) gộp thành một dải có tab,
 * đặt sau phần sản phẩm (mẫu 2). Mọi khối vẫn nằm đủ trong trang, chỉ hiện một khối mỗi lúc.
 */
export function StoryTabs() {
  const [tab, setTab] = useState<TabId>('cau-chuyen')
  const panel = (id: TabId) => (tab === id ? '' : 'hidden')
  return (
    <div>
      <Container className="pt-14">
        <p className="font-display text-[2rem] leading-tight text-deep-900">Tốt · Thật · Thiện</p>
        <p className="mt-1 text-body-sm text-ink-soft">
          {VALUES_SHORT.map((v) => `${v.word} ${v.text}`).join(' · ')}
        </p>
        <MobileTabBar label="Về Ecopillo" tabs={TABS} value={tab} onChange={setTab} className="mt-5" />
      </Container>
      <div className={panel('cau-chuyen')}>
        <About moreLink />
      </div>
      <div className={panel('phim')}>
        <BrandVideo />
      </div>
      <div className={panel('chat-lieu')}>
        <BrandStory />
      </div>
      <div className={panel('khach-san')}>
        <Hospitality />
      </div>
    </div>
  )
}
