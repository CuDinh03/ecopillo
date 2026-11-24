import { UNSAFE_createBrowserHistory, type HistoryRouterProps, type Location, type To } from 'react-router-dom'
import { internalPath, publicPath } from '../data/pageAliases'

type History = HistoryRouterProps['history']

/** Đổi phần đường dẫn của một đích điều hướng (chuỗi "/a/?b#c" hoặc { pathname, search, hash }) */
const mapTo = (to: To, map: (path: string) => string): To =>
  typeof to === 'string' ? map(to) : to.pathname ? { ...to, pathname: map(to.pathname) } : to

const toInternal = <L extends Location>(location: L): L => ({ ...location, pathname: internalPath(location.pathname) })

/**
 * Lịch sử trình duyệt cho trang Ecopillo đã đổi link (src/data/pageAliases.ts). Bộ định tuyến và mọi component thấy "link trong"
 * (link cũ của trang: route, PATHS, so trang đang mở, menu đang chọn chạy như cũ); thanh địa chỉ, `href` của mọi `<Link>` và
 * mọi lần chuyển trang dùng link mới. Khách mở link cũ (bản xem thử không có 301 của máy chủ) thì thanh địa chỉ đổi ngay sang
 * link mới, không tải lại trang.
 */
export function createAliasHistory(): History {
  const { pathname, search, hash } = window.location
  const shown = publicPath(pathname)
  if (shown !== pathname) window.history.replaceState(window.history.state, '', shown + search + hash)

  const base = UNSAFE_createBrowserHistory({ v5Compat: true })
  return {
    get action() {
      return base.action
    },
    get location() {
      return toInternal(base.location)
    },
    listen: (listener) => base.listen((update) => listener({ ...update, location: toInternal(update.location) })),
    createHref: (to) => base.createHref(mapTo(to, publicPath)),
    createURL: (to) => base.createURL(mapTo(to, publicPath)),
    // NavLink so link với trang đang mở theo "link trong": link mới Ecopillo gõ vào menu cũng được tính là trang đang mở
    encodeLocation: (to) => {
      const path = base.encodeLocation(to)
      return { ...path, pathname: internalPath(path.pathname) }
    },
    push: (to, state) => base.push(mapTo(to, publicPath), state),
    replace: (to, state) => base.replace(mapTo(to, publicPath), state),
    go: (delta) => base.go(delta),
  }
}
