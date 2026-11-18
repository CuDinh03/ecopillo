import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { GTM_ID, META_PIXEL_ID } from './src/data/trackingIds'

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
        // Ảnh chia sẻ chung có ?v=… (đổi ảnh thì tăng để Zalo, Facebook lấy lại): đổi cả đường dẫn lẫn đuôi
        .replace(/content="https:\/\/ecopillo\.com\.vn\/og-image\.jpg([^"]*)"/, `content="${url}/og-image.jpg$1"`)
    },
  }
}

/**
 * Bản chạy thật: chèn Google Tag Manager và Facebook Pixel như web cũ (src/data/trackingIds.ts, biên bản mục 60).
 * Bản xem thử và `pnpm dev` không chèn, để số liệu thật không lẫn lượt xem thử.
 * Chuyển trang trong web không tải lại trang: lượt xem trang tiếp theo do src/lib/tracking.ts báo.
 */
function trackingHtml(): Plugin {
  return {
    name: 'ecopillo-ma-do',
    apply: 'build',
    transformIndexHtml(html) {
      const head = `    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- Facebook Pixel -->
    <script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');</script>
  </head>`
      const body = `<body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" /></noscript>`
      if (!html.includes('</head>') || !html.includes('<body>')) throw new Error('index.html thiếu </head> hoặc <body>: không chèn được mã đo')
      return html.replace('  </head>', head).replace('<body>', body)
    },
  }
}

/** File giá (WooCommerce) và nội dung Ecopillo sửa trong WordPress, do plugin ghi (src/data/liveData.ts, liveContent.ts; gia-woo.php, noi-dung.php) */
const LIVE_PRICES_SRC = '/wp-content/uploads/ecopillo-du-lieu/du-lieu.js'

/**
 * Bản chạy thật: nạp file giá mới nhất trước gói JS chính (defer giữ thứ tự với script module).
 * Bản xem thử và `pnpm dev` không có WordPress nên không chèn.
 */
function livePricesHtml(): Plugin {
  return {
    name: 'ecopillo-gia-woo',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes('</head>')) throw new Error('index.html thiếu </head>: không chèn được file giá')
        return html.replace('</head>', `  <script defer src="${LIVE_PRICES_SRC}"></script>\n  </head>`)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Đọc cả biến môi trường của lệnh build (GitHub Actions đặt VITE_BAN_XEM_THU, XEM_THU_URL), lệnh chạy từ gốc project
  const env = loadEnv(mode, '.', '')
  const isPreview = env.VITE_BAN_XEM_THU === '1'
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isPreview ? [previewHtml(env.XEM_THU_URL || PREVIEW_URL_DEFAULT)] : [livePricesHtml(), trackingHtml()]),
    ],
    /**
     * Build cho máy chủ (dựng sẵn HTML, tools/dung-san-html.mjs). React Router để mặc định thì Node chọn bản CommonJS
     * và Vite báo "module is not defined" (lỗi gặp 15/10/2026): đóng gói nó vào luôn, và ưu tiên bản ESM ("module-sync", "import").
     */
    ssr: {
      noExternal: ['react-router', 'react-router-dom'],
      resolve: { conditions: ['module-sync', 'import', 'module', 'node', 'development|production'] },
    },
  }
})
