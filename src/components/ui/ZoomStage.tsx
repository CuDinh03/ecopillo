import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { ImageSource } from '../../data/catalog'
import {
  clampView,
  distance,
  fitBox,
  hoverPanView,
  isZoomedView,
  MAX_SCALE,
  midpoint,
  pinchView,
  restView,
  TAP_SCALE,
  zoomAt,
  type Box,
  type Point,
  type View,
} from '../../lib/zoom'

/**
 * Khung ảnh trong khung xem toàn màn hình (Lightbox): phóng, kéo, vuốt đổi ảnh. Tự viết, không dùng thư viện (C3, 09/11/2026).
 * - Điện thoại: chụm 2 ngón hoặc chạm 2 lần để phóng; đang phóng thì kéo một ngón để soi; chưa phóng thì vuốt ngang đổi ảnh.
 * - Máy tính: bấm để phóng / thu, đang phóng thì rê chuột để soi, lăn chuột (hoặc chụm bàn di) để phóng.
 * Chỉ đổi `transform` (không đổi kích thước, vị trí bố cục): mượt và không làm xô trang.
 * Trong lúc kéo, vị trí ghi thẳng vào style của thẻ (ref), không qua state, để không vẽ lại React mỗi lần ngón tay nhích.
 */

interface ZoomStageProps {
  photos: readonly ImageSource[]
  index: number
  onIndexChange: (index: number) => void
  /** Lần đầu khách chạm, kéo, lăn: khung ẩn dòng gợi ý */
  onInteract: () => void
}

type Mode = 'idle' | 'pending' | 'swipe' | 'pan' | 'pinch' | 'scroll'

interface Gesture {
  mode: Mode
  pointers: Map<number, Point>
  start: Point
  startTime: number
  startView: View
  pinchMid: Point
  pinchDist: number
  /** Đã từng có 2 ngón trong lượt chạm này (nhả ngón còn lại thì không tính là chạm) */
  wasPinch: boolean
  lastTap: { time: number; point: Point } | null
}

/** Vuốt quá 18% bề ngang (tối đa 90px) hoặc vuốt nhanh thì sang ảnh */
const SWIPE_RATIO = 0.18
const SWIPE_MAX_PX = 90
const FLICK_SPEED = 0.45
/** Ngón nhích dưới 8px vẫn là chạm, chưa phải kéo */
const DRAG_START_PX = 8
const TAP_MAX_MS = 300
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_PX = 30
/** Hết ảnh ở một phía: vẫn kéo được một chút rồi bật về */
const EDGE_RESIST = 0.35
const SNAP_MS = 280
const WHEEL_STEP = 0.002
const WHEEL_STEP_PINCH = 0.01
/** Ảnh chưa tải xong thì tạm coi là 4:3 (ảnh phối màu, ảnh sản phẩm đều 4:3) */
const DEFAULT_ASPECT = 4 / 3

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const newGesture = (): Gesture => ({
  mode: 'idle',
  pointers: new Map(),
  start: { x: 0, y: 0 },
  startTime: 0,
  startView: { s: 1, x: 0, y: 0 },
  pinchMid: { x: 0, y: 0 },
  pinchDist: 1,
  wasPinch: false,
  lastTap: null,
})

