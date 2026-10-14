import { Link } from 'react-router-dom'

interface LogoProps {
  className?: string
}

/** Logo Ecopillo Eternal — luôn giữ màu gốc theo bộ nhận diện, không đổi màu */
export function Logo({ className = 'h-11 sm:h-12' }: LogoProps) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="Ecopillo – về trang chủ">
      <img
        src="/images/brand/logo-ecopillo.png"
        alt="Ecopillo Eternal – Nâng niu giấc mơ xanh"
        width={720}
        height={265}
        className={`w-auto ${className}`}
      />
    </Link>
  )
}
