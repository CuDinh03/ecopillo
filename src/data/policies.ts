import { CONTACT, OPENING_HOURS } from './brand'
import { POLICY_HEAD_KEY, POLICY_PAGE_FIELD, POLICY_SHOW_FIELD, type PolicySlug } from './policyKeys'
import { liveList, type EditableField, type EditableSet } from './liveContent'
import { BANK_LINE, DEPOSIT_CASES, HOME_TRIAL, NO_DEPOSIT } from './paymentPolicy'

/**
 * Các trang chính sách, ở đúng đường link của web cũ (src/data/policyNav.ts).
 * Nội dung theo biên bản chốt 12/10/2026 mục 35–38, 47, 50 và câu hỏi thường gặp; Ecopillo duyệt lại câu chữ.
 * Nhãn chờ [ĐIỀN …] đã bỏ (owner 28/10/2026); chỗ chưa có số liệu thì không ghi, chữ đối chiếu web cũ docs/link-web-cu/noi-dung-web-cu/.
 */

export interface PolicySection {
  title: string
  /** Đoạn văn */
  body?: readonly string[]
  /** Danh sách gạch đầu dòng */
  list?: readonly string[]
  /** Các bước có số thứ tự */
  steps?: readonly { title: string; text: string }[]
}

export interface Policy {
  slug: PolicySlug
  title: string
  description: string
  intro: string
  /** 3 ý chính hiện thành thẻ ở đầu trang */
  highlights: readonly { value: string; label: string }[]
  sections: readonly PolicySection[]
}

