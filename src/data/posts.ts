import { patternImage, type ImageSource } from './catalog'
import { CODE_POST_SHOW_FIELD, codePostBodyKey, codePostKey } from './codePostKeys'
import { productsUrl } from './links'
import { liveList, liveObject, type EditableField, type EditableImage, type EditableSet } from './liveContent'
import { knownLabel, POST_SECTIONS, SECTION_LABELS, type PostLabel, type PostSection } from './postSections'

/**
 * Bài viết (biên bản mục 49: 59 bài trên web cũ chuyển sang, GIỮ NGUYÊN đường link, chỉ đổi giao diện).
 * Trên WordPress, danh sách này lấy thẳng từ bài viết đang có; 3 bài dưới đây là bài mẫu để dựng giao diện
 * và có thể đăng thật sau khi Ecopillo duyệt. Bài đầu là bài cũ đổi tên chất liệu thành Lyocell, link cũ chuyển 301 sang đây
 * (owner chốt 15/10/2026, bảng RENAMED_PATHS trong links.ts).
 */

export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'tip'; text: string }
  /** Ảnh trong thân bài (Ecopillo thêm ở Nội dung web), chú thích dưới ảnh nếu có */
  | { type: 'img'; image: ImageSource; caption?: string }
  /** Trích dẫn (câu nói của khách, của chuyên gia…) */
  | { type: 'quote'; text: string }

/** Bài lấy từ WordPress (src/data/allPosts.ts): ngày đăng, tiêu đề và mô tả Yoast giữ như web cũ (docs/giu-link-web-cu.md) */
export interface WordPressInfo {
  date: string
  modified: string
  /** Tiêu đề Yoast (bỏ đuôi tên web): thẻ <title> */
  metaTitle: string
  /** Mô tả Google (Yoast, không thì đoạn trích), tối đa 155 ký tự */
  description: string
  /** Bài Ecopillo đăng mới / sửa trong WordPress sau lần dựng (livePosts.ts): thân bài nạp từ file plugin ghi */
  live?: boolean
}

export interface Post {
  /** Trang Ecopillo tự tạo trong WordPress (đợt G): hiện bằng khung bài viết, không có ngày, mục, bài liên quan */
  isPage?: boolean
  slug: string
  title: string
  excerpt: string
  /** "Tin tức", "Cẩm nang" hoặc một chủ đề Cẩm nang (postSections.ts; allPosts.ts xếp lại theo bảng và ô "Mục trên web") */
  category: PostLabel
  /** Có ở bài lấy từ WordPress: thân bài là HTML đã làm sạch, nạp riêng từng bài (components/blog/WordPressBody.tsx) */
  wp?: WordPressInfo
  /** Bài dựng sẵn: mô tả trên Google Ecopillo điền ở Nội dung web (không có thì dùng `excerpt`) */
  seoDescription?: string
  readMinutes: number
  cover: ImageSource
  /** Bộ sưu tập gợi ý ở cuối bài */
  related?: readonly { label: string; to: string }[]
  /**
   * Bài nói về nhóm sản phẩm nào ('bo-chan-ga', 'chan', 'goi', 'dem', hoặc mã nhóm Ecopillo thêm ở bộ Nhóm sản phẩm) hoặc 'chinh-sach'.
   * Dùng cho khối "Khám phá thêm": bài hiện ở cuối trang sản phẩm cùng nhóm (src/data/related.ts)
   */
  topics?: readonly string[]
  body: readonly PostBlock[]
}

