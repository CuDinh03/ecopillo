import { Link } from 'react-router-dom'
import { AgentSignup } from '../components/dealers/AgentSignup'
import { DistributionModel } from '../components/dealers/DistributionModel'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Container } from '../components/ui/primitives'
import { PATHS } from '../data/links'
import { usePageMeta } from '../hooks/usePageMeta'
import { RECRUIT_TEXT } from '../data/pageText/recruit'
import { Blocks } from '../components/ui/Blocks'
import { RECRUIT_ORDER } from '../data/pageLayout'

/**
 * Thư ngỏ hợp tác đầu trang: chữ chị Phương gửi Zalo 19/11/2026, giữ nguyên văn (thay tiêu đề "Tuyển đại lý chăn ga gối đệm Ecopillo").
 * Tiêu đề tab, mô tả Google vẫn ghi "Tuyển đại lý" vì khách tìm theo chữ đó.
 */
const LETTER = {
  eyebrow: RECRUIT_TEXT.thuNhan,
  title: RECRUIT_TEXT.thuTieuDe,
  paragraphs: RECRUIT_TEXT.thu,
  signOff: RECRUIT_TEXT.thuKyTen,
}

/**
 * Trang Tuyển đại lý, ở đúng link của web cũ /tuyen-dai-ly/ (menu "Đăng ký đại lý" của web cũ, Google đang xếp hạng).
 * Phía trên form là mô hình phân phối theo catalog 22.07.2026 (kiểu 4B).
 * Điểm bán từ 05/11/2026 nằm trong Liên hệ mua hàng (#diem-ban).
 */
export function RecruitPage() {
  usePageMeta(
    // Bỏ chữ "Ecopillo" trong tiêu đề vì đuôi "· Ecopillo" đã có (08/11/2026)
    'Tuyển đại lý, nhà phân phối chăn ga gối đệm',
    RECRUIT_TEXT.moTaGoogle,
  )
  return (
    <div className="pb-24">
      <PageHero
        crumbs={[{ label: 'Tuyển đại lý' }]}
        eyebrow={LETTER.eyebrow}
        title={LETTER.title}
      >
        <div className="mt-5 max-w-2xl space-y-4 text-body leading-relaxed text-ink-soft">
          {LETTER.paragraphs.map((text) => (
            <p key={text} className="chu-deu">
              {text}
            </p>
          ))}
          <p className="font-display text-[1.35rem] leading-snug text-deep-800 italic">{LETTER.signOff}</p>
        </div>
        <Link to={`${PATHS.contact}#diem-ban`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-deep-900 underline-offset-4 hover:underline">
          Xem các điểm phân phối hiện có <Icon name="arrowRight" size={15} />
        </Link>
      </PageHero>

      {/* Thứ tự khối: Ecopillo đổi ở Nội dung web → Bố cục trang Tuyển đại lý (src/data/pageLayout.ts) */}
      <Blocks
        order={RECRUIT_ORDER}
        blocks={{
          'mo-hinh': (
            <Container className="mt-10 sm:mt-14">
              <DistributionModel />
            </Container>
          ),
          'dang-ky': (
            <Container className="mt-14 sm:mt-20">
              <AgentSignup />
            </Container>
          ),
        }}
      />
    </div>
  )
}
