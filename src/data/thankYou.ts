import type { ImageSource } from './catalog'

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

export const THANK_YOU_CARDS = {
  front: card(
    'thu-cam-on-mat-truoc',
    'Mặt trước thư cảm ơn Ecopillo: Thư cảm ơn, sự đồng hành của bạn là động lực lớn nhất của chúng tôi',
  ),
  inside: card(
    'thu-cam-on-mat-trong',
    'Mặt trong thư cảm ơn Ecopillo: lời tri ân và ưu đãi 5% cho đơn hàng tiếp theo',
  ),
} as const

/** Chữ chép từ thiệp; không thêm điều kiện ngoài thiệp */
export const THANK_YOU = {
  eyebrow: 'Ưu đãi 5%',
  title: 'Thư cảm ơn từ Ecopillo',
  /** Câu trích mặt trong */
  quote: 'Mỗi người đều xứng đáng có một “chốn yên” để trở về sau những bộn bề cuộc sống.',
  /** Lời tri ân + ưu đãi; phần “kèm thư trong đơn” chờ Ecopillo xác nhận đơn nào */
  body: 'Ecopillo trân trọng cảm ơn Quý khách đã tin tưởng lựa chọn. Như một lời tri ân, Ecopillo gửi tặng Quý khách ưu đãi 5% cho đơn hàng tiếp theo.',
  /**
   * Chỉ ghi phần đã biết. Chờ Ecopillo: thư kèm đơn nào; dùng mã, mang thư hay báo hotline;
   * hạn dùng; có áp dụng đơn online không. Không hiện nhãn chờ trên web (owner 28/10).
   */
  howToUseLead: 'Cách dùng ưu đãi: liên hệ hotline để được hướng dẫn.',
  viewLabel: 'Xem thư cảm ơn',
  chooseLabel: 'Chọn bộ sưu tập',
  cards: THANK_YOU_CARDS,
} as const