export function ZoomStage({ photos, index, onIndexChange, onInteract }: ZoomStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [stage, setStage] = useState({ w: 0, h: 0 })
  const [aspects, setAspects] = useState<Readonly<Record<string, number>>>({})
  const [isZoomed, setIsZoomed] = useState(false)
  const gesture = useRef<Gesture>(newGesture())
  const viewRef = useRef<View>({ s: 1, x: 0, y: 0 })
  // Vuốt sang ảnh mới: vị trí dải ảnh ngay sau khi đổi, để ảnh mới trượt tiếp từ chỗ ngón tay nhả ra
  const pendingOffset = useRef<number | null>(null)
  const snapMs = useRef(SNAP_MS)

  const current = photos[index]
  const boxOf = (photo: ImageSource): Box => fitBox(stage.w, stage.h, aspects[photo.src] ?? DEFAULT_ASPECT)
  const box = boxOf(current)

  const applyView = (view: View, animate = false) => {
    viewRef.current = view
    const img = imageRef.current
    if (!img) return
    img.style.transition = animate ? `transform ${snapMs.current}ms var(--ease-out-strong)` : 'none'
    img.style.transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`
  }

  const applyTrack = (offset: number, animate = false) => {
    const track = trackRef.current
    if (!track) return
    track.style.transition = animate ? `transform ${snapMs.current}ms var(--ease-out-strong)` : 'none'
    track.style.transform = `translate3d(${offset}px, 0, 0)`
  }

  /** Đặt ảnh về một vị trí mới sau khi nhả tay, và báo cho giao diện biết đang phóng hay không */
  const settle = (view: View, animate = true) => {
    const next = view.s <= 1.01 ? restView(box) : clampView(view, box)
    applyView(next, animate)
    setIsZoomed(isZoomedView(next))
  }

  useEffect(() => {
    snapMs.current = prefersReducedMotion() ? 0 : SNAP_MS
    const el = stageRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setStage({ w: width, h: height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Đổi ảnh, xoay máy, ảnh vừa tải xong: ảnh mới về vị trí vừa khít khung
  useLayoutEffect(() => {
    applyView(restView(box))
    setIsZoomed(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ chạy lại khi kích thước khung hoặc ảnh đổi
  }, [index, box.w, box.h, box.stageW, box.stageH])

  // Vuốt sang ảnh mới: dải ảnh tiếp tục trượt từ chỗ nhả tay về giữa (không giật)
  useLayoutEffect(() => {
    const offset = pendingOffset.current
    pendingOffset.current = null
    if (offset === null) {
      applyTrack(0)
      return
    }
    applyTrack(offset)
    // Đọc kích thước để trình duyệt chốt vị trí cũ trước khi chạy chuyển động
    void trackRef.current?.offsetWidth
    applyTrack(0, true)
  }, [index])

  // Lăn chuột / chụm bàn di trên máy tính. Gắn tay vì React gắn sự kiện wheel ở chế độ passive (không chặn được cuộn)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      onInteract()
      const rect = el.getBoundingClientRect()
      const pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      const view = viewRef.current
      const s = Math.min(MAX_SCALE, Math.max(1, view.s * Math.exp(-e.deltaY * (e.ctrlKey ? WHEEL_STEP_PINCH : WHEEL_STEP))))
      if (s <= 1.01) {
        settle({ ...view, s: 1 }, false)
        return
      }
      applyView(hoverPanView({ ...view, s }, box, pointer))
      setIsZoomed(true)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  })

  const pointOf = (e: ReactPointerEvent): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startPinch = (g: Gesture) => {
    const [a, b] = [...g.pointers.values()]
    g.mode = 'pinch'
    g.wasPinch = true
    g.startView = viewRef.current
    g.pinchMid = midpoint(a, b)
    g.pinchDist = distance(a, b)
    applyTrack(0, true)
  }

  /** Còn một ngón sau khi chụm: kéo tiếp từ vị trí hiện tại, không nhảy */
  const restartPan = (g: Gesture, point: Point) => {
    g.mode = isZoomedView(viewRef.current) ? 'pan' : 'scroll'
    g.start = point
    g.startView = viewRef.current
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const g = gesture.current
    e.currentTarget.setPointerCapture(e.pointerId)
    const point = pointOf(e)
    g.pointers.set(e.pointerId, point)
    onInteract()
    if (g.pointers.size === 2) {
      startPinch(g)
      return
    }
    if (g.pointers.size > 2) return
    g.mode = 'pending'
    g.wasPinch = false
    g.start = point
    g.startTime = performance.now()
    g.startView = viewRef.current
  }

  const moveSingle = (g: Gesture, point: Point) => {
    const dx = point.x - g.start.x
    const dy = point.y - g.start.y
    if (g.mode === 'pending') {
      if (Math.hypot(dx, dy) < DRAG_START_PX) return
      // Đang phóng: kéo để soi. Chưa phóng: vuốt ngang đổi ảnh, vuốt dọc thì bỏ qua
      g.mode = isZoomedView(viewRef.current) ? 'pan' : Math.abs(dx) > Math.abs(dy) ? 'swipe' : 'scroll'
    }
    if (g.mode === 'pan') {
      applyView(clampView({ ...g.startView, x: g.startView.x + dx, y: g.startView.y + dy }, box))
      return
    }
    if (g.mode === 'swipe') {
      const hasNeighbour = dx < 0 ? index < photos.length - 1 : index > 0
      applyTrack(hasNeighbour ? dx : dx * EDGE_RESIST)
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    const point = pointOf(e)
    // Máy tính: chuột không bấm, ảnh đang phóng → rê tới đâu soi tới đó
    if (!g.pointers.has(e.pointerId)) {
      if (e.pointerType === 'mouse' && isZoomedView(viewRef.current)) applyView(hoverPanView(viewRef.current, box, point))
      return
    }
    g.pointers.set(e.pointerId, point)
    if (g.mode === 'pinch' && g.pointers.size >= 2) {
      const [a, b] = [...g.pointers.values()]
      applyView(pinchView(g.startView, g.pinchMid, g.pinchDist, midpoint(a, b), distance(a, b)))
      return
    }
    if (e.pointerType === 'mouse' && isZoomedView(viewRef.current)) {
      applyView(hoverPanView(viewRef.current, box, point))
      return
    }
    moveSingle(g, point)
  }

  /** Chạm / bấm (không kéo). Chuột: một lần bấm là phóng hoặc thu. Ngón tay: chạm 2 lần. */
  const handleTap = (g: Gesture, point: Point, pointerType: string) => {
    const view = viewRef.current
    if (pointerType === 'mouse') {
      if (isZoomedView(view)) settle({ ...view, s: 1 })
      else {
        applyView(hoverPanView({ ...view, s: TAP_SCALE }, box, point), true)
        setIsZoomed(true)
      }
      return
    }
    const now = performance.now()
    const last = g.lastTap
    const isDouble = last && now - last.time < DOUBLE_TAP_MS && distance(last.point, point) < DOUBLE_TAP_PX
    g.lastTap = isDouble ? null : { time: now, point }
    if (!isDouble) return
    if (isZoomedView(view)) settle({ ...view, s: 1 })
    else settle(zoomAt(view, TAP_SCALE, point))
  }

  /** Nhả tay sau khi vuốt: đủ xa / đủ nhanh thì sang ảnh, không thì dải ảnh bật về */
  const finishSwipe = (g: Gesture, point: Point) => {
    const dx = point.x - g.start.x
    const speed = Math.abs(dx) / Math.max(performance.now() - g.startTime, 1)
    const isFarEnough = Math.abs(dx) > Math.min(SWIPE_MAX_PX, stage.w * SWIPE_RATIO) || speed > FLICK_SPEED
    const dir = dx < 0 ? 1 : -1
    const target = index + dir
    if (isFarEnough && target >= 0 && target < photos.length) {
      pendingOffset.current = dir * stage.w + dx
      onIndexChange(target)
      return
    }
    applyTrack(0, true)
  }

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>, isCancel: boolean) => {
    const g = gesture.current
    if (!g.pointers.has(e.pointerId)) return
    const point = pointOf(e)
    g.pointers.delete(e.pointerId)
    if (g.mode === 'pinch') {
      if (g.pointers.size === 1) {
        settle(viewRef.current)
        restartPan(g, [...g.pointers.values()][0])
      } else if (g.pointers.size === 0) {
        settle(viewRef.current)
        g.mode = 'idle'
      }
      return
    }
    if (g.pointers.size > 0) return
    const mode = g.mode
    g.mode = 'idle'
    if (isCancel) {
      applyTrack(0, true)
      return
    }
    if (mode === 'swipe') finishSwipe(g, point)
    else if (mode === 'pan') setIsZoomed(isZoomedView(viewRef.current))
    else if (mode === 'pending' && !g.wasPinch && performance.now() - g.startTime < TAP_MAX_MS)
      handleTap(g, point, e.pointerType)
  }

  // Ảnh hai bên ảnh đang xem nạp sẵn, vuốt sang là có ngay
  const slides = [index - 1, index, index + 1].filter((i) => i >= 0 && i < photos.length)

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endPointer(e, false)}
      onPointerCancel={(e) => endPointer(e, true)}
      className={`relative h-full w-full touch-none overflow-hidden select-none ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
    >
      <div ref={trackRef} className="absolute inset-0 will-change-transform">
        {slides.map((i) => {
          const photo = photos[i]
          const isCurrent = i === index
          const slideBox = boxOf(photo)
          const rest = restView(slideBox)
          return (
            <div key={photo.src} className="absolute inset-y-0 w-full" style={{ left: `${(i - index) * 100}%` }}>
              <img
                ref={isCurrent ? imageRef : undefined}
                src={photo.src}
                alt={isCurrent ? photo.alt : ''}
                aria-hidden={isCurrent ? undefined : true}
                draggable={false}
                decoding="async"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget
                  if (naturalWidth && naturalHeight)
                    setAspects((prev) => (prev[photo.src] ? prev : { ...prev, [photo.src]: naturalWidth / naturalHeight }))
                }}
                className="absolute top-0 left-0 max-w-none origin-top-left"
                // Ảnh đang xem: vị trí do applyView ghi (ref); ảnh hai bên nằm giữa khung
                style={{
                  width: slideBox.w,
                  height: slideBox.h,
                  ...(isCurrent ? {} : { transform: `translate3d(${rest.x}px, ${rest.y}px, 0)` }),
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
