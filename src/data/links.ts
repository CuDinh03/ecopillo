import type { Collection, Pattern } from './catalog'

/**
 * Mọi đường link của web nằm ở đây.
 *
 * Owner chốt ngày 15/10/2026: GIỮ NGUYÊN LINK CỦA WEB CŨ làm link chính, chỉ thay giao diện.
 * Mỗi trang sản phẩm, bộ sưu tập, chính sách, bài viết của web cũ mở đúng trang tương ứng trên giao diện mới, ở đúng đường link đó.
 * Link cũ không có trang tương ứng thì chuyển hướng (bảng REDIRECTS bên dưới; khi đưa lên thật phải đặt 301 ở máy chủ).
 * Link chỉ web mới có (đặt hàng, hệ thống phân phối, hỏi đáp, quà tặng, hướng dẫn mua hàng) là trang mới, không đụng link cũ nào.
 *
 * Đường link luôn có dấu "/" ở cuối như WordPress. Trước khi đổi bất cứ dòng nào ở đây: tra docs/giu-link-web-cu.md,
 * sửa xong chạy node tools/kiem-tra-link-cu.mjs.
 *
 * Ngoại lệ duy nhất (owner chốt 15/10/2026): link cũ có chữ chất liệu cũ thì đổi chữ đó thành "lyocell" (44 trang sản phẩm,
 * 1 bài viết), link cũ chuyển hướng 301 sang link mới (bảng RENAMED_PATHS). Chữ chất liệu cũ chỉ còn trong các đường link cũ
 * ở bảng đó, để chuyển hướng; không ở đâu khác.
 */

export const SITE_ORIGIN = 'https://ecopillo.com.vn'

export const PATHS = {
  home: '/',
  /** Trang "Sản phẩm" của web cũ (menu chính) */
  products: '/danh-muc-san-pham/san-pham/',
  about: '/gioi-thieu/',
  contact: '/lien-he/',
  /** Menu "Dự án khách sạn, nhà nghỉ" của web cũ */
  hotel: '/danh-muc-san-pham/du-an-khach-san-nha-nghi/',
  /** Menu "Tin tức" của web cũ */
  blog: '/category/tin-tuc/',
  /** Menu "Đăng ký đại lý" của web cũ */
  recruit: '/tuyen-dai-ly/',
  privacy: '/chinh-sach-bao-mat-thong-tin/',
  // Trang mới, web cũ không có
  distribution: '/he-thong-phan-phoi/',
  faq: '/hoi-dap/',
  gifts: '/qua-tang/',
  order: '/dat-hang/',
} as const

/** Trang danh sách sản phẩm đã lọc sẵn một nhóm, ví dụ ?danh-muc=dem */
export const productsUrl = (params: Readonly<Record<string, string>> = {}): string => {
  const query = new URLSearchParams(params).toString()
  return query ? `${PATHS.products}?${query}` : PATHS.products
}

/** Trang bộ sưu tập: trang danh mục của web cũ */
const COLLECTION_PATHS: Readonly<Record<string, string>> = {
  'eco-flora': '/danh-muc-san-pham/bo-suu-tap-eco-flora/',
  'eco-rosa': '/danh-muc-san-pham/bo-suu-tap-eco-rosa/',
  'eco-tera': '/danh-muc-san-pham/bo-suu-tap-eco-tera/',
  'eco-vera': '/danh-muc-san-pham/bo-suu-tap-eco-vera/',
  'eco-sweet': '/danh-muc-san-pham/bo-suu-tap-eco-sweet/',
  'eco-liora': '/danh-muc-san-pham/bo-suu-tap-eco-liora/',
  'eco-doris': '/danh-muc-san-pham/bo-suu-tap-eco-doris/',
  'chan-he-lyocell': '/danh-muc-san-pham/san-pham/chan-he/',
}