const BASE_POLICIES: readonly Policy[] = [
  {
    slug: 'huong-dan-mua-hang',
    title: 'Hướng dẫn mua hàng online',
    description: 'Đặt chăn ga gối đệm Ecopillo trên web trong 3 bước, nhân viên gọi xác nhận, kiểm hàng khi nhận, thanh toán chuyển khoản.',
    intro:
      'Quý khách đặt hàng trên web, gọi hotline hoặc nhắn Zalo đều được. Đặt trên web chỉ mất khoảng một phút, Ecopillo gọi xác nhận trước khi giao.',
    // Chị Phương 18/11/2026: chữ to đổi thành B1, B2, B3
    highlights: [
      { value: 'B1', label: 'Chọn mẫu, chọn kích thước, điền thông tin' },
      { value: 'B2', label: 'Nhân viên gọi lại xác nhận trước khi giao' },
      { value: 'B3', label: 'Kiểm hàng khi nhận, thanh toán chuyển khoản' },
    ],
    sections: [
      {
        title: 'Đặt hàng trên web',
        steps: [
          { title: 'Chọn sản phẩm', text: 'Vào mục Sản phẩm hoặc Bộ sưu tập, bấm vào mẫu Quý khách thích để xem ảnh, chất liệu và giá.' },
          { title: 'Chọn mẫu, kích thước, số lượng', text: 'Giá đổi ngay theo kích thước Quý khách chọn. Mẫu nào tạm hết hàng sẽ ghi rõ.' },
          { title: 'Điền thông tin nhận hàng', text: 'Họ tên, số điện thoại, tỉnh thành và địa chỉ. Không cần tạo tài khoản.' },
          { title: 'Nhân viên gọi xác nhận', text: `Ecopillo gọi lại để xác nhận mẫu, kích thước và thời gian giao trong giờ làm việc (${OPENING_HOURS}).` },
          { title: 'Nhận hàng, kiểm hàng, thanh toán', text: `Quý khách kiểm hàng cùng người giao, thanh toán chuyển khoản vào tài khoản duy nhất của Ecopillo. ${NO_DEPOSIT} Đệm, đơn trên 10 triệu, hàng may riêng: nhân viên báo khoản đặt cọc khi gọi xác nhận.` },
        ],
      },
      {
        title: 'Đặt qua điện thoại, Zalo, Messenger',
        body: [
          `Gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}, hoặc nhắn tin fanpage ${CONTACT.fanpageDisplay}. Quý khách có thể gửi ảnh phòng ngủ, số đo giường để được tư vấn mẫu và kích thước.`,
        ],
      },
      {
        title: 'Mua trực tiếp',
        body: ['Quý khách đến văn phòng đại diện, chi nhánh hoặc điểm phân phối của Ecopillo để xem vải, nằm thử gối, đệm và mua ngay.'],
      },
    ],
  },
  {
    slug: 'chinh-sach-van-chuyen',
    title: 'Chính sách giao hàng',
    description: 'Miễn phí giao toàn quốc cho đơn từ 500.000đ. Nội thành Hà Nội, TP. HCM giao trong ngày; phía Bắc 2–3 ngày, phía Nam 3–5 ngày.',
    intro: 'Ecopillo giao hàng toàn quốc. Quý khách kiểm hàng khi nhận; chăn ga được trải nghiệm tại nhà ở Hà Nội, TP. HCM với mọi đơn, tỉnh thành khác với đơn từ 20 triệu đồng.',
    highlights: [
      { value: 'Miễn phí', label: 'Giao toàn quốc cho đơn từ 500.000đ' },
      { value: 'Trong ngày', label: 'Nội thành Hà Nội, TP. HCM; tỉnh khác 2–5 ngày' },
      { value: 'Kiểm hàng', label: 'Kiểm hàng cùng nhân viên khi nhận' },
    ],
    sections: [
      {
        title: 'Phí giao hàng',
        list: [
          'Đơn từ 500.000đ: miễn phí giao hàng trên toàn quốc.',
          'Đơn dưới 500.000đ: phí giao 50.000đ, báo rõ khi nhân viên gọi xác nhận.',
        ],
      },
      {
        title: 'Thời gian giao',
        list: [
          'Nội thành Hà Nội và nội thành TP. HCM: giao trong ngày.',
          // Ngoại thành không giao trong ngày (Ecopillo xác nhận 11/11/2026)
          'Ngoại thành Hà Nội và các tỉnh phía Bắc: 2–3 ngày.',
          'Ngoại thành TP. HCM và các tỉnh phía Nam: 3–5 ngày.',
          'Hàng may theo kích thước riêng: Ecopillo báo thời gian may khi xác nhận đơn.',
        ],
        body: ['Thời gian tính từ khi nhân viên gọi xác nhận đơn, không tính ngày lễ, Tết. Nếu giao chậm, Ecopillo gọi báo trước.'],
      },
      {
        title: 'Giao bằng gì',
        list: [
          // Chị Phương sửa câu này (Zalo 11/11/2026); Ecopillo xác nhận cùng ngày: chỉ áp dụng nội thành (Hà Nội và TP. HCM)
          'Nội thành Hà Nội và TP. HCM: nhân viên giao hàng của Ecopillo sẽ ship tận nơi và hỗ trợ trải lên giường cho Quý khách một cách nhanh nhất.',
          'Ngoại thành và các tỉnh khác: gửi qua đơn vị vận chuyển (Viettel Post, Giao hàng tiết kiệm, Giao hàng nhanh…).',
          'Mọi kiện hàng được Ecopillo đóng gói, niêm phong, ghi tên, số điện thoại người nhận và mã vận đơn.',
        ],
      },
      {
        title: 'Khi nhận hàng',
        list: [
          'Quý khách kiểm hàng cùng nhân viên giao.',
          `${HOME_TRIAL} Trải lên giường để xem vừa kích thước, vui lòng không nằm lên.`,
          'Giao sai mẫu, sai kích thước: Quý khách có quyền từ chối nhận.',
          'Kiện hàng móp, rách: chụp ảnh và báo ngay cho Ecopillo trước khi ký nhận.',
          'Hàng hư hỏng trên đường vận chuyển, dù Ecopillo tự giao hay qua đơn vị vận chuyển: Ecopillo chịu trách nhiệm đổi cho Quý khách, rồi tự làm việc với bên vận chuyển.',
        ],
      },
    ],
  },
  {
    slug: 'chinh-sach-thanh-toan',
    title: 'Chính sách thanh toán',
    // Thông báo Ecopillo áp dụng từ 07/08/2026 + chị Phương 18/11/2026: bỏ tiền mặt, một tài khoản duy nhất, bỏ mục Hoá đơn (paymentPolicy.ts).
    // Owner 19/11/2026 (ảnh chụp trang trên điện thoại): xoá chữ "không nhận tiền mặt" ở thẻ đầu trang và đoạn tài khoản
    description: 'Thanh toán chuyển khoản vào tài khoản duy nhất của Ecopillo. Đơn chăn ga tiêu chuẩn dưới 10 triệu không cần đặt cọc; đệm, đơn trên 10 triệu cần đặt cọc.',
    intro: 'Từ 07/08/2026, Ecopillo nhận thanh toán bằng chuyển khoản vào một tài khoản duy nhất của công ty. Đơn chăn ga tiêu chuẩn dưới 10 triệu đồng không cần đặt cọc.',
    highlights: [
      { value: 'Chuyển khoản', label: 'Một tài khoản duy nhất của Ecopillo' },
      { value: 'Không cọc', label: 'Đơn chăn ga tiêu chuẩn dưới 10 triệu' },
      { value: 'Đặt cọc', label: 'Đệm, đơn trên 10 triệu, chăn ga nhỡ cỡ hoặc may riêng' },
    ],
    sections: [
      {
        title: 'Tài khoản nhận thanh toán',
        body: [
          `${BANK_LINE}.`,
          'Ecopillo chỉ nhận thanh toán vào tài khoản này. Nhân viên Ecopillo luôn gọi xác nhận đơn trước khi giao. Nếu có ai nhắn tin yêu cầu chuyển tiền vào tài khoản khác, Quý khách vui lòng gọi hotline để kiểm tra.',
        ],
      },
      {
        title: 'Không cần đặt cọc',
        // Chữ chị Phương gửi Zalo 19/11/2026 18:22 ("phải gồm cả 2 ý là hàng tiêu chuẩn và hoá đơn dưới 10tr đối với đơn chăn ga")
        body: [
          'Với các đơn hàng chăn ga tiêu chuẩn dưới 10 triệu đồng, Quý khách không cần đặt cọc trước. Quý khách được kiểm tra sản phẩm khi nhận hàng và chỉ thanh toán khi đã hài lòng.',
        ],
      },
      {
        title: 'Cần đặt cọc',
        list: DEPOSIT_CASES,
        body: ['Nhân viên Ecopillo báo khoản đặt cọc khi gọi xác nhận đơn.'],
      },
      {
        title: 'Khách sạn, dự án, đại lý',
        body: ['Đơn số lượng lớn thanh toán theo hợp đồng. Bộ phận kinh doanh gửi báo giá và điều khoản thanh toán riêng.'],
      },
    ],
  },
  {
    slug: 'chinh-sach-doi-tra-hang-va-hoan-tien',
    title: 'Chính sách kiểm hàng và đổi hàng',
    description: 'Kiểm hàng khi nhận, trải nghiệm chăn ga tại nhà. Báo lỗi trong 24 giờ, gửi đổi trong 7 ngày. Ecopillo hỗ trợ đổi, không trả hàng hoàn tiền.',
    intro: 'Ecopillo muốn Quý khách nhận đúng bộ mình chọn. Vì vậy Quý khách được kiểm hàng khi nhận, trải nghiệm chăn ga tại nhà, và được đổi khi có lỗi.',
    highlights: [
      { value: '24 giờ', label: 'Báo lỗi sau khi nhận hàng' },
      { value: '7 ngày', label: 'Gửi hàng đổi' },
      { value: 'Chỉ đổi', label: 'Không áp dụng trả hàng hoàn tiền' },
    ],
    sections: [
      {
        title: 'Kiểm hàng khi nhận',
        list: [
          'Mở hộp, kiểm mẫu, màu, kích thước và số lượng cùng nhân viên giao.',
          `${HOME_TRIAL} Trải lên giường để xem vừa kích thước, vui lòng không nằm lên, không giặt.`,
          'Sai mẫu, sai kích thước, thiếu hàng: Quý khách có quyền từ chối nhận.',
          'Không bóc hộp có tem niêm phong khi chưa nhận hàng. Nên quay video lúc mở hộp để đối chiếu khi cần.',
        ],
      },
      {
        title: 'Được đổi khi',
        list: [
          'Giao sai số lượng, kích thước, mẫu so với đơn đã xác nhận.',
          'Sản phẩm lỗi do sản xuất (đường may, khoá kéo, chun, màu khác tiêu chuẩn đã công bố) hoặc hư hỏng khi vận chuyển (rách, bẩn, biến dạng).',
        ],
      },
      {
        title: 'Điều kiện đổi hàng',
        list: [
          'Báo lỗi sản xuất hoặc thiếu hàng trong 24 giờ sau khi nhận, kèm ảnh hoặc video.',
          'Gửi hàng đổi trong 7 ngày kể từ ngày nhận.',
          'Sản phẩm còn nguyên tem mác, chưa giặt, chưa sử dụng, còn đủ hộp và phụ kiện.',
          'Hàng may theo kích thước riêng chỉ đổi khi có lỗi sản xuất hoặc may sai số đo đã chốt.',
          'Mẫu cần đổi đã hết: Quý khách chọn mẫu khác cùng giá. Chọn mẫu giá cao hơn thì bù phần chênh lệch.',
        ],
      },
      {
        title: 'Phí vận chuyển khi đổi',
        list: [
          'Lỗi do nhà sản xuất hoặc giao nhầm: Ecopillo chịu toàn bộ phí vận chuyển hai chiều.',
          'Đổi mẫu, đổi kích thước theo nhu cầu của Quý khách: Ecopillo báo phí vận chuyển khi xác nhận yêu cầu đổi.',
        ],
      },
      {
        title: 'Cách gửi yêu cầu đổi',
        steps: [
          { title: 'Báo cho Ecopillo', text: `Gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}, gửi mã đơn hoặc số điện thoại đặt hàng và ảnh sản phẩm.` },
          { title: 'Ecopillo xác nhận', text: 'Trong 48 giờ làm việc, nhân viên báo kết quả kiểm tra và hẹn cách gửi hàng đổi, hoặc cho người đến lấy với khách ở Hà Nội, TP. HCM.' },
          { title: 'Gửi hàng về', text: 'Đóng gói sản phẩm kèm quà tặng (nếu có), gửi về văn phòng Ecopillo, 273 Xã Đàn, Đống Đa, Hà Nội.' },
          { title: 'Nhận hàng mới', text: 'Ecopillo gửi hàng đổi ngay khi nhận được hàng trả về.' },
        ],
      },
    ],
  },
  {
    // Viết lại theo Sổ bảo hành Ecopillo 2026 (khách gửi 09/11/2026). Ecopillo duyệt lại câu chữ.
    slug: 'chinh-sach-bao-hanh-san-pham',
    title: 'Chính sách bảo hành',
    description: 'Bảo hành Ecopillo: đệm cao su thiên nhiên 15 năm, lò xo và Eco Foam 10 năm, Mix Latex 7 năm, divan và bông ép 5 năm, chăn ga 90 ngày.',
    intro:
      'Bảo hành là cam kết của Ecopillo với lỗi kỹ thuật, lỗi kết cấu hoặc lỗi do nhà sản xuất, trong phạm vi và thời hạn của từng nhóm sản phẩm. Ecopillo tiếp nhận minh bạch, kiểm tra theo tình trạng thực tế rồi đưa ra phương án phù hợp.',
    // Chị Phương 18/11/2026: đủ 5 mức bảo hành lên các thẻ đầu trang, bỏ danh sách trùng trong mục "Thời hạn bảo hành"
    highlights: [
      { value: '15 năm', label: 'Đệm cao su thiên nhiên' },
      { value: '10 năm', label: 'Đệm lò xo, đệm Eco Foam đa tầng' },
      { value: '7 năm', label: 'Đệm bông ép Mix Latex' },
      { value: '5 năm', label: 'Divan, đệm bông ép' },
      { value: '90 ngày', label: 'Chăn ga' },
    ],
    sections: [
      {
        title: 'Thời hạn bảo hành',
        body: [
          'Thời hạn tính từ ngày mua hoặc ngày giao hàng ghi trên chứng từ của Quý khách hoặc dữ liệu bán hàng của Ecopillo.',
          'Tuổi thọ thực tế của chăn ga, đệm còn phụ thuộc trọng lượng người nằm, tần suất dùng, cách vệ sinh, khung đỡ, cách di chuyển. Vì vậy thời hạn bảo hành không phải cam kết về tuổi thọ tối đa của sản phẩm.',
          'Sổ bảo hành không thay hoá đơn, chứng từ mua hàng. Khi thông tin trên sổ khác dữ liệu mua hàng, Ecopillo có thể đề nghị Quý khách gửi chứng từ để xác minh.',
        ],
      },
      {
        title: 'Nguyên tắc bảo hành',
        list: [
          'Ecopillo kiểm tra trực tiếp hoặc đề nghị Quý khách gửi ảnh, video để xác định nguyên nhân.',
          'Năm đầu tiên: lỗi do nhà sản xuất được sửa chữa hoặc đổi mới miễn phí. Từ năm thứ hai: sửa chữa miễn phí theo chính sách bảo hành Ecopillo áp dụng tại thời điểm tiếp nhận.',
          'Sản phẩm bảo hành được tiếp nhận tại showroom, cửa hàng Ecopillo hoặc theo cách vận chuyển hai bên thống nhất. Chi phí ngoài phạm vi bảo hành (nếu có) được báo trước khi làm.',
        ],
      },
      {
        title: 'Đổi mới sản phẩm',
        list: [
          'Việc đổi mới căn cứ kết quả kiểm tra, nguyên nhân và chính sách Ecopillo tại thời điểm xử lý.',
          'Quý khách được đổi sang sản phẩm cùng loại hoặc sản phẩm khác giá trị tương đương. Muốn đổi sang sản phẩm giá trị cao hơn thì thanh toán phần chênh lệch.',
          'Mỗi sản phẩm được hỗ trợ đổi mới tối đa 01 lần. Sau đó nếu còn phát sinh vấn đề, Ecopillo tiếp nhận và xử lý theo chính sách bảo hành.',
          'Trường hợp đặc biệt, Ecopillo có thể xem xét đổi sang sản phẩm giá trị tương đương hoặc cao hơn. Đây là chính sách hỗ trợ của công ty, không phải quyền đổi mới mặc định.',
        ],
      },
      {
        title: 'Được bảo hành khi',
        list: [
          'Đệm lún, xẹp bất thường; sụt lún nghiêm trọng do lỗi kết cấu hoặc vật liệu.',
          // [ECOPILLO ĐIỀN số cm]: Sổ bảo hành để trống mức giảm độ dày được tính là lỗi
          'Đệm mất đàn hồi bất thường, giảm độ dày so với ban đầu, khi được xác định là lỗi kỹ thuật, sản xuất.',
          'Bung lò xo, lỗi hệ thống lò xo; khung lò xo trồi hoặc lò xo đâm xuyên bề mặt do lỗi sản xuất.',
          'Divan, khung sản phẩm lỗi kết cấu, cong vênh bất thường do nhà sản xuất.',
          'Lỗi kết cấu, lỗi kỹ thuật, lỗi vật liệu ảnh hưởng đến công năng, và các lỗi khác Ecopillo xác nhận là lỗi sản xuất.',
          'Chăn ga xù lông hoặc phai màu trên toàn bộ bề mặt do lỗi sản xuất: được xem xét đổi mới. Hư hỏng cục bộ có thể khắc phục: được xem xét sửa chữa.',
        ],
        body: [
          'Hiện tượng hình thành theo đặc tính vật liệu hoặc do quá trình sử dụng chỉ được tính là lỗi bảo hành sau khi Ecopillo kiểm tra và kết luận.',
        ],
      },
      {
        title: 'Đệm không thuộc bảo hành',
        list: [
          'Vết bẩn, nước tiểu, chất lỏng, nấm mốc, hư hỏng do vệ sinh, bảo quản không đúng cách.',
          'Va đập, tác động cơ học, vật nuôi, côn trùng, chuột hoặc tác nhân bên ngoài.',
          'Nước, độ ẩm, hoá chất, chất tẩy mạnh, nguồn nhiệt, cháy nổ, ngập nước, thiên tai.',
          'Đặt đệm trên nền, khung không chắc, không phẳng, không đủ nâng đỡ hoặc không thông thoáng.',
          'Dùng sai mục đích; trẻ em nhảy trên đệm, đứng hoặc nhảy trên giường, divan.',
          'Gấp, bẻ cong đệm sai cách khi vận chuyển; kéo lê hoặc nhấc cả tấm đệm bằng viền trang trí.',
          'Cảm giác nằm (quá cứng, quá mềm) không hợp sở thích riêng.',
          'Hao mòn, đổi màu tự nhiên theo thời gian; lỗi thẩm mỹ nhỏ trong tiêu chuẩn kỹ thuật, không ảnh hưởng công năng.',
          'Tự tháo, cắt, may, thay vỏ, thay đổi cấu trúc hoặc tự sửa đệm.',
          'Vải bọc, lớp ngoài mòn, rách, hoen ố, xuống cấp tự nhiên theo thời gian dùng.',
        ],
      },
      {
        title: 'Chăn ga không thuộc bảo hành',
        list: [
          'Bẩn, dính mỹ phẩm, dầu, mồ hôi, nước tiểu, thức ăn, đồ uống.',
          'Rách, thủng, móc sợi, sờn do vật sắc nhọn, thú nuôi hoặc tác động cơ học.',
          'Xù bề mặt do ma sát, dùng hoặc giặt sai cách; phai, lem màu do giặt chung, chất tẩy, ngâm lâu.',
          'Co rút, biến dạng do giặt, sấy, ủi sai hướng dẫn; sấy nhiệt cao, hong bằng nguồn nhiệt trực tiếp.',
          'Dùng chất tẩy mạnh, hoá chất không phù hợp; chà bàn chải cứng, vò, vắt quá mạnh; cất nơi ẩm gây nấm mốc.',
          'Tự sửa, cắt, may, nhuộm, in, thêu.',
          'Thay đổi tự nhiên về màu, độ mềm, độ rũ; sai khác màu nhỏ giữa các lô vải hoặc giữa ảnh và thực tế trong tiêu chuẩn cho phép; đặc tính tự nhiên của chất liệu.',
          'Không còn tem, nhãn hoặc căn cứ xác định sản phẩm khi cần xác minh.',
        ],
      },
      {
        title: 'Quy trình tiếp nhận',
        steps: [
          { title: 'Tiếp nhận', text: `Quý khách gọi hoặc nhắn Zalo ${CONTACT.hotlineDisplay}. Ecopillo ghi nhận thông tin, sản phẩm và tình trạng cần hỗ trợ.` },
          { title: 'Kiểm tra', text: 'Kiểm tra qua ảnh, video hoặc kiểm tra trực tiếp sản phẩm.' },
          { title: 'Đánh giá', text: 'Xác định nguyên nhân và đối chiếu điều kiện bảo hành.' },
          { title: 'Phương án', text: 'Báo Quý khách phương án sửa chữa, đổi mới hoặc hỗ trợ, kèm chi phí ngoài bảo hành nếu có.' },
          { title: 'Bàn giao', text: 'Hoàn tất xử lý, bàn giao và ghi nhận kết quả vào phiếu bảo hành.' },
        ],
      },
      {
        title: 'Giới hạn bảo hành',
        list: [
          'Với lỗi nhà sản xuất, Ecopillo chọn cách xử lý phù hợp: sửa chữa, thay bộ phận hoặc đổi mới, tuỳ tình trạng thực tế.',
          'Sửa chữa hoặc thay thế không làm gia hạn thời gian bảo hành còn lại, trừ khi Ecopillo có quy định khác bằng văn bản.',
          'Bảo hành áp dụng cho người mua đầu tiên theo chứng từ, hệ thống bán hàng, trừ khi Ecopillo có chính sách chuyển nhượng riêng.',
        ],
      },
      {
        title: 'Dùng và bảo quản đệm',
        list: [
          'Đặt đệm trên mặt phẳng, chắc, nâng đỡ đều; khung giường vừa cỡ đệm, không cong võng. Giường cỡ lớn cần thanh đỡ giữa và chân đỡ phù hợp.',
          'Đệm hút chân không cần thời gian phục hồi: trải phẳng nơi thoáng, chờ khoảng 01–02 tuần. Trong thời gian này không gấp, bẻ, kéo lê hay đặt vật nặng một chỗ. Sau đó đệm vẫn bất thường thì Quý khách báo Ecopillo kiểm tra.',
          'Dùng tấm bảo vệ đệm chống thấm; không đổ chất lỏng lên đệm, không dùng chất tẩy mạnh.',
          'Giữ phòng thông thoáng; không phơi hoặc đặt đệm sát nguồn nhiệt mạnh. Xoay, đảo đệm theo hướng dẫn riêng nếu dòng đệm cho phép.',
          'Đệm lớn, nặng cần ít nhất hai người khiêng; không nhấc bằng viền trang trí, không kéo lê, không gập hay cuộn đệm nếu dòng đệm không thiết kế để làm vậy.',
        ],
      },
      {
        title: 'Dùng và bảo quản chăn ga',
        list: [
          'Giặt trước khi dùng lần đầu, bằng nước giặt hợp chất liệu và nước lạnh không quá 30°C.',
          'Cần ủi thì lót một lớp vải mỏng, ủi ở khoảng 80–120°C.',
          'Phơi nơi thoáng, ưu tiên bóng râm, tránh nắng gắt lâu.',
          'Không dùng chất tẩy mạnh, chất tẩy oxy hoá cao; không giặt chung đồ dễ phai màu; không chà bàn chải cứng; không ngâm.',
          'Không sấy nhiệt cao hay hong bằng nguồn nhiệt mạnh. Làm đúng hướng dẫn trên tem từng sản phẩm.',
        ],
      },
      {
        title: 'Chứng nhận chất lượng',
        body: ['Sản phẩm Ecopillo đạt chứng nhận ISO 9001:2015 và QCVN 01:2017.'],
      },
    ],
  },
]

