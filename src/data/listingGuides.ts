/**
 * Phần "Chọn thế nào" ở cuối trang danh mục nhỏ (đệm lò xo, ruột chăn gối…). Khoá là đường link trong LISTINGS (links.ts).
 *
 * Nguồn: đoạn mô tả danh mục trên web cũ (lấy qua API WordPress ngày 15/10/2026, docs/link-web-cu/noi-dung-web-cu/).
 * Giữ ý có ích cho người mua (khác nhau thế nào, hợp với ai), bỏ câu quảng cáo chung chung và lời kể ngôi thứ nhất.
 * Mỗi đoạn ngắn, đọc lướt được; chi tiết từng dòng đệm nằm ở trang sản phẩm.
 */

export interface ListingGuide {
  title: string
  points: readonly { title: string; text: string }[]
}

export const LISTING_GUIDES: Readonly<Record<string, ListingGuide>> = {
  '/danh-muc-san-pham/dem-ecopillo/': {
    title: 'Chọn đệm theo cách Quý khách thích nằm',
    points: [
      { title: 'Thích êm, ôm người', text: 'Đệm Eco Foam đa tầng: foam đàn hồi ôm theo đường cong cơ thể, nằm "đầm" người.' },
      { title: 'Thích êm mà vẫn đỡ chắc', text: 'Đệm lò xo túi độc lập (24 cm) hoặc Eco Royal (29 cm, có lớp cao su và memory foam).' },
      { title: 'Cần nâng đỡ tốt, bền lâu', text: 'Đệm cao su thiên nhiên Eco Latex: đàn hồi tự nhiên, thoáng, không hầm lưng.' },
      { title: 'Thích nằm cứng, gấp gọn', text: 'Đệm bông ép Gấm Thuần Khiết: cứng vừa, gập 3, hợp người lớn tuổi và trẻ nhỏ.' },
      { title: 'Đệm đang cứng quá', text: 'Trải thêm topper Micro Fiber 9 cm, không phải thay đệm.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-lo-xo/': {
    title: 'Đệm lò xo nào hợp Quý khách',
    points: [
      { title: 'Lò xo túi độc lập', text: 'Mỗi lò xo một túi, hoạt động riêng: người bên cạnh trở mình không làm rung cả đệm.' },
      { title: 'Đệm 24 cm, êm vừa', text: 'Đệm lò xo túi độc lập Ecopillo: hợp đa số người, giá dễ tiếp cận, bảo hành 10 năm.' },
      { title: 'Đệm 29 cm, êm sâu', text: 'Eco Royal: lò xo phân vùng vai, lưng, hông, thêm lớp cao su và memory foam. Hợp người lớn tuổi, người đau lưng.' },
      { title: 'Nằm thử trước khi mua', text: 'Đệm khó chọn qua ảnh: Quý khách nên nằm thử tại văn phòng Hà Nội hoặc chi nhánh TP. HCM.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-cao-su/': {
    title: 'Vì sao chọn đệm cao su thiên nhiên',
    points: [
      { title: 'Đàn hồi tự nhiên', text: 'Lõi 100% cao su thiên nhiên nâng đỡ đều, nằm lâu không xẹp lún.' },
      { title: 'Thoáng, kháng khuẩn', text: 'Lõi đục lỗ cho khí lưu thông; cao su có tính kháng khuẩn tự nhiên.' },
      { title: 'Vỏ tháo giặt được', text: 'Vỏ ngoài vải lạnh, vỏ trong lưới thoáng có khoá kéo.' },
      { title: 'Ba độ dày', text: '10, 15, 20 cm: dày hơn thì êm và đỡ sâu hơn.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-bong-ep/': {
    title: 'Đệm bông ép hợp với ai',
    points: [
      { title: 'Người thích nằm cứng', text: 'Độ cứng vừa phải, nằm phẳng lưng.' },
      { title: 'Người lớn tuổi, trẻ nhỏ', text: 'Mặt đệm vững, không lún, đỡ cột sống.' },
      { title: 'Nhà cần gọn', text: 'Gập 3, dễ di chuyển và cất khi không dùng. Vỏ gấm màu trung tính, dễ phối chăn ga.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/dem-foam/': {
    title: 'Đệm foam là gì',
    points: [
      { title: 'Ôm theo cơ thể', text: 'Foam đàn hồi lún theo đường cong người nằm, giảm áp lực ở vai và hông.' },
      { title: 'Êm và đầm', text: 'Hợp người thích đệm êm, ít nảy.' },
      { title: 'Gọn khi giao', text: 'Đệm nguyên tấm, hút chân không cuộn tròn, mở ra là nở đủ dày.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/ruot-chan-goi/': {
    title: 'Chọn ruột chăn, ruột gối',
    points: [
      { title: 'Gối êm, mềm', text: 'Micro Fiber hoặc lông vũ tự nhiên: bồng, nhẹ, chuẩn khách sạn.' },
      { title: 'Gối giữ phom', text: 'Micro Plus hoặc cao su thiên nhiên: đỡ cổ, không xẹp, hợp người hay mỏi vai gáy.' },
      { title: 'Chăn đông', text: 'Micro Fiber (nhẹ, ấm, giặt máy được) hoặc lông vũ tự nhiên (ấm sâu, siêu nhẹ).' },
      { title: 'Chăn nhẹ quanh năm', text: 'Chăn tơ tằm: rủ mềm, điều hoà nhiệt, hợp người dễ ra mồ hôi.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/ruot-goi-nam-cao-cap/': {
    title: 'Năm độ êm của ruột gối Ecopillo',
    points: [
      { title: 'Micro Fiber', text: 'Êm, mềm, giặt máy được. Hợp người dễ dị ứng.' },
      { title: 'Micro Plus', text: 'Đàn hồi, giữ phom, vỏ chống thấm. Gối dùng hằng ngày.' },
      { title: 'Tơ tằm', text: 'Lớp tơ tằm mát ở trên, lớp micro fiber đỡ ở dưới.' },
      { title: 'Cao su thiên nhiên', text: 'Thấp 7 cm, đục lỗ thoáng, đỡ cổ tốt.' },
      { title: 'Lông vũ tự nhiên', text: 'Bồng bềnh nhất, chuẩn khách sạn 5 sao.' },
    ],
  },
  '/danh-muc-san-pham/san-pham/bo-ga-phu/': {
    title: 'Ga phủ hay ga chun',
    points: [
      { title: 'Ga phủ', text: 'Phủ kín mặt và viền đệm, che cả khung giường: phòng ngủ gọn, sang. Ecopillo có ga phủ chần thêu (Eco Doris) và dệt Jacquard (Eco Sweet).' },
      { title: 'Ga chun', text: 'Bo chun ôm mặt đệm, ít xô lệch, thay giặt nhanh. Bộ Eco Flora.' },
      { title: 'Bộ chăn ga gối', text: 'Eco Rosa, Eco Tera, Eco Vera, Eco Liora: đủ ga, vỏ chăn, vỏ gối cùng một hoạ tiết.' },
      { title: 'Đo trước khi đặt', text: 'Đo dài, rộng, dày của đệm. Đệm cỡ lạ: Ecopillo nhận may theo số đo.' },
    ],
  },
}