/** Bản trong code của 3 bài dựng sẵn; web dùng POSTS (đã ghép phần Ecopillo sửa, bỏ bài đã ẩn) */
const BASE_POSTS: readonly Post[] = [
  {
    slug: 'vai-lyocell-la-gi',
    title: 'Vải Lyocell là gì? Vì sao nằm mát và mềm như lụa',
    excerpt:
      'Lyocell là sợi làm từ bột gỗ. Bài này giải thích sợi được làm ra thế nào, vì sao nằm mát, và cách phân biệt khi mua chăn ga.',
    category: 'Chọn chăn ga gối đệm',
    topics: ['bo-chan-ga', 'chan'],
    readMinutes: 5,
    cover: patternImage('ER25', 'Bộ chăn ga Lyocell Eco Rosa ER25 trải trên giường'),
    related: [
      { label: 'Bộ chăn ga Lyocell', to: productsUrl({ 'danh-muc': 'bo-chan-ga' }) },
      { label: 'Chăn hè Lyocell', to: productsUrl({ 'danh-muc': 'chan' }) },
    ],
    body: [
      {
        type: 'p',
        text: 'Lyocell là sợi tái tạo từ cellulose, tức phần xơ có trong gỗ cây. Gỗ được nghiền thành bột, hoà tan trong dung môi rồi kéo thành sợi.',
      },
      { type: 'h2', text: 'Sợi Lyocell được làm ra thế nào' },
      {
        type: 'p',
        text: 'Điểm khác của Lyocell so với nhiều loại sợi khác là quy trình khép kín: dung môi dùng để hoà tan bột gỗ được thu hồi và dùng lại gần như hoàn toàn, nên ít chất thải ra môi trường. Nguồn gỗ thường là bạch đàn, sồi hoặc thông từ rừng trồng.',
      },
      { type: 'h2', text: 'Vì sao nằm mát, mềm' },
      {
        type: 'list',
        items: [
          'Hút ẩm và thoát ẩm nhanh: mồ hôi được kéo khỏi da, lưng khô thoáng suốt đêm.',
          'Bề mặt sợi trơn, mịn: chạm vào mát tay, rủ nhẹ theo dáng giường.',
          'Thoáng khí: phù hợp khí hậu nóng ẩm của Việt Nam, đặc biệt mùa hè.',
          'Ít tĩnh điện, ít bám bụi: dễ chịu cho da nhạy cảm và trẻ nhỏ.',
        ],
      },
      { type: 'h2', text: 'Lyocell khác cotton thế nào' },
      {
        type: 'p',
        text: 'Cotton bền, dễ giặt nhưng khi đổ mồ hôi thì giữ ẩm lâu hơn và bề mặt nhám hơn. Lyocell mềm mượt hơn, mát hơn khi chạm vào và thoát ẩm nhanh hơn, đổi lại cần giặt nhẹ nhàng hơn để giữ độ bóng mịn.',
      },
      {
        type: 'tip',
        text: 'Khi mua, hãy hỏi tỉ lệ sợi Lyocell trong vải và xem tem thành phần. Chạm tay vào mặt vải: Lyocell thật mát, trơn và rủ, không cứng như vải pha nhiều polyester.',
      },
    ],
  },
  {
    slug: 'cach-chon-kich-thuoc-ga-giuong',
    title: 'Cách chọn kích thước ga giường cho vừa khít đệm',
    excerpt:
      'Đo đúng ba số dài, rộng, dày của đệm là chọn được ga vừa khít. Hướng dẫn đo nhanh, cách chọn ga chun hay ga phủ, và bảng cỡ phổ biến.',
    category: 'Chọn chăn ga gối đệm',
    topics: ['bo-chan-ga', 'dem'],
    readMinutes: 4,
    cover: patternImage('ED10', 'Ga phủ trắng trải phẳng, vừa khít đệm'),
    related: [{ label: 'Xem bộ chăn ga', to: productsUrl({ 'danh-muc': 'bo-chan-ga' }) }],
    body: [
      {
        type: 'p',
        text: 'Ga rộng quá sẽ nhăn, xô lệch khi nằm; chật quá thì khó bọc và nhanh bai chun. Chỉ cần đo đúng ba số của đệm là chọn được ga vừa khít.',
      },
      { type: 'h2', text: 'Đo đệm trong một phút' },
      {
        type: 'list',
        items: [
          'Chiều rộng: đo ngang mặt đệm, ví dụ 160 cm hoặc 180 cm.',
          'Chiều dài: đo dọc mặt đệm, thường là 200 cm.',
          'Độ dày: đo từ mặt trên xuống mặt dưới đệm, cộng thêm topper nếu có.',
        ],
      },
      { type: 'h2', text: 'Các cỡ phổ biến' },
      {
        type: 'list',
        items: [
          'Giường 1m6: ga 160 × 200 cm.',
          'Giường 1m8: ga 180 × 200 cm.',
          'Giường 2m2: ga 200 × 220 cm.',
          'Vỏ chăn trong bộ chăn ga thường là 200 × 220 cm.',
        ],
      },
      { type: 'h2', text: 'Ga chun hay ga phủ' },
      {
        type: 'p',
        text: 'Ga chun bọc kín đệm, gọn và không xô lệch, hợp với nhà có trẻ nhỏ. Ga phủ chần trải trùm lên mặt giường, nhìn sang và đầy đặn hơn. Đệm dày trên 25 cm nên báo trước để chọn ga có vạt sâu.',
      },
      {
        type: 'tip',
        text: 'Giường kích thước lạ? Ecopillo nhận may chăn ga theo số đo riêng. Gửi ba số dài × rộng × dày qua Zalo để được báo giá.',
      },
    ],
  },
  {
    slug: 'cach-giat-va-bao-quan-chan-ga-lyocell',
    title: 'Giặt và bảo quản chăn ga Lyocell để luôn mềm mát',
    excerpt:
      'Vài thói quen nhỏ khi giặt, phơi, cất giữ giúp chăn ga Lyocell giữ độ bóng mịn và bền màu qua nhiều năm.',
    category: 'Chọn chăn ga gối đệm',
    topics: ['bo-chan-ga', 'chan', 'chinh-sach'],
    readMinutes: 3,
    cover: patternImage('EF06', 'Bộ ga chun Lyocell Eco Flora EF06 trải phẳng sau khi giặt'),
    related: [{ label: 'Chính sách bảo hành', to: '/chinh-sach-bao-hanh-san-pham/' }],
    body: [
      {
        type: 'p',
        text: 'Lyocell mềm và mát nhờ bề mặt sợi trơn mịn. Giặt đúng cách giữ được bề mặt ấy, giặt mạnh tay sẽ làm vải nhanh xỉn và xù.',
      },
      { type: 'h2', text: 'Khi giặt' },
      {
        type: 'list',
        items: [
          'Giặt riêng lần đầu, lộn trái vỏ chăn, vỏ gối, kéo khoá trước khi giặt.',
          'Nước lạnh hoặc ấm dưới 30°C, chế độ giặt nhẹ, quay vắt nhẹ.',
          'Dùng nước giặt trung tính, không dùng thuốc tẩy, hạn chế nước xả đậm đặc.',
        ],
      },
      { type: 'h2', text: 'Khi phơi, là' },
      {
        type: 'list',
        items: [
          'Phơi nơi thoáng, tránh nắng gắt trực tiếp để giữ màu.',
          'Không sấy nhiệt cao. Nếu cần là, để nhiệt thấp, là mặt trái.',
        ],
      },
      { type: 'h2', text: 'Khi cất giữ' },
      {
        type: 'p',
        text: 'Gấp khi vải đã khô hẳn, cất nơi khô ráo, có thể bỏ túi vải thoáng khí. Không để chung với long não đặt sát mặt vải.',
      },
      {
        type: 'tip',
        text: 'Luôn xem nhãn hướng dẫn trên từng sản phẩm. Hư hỏng do giặt, sấy sai hướng dẫn không thuộc diện bảo hành.',
      },
    ],
  },
]