/**
 * Trang sản phẩm của từng phối màu: /san-pham/<tên dưới đây>/, đúng tên trang sản phẩm của web cũ
 * (68 dòng khớp một-một, kiểm 15/10/2026), trừ 44 tên có chữ chất liệu cũ đã đổi thành "lyocell" (RENAMED_PATHS).
 * 5 dòng đánh dấu "mới" là phối màu web cũ chưa có trang, đặt tên theo cùng kiểu với mẫu mới nhất của bộ đó.
 * Thêm phối màu mới: thêm một dòng ở đây (docs/huong-dan-them-bo-suu-tap.md).
 */
const PATTERN_SLUGS: Readonly<Record<string, string>> = {
  // Eco Flora
  'eco-flora/EF06': 'bo-ga-chun-eco-flora-ef06',
  'eco-flora/EF09': 'bo-ga-chun-eco-flora-ef09',
  'eco-flora/EF10': 'bo-ga-chun-eco-flora-ef10',
  'eco-flora/EF11': 'bo-ga-chun-eco-flora-ef11',
  'eco-flora/EF12': 'bo-ga-chun-eco-flora-ef12', // mới
  'eco-flora/EF16': 'bo-ga-chun-eco-flora-ef16', // mới
  'eco-flora/EF18': 'bo-ga-chun-eco-flora-ef18',
  'eco-flora/EF19': 'bo-ga-chun-eco-flora-ef19',
  // Eco Rosa
  'eco-rosa/ER06': 'bo-chan-ga-eco-rosa-er06',
  'eco-rosa/ER08': 'bo-chan-ga-lyocell-eco-rosa-er08',
  'eco-rosa/ER09': 'bo-chan-ga-lyocell-eco-rosa-er09',
  'eco-rosa/ER10': 'bo-chan-ga-lyocell-eco-rosa-er10',
  'eco-rosa/ER11': 'bo-chan-ga-lyocell-eco-rosa-er11',
  'eco-rosa/ER12': 'bo-chan-ga-lyocell-eco-rosa-er12',
  'eco-rosa/ER15': 'bo-chan-ga-lyocell-eco-rosa-er15',
  'eco-rosa/ER16': 'bo-chan-ga-lyocell-eco-rosa-er16',
  'eco-rosa/ER17': 'bo-chan-ga-eco-rosa-er17', // mới
  'eco-rosa/ER18': 'bo-chan-ga-eco-rosa-er18', // mới
  'eco-rosa/ER19': 'bo-chan-ga-lyocell-eco-rosa-er19',
  'eco-rosa/ER20': 'bo-chan-ga-lyocell-eco-rosa-er20',
  'eco-rosa/ER21': 'bo-chan-ga-lyocell-eco-rosa-er21',
  'eco-rosa/ER22': 'bo-chan-ga-lyocell-eco-rosa-er22',
  'eco-rosa/ER24': 'bo-chan-ga-lyocell-eco-rosa-er24',
  'eco-rosa/ER25': 'bo-chan-ga-lyocell-eco-rosa-er25',
  'eco-rosa/ER26': 'bo-chan-ga-lyocell-eco-rosa-er26',
  'eco-rosa/ER28': 'bo-chan-ga-lyocell-eco-rosa-er28',
  'eco-rosa/ER29': 'bo-chan-ga-lyocell-eco-rosa-er29',
  'eco-rosa/ER30': 'bo-chan-ga-lyocell-eco-rosa-er30',
  'eco-rosa/ER31': 'bo-chan-ga-lyocell-eco-rosa-er31',
  'eco-rosa/ER32': 'bo-chan-ga-lyocell-eco-rosa-er32',
  'eco-rosa/ER33': 'bo-chan-ga-lyocell-eco-rosa-er33',
  'eco-rosa/ER34': 'bo-chan-ga-lyocell-eco-rosa-er34',
  'eco-rosa/ER35': 'bo-chan-ga-lyocell-eco-rosa-er35',
  'eco-rosa/ER37': 'bo-chan-ga-lyocell-eco-rosa-er37',
  'eco-rosa/ER39': 'bo-chan-ga-lyocell-eco-rosa-er39',
  'eco-rosa/ER42': 'bo-chan-ga-eco-rosa-er42',
  'eco-rosa/ER45': 'bo-chan-ga-eco-rosa-er45',
  'eco-rosa/ER46': 'bo-chan-ga-eco-rosa-er46',
  'eco-rosa/ER47': 'bo-chan-ga-eco-rosa-er47',
  'eco-rosa/ER48': 'bo-chan-ga-eco-rosa-er48',
  'eco-rosa/ER49': 'bo-chan-ga-eco-rosa-er49',
  // Eco Tera
  'eco-tera/ET01': 'bo-chan-ga-goi-cao-cap-eco-tera-et01',
  'eco-tera/ET02': 'bo-chan-ga-goi-cao-cap-eco-tera-et02',
  'eco-tera/ET03': 'bo-chan-ga-goi-cao-cap-eco-tera-et03',
  'eco-tera/ET04': 'bo-chan-ga-goi-cao-cap-eco-tera-et04',
  'eco-tera/ET05': 'bo-chan-ga-goi-cao-cap-eco-tera-et05',
  'eco-tera/ET06': 'bo-chan-ga-goi-cao-cap-eco-tera-et06',
  // Eco Vera
  'eco-vera/EV01': 'bo-chan-ga-goi-cao-cap-eco-vera-ev01',
  'eco-vera/EV02': 'bo-chan-ga-goi-cao-cap-eco-vera-ev02',
  'eco-vera/EV03': 'bo-chan-ga-goi-cao-cap-eco-vera-ev03',
  'eco-vera/EV04': 'bo-chan-ga-goi-cao-cap-eco-vera-ev04',
  'eco-vera/EV05': 'bo-chan-ga-goi-cao-cap-eco-vera-ev05',
  'eco-vera/EV06': 'bo-chan-ga-goi-cao-cap-eco-vera-ev06',
  // Eco Sweet
  'eco-sweet/ES06': 'bo-ga-phu-lyocell-cao-cap-eco-sweet-es06',
  'eco-sweet/ES08': 'bo-ga-phu-lyocell-cao-cap-eco-sweet-es08',
  'eco-sweet/ES10': 'bo-ga-phu-lyocell-cao-cap-eco-sweet-es10',
  // Eco Liora
  'eco-liora/EL06': 'bo-chan-ga-eco-liora-el06',
  'eco-liora/EL08': 'bo-chan-ga-eco-liora-el08',
  'eco-liora/EL09': 'bo-chan-ga-eco-liora-el09',
  'eco-liora/EL10': 'bo-chan-ga-eco-liora-el10',
  'eco-liora/EL12': 'bo-chan-ga-eco-liora-el12',
  // Eco Doris
  'eco-doris/ED08': 'bo-ga-phu-lyocell-cao-cap-eco-doris-ed08',
  'eco-doris/ED09': 'bo-ga-phu-lyocell-cao-cap-eco-doris-ed09',
  'eco-doris/ED10': 'bo-ga-phu-lyocell-cao-cap-eco-doris-ed10',
  'eco-doris/ED20': 'bo-ga-phu-cao-cap-eco-doris-ed20', // mới
  'eco-doris/ED25': 'bo-ga-phu-cao-cap-eco-doris-ed25',
  'eco-doris/ED26': 'bo-ga-phu-cao-cap-eco-doris-ed26',
  // Chăn hè Lyocell
  'chan-he-lyocell/ER09': 'chan-he-lyocell-er09',
  'chan-he-lyocell/ER12': 'chan-he-lyocell-er12',
  'chan-he-lyocell/ER16': 'chan-he-lyocell-er16',
  'chan-he-lyocell/ER20': 'chan-he-lyocell-er20',
  'chan-he-lyocell/ER36': 'chan-he-lyocell-er36',
  'chan-he-lyocell/ER38': 'chan-he-lyocell-er38',
}

