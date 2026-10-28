#!/usr/bin/env node
/**
 * Cổng kiểm Giai đoạn 1 SSG (docs/ke-hoach-ssg-va-wordpress.md mục 6).
 * Chạy trên bản build đã dựng sẵn: pnpm preview rồi
 *   node tools/kiem-tra-mobile/do-ssg-gd1.mjs [http://127.0.0.1:4173]
 *
 * 1) Tắt JS: HTML còn chữ / title / data-trang
 * 2) Hydrate: console không có lỗi lệch hydrate (máy tính 1440 + điện thoại 390)
 *
 * LCP trước / sau đo riêng bằng so-sanh-lcp-spa-ssg.mjs trên máy chủ HTTP/2 (may-chu-http2.mjs):
 * vite preview là HTTP/1.1 nên số LCP đo trên nó lệch, không dùng để kết luận.
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const OUT = process.env.OUT_DIR || '/tmp/ecopillo-do-ssg'
mkdirSync(OUT, { recursive: true })

/** Mẫu đủ loại trang GĐ1 */
const PAGES = [
  { path: '/', name: 'trang-chu', needles: ['Nâng niu', 'giấc mơ xanh'], expectPage: null },
  {
    path: '/san-pham/bo-chan-ga-lyocell-eco-rosa-er25/',
    name: 'er25',
    needles: ['Eco Rosa', 'ER25', 'Lyocell'],
    expectPage: 'ProductDetailPage',
  },
  { path: '/gioi-thieu/', name: 'gioi-thieu', needles: ['Giới thiệu', 'Ecopillo'], expectPage: 'AboutPage' },
  {
    path: '/danh-muc-san-pham/san-pham/',
    name: 'san-pham',
    needles: ['Sản phẩm', 'Bộ chăn ga'],
    expectPage: 'ProductsPage',
  },
  {
    path: '/danh-muc-san-pham/du-an-khach-san-nha-nghi/',
    name: 'khach-san',
    needles: ['Khách sạn', 'Ecopillo'],
    expectPage: 'HotelPage',
  },
  {
    path: '/he-thong-phan-phoi/',
    name: 'phan-phoi',
    needles: ['đại lý', 'Ecopillo'],
    expectPage: 'DistributionPage',
  },
  {
    path: '/chinh-sach-van-chuyen/',
    name: 'van-chuyen',
    needles: ['Giao hàng', 'vận chuyển'],
    expectPage: 'PolicyPage',
  },
  { path: '/vai-lyocell-la-gi/', name: 'bai-viet', needles: ['Lyocell', 'vải'], expectPage: 'ArticlePage' },
  { path: '/qua-tang/', name: 'qua-tang', needles: ['Quà', 'Ecopillo'], expectPage: 'GiftsPage' },
  { path: '/hoi-dap/', name: 'hoi-dap', needles: ['Hỏi', 'đáp'], expectPage: 'FaqPage' },
]

const HYDRATE_NOISE = [
  'Download the React DevTools',
  'third-party cookie',
  'google',
  'youtube',
  'Failed to load resource', // ảnh/font ngoài
]

function isNoise(text) {
  const t = text.toLowerCase()
  return HYDRATE_NOISE.some((n) => t.includes(n.toLowerCase()))
}

function isHydrateProblem(text) {
  return /hydrat|did not match|Minified React error #(418|423|425)/i.test(text)
}

async function checkNoJs(browser) {
  const results = []
  for (const p of PAGES) {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    const res = await page.goto(BASE + p.path, { waitUntil: 'domcontentloaded', timeout: 30000 })
    const html = await page.content()
    const title = await page.title()
    const root = await page.locator('#root').innerHTML().catch(() => '')
    const trang = await page.locator('#root').getAttribute('data-trang')
    const missing = p.needles.filter((n) => !html.includes(n) && !root.includes(n))
    const row = {
      name: p.name,
      status: res?.status() ?? 0,
      title,
      trang,
      rootLen: root.length,
      missing,
      ok: root.length > 500 && missing.length === 0 && (p.expectPage == null || trang === p.expectPage),
    }
    results.push(row)
    await context.close()
  }
  return results
}

async function checkHydrate(browser, viewport) {
  const results = []
  for (const p of PAGES) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: viewport.width < 800 ? 2 : 1,
    })
    const page = await context.newPage()
    const consoleMsgs = []
    const pageErrors = []
    page.on('console', (m) => {
      if (!['error', 'warning'].includes(m.type())) return
      const text = m.text()
      if (isNoise(text)) return
      consoleMsgs.push({ type: m.type(), text: text.slice(0, 300) })
    })
    page.on('pageerror', (e) => pageErrors.push(e.message.slice(0, 300)))

    await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1200)
    // Đợi React gắn xong: #root vẫn còn nội dung (không bị xoá trắng)
    const rootLen = await page.locator('#root').evaluate((el) => el.innerHTML.length)
    const hydrateHits = [...consoleMsgs, ...pageErrors.map((t) => ({ type: 'pageerror', text: t }))].filter((m) =>
      isHydrateProblem(m.text),
    )
    results.push({
      name: p.name,
      viewport: `${viewport.width}x${viewport.height}`,
      rootLen,
      console: consoleMsgs,
      pageErrors,
      hydrateHits,
      ok: hydrateHits.length === 0 && rootLen > 500,
    })
    await context.close()
  }
  return results
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const report = { base: BASE, at: new Date().toISOString() }

console.log('1) Tắt JavaScript…')
report.noJs = await checkNoJs(browser)
for (const r of report.noJs) {
  console.log(
    `  ${r.ok ? 'OK' : 'LOI'} ${r.name}: title="${r.title}" trang=${r.trang} root=${r.rootLen}` +
      (r.missing.length ? ` thiếu=${r.missing.join('|')}` : ''),
  )
}

console.log('2) Hydrate máy tính 1440…')
report.hydrateDesktop = await checkHydrate(browser, { width: 1440, height: 900 })
for (const r of report.hydrateDesktop) {
  console.log(
    `  ${r.ok ? 'OK' : 'LOI'} ${r.name}: hydrate=${r.hydrateHits.length} console=${r.console.length} pageErr=${r.pageErrors.length}`,
  )
  for (const h of r.hydrateHits) console.log(`    !! ${h.text}`)
  for (const c of r.console.slice(0, 3)) console.log(`    · ${c.type}: ${c.text}`)
}

console.log('3) Hydrate điện thoại 390…')
report.hydrateMobile = await checkHydrate(browser, { width: 390, height: 844 })
for (const r of report.hydrateMobile) {
  console.log(
    `  ${r.ok ? 'OK' : 'LOI'} ${r.name}: hydrate=${r.hydrateHits.length} console=${r.console.length} pageErr=${r.pageErrors.length}`,
  )
  for (const h of r.hydrateHits) console.log(`    !! ${h.text}`)
}

await browser.close()

const outFile = join(OUT, 'bao-cao-ssg-gd1.json')
writeFileSync(outFile, JSON.stringify(report, null, 2))

const noJsFail = report.noJs.filter((r) => !r.ok).length
const hydFail =
  report.hydrateDesktop.filter((r) => !r.ok).length + report.hydrateMobile.filter((r) => !r.ok).length
console.log(`\nTóm tắt: noJS lỗi ${noJsFail}/${report.noJs.length} · hydrate lỗi ${hydFail}/${report.hydrateDesktop.length + report.hydrateMobile.length}`)
console.log(`Chi tiết: ${outFile}`)
if (noJsFail || hydFail) process.exit(1)
