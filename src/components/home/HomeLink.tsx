import type { ComponentPropsWithoutRef, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { inPageId, useInPageTarget } from '../../hooks/useInPageTarget'
import { scrollToElement } from '../../lib/scroll'

type HomeLinkProps = { to: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>

/**
 * Link Ecopillo tự đặt ở Nội dung web (ô kiểu "link"): đường trong web (/…) đi bằng bộ định tuyến, không tải lại trang;
 * link ra ngoài (https://, tel:, mailto:) là thẻ <a> thường, link https mở tab mới;
 * "#bo-suu-tap" cuộn mềm tới khối đó trong cùng trang, khối không có trên trang thì không hiện link.
 */
export function HomeLink({ to, ...rest }: HomeLinkProps) {
  if (inPageId(to)) return <InPageLink to={to} {...rest} />
  if (to.startsWith('/') && !to.startsWith('//')) return <Link to={to} {...rest} />
  const isWeb = /^https?:\/\//.test(to)
  return <a href={to} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest} />
}

/** Link tới một khối trong cùng trang: cuộn qua Lenis khi đang chạy (src/lib/scroll.ts), ghi "#…" lên thanh địa chỉ */
function InPageLink({ to, onClick, ...rest }: HomeLinkProps) {
  const hasTarget = useInPageTarget(to)
  if (!hasTarget) return null
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = document.getElementById(inPageId(to) ?? '')
    if (!target) return
    event.preventDefault()
    scrollToElement(target)
    window.history.replaceState(window.history.state, '', to)
  }
  return <a href={to} {...rest} onClick={handleClick} />
}
