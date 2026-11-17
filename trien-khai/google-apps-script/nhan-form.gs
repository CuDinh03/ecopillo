/**
 * Nhận đơn hàng và tin nhắn từ web Ecopillo: ghi vào Google Trang tính này và gửi email báo.
 * Chỉ hàm Cloudflare trien-khai/xem-thu/functions/api/gui.js (bản xem thử) gọi vào đây (owner duyệt Q3 ngày 25/10/2026).
 * Web thật KHÔNG dùng file này: đơn chỉ lưu trong WordPress (mục Đơn web) + email Ecopillo, không gửi sang Google
 * (owner 18/11/2026: không để dữ liệu Ecopillo lọt ra ngoài): trien-khai/wordpress-plugin/ecopillo-giao-dien-moi/nhan-form.php.
 * Chạy bằng tài khoản Google của Ecopillo, nên email đi từ chính Gmail đó (không cần máy chủ thư).
 *
 * CÁCH DỰNG (làm một lần, bằng tài khoản Gmail của Ecopillo):
 *  1. Tạo một Google Trang tính mới, đặt tên ví dụ "Đơn hàng và tin nhắn web".
 *  2. Tiện ích mở rộng → Apps Script. Xoá chữ có sẵn, dán toàn bộ file này vào, bấm Lưu.
 *  3. Cài đặt dự án (bánh răng) → Thuộc tính tập lệnh → thêm:
 *       KHOA        một chuỗi bí mật dài (ví dụ 40 ký tự ngẫu nhiên). Giống hệt GOOGLE_SCRIPT_KHOA bên Cloudflare
 *       EMAIL_NHAN  email nhận báo, nhiều email cách nhau bằng dấu phẩy
 *  4. Chọn hàm `thuGuiEmail` rồi bấm Chạy: Google hỏi quyền (ghi trang tính, gửi email) → cho phép.
 *     Kiểm hộp thư EMAIL_NHAN có thư thử.
 *  5. Triển khai → Tùy chọn triển khai mới → loại "Ứng dụng web":
 *       Thực thi với tư cách: Tôi.  Người có quyền truy cập: Bất kỳ ai.
 *     Chép link kết thúc bằng /exec. Đặt nó vào GOOGLE_SCRIPT_URL bên Cloudflare.
 *     "Bất kỳ ai" là cần thiết để Cloudflare gọi được; ai không có KHOA thì bị từ chối.
 *  6. Sửa file này sau đó: Triển khai → Quản lý các bản triển khai → sửa → Phiên bản mới (giữ nguyên link).
 *
 * Trang tính tự tạo hai trang "Đơn hàng" và "Tin nhắn" khi có dòng đầu tiên. Cột "Trạng thái" để nhân viên ghi
 * đã gọi / đã giao; đổi tên cột hay chèn cột thêm ở bên phải thì được, đừng đổi thứ tự các cột có sẵn.
 */

const SHEET_ORDERS = 'Đơn hàng'
const SHEET_MESSAGES = 'Tin nhắn'

const ORDER_HEADERS = [
  'Thời gian', 'Mã đơn', 'Trạng thái', 'Họ tên', 'Điện thoại', 'Tỉnh/thành', 'Địa chỉ', 'Ghi chú',
  'Nhóm', 'Sản phẩm', 'Mẫu / chi tiết', 'Kích thước', 'Số lượng', 'Đơn giá', 'Tạm tính', 'Phí giao', 'Tổng',
  'Quà kèm', 'Trang gửi', 'Nguồn',
]
const MESSAGE_HEADERS = ['Thời gian', 'Trạng thái', 'Chủ đề', 'Họ tên', 'Điện thoại', 'Nội dung', 'Trang gửi', 'Nguồn']

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}')
    const props = PropertiesService.getScriptProperties()
    if (!props.getProperty('KHOA') || data.khoa !== props.getProperty('KHOA')) return reply({ ok: false, loi: 'khoa' })

    const lock = LockService.getScriptLock()
    lock.waitLock(20000)
    try {
      if (data.loai === 'don-hang') return reply(saveOrder(data, props))
      if (data.loai === 'tin-nhan') return reply(saveMessage(data, props))
      return reply({ ok: false, loi: 'loai' })
    } finally {
      lock.releaseLock()
    }
  } catch (error) {
    console.error(error)
    return reply({ ok: false, loi: 'loi-may' })
  }
}

/** Mở link /exec trên trình duyệt để biết Apps Script đang chạy (không lộ dữ liệu) */
function doGet() {
  return reply({ ok: true, dichVu: 'nhan-form Ecopillo' })
}

