import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, CONTACT, OPENING_HOURS, SHOWROOMS } from '../../data/brand'
import { Icon } from '../ui/Icon'
import { Container } from '../ui/primitives'
import { NAV_ITEMS } from './Header'
import { POLICY_NAV } from '../../data/policyNav'
import { PATHS } from '../../data/links'
import { NEAR_ME_URL } from '../../data/dealers'
import { SocialIcons } from '../home/SocialLinks'
import { Logo } from './Logo'

/**
 * Điện thoại: mỗi link trong danh sách cao khoảng 44px (đệm trên dưới, rà điện thoại 05/11/2026) cho dễ bấm, các vùng bấm xếp sát nhau không chồng.
 * Từ sm trở lên giữ khoảng cách cũ.
 */
const LINK_LIST = 'text-sm max-sm:pb-3 sm:mt-5 sm:space-y-2.5'
const LIST_LINK = 'transition-colors hover:text-deep-900 max-sm:inline-block max-sm:py-2.5'
const CONTACT_LINK = 'flex items-center gap-2.5 whitespace-nowrap hover:text-deep-900 max-sm:py-2.5'
const MESSAGE_LINK = 'inline-flex items-center gap-2.5 font-medium text-deep-900 underline-offset-2 hover:underline max-sm:py-2.5'

interface FooterGroupProps {
  /** Dùng làm id danh sách cho aria-controls */
  id: string
  title: string
  /** Lớp của danh sách link (thẻ ul) */
  listClassName: string
  children: ReactNode
}

/**
 * Một nhóm link chân trang (D2, góp ý SEO 08/11/2026). Điện thoại (dưới 640px): tiêu đề là nút "+" mở, gập danh sách,
 * mặc định gập để chân trang ngắn lại. Từ 640px trở lên luôn mở như cũ.
 * Danh sách gập chỉ ẩn bằng CSS nên link vẫn nằm trong HTML dựng sẵn cho Google đọc.
 * Không dùng <details>: thẻ đó gập thì ẩn ở mọi khổ màn hình, không mở sẵn cho máy tính được.
 */
