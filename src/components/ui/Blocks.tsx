import { Fragment, type ReactNode } from 'react'

/** Vẽ các khối của một trang theo thứ tự Ecopillo chọn (src/data/pageLayout.ts); mã không có trong `blocks` thì bỏ */
export function Blocks({ order, blocks }: { order: readonly string[]; blocks: Readonly<Record<string, ReactNode>> }) {
  return (
    <>
      {order.map((id) => (blocks[id] === undefined ? null : <Fragment key={id}>{blocks[id]}</Fragment>))}
    </>
  )
}