/* ---------------------------------------------------------------- Ecopillo tự sửa (Nội dung web → "Bài viết dựng sẵn") */

/**
 * Ba bài trên không nằm trong mục Bài viết của WordPress, nên Ecopillo sửa ở Nội dung web (owner: khách sửa được 100% web):
 * mỗi bài hai bộ, "thông tin" (Hiện / Ẩn, tiêu đề, giới thiệu, mô tả Google, ảnh bìa, mục, số phút đọc, link cuối bài,
 * nhóm sản phẩm) và "thân bài" (danh sách khối: thêm, xoá, Lên / Xuống). Chưa lưu thì dùng đúng bản trong code
 * (HTML dựng sẵn không đổi); lưu khác bản gốc thì main.tsx vẽ lại (markLiveDiffers trong liveObject / liveList).
 * Bài ẩn: bỏ khỏi POSTS (Tin tức, tìm kiếm, bài liên quan, sự kiện trang chủ), link chuyển về trang Tin tức
 * (links.ts hiddenPageTarget; máy chủ trả 301: trang-wp.php eco_tw_code_posts). Tiêu đề, mô tả, ảnh bìa đã sửa
 * cũng được máy chủ ghi vào HTML trả về (eco_tw_seo_map).
 */
export const CODE_POST_GROUP = 'Bài viết dựng sẵn'