/** Sản phẩm lẻ: mã sản phẩm trong products.ts → tên trang sản phẩm của web cũ */
const PRODUCT_SLUGS: Readonly<Record<string, string>> = {
  'ruot-goi-micro-fiber': 'ruot-goi-dau-micro-fiber',
  'ruot-goi-micro-plus': 'ruot-goi-micro-plus-ecopillo',
  'ruot-goi-to-tam': 'ruot-goi-to-tam-ecopillo',
  'ruot-goi-cao-su-thien-nhien': 'ruot-goi-cao-su-thien-nhien-ecopillo',
  'ruot-goi-long-vu-tu-nhien': 'ruot-goi-long-vu-tu-nhien-ecopillo',
  'chan-dong-micro-fiber': 'ruot-chan-dong-micro-fiber',
  'chan-to-tam': 'chan-to-tam-ecopillo',
  'chan-long-vu-tu-nhien': 'chan-long-vu-tu-nhien',
  'topper-micro-fiber': 'tam-topper-micro-fiber',
  'dem-bong-gam-thuan-khiet': 'dem-bong-gam-thuan-khiet',
  'dem-lo-xo-tui-cao-cap-eco-luxe': 'dem-lo-xo-tui-cao-cap-eco-luxe',
  'dem-bong-nano-chan-foam': 'dem-bong-nano-chan-foam',
  'dem-lo-xo-tui-doc-lap': 'dem-lo-xo-tui-doc-lap-ecopillo',
  'dem-eco-foam-da-tang': 'dem-eco-foam-da-tang-ecopillo',
  'dem-lo-xo-eco-royal': 'dem-lo-xo-cao-cap-eco-royal',
  'dem-cao-su-thien-nhien-eco-latex': 'dem-cao-su-thien-nhien-eco-latex',
  // Có giá từ 05/11/2026: dùng lại trang divan của web cũ thay cho 301 sang Khách sạn (docs/giu-link-web-cu.md mục C)
  'divan-ecopillo': 'divan-ke-giuong-khach-san',
  // Web cũ không có trang này: link mới, không cần 301
  'bao-ve-dem-chong-tham': 'bao-ve-dem-chong-tham',
}