function saveOrder(d, props) {
  const k = d.khach || {}
  const h = d.hang || {}
  const t = d.tien || {}
  const ma = nextOrderCode(props)
  const source = d.xemThu ? 'XEM THỬ' : 'Web'
  const row = [
    new Date(), ma, d.xemThu ? 'Thử, bỏ qua' : 'Mới', k.ten, k.sdt, k.tinh, k.diaChi, k.ghiChu,
    h.nhom, h.ten, h.chiTiet, h.kichThuoc, h.soLuong, h.donGia, t.tamTinh, t.phiGiao, t.tong,
    h.qua, d.trang, source,
  ]
  sheet(SHEET_ORDERS, ORDER_HEADERS).appendRow(row.map(safeCell))

  const price = t.baoGiaKhiGoi || !t.tong ? 'Báo giá khi gọi xác nhận' : vnd(t.tong)
  const lines = [
    ['Mã đơn', ma],
    ['Khách', `${k.ten} · ${k.sdt}`],
    ['Giao tới', `${k.diaChi}, ${k.tinh}`],
    ['Ghi chú', k.ghiChu || '(không)'],
    ['Hàng', `${h.nhom}: ${h.ten}`],
    ['Mẫu / chi tiết', h.chiTiet],
    ['Kích thước', h.kichThuoc || '(không)'],
    ['Số lượng', `${h.soLuong} ${h.donVi || ''}`],
    ['Đơn giá', h.donGia ? vnd(h.donGia) : 'Báo khi gọi'],
    ['Phí giao', t.phiGiao ? vnd(t.phiGiao) : 'Miễn phí / chưa tính'],
    ['Tổng (khách thấy trên web)', price],
    ['Quà kèm', h.qua || '(không)'],
    ['Trang gửi', d.trang],
  ]
  sendMail(props, `${d.xemThu ? '[XEM THỬ] ' : ''}Đơn web ${ma} · ${h.ten} · ${k.sdt}`, 'Đơn hàng mới từ web. Gọi xác nhận cho khách.', lines)
  return { ok: true, ma: ma }
}

function saveMessage(d, props) {
  const row = [new Date(), d.xemThu ? 'Thử, bỏ qua' : 'Mới', d.chuDe, d.ten, d.sdt, d.noiDung, d.trang, d.xemThu ? 'XEM THỬ' : 'Web']
  sheet(SHEET_MESSAGES, MESSAGE_HEADERS).appendRow(row.map(safeCell))
  const lines = [
    ['Chủ đề', d.chuDe],
    ['Khách', `${d.ten} · ${d.sdt}`],
    ['Nội dung', d.noiDung],
    ['Trang gửi', d.trang],
  ]
  sendMail(props, `${d.xemThu ? '[XEM THỬ] ' : ''}Tin nhắn web · ${d.chuDe} · ${d.sdt}`, 'Tin nhắn mới từ web. Gọi lại cho khách.', lines)
  return { ok: true, ma: '' }
}

/** Mã đơn EP-NGÀYTHÁNG-SỐ, số tăng dần không bao giờ trùng (lưu ở thuộc tính SO_DON) */
function nextOrderCode(props) {
  const n = Number(props.getProperty('SO_DON') || '0') + 1
  props.setProperty('SO_DON', String(n))
  const ddmm = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'ddMM')
  return `EP-${ddmm}-${String(n).padStart(4, '0')}`
}

function sheet(name, headers) {
  const book = SpreadsheetApp.getActiveSpreadsheet()
  let tab = book.getSheetByName(name)
  if (!tab) {
    tab = book.insertSheet(name)
    tab.appendRow(headers)
    tab.setFrozenRows(1)
    tab.getRange(1, 1, 1, headers.length).setFontWeight('bold')
  }
  return tab
}

/** Chữ khách gõ bắt đầu bằng = + - @ thì trang tính coi là công thức: thêm dấu ' để chỉ là chữ */
function safeCell(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(value)) return `'${value}`
  return value
}

function vnd(n) {
  return `${Number(n).toLocaleString('vi-VN')}đ`
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

function sendMail(props, subject, intro, lines) {
  const to = props.getProperty('EMAIL_NHAN')
  if (!to) return
  const plain = `${intro}\n\n${lines.map(([k, v]) => `${k}: ${v == null ? '' : v}`).join('\n')}\n\nDanh sách đầy đủ: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`
  const html =
    `<p>${escapeHtml(intro)}</p><table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    lines.map(([k, v]) => `<tr><td style="color:#555;vertical-align:top">${escapeHtml(k)}</td><td><b>${escapeHtml(v)}</b></td></tr>`).join('') +
    `</table><p><a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">Mở danh sách đơn và tin nhắn</a></p>`
  MailApp.sendEmail({ to: to, subject: subject, body: plain, htmlBody: html, name: 'Web Ecopillo' })
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}

/** Chạy tay ở bước 4 để cấp quyền và thử gửi một email */
function thuGuiEmail() {
  sendMail(PropertiesService.getScriptProperties(), '[THỬ] Web Ecopillo nối xong', 'Thư thử: Apps Script đã gửi được email.', [['Lúc', new Date().toString()]])
}
