import { About } from '../components/home/About'
import { Collections } from '../components/home/Collections'
import { BrandVideo } from '../components/home/BrandVideo'
import { BrandStory, TrustStrip } from '../components/home/Craft'
import { Essentials } from '../components/home/Essentials'
import { Hero } from '../components/home/Hero'
import { Hospitality } from '../components/home/Hospitality'
import { MattressPicker } from '../components/home/MattressPicker'
import { Reviews } from '../components/home/Reviews'
import { Faq, Showrooms } from '../components/home/Showrooms'
import { StoryTabs } from '../components/home/StoryTabs'
import { ThankYouLetters } from '../components/home/ThankYouLetters'
import { JsonLd } from '../components/seo/JsonLd'
import { useIsMobile } from '../hooks/useIsMobile'
import { usePageMeta } from '../hooks/usePageMeta'
import { organizationLd } from '../lib/structuredData'
import { HOME_TEXT } from '../data/pageText/home'
import { Blocks } from '../components/ui/Blocks'
import { HOME_DESKTOP_ORDER, HOME_MOBILE_ORDER } from '../data/pageLayout'

/**
 * HTML dựng sẵn có cả hai bản; trình duyệt chọn bằng CSS (`md:`). Lúc dựng trên máy chủ không biết khổ màn hình,
 * nếu chỉ vẽ một bản thì máy tính sẽ đổi cây DOM sau khi gắn React (xô bố cục, lệch hydrate).
 * Gắn xong thì bỏ bản đang ẩn: trang chỉ còn một H1 và không trùng id (link #bo-suu-tap, thanh menu sáng đúng mục).
 * Bản bị bỏ vốn đang ẩn nên không xô bố cục; hai khung bọc giữ nguyên để bản đang hiện không bị vẽ lại.
 * Xem docs/ke-hoach-ssg-va-wordpress.md mục 5.
 */
export function HomePage() {
  // Mô tả chị Phương gửi 18/11/2026 (hiện dưới tiêu đề khi gửi link qua Zalo, Facebook, trên Google), trùng chữ với index.html.
  // Sửa chính tả "trãi" → "trải", thêm dấu chấm cuối câu
  usePageMeta(null, HOME_TEXT.moTaGoogle)
  const isMobile = useIsMobile()
  return (
    <>
      <JsonLd data={organizationLd()} />
      {/* Hai bản cùng mở đầu bằng Hero + TrustStrip + BrandStory: vẽ một lần (Hero tự chia điện thoại / máy tính bằng CSS).
          BrandStory (chất liệu Lyocell) đưa lên ngay sau dải cam kết ISO: khách yêu cầu 04/11/2026 ("sau iso ấy") */}
      <Hero />
      {/* Dải cam kết, Chất liệu nằm trong từng bản để Ecopillo đổi thứ tự được (Nội dung web → Bố cục trang chủ) */}
      <div className="md:hidden">{isMobile !== false && <MobileHome />}</div>
      <div className="hidden md:block">{isMobile !== true && <DesktopHome />}</div>
    </>
  )
}

/**
 * Máy tính (sau Hero, TrustStrip, BrandStory). Khối đệm C3 ngay đầu (owner chốt 02/11/2026), rồi bộ sưu tập chăn ga,
 * rồi ruột chăn gối (khách yêu cầu 05/11/2026: "đệm xong đến chăn ga xong đến nó luôn"); Về chúng tôi và phim xuống sau.
 * Dải mạng xã hội bỏ theo mẫu C (owner duyệt 23/10/2026): biểu tượng đã có ở chân trang
 */
function DesktopHome() {
  // Thứ tự gốc như trên; Ecopillo đổi ở Nội dung web → Bố cục trang chủ (máy tính), src/data/pageLayout.ts
  return (
    <Blocks
      order={HOME_DESKTOP_ORDER}
      blocks={{
        'cam-ket': <TrustStrip />,
        'chat-lieu': <BrandStory />,
        dem: <MattressPicker />,
        'bo-suu-tap': <Collections />,
        ruot: <Essentials />,
        // Mục 11 phản hồi 05/11/2026: thư cảm ơn + ưu đãi 5% thay khối Tri ân (quà kèm)
        'thu-cam-on': <ThankYouLetters />,
        've-chung-toi': <About moreLink />,
        phim: <BrandVideo />,
        'khach-san': <Hospitality />,
        'nhan-xet': <Reviews />,
        'phan-phoi': <Showrooms />,
        'hoi-dap': <Faq />,
      }}
    />
  )
}

/**
 * Điện thoại, mẫu 2 "Sản phẩm lên trước, câu chuyện xuống sau" (owner chốt 15/10/2026,
 * docs/de-xuat-thu-gon-trang-chu-mobile.html). Đủ mọi khối như máy tính, không bỏ nội dung nào:
 * chỉ đổi thứ tự và gộp bằng tab (StoryTabs; Essentials từ 09/11/2026 là hàng ô vuốt ngang), phần dài nằm sau nút "Xem thêm".
 * Phần ẩn vẫn có trong trang để Google (xếp hạng theo bản điện thoại) đọc đủ chữ.
 * Dải mạng xã hội bỏ theo mẫu C (owner duyệt 23/10/2026): còn ở chân trang, menu và thanh liên hệ đáy màn hình.
 */
function MobileHome() {
  // Khối đệm C3 ngay sau phần mở đầu chung (owner chốt 02/11/2026); thư cảm ơn đứng riêng dưới khối ruột chăn gối.
  // Ecopillo đổi thứ tự ở Nội dung web → Bố cục trang chủ (điện thoại)
  return (
    <Blocks
      order={HOME_MOBILE_ORDER}
      blocks={{
        'cam-ket': <TrustStrip />,
        'chat-lieu': <BrandStory />,
        dem: <MattressPicker />,
        'bo-suu-tap': <Collections />,
        ruot: <Essentials />,
        'thu-cam-on': <ThankYouLetters />,
        'nhan-xet': <Reviews />,
        've-ecopillo': <StoryTabs />,
        'phan-phoi': <Showrooms />,
        'hoi-dap': <Faq compact />,
      }}
    />
  )
}
