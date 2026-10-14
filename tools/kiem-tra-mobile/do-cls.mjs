/**
 * Tìm đúng phần tử gây xô lệch bố cục (CLS) trên điện thoại (390, 360, 320px), bằng Chrome có sẵn trên máy.
 * Mỗi lần xô in ra: lúc nào, điểm bao nhiêu, phần tử nào, dời từ đâu tới đâu.
 *
 * CLS ở web này lúc có lúc không vì tuỳ gói trang con và font web về sớm hay muộn. Muốn lỗi hiện ra mọi lần
 * thì ép cho về muộn:
 *   TRE_TRANG=400   gói trang con (lazy() trong src/App.tsx) về muộn 400ms: thấy khung chờ và chân trang
 *   TRE_FONT=1200   font Google về muộn 1200ms: thấy chữ đổi từ font máy sang font web
 *
 *   pnpm dev   (chạy trước, cổng 5173)
 *   node tools/kiem-tra-mobile/do-cls.mjs /san-pham /gioi-thieu
 *   TRE_FONT=1200 TRE_TRANG=400 node tools/kiem-tra-mobile/do-cls.mjs /san-pham
 *   LAN=3 BASE=http://localhost:4173 node tools/kiem-tra-mobile/do-cls.mjs /san-pham      (bản build, mỗi khổ 3 lần)
 *
 * NGUONG=0.01 (mặc định): chỉ in chi tiết những lần xô từ mức này trở lên.
 */
import { chromium, devices } from 'playwright'

const paths = process.argv.slice(2)
if (paths.length === 0) paths.push('/')
const base = process.env.BASE ?? 'http://localhost:5173'
const runs = Number(process.env.LAN ?? 1)
const threshold = Number(process.env.NGUONG ?? 0.01)
const fontDelay = Number(process.env.TRE_FONT ?? 0)
const pageDelay = Number(process.env.TRE_TRANG ?? 0)

const VIEWPORTS = [
  { name: '390', ...devices['iPhone 13'] },
  { name: '360', ...devices['Galaxy S9+'], viewport: { width: 360, height: 740 } },
  { name: '320', ...devices['iPhone SE'], viewport: { width: 320, height: 568 } },
]

/** Gói trang con: máy chủ dev trả /src/pages/..., bản build trả /assets/<Tên>Page-<mã>.js */
const PAGE_CHUNK = /\/src\/pages\/|\/assets\/.*Page-.*\.js/
const WEB_FONT = /fonts\.gstatic\.com/

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const delayed = (ms) => async (route) => {
  await wait(ms)
  await route.continue()
}

/** Cuộn tới y, đi qua Lenis nếu đang bật (cuộn thường bị Lenis kéo lại) */
const scrollTo = (page, y) =>
  page.evaluate((y) => {
    const lenis = window.ecoMotion?.lenis()
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo(0, y)
  }, y)

/** Cuộn chậm hết trang, giống kiem-tra-trang.mjs, để bắt cả những lần xô khi ảnh lười và khối "hiện dần" hiện ra */
async function warmUp(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 300) {
    await scrollTo(page, y)
    await page.waitForTimeout(110)
  }
  await page.waitForTimeout(1500)
}

/** Chạy trong trang, trước mọi script của web: ghi từng lần xô kèm phần tử gây ra */
function recordShifts() {
  window.__shifts = []
  const describe = (node) => {
    const el = node?.nodeType === 1 ? node : node?.parentElement
    if (!el) return '(phần tử đã bị gỡ)'
    const where =
      el.closest('header, footer')?.tagName.toLowerCase() ??
      el.closest('[id]:not(#root):not(#noi-dung)')?.id ??
      el.closest('section')?.getAttribute('aria-labelledby') ??
      'main'
    const cls = String(el.className?.baseVal ?? el.className).slice(0, 60)
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)
    return `${where} › ${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${cls} "${text}"`
  }
  const rect = (a, b) => `y ${Math.round(a.y)}→${Math.round(b.y)}, x ${Math.round(a.x)}→${Math.round(b.x)}, cao ${Math.round(a.height)}→${Math.round(b.height)}`
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue
      window.__shifts.push({
        time: Math.round(entry.startTime),
        value: entry.value,
        scrollY: Math.round(scrollY),
        fonts: document.fonts.status,
        sources: entry.sources.map((s) => `${describe(s.node)} [${rect(s.previousRect, s.currentRect)}]`),
      })
    }
  }).observe({ type: 'layout-shift', buffered: true })
}

const browser = await chromium.launch({ channel: 'chrome' })
let worst = 0
for (const path of paths) {
  for (const { name, ...options } of VIEWPORTS) {
    for (let run = 1; run <= runs; run++) {
      const context = await browser.newContext(options)
      const page = await context.newPage()
      if (fontDelay) await page.route(WEB_FONT, delayed(fontDelay))
      if (pageDelay) await page.route(PAGE_CHUNK, delayed(pageDelay))
      await page.addInitScript(recordShifts)

      await page.goto(base + path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(800)
      await warmUp(page)

      const shifts = await page.evaluate(() => window.__shifts)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      const cls = shifts.reduce((sum, s) => sum + s.value, 0)
      worst = Math.max(worst, cls)
      console.log(`${path} · ${name}px · lần ${run}: CLS ${cls.toFixed(3)} · tràn ${overflow}px · ${shifts.length} lần xô`)
      for (const s of shifts.filter((s) => s.value >= threshold)) {
        console.log(`   lúc ${s.time}ms · ${s.value.toFixed(4)} · cuộn ${s.scrollY}px · font ${s.fonts}`)
        for (const source of s.sources) console.log(`      ${source}`)
      }
      await context.close()
    }
  }
}
await browser.close()
console.log(`CLS lớn nhất: ${worst.toFixed(3)}${fontDelay || pageDelay ? ` (ép muộn: font ${fontDelay}ms, gói trang ${pageDelay}ms)` : ''}`)
