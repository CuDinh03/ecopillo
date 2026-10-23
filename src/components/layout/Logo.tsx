import { useState } from 'react'
import { Link } from 'react-router-dom'

interface LogoProps {
  className?: string
}

/** Logo Ecopillo Eternal — luôn giữ màu gốc theo bộ nhận diện, không đổi màu */
export function Logo({ className = 'h-11 sm:h-12' }: LogoProps) {
  // Ảnh logo tải hỏng thì hiện chữ "Ecopillo" bằng font tiêu đề, không để trình duyệt hiện alt bị cắt giữa chữ
  const [isBroken, setIsBroken] = useState(false)
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="Ecopillo – về trang chủ">
      {isBroken ? (
        <span className={`font-display inline-flex items-center text-[1.6rem] leading-none text-deep-900 ${className}`}>Ecopillo</span>
      ) : (
        <img
          onError={() => setIsBroken(true)}
          src="/images/brand/logo-ecopillo.png"
          alt="Ecopillo Eternal – Nâng niu giấc mơ xanh"
          width={720}
          height={265}
          className={`w-auto ${className}`}
        />
      )}
    </Link>
  )
}