const productPagePath = (slug: string): string => `/san-pham/${slug}/`

export const collectionPathById = (id: string): string => COLLECTION_PATHS[id] ?? PATHS.products

export const collectionPath = (collection: Collection): string => collectionPathById(collection.id)

export const patternPath = (collection: Collection, pattern: Pattern): string => {
  const slug = PATTERN_SLUGS[`${collection.id}/${pattern.code}`]
  return slug ? productPagePath(slug) : collectionPath(collection)
}

export const singleProductPath = (productSlug: string): string =>
  productPagePath(PRODUCT_SLUGS[productSlug] ?? productSlug)

/** Tên trên link /san-pham/<tên>/ → phối màu ("eco-rosa/ER25") hoặc mã sản phẩm lẻ */
export type ProductPageTarget = { kind: 'pattern'; collectionId: string; code: string } | { kind: 'product'; slug: string }

const PRODUCT_PAGES: ReadonlyMap<string, ProductPageTarget> = new Map([
  ...Object.entries(PATTERN_SLUGS).map(([key, slug]): [string, ProductPageTarget] => {
    const [collectionId, code] = key.split('/')
    return [slug, { kind: 'pattern', collectionId, code }]
  }),
  ...Object.entries(PRODUCT_SLUGS).map(([slug, oldSlug]): [string, ProductPageTarget] => [oldSlug, { kind: 'product', slug }]),
])

export const productPageTarget = (slug: string | undefined): ProductPageTarget | undefined =>
  slug ? PRODUCT_PAGES.get(slug) : undefined

/** Trang danh mục của web cũ mở trang bộ sưu tập (đường link → mã bộ sưu tập) */
export const COLLECTION_BY_PATH: ReadonlyMap<string, string> = new Map(
  Object.entries(COLLECTION_PATHS).map(([id, path]) => [path, id]),
)

/**
 * Trang danh mục của web cũ mở danh sách sản phẩm đã lọc sẵn. Tiêu đề lấy theo tên danh mục trên web cũ.
 * `products`: chỉ hiện các sản phẩm này; `collections`: chỉ các bộ sưu tập này (và phối màu của chúng).
 */
