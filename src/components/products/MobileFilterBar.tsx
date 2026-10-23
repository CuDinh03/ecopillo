import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { CATEGORIES, type CategoryId } from '../../data/products'
import { Icon } from '../ui/Icon'
import { FilterPanel, type FilterPanelProps } from './FilterPanel'

/** Vuốt để đóng (B4, owner duyệt 24/10/2026): kéo quá 1/4 chiều cao bảng, hoặc vuốt nhanh hơn 0,11 px/ms thì đóng */
const DISMISS_FRACTION = 0.25
const DISMISS_VELOCITY = 0.11

/** Kéo lên quá đỉnh: cho nhích một chút, càng kéo càng nặng, thay vì đứng khựng */
const resist = (dy: number) => (dy >= 0 ? dy : -Math.pow(-dy, 0.6))

interface MobileFilterBarProps {
  panel: FilterPanelProps
  /** Số lựa chọn đang bật ngoài loại sản phẩm (mức giá, bộ, gam, sắp xếp): số trong nút "Bộ lọc" */
  activeCount: number
  resultCount: number
  /** Gọi khi đóng bảng lọc: trang cuộn về đầu lưới nếu đang ở dưới sâu */
  onClose: () => void
}

/**
 * Điện thoại, cách A owner chọn 20/10/2026 (phác thảo docs/phac-thao-bo-loc-di-theo.html):
 * thanh dính ngay dưới thanh đầu trang, gồm hàng loại sản phẩm vuốt ngang và nút "Bộ lọc".
 * Nút mở bảng lọc trượt từ dưới lên (thẻ <dialog> của trình duyệt: giữ focus bên trong, Esc để đóng).
 */
export function MobileFilterBar({ panel, activeCount, resultCount, onClose }: MobileFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  // Điểm bắt đầu kéo; null = không kéo. Chỉ nhận một ngón: ngón thứ hai bị bỏ qua
  const dragRef = useRef<{ id: number; y: number; t: number } | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
    // Khoá cuộn trang nền như menu điện thoại (Header.tsx)
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Đóng bằng Esc, nút, hay chạm nền mờ đều đi qua sự kiện close của thẻ dialog
  const handleClose = () => {
    setIsOpen(false)
    openerRef.current?.focus()
    onClose()
  }

  // Kéo bằng thanh nắm (touch-action: none chỉ ở thanh này, phần nội dung vẫn cuộn bình thường).
  // Đặt translate thẳng lên bảng, không qua biến CSS, để không tính lại style cả cây bên trong
  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { id: e.pointerId, y: e.clientY, t: performance.now() }
    if (dialogRef.current) dialogRef.current.style.transition = 'none'
  }
  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== e.pointerId || !dialogRef.current) return
    dialogRef.current.style.translate = `0 ${resist(e.clientY - drag.y)}px`
  }
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const dialog = dialogRef.current
    if (!drag || drag.id !== e.pointerId || !dialog) return
    dragRef.current = null
    const dy = e.clientY - drag.y
    const velocity = dy / Math.max(1, performance.now() - drag.t)
    const shouldClose = e.type === 'pointerup' && dy > 0 && (dy >= dialog.offsetHeight * DISMISS_FRACTION || velocity > DISMISS_VELOCITY)
    // Trả lại transition của lớp .sheet rồi mới đổi vị trí: bảng trượt tiếp từ chỗ ngón tay thả ra
    dialog.style.transition = ''
    dialog.style.translate = ''
    if (shouldClose) dialog.close()
  }

  return (
    <>
      <div className="sticky top-[4.5rem] z-30 -mx-5 flex items-center gap-2 bg-page/95 py-2 pr-3 pl-5 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md sm:hidden">
        <div role="group" aria-label="Loại sản phẩm" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none]">
          {[{ id: null, label: 'Tất cả' } as const, ...CATEGORIES].map((c) => (
            <CategoryPill key={c.label} id={c.id} label={c.label} isActive={panel.category === c.id} onPick={panel.onCategory} />
          ))}
        </div>
        <button
          ref={openerRef}
          type="button"
          aria-haspopup="dialog"
          onClick={() => {
            setHasOpened(true)
            setIsOpen(true)
          }}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-deep-800 px-3.5 text-small font-medium text-ivory"
        >
          <Icon name="filter" size={15} />
          Bộ lọc
          {activeCount > 0 && (
            <span className="tabular flex h-5 min-w-5 items-center justify-center rounded-full bg-ivory px-1 text-label text-deep-900">
              <span className="sr-only">, đang bật </span>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Bộ lọc sản phẩm"
        onClose={handleClose}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        className="sheet fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85svh] w-full max-w-full overflow-y-auto overscroll-contain rounded-t-[1.5rem] bg-ivory p-0 text-deep-900 backdrop:bg-deep-900/35 sm:hidden"
      >
        {/* Giữ nội dung trong lúc bảng trượt xuống (đóng có hoạt ảnh), chỉ bỏ khi chưa mở lần nào */}
        {(isOpen || hasOpened) && (
          <>
            {/* Thanh nắm: vùng chạm cao 28px, kéo xuống để đóng. Bàn phím đóng bằng Esc hoặc nút cuối bảng */}
            <div
              aria-hidden="true"
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="sticky top-0 z-10 flex h-7 cursor-grab touch-none items-center justify-center bg-ivory active:cursor-grabbing"
            >
              <span className="block h-1 w-10 rounded-full bg-line" />
            </div>
            <div className="px-5">
              <FilterPanel {...panel} idPrefix="loc-dt" />
            </div>
            <div className="pb-safe sticky bottom-0 mt-5 border-t border-line bg-ivory px-5 pt-3">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="tabular h-12 w-full rounded-full bg-deep-800 text-body-sm font-medium text-ivory"
              >
                Xem {resultCount} sản phẩm
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  )
}

interface CategoryPillProps {
  id: CategoryId | null
  label: string
  isActive: boolean
  onPick: (id: CategoryId | null) => void
}

function CategoryPill({ id, label, isActive, onPick }: CategoryPillProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onPick(id)}
      className={`h-9 shrink-0 rounded-full px-3.5 text-meta whitespace-nowrap transition-colors ${
        isActive ? 'bg-deep-800 font-medium text-ivory' : 'bg-ivory text-deep-900 shadow-[var(--shadow-soft)]'
      }`}
    >
      {label}
    </button>
  )
}
