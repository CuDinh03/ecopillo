import { productsUrl } from './links'

/**
 * Banner đầu trang chủ theo file thiết kế Ecopillo gửi 16/11/2026 (images/Banner website.psd, anh Quang: "Thay ảnh này e").
 * Owner chọn phương án A1 ngày 16/11/2026 (mẫu: docs/de-xuat-banner-moi-16-11.html): đúng như banner,
 * dòng chữ là ảnh cắt từ file thiết kế, 4 biểu tượng bấm sang danh mục, giữ 2 nút.
 * Ảnh xuất bằng docs/de-xuat-banner-moi-16-11/xuat-anh-web.py (đổi banner thì chạy lại, giữ tên file).
 */

/** Câu chữ của dòng tiêu đề trong ảnh (đọc cho Google và trình đọc màn hình) */
export const HERO_HEADLINE = 'Chốn yên bắt đầu từ giấc ngủ ngon'

/** Phần đầu tiêu đề cấp 1, chỉ dành cho Google và trình đọc màn hình (ảnh không có tên hãng) */
export const HERO_HEADLINE_PREFIX = 'Chăn ga gối đệm cao cấp Ecopillo: '

export interface HeroCategory {
  /** Chữ đậm dưới biểu tượng, đúng chữ trong banner */
  name: string
  /** Dòng nhỏ dưới tên, đúng chữ trong banner */
  text: string
  to: string
  /** Nét vẽ của biểu tượng (nền trong suốt); vòng tròn vẽ bằng CSS */
  icon: string
}

export const HERO_CATEGORIES: readonly HeroCategory[] = [
  { name: 'Chăn', text: 'Mềm mại', to: productsUrl({ 'danh-muc': 'chan' }), icon: '/images/hero/chon-yen-bieu-tuong-chan.webp' },
  { name: 'Ga', text: 'Êm ái', to: productsUrl({ 'danh-muc': 'bo-chan-ga' }), icon: '/images/hero/chon-yen-bieu-tuong-ga.webp' },
  { name: 'Gối', text: 'Nâng niu', to: productsUrl({ 'danh-muc': 'goi' }), icon: '/images/hero/chon-yen-bieu-tuong-goi.webp' },
  { name: 'Đệm', text: 'Nâng đỡ chuẩn', to: productsUrl({ 'danh-muc': 'dem' }), icon: '/images/hero/chon-yen-bieu-tuong-dem.webp' },
]

/**
 * Ảnh nền. Điện thoại: ảnh dọc, trời phía trên cho chữ, cảnh giường phía dưới (dựng lại từ lớp gốc, không phóng ảnh đã ghép).
 * Máy tính: cảnh không chữ, không biểu tượng (chữ, biểu tượng là phần tử riêng để bấm được và đọc được).
 * Giữ khớp với thẻ preload trong index.html.
 */
export const HERO_IMAGES = {
  mobileSrc: '/images/hero/chon-yen-mobile-900.webp',
  mobileSrcSet:
    '/images/hero/chon-yen-mobile-900.webp 900w, /images/hero/chon-yen-mobile-1170.webp 1170w, /images/hero/chon-yen-mobile-1800.webp 1800w',
  desktopSrcSet:
    '/images/hero/chon-yen-desktop-1600.webp 1600w, /images/hero/chon-yen-desktop-2400.webp 2400w, /images/hero/chon-yen-desktop-3200.webp 3200w',
  headlineSrc: '/images/hero/chon-yen-tieu-de-1000.webp',
  headlineSrcSet: '/images/hero/chon-yen-tieu-de-1000.webp 1000w, /images/hero/chon-yen-tieu-de.webp 1488w',
} as const