function FooterGroup({ id, title, listClassName, children }: FooterGroupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const listId = `chan-trang-${id}`
  return (
    <div className="max-sm:border-t max-sm:border-line max-sm:last:border-b">
      {/* Tiêu đề nhóm đậm, chàm đậm (chị Phương 09/11/2026: "in đậm tiêu đề") */}
      <h3 className="eyebrow font-bold text-deep-900">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={listId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex min-h-12 w-full items-center justify-between gap-4 text-left tracking-[inherit] uppercase sm:hidden"
        >
          {title}
          <Icon
            name="plus"
            size={18}
            className={`shrink-0 text-deep-700 transition-transform duration-200 ease-out motion-reduce:transition-none ${isOpen ? 'rotate-45' : ''}`}
          />
        </button>
        <span className="max-sm:hidden">{title}</span>
      </h3>
      <ul id={listId} className={`${isOpen ? '' : 'max-sm:hidden'} ${listClassName}`}>
        {children}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-ivory pt-20 pb-32 text-ink-soft md:pb-14">
      <Container>
        <div className="grid gap-12 max-sm:gap-0 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.95fr_1.1fr_1.2fr] lg:gap-10">
          <div className="max-sm:pb-10">
            <Logo className="h-14" />
            {/* Một màu chàm, đậm (chị Phương 09/11/2026: "in đậm chỗ này, chữ về 1 màu"; trước có chữ đỏ) */}
            <p className="mt-6 max-w-xs text-sm leading-relaxed font-semibold text-deep-900">
              {BRAND.company}. Chăn ga gối đệm cao cấp, hơn 15 năm nâng niu giấc ngủ của {BRAND.customers} gia đình Việt.
            </p>
            {/* Điện thoại: hotline và nhắn tin luôn hiện, không nằm trong nhóm gập (D2, 08/11/2026) */}
            <ul className="mt-4 text-sm sm:hidden">
              <li>
                <a href={CONTACT.hotlineTel} className={CONTACT_LINK}>
                  <Icon name="phone" size={16} /> <span className="tabular">{CONTACT.hotlineDisplay}</span>
                  <span className="text-ink-faint">· có Zalo</span>
                </a>
              </li>
              <li>
                <Link to={PATHS.contact} className={MESSAGE_LINK}>
                  <Icon name="mail" size={16} /> Gửi tin nhắn cho Ecopillo
                </Link>
              </li>
            </ul>
            <p className="mt-6 font-display text-2xl text-deep-700 italic">
              {BRAND.philosophy.join(' · ')}
            </p>
            <div className="mt-7">
              <SocialIcons tone="light" />
            </div>
          </div>

          <FooterGroup id="kham-pha" title="Khám phá" listClassName={LINK_LIST}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className={LIST_LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to={PATHS.order} className={LIST_LINK}>
                Đặt hàng online
              </Link>
            </li>
          </FooterGroup>

          <FooterGroup id="chinh-sach" title="Chính sách" listClassName={LINK_LIST}>
            {POLICY_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={LIST_LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterGroup>

          <FooterGroup id="lien-he" title="Liên hệ" listClassName="text-sm max-sm:pb-3 sm:mt-5 sm:space-y-3">
            {/* Hotline và "Gửi tin nhắn" trên điện thoại đã hiện ở cột đầu */}
            <li className="max-sm:hidden">
              <a href={CONTACT.hotlineTel} className={CONTACT_LINK}>
                <Icon name="phone" size={16} /> <span className="tabular">{CONTACT.hotlineDisplay}</span>
                <span className="text-ink-faint">· có Zalo</span>
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneTel} className={CONTACT_LINK}>
                <Icon name="phone" size={16} /> <span className="tabular">{CONTACT.phoneDisplay}</span>
                <span className="text-ink-faint">· điện thoại</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className={CONTACT_LINK}>
                <Icon name="mail" size={16} /> {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.fanpageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={CONTACT_LINK}
              >
                <Icon name="facebook" size={16} /> Fanpage Ecopillo.com.vn
              </a>
            </li>
            <li className="max-sm:hidden">
              <Link to={PATHS.contact} className={MESSAGE_LINK}>
                <Icon name="mail" size={16} /> Gửi tin nhắn cho Ecopillo
              </Link>
            </li>
          </FooterGroup>

          {/* Mục 9 phản hồi 05/11: điểm bán gộp vào Liên hệ mua hàng; nhãn chân trang đổi theo */}
          <FooterGroup id="diem-ban" title="Điểm bán" listClassName="space-y-4 text-sm max-sm:pb-5 sm:mt-5">
            {SHOWROOMS.map((s) => (
              <li key={s.id} className="flex gap-2.5">
                <Icon name="pin" size={16} className="mt-1 shrink-0" />
                <span>
                  <span className="block font-medium text-deep-900">
                    {s.kind} · {s.city}
                  </span>
                  {s.address}
                </span>
              </li>
            ))}
            <li className="flex gap-2.5">
              <Icon name="clock" size={16} className="mt-1 shrink-0" />
              <span>Mở cửa {OPENING_HOURS}</span>
            </li>
            <li>
              <Link to={NEAR_ME_URL} className="-my-2 inline-flex items-center gap-1.5 py-2 font-medium text-deep-900 underline-offset-2 hover:underline">
                <Icon name="locate" size={14} /> Tìm đại lý gần Quý khách
              </Link>
            </li>
          </FooterGroup>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 text-xs text-ink-faint md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <p>© {new Date().getFullYear()} {BRAND.company}. Đạt chứng nhận ISO 9001:2015 và TQC.</p>
            <p>Chỉ đổi hàng, không trả hàng hoàn tiền · Kiểm hàng khi nhận · Thanh toán khi nhận hàng toàn quốc</p>
            <p>
              <Link to={PATHS.privacy} className="-my-2.5 inline-block py-2.5 underline underline-offset-2 hover:text-deep-900">
                Chính sách bảo vệ thông tin cá nhân
              </Link>
            </p>
          </div>
          <a
            href={CONTACT.moitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 self-start rounded-lg bg-white p-1.5 transition hover:opacity-90 md:self-auto"
            aria-label="Website đã thông báo Bộ Công Thương"
          >
            <img
              src="/images/partners/bo-cong-thuong.png"
              alt="Đã thông báo Bộ Công Thương"
              width={300}
              height={113}
              loading="lazy"
              className="h-11 w-auto"
            />
          </a>
        </div>
      </Container>
    </footer>
  )
}
