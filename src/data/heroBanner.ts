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

/**
 * Phần đầu tiêu đề cấp 1, chỉ dành cho Google và trình đọc màn hình (ảnh không có tên hãng).
 * Ô sửa không giữ dấu cách cuối (liveContent cắt), nên dấu cách nối với câu tiêu đề thêm ở đây.
 */
const BASE_HEADLINE_PREFIX = 'Chăn ga gối đệm cao cấp Ecopillo:'

export interface HeroCategory {
  /** Chữ đậm dưới biểu tượng, đúng chữ trong banner */
  name: string
  /** Dòng nhỏ dưới tên, đúng chữ trong banner */
  text: string
  to: string
  /** Nét vẽ của biểu tượng (nền trong suốt, alt rỗng vì tên nằm ngay dưới); vòng tròn vẽ bằng CSS */
  icon: { src: string; srcSet: string; alt: string }
}

const icon = (key: string) => ({ src: `/images/hero/chon-yen-bieu-tuong-${key}.webp`, srcSet: '', alt: '' })

const BASE_CATEGORIES: readonly HeroCategory[] = [
  { name: 'Chăn', text: 'Mềm mại', to: productsUrl({ 'danh-muc': 'chan' }), icon: icon('chan') },
  { name: 'Ga', text: 'Êm ái', to: productsUrl({ 'danh-muc': 'bo-chan-ga' }), icon: icon('ga') },
  { name: 'Gối', text: 'Nâng niu', to: productsUrl({ 'danh-muc': 'goi' }), icon: icon('goi') },
  { name: 'Đệm', text: 'Nâng đỡ chuẩn', to: productsUrl({ 'danh-muc': 'dem' }), icon: icon('dem') },
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
  tienTo: BASE_HEADLINE_PREFIX,
  anhMayTinh: { src: '/images/hero/chon-yen-desktop-1600.webp', srcSet: BASE_HERO_IMAGES.desktopSrcSet, alt: '' },
  anhDienThoai: { src: BASE_HERO_IMAGES.mobileSrc, srcSet: BASE_HERO_IMAGES.mobileSrcSet, alt: '' },
  anhChu: { src: BASE_HERO_IMAGES.headlineSrc, srcSet: BASE_HERO_IMAGES.headlineSrcSet, alt: '' },
}

export const BANNER_SET: EditableSet = {
  khoa: 'banner',
  nhom: 'Trang chủ',
  ten: 'Banner đầu trang chủ',
  moTa: 'Ảnh nền (máy tính, điện thoại), ảnh dòng chữ tiêu đề, và câu tiêu đề (cho Google, trình đọc màn hình). Ảnh nền máy tính không có chữ; ảnh điện thoại dọc, trời phía trên. Chữ hai nút dưới banner sửa ở Chữ từng trang → Trang chủ.',
  kieu: 'mot',
  goc: BASE_BANNER,
  truong: [
    { khoa: 'tieuDe', nhan: 'Câu tiêu đề (đúng chữ trong ảnh dòng chữ)', kieu: 'chu', batBuoc: true },
    {
      khoa: 'tienTo',
      nhan: 'Phần đầu tiêu đề, chỉ Google và trình đọc màn hình thấy',
      kieu: 'chu',
      batBuoc: true,
      goiY: 'Đọc liền trước câu tiêu đề, để tiêu đề trang chủ có tên hãng (ảnh dòng chữ không có)',
    },
    { khoa: 'anhMayTinh', nhan: 'Ảnh nền máy tính (ngang, rộng từ 2400 px)', kieu: 'anh', batBuoc: true },
    { khoa: 'anhDienThoai', nhan: 'Ảnh nền điện thoại (dọc)', kieu: 'anh', batBuoc: true },
    { khoa: 'anhChu', nhan: 'Ảnh dòng chữ tiêu đề (nền trong suốt)', kieu: 'anh', batBuoc: true },
  ] satisfies EditableField[],
}

const BANNER = liveObject(BANNER_SET.khoa, BASE_BANNER, BANNER_SET.truong)

/** Câu chữ của dòng tiêu đề trong ảnh (đọc cho Google và trình đọc màn hình) */
export const HERO_HEADLINE: string = BANNER.tieuDe

/** Phần đầu tiêu đề cấp 1 (kèm dấu cách nối với câu tiêu đề) */
export const HERO_HEADLINE_PREFIX: string = `${BANNER.tienTo} `

export const HERO_IMAGES = {
  mobileSrc: BANNER.anhDienThoai.src,
  mobileSrcSet: BANNER.anhDienThoai.srcSet || BANNER.anhDienThoai.src,
  desktopSrcSet: BANNER.anhMayTinh.srcSet || BANNER.anhMayTinh.src,
  headlineSrc: BANNER.anhChu.src,
  headlineSrcSet: BANNER.anhChu.srcSet || BANNER.anhChu.src,
}

/** Số nhóm tối đa trên banner: quá 4 nhóm thì xếp hai hàng (Hero.tsx), quá 8 thì chật chỗ trời của ảnh */
export const HERO_CATEGORY_MAX = 8

/**
 * Các nhóm dưới banner. Owner 24/11/2026 ("thêm được thì phải sửa được và xoá được"): Ecopillo thêm, xoá, đổi thứ tự,
 * từ 1 đến 8 nhóm; 4 nhóm thì giữ đúng như banner đã duyệt.
 */
export const BANNER_GROUPS_SET: EditableSet = {
  khoa: 'banner-nhom',
  nhom: 'Trang chủ',
  ten: 'Các nhóm dưới banner',
  moTa: `Chữ, biểu tượng và link các nhóm Chăn · Ga · Gối · Đệm trên banner. Thêm, xoá, đổi thứ tự được, từ 1 đến ${HERO_CATEGORY_MAX} nhóm (quá 4 nhóm thì xếp hai hàng). Biểu tượng là ảnh vuông nền trong suốt (vòng tròn xanh web tự vẽ).`,
  kieu: 'nhieu',
  goc: BASE_CATEGORIES,
  tieuDeDong: 'name',
  truong: [
    { khoa: 'name', nhan: 'Tên', kieu: 'chu', batBuoc: true },
    { khoa: 'text', nhan: 'Dòng nhỏ', kieu: 'chu', batBuoc: true },
    { khoa: 'icon', nhan: 'Biểu tượng (ảnh vuông, nền trong suốt)', kieu: 'anh', batBuoc: true },
    { khoa: 'to', nhan: 'Bấm vào thì mở', kieu: 'link', batBuoc: true, goiY: 'Đường trong web, ví dụ /san-pham/?danh-muc=chan' },
  ] satisfies EditableField[],
}

/** Dòng trống cho nhóm Ecopillo thêm: thiếu tên, biểu tượng hay link thì bỏ dòng (liveList) */
const EMPTY_CATEGORY: HeroCategory = { name: '', text: '', to: '', icon: { src: '', srcSet: '', alt: '' } }

/**
 * Bốn dòng đầu: dòng đã lưu trước khi có ô biểu tượng, link (lúc 4 nhóm cố định) thì dùng biểu tượng và link gốc cùng vị trí.
 * Dòng thứ 5 trở đi là nhóm Ecopillo thêm, phải đủ ô.
 */
export const HERO_CATEGORIES: readonly HeroCategory[] = liveList(BANNER_GROUPS_SET.khoa, BASE_CATEGORIES, BANNER_GROUPS_SET.truong, (i) => ({
  ...(BASE_CATEGORIES[i] ?? EMPTY_CATEGORY),
})).slice(0, HERO_CATEGORY_MAX)
