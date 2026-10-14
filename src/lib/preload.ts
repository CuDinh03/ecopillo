import type { ImageSource } from '../data/catalog'

/** Tải trước ảnh khi rê chuột / chạm vào ô màu để lúc bấm đổi ngay */
export const preloadImage = (image: ImageSource | undefined) => {
  if (!image) return
  const img = new Image()
  if (image.srcSet) img.srcset = image.srcSet
  img.src = image.src
}