const SECTION_KEYS = Object.keys(SECTION_LABELS) as PostSection[]
const TOPICS = ['bo-chan-ga', 'chan', 'goi', 'dem', 'chinh-sach'] as const

const META_FIELDS: readonly EditableField[] = [
  CODE_POST_SHOW_FIELD,
  { khoa: 'tieuDe', nhan: 'Tiêu đề bài', kieu: 'chu', batBuoc: true, goiY: 'Cũng là tiêu đề tab và tiêu đề trên Google (web tự thêm " · Ecopillo").' },
  { khoa: 'gioiThieu', nhan: 'Đoạn giới thiệu', kieu: 'doan', batBuoc: true, goiY: 'Hiện dưới tiêu đề bài và trên thẻ bài ở trang Tin tức.' },
  { khoa: 'moTaGoogle', nhan: 'Mô tả trên Google', kieu: 'doan', goiY: 'Để trống thì dùng đoạn giới thiệu. Nên dưới 160 chữ cái.' },
  { khoa: 'anhBia', nhan: 'Ảnh bìa', kieu: 'anh', batBuoc: true, goiY: 'Ảnh ngang (khung 16:9), cũng là ảnh trên thẻ bài và khi chia sẻ.' },
  {
    khoa: 'muc',
    nhan: 'Mục trên web',
    kieu: 'chon',
    batBuoc: true,
    luaChon: SECTION_KEYS,
    nhanLuaChon: SECTION_KEYS.map((k) => SECTION_LABELS[k]),
    goiY: 'Nhóm của bài ở trang Tin tức (Tin tức, hoặc một chủ đề Cẩm nang).',
  },
  { khoa: 'phutDoc', nhan: 'Số phút đọc', kieu: 'so', batBuoc: true, goiY: 'Số nguyên từ 1 đến 120, ví dụ 5.' },
  {
    khoa: 'quanTam',
    nhan: 'Link cuối bài ("Có thể Quý khách quan tâm")',
    kieu: 'ds-cap',
    cap: ['nhan', 'link'],
    nhanCap: ['Chữ trên nút', 'Link'],
    goiY: 'Mỗi dòng: Chữ trên nút | link trong web, ví dụ: Bộ chăn ga Lyocell | /danh-muc-san-pham/san-pham/?danh-muc=bo-chan-ga. Để trống thì không có khối này.',
  },
  {
    khoa: 'nhomSanPham',
    nhan: 'Hiện ở cuối trang sản phẩm thuộc nhóm',
    kieu: 'chon-nhieu',
    luaChon: TOPICS,
    nhanLuaChon: ['Bộ chăn ga', 'Chăn', 'Gối', 'Đệm', 'Trang chính sách'],
    // Nhóm Ecopillo thêm ở Nội dung web → Sản phẩm → Nhóm sản phẩm cũng chọn được (đợt H)
    luaChonThem: [{ nguon: 'nhom' }],
    goiY: 'Bài hiện trong khối "Khám phá thêm" ở cuối trang sản phẩm (trang chính sách) thuộc các nhóm đã tích.',
  },
]

interface MetaRow {
  hien: string
  tieuDe: string
  gioiThieu: string
  moTaGoogle?: string
  anhBia: EditableImage
  muc: string
  phutDoc: number
  quanTam?: readonly { nhan: string; link: string }[]
  nhomSanPham?: readonly string[]
}

const BLOCK_KINDS = ['doan', 'tieu-de', 'ds', 'meo', 'anh', 'trich'] as const

