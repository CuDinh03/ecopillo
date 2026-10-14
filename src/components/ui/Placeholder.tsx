import type { ImageSource } from '../../data/catalog'
import { Icon } from './Icon'

interface PlaceholderProps {
  /** Ghi chú ảnh sẽ đặt vào, ví dụ "Ảnh phòng ngủ trải bộ Eco Rosa ER25" */
  note: string
  className?: string
  tone?: 'cream' | 'mist' | 'deep'
  /** Màu gợi ý của mẫu vải, phủ nhẹ lên khung */
  tint?: string
  compact?: boolean
  /** Đặt ghi chú ở góc phải khi góc trái bị phần tử khác che */
  align?: 'start' | 'end'
  /** Có ảnh thật thì hiện ảnh, không thì hiện khung giữ chỗ */
  image?: ImageSource
  /** Gợi ý bề rộng hiển thị cho trình duyệt chọn bản ảnh phù hợp */
  sizes?: string
  /** Ảnh nằm ngay màn hình đầu: tải sớm */
  priority?: boolean
  /** Căn vùng ảnh khi bị cắt, ví dụ "50% 70%" */
  position?: string
}

const TONES = {
  cream: 'bg-cream-100 text-deep-700 border-cream-300/80',
  mist: 'bg-mist-100 text-deep-700 border-mist-300/80',
  deep: 'bg-deep-800 text-mist-200 border-deep-600',
} as const

/** Ảnh sản phẩm; nếu chưa có ảnh thật thì là khung giữ chỗ kèm ghi chú */
export function Placeholder({
  note,
  className = '',
  tone = 'cream',
  tint,
  compact,
  align = 'start',
  image,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority,
  position,
}: PlaceholderProps) {
  if (image) {
    return (
      <img
        src={image.src}
        srcSet={image.srcSet || undefined}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
        className={`block rounded-[inherit] bg-cream-100 object-cover ${className}`}
      />
    )
  }

  const positionClass = className.includes('absolute') ? '' : 'relative'
  return (
    <figure
      role="img"
      aria-label={`Khung ảnh: ${note}`}
      className={`weave ${positionClass} flex overflow-hidden rounded-[inherit] border border-dashed ${TONES[tone]} ${className}`}
      style={tint ? { backgroundColor: tint } : undefined}
    >
      {/* Đường chỉ chần mô phỏng — chi tiết gợi chất liệu */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-xl border border-dashed border-current opacity-15"
      />
      <figcaption
        className={`relative mt-auto flex items-start gap-2 ${compact ? 'p-2.5' : 'p-4'} ${
          align === 'end' ? 'ml-auto max-w-[60%] flex-row-reverse text-right' : 'text-left'
        }`}
      >
        <span
          className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full ${
            tone === 'deep' ? 'bg-deep-700' : 'bg-ivory/80'
          } ${compact ? 'h-5 w-5' : 'h-6 w-6'}`}
        >
          <Icon name="image" size={compact ? 11 : 13} />
        </span>
        <span className={`placeholder-note leading-snug ${compact ? 'text-[0.62rem]' : ''}`}>{note}</span>
      </figcaption>
    </figure>
  )
}
