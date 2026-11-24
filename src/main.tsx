import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PAGE_LOADERS } from './routes'
import { liveDiffers } from './data/liveData'
import { LIVE_POSTS } from './data/livePosts'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/**
 * Trang dựng sẵn (tools/dung-san-html.mjs ghi `data-trang` lên #root): nạp xong gói của trang này rồi mới gắn React vào HTML có sẵn.
 * Gắn trước khi gói về thì React gặp trang `lazy` chưa sẵn sàng, bỏ HTML dựng sẵn và vẽ lại: chớp trắng, xô bố cục.
 * Chạy `pnpm dev` hoặc trang không dựng sẵn (#root trống) thì vẽ như cũ.
 */
const page = root.dataset.trang as keyof typeof PAGE_LOADERS | undefined
if (root.hasChildNodes()) {
  const ready = page && page in PAGE_LOADERS ? PAGE_LOADERS[page]() : Promise.resolve()
  // Ecopillo vừa sửa giá / hết hàng trong WooCommerce (liveData.ts): HTML dựng sẵn mang giá cũ, gắn vào sẽ lệch chữ.
  // Vẽ lại một lần (gói trang đã về nên không chớp trắng); bố cục giữ nguyên, chỉ số giá đổi.
  // Trang Ecopillo đã đổi link (pageAliases.ts, bộ có dòng nên liveList đã báo liveDiffers): link trong HTML dựng sẵn là link cũ, vẽ lại.
  // Bài viết Ecopillo đăng mới / sửa trong WordPress (livePosts.ts): trang Tin tức, trang bài viết dựng sẵn cũng lệch, vẽ lại
  const postsDiffer = LIVE_POSTS.length > 0 && (page === 'BlogPage' || page === 'ArticlePage')
  void ready.then(() => (liveDiffers() || postsDiffer ? createRoot(root).render(app) : hydrateRoot(root, app)))
} else {
  createRoot(root).render(app)
}
