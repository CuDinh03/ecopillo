import { productsUrl } from '../links'
import { anh, chu, definePageText, doan, dsCap, dsDong, type TextField } from './define'

/** Ảnh tĩnh không có bản nhỏ (srcSet rỗng như staticImage trong catalog.ts) */
const img = (src: string, alt: string) => ({ src, srcSet: '', alt })

/** Ô đường link (/duong-dan/, https://…, tel:): web kiểm đúng dạng link, sai thì dùng link gốc */
const link = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'link', goc, goiY })

/** Ruột chăn gối trang chủ: câu nhỏ dưới tên từng ô, theo thứ tự ô (ESSENTIALS trong catalog.ts) */
const NOTE_HINT = 'Mỗi dòng một ô, đúng thứ tự ô trên web; thiếu dòng thì các ô cuối dùng câu gốc'

/**
 * Chữ, ảnh trang chủ (trừ banner, đã có bộ riêng; chữ dùng chung với trang Giới thiệu, Khách sạn nằm ở bộ của trang đó).
 * Chữ gốc giữ nguyên từng ý đã được duyệt (ghi chú nguồn ở component từng khối).
 */
export const { set: HOME_TEXT_SET, text: HOME_TEXT } = definePageText(
  'trang-chu',
  'Trang chủ',
  'Tiêu đề, đoạn dẫn, ảnh, link, chữ nút các khối trang chủ: hai nút dưới banner, dải Hệ sinh thái, dải cam kết, chất liệu, về chúng tôi, ruột chăn gối, sự kiện, khách sạn, hệ thống phân phối, hỏi đáp, nhận xét. Banner sửa ở bộ Banner, phim ở bộ Phim thương hiệu, khối đệm, bộ sưu tập, thư cảm ơn ở bộ riêng.',
  {
    nutXemBoSuuTap: chu('Banner: chữ nút Xem bộ sưu tập', 'Xem bộ sưu tập'),
    nutGoiDienThoai: chu('Banner: chữ nút gọi (điện thoại, ngắn để hai nút một hàng)', 'Gọi ngay'),
    nutGoiMayTinh: chu('Banner: chữ nút gọi (máy tính)', 'Gọi ngay cho chúng tôi'),
    giaTu: chu('Chữ giá thấp nhất trên các ô (bộ sưu tập chăn ga, đệm, ruột chăn gối)', 'từ {gia}', 'Giữ {gia} là chỗ hiện giá'),
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
    heSinhThaiAnh1: anh('Dải dưới banner: ảnh ô thứ nhất (Chăn)', img('/images/products/chan-long-vu-tu-nhien-sm.webp', '')),
    heSinhThaiLink1: link('Dải dưới banner: link ô thứ nhất (Chăn)', productsUrl({ 'danh-muc': 'chan' })),
    heSinhThaiAnh2: anh('Dải dưới banner: ảnh ô thứ hai (Ga)', img('/images/details/hero-ed25-sm.webp', '')),
    heSinhThaiLink2: link('Dải dưới banner: link ô thứ hai (Ga)', productsUrl({ 'danh-muc': 'bo-chan-ga' })),
    heSinhThaiAnh3: anh('Dải dưới banner: ảnh ô thứ ba (Gối)', img('/images/products/ruot-goi-micro-plus-sm.webp', '')),
    heSinhThaiLink3: link('Dải dưới banner: link ô thứ ba (Gối)', productsUrl({ 'danh-muc': 'goi' })),
    heSinhThaiAnh4: anh('Dải dưới banner: ảnh ô thứ tư (Đệm)', img('/images/products/dem-lo-xo-tui-doc-lap-sm.webp', '')),
    heSinhThaiLink4: link('Dải dưới banner: link ô thứ tư (Đệm)', productsUrl({ 'danh-muc': 'dem' })),
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
    nutDocTiep: chu('Về chúng tôi (điện thoại): chữ nút đọc tiếp', 'Đọc tiếp câu chuyện'),
    nutGioiThieu: chu('Về chúng tôi: chữ link sang trang Giới thiệu', 'Xem trang Giới thiệu đầy đủ'),
    nutSuMenh: chu('Về chúng tôi (điện thoại): chữ nút mở bốn thẻ', 'Sứ mệnh, tầm nhìn, giá trị cốt lõi'),
    danhHieuNhan: chu('Về chúng tôi: nhãn thẻ Danh hiệu (nhãn ba thẻ kia sửa ở bộ Trang Giới thiệu, chương V)', 'Danh hiệu'),
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
    chanHeTen: chu('Ruột chăn gối: tên ô chăn hè Lyocell', 'Chăn hè Lyocell'),
    ruotNhom: dsCap(
      'Ruột chăn gối: tên và câu dưới tên của 3 nhóm',
      ['title', 'subtitle'],
      ['Tên nhóm', 'Câu dưới tên'],
      [
        { title: 'Ruột gối', subtitle: 'Từ bông PE giá mềm đến lông vũ bồng bềnh như mây' },
        { title: 'Ruột chăn', subtitle: 'Giữ ấm vừa đủ, nhẹ trên người' },
        { title: 'Chăn, topper và phụ kiện khác', subtitle: 'Thêm một lớp êm, giữ đệm sạch, đổi mùa cho phòng ngủ' },
      ],
      'Đúng 3 dòng theo thứ tự: ruột gối, ruột chăn, chăn và phụ kiện',
    ),
    ruotGoiGhiChu: dsDong(
      'Ruột chăn gối: câu nhỏ dưới tên các ô nhóm Ruột gối',
      ['Nhẹ, thoáng, không hút ẩm', 'Sợi siêu mảnh, êm vừa, dễ giặt', 'Bông cao cấp, đàn hồi tốt', 'Mềm mượt, điều hoà nhiệt', 'Nâng đỡ cổ, thoáng khí', 'Bồng bềnh, chuẩn khách sạn 5 sao'],
      `${NOTE_HINT}: bông PE, Micro Fiber, Micro Plus, tơ tằm, cao su, lông vũ`,
    ),
    ruotChanGhiChu: dsDong(
      'Ruột chăn gối: câu nhỏ dưới tên các ô nhóm Ruột chăn',
      ['Ấm, nhẹ, giặt máy được', 'Mỏng nhẹ, thoáng, ít bám bụi', 'Ấm sâu, siêu nhẹ cho mùa đông'],
      `${NOTE_HINT}: chăn đông Micro Fiber, chăn tơ tằm, chăn lông vũ`,
    ),
    phuKienGhiChu: dsDong(
      'Ruột chăn gối: câu nhỏ dưới tên các ô nhóm Chăn, topper và phụ kiện',
      ['Chần bông mỏng, mát cho mùa hè', 'Vải mát E-Cool, bông siêu nhẹ', 'Làm mềm mặt đệm cứng', 'Chống thấm, chống bụi, dễ tháo giặt', 'Kệ giường khung gỗ thông, cao 30 cm'],
      `${NOTE_HINT}: chăn hè Lyocell, chăn hè E-Cool, topper, bảo vệ đệm, divan`,
    ),
    ruotXemTatCa: chu('Ruột chăn gối: chữ link Xem tất cả của từng nhóm', 'Xem tất cả'),
    ruotGoiLink: link('Ruột chăn gối: link Xem tất cả của nhóm Ruột gối', '/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/'),
    ruotChanLink: link('Ruột chăn gối: link Xem tất cả của nhóm Ruột chăn', '/danh-muc-san-pham/san-pham/ruot-chan-goi/'),
    phuKienLink: link('Ruột chăn gối: link Xem tất cả của nhóm Chăn, topper và phụ kiện', '/danh-muc-san-pham/san-pham/chan-topper-phu-kien/'),
    suKienTieuDe: chu('Sự kiện: tiêu đề', 'Ecopillo đồng hành'),
    suKienDanDat: doan('Sự kiện: đoạn dẫn', 'Những chương trình, sự kiện Ecopillo góp mặt cùng cộng đồng và các đơn vị bạn.'),
    suKienDocBai: chu('Sự kiện: chữ link đọc bài viết của sự kiện nổi bật', 'Đọc bài viết'),
    khachSanTieuDe: chu('Khách sạn: tiêu đề', 'Giấc ngủ năm sao cho khách lưu trú'),
    khachSanNutGoi: chu('Khách sạn: chữ nút gọi', 'Gọi nhận báo giá'),
    khachSanNutZalo: chu('Khách sạn: chữ nút Zalo', 'Gửi yêu cầu qua Zalo'),
    khachSanXemThem: chu('Khách sạn: chữ link sang trang Khách sạn và dự án', 'Xem giải pháp cho khách sạn'),
    doiTacNhan: chu('Khách sạn: nhãn hàng logo đối tác', 'Đối tác'),
    phanPhoiTieuDe: chu('Hệ thống phân phối: tiêu đề', 'Hệ thống phân phối'),
    phanPhoiDanDat: doan(
      'Hệ thống phân phối: đoạn dẫn',
      'Chạm tay vào chất vải tại Ecopillo: cảm nhận độ mềm mát của vải Lyocell, nằm thử gối và đệm, được tư vấn mẫu hợp với phòng ngủ của Quý khách.',
    ),
    phanPhoiNutGoi: chu('Hệ thống phân phối: chữ nút gọi', 'Gọi đặt lịch xem hàng'),
    phanPhoiNutTim: chu('Hệ thống phân phối: chữ nút tìm đại lý', 'Tìm đại lý gần tôi'),
    phanPhoiSoDiem: chu('Hệ thống phân phối: dòng số điểm bán (dưới 20 điểm)', '{so} điểm trên toàn quốc', 'Giữ {so} là chỗ hiện số điểm bán'),
    phanPhoiSoDiemHon: chu(
      'Hệ thống phân phối: dòng số điểm bán (từ 20 điểm)',
      'Hơn {so} điểm trên toàn quốc',
      'Giữ {so} là chỗ hiện số điểm bán làm tròn xuống hàng chục (35 điểm hiện "Hơn 30")',
    ),
    phanPhoiMoCua: chu('Hệ thống phân phối: dòng giờ mở cửa', 'Mở cửa {gio}', 'Giữ {gio} là chỗ hiện giờ mở cửa (sửa ở Thông tin liên hệ)'),
    phanPhoiChiDuong: chu('Hệ thống phân phối: chữ nút chỉ đường', 'Chỉ đường'),
    hoiDapTieuDe: chu('Hỏi đáp: tiêu đề', 'Câu hỏi thường gặp'),
    hoiDapDanDat: doan('Hỏi đáp: đoạn dẫn', 'Mua sắm an tâm với Ecopillo. Chưa thấy câu trả lời Quý khách cần? Gọi hoặc nhắn Zalo, Ecopillo phản hồi ngay.'),
    hoiDapChinhSach: chu('Hỏi đáp: chữ link sang trang Hỏi đáp', 'Xem chính sách giao hàng, đổi hàng, bảo hành'),
    hoiDapXemThem: chu('Hỏi đáp (điện thoại): chữ nút xem các câu còn lại', 'Xem thêm {so} câu hỏi', 'Giữ {so} là chỗ hiện số câu còn lại'),
    nhanXetTieuDe: chu('Nhận xét: tiêu đề', 'Nhận xét của khách'),
    nhanXetDanDat: doan('Nhận xét: đoạn dẫn', 'Những giấc ngủ được nâng niu, kể bằng lời của chính Quý khách.'),
    veEcopillo: chu('Điện thoại: tiêu đề phần Về Ecopillo (có thẻ chuyển)', 'Về Ecopillo'),
    veEcopilloThe: dsDong('Điện thoại: chữ 3 thẻ chuyển của phần Về Ecopillo', ['Câu chuyện', 'Phim', 'Khách sạn'], 'Đúng 3 dòng theo thứ tự: câu chuyện, phim, khách sạn'),
    zaloChu: chu('Vòng mạng xã hội (chân trang, Liên hệ, menu điện thoại): chữ trong vòng Zalo', 'Zalo', 'Vòng nhỏ, nên giữ chữ ngắn'),
  },
)