export interface ListingPreset {
  title: string
  description: string
  category?: 'bo-chan-ga' | 'chan' | 'goi' | 'dem'
  products?: readonly string[]
  collections?: readonly string[]
}

export const LISTINGS: Readonly<Record<string, ListingPreset>> = {
  '/danh-muc-san-pham/san-pham/bo-ga-phu/': {
    title: 'Bộ ga phủ',
    description: 'Bộ ga phủ, bộ chăn ga gối Ecopillo vải Lyocell: Eco Rosa, Eco Tera, Eco Vera, Eco Sweet, Eco Liora, Eco Doris. Giá rõ theo kích thước, đặt online, thanh toán khi nhận.',
    category: 'bo-chan-ga',
    collections: ['eco-rosa', 'eco-tera', 'eco-vera', 'eco-sweet', 'eco-liora', 'eco-doris'],
  },
  '/danh-muc-san-pham/san-pham/ruot-chan-goi/': {
    title: 'Ruột chăn gối',
    description: 'Ruột chăn, ruột gối Ecopillo: Micro Fiber, Micro Plus, tơ tằm, cao su thiên nhiên, lông vũ tự nhiên. Đặt online, thanh toán khi nhận.',
    products: [
      'chan-dong-micro-fiber',
      'chan-to-tam',
      'chan-long-vu-tu-nhien',
      'ruot-goi-micro-fiber',
      'ruot-goi-micro-plus',
      'ruot-goi-to-tam',
      'ruot-goi-cao-su-thien-nhien',
      'ruot-goi-long-vu-tu-nhien',
    ],
  },
  '/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/': {
    title: 'Ruột gối nằm cao cấp',
    description: 'Ruột gối nằm Ecopillo, năm độ êm từ Micro Fiber đến lông vũ tự nhiên. Đặt online, thanh toán khi nhận.',
    category: 'goi',
  },
  '/danh-muc-san-pham/dem-ecopillo/': {
    title: 'Đệm Ecopillo',
    description: 'Đệm lò xo, đệm cao su thiên nhiên, đệm bông ép, đệm foam, topper, divan và bảo vệ đệm Ecopillo. Giá theo kích thước và độ dày, nằm thử tại hệ thống phân phối.',
    category: 'dem',
  },
  '/danh-muc-san-pham/san-pham/dem-lo-xo/': {
    title: 'Đệm lò xo',
    description: 'Đệm lò xo Ecopillo: lò xo túi độc lập, Eco Luxe, Eco Royal. Giá theo kích thước và độ dày, nằm thử tại hệ thống phân phối.',
    category: 'dem',
    products: ['dem-lo-xo-tui-doc-lap', 'dem-lo-xo-tui-cao-cap-eco-luxe', 'dem-lo-xo-eco-royal'],
  },
  '/danh-muc-san-pham/san-pham/dem-cao-su/': {
    title: 'Đệm cao su',
    description: 'Đệm cao su thiên nhiên Eco Latex của Ecopillo. Giá theo kích thước và độ dày, nằm thử tại hệ thống phân phối.',
    category: 'dem',
    products: ['dem-cao-su-thien-nhien-eco-latex'],
  },
  '/danh-muc-san-pham/san-pham/dem-bong-ep/': {
    title: 'Đệm bông ép',
    description: 'Đệm bông ép Ecopillo: Gấm Thuần Khiết gập 3, bông Nano chần foam gập 2. Giá theo kích thước và độ dày.',
    category: 'dem',
    products: ['dem-bong-gam-thuan-khiet', 'dem-bong-nano-chan-foam'],
  },
  '/danh-muc-san-pham/san-pham/dem-foam/': {
    title: 'Đệm foam',
    description: 'Đệm Eco Foam đa tầng của Ecopillo. Giá theo kích thước và độ dày, nằm thử tại hệ thống phân phối.',
    category: 'dem',
    products: ['dem-eco-foam-da-tang'],
  },
}

