import { useState, type ReactNode } from 'react'
import { Icon } from './Icon'

interface MobileMoreProps {
  /** Chữ trên nút mở, ví dụ "Đọc tiếp câu chuyện" */
  label: string
  children: ReactNode
  buttonClassName?: string
}

/**
 * Điện thoại: phần bên trong ẩn tới khi khách bấm nút. Máy tính: luôn hiện, không có nút.
 * Nội dung luôn nằm trong trang (chỉ ẩn bằng CSS) nên Google vẫn đọc đủ chữ.
 * Khối bọc dùng `display: contents` nên không đổi bố cục lưới, cột của phần bên trong.
 */
export function MobileMore({ label, children, buttonClassName = '' }: MobileMoreProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className={isOpen ? 'contents' : 'contents max-sm:hidden'}>{children}</div>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-deep-800 sm:hidden ${buttonClassName}`}
        >
          {label} <Icon name="chevronDown" size={15} />
        </button>
      )}
    </>
  )
}
