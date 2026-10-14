import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Địa chỉ bản xem thử trên Cloudflare Pages (docs/phuong-an-dua-ban-xem-thu.md) */
const PREVIEW_URL_DEFAULT = 'https://ecopillo-xem-thu.pages.dev'

/**
 * Bản xem thử: chặn Google ngay trong trang, và ảnh chia sẻ trỏ về chính bản xem thử thay vì ecopillo.com.vn.
 * Build thường không đi qua đây.
 */
function previewHtml(previewUrl: string): Plugin {
  return {
    name: 'ecopillo-ban-xem-thu',
    transformIndexHtml(html) {
      const url = previewUrl.replace(/\/$/, '')
      return html
        .replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, nofollow" />')
        .replace('content="https://ecopillo.com.vn/"', `content="${url}/"`)
        .replace('content="https://ecopillo.com.vn/og-image.jpg"', `content="${url}/og-image.jpg"`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Đọc cả biến môi trường của lệnh build (GitHub Actions đặt VITE_BAN_XEM_THU, XEM_THU_URL), lệnh chạy từ gốc project
  const env = loadEnv(mode, '.', '')
  const isPreview = env.VITE_BAN_XEM_THU === '1'
  return {
    plugins: [react(), tailwindcss(), ...(isPreview ? [previewHtml(env.XEM_THU_URL || PREVIEW_URL_DEFAULT)] : [])],
  }
})
