import { chu, definePageText, doan } from './define'

/** Chữ báo hết hàng sản phẩm lẻ (đợt F 24/11/2026): trang sản phẩm, đặt hàng, thẻ sản phẩm */
export const { set: STOCK_TEXT_SET, text: STOCK_TEXT } = definePageText(
  'het-hang',
  'Hết hàng',
  'Chữ hiện khi Ecopillo báo một sản phẩm hoặc một lựa chọn (kích thước, độ dày) "Hết hàng" trong WooCommerce.',
  {
    tamHet: chu('Nhãn trên ô lựa chọn, thẻ sản phẩm, cạnh giá', 'Tạm hết hàng'),
    luaChonHet: doan(
      'Câu khi lựa chọn đang chọn đã hết',
      '{chon} tạm hết hàng. Quý khách chọn lựa chọn khác, hoặc gọi, nhắn Zalo để đặt trước.',
      'Giữ {chon}: web thay bằng lựa chọn đang chọn',
    ),
    caSanPhamHet: doan('Câu khi cả sản phẩm tạm hết', 'Sản phẩm tạm hết hàng. Quý khách gọi hoặc nhắn Zalo để đặt trước, Ecopillo báo ngay khi có hàng.'),
  },
)
