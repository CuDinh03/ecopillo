import { useState } from 'react'

/**
 * `true` cho tới khi `key` đổi lần đầu (ví dụ chuỗi bộ lọc trên đường link), sau đó luôn `false`,
 * kể cả khi `key` quay về giá trị ban đầu.
 * Dùng để chỉ cho lưới hiện dần lần đầu vào trang: lọc, sắp xếp, sang trang thì thẻ hiện ngay.
 */
export function useFirstRender(key: string): boolean {
  const [firstKey] = useState(key)
  const [hasChanged, setHasChanged] = useState(false)
  // Cập nhật state ngay trong lúc render theo giá trị suy ra (cách React khuyên, không cần effect)
  if (!hasChanged && key !== firstKey) setHasChanged(true)
  return !hasChanged && key === firstKey
}
