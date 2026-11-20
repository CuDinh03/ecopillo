import { productsUrl } from './links'
import { liveList, liveObject, type EditableField, type EditableSet } from './liveContent'

/**
 * Banner đầu trang chủ theo file thiết kế Ecopillo gửi 16/11/2026 (images/Banner website.psd, anh Quang: "Thay ảnh này e").
 * Owner chọn phương án A1 ngày 16/11/2026 (mẫu: docs/de-xuat-banner-moi-16-11.html): đúng như banner,
 * dòng chữ là ảnh cắt từ file thiết kế, 4 biểu tượng bấm sang danh mục, giữ 2 nút.
 * Ảnh xuất bằng docs/de-xuat-banner-moi-16-11/xuat-anh-web.py (đổi banner thì chạy lại, giữ tên file).
 * 20/11/2026: chị Phương gửi images/Banner website2.psd (owner: "thay banner mới"): cảnh, biểu tượng giữ nguyên, dòng chữ mới
 * '"Chốn Yên" bắt đầu từ Giấc ngủ ngon' kèm dải lụa và tim; xuất bằng docs/de-xuat-banner-moi-20-11/xuat-tieu-de.py
 * (tên file thêm "-2" để trình duyệt, LiteSpeed không giữ ảnh cũ).
 */

/** Câu chữ của dòng tiêu đề trong ảnh (đọc cho Google và trình đọc màn hình) */
const BASE_HEADLINE = '“Chốn Yên” bắt đầu từ giấc ngủ ngon'

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

const BASE_CATEGORIES: readonly HeroCategory[] = [
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
const BASE_HERO_IMAGES = {
  mobileSrc: '/images/hero/chon-yen-mobile-900.webp',
  mobileSrcSet:
    '/images/hero/chon-yen-mobile-900.webp 900w, /images/hero/chon-yen-mobile-1170.webp 1170w, /images/hero/chon-yen-mobile-1800.webp 1800w',
  desktopSrcSet:
    '/images/hero/chon-yen-desktop-1600.webp 1600w, /images/hero/chon-yen-desktop-2400.webp 2400w, /images/hero/chon-yen-desktop-3200.webp 3200w',
  headlineSrc: '/images/hero/chon-yen-tieu-de-2-1000.webp',
  headlineSrcSet: '/images/hero/chon-yen-tieu-de-2-1000.webp 1000w, /images/hero/chon-yen-tieu-de-2.webp 1620w',
}

/* ——— Ecopillo tự sửa trong WordPress (liveContent.ts). Đổi ảnh: thẻ preload trong index.html vẫn tải ảnh cũ tới lần dựng sau ——— */

const BASE_BANNER = {
  tieuDe: BASE_HEADLINE,
  anhMayTinh: { src: '/images/hero/chon-yen-desktop-1600.webp', srcSet: BASE_HERO_IMAGES.desktopSrcSet, alt: '' },
  anhDienThoai: { src: BASE_HERO_IMAGES.mobileSrc, srcSet: BASE_HERO_IMAGES.mobileSrcSet, alt: '' },
  anhChu: { src: BASE_HERO_IMAGES.headlineSrc, srcSet: BASE_HERO_IMAGES.headlineSrcSet, alt: '' },
}

export const BANNER_SET: EditableSet = {
  khoa: 'banner',
  nhom: 'Trang chủ',
  ten: 'Banner đầu trang chủ',
  moTa: 'Ảnh nền (máy tính, điện thoại), ảnh dòng chữ tiêu đề, và câu tiêu đề (cho Google, trình đọc màn hình). Ảnh nền máy tính không có chữ; ảnh điện thoại dọc, trời phía trên.',
  kieu: 'mot',
  goc: BASE_BANNER,
  truong: [
    { khoa: 'tieuDe', nhan: 'Câu tiêu đề (đúng chữ trong ảnh dòng chữ)', kieu: 'chu', batBuoc: true },
    { khoa: 'anhMayTinh', nhan: 'Ảnh nền máy tính (ngang, rộng từ 2400 px)', kieu: 'anh', batBuoc: true },
    { khoa: 'anhDienThoai', nhan: 'Ảnh nền điện thoại (dọc)', kieu: 'anh', batBuoc: true },
    { khoa: 'anhChu', nhan: 'Ảnh dòng chữ tiêu đề (nền trong suốt)', kieu: 'anh', batBuoc: true },
  ] satisfies EditableField[],
}

const BANNER = liveObject(BANNER_SET.khoa, BASE_BANNER, BANNER_SET.truong)

/** Câu chữ của dòng tiêu đề trong ảnh (đọc cho Google và trình đọc màn hình) */
export const HERO_HEADLINE: string = BANNER.tieuDe

export const HERO_IMAGES = {
  mobileSrc: BANNER.anhDienThoai.src,
  mobileSrcSet: BANNER.anhDienThoai.srcSet || BANNER.anhDienThoai.src,
  desktopSrcSet: BANNER.anhMayTinh.srcSet || BANNER.anhMayTinh.src,
  headlineSrc: BANNER.anhChu.src,
  headlineSrcSet: BANNER.anhChu.srcSet || BANNER.anhChu.src,
}

export const BANNER_GROUPS_SET: EditableSet = {
  khoa: 'banner-nhom',
  nhom: 'Trang chủ',
  ten: 'Bốn nhóm dưới banner',
  moTa: 'Chữ dưới 4 biểu tượng Chăn · Ga · Gối · Đệm trên banner (biểu tượng và link giữ nguyên).',
  kieu: 'nhieu',
  goc: BASE_CATEGORIES,
  tieuDeDong: 'name',
  truong: [
    { khoa: 'name', nhan: 'Tên', kieu: 'chu', batBuoc: true },
    { khoa: 'text', nhan: 'Dòng nhỏ', kieu: 'chu', batBuoc: true },
  ] satisfies EditableField[],
}

/** Chỉ sửa chữ, giữ đủ 4 nhóm với biểu tượng và link gốc */
export const HERO_CATEGORIES: readonly HeroCategory[] = liveList(BANNER_GROUPS_SET.khoa, BASE_CATEGORIES, BANNER_GROUPS_SET.truong, (i) => ({
  ...BASE_CATEGORIES[Math.min(i, BASE_CATEGORIES.length - 1)],
})).slice(0, BASE_CATEGORIES.length)
