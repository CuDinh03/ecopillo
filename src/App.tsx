import { lazy, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { COLLECTIONS } from './data/catalog'
import { COLLECTION_BY_PATH, LISTINGS, PATHS, redirectFor } from './data/links'
import { POLICY_ALIASES, POLICY_PAGES } from './data/policyNav'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

// Trang chủ tải ngay; các trang còn lại tách gói riêng, chỉ tải khi khách mở tới
const OrderPage = lazy(() => import('./pages/OrderPage').then((m) => ({ default: m.OrderPage })))
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const DistributionPage = lazy(() => import('./pages/DistributionPage').then((m) => ({ default: m.DistributionPage })))
const RecruitPage = lazy(() => import('./pages/RecruitPage').then((m) => ({ default: m.RecruitPage })))
const HotelPage = lazy(() => import('./pages/HotelPage').then((m) => ({ default: m.HotelPage })))
const GiftsPage = lazy(() => import('./pages/GiftsPage').then((m) => ({ default: m.GiftsPage })))
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })))
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })))
const ArticlePage = lazy(() => import('./pages/ArticlePage').then((m) => ({ default: m.ArticlePage })))
const PolicyPage = lazy(() => import('./pages/PolicyPage').then((m) => ({ default: m.PolicyPage })))

/** Đường link trong router không có dấu "/" ở hai đầu; React Router nhận cả link có và không có "/" cuối */
const route = (path: string) => path.replace(/^\/|\/$/g, '')

/**
 * Link không có trang riêng: tra bảng chuyển hướng (src/data/links.ts), không có thì ra trang 404.
 * Đây chỉ là chuyển hướng trên trình duyệt cho bản chạy thử; bản thật phải đặt 301 ở máy chủ theo cùng bảng.
 */
function RedirectOrNotFound() {
  const { pathname, search, hash } = useLocation()
  const to = redirectFor(pathname, COLLECTIONS)
  return to ? <Navigate to={`${to}${search}${hash}`} replace /> : <NotFoundPage />
}

/**
 * Link nằm trong bảng chuyển hướng thì chuyển, không thì mở trang `page`.
 * Trang bộ sưu tập và trang từng phối màu cùng bọc một kiểu, để đổi chương (đổi link) không dựng lại trang.
 */
function RedirectOr({ page }: { page: ReactNode }) {
  const { pathname } = useLocation()
  return redirectFor(pathname, COLLECTIONS) ? <RedirectOrNotFound /> : page
}

/** Bài viết nằm ở gốc web như WordPress cũ */
function Article() {
  const { slug = '' } = useParams()
  return <ArticlePage key={slug} />
}

/**
 * Đường link GIỮ ĐÚNG NHƯ WEB CŨ (owner chốt 15/10/2026). Bảng đường link và lý do: src/data/links.ts,
 * docs/giu-link-web-cu.md. Đổi xong chạy node tools/kiem-tra-link-cu.mjs.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          {/* Sản phẩm: trang danh mục "Sản phẩm", bộ sưu tập, danh mục nhỏ, trang từng sản phẩm của web cũ */}
          <Route path={route(PATHS.products)} element={<ProductsPage />} />
          {[...COLLECTION_BY_PATH.keys()].map((path) => (
            <Route key={path} path={route(path)} element={<RedirectOr page={<ProductDetailPage />} />} />
          ))}
          {Object.keys(LISTINGS).map((path) => (
            <Route key={path} path={route(path)} element={<CategoryPage />} />
          ))}
          <Route path="san-pham/:slug" element={<RedirectOr page={<ProductDetailPage />} />} />
          <Route path={route(PATHS.hotel)} element={<HotelPage />} />
          <Route path={route(PATHS.blog)} element={<BlogPage />} />
          <Route path={route(PATHS.about)} element={<AboutPage />} />
          <Route path={route(PATHS.contact)} element={<ContactPage />} />
          <Route path={route(PATHS.recruit)} element={<RecruitPage />} />
          <Route path={route(PATHS.privacy)} element={<PrivacyPage />} />
          {[...POLICY_PAGES.map((p) => p.slug), ...Object.keys(POLICY_ALIASES)].map((slug) => (
            <Route key={slug} path={slug} element={<PolicyPage />} />
          ))}
          {/* Trang mới, web cũ không có */}
          <Route path={route(PATHS.order)} element={<OrderPage />} />
          <Route path={route(PATHS.distribution)} element={<DistributionPage />} />
          <Route path={route(PATHS.gifts)} element={<GiftsPage />} />
          <Route path={route(PATHS.faq)} element={<FaqPage />} />
          <Route path=":slug" element={<RedirectOr page={<Article />} />} />
          <Route path="*" element={<RedirectOrNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
