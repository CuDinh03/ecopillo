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
 * Điện thoại: mỗi link trong danh sách cao 36px (đệm trên dưới) cho dễ bấm, các vùng bấm xếp sát nhau không chồng.
 * Từ sm trở lên giữ khoảng cách cũ.
 */
const LINK_LIST = 'mt-3 text-sm sm:mt-5 sm:space-y-2.5'
const LIST_LINK = 'transition-colors hover:text-deep-900 max-sm:inline-block max-sm:py-2'
const CONTACT_LINK = 'flex items-center gap-2.5 whitespace-nowrap hover:text-deep-900 max-sm:py-2'

export function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-ivory pt-20 pb-32 text-ink-soft md:pb-14">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.95fr_1.1fr_1.2fr] lg:gap-10">
          <div>
            <Logo className="h-14" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-soft">
              {BRAND.company}. <span className="font-medium text-tagline">Chăn ga gối đệm cao cấp</span>, hơn 15 năm nâng niu giấc ngủ của{' '}
              {BRAND.customers} gia đình Việt.
            </p>
            <p className="mt-6 font-display text-2xl text-deep-700 italic">
              {BRAND.philosophy.join(' · ')}
            </p>
            <div className="mt-7">
              <SocialIcons tone="light" />
            </div>
          </div>

          <div>
            <h3 className="eyebrow">Khám phá</h3>
            <ul className={LINK_LIST}>
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
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Chính sách</h3>
            <ul className={LINK_LIST}>
              {POLICY_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={LIST_LINK}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Liên hệ</h3>
            <ul className="mt-3 text-sm sm:mt-5 sm:space-y-3">
              <li>
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
              <li>
                <Link to={PATHS.contact} className="inline-flex items-center gap-2.5 font-medium text-deep-900 underline-offset-2 hover:underline max-sm:py-2">
                  <Icon name="mail" size={16} /> Gửi tin nhắn cho Ecopillo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Hệ thống phân phối</h3>
            <ul className="mt-5 space-y-4 text-sm">
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
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-cream-200 pt-8 text-xs text-ink-faint md:flex-row md:items-center md:justify-between">
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