/* ——— Trang chính sách: Ecopillo tự sửa trong WordPress (liveContent.ts) ——— */

const NHOM_CHINH_SACH = 'Trang chính sách'

/**
 * Đầu mỗi trang chính sách (tên, mô tả Google, đoạn mở, 3 thẻ ý chính) và Hiện / Ẩn từng trang (owner 24/11/2026, đợt I:
 * "thêm được thì phải sửa được và xoá được"). Ẩn hoặc xoá dòng: link trang chuyển về Hỏi đáp (links.ts hiddenPageTarget, máy chủ
 * trang-wp.php eco_tw_policy_hidden), bỏ khỏi menu, ô tìm, sơ đồ trang. Thêm lại dòng, chọn trang là trang hiện lại với chữ gốc.
 * Trang chính sách mới: Trang WordPress tích "Hiện bằng giao diện mới", kiểu trang "Trang chính sách" (trang-moi.php).
 */
export const POLICY_HEAD_SET: EditableSet = {
  khoa: POLICY_HEAD_KEY,
  khongDoiThuTu: true,
  nhom: NHOM_CHINH_SACH,
  ten: 'Đầu các trang chính sách',
  moTa:
    'Tên trang, mô tả hiện trên Google, đoạn mở đầu, 3 thẻ ý chính của từng trang chính sách; Hiện / Ẩn từng trang (ẩn hoặc xoá dòng: link trang chuyển về Hỏi đáp). ' +
    'Tên trên menu, thứ tự menu: bộ "Menu chính sách: các trang". Trang chính sách mới: Trang → Thêm mới trong WordPress, tích "Hiện trang này bằng giao diện mới", chọn kiểu "Trang chính sách".',
  kieu: 'nhieu',
  goc: BASE_POLICIES.map(({ slug, title, description, intro, highlights }) => ({ slug, hien: 'co', title, description, intro, highlights })),
  tieuDeDong: 'title',
  truong: [
    POLICY_PAGE_FIELD,
    POLICY_SHOW_FIELD,
    { khoa: 'title', nhan: 'Tên trang', kieu: 'chu', batBuoc: true },
    { khoa: 'description', nhan: 'Mô tả hiện trên Google (70–155 ký tự)', kieu: 'doan', batBuoc: true },
    { khoa: 'intro', nhan: 'Đoạn mở đầu', kieu: 'doan', batBuoc: true },
    { khoa: 'highlights', nhan: 'Thẻ ý chính đầu trang', kieu: 'ds-cap', batBuoc: true, cap: ['value', 'label'], nhanCap: ['Chữ to', 'Mô tả'], goiY: 'Thường 3 thẻ; nhiều hơn thì xếp 3 thẻ một hàng (Bảo hành có 5 thẻ).' },
  ] satisfies EditableField[],
}

