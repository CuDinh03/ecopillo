import { useEffect, useRef, useState } from 'react'
import { BRAND_VIDEO, CONTACT } from '../../data/brand'
import type { ImageSource } from '../../data/catalog'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'
import { Container, SectionHeading } from '../ui/primitives'

/** Biên bản mục 25: ảnh bìa video là ảnh đội ngũ Ecopillo tại cửa hàng */
const COVER: ImageSource = {
  src: '/images/video/bia-phim.webp',
  srcSet: '/images/video/bia-phim-sm.webp 800w, /images/video/bia-phim.webp 1280w',
  alt: 'Đội ngũ Ecopillo tại cửa hàng',
}

/** cover: chỉ ảnh bìa · auto: tự phát không tiếng khi lướt tới · manual: khách bấm phát, có tiếng */
type Mode = 'cover' | 'auto' | 'manual'

const embedUrl = (muted: boolean) =>
  `https://www.youtube-nocookie.com/embed/${BRAND_VIDEO.id}?autoplay=1&mute=${muted ? 1 : 0}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`

/** Gửi lệnh cho trình phát YouTube (cần enablejsapi=1) */
const command = (frame: HTMLIFrameElement | null, func: 'playVideo' | 'pauseVideo' | 'unMute') =>
  frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')

/**
 * Phim thương hiệu: ảnh bìa của Ecopillo; lướt tới thì tự phát không tiếng (trình duyệt chặn tự phát có tiếng),
 * lướt qua thì tạm dừng, quay lại thì phát tiếp. Trình phát YouTube (youtube-nocookie) chỉ tải khi tới mục này
 * để trang vẫn nhẹ. Khách bật "giảm chuyển động" thì không tự phát, bấm mới phát.
 */
export function BrandVideo() {
  const [mode, setMode] = useState<Mode>('cover')
  const [isMuted, setIsMuted] = useState(true)
  const boxRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box || !('IntersectionObserver' in window)) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (mode === 'cover') {
          if (entry.isIntersecting && !reduced) setMode('auto')
        } else if (!entry.isIntersecting) {
          command(frameRef.current, 'pauseVideo')
        } else if (mode === 'auto') {
          command(frameRef.current, 'playVideo')
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(box)
    return () => observer.disconnect()
  }, [mode])

  const unmute = () => {
    command(frameRef.current, 'unMute')
    command(frameRef.current, 'playVideo')
    setIsMuted(false)
  }

  return (
    <section aria-labelledby="video-title" className="bg-cream-50 py-14 sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <SectionHeading
            id="video-title"
            eyebrow="Phim thương hiệu"
            title={
              <>
                Một giấc ngủ <span className="text-mist-600 italic">được nâng niu</span>
              </>
            }
            lead="Ba phút để cảm nhận chất vải Lyocell, đường chần thêu và không gian phòng ngủ Ecopillo."
          />
          <a
            href={CONTACT.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4.5 -mb-2.5 inline-flex items-center gap-2 py-2.5 text-sm font-medium text-deep-800 underline-offset-4 hover:underline"
          >
            <Icon name="youtube" size={18} /> Xem thêm trên kênh YouTube Ecopillo
          </a>
        </div>

        <div className="lg:col-span-8">
          <div ref={boxRef} data-reveal className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-deep-950 shadow-[var(--shadow-lift)]">
            {mode === 'cover' ? (
              <button
                type="button"
                onClick={() => {
                  setIsMuted(false)
                  setMode('manual')
                }}
                className="group absolute inset-0 h-full w-full text-left"
                aria-label={`Phát video: ${BRAND_VIDEO.title}`}
              >
                <Placeholder
                  className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                  tone="deep"
                  note="Ảnh bìa video"
                  image={COVER}
                  sizes="(min-width: 1024px) 800px, 100vw"
                  position="50% 25%"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-deep-950/75 via-deep-950/10 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-16 w-16 items-center sm:h-20 sm:w-20 justify-center rounded-full bg-ivory/95 text-deep-800 shadow-[var(--shadow-lift)] transition-transform duration-300 group-hover:scale-110">
                    {/* Vòng lan nhẹ quanh nút phát */}
                    <span aria-hidden="true" className="pulse-ring absolute inset-0 rounded-full ring-2 ring-ivory/70" />
                    <Icon name="play" size={30} className="translate-x-0.5" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute inset-x-6 bottom-5 hidden text-ivory sm:block">
                  <span className="block text-[0.7rem] tracking-[0.16em] text-mist-200 uppercase">YouTube · Ecopillo Việt Nam</span>
                  <span className="font-display mt-1 block text-xl sm:text-2xl">{BRAND_VIDEO.title}</span>
                </span>
              </button>
            ) : (
              <>
                <iframe
                  ref={frameRef}
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl(mode === 'auto')}
                  title={BRAND_VIDEO.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                {mode === 'auto' && isMuted && (
                  <button
                    type="button"
                    onClick={unmute}
                    className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-ivory/95 px-4 py-2 text-sm font-medium text-deep-900 shadow-[var(--shadow-soft)] transition hover:bg-ivory"
                  >
                    <Icon name="volume" size={16} /> Bật tiếng
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
