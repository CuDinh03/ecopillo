#!/usr/bin/env node
/**
 * So LCP trước / sau dựng sẵn HTML trên CÙNG một máy chủ, cùng điều kiện mạng.
 * Hai bản build giống hệt nhau, chỉ khác HTML: bản SPA dùng khuôn index.html root trống.
 *
 *   node tools/kiem-tra-mobile/so-sanh-lcp-spa-ssg.mjs <url-spa> <url-ssg> [số-lần]
 *
 * Nên phục vụ hai bản bằng tools/kiem-tra-mobile/may-chu-http2.mjs (HTTP/2 như Cloudflare).
 * vite preview là HTTP/1.1: 6 kết nối, ảnh ưu tiên cao phải tranh với gói JS, LCP bản dựng sẵn bị thiệt.
 *
 * Mỗi lần đo chạy xen kẽ SPA rồi SSG để hai bên chịu cùng độ nhiễu của máy.
 * Điện thoại giả lập Pixel 7, 1,6 Mbps, trễ 150ms, CPU ×4 (cách đo nhật ký 24/10).
 */
import { chromium, devices } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [SPA, SSG] = [process.argv[2], process.argv[3]].map((u) => (u || '').replace(/\/$/, ''))
const RUNS = Number(process.argv[4] || 3)
const OUT = process.env.OUT_DIR || '/tmp/ecopillo-do-ssg'
if (!SPA || !SSG) {
  console.error('Cần 2 địa chỉ: <url-spa> <url-ssg>')
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })

// CHI_DUONG=/gioi-thieu/ để chỉ đo các link có chứa chuỗi đó
const PATHS = [
  '/',
  '/gioi-thieu/',
  '/danh-muc-san-pham/du-an-khach-san-nha-nghi/',
  '/danh-muc-san-pham/san-pham/',
  '/san-pham/bo-chan-ga-lyocell-eco-rosa-er25/',
].filter((p) => !process.env.CHI_DUONG || p.includes(process.env.CHI_DUONG))

// CDP nhận byte/giây: 1,6 Mbps ≈ 209 715 B/s
const THROUGHPUT = Math.round((1.6 * 1024 * 1024) / 8)

async function measureOnce(browser, url) {
  const context = await browser.newContext({
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 },
    // máy chủ HTTP/2 tạm (may-chu-http2.mjs) dùng chứng chỉ tự ký
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: THROUGHPUT,
    uploadThroughput: THROUGHPUT,
    latency: 150,
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.addInitScript(() => {
    window.__lcp = 0
    window.__lcpEl = ''
    window.__cls = 0
    new PerformanceObserver((list) => {
      const e = list.getEntries().at(-1)
      window.__lcp = Math.round(e.startTime)
      window.__lcpEl = `${e.element?.tagName || ''} ${(e.element?.currentSrc || e.url || '').split('/').pop().slice(0, 60)}`
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto(url, { waitUntil: 'load', timeout: 120000 })
  // Bản SPA: sự kiện load bắn trước khi React vẽ ảnh chính, chờ ngắn thì bỏ sót LCP thật (ER25 đo nhầm 2,0s).
  // Chờ tới khi LCP đứng yên 5 giây, tối đa 25 giây (ảnh bìa có thể về sau chữ tới 3–4 giây).
  await page.waitForFunction(
    () => {
      const now = performance.now()
      if (window.__lcpSeen !== window.__lcp) {
        window.__lcpSeen = window.__lcp
        window.__lcpSeenAt = now
      }
      return now - (window.__lcpSeenAt || 0) > 5000
    },
    null,
    { polling: 250, timeout: 25000 },
  ).catch(() => {})
  const m = await page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]
    return {
      lcp: window.__lcp,
      lcpEl: window.__lcpEl,
      fcp: fcp ? Math.round(fcp.startTime) : 0,
      cls: +window.__cls.toFixed(3),
    }
  })
  await context.close()
  return m
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}
const sec = (ms) => (ms / 1000).toFixed(2) + 's'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const report = []
for (const path of PATHS) {
  const spa = []
  const ssg = []
  for (let i = 0; i < RUNS; i++) {
    spa.push(await measureOnce(browser, SPA + path))
    ssg.push(await measureOnce(browser, SSG + path))
  }
  const row = {
    path,
    spa: { lcp: median(spa.map((s) => s.lcp)), fcp: median(spa.map((s) => s.fcp)), cls: Math.max(...spa.map((s) => s.cls)), el: spa.at(-1).lcpEl },
    ssg: { lcp: median(ssg.map((s) => s.lcp)), fcp: median(ssg.map((s) => s.fcp)), cls: Math.max(...ssg.map((s) => s.cls)), el: ssg.at(-1).lcpEl },
    samples: { spa, ssg },
  }
  report.push(row)
  console.log(
    `${path}\n  SPA: LCP ${sec(row.spa.lcp)} FCP ${sec(row.spa.fcp)} CLS ${row.spa.cls} (${row.spa.el})` +
      `\n  SSG: LCP ${sec(row.ssg.lcp)} FCP ${sec(row.ssg.fcp)} CLS ${row.ssg.cls} (${row.ssg.el})`,
  )
}
await browser.close()
const outFile = join(OUT, 'so-sanh-lcp-spa-ssg.json')
writeFileSync(outFile, JSON.stringify({ at: new Date().toISOString(), spa: SPA, ssg: SSG, runs: RUNS, report }, null, 2))
console.log(`\nTrung vị ${RUNS} lần. Chi tiết: ${outFile}`)