/**
 * Link của web cũ không có trang tương ứng trên giao diện mới: chuyển tới trang gần nghĩa nhất.
 * Trên bản thật, các dòng này phải là 301 ở máy chủ (xuất bảng: node tools/xuat-bang-chuyen-huong.mjs, gồm cả RENAMED_PATHS).
 * Dòng ghi [XÁC NHẬN] là sản phẩm web mới chưa có: Ecopillo trả lời còn bán không (docs/giu-link-web-cu.md, mục C).
 */
export const OLD_SITE_REDIRECTS: Readonly<Record<string, string>> = {
  // Trang thừa của web cũ (giỏ hàng, thanh toán, tài khoản: web cũ đã đặt noindex)
  '/cua-hang/': PATHS.products,
  '/gio-hang/': PATHS.order,
  '/thanh-toan/': PATHS.order,
  '/tai-khoan/': PATHS.order,
  '/category/blog/': PATHS.blog,
  '/thuong-hieu/ecopillo/': PATHS.products,
  '/danh-muc-san-pham/san-pham/bo-ga-chun/': COLLECTION_PATHS['eco-flora'], // Eco Flora là bộ ga chun duy nhất
  // Link web cũ tự chuyển (WordPress): giữ như web cũ
  '/danh-muc-san-pham/ruot-goi-nam-cao-cap/': '/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/',
  '/chan-ga-goi-dem/': '/chan-ga-goi-dem-cuoi-dep/',
  // Trang sản phẩm "chăn ga gối đệm khách sạn" của web cũ: nay là trang Khách sạn
  '/san-pham/chan-ga-goi-dem-khach-san/': PATHS.hotel,
  // Bộ Eco Ceno và mẫu cũ chưa có trên web mới [XÁC NHẬN]
  '/danh-muc-san-pham/bo-suu-tap-eco-ceno/': '/danh-muc-san-pham/san-pham/bo-ga-phu/',
  '/san-pham/bo-chan-ga-eco-ceno-ec01/': '/danh-muc-san-pham/san-pham/bo-ga-phu/',
  '/san-pham/bo-chan-ga-eco-ceno-ec02/': '/danh-muc-san-pham/san-pham/bo-ga-phu/',
  '/san-pham/bo-chan-ga-eco-ceno-ec03/': '/danh-muc-san-pham/san-pham/bo-ga-phu/',
  '/san-pham/bo-chan-ga-eco-ceno-ec04/': '/danh-muc-san-pham/san-pham/bo-ga-phu/',
  '/san-pham/bo-chan-ga-eco-ceno-ec05/': '/danh-muc-san-pham/san-pham/bo-ga-phu/',
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed06/': COLLECTION_PATHS['eco-doris'],
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed11/': COLLECTION_PATHS['eco-doris'],
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed12/': COLLECTION_PATHS['eco-doris'],
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed16/': COLLECTION_PATHS['eco-doris'],
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed18/': COLLECTION_PATHS['eco-doris'],
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed19/': COLLECTION_PATHS['eco-doris'],
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed21/': COLLECTION_PATHS['eco-doris'],
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-sweet-es09/': COLLECTION_PATHS['eco-sweet'],
  '/san-pham/bo-ga-chun-eco-flora-ef08/': COLLECTION_PATHS['eco-flora'],
  '/san-pham/bo-ga-chun-eco-flora-ef08-2/': COLLECTION_PATHS['eco-flora'],
  '/san-pham/bo-ga-chun-eco-flora-ef126/': COLLECTION_PATHS['eco-flora'],
  // Sản phẩm lẻ web mới chưa có [XÁC NHẬN]
  '/san-pham/dem-foam-cao-cap-nano-comfort/': '/danh-muc-san-pham/san-pham/dem-foam/',
  '/san-pham/dem-lo-xo-cao-cap-eco-premium/': '/danh-muc-san-pham/san-pham/dem-lo-xo/',
  '/san-pham/dem-lo-xo-eco-fresh/': '/danh-muc-san-pham/san-pham/dem-lo-xo/',
  '/san-pham/dem-bong-ep-cao-cap-mix-latex/': '/danh-muc-san-pham/san-pham/dem-bong-ep/',
  '/san-pham/dem-tron-cao-cap-ecopillo/': '/danh-muc-san-pham/dem-ecopillo/',
  '/san-pham/ruot-goi-dau-ecopillo/': '/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/',
  '/san-pham/chan-he-e-cool-ecopillo/': COLLECTION_PATHS['chan-he-lyocell'],
  '/san-pham/khan-tam-khan-tay-khan-mat-ecopillo/': PATHS.hotel,
  // Thẻ bài viết, trang tác giả (web cũ đã chặn /author/ trong robots.txt), khối giao diện của theme cũ
  '/tag/menh-duong-lieu-moc/': PATHS.blog,
  '/tag/menh-hoa-hop-mau-gi/': PATHS.blog,
  '/tag/menh-kim-hop-mau-gi/': PATHS.blog,
  '/tag/menh-moc-hop-mau-gi/': PATHS.blog,
  '/tag/menh-tho-hop-mau-gi/': PATHS.blog,
  '/tag/menh-thuy-hop-mau-gi/': PATHS.blog,
  '/tag/thuong-hieu-dan-dau-viet-nam-2025/': PATHS.blog,
  '/tag/vien-nghien-cuu-kinh-te-chau-a/': PATHS.blog,
  '/author/duong-ecopillo/': PATHS.blog,
  '/author/quang15lt/': PATHS.blog,
  '/blocks/bai-viet-tren-trang-chu/': PATHS.home,
  '/blocks/tuy-bien-trang-san-pham-don/': PATHS.home,
  '/blocks/chan-trang/': PATHS.home,
}

