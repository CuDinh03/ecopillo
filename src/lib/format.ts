const vnd = new Intl.NumberFormat('vi-VN')

/** 3500000 → "3.500.000đ" */
export const formatVND = (value: number) => `${vnd.format(value)}đ`

/** Khoảng giá gọn: "3.500.000đ – 3.800.000đ", hoặc một giá nếu hai đầu bằng nhau */
export const formatRange = (min: number, max: number) =>
  min === max ? formatVND(min) : `${formatVND(min)} – ${formatVND(max)}`

/** 3500000 → "3,5 triệu" — dùng cho nhãn ngắn */
export const formatMillions = (value: number) =>
  `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value / 1_000_000)} triệu`
