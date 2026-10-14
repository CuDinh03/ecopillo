import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { POLICY_PAGES } from './data/policyNav'
import { CATEGORIES, LEGACY_CATEGORY } from './data/products'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

// Trang chủ tải ngay; các trang còn lại tách gói riêng, chỉ tải khi khách mở tới
const OrderPage = lazy(() => import('./pages/OrderPage').then((m) => ({ default: m.OrderPage })))
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const DistributionPage = lazy(() => import('./pages/DistributionPage').then((m) => ({ default: m.DistributionPage })))
const HotelPage = lazy(() => import('./pages/HotelPage').then((m) => ({ default: m.HotelPage })))
const GiftsPage = lazy(() => import('./pages/GiftsPage').then((m) => ({ default: m.GiftsPage })))
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })))
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })))
const ArticlePage = lazy(() => import('./pages/ArticlePage').then((m) => ({ default: m.ArticlePage })))
const PolicyPage = lazy(() => import('./pages/PolicyPage').then((m) => ({ default: m.PolicyPage })))

/** /danh-muc-san-pham/<ten>/ của web cũ: mở đúng nhóm sản phẩm, không gặp trang lỗi */
function LegacyCategory() {
  const { slug = '' } = useParams()
  const id = CATEGORIES.find((c) => c.id === slug)?.id ?? LEGACY_CATEGORY[slug]
  return <Navigate to={id ? `/san-pham?danh-muc=${id}` : '/san-pham'} replace />
}

/**
 * Đường link cũ của WordPress được giữ nguyên (kế hoạch Gói 1, mục giữ đường dẫn).
 * Trang thừa của web cũ (giỏ hàng, thanh toán, tài khoản, cửa hàng) chuyển về trang gần nghĩa nhất.
 */
const REDIRECTS: Readonly<Record<string, string>> = {
  'gio-hang': '/dat-hang',
  'thanh-toan': '/dat-hang',
  'tai-khoan': '/dat-hang',
  'cua-hang': '/san-pham',
  've-chung-toi': '/gioi-thieu',
  showroom: '/he-thong-phan-phoi',
  'cau-hoi-thuong-gap': '/hoi-dap',
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="san-pham" element={<ProductsPage />} />
          <Route path="san-pham/:slug" element={<ProductDetailPage />} />
          {/* Mỗi phối màu của bộ sưu tập có link riêng, ví dụ /san-pham/eco-tera/et01 */}
          <Route path="san-pham/:slug/:mau" element={<ProductDetailPage />} />
          <Route path="danh-muc-san-pham/:slug" element={<LegacyCategory />} />
          <Route path="dat-hang" element={<OrderPage />} />
          <Route path="gioi-thieu" element={<AboutPage />} />
          <Route path="he-thong-phan-phoi" element={<DistributionPage />} />
          <Route path="khach-san" element={<HotelPage />} />
          <Route path="qua-tang" element={<GiftsPage />} />
          <Route path="hoi-dap" element={<FaqPage />} />
          <Route path="tin-tuc" element={<BlogPage />} />
          <Route path="lien-he" element={<ContactPage />} />
          <Route path="chinh-sach-bao-mat" element={<PrivacyPage />} />
          {POLICY_PAGES.map((p) => (
            <Route key={p.slug} path={p.slug} element={<PolicyPage />} />
          ))}
          {Object.entries(REDIRECTS).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          {/* Bài viết nằm ở gốc web như WordPress cũ; không khớp bài nào thì ra trang 404 */}
          <Route path=":slug" element={<ArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
