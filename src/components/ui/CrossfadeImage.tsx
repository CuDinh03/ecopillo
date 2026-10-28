import { useEffect, useRef, useState } from 'react'
import type { ImageSource } from '../../data/catalog'

interface Layer {
  image: ImageSource
  loaded: boolean
}

interface CrossfadeImageProps {
  image: ImageSource
  sizes: string
  className?: string
  priority?: boolean
}

const FADE_MS = 380

/**
 * Ảnh đổi mềm: ảnh mới nằm chồng lên ảnh cũ, chỉ hiện dần khi đã tải xong (không nháy trắng),
 * vừa rõ dần (nhòe 6px → 0) vừa thu nhẹ 1.03 → 1; ảnh cũ mờ và nhòe đi cùng lúc. Khi người dùng tắt chuyển động, hiệu ứng gần như tức thì (xem index.css).
 * Cha cần có `relative` và kích thước cố định.
 *
 * Đổi ảnh liên tục (rê chuột lướt qua nhiều mẫu rồi bấm chọn) vẫn phải luôn có một ảnh đang hiện:
 * - Ảnh đã tải một lần thì nhớ lại (loadedSrcs). Quay về ảnh đó, trình duyệt dùng lại đúng thẻ <img> cũ nên KHÔNG báo "đã tải"
 *   lần nữa; nếu cứ ngồi chờ tín hiệu ấy thì khung ảnh trắng mãi (lỗi gặp ngày 14/10/2026).
 * - Lớp ảnh cũ chỉ bị bỏ khi lớp trên cùng đã tải xong.
 */
export function CrossfadeImage({ image, sizes, className = '', priority }: CrossfadeImageProps) {
  const [layers, setLayers] = useState<Layer[]>([{ image, loaded: true }])
  const loadedSrcs = useRef(new Set([image.src]))

  useEffect(() => {
    setLayers((current) => {
      if (current.at(-1)?.image.src === image.src) return current
      // Lớp nền là ảnh đã tải gần nhất (ảnh khách đang nhìn thấy); các lớp đang tải dở thì bỏ
      const base = [...current].reverse().find((l) => l.loaded && l.image.src !== image.src)
      return [...(base ? [base] : []), { image, loaded: loadedSrcs.current.has(image.src) }]
    })
  }, [image])

  const markLoaded = (src: string) => {
    loadedSrcs.current.add(src)
    setLayers((current) => (current.some((l) => l.image.src === src && !l.loaded) ? current.map((l) => (l.image.src === src ? { ...l, loaded: true } : l)) : current))
    // Ảnh mới hiện hẳn rồi thì bỏ lớp ảnh cũ; lớp trên cùng chưa tải xong thì giữ lớp cũ lại
    window.setTimeout(() => setLayers((current) => (current.length > 1 && current.at(-1)?.loaded ? current.slice(-1) : current)), FADE_MS + 40)
  }

  return (
    <>
      {layers.map((layer, i) => {
        const isTop = i === layers.length - 1
        const topLoaded = layers[layers.length - 1]?.loaded
        // Lớp trên: hiện khi tải xong. Lớp cũ: mờ đi khi lớp trên đã sẵn sàng
        const visible = isTop ? layer.loaded : !topLoaded
        return (
          <img
            key={layer.image.src}
            src={layer.image.src}
            srcSet={layer.image.srcSet || undefined}
            sizes={layer.image.srcSet ? sizes : undefined}
            alt={isTop ? layer.image.alt : ''}
            aria-hidden={isTop ? undefined : true}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            onLoad={() => markLoaded(layer.image.src)}
            // Ảnh hỏng cũng coi như xong, để khung không kẹt ở ảnh của mẫu trước
            onError={() => markLoaded(layer.image.src)}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] ease-[var(--ease-soft)] ${
              visible
                ? 'blur-0 scale-100 opacity-100'
                : isTop
                  ? 'opacity-0 motion-safe:scale-[1.03] motion-safe:blur-[6px]'
                  : 'opacity-0 motion-safe:blur-[4px]'
            } ${className}`}
          />
        )
      })}
    </>
  )
}