const BODY_FIELDS: readonly EditableField[] = [
  {
    khoa: 'loai',
    nhan: 'Kiểu khối',
    kieu: 'chon',
    batBuoc: true,
    luaChon: BLOCK_KINDS,
    nhanLuaChon: ['Đoạn văn', 'Tiêu đề mục', 'Danh sách gạch đầu dòng', 'Khung mẹo (nền xanh nhạt)', 'Ảnh', 'Trích dẫn'],
  },
  {
    khoa: 'chu',
    nhan: 'Chữ',
    kieu: 'doan',
    goiY: 'Đoạn văn, tiêu đề mục, khung mẹo, trích dẫn: chữ ở đây. Ảnh: chú thích dưới ảnh (để trống thì không có). Danh sách: bỏ trống.',
  },
  { khoa: 'ds', nhan: 'Các ý của danh sách', kieu: 'ds-dong', goiY: 'Chỉ cho kiểu "Danh sách gạch đầu dòng": mỗi dòng một ý.' },
  { khoa: 'anh', nhan: 'Ảnh', kieu: 'anh', goiY: 'Chỉ cho kiểu "Ảnh". Khối thiếu chữ (hoặc thiếu ảnh, thiếu ý) không hiện trên web.' },
]

interface BodyRow {
  loai: string
  chu?: string
  ds?: readonly string[]
  anh?: EditableImage
}

