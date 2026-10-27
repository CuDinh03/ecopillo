import { patternImage, type ImageSource } from './catalog'
import { productsUrl } from './links'

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

export interface Post {
  slug: string
  title: string
  excerpt: string
  category: PostCategory
  readMinutes: number
  cover: ImageSource
  /** Bộ sưu tập gợi ý ở cuối bài */
  related?: readonly { label: string; to: string }[]
  /**
   * Bài nói về nhóm sản phẩm nào ('bo-chan-ga', 'chan', 'goi', 'dem') hoặc 'chinh-sach'.
   * Dùng cho khối "Khám phá thêm": bài hiện ở cuối trang sản phẩm cùng nhóm (src/data/related.ts)
   */
  topics?: readonly ('bo-chan-ga' | 'chan' | 'goi' | 'dem' | 'chinh-sach')[]
  body: readonly PostBlock[]
}

export const POST_CATEGORIES = ['Chất liệu', 'Hướng dẫn chọn', 'Chăm sóc, bảo quản'] as const
export type PostCategory = (typeof POST_CATEGORIES)[number]

export const POSTS: readonly Post[] = [
  {
    slug: 'vai-lyocell-la-gi',
    title: 'Vải Lyocell là gì? Vì sao nằm mát và mềm như lụa',
    excerpt:
      'Lyocell là sợi làm từ bột gỗ. Bài này giải thích sợi được làm ra thế nào, vì sao nằm mát, và cách phân biệt khi mua chăn ga.',
    category: 'Chất liệu',
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
    category: 'Hướng dẫn chọn',
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
    category: 'Chăm sóc, bảo quản',
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

export const postBySlug = (slug: string | undefined): Post | undefined => POSTS.find((p) => p.slug === slug)

/** Bài viết nằm ở gốc web như WordPress cũ: ecopillo.com.vn/ten-bai/ */
export const postPath = (p: Post): string => `/${p.slug}/`

