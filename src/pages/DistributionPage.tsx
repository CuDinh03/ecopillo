import { Navigate, useLocation } from 'react-router-dom'
import { PATHS } from '../data/links'

/**
 * Trang /he-thong-phan-phoi/ từ 05/11/2026 (mục 9 phương án A) chuyển về
 * Liên hệ mua hàng, neo #diem-ban. Giữ ?gan-toi=1 để hỏi vị trí ngay.
 * 301 máy chủ (HOST_REDIRECTS) cũng về /lien-he/; bản SPA dùng Navigate để gắn neo.
 */
export function DistributionPage() {
  const { search } = useLocation()
  return <Navigate to={`${PATHS.contact}${search}#diem-ban`} replace />
}
