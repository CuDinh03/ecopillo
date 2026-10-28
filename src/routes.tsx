/* eslint-disable react-refresh/only-export-components -- bảng route dùng chung cho App và entry-server, không phải component */
import { lazy, useContext, type ComponentType, type ReactNode } from 'react'
import { Navigate, Route, useLocation, useParams } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { COLLECTIONS } from './data/catalog'
import { COLLECTION_BY_PATH, LISTINGS, PATHS, redirectFor } from './data/links'
import { POLICY_ALIASES, POLICY_PAGES } from './data/policyNav'
import { PageMetaContext } from './hooks/usePageMeta'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

/**
 * Bảng đường link của cả web, dùng chung cho trình duyệt (App.tsx) và bước dựng sẵn HTML (entry-server.tsx).
 * Gói của từng trang nạp bằng `PAGE_LOADERS`: bước dựng chờ gói của trang đang dựng, trình duyệt nạp trước gói của trang
 * đang mở rồi mới gắn vào HTML có sẵn (không thì React xoá HTML dựng sẵn rồi vẽ lại: chớp trắng).
 */
/** Nạp gói một trang, trả về dạng `lazy` cần ({ default: component }) */
const loader =
  <M,>(load: () => Promise<M>, pick: (m: M) => ComponentType) =>
  (): Promise<{ default: ComponentType }> =>
    load().then((m) => ({ default: pick(m) }))

// Trang chủ tải ngay; các trang còn lại tách gói riêng, chỉ tải khi khách mở tới
export const PAGE_LOADERS = {
  OrderPage: loader(() => import('./pages/OrderPage'), (m) => m.OrderPage),
  ProductsPage: loader(() => import('./pages/ProductsPage'), (m) => m.ProductsPage),
  ProductDetailPage: loader(() => import('./pages/ProductDetailPage'), (m) => m.ProductDetailPage),
  CategoryPage: loader(() => import('./pages/CategoryPage'), (m) => m.CategoryPage),
  ContactPage: loader(() => import('./pages/ContactPage'), (m) => m.ContactPage),
  PrivacyPage: loader(() => import('./pages/PrivacyPage'), (m) => m.PrivacyPage),
  AboutPage: loader(() => import('./pages/AboutPage'), (m) => m.AboutPage),
  DistributionPage: loader(() => import('./pages/DistributionPage'), (m) => m.DistributionPage),
  RecruitPage: loader(() => import('./pages/RecruitPage'), (m) => m.RecruitPage),
  HotelPage: loader(() => import('./pages/HotelPage'), (m) => m.HotelPage),
  GiftsPage: loader(() => import('./pages/GiftsPage'), (m) => m.GiftsPage),
  FaqPage: loader(() => import('./pages/FaqPage'), (m) => m.FaqPage),
  BlogPage: loader(() => import('./pages/BlogPage'), (m) => m.BlogPage),
  ArticlePage: loader(() => import('./pages/ArticlePage'), (m) => m.ArticlePage),
  PolicyPage: loader(() => import('./pages/PolicyPage'), (m) => m.PolicyPage),
} as const

/** Trang tách gói: nạp bằng `lazy`, và báo cho bước dựng biết trang dùng gói nào (ghi vào `data-trang` của #root) */
function pageFrom(name: keyof typeof PAGE_LOADERS) {
  const Lazy = lazy(PAGE_LOADERS[name])
  return function Page() {
    const collected = useContext(PageMetaContext)
    if (collected) collected.page = name
    return <Lazy />
  }
}

const OrderPage = pageFrom('OrderPage')
const ProductsPage = pageFrom('ProductsPage')
const ProductDetailPage = pageFrom('ProductDetailPage')
const CategoryPage = pageFrom('CategoryPage')
const ContactPage = pageFrom('ContactPage')
const PrivacyPage = pageFrom('PrivacyPage')
const AboutPage = pageFrom('AboutPage')
const DistributionPage = pageFrom('DistributionPage')
const RecruitPage = pageFrom('RecruitPage')
const HotelPage = pageFrom('HotelPage')
const GiftsPage = pageFrom('GiftsPage')
const FaqPage = pageFrom('FaqPage')
const BlogPage = pageFrom('BlogPage')
const ArticlePage = pageFrom('ArticlePage')
const PolicyPage = pageFrom('PolicyPage')

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
export const appRoutes = (
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
)
