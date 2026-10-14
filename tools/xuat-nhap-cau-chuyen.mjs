// Xuất bản nháp câu chuyện phối màu thành một file HTML để gửi Ecopillo duyệt.
// Nguồn duy nhất: src/data/stories.ts và src/data/catalog.ts. Sửa hai file đó rồi chạy lại:
//   node tools/xuat-nhap-cau-chuyen.mjs
// Kết quả: docs/nhap-cau-chuyen-phoi-mau.html (ảnh nhúng sẵn, gửi đi một file là đủ).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = `${ROOT}docs/nhap-cau-chuyen-phoi-mau.html`

/** Chỗ ảnh và dữ liệu chưa khớp, cần Ecopillo xem khi duyệt. Khoá: `<id bộ>/<mã mẫu>` */
const REVIEW_NOTES = {
  'eco-rosa/ER16': 'Tên màu đang ghi “Lá xám bạc”, ảnh là mảng hình học xám. [XÁC NHẬN TÊN MÀU]',
  'eco-rosa/ER25': 'Tên màu đang ghi “Lá xám tro”, ảnh là ô tam giác xám. [XÁC NHẬN TÊN MÀU]',
  'eco-rosa/ER26': 'Tên màu đang ghi “Hoa hồng đào”, ảnh là gấu túi trên nền hồng. [XÁC NHẬN TÊN MÀU]',
  'eco-rosa/ER28': 'Tên màu đang ghi “Xanh biển họa tiết”, ảnh là khủng long trên nền xanh. [XÁC NHẬN TÊN MÀU]',
  'eco-rosa/ER29': 'Tên màu đang ghi “Hoa lá pastel”, ảnh là gấu bông nằm trên trăng. [XÁC NHẬN TÊN MÀU]',
  'chan-he-lyocell/ER12': 'Ảnh cũ in sẵn dòng chất liệu đã bỏ khỏi web nên tạm không hiện. [ECOPILLO GỬI ẢNH MỚI]',
}

const esc = (text) =>
  String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])

const imageData = (key) => {
  try {
    return `data:image/webp;base64,${readFileSync(`${ROOT}public/images/patterns/${key}-sm.webp`).toString('base64')}`
  } catch {
    return ''
  }
}

const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
let COLLECTIONS, stories
try {
  ;({ COLLECTIONS } = await server.ssrLoadModule('/src/data/catalog.ts'))
  stories = await server.ssrLoadModule('/src/data/stories.ts')
} finally {
  await server.close()
}

const { COLLECTION_STORIES, TONES, storyOf } = stories
const toneLabel = (id) => TONES.find((t) => t.id === id)?.label ?? ''
let total = 0
let missing = 0

const collectionBlock = (collection, order) => {
  const rows = collection.patterns
    .map((pattern, i) => {
      const story = storyOf(collection, pattern)
      total += 1
      if (!story) missing += 1
      const note = REVIEW_NOTES[`${collection.id}/${pattern.code}`]
      const image = pattern.hasImage ? imageData(pattern.imageKey ?? pattern.code) : ''
      return `<tr>
        <td class="no">${order}.${i + 1}</td>
        <td class="anh">${image ? `<img src="${image}" alt="${esc(`${collection.name} ${pattern.code}`)}" loading="lazy">` : '<span class="trong">Chưa có ảnh</span>'}
          <b>${esc(pattern.code)}</b><span>${esc(pattern.colorName)}</span></td>
        <td class="chu">${
          story
            ? `<h4>${esc(story.title)}</h4><p>${esc(story.text)}</p><p class="phu">Gam: ${esc(toneLabel(story.tone))}${story.volume ? ` · Tập: ${esc(story.volume)}` : ''}</p>`
            : '<p class="thieu">Chưa có câu chuyện: web đang hiện tên màu.</p>'
        }${note ? `<p class="luu-y">${esc(note)}</p>` : ''}</td>
        <td class="duyet"><label><input type="checkbox"> Đồng ý</label><div class="sua" contenteditable="true" aria-label="Ecopillo sửa ${esc(pattern.code)}"></div></td>
      </tr>`
    })
    .join('\n')
  return `<section>
    <h2><span>${order}</span>${esc(collection.name)} <small>${esc(collection.kindLabel)} · ${collection.patterns.length} phối màu</small></h2>
    <div class="bia"><p class="nhan">Câu chuyện chung của cả bộ (hiện ở phần bìa)</p>
      <p class="ke">${esc(COLLECTION_STORIES[collection.id] ?? 'Chưa có: web đang hiện đoạn mô tả bộ sưu tập.')}</p>
      <label><input type="checkbox"> Đồng ý</label><div class="sua" contenteditable="true" aria-label="Ecopillo sửa câu chuyện ${esc(collection.name)}"></div></div>
    <table><thead><tr><th>STT</th><th>Phối màu</th><th>Tên câu chuyện và đoạn kể (bản nháp)</th><th>Ecopillo duyệt hoặc sửa</th></tr></thead>
    <tbody>${rows}</tbody></table>
  </section>`
}

const body = COLLECTIONS.map((collection, i) => collectionBlock(collection, i + 1)).join('\n')
const today = new Date().toLocaleDateString('vi-VN')

