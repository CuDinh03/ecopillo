import { Fragment, type ReactNode } from 'react'
import { isFreeBlockId } from '../../data/freeBlocks'
import { useLayoutReport } from '../../hooks/useLayoutReport'
import { FreeBlock, type FreeFrame } from './FreeBlock'

/**
 * Vẽ các khối của một trang theo thứ tự Ecopillo chọn (src/data/pageLayout.ts); mã không có trong `blocks` thì bỏ.
 * Mã "tu-do-N" là khối tự do Ecopillo thêm (src/data/freeBlocks.ts); `khung` nói khối đó nằm thẳng trong trang hay trong khung có sẵn.
 */
export function Blocks({ order, blocks, khung = 'trang' }: { order: readonly string[]; blocks: Readonly<Record<string, ReactNode>>; khung?: FreeFrame }) {
  useLayoutReport(order)
  return (
    <>
      {order.map((id) =>
        isFreeBlockId(id) ? (
          <FreeBlock key={id} id={id} khung={khung} />
        ) : blocks[id] === undefined ? null : (
          <Fragment key={id}>{blocks[id]}</Fragment>
        ),
      )}
    </>
  )
}
