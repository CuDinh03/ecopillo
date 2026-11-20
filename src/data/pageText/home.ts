import { anh, chu, definePageText, doan, dsCap } from './define'

/** Ảnh tĩnh không có bản nhỏ (srcSet rỗng như staticImage trong catalog.ts) */
const img = (src: string, alt: string) => ({ src, srcSet: '', alt })

/**
 * Chữ, ảnh trang chủ (trừ banner, đã có bộ riêng; chữ dùng chung với trang Giới thiệu, Khách sạn nằm ở bộ của trang đó).
 * Chữ gốc giữ nguyên từng ý đã được duyệt (ghi chú nguồn ở component từng khối).
 */
export const { set: HOME_TEXT_SET, text: HOME_TEXT } = definePageText(
  'trang-chu',
  'Trang chủ',
  'Tiêu đề, đoạn dẫn, ảnh các khối trang chủ: dải cam kết, chất liệu, về chúng tôi, ruột chăn gối, sự kiện, khách sạn, hệ thống phân phối, hỏi đáp, nhận xét. Banner sửa ở bộ Banner, phim ở bộ Phim thương hiệu.',
  {
    moTaGoogle: doan(
      'Mô tả trang chủ trên Google, Zalo, Facebook',
      'Chăn ga gối đệm Ecopillo mang giấc ngủ chất lượng cùng trải nghiệm tuyệt vời đến hàng triệu gia đình Việt một cách nhanh chóng và dễ dàng nhất.',
      'Khoảng 150 chữ cái, hiện dưới tiêu đề khi gửi link',
    ),
    heSinhThai: chu('Dải dưới banner: tiêu đề ô Hệ sinh thái', 'Hệ sinh thái sản phẩm'),
    heSinhThaiPhu: chu('Dải dưới banner: chữ phụ sau tiêu đề (máy tính)', 'cho giấc ngủ trọn vẹn'),
    heSinhThaiO: dsCap(
      'Dải dưới banner: 4 ô Hệ sinh thái',
      ['name', 'text'],
      ['Tên ô', 'Câu hiện khi rê chuột'],
      [
        { name: 'Chăn', text: 'Nhẹ nhàng, ấm áp' },
        { name: 'Ga', text: 'Mềm mại, thoáng mát' },
        { name: 'Gối', text: 'Nâng niu từng giấc ngủ' },
        { name: 'Đệm', text: 'Nâng đỡ chuẩn cột sống' },
      ],
      'Đúng 4 dòng, theo thứ tự Chăn, Ga, Gối, Đệm (mỗi ô dẫn tới nhóm sản phẩm đó)',
    ),
    giaTriTieuDe: chu('Dải dưới banner: tiêu đề ô Tốt · Thật · Thiện', 'Vì một giấc ngủ chất lượng hơn'),
    giaTri: dsCap(
      'Dải dưới banner: 3 ô Tốt · Thật · Thiện',
      ['word', 'text'],
      ['Chữ to', 'Câu ngắn'],
      [
        { word: 'Tốt', text: 'trong chất lượng' },
        { word: 'Thật', text: 'trong cam kết' },
        { word: 'Thiện', text: 'với thiên nhiên' },
      ],
    ),
    // Owner 18/11/2026: "hàng trăm nghìn" thay 15.000 (tên chương trình "Tri ân 15.000 khách hàng" giữ nguyên).
    // Chị Phương 18/11/2026: TQC thay bằng QCVN 01:2017/BCT; dấu cách không ngắt (\u00a0) giữ mỗi mã liền một dòng.
    // Ô cuối: trải nghiệm chăn ga tại nhà theo thông báo Ecopillo từ 07/08/2026 (paymentPolicy.ts)
    camKet: dsCap(
      'Dải cam kết (5 ô có biểu tượng)',
      ['title', 'text'],
      ['Chữ đậm', 'Câu dưới (máy tính)'],
      [
        { title: '15+ năm trong nghề', text: 'Hàng trăm nghìn gia đình tin dùng' },
        { title: 'ISO 9001:2015 · QCVN 01:2017/BCT', text: 'Quy trình sản xuất được chứng nhận' },
        { title: 'Đường may 4 mũi/cm', text: 'Chắc, phẳng, bền qua nhiều lần giặt' },
        { title: 'May theo kích thước', text: 'Vừa khít mọi chiếc giường' },
        { title: 'Trải nghiệm tại nhà', text: 'Chăn ga: Hà Nội, TP. HCM mọi đơn; tỉnh khác từ 20 triệu' },
      ],
      'Biểu tượng theo thứ tự: huy chương, chứng nhận, đường may, thước, xe giao hàng',
    ),
    chatLieuTieuDe: chu('Khối chất liệu: tiêu đề', 'Từ thiên nhiên đến giấc ngủ'),
    soKhach: chu('Khối chất liệu: chữ to trong ô số khách', 'Hàng trăm nghìn'),
    soKhachChu: chu('Khối chất liệu: câu cạnh chữ to', 'gia đình, khách sạn và resort đã chọn Ecopillo cho phòng ngủ của mình.'),
    lyocellNhan: chu('Ô Lyocell: nhãn nhỏ', 'Chất liệu'),
    lyocellTieuDe: chu('Ô Lyocell: tiêu đề', 'Lyocell từ sợi gỗ tự nhiên'),
    anhLyocell: anh('Ô Lyocell: ảnh', img('/images/details/lyocell-et01.webp', 'Cận mặt vải Lyocell trơn bộ Eco Tera ET01')),
    theuTieuDe: chu('Ô chần thêu: tiêu đề', 'Chần thêu độc quyền'),
    theuChu: doan('Ô chần thêu: đoạn', 'Họa tiết do Ecopillo tự thiết kế, chần thủ công và thêu tỉ mỉ, không trùng lặp ngoài thị trường.'),
    anhTheu: anh('Ô chần thêu: ảnh', img('/images/details/theu-ed25.webp', 'Họa tiết thêu chim và hoa trên bộ Eco Doris ED25')),
    duongMayTieuDe: chu('Ô đường may: tiêu đề', 'Đường may 4 mũi/cm'),
    duongMayChu: doan('Ô đường may: đoạn', 'Mép vải được khoá chắc, không sổ chỉ, giữ form đẹp sau nhiều năm.'),
    anhDuongMay: anh('Ô đường may: ảnh', img('/images/details/duong-may-ed25.webp', 'Cận mép chăn và đường chần bộ Eco Doris ED25')),
    jacquardTieuDe: chu('Ô dệt Jacquard: tiêu đề', 'Dệt Jacquard'),
    jacquardChu: doan('Ô dệt Jacquard: đoạn', 'Ở dòng Eco Sweet, hoa văn được dệt thẳng vào sợi, nổi khối tinh tế.'),
    anhJacquard: anh(
      'Ô dệt Jacquard: ảnh',
      img('/images/details/jacquard-es06.webp', 'Logo Ecopillo thêu trên vải dệt Jacquard hoa văn chìm, bộ Eco Sweet ES06'),
    ),
    veChungToiTieuDe: chu('Về chúng tôi: tiêu đề', 'Từ trái tim một người làm nghề lâu năm'),
    nguoiSangLap: doan(
      'Về chúng tôi: đoạn về người sáng lập',
      'Người đặt nền móng cho thương hiệu là chị Phạm Thị Phương, hơn 15 năm trong nghề chăn ga, từ sản xuất đến bán lẻ. Chị luôn trăn trở làm sao để mỗi sản phẩm giúp khách hàng tạo dựng một “Chốn Yên”: nơi giấc ngủ lành mạnh được vun đắp và cơ thể được phục hồi trọn vẹn.',
      'Tên "chị Phạm Thị Phương" tự in đậm',
    ),
    anhChungNhan1: anh('Về chúng tôi: logo chứng nhận thứ nhất (ô Danh hiệu)', img('/images/partners/iso-9001.webp', 'Chứng nhận ISO 9001:2015')),
    anhChungNhan2: anh('Về chúng tôi: logo chứng nhận thứ hai (ô Danh hiệu)', img('/images/partners/tqc.webp', 'Chứng nhận TQC')),
    ruotTieuDe: chu('Ruột chăn gối: tiêu đề', 'Ruột chăn, ruột gối và phụ kiện'),
    ruotDanDat: doan(
      'Ruột chăn gối: đoạn dẫn',
      'Phần êm ái bên trong. Chọn độ êm hợp với thói quen ngủ của Quý khách: đặt online ngay, hoặc ghé cửa hàng Ecopillo để nằm thử từng loại gối.',
    ),
    ruotGhiChu: doan(
      'Ruột chăn gối: dòng ghi chú cuối khối (số Zalo tự thêm sau)',
      'Ruột gối, ruột chăn, topper và phụ kiện đều đặt online được; nhân viên gọi xác nhận trước khi giao. Cần tư vấn độ êm? Gọi hoặc nhắn Zalo',
    ),
    chanHeTen: chu('Ruột chăn gối: tên nhóm chăn hè', 'Chăn hè Lyocell'),
    suKienTieuDe: chu('Sự kiện: tiêu đề', 'Ecopillo đồng hành'),
    suKienDanDat: doan('Sự kiện: đoạn dẫn', 'Những chương trình, sự kiện Ecopillo góp mặt cùng cộng đồng và các đơn vị bạn.'),
    khachSanTieuDe: chu('Khách sạn: tiêu đề', 'Giấc ngủ năm sao cho khách lưu trú'),
    khachSanNutGoi: chu('Khách sạn: chữ nút gọi', 'Gọi nhận báo giá'),
    khachSanNutZalo: chu('Khách sạn: chữ nút Zalo', 'Gửi yêu cầu qua Zalo'),
    doiTacNhan: chu('Khách sạn: nhãn hàng logo đối tác', 'Đối tác'),
    phanPhoiTieuDe: chu('Hệ thống phân phối: tiêu đề', 'Hệ thống phân phối'),
    phanPhoiDanDat: doan(
      'Hệ thống phân phối: đoạn dẫn',
      'Chạm tay vào chất vải tại Ecopillo: cảm nhận độ mềm mát của vải Lyocell, nằm thử gối và đệm, được tư vấn mẫu hợp với phòng ngủ của Quý khách.',
    ),
    phanPhoiNutGoi: chu('Hệ thống phân phối: chữ nút gọi', 'Gọi đặt lịch xem hàng'),
    hoiDapTieuDe: chu('Hỏi đáp: tiêu đề', 'Câu hỏi thường gặp'),
    hoiDapDanDat: doan('Hỏi đáp: đoạn dẫn', 'Mua sắm an tâm với Ecopillo. Chưa thấy câu trả lời Quý khách cần? Gọi hoặc nhắn Zalo, Ecopillo phản hồi ngay.'),
    nhanXetTieuDe: chu('Nhận xét: tiêu đề', 'Nhận xét của khách'),
    nhanXetDanDat: doan('Nhận xét: đoạn dẫn', 'Những giấc ngủ được nâng niu, kể bằng lời của chính Quý khách.'),
    veEcopillo: chu('Điện thoại: tiêu đề phần Về Ecopillo (có thẻ chuyển)', 'Về Ecopillo'),
  },
)
