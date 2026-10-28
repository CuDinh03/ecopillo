/**
 * Thẻ JSON-LD nằm ngay trong HTML dựng sẵn (Google đọc không cần chạy JavaScript).
 * Đổi `<` thành < để chữ trong dữ liệu không bao giờ đóng được thẻ script.
 */
export function JsonLd({ data }: { data: object | readonly object[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
