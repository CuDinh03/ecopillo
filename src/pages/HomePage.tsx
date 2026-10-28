import { About } from '../components/home/About'
import { Collections } from '../components/home/Collections'
import { BrandVideo } from '../components/home/BrandVideo'
import { BrandStory, TrustStrip } from '../components/home/Craft'
import { Essentials, Gifts } from '../components/home/Essentials'
import { Hero } from '../components/home/Hero'
import { Hospitality } from '../components/home/Hospitality'
import { Reviews } from '../components/home/Reviews'
import { Faq, Showrooms } from '../components/home/Showrooms'
import { StoryTabs } from '../components/home/StoryTabs'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Cả hai bản nằm trong HTML; trình duyệt chọn bằng CSS (`md:`).
 * Không dùng useIsMobile: lúc dựng sẵn HTML trên máy chủ không biết khổ màn hình, nếu chỉ vẽ một bản
 * thì máy tính sẽ đổi cây DOM sau khi gắn React (xô bố cục, lệch hydrate). Xem docs/ke-hoach-ssg-va-wordpress.md mục 5.
 */
export function HomePage() {
  usePageMeta(null)
  return (
    <>
      <div className="md:hidden">
        <MobileHome />
      </div>
      <div className="hidden md:block">
        <DesktopHome />
      </div>
    </>
  )
}

/** Máy tính: thứ tự gốc. Dải mạng xã hội bỏ theo mẫu C (owner duyệt 23/10/2026): biểu tượng đã có ở chân trang */
function DesktopHome() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <About moreLink />
      <BrandVideo />
      <BrandStory />
      <Collections />
      <Essentials />
      <Gifts />
      <Hospitality />
      <Reviews />
      <Showrooms />
      <Faq />
    </>
  )
}

/**
 * Điện thoại, mẫu 2 "Sản phẩm lên trước, câu chuyện xuống sau" (owner chốt 15/10/2026,
 * docs/de-xuat-thu-gon-trang-chu-mobile.html). Đủ mọi khối như máy tính, không bỏ nội dung nào:
 * chỉ đổi thứ tự và gộp bằng tab (StoryTabs, Essentials withTabs), phần dài nằm sau nút "Xem thêm".
 * Phần ẩn vẫn có trong trang để Google (xếp hạng theo bản điện thoại) đọc đủ chữ.
 * Dải mạng xã hội bỏ theo mẫu C (owner duyệt 23/10/2026): còn ở chân trang, menu và thanh liên hệ đáy màn hình.
 */
function MobileHome() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Collections />
      <Essentials withTabs />
      <Reviews />
      <StoryTabs />
      <Showrooms />
      <Faq compact />
    </>
  )
}
