import type { EditableField, EditableSet } from './liveContent'

/**
 * Màu web Ecopillo tự đổi (owner 20/11/2026: "ecopillo cần tự làm hết được", chọn "đổi bộ màu, có chốt chặn").
 * Nội dung web → Giao diện → Màu web. Plugin kiểm độ tương phản chữ / nền (`kiemTuongPhan`), không đủ thì không lưu;
 * lưu được thì ghi /wp-content/uploads/ecopillo-du-lieu/mau.css (`:root:root { --color-…: … }`), trang nạp file đó trước khi vẽ
 * (vite.config.ts). Không đọc trong JS: Tailwind dùng sẵn các biến này (src/index.css @theme).
 * Màu gốc = bộ nhận diện đã chốt (CLAUDE.md "Màu"). Đổi ở đây là Ecopillo tự quyết, "Trả về nội dung gốc" để về màu đã chốt.
 */

const v = (bien: string, alpha?: number) => ({ bien, ...(alpha !== undefined ? { alpha } : {}) })

const GOC = {
  cham: '#2d2e8d',
  chamSang: '#333dba',
  nen: '#d3efff',
  xanhNhat: '#e9f8ff',
  vang: '#ffc271',
  nutGoi: '#15803d',
  nutGoiDam: '#166534',
  zalo: '#0068ff',
  messenger: '#0866ff',
  facebook: '#0866ff',
  youtube: '#ff0000',
  tiktok: '#000000',
  canhBao: '#d62828',
}

const mau = (khoa: keyof typeof GOC, nhan: string, goiY?: string): EditableField => ({ khoa, nhan, kieu: 'mau', batBuoc: true, ...(goiY ? { goiY } : {}) })

export const THEME_SET: EditableSet = {
  khoa: 'mau-web',
  nhom: 'Giao diện',
  ten: 'Màu web',
  moTa: 'Bộ màu của cả web: chàm (chữ, nút chính), chàm sáng, nền trang, ô xanh nhạt, vàng ưu đãi, màu nút gọi và mạng xã hội. Màu làm chữ khó đọc thì không lưu được. "Trả về nội dung gốc" để về bộ màu nhận diện đã chốt.',
  kieu: 'mot',
  goc: GOC,
  truong: [
    mau('cham', 'Chàm (chữ, tiêu đề, nút chính, khối đậm)', 'Màu chủ đạo; đường kẻ và chữ phụ tự pha từ màu này'),
    mau('chamSang', 'Chàm sáng (chữ nhấn, nhãn nhỏ, nút khi rê chuột)'),
    mau('nen', 'Nền trang', 'Nền cả web; thẻ, ô nổi vẫn màu trắng'),
    mau('xanhNhat', 'Xanh rất nhạt (ô nhỏ trong khối trắng)'),
    mau('vang', 'Vàng (quà tặng, ưu đãi, khung Hệ sinh thái)'),
    mau('nutGoi', 'Nút gọi'),
    mau('nutGoiDam', 'Nút gọi khi bấm / rê chuột'),
    mau('zalo', 'Zalo'),
    mau('messenger', 'Messenger'),
    mau('facebook', 'Facebook'),
    mau('youtube', 'YouTube'),
    mau('tiktok', 'TikTok'),
    mau('canhBao', 'Đỏ cảnh báo (hết hàng, giảm giá, lỗi nhập)'),
  ],
  bienCss: {
    cham: [
      v('--color-brand-navy'),
      v('--color-deep-950'),
      v('--color-deep-900'),
      v('--color-deep-800'),
      v('--color-ink'),
      v('--color-brass-600'),
      v('--color-ink-soft', 0.8),
      v('--color-ink-faint', 0.72),
      v('--color-line', 0.14),
    ],
    chamSang: [v('--color-brand-blue'), v('--color-deep-700'), v('--color-deep-600'), v('--color-mist-600')],
    nen: [v('--color-page'), v('--color-brand-sky'), v('--color-cream-200'), v('--color-cream-300')],
    xanhNhat: [v('--color-brand-mist'), v('--color-mist-100')],
    vang: [v('--color-brand-gold'), v('--color-brass-500'), v('--color-brass-100')],
    nutGoi: [v('--color-call')],
    nutGoiDam: [v('--color-call-dark')],
    zalo: [v('--color-zalo')],
    messenger: [v('--color-messenger')],
    facebook: [v('--color-facebook')],
    youtube: [v('--color-youtube')],
    tiktok: [v('--color-tiktok')],
    canhBao: [v('--color-alert'), v('--color-sale'), v('--color-alert-soft', 0.09)],
  },
  kiemTuongPhan: [
    { chu: 'cham', nen: '#ffffff', toiThieu: 4.5, nhan: 'Chữ chàm trên nền trắng' },
    { chu: '#ffffff', nen: 'cham', toiThieu: 4.5, nhan: 'Chữ trắng trên nút, khối chàm' },
    { chu: 'cham', nen: 'nen', toiThieu: 4.5, nhan: 'Chữ chàm trên nền trang' },
    { chu: 'cham', nen: 'xanhNhat', toiThieu: 4.5, nhan: 'Chữ chàm trên ô xanh nhạt' },
    { chu: 'cham', nen: 'vang', toiThieu: 4.5, nhan: 'Chữ chàm trên nền vàng' },
    { chu: 'chamSang', nen: '#ffffff', toiThieu: 4.5, nhan: 'Chữ chàm sáng trên nền trắng' },
    { chu: '#ffffff', nen: 'chamSang', toiThieu: 4.5, nhan: 'Chữ trắng trên nút chàm sáng' },
    { chu: '#ffffff', nen: 'nutGoi', toiThieu: 4.5, nhan: 'Chữ trắng trên nút gọi' },
    { chu: '#ffffff', nen: 'nutGoiDam', toiThieu: 4.5, nhan: 'Chữ trắng trên nút gọi khi bấm' },
    { chu: '#ffffff', nen: 'zalo', toiThieu: 4.5, nhan: 'Chữ trắng trên nút Zalo' },
    { chu: '#ffffff', nen: 'messenger', toiThieu: 4.5, nhan: 'Chữ trắng trên nút Messenger' },
    { chu: '#ffffff', nen: 'facebook', toiThieu: 3, nhan: 'Biểu tượng trắng trên vòng Facebook' },
    { chu: '#ffffff', nen: 'youtube', toiThieu: 3, nhan: 'Biểu tượng trắng trên vòng YouTube' },
    { chu: '#ffffff', nen: 'tiktok', toiThieu: 3, nhan: 'Biểu tượng trắng trên vòng TikTok' },
    { chu: 'canhBao', nen: '#ffffff', toiThieu: 4.5, nhan: 'Chữ đỏ cảnh báo trên nền trắng' },
  ],
}