/** Link cuối bài: trong web (/…) hoặc https://… */
const isPostLink = (v: string): boolean => /^(https:\/\/|\/(?!\/))/.test(v) && !/[\s<>"]/.test(v)

const toRow = (block: PostBlock): BodyRow => {
  switch (block.type) {
    case 'h2':
      return { loai: 'tieu-de', chu: block.text }
    case 'list':
      return { loai: 'ds', ds: block.items }
    case 'tip':
      return { loai: 'meo', chu: block.text }
    case 'quote':
      return { loai: 'trich', chu: block.text }
    case 'img':
      return { loai: 'anh', ...(block.caption ? { chu: block.caption } : {}), anh: { src: block.image.src, srcSet: block.image.srcSet, alt: block.image.alt } }
    default:
      return { loai: 'doan', chu: block.text }
  }
}

/** Khối Ecopillo sửa → khối trên web; khối thiếu chữ / ảnh / ý thì bỏ */
const toBlock = (row: BodyRow): PostBlock | undefined => {
  const text = row.chu?.trim() ?? ''
  switch (row.loai) {
    case 'tieu-de':
      return text ? { type: 'h2', text } : undefined
    case 'ds':
      return row.ds?.length ? { type: 'list', items: row.ds } : undefined
    case 'meo':
      return text ? { type: 'tip', text } : undefined
    case 'trich':
      return text ? { type: 'quote', text } : undefined
    case 'anh':
      return row.anh?.src ? { type: 'img', image: row.anh, ...(text ? { caption: text } : {}) } : undefined
    default:
      return text ? { type: 'p', text } : undefined
  }
}

/** Thông tin bài dạng ô sửa; ô không có giá trị thì không có khoá (bản lưu chưa đổi so khớp đúng bản gốc) */
const metaOf = (post: Post): MetaRow => ({
  hien: 'co',
  tieuDe: post.title,
  gioiThieu: post.excerpt,
  ...(post.seoDescription ? { moTaGoogle: post.seoDescription } : {}),
  anhBia: { src: post.cover.src, srcSet: post.cover.srcSet, alt: post.cover.alt },
  muc: POST_SECTIONS[post.slug] ?? SECTION_KEYS.find((k) => SECTION_LABELS[k] === post.category) ?? 'chon-chan-ga',
  phutDoc: post.readMinutes,
  ...(post.related?.length ? { quanTam: post.related.map((r) => ({ nhan: r.label, link: r.to })) } : {}),
  ...(post.topics?.length ? { nhomSanPham: post.topics } : {}),
})

/** Bài sau khi ghép thông tin Ecopillo đã sửa (thông tin chưa đổi thì giữ nguyên bài gốc) */
function withMeta(base: Post, meta: MetaRow, body: readonly PostBlock[]): Post {
  const related = (meta.quanTam ?? []).filter((r) => isPostLink(r.link)).map((r) => ({ label: r.nhan, to: r.link }))
  // Ô chọn đã kiểm giá trị theo lựa chọn (cả nhóm Ecopillo thêm); nhóm đã xoá thì related.ts tự bỏ
  const topics = meta.nhomSanPham ?? []
  const section = SECTION_KEYS.find((k) => k === meta.muc)
  const minutes = Math.round(meta.phutDoc)
  return {
    slug: base.slug,
    title: meta.tieuDe,
    excerpt: meta.gioiThieu,
    // Chủ đề Ecopillo đã xoá ở Nội dung web: bài về nhóm Cẩm nang
    category: knownLabel(section ? SECTION_LABELS[section] : base.category),
    readMinutes: minutes >= 1 && minutes <= 120 ? minutes : base.readMinutes,
    cover: meta.anhBia.src ? meta.anhBia : base.cover,
    ...(meta.moTaGoogle ? { seoDescription: meta.moTaGoogle } : {}),
    ...(related.length ? { related } : {}),
    ...(topics.length ? { topics } : {}),
    body,
  }
}

function editablePost(base: Post): { sets: readonly [EditableSet, EditableSet]; post: Post | undefined } {
  const metaBase = metaOf(base)
  const shortTitle = base.title.split(/[?:]/)[0].trim()
  const metaSet: EditableSet = {
    khoa: codePostKey(base.slug),
    nhom: CODE_POST_GROUP,
    ten: `Bài "${shortTitle}": thông tin`,
    moTa: `Hiện / Ẩn, tiêu đề, giới thiệu, mô tả Google, ảnh bìa, mục, số phút đọc của bài /${base.slug}/ (bài này không nằm trong mục Bài viết).`,
    kieu: 'mot',
    // Màn hình sửa cần đủ ô (ô trống vẫn hiện)
    goc: { moTaGoogle: '', quanTam: [], nhomSanPham: [], ...metaBase },
    truong: META_FIELDS,
  }
  const bodyBase: readonly BodyRow[] = base.body.map(toRow)
  const bodySet: EditableSet = {
    khoa: codePostBodyKey(base.slug),
    nhom: CODE_POST_GROUP,
    ten: `Bài "${shortTitle}": thân bài`,
    moTa: 'Từng khối của thân bài theo thứ tự trên web: đoạn văn, tiêu đề mục, danh sách, khung mẹo, ảnh, trích dẫn. Thêm, xoá, Lên / Xuống để đổi chỗ.',
    kieu: 'nhieu',
    goc: bodyBase,
    tieuDeDong: 'chu',
    truong: BODY_FIELDS,
  }
  const sets = [metaSet, bodySet] as const

  const meta = liveObject(metaSet.khoa, metaBase, META_FIELDS)
  if (meta.hien === 'khong') return { sets, post: undefined }
  const rows = liveList<BodyRow>(bodySet.khoa, bodyBase, BODY_FIELDS, () => ({ loai: 'doan' }))
  const edited = rows === bodyBase ? base.body : rows.map(toBlock).filter((b): b is PostBlock => b !== undefined)
  const body = edited.length ? edited : base.body
  if (meta === metaBase) return { sets, post: body === base.body ? base : { ...base, body } }
  return { sets, post: withMeta(base, meta, body) }
}

const EDITABLE = BASE_POSTS.map(editablePost)

/** Mọi bộ "Bài viết dựng sẵn" (đăng ký ở src/data/contentFrame.ts): mỗi bài một bộ thông tin + một bộ thân bài */
export const CODE_POST_SETS: readonly EditableSet[] = EDITABLE.flatMap((e) => e.sets)

/** Tên link của cả 3 bài dựng sẵn, kể cả bài đã ẩn (allPosts.ts: bài WordPress trùng tên không thay bài này) */
export const CODE_POST_SLUGS: readonly string[] = BASE_POSTS.map((p) => p.slug)

/** Bài dựng sẵn đang hiện, đã ghép phần Ecopillo sửa */
export const POSTS: readonly Post[] = EDITABLE.map((e) => e.post)
  .filter((p): p is Post => p !== undefined)
  // Chủ đề gốc của bài mà Ecopillo đã xoá ở Nội dung web: bài về nhóm Cẩm nang
  .map((p) => (knownLabel(p.category) === p.category ? p : { ...p, category: knownLabel(p.category) }))

export const postBySlug = (slug: string | undefined): Post | undefined => POSTS.find((p) => p.slug === slug)

/** Bài viết nằm ở gốc web như WordPress cũ: ecopillo.com.vn/ten-bai/ */
export const postPath = (p: Post): string => `/${p.slug}/`

