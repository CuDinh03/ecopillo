import { About } from '../components/home/About'
import { Collections } from '../components/home/Collections'
import { BrandVideo } from '../components/home/BrandVideo'
import { BrandStory, TrustStrip } from '../components/home/Craft'
import { Essentials, Gifts } from '../components/home/Essentials'
import { Hero } from '../components/home/Hero'
import { Hospitality } from '../components/home/Hospitality'
import { MattressPicker } from '../components/home/MattressPicker'
import { Reviews } from '../components/home/Reviews'
import { Faq, Showrooms } from '../components/home/Showrooms'
import { StoryTabs } from '../components/home/StoryTabs'
import { JsonLd } from '../components/seo/JsonLd'
import { useIsMobile } from '../hooks/useIsMobile'
import { usePageMeta } from '../hooks/usePageMeta'
import { organizationLd } from '../lib/structuredData'

/**
 * HTML dựng sẵn có cả hai bản; trình duyệt chọn bằng CSS (`md:`). Lúc dựng trên máy chủ không biết khổ màn hình,
 * nếu chỉ vẽ một bản thì máy tính sẽ đổi cây DOM sau khi gắn React (xô bố cục, lệch hydrate).
 * Gắn xong thì bỏ bản đang ẩn: trang chỉ còn một H1 và không trùng id (link #bo-suu-tap, thanh menu sáng đúng mục).
 * Bản bị bỏ vốn đang ẩn nên không xô bố cục; hai khung bọc giữ nguyên để bản đang hiện không bị vẽ lại.
 * Xem docs/ke-hoach-ssg-va-wordpress.md mục 5.
 */
export function HomePage() {
  usePageMeta(null)
  const isMobile = useIsMobile()
  return (
    <>
      <JsonLd data={organizationLd()} />
      {/* Hai bản cùng mở đầu bằng Hero + TrustStrip + BrandStory: vẽ một lần (Hero tự chia điện thoại / máy tính bằng CSS).
          BrandStory (chất liệu Lyocell) đưa lên ngay sau dải cam kết ISO: khách yêu cầu 04/11/2026 ("sau iso ấy") */}
      <Hero />
      <TrustStrip />
      <BrandStory />
      <div className="md:hidden">{isMobile !== false && <MobileHome />}</div>
      <div className="hidden md:block">{isMobile !== true && <DesktopHome />}</div>
    </>
  )
}

/** Máy tính: thứ tự gốc (sau Hero, TrustStrip, BrandStory). Khối đệm C3 ngay đầu (owner chốt 02/11/2026). Dải mạng xã hội bỏ theo mẫu C (owner duyệt 23/10/2026): biểu tượng đã có ở chân trang */
function DesktopHome() {
  return (
    <>
      <MattressPicker />
      <About moreLink />
      <BrandVideo />
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
      {/* Khối đệm C3 ngay sau phần mở đầu chung (owner chốt 02/11/2026), trước bộ sưu tập */}
      <MattressPicker />
      <Collections />
      <Essentials withTabs />
      <Reviews />
      <StoryTabs />
      <Showrooms />
      <Faq compact />
    </>
  )
}
