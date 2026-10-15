/**
 * Phần "Hiểu kỹ trước khi chọn" của từng sản phẩm lẻ (ruột gối, ruột chăn, topper, đệm).
 *
 * Nguồn: mô tả sản phẩm trên web cũ (lấy qua API WordPress ngày 15/10/2026, bản chữ ở
 * docs/link-web-cu/noi-dung-web-cu/). Giữ thông số thật (cấu tạo, độ dày, kích thước, chất liệu, bảo hành),
 * bỏ câu quảng cáo chung chung, viết lại gọn, xưng "Quý khách". Không có chữ chất liệu cũ.
 * Khoá là mã sản phẩm trong products.ts.
 */

export interface InfoSection {
  title: string
  body?: readonly string[]
  list?: readonly string[]
}

export interface ProductInfo {
  /** Thông số ngắn, hiện thành ô ở đầu trang (ghi đè ô cùng tên trong products.ts) */
  specs?: readonly { label: string; value: string }[]
  sections: readonly InfoSection[]
}

export const PRODUCT_INFO: Readonly<Record<string, ProductInfo>> = {
  'ruot-goi-micro-fiber': {
    specs: [
      { label: 'Kích thước', value: '45 × 65 · 50 × 70 cm' },
      { label: 'Ruột', value: 'Sợi micro fiber' },
      { label: 'Vỏ', value: 'Cotton T233' },
      { label: 'Giặt', value: 'Giặt máy, sấy được' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Ruột bông polyester sợi siêu mảnh (1,4D × 3,8 cm), còn gọi là "lông vũ nhân tạo": nhẹ, bồng, êm như lông vũ.',
          'Vỏ bọc vải cotton T233 dệt dày, may viền piping hai đường giữ phom gối.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Người thích gối êm, mềm, nằm lún vừa. Là dòng gối chuẩn của nhiều khách sạn 5 sao.',
          'Người dễ dị ứng lông vũ thật: sợi nhân tạo không gây dị ứng, thoáng, ít đọng mồ hôi.',
        ],
      },
      {
        title: 'Dùng và giữ gìn',
        list: ['Giặt máy và sấy được. Sau khi giặt, vỗ nhẹ cho bông tơi lại.', 'Thay ruột gối sau 1–2 năm để gối luôn giữ độ cao.'],
      },
    ],
  },
  'ruot-goi-micro-plus': {
    specs: [
      { label: 'Kích thước', value: '45 × 65 · 50 × 70 cm' },
      { label: 'Ruột', value: 'Micro Plus đàn hồi' },
      { label: 'Vỏ', value: 'Cotton 100%, chống thấm' },
      { label: 'Độ êm', value: 'Vừa, giữ phom' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Lõi sợi microfiber thế hệ mới, tơi xốp, phân bổ đều: đàn hồi tốt, giữ phom, hạn chế xẹp lún.',
          'Vỏ cotton 100% dệt mật độ cao, có lớp xử lý chống nước, chống dầu, chống bám bẩn: lỡ đổ nước chỉ cần lau nhẹ.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Gia đình cần một chiếc gối dùng hằng ngày, nâng đỡ đầu và cổ ở tư thế tự nhiên.',
          'Người hay mỏi cổ, vai, gáy khi thức dậy. Không bí nóng, dùng được quanh năm.',
          'Là gối tặng kèm trong nhiều bộ chăn ga Ecopillo.',
        ],
      },
    ],
  },
  'ruot-goi-to-tam': {
    specs: [
      { label: 'Kích thước', value: '45 × 65 cm' },
      { label: 'Ruột', value: 'Tơ tằm + micro fiber' },
      { label: 'Vỏ', value: 'Cotton cao cấp' },
      { label: 'Độ êm', value: 'Mềm, mát' },
    ],
    sections: [
      {
        title: 'Cấu tạo hai lớp',
        list: [
          'Lớp trên: 100% sợi tơ tằm tự nhiên, mềm mượt, điều hoà nhiệt, chạm vào thấy mát.',
          'Lớp dưới: 100% bông micro fiber tạo độ cao vừa phải cho đầu và cổ.',
          'Vỏ bọc cotton cao cấp, thoáng khí.',
        ],
      },
      { title: 'Hợp với ai', list: ['Người thích cảm giác mềm, mát của tơ tằm mà vẫn cần gối đủ độ cao.', 'Người hay nóng đầu khi ngủ.'] },
    ],
  },
  'ruot-goi-cao-su-thien-nhien': {
    specs: [
      { label: 'Kích thước', value: '40 × 60 × 7 cm' },
      { label: 'Ruột', value: 'Cao su thiên nhiên' },
      { label: 'Vỏ', value: 'Vải lạnh' },
      { label: 'Độ êm', value: 'Vừa, đàn hồi' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Ruột cao su thiên nhiên nguyên khối, đàn hồi, kháng khuẩn tự nhiên, bền.',
          'Bề mặt đục lỗ thoáng khí: không nóng đầu, thoát mồ hôi tốt.',
          'Vỏ bọc vải lạnh mát tay.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: ['Người hay đau cổ, vai, gáy cần gối giữ phom, không xẹp.', 'Người thích gối thấp vừa (7 cm), nằm ngửa hay nằm nghiêng đều được.'],
      },
    ],
  },
  'ruot-goi-long-vu-tu-nhien': {
    specs: [
      { label: 'Kích thước', value: '45 × 65 · 50 × 70 cm' },
      { label: 'Ruột', value: '90% lông vũ, 10% lông cánh' },
      { label: 'Vỏ', value: 'Cotton' },
      { label: 'Độ êm', value: 'Bồng bềnh' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Lông vũ vịt, ngỗng tự nhiên đã làm sạch, tinh chế qua quy trình nghiêm ngặt.',
          'Tỉ lệ 90% lông vũ, 10% lông cánh: mềm, nhẹ, đàn hồi cao.',
          'Vỏ cotton thoáng, không kêu sột soạt khi trở mình.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Người muốn trải nghiệm gối chuẩn khách sạn 5 sao: bồng bềnh, nâng đỡ cổ vai gáy êm ái.',
          'Lông vũ không hút ẩm nên gối thoáng: ấm mùa đông, mát mùa hè.',
        ],
      },
    ],
  },
  'chan-dong-micro-fiber': {
    specs: [
      { label: 'Kích thước', value: '200 × 220 cm' },
      { label: 'Trọng lượng', value: '2,3 kg' },
      { label: 'Ruột', value: 'Sợi micro fiber' },
      { label: 'Vỏ', value: 'Cotton TC233' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Vỏ cotton TC233 (233 sợi mỗi inch vuông) dày dặn, chần ô vuông 28 cm, 4 mũi chỉ mỗi cm.',
          'Mặt vải tráng chống bay bông; viền piping giữ ruột chăn luôn căng phồng.',
          'Ruột sợi micro fiber siêu mảnh, còn gọi là "lông vũ nhân tạo": nhẹ, mịn, không thô ráp.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Gia đình miền Bắc cần chăn đông mỏng, nhẹ mà vẫn ấm. Là dòng ruột chăn của nhiều khách sạn 5 sao.',
          'Chăn thoáng: mới đắp thấy nhẹ, ấm dần mà không bí.',
        ],
      },
    ],
  },
  'chan-to-tam': {
    specs: [
      { label: 'Kích thước', value: '200 × 220 cm' },
      { label: 'Ruột', value: '30% tơ tằm tự nhiên' },
      { label: 'Vỏ', value: 'Cotton sợi dài' },
      { label: 'Độ ấm', value: 'Nhẹ, điều hoà' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Ruột 30% tơ tằm tự nhiên kết hợp 70% tơ nhân tạo kháng khuẩn, xếp lớp đều tay, hạn chế xô lệch.',
          'Vỏ 100% cotton sợi dài, dệt chặt, mặt vải mịn, thân thiện với da.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Người thích chăn nhẹ, rủ mềm, ôm theo người.',
          'Người dễ ra mồ hôi: tơ tằm hút và thoát ẩm tốt, mát khi trời ấm, ấm nhẹ khi trời mát.',
        ],
      },
    ],
  },
  'chan-long-vu-tu-nhien': {
    specs: [
      { label: 'Kích thước', value: '200 × 220 cm' },
      { label: 'Ruột', value: 'Lông vũ tự nhiên' },
      { label: 'Vỏ', value: 'Cotton mật độ cao' },
      { label: 'Độ ấm', value: 'Ấm sâu, siêu nhẹ' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Lông tơ (down) ngỗng và lông vịt, tuyển từ phần lông bụng: xốp, đàn hồi, nhiều khoảng khí giữ nhiệt.',
          'Chần ô để lông phân bố đều, không dồn, không vón cục.',
          'Vỏ cotton mật độ cao, mịn, hạn chế chui lông. Có dây cố định góc trong vỏ chăn.',
          'Lông vũ được giặt, làm sạch sâu và sấy khử trùng ở nhiệt độ cao.',
        ],
      },
      { title: 'Hợp với ai', list: ['Mùa đông miền Bắc: ấm mà không nặng, không bí.', 'Người muốn chăn chuẩn khách sạn, dùng nhiều năm.'] },
    ],
  },
  'topper-micro-fiber': {
    specs: [
      { label: 'Độ dày', value: '9 cm' },
      { label: 'Ruột', value: 'Sợi micro fiber' },
      { label: 'Vỏ', value: 'Cotton TC233' },
      { label: 'Cố định', value: '4 góc dây chun' },
    ],
    sections: [
      {
        title: 'Topper là gì',
        body: [
          'Tấm làm mềm trải giữa đệm và ga: làm mặt giường êm, phồng và sang hơn. Là lớp quen thuộc trên giường khách sạn 4–5 sao, nay được nhiều gia đình dùng.',
        ],
      },
      {
        title: 'Cấu tạo',
        list: [
          'Vỏ cotton TC233, chần ô vuông 25 cm, 4 mũi chỉ mỗi cm, tráng chống bay bông, may hai viền piping.',
          'Ruột sợi micro fiber mềm như lông vũ, nhồi theo từng ô nên không xô lệch.',
          'Bốn góc có dây chun chéo ôm vào đệm, nằm không trượt.',
        ],
      },
      {
        title: 'Dùng thế nào',
        list: [
          'Trải topper lên đệm rồi mới bọc ga.',
          'Êm nhất khi dùng cùng đệm lò xo túi độc lập, trong phòng có điều hoà.',
          'Làm mềm lại một chiếc đệm cứng mà không phải thay đệm.',
        ],
      },
    ],
  },
  'dem-bong-gam-thuan-khiet': {
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Vỏ vải gấm dệt dày, màu trung tính trầm: sạch, dễ vệ sinh, dễ phối chăn ga và nội thất.',
          'Lõi bông polyester nguyên sinh ép nhiệt; lớp giữ lõi là bông trải đứng nên đệm đàn hồi và thoáng hơn bông ép thường.',
          'Gập 3, dễ di chuyển, cất gọn khi không dùng.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Người quen nằm đệm cứng: độ cứng vừa phải, mặt đệm phẳng.',
          'Người lớn tuổi hay đau lưng, trẻ nhỏ cần mặt nằm vững.',
          'Hai độ dày 9 cm và 14 cm: dày hơn thì êm hơn.',
        ],
      },
      { title: 'Tiêu chuẩn', list: ['Đạt ISO 9001:2015 và QCVN 01:2017/BCT.', 'Bảo hành 5 năm.'] },
    ],
  },
  'dem-lo-xo-tui-doc-lap': {
    specs: [
      { label: 'Độ dày', value: '24 cm' },
      { label: 'Độ êm', value: 'Vừa' },
      { label: 'Bảo hành', value: '10 năm' },
      { label: 'Đóng gói', value: 'Hút chân không, cuộn tròn' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Lõi lò xo túi độc lập: mỗi lò xo một túi, nằm cạnh nhau trở mình không rung.',
          'Các lớp tiện nghi foam PU và bông kháng khuẩn PE phía trên.',
          'Vải mặt đệm êm, chần hoạ tiết.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Dòng đệm lò xo được khách chọn nhiều nhất: độ êm vừa, hợp đa số người, giá dễ tiếp cận.',
          'Giao cuộn tròn hút chân không: dễ mang lên nhà cao tầng, ngõ nhỏ.',
        ],
      },
    ],
  },
  'dem-lo-xo-eco-royal': {
    specs: [
      { label: 'Độ dày', value: '29 cm' },
      { label: 'Kiểu', value: 'Pillow Top' },
      { label: 'Lõi', value: 'Lò xo túi phân vùng' },
      { label: 'Vải', value: 'Extra Cool, Nano bạc' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Mặt đệm: vải Extra Cool nhập khẩu, tản nhiệt nhanh, mát khi chạm; sợi vải có Nano bạc kháng khuẩn, khử mùi, chống nấm mốc.',
          'Lớp topper nhiều tầng: cao su thiên nhiên nguyên tấm, memory foam, foam lượn sóng tạo khe thoáng dưới lưng.',
          'Lõi lò xo túi độc lập bằng thép mạ kẽm, phân vùng vai, lưng, hông; viền foam bao thành dày 7 cm giữ thành đệm chắc.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Người lớn tuổi, dân văn phòng, người có vấn đề cột sống: đệm phân bố lực đều, êm mà không lún.',
          'Vợ chồng ngủ khác giờ: trở mình yên, không rung sang người bên cạnh.',
          'Nhận làm theo kích thước riêng.',
        ],
      },
    ],
  },
  'dem-eco-foam-da-tang': {
    specs: [
      { label: 'Độ dày', value: '15 · 20 cm' },
      { label: 'Lõi', value: 'Foam K45 + lớp massage K50' },
      { label: 'Vải', value: 'Extra Cool 400 g/m' },
      { label: 'Đóng gói', value: 'Hút chân không, cuộn tròn' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Lõi foam đàn hồi K45, phía trên là lớp massage K50 giúp lưu thông máu khi nằm.',
          'Vỏ vải Extra Cool mát, định lượng 400 g/m.',
          'Đệm nguyên tấm, giao cuộn tròn hút chân không.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: ['Người thích đệm êm, ôm theo đường cong cơ thể, nằm "đầm" người.', 'Nhận làm theo kích thước riêng.'],
      },
    ],
  },
  'dem-cao-su-thien-nhien-eco-latex': {
    specs: [
      { label: 'Độ dày', value: '10 · 15 · 20 cm' },
      { label: 'Lõi', value: '100% cao su thiên nhiên' },
      { label: 'Vỏ', value: 'SCool Jacquard, tháo giặt' },
      { label: 'Độ êm', value: 'Đàn hồi, nâng đỡ tốt' },
    ],
    sections: [
      {
        title: 'Cấu tạo',
        list: [
          'Ruột 100% mủ cao su thiên nhiên: lỗ vuông lớn ở mặt dưới, lỗ tròn nhỏ khắp mặt trên để khí lưu thông.',
          'Vỏ trong bằng lưới thoáng, khoá kéo dọc thân giữ phom lõi đệm.',
          'Vỏ ngoài vải lạnh SCool Jacquard 350 g/m: mát, kháng khuẩn, tháo ra giặt được.',
        ],
      },
      {
        title: 'Hợp với ai',
        list: [
          'Người cần đệm nâng đỡ tốt và bền lâu nhất trong các dòng.',
          'Người hay nóng lưng: cao su thiên nhiên thoáng, không hầm.',
        ],
      },
    ],
  },
}
