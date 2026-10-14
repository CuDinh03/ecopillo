/**
 * Nút "lên đầu trang" (components/layout/BackToTop.tsx) có đè lên nút, link, ô nhập nào không.
 * Cuộn từng 19px qua cả trang ở khổ iPhone 13; vị trí nào nút đang hiện mà bên dưới có thứ bấm được
 * thì chờ 1,5 giây (cho hiệu ứng hiện dần chạy xong) rồi xem lại. Kết quả mong muốn: "đè 0".
 *
 *   node tools/kiem-tra-mobile/nut-len-dau-trang.mjs            (trang chủ + trang phân phối)
 *   node tools/kiem-tra-mobile/nut-len-dau-trang.mjs /lien-he /khach-san
 */
import { chromium, devices } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:5173'
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/he-thong-phan-phoi']

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ ...devices['iPhone 13'] })

for (const path of paths) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const result = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    const button = document.querySelector('[aria-label="Lên đầu trang"]')
    const lenis = window.ecoMotion?.lenis()
    const max = document.documentElement.scrollHeight - innerHeight
    const shown = () => button.className.includes('opacity-100')
    const controlUnder = () => {
      const r = button.getBoundingClientRect()
      button.style.display = 'none'
      let hit = null
      for (const x of [r.left + 6, r.left + r.width / 2, r.right - 6])
        for (const y of [r.top + 6, r.top + r.height / 2, r.bottom - 6])
          hit ??= document.elementFromPoint(x, y)?.closest('a,button,input,select,textarea,label,[role=button],[role=tab]')
      button.style.display = ''
      return hit ? hit.textContent.trim().replace(/\s+/g, ' ').slice(0, 30) || hit.tagName : null
    }
    let visible = 0
    let hidden = 0
    const covered = []
    for (let y = 950; y <= max; y += 19) {
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
      await sleep(70)
      if (shown()) visible++
      const under = controlUnder()
      if (!shown() && under) hidden++
      if (shown() && under) {
        await sleep(1500)
        const still = shown() && controlUnder()
        if (still) covered.push(`y=${Math.round(scrollY)} đè "${still}"`)
      }
    }
    return { visible, hidden, covered }
  })
  console.log(`${path}: nút hiện ${result.visible} vị trí, tự ẩn vì có nút bên dưới ${result.hidden}, đè ${result.covered.length}`)
  for (const c of result.covered.slice(0, 10)) console.log('   ', c)
}
await browser.close()
