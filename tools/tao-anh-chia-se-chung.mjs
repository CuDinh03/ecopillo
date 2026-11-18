// Ảnh chia sẻ chung public/og-image.jpg (og:image mọi trang không có ảnh riêng: trang chủ, liên hệ, danh mục…).
// Dựng từ tools/anh-chia-se-chung/khung.html bằng Chrome có sẵn (Playwright channel 'chrome').
//   node tools/tao-anh-chia-se-chung.mjs <pa: a|b|c> [tệp ra, mặc định public/og-image.jpg]
// JPEG 1200×630, dưới 300 KB: Zalo, Facebook đọc chắc chắn (chị Phương 18/11/2026: gửi link phải có ảnh giới thiệu).
import { chromium } from 'playwright'
import { statSync } from 'node:fs'
import { resolve } from 'node:path'

const pa = process.argv[2]
if (!['a', 'b', 'c'].includes(pa)) {
  console.error('Cần phương án: a, b hoặc c')
  process.exit(1)
}
const out = resolve(process.argv[3] ?? 'public/og-image.jpg')
const page_ = resolve('tools/anh-chia-se-chung/khung.html')

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(`file://${page_}?pa=${pa}`)
await page.evaluate(() => document.fonts.ready)
await page.waitForLoadState('networkidle')
await page.screenshot({ path: out, type: 'jpeg', quality: 84 })
await browser.close()
console.log(`${out} · ${Math.round(statSync(out).size / 1024)} KB`)
