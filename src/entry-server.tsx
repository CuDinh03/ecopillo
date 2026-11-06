/* eslint-disable react-refresh/only-export-components -- gói chỉ chạy lúc dựng sẵn HTML, không nạp nóng */
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { Routes, StaticRouter } from 'react-router-dom'
import { COLLECTIONS } from './data/catalog'
import {
  COLLECTION_BY_PATH,
  HOST_REDIRECTS,
  LISTINGS,
  PATHS,
  patternPath,
  SITE_ORIGIN,
  singleProductPath,
  withSlash,
} from './data/links'
import { POLICY_ALIASES, POLICY_PAGES, policyPath } from './data/policyNav'
import { POSTS, postPath } from './data/posts'
import { PRODUCTS } from './data/products'
import { PageMetaContext, type PrerenderCollector } from './hooks/usePageMeta'
import { appRoutes } from './routes'

/**
 * Đường link giả để dựng trang 404. Phải có từ hai tầng trở lên: một tầng (`/:slug`) đang dành cho bài viết,
 * nên `/__khong-tim-thay__/` sẽ mở ArticlePage rồi mới ra 404 — `data-trang` sai, hydrate nạp nhầm gói.
 */
export const NOT_FOUND_PATH = '/__khong-tim-thay__/trang/'

/**
 * Mọi đường link cần dựng sẵn HTML (GĐ1: trang có trong code; bài viết WordPress ở GĐ3).
 * Luôn có "/" cuối như WordPress.
 */
export function listPrerenderPaths(): string[] {
  const paths = new Set<string>()
  for (const path of Object.values(PATHS)) paths.add(withSlash(path))
  // /he-thong-phan-phoi/ từ 05/11/2026 chỉ còn 301 → /lien-he/ (HOST_REDIRECTS + DistributionPage Navigate).
  // Không dựng HTML riêng: Navigate trong StaticRouter không thay được 301 máy chủ.
  paths.delete(withSlash(PATHS.distribution))
  for (const path of COLLECTION_BY_PATH.keys()) paths.add(withSlash(path))
  for (const path of Object.keys(LISTINGS)) paths.add(withSlash(path))
  for (const collection of COLLECTIONS) {
    for (const pattern of collection.patterns) paths.add(withSlash(patternPath(collection, pattern)))
  }
  for (const product of PRODUCTS) {
    if (!product.collection) paths.add(withSlash(singleProductPath(product.slug)))
  }
  for (const page of POLICY_PAGES) paths.add(withSlash(policyPath(page.slug)))
  for (const slug of Object.keys(POLICY_ALIASES)) paths.add(withSlash(policyPath(slug)))
  for (const post of POSTS) paths.add(withSlash(postPath(post)))
  return [...paths].sort()
}

export { SITE_ORIGIN, HOST_REDIRECTS }

/**
 * Dựng sẵn HTML một trang lúc build (tools/dung-san-html.mjs gọi). Chạy đúng bộ định tuyến và component của trình duyệt.
 * `prerender` chờ các trang `lazy` tải xong rồi mới trả HTML, nên HTML có đủ nội dung trang.
 */
export async function render(url: string): Promise<PrerenderCollector & { html: string }> {
  const collected: PrerenderCollector = { meta: null, page: null }
  const { prelude } = await prerender(
    <StrictMode>
      <PageMetaContext.Provider value={collected}>
        <StaticRouter location={url}>
          <Routes>{appRoutes}</Routes>
        </StaticRouter>
      </PageMetaContext.Provider>
    </StrictMode>,
  )
  const html = await new Response(prelude).text()
  return { html, ...collected }
}
