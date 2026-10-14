/**
 * Kiểm một trang trên điện thoại (390, 360, 320px) bằng Chrome có sẵn trên máy.
 * Đo: tràn ngang, lỗi console, request hỏng, ảnh hỏng, link #mục trỏ sai, nút/link nhỏ,
 * chữ bị cắt, chữ < 12px, ảnh quá lớn so với ô, CLS, LCP. Chụp màn hình đầu và cả trang theo từng khung.
 *
 *   pnpm dev   (chạy trước, cổng 5173)
 *   node tools/kiem-tra-mobile/kiem-tra-trang.mjs / /duong/dan/thu-muc-ra
 *   node tools/kiem-tra-mobile/kiem-tra-trang.mjs /he-thong-phan-phoi /duong/dan/ra http://localhost:4173
 *
 * Kết quả: <thư mục ra>/report.json, first-<khổ>.png, khung-390-NN.png (ghép xem nhanh: ghep-anh.py).
 * Để thư mục ra ở ngoài project (thư mục tạm của phiên), đừng để trong src/ hay public/.
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

const [path = '/', outDir = './kiem-tra-ra', base = 'http://localhost:5173'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })

const VIEWPORTS = [
  { name: '390', ...devices['iPhone 13'] },
  { name: '360', ...devices['Galaxy S9+'], viewport: { width: 360, height: 740 } },
  { name: '320', ...devices['iPhone SE'], viewport: { width: 320, height: 568 } },
]

/** Thông báo console không phải lỗi của web: khung YouTube nhúng thỉnh thoảng xin quyền compute-pressure */
const KNOWN_NOISE = ['compute-pressure']

/** Cuộn tới y, đi qua Lenis nếu đang bật (cuộn thường bị Lenis kéo lại) */
const scrollTo = (page, y) =>
  page.evaluate((y) => {
    const lenis = window.ecoMotion?.lenis()
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo(0, y)
  }, y)

/** Cuộn chậm hết trang để khối "hiện dần" hiện ra và ảnh lười tải xong */
async function warmUp(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 300) {
    await scrollTo(page, y)
    await page.waitForTimeout(110)
  }
  await page.waitForTimeout(1500)
}

function audit() {
  const vw = innerWidth
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity !== 0
  }
  const label = (el) =>
    `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || el.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 40)}"`
  // Tên khối để biết chỗ: đầu trang / chân trang trước, rồi tới khối có id (bỏ qua #root, #noi-dung của khung trang)
  const section = (el) =>
    el.closest('header, footer')?.tagName.toLowerCase() ??
    el.closest('[id]:not(#root):not(#noi-dung)')?.id ??
    el.closest('section')?.getAttribute('aria-labelledby') ??
    '?'

  const wide = []
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue
    const r = el.getBoundingClientRect()
    const insideScroller = el.closest('[class*="overflow-x"], .m-rail, [class*="overflow-hidden"], .leaflet-container, [aria-hidden="true"]')
    if ((r.right > vw + 1 || r.left < -1) && !insideScroller) wide.push(`${section(el)} › ${label(el)}`)
  }

  const small = []
  for (const el of document.querySelectorAll('a[href], button, [role="tab"], input, select, summary')) {
    if (!visible(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 && r.height < 2) continue // link "Bỏ qua tới nội dung" chỉ hiện khi bấm Tab
    if (r.height < 32 || r.width < 32) small.push(`${section(el)} › ${label(el)} ${Math.round(r.width)}×${Math.round(r.height)}`)
  }

  const clipped = []
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,span,a,button,li,label')) {
    if (!visible(el) || el.children.length > 2 || el.matches('a[href="#noi-dung"]')) continue
    const s = getComputedStyle(el)
    const hides = s.overflow === 'hidden' || s.textOverflow === 'ellipsis' || s.overflowX === 'hidden' || s.webkitLineClamp !== 'none'
    if (hides && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)) clipped.push(`${section(el)} › ${label(el)}`)
  }

  const tiny = {}
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ')
    const size = parseFloat(getComputedStyle(el).fontSize)
    if (own && size < 12) (tiny[`${size}px`] ??= []).push(`${section(el)} › "${own.slice(0, 30)}"`)
  }

  const imgs = [...document.querySelectorAll('img')]
  const anchors = [...new Set([...document.querySelectorAll('a[href*="#"]')].map((a) => a.getAttribute('href').split('#')[1]).filter(Boolean))]

  return {
    overflow: document.documentElement.scrollWidth - vw,
    wide: wide.slice(0, 20),
    small,
    clipped,
    tiny: Object.fromEntries(Object.entries(tiny).map(([k, v]) => [k, { count: v.length, eg: v.slice(0, 6) }])),
    brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0 && visible(i)).map((i) => i.currentSrc || i.src),
    missingAlt: imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.src),
    // Ảnh tải về rộng hơn 2,2 lần chỗ cần (đã tính mật độ điểm ảnh). naturalWidth của ảnh có srcset đã chia mật độ.
    oversized: imgs
      .filter((i) => visible(i) && i.naturalWidth > 0 && !i.srcset)
      .filter((i) => i.naturalWidth > i.getBoundingClientRect().width * devicePixelRatio * 2.2 && i.naturalWidth > 900)
      .map((i) => `${(i.currentSrc || i.src).split('/').pop()} ${i.naturalWidth}px cho ô ${Math.round(i.getBoundingClientRect().width)}px`),
    missingAnchors: anchors.filter((id) => !document.getElementById(id)),
    sections: [...document.querySelectorAll('main section')].filter((s) => s.id || s.getAttribute('aria-labelledby')).map((s) => `${s.id || s.getAttribute('aria-labelledby')} ${Math.round(s.getBoundingClientRect().height)}px`),
    pageHeight: document.documentElement.scrollHeight,
    cls: +window.__cls.toFixed(3),
    lcp: window.__lcp,
    lcpElement: window.__lcpEl,
  }
}

