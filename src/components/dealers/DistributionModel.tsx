import { DISTRIBUTION_MAP, DISTRIBUTOR_COUNT, SALES_CHANNELS } from '../../data/dealers'
import { revealDelay } from '../../lib/reveal'

/**
 * Mô hình phân phối (kiểu 4B, owner chọn 24/10/2026; mẫu docs/de-xuat-phan-moi-catalog.html): bản đồ catalog 22.07.2026,
 * ô "50 nhà phân phối" đè góc bản đồ, ba kênh đánh số. Đặt ở trang Tuyển đại lý, phía trên form đăng ký:
 * người muốn làm đại lý thấy hệ thống lớn cỡ nào trước khi để lại thông tin.
 */
export function DistributionModel() {
  return (
    <section aria-labelledby="mo-hinh-tieu-de" className="grid gap-10 lg:grid-cols-[5fr_6fr] lg:items-center lg:gap-14">
      <figure data-reveal="left" className="rounded-[1.75rem] bg-ivory p-6 shadow-[var(--shadow-soft)] sm:p-8">
        {/* Ô con số nằm trong khung bản đồ, chú thích ở ngoài để không bị đè trên điện thoại */}
        <div className="relative">
          <img
            src={DISTRIBUTION_MAP.src}
            alt={DISTRIBUTION_MAP.alt}
            width={DISTRIBUTION_MAP.width}
            height={DISTRIBUTION_MAP.height}
            loading="lazy"
            decoding="async"
            // Chiều cao cố định, rộng theo tỉ lệ ảnh: giữ chỗ trước khi ảnh tải xong, không xô phần dưới (CLS)
            className="mx-auto h-[26rem] w-auto max-w-full object-contain sm:h-[32rem]"
          />
          <p className="absolute right-0 bottom-4 rounded-2xl bg-deep-900 px-5 py-4 text-ivory shadow-[var(--shadow-lift)] sm:bottom-8 sm:px-6 sm:py-5">
            <span className="font-display block text-[2.8rem] leading-none sm:text-[3.4rem]">{DISTRIBUTOR_COUNT}</span>
            <span className="mt-1 block text-small text-mist-200">nhà phân phối</span>
          </p>
        </div>
        <figcaption className="mt-4 text-center text-label leading-snug text-ink-faint">
          Ngôi sao: văn phòng Hà Nội, chi nhánh TP. HCM. Biểu tượng E đánh dấu các vùng có nhà phân phối, không phải từng địa chỉ.
        </figcaption>
      </figure>
      <div>
        <header data-reveal>
          <p className="eyebrow">Mô hình kinh doanh</p>
          <h2 id="mo-hinh-tieu-de" className="font-display mt-4 text-[2rem] leading-tight text-deep-900 sm:text-[2.6rem]">
            Một hệ thống, <em className="text-deep-700">ba kênh</em> song song
          </h2>
          <p className="mt-4 max-w-xl text-body leading-relaxed text-ink-soft">
            Sản phẩm, hình ảnh thương hiệu và chính sách bán hàng được đồng bộ, để khách mua ở đâu cũng nhận cùng một trải nghiệm.
          </p>
        </header>
        <ol className="mt-6 grid gap-3">
          {SALES_CHANNELS.map((channel, i) => (
            <li
              key={channel.title}
              data-reveal
              style={revealDelay(i)}
              className="grid grid-cols-[2.6rem_1fr] gap-x-3 rounded-2xl bg-ivory p-5 shadow-[var(--shadow-soft)]"
            >
              <span className="font-display text-[1.6rem] leading-none text-deep-700 italic">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="block font-medium text-deep-900">{channel.title}</span>
                <span className="mt-1 block text-small leading-relaxed text-ink-soft">{channel.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
