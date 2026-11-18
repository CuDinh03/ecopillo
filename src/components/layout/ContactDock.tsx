import { Link } from 'react-router-dom'
import { CONTACT } from '../../data/brand'
import { PATHS } from '../../data/links'
import { Icon, ZaloMark } from '../ui/Icon'

/**
 * Thanh liên hệ luôn hiện:
 * - Điện thoại: thanh dưới cùng (Gọi / Zalo / Messenger / Đặt hàng).
 * - Máy tính: Messenger / Zalo / số hotline hiện sẵn ở góc phải dưới, nút hotline có sóng lan (owner 18/11/2026:
 *   "không để ẩn hiện khi bấm vào nữa mà để hiện rõ ra luôn kèm hiệu ứng nhấn mạnh", chọn phương án A trong
 *   docs/de-xuat-xem-tat-ca-va-lien-he-18-11.html; thay nút "Liên hệ" bấm mới mở của 12/10). Điện thoại giữ nguyên.
 */
export function ContactDock({ mobileBar = true }: { mobileBar?: boolean }) {
  return (
    <>
      {mobileBar && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-3 pt-2.5 backdrop-blur-md md:hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_1.4fr] gap-2">
            <a
              href={CONTACT.hotlineTel}
              className="flex h-12 flex-col items-center justify-center rounded-2xl bg-mist-100 text-deep-900 active:bg-mist-200"
            >
              <Icon name="phone" size={18} />
              <span className="mt-0.5 text-label font-medium">Gọi ngay</span>
            </a>
            <a
              href={CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-col items-center justify-center rounded-2xl bg-mist-100 text-deep-900 active:bg-mist-200"
            >
              <ZaloMark />
              <span className="mt-0.5 text-label font-medium">Nhắn Zalo</span>
            </a>
            <a
              href={CONTACT.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-col items-center justify-center rounded-2xl bg-mist-100 text-deep-900 active:bg-mist-200"
            >
              <Icon name="messenger" size={18} />
              <span className="mt-0.5 text-label font-medium">Messenger</span>
            </a>
            <Link
              to={PATHS.order}
              className="flex h-12 items-center justify-center gap-1.5 rounded-2xl bg-deep-800 text-sm font-medium whitespace-nowrap text-ivory active:bg-deep-700"
            >
              Đặt hàng
              {/* Dưới 360px ô quá hẹp, chữ rớt hai dòng "Đặt / hàng": bỏ mũi tên */}
              <Icon name="arrowRight" size={16} className="max-[359px]:hidden" />
            </Link>
          </div>
        </div>
      )}

      <DesktopDock />
    </>
  )
}

/** Nút tròn trắng (dưới 1440px) hoặc viên thuốc có chữ (từ 1440px) */
const SIDE_BUTTON =
  'flex h-13 w-13 items-center justify-center rounded-full bg-ivory text-sm font-medium text-deep-900 shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 min-[1440px]:w-auto min-[1440px]:justify-start min-[1440px]:gap-2 min-[1440px]:py-2 min-[1440px]:pr-4 min-[1440px]:pl-3'

/**
 * Máy tính: ba nút luôn hiện. Dưới 1440px khung nội dung chạm mép phải, nút có chữ đè lên thẻ, đoạn văn (rà 23/10/2026):
 * Messenger, Zalo thu thành nút tròn chỉ có biểu tượng (chữ vẫn có cho trình đọc màn hình); số hotline luôn hiện đủ.
 */
function DesktopDock() {
  return (
    <nav aria-label="Liên hệ Ecopillo" className="fixed right-6 bottom-6 z-40 hidden flex-col items-end gap-2.5 md:flex">
      <a
        href={CONTACT.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn Messenger Ecopillo"
        title="Nhắn Messenger"
        className={SIDE_BUTTON}
      >
        <Icon name="messenger" size={20} />
        <span aria-hidden="true" className="max-[1439px]:hidden">
          Messenger
        </span>
      </a>
      <a
        href={CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn Zalo Ecopillo"
        title="Nhắn Zalo"
        className={SIDE_BUTTON}
      >
        <ZaloMark />
        <span aria-hidden="true" className="max-[1439px]:hidden">
          Zalo
        </span>
      </a>
      <a
        href={CONTACT.hotlineTel}
        aria-label={`Gọi hotline ${CONTACT.hotlineDisplay}`}
        className="goi-song flex h-14 items-center gap-2 rounded-full bg-deep-800 py-2 pr-5 pl-4 text-sm font-medium text-ivory shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5 hover:bg-deep-700 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Icon name="phone" size={18} className="goi-rung" />
        <span className="tabular">{CONTACT.hotlineDisplay}</span>
      </a>
    </nav>
  )
}