/** Link tạm của bản xem thử trước 15/10/2026 (đã gửi Ecopillo xem): đưa về link chính. Web cũ không có các link này */
const PREVIEW_REDIRECTS: Readonly<Record<string, string>> = {
  '/san-pham/': PATHS.products,
  '/khach-san/': PATHS.hotel,
  '/tin-tuc/': PATHS.blog,
  '/chinh-sach-bao-mat/': PATHS.privacy,
  '/chinh-sach-giao-hang/': '/chinh-sach-van-chuyen/',
  '/chinh-sach-doi-hang/': '/chinh-sach-doi-tra-hang-va-hoan-tien/',
  '/chinh-sach-bao-hanh/': '/chinh-sach-bao-hanh-san-pham/',
  '/ve-chung-toi/': PATHS.about,
  '/showroom/': PATHS.distribution,
  '/cau-hoi-thuong-gap/': PATHS.faq,
}



/**
 * Link cũ mang chữ chất liệu cũ → link mới cùng trang, chữ đó đổi thành "lyocell" (owner chốt 15/10/2026).
 * Là 301 ở máy chủ như bảng trên.
 */
const RENAMED_PATHS: Readonly<Record<string, string>> = {
  '/vai-tencel-la-gi/': '/vai-lyocell-la-gi/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er08/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er08/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er09/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er09/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er10/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er10/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er11/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er11/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er12/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er12/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er15/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er15/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er16/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er16/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er19/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er19/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er20/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er20/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er21/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er21/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er22/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er22/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er24/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er24/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er25/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er25/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er26/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er26/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er28/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er28/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er29/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er29/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er30/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er30/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er31/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er31/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er32/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er32/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er33/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er33/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er34/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er34/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er35/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er35/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er37/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er37/',
  '/san-pham/bo-chan-ga-tencel-eco-rosa-er39/': '/san-pham/bo-chan-ga-lyocell-eco-rosa-er39/',
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-sweet-es06/': '/san-pham/bo-ga-phu-lyocell-cao-cap-eco-sweet-es06/',
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-sweet-es08/': '/san-pham/bo-ga-phu-lyocell-cao-cap-eco-sweet-es08/',
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-sweet-es10/': '/san-pham/bo-ga-phu-lyocell-cao-cap-eco-sweet-es10/',
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed08/': '/san-pham/bo-ga-phu-lyocell-cao-cap-eco-doris-ed08/',
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed09/': '/san-pham/bo-ga-phu-lyocell-cao-cap-eco-doris-ed09/',
  '/san-pham/bo-ga-phu-tencel-cao-cap-eco-doris-ed10/': '/san-pham/bo-ga-phu-lyocell-cao-cap-eco-doris-ed10/',
  '/san-pham/chan-he-tencel-er09/': '/san-pham/chan-he-lyocell-er09/',
  '/san-pham/chan-he-tencel-er12/': '/san-pham/chan-he-lyocell-er12/',
  '/san-pham/chan-he-tencel-er16/': '/san-pham/chan-he-lyocell-er16/',
  '/san-pham/chan-he-tencel-er20/': '/san-pham/chan-he-lyocell-er20/',
  '/san-pham/chan-he-tencel-er36/': '/san-pham/chan-he-lyocell-er36/',
  '/san-pham/chan-he-tencel-er38/': '/san-pham/chan-he-lyocell-er38/',
}

