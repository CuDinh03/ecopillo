import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

/**
 * Link Ecopillo tự đặt ở Nội dung web (ô kiểu "link"): đường trong web (/…) đi bằng bộ định tuyến, không tải lại trang;
 * link ra ngoài (https://, tel:, mailto:) là thẻ <a> thường, link https mở tab mới.
 */
export function HomeLink({ to, ...rest }: { to: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  if (to.startsWith('/') && !to.startsWith('//')) return <Link to={to} {...rest} />
  const isWeb = /^https?:\/\//.test(to)
  return <a href={to} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest} />
}
