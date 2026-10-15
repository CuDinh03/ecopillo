interface MobileTabBarProps<T extends string> {
  label: string
  tabs: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  className?: string
}

/**
 * Hàng tab gạch chân cho các khối gộp trên trang chủ điện thoại (mẫu 2, owner chốt 15/10/2026).
 * Chỉ hiện dưới 640px; máy tính hiện đủ mọi phần nên không cần tab.
 * Các phần không được chọn vẫn nằm trong trang (ẩn bằng CSS), Google vẫn đọc đủ chữ.
 */
export function MobileTabBar<T extends string>({ label, tabs, value, onChange, className = '' }: MobileTabBarProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`-mx-5 flex gap-5 overflow-x-auto border-b border-cream-200 px-5 [scrollbar-width:none] sm:hidden ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tab.id)}
            className={`-mb-px h-11 shrink-0 border-b-2 text-[0.92rem] whitespace-nowrap transition-colors ${
              active ? 'border-deep-800 font-medium text-deep-900' : 'border-transparent text-ink-faint'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
