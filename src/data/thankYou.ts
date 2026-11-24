import type { ImageSource } from './catalog'
import { productsUrl } from './links'
import { anh, chu, definePageText, doan, type TextField } from './pageText/define'

/** Ô đường link (/duong-dan/, https://…): web kiểm đúng dạng link, sai thì dùng link gốc */
const link = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'link', goc, goiY })

/**
 * Thư cảm ơn kèm ưu đãi 5% cho đơn tiếp theo (khách gửi 05/11/2026, mục 11).
 * Thay khối "Tri ân 15.000 khách hàng" (quà kèm ruột gối / vỏ gối ôm).
 * Ảnh nén từ images/ bằng tools/nen-anh-thu-cam-on-2026-11-05.py.
 *
 * Thiệp không ghi: gửi kèm đơn nào, cách dùng ưu đãi (mã / mang thư / báo hotline),
 * hạn dùng, có áp dụng đơn online không → web chỉ ghi phần đã biết, câu hỏi nằm ở Excel (STT 74).
 */

/** WebP 520/1000 như các ảnh quà doanh nghiệp (nén 06/11/2026 bằng tools/nen-anh-thu-cam-on-2026-11-05.py) */
const card = (key: string, alt: string): ImageSource => ({
  src: `/images/thu-cam-on/${key}.webp`,
  srcSet: `/images/thu-cam-on/${key}-sm.webp 520w, /images/thu-cam-on/${key}.webp 1000w`,
  alt,
})

const BASE_CARDS = {
  front: card(
    'thu-cam-on-mat-truoc',
    'Mặt trước thư cảm ơn Ecopillo: Thư cảm ơn, sự đồng hành của bạn là động lực lớn nhất của chúng tôi',
  ),
  inside: card(
    'thu-cam-on-mat-trong',
    'Mặt trong thư cảm ơn Ecopillo: lời tri ân và ưu đãi 5% cho đơn hàng tiếp theo',
  ),
} as const

/**
 * Chữ chép từ thiệp; không thêm điều kiện ngoài thiệp. Ecopillo tự sửa ở Nội dung web → Chữ từng trang.
 * Cách dùng ưu đãi: chờ Ecopillo (thư kèm đơn nào; dùng mã, mang thư hay báo hotline; hạn dùng; đơn online). Không hiện nhãn chờ (owner 28/10).
 */
const { set: THANK_YOU_SET_, text: TEXT } = definePageText(
  'thu-cam-on',
  'Trang chủ: khối Thư cảm ơn (ưu đãi 5%)',
  'Chữ và hai ảnh thư cảm ơn ở trang chủ và trang Quà tặng và sự kiện.',
  {
    nhan: chu('Nhãn nhỏ', 'Ưu đãi 5%'),
    tieuDe: chu('Tiêu đề', 'Thư cảm ơn từ Ecopillo'),
    trichDan: doan('Câu trích trong thư', 'Mỗi người đều xứng đáng có một “chốn yên” để trở về sau những bộn bề cuộc sống.'),
    loiTriAn: doan(
      'Lời tri ân và ưu đãi',
      'Ecopillo trân trọng cảm ơn Quý khách đã tin tưởng lựa chọn. Như một lời tri ân, Ecopillo gửi tặng Quý khách ưu đãi 5% cho đơn hàng tiếp theo.',
    ),
    cachDung: doan('Cách dùng ưu đãi', 'Cách dùng ưu đãi: liên hệ hotline để được hướng dẫn.'),
    nutXem: chu('Chữ nút xem thư', 'Xem thư cảm ơn'),
    nutChon: chu('Chữ nút chọn bộ sưu tập', 'Chọn bộ sưu tập'),
    nutXemBo: chu('Trang Quà tặng: chữ nút sang bộ chăn ga', 'Xem bộ chăn ga'),
    linkXemBo: link('Trang Quà tặng: link nút sang bộ chăn ga', productsUrl({ 'danh-muc': 'bo-chan-ga' })),
    ghiChuQuaTang: chu('Trang Quà tặng: dòng nhỏ dưới hai nút', 'Quà tặng doanh nghiệp, sự kiện vẫn ở phần trên trang này'),
    xemLai: chu('Trang Quà tặng: chữ link cuối dòng nhỏ (cuộn lên phần quà doanh nghiệp)', 'xem lại'),
    anhMatTruoc: anh('Ảnh mặt trước thư', BASE_CARDS.front),
    anhMatTrong: anh('Ảnh mặt trong thư', BASE_CARDS.inside),
    xemToDoc: chu('Ảnh thư: nút xem to (trình đọc màn hình)', 'Xem to {ten}', '{ten} là phần đầu chữ mô tả ảnh, viết thường'),
    tenKhung: chu('Khung xem to: tên khung khi chưa chọn ảnh', 'Thư cảm ơn'),
  },
)
export const THANK_YOU_SET = THANK_YOU_SET_
export const THANK_YOU_CARDS = { front: TEXT.anhMatTruoc, inside: TEXT.anhMatTrong } as const

export const THANK_YOU = {
  eyebrow: TEXT.nhan,
  title: TEXT.tieuDe,
  quote: TEXT.trichDan,
  body: TEXT.loiTriAn,
  howToUseLead: TEXT.cachDung,
  viewLabel: TEXT.nutXem,
  chooseLabel: TEXT.nutChon,
  setsLabel: TEXT.nutXemBo,
  setsTo: TEXT.linkXemBo,
  giftsNote: TEXT.ghiChuQuaTang,
  giftsBack: TEXT.xemLai,
  zoomLabel: TEXT.xemToDoc,
  dialogLabel: TEXT.tenKhung,
  cards: THANK_YOU_CARDS,
}