const browser = await chromium.launch({ channel: 'chrome' })
const report = {}
for (const { name, ...options } of VIEWPORTS) {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  const consoleErrors = new Set()
  const failed = new Set()
  page.on('console', (m) => {
    if (!['error', 'warning'].includes(m.type()) || KNOWN_NOISE.some((n) => m.text().includes(n))) return
    consoleErrors.add(`${m.type()}: ${m.text().slice(0, 200)}`)
  })
  page.on('pageerror', (e) => consoleErrors.add(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => !r.url().includes('youtube') && failed.add(`${r.failure()?.errorText} ${r.url()}`))
  page.on('response', (r) => r.status() >= 400 && failed.add(`${r.status()} ${r.url()}`))
  await page.addInitScript(() => {
    window.__cls = 0
    window.__lcp = 0
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((list) => {
      const e = list.getEntries().at(-1)
      window.__lcp = Math.round(e.startTime)
      window.__lcpEl = `${e.element?.tagName} ${e.element?.currentSrc ?? ''}`
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  })

  await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await warmUp(page)
  report[name] = { ...(await page.evaluate(audit)), consoleErrors: [...consoleErrors], failed: [...failed] }

  await scrollTo(page, 0)
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${outDir}/first-${name}.png` })

  if (name === '390') {
    // Chụp theo khung nhìn, chồng nhau 60px, để thấy cả thanh liên hệ dưới đáy đè lên đâu
    const total = report[name].pageHeight
    const step = options.viewport.height - 60
    for (let y = 0, i = 0; y < total; y += step, i++) {
      await scrollTo(page, y)
      await page.waitForTimeout(350)
      await page.screenshot({ path: `${outDir}/khung-390-${String(i).padStart(2, '0')}.png` })
    }
  }
  await context.close()
}
await browser.close()

writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1))
for (const [name, r] of Object.entries(report)) {
  console.log(
    `${name}px: tràn ${r.overflow}px · CLS ${r.cls} · LCP ${r.lcp}ms · console ${r.consoleErrors.length} · request hỏng ${r.failed.length}` +
      ` · ảnh hỏng ${r.brokenImages.length} · #mục sai ${r.missingAnchors.length} · nút nhỏ ${r.small.length} · chữ bị cắt ${r.clipped.length}`,
  )
}
console.log(`Chi tiết: ${outDir}/report.json`)