const SECTION_FIELDS: readonly EditableField[] = [
  { khoa: 'title', nhan: 'Tiêu đề phần', kieu: 'chu', batBuoc: true },
  { khoa: 'body', nhan: 'Đoạn văn', kieu: 'doan-nhieu' },
  { khoa: 'list', nhan: 'Gạch đầu dòng', kieu: 'ds-dong' },
  { khoa: 'steps', nhan: 'Các bước có số', kieu: 'ds-cap', cap: ['title', 'text'], nhanCap: ['Tên bước', 'Nội dung'] },
]

/** Các phần nội dung của một trang chính sách: một mục sửa riêng cho mỗi trang */
export const POLICY_SECTION_SETS: readonly EditableSet[] = BASE_POLICIES.map((p) => ({
  khoa: `chinh-sach-${p.slug}`,
  nhom: NHOM_CHINH_SACH,
  ten: p.title,
  moTa: `Các phần nội dung trang "${p.title}". Mỗi phần có thể có đoạn văn, gạch đầu dòng, các bước; ô nào để trống thì không hiện.`,
  kieu: 'nhieu',
  goc: p.sections,
  tieuDeDong: 'title',
  truong: SECTION_FIELDS,
}))

// Dòng chọn trang lạ thì bỏ (slug trống). Ô Hiện / Ẩn chỉ dùng ở policyKeys.ts, không ghép vào đây (bản lưu y gốc thì vẫn là gốc)
const HEAD_FIELDS = POLICY_HEAD_SET.truong.filter((f) => f.khoa !== POLICY_SHOW_FIELD.khoa)
const LIVE_HEADS = liveList<Policy>(POLICY_HEAD_SET.khoa, BASE_POLICIES, HEAD_FIELDS, (_i, row) => ({
  ...(BASE_POLICIES.find((p) => p.slug === row.slug) ?? { ...BASE_POLICIES[0], slug: '' as PolicySlug }),
}))

/**
 * Mỗi trang chính sách giữ đúng link (slug) gốc; trang không có trong danh sách sửa thì giữ bản gốc.
 * Trang Ecopillo đã ẩn vẫn ở đây (PolicyPage chuyển link về Hỏi đáp)
 */
export const POLICIES: readonly Policy[] = BASE_POLICIES.map((base) => {
  const head = LIVE_HEADS.find((p) => p.slug === base.slug) ?? base
  return {
    ...head,
    sections: liveList(`chinh-sach-${base.slug}`, base.sections, SECTION_FIELDS, (): PolicySection => ({ title: '' })),
  }
})

export const policyBySlug = (slug: string): Policy | undefined => POLICIES.find((p) => p.slug === slug)
