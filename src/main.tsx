import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PAGE_LOADERS } from './routes'

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
  void ready.then(() => hydrateRoot(root, app))
} else {
  createRoot(root).render(app)
}
