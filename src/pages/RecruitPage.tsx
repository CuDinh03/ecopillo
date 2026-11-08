import { Link } from 'react-router-dom'
import { AgentSignup } from '../components/dealers/AgentSignup'
import { DistributionModel } from '../components/dealers/DistributionModel'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Container } from '../components/ui/primitives'
import { PATHS } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Trang Tuyển đại lý, ở đúng link của web cũ /tuyen-dai-ly/ (menu "Đăng ký đại lý" của web cũ, Google đang xếp hạng).
 * Phía trên form là mô hình phân phối theo catalog 22.07.2026 (kiểu 4B).
 * Điểm bán từ 05/11/2026 nằm trong Liên hệ mua hàng (#diem-ban).
 */
export function RecruitPage() {
  usePageMeta(
    // Bỏ chữ "Ecopillo" trong tiêu đề vì đuôi "· Ecopillo" đã có (08/11/2026)
    'Tuyển đại lý, nhà phân phối chăn ga gối đệm',
    'Ecopillo tuyển đại lý, nhà phân phối chăn ga gối đệm cao cấp vải Lyocell tại các tỉnh, thành. Để lại thông tin, bộ phận kinh doanh gọi lại.',
  )
  return (
    <div className="pb-24">
      <PageHero
        crumbs={[{ label: 'Tuyển đại lý' }]}
        eyebrow="Hợp tác phân phối"
        title={
          <>
            Tuyển đại lý{' '}
            <br />
            chăn ga gối đệm Ecopillo
          </>
        }
        lead="Ecopillo tìm đối tác phân phối tại các tỉnh, thành: cửa hàng chăn ga, nội thất, đồ cưới. Để lại thông tin, bộ phận kinh doanh sẽ gọi lại."
      >
        <Link to={`${PATHS.contact}#diem-ban`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-deep-900 underline-offset-4 hover:underline">
          Xem các điểm phân phối hiện có <Icon name="arrowRight" size={15} />
        </Link>
      </PageHero>

      <Container className="mt-10 sm:mt-14">
        <DistributionModel />
      </Container>

      <Container className="mt-14 sm:mt-20">
        <AgentSignup />
      </Container>
    </div>
  )
}
