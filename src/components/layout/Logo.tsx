import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HEADER_TEXT } from '../../data/pageText/header'

interface LogoProps {
  className?: string
}

/** Logo Ecopillo Eternal — luôn giữ màu gốc theo bộ nhận diện, không đổi màu */
export function Logo({ className = 'h-11 sm:h-12' }: LogoProps) {
  // Ảnh logo tải hỏng thì hiện chữ "Ecopillo" bằng font tiêu đề, không để trình duyệt hiện alt bị cắt giữa chữ
  const [isBroken, setIsBroken] = useState(false)
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label={HEADER_TEXT.logoNhan}>
      {isBroken ? (
        <span className={`font-display inline-flex items-center text-[1.6rem] leading-none text-deep-900 ${className}`}>{HEADER_TEXT.logoChu}</span>
      ) : (
        <img
          onError={() => setIsBroken(true)}
          // Ảnh, chữ thay ảnh: Nội dung web → Đầu trang (src/data/pageText/header.ts; gốc là WebP 400/720px)
          src={HEADER_TEXT.logo.src}
          srcSet={HEADER_TEXT.logo.srcSet || undefined}
          sizes="(min-width: 640px) 131px, 120px"
          alt={HEADER_TEXT.logo.alt}
          width={720}
          height={265}
          className={`w-auto ${className}`}
        />
      )}
    </Link>
  )
}
