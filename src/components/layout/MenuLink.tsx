import type { AnchorHTMLAttributes } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { isSiteLink } from '../../data/pageText/linkField'

interface MenuLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'> {
  /** Link Ecopillo sửa ở Nội dung web: trang trong web (/…) hoặc https://… */
  href: string
  className?: string
  /** Link trong web dùng NavLink (tự gắn aria-current khi đang ở trang đó), như nút Đặt hàng trên thanh */
  isNav?: boolean
}

/**
 * Link của menu, chân trang: trang trong web mở bằng bộ định tuyến (không tải lại trang);
 * link https mở thẻ mới; tel:, mailto: mở như link thường.
 */
export function MenuLink({ href, isNav = false, children, ...rest }: MenuLinkProps) {
  if (isSiteLink(href))
    return isNav ? (
      <NavLink to={href} {...rest}>
        {children}
      </NavLink>
    ) : (
      <Link to={href} {...rest}>
        {children}
      </Link>
    )
  const isWeb = /^https?:\/\//.test(href)
  return (
    <a href={href} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}