const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bản nháp câu chuyện phối màu | Ecopillo</title>
<style>
  :root { --cham: #2d2e8d; --cham-sang: #333dba; --xanh: #d3efff; --xanh-nhat: #e9f8ff; --vang: #ffc271; --chu: rgb(45 46 141 / .8); }
  * { box-sizing: border-box; margin: 0; }
  body { font: 15px/1.55 'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', sans-serif; color: var(--cham); background: var(--xanh-nhat); }
  main { max-width: 1080px; margin: 0 auto; padding: 40px 20px 80px; }
  h1 { font: 400 2.4rem/1.1 'Noto Serif Display', Georgia, serif; }
  h1 em { color: var(--cham-sang); }
  .mo-dau { color: var(--chu); margin-top: 14px; max-width: 70ch; }
  .cach { background: #fff; border-radius: 16px; padding: 18px 22px 18px 40px; margin-top: 20px; color: var(--chu); }
  .cach li + li { margin-top: 6px; }
  section { margin-top: 44px; }
  h2 { font: 400 1.8rem/1.2 'Noto Serif Display', Georgia, serif; display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
  h2 span { font-style: italic; color: var(--cham-sang); font-size: 2.4rem; }
  h2 small { font: 400 .8rem 'Be Vietnam Pro', system-ui, sans-serif; color: var(--chu); }
  .bia { background: var(--cham); color: #fff; border-radius: 16px; padding: 18px 22px; margin-top: 14px; }
  .bia .nhan { font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; opacity: .75; }
  .bia .ke { font-size: 1.05rem; margin: 6px 0 12px; }
  .bia .sua { background: rgb(255 255 255 / .12); border-color: rgb(255 255 255 / .4); color: #fff; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 16px; overflow: hidden; margin-top: 12px; }
  th { text-align: left; background: var(--xanh); font-weight: 500; font-size: .8rem; padding: 10px 14px; }
  td { padding: 14px; vertical-align: top; border-top: 1px solid var(--xanh-nhat); }
  .no { width: 52px; color: var(--chu); font-size: .8rem; }
  .anh { width: 190px; font-size: .8rem; }
  .anh img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 10px; margin-bottom: 8px; }
  .anh b { display: block; font-weight: 500; }
  .anh span { color: var(--chu); }
  .trong { display: block; padding: 30px 0; text-align: center; background: var(--xanh-nhat); border-radius: 10px; margin-bottom: 8px; }
  .chu h4 { font: italic 400 1.35rem/1.2 'Noto Serif Display', Georgia, serif; color: var(--cham-sang); }
  .chu p { margin-top: 6px; color: var(--chu); }
  .chu .phu { font-size: .78rem; }
  .luu-y, .thieu { background: var(--vang); color: var(--cham) !important; border-radius: 8px; padding: 6px 10px; font-size: .8rem; }
  .duyet { width: 250px; font-size: .85rem; }
  .sua { min-height: 64px; margin-top: 8px; border: 1px dashed var(--cham-sang); border-radius: 10px; padding: 8px 10px; background: var(--xanh-nhat); }
  .sua:empty::before { content: 'Sửa: gõ vào đây'; opacity: .5; }
  label { display: inline-flex; gap: 6px; align-items: center; }
  @media (max-width: 760px) { thead { display: none; } tr { display: block; padding: 8px 0; } td { display: block; width: auto !important; border: 0; padding: 6px 14px; } .anh img { max-width: 260px; } }
  @media print { body { background: #fff; } main { padding: 0; } section { break-inside: auto; } tr { break-inside: avoid; } .sua:empty::before { content: ''; } }
</style></head>
<body><main>
  <h1>Bản nháp <em>câu chuyện phối màu</em></h1>
  <p class="mo-dau">Gửi Ecopillo duyệt. Xuất ngày ${esc(today)} từ dữ liệu web: ${COLLECTIONS.length} bộ sưu tập, ${total} phối màu${missing ? `, ${missing} phối màu chưa có câu chuyện` : ''}. Mỗi phối màu là một “chương” trên trang bộ sưu tập: có tên câu chuyện và một đoạn kể ngắn. Toàn bộ chữ dưới đây do bên làm web viết nháp theo ảnh mẫu, chưa phải nội dung chính thức.</p>
  <ol class="cach">
    <li>Đọc từng phối màu. Thấy được thì tích <b>Đồng ý</b>.</li>
    <li>Muốn đổi tên câu chuyện, đoạn kể, gam màu hay tập thì gõ thẳng vào ô <b>Sửa</b> bên phải.</li>
    <li>Các dòng tô vàng là chỗ ảnh và tên màu chưa khớp, hoặc cần ảnh mới: xin Quý khách xác nhận.</li>
    <li>Xong thì in trang này ra PDF (Ctrl/⌘ + P) và gửi lại. Phần đã gõ sẽ nằm trong bản in.</li>
  </ol>
  ${body}
</main></body></html>
`

writeFileSync(OUT, html)
console.log(`Đã ghi ${OUT.replace(ROOT, '')}: ${total} phối màu, ${missing} chưa có câu chuyện, ${(html.length / 1024 / 1024).toFixed(1)} MB`)