/** Mọi link cũ của web cũ cần chuyển 301: dùng cho máy chủ (tools/xuat-bang-chuyen-huong.mjs) */
export const SERVER_REDIRECTS: Readonly<Record<string, string>> = { ...OLD_SITE_REDIRECTS, ...RENAMED_PATHS }

/**
 * Bảng chuyển hướng ghi vào `_redirects` lúc dựng sẵn HTML (Cloudflare Pages).
 * Gồm cả link tạm bản xem thử cũ: sau khi có `404.html`, Pages không còn trả index.html cho mọi link,
 * nên phải có 301 ở máy chủ, không chỉ `Navigate` phía trình duyệt.
 */
export const HOST_REDIRECTS: Readonly<Record<string, string>> = { ...SERVER_REDIRECTS, ...PREVIEW_REDIRECTS }

const REDIRECTS: Readonly<Record<string, string>> = HOST_REDIRECTS

/** Thêm dấu "/" cuối để tra bảng (WordPress luôn có) */
export const withSlash = (path: string): string => (path.endsWith('/') ? path : `${path}/`)

/**
 * Đích chuyển hướng của một đường link, hoặc undefined nếu link không nằm trong bảng.
 * Ngoài bảng: trang phân trang của web cũ (/category/tin-tuc/page/2/…) về trang đầu, /tai-khoan/… về đặt hàng,
 * và link tạm /san-pham/<bộ>/<mã>/, /san-pham/<bộ hoặc sản phẩm>/ của bản xem thử cũ.
 */
export const redirectFor = (rawPath: string, collections: readonly Collection[]): string | undefined => {
  const path = withSlash(rawPath)
  if (REDIRECTS[path]) return REDIRECTS[path]
  const paged = path.match(/^(.*\/)page\/\d+\/$/)
  if (paged) return paged[1] === '/' ? PATHS.blog : (REDIRECTS[paged[1]] ?? paged[1])
  if (path.startsWith('/tai-khoan/')) return PATHS.order
  const interim = path.match(/^\/san-pham\/([^/]+)\/(?:([^/]+)\/)?$/)
  if (!interim) return undefined
  const collection = collections.find((c) => c.id === interim[1])
  if (collection) {
    const pattern = interim[2] ? collection.patterns.find((p) => p.code.toLowerCase() === interim[2].toLowerCase()) : undefined
    return pattern ? patternPath(collection, pattern) : collectionPath(collection)
  }
  if (!interim[2] && PRODUCT_SLUGS[interim[1]] && PRODUCT_SLUGS[interim[1]] !== interim[1]) return singleProductPath(interim[1])
  return undefined
}

/** Trang có thanh mua riêng ở đáy (giá + gọi/Zalo): trang sản phẩm, trang bộ sưu tập */
export const hasOwnBuyBar = (pathname: string): boolean =>
  pathname.startsWith('/san-pham/') || COLLECTION_BY_PATH.has(withSlash(pathname))
