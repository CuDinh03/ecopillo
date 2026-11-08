/**
 * Toán phóng ảnh cho khung xem ảnh toàn màn hình (src/components/ui/lightbox/).
 * Mọi toạ độ tính trong khung ảnh (stage): góc trái trên của khung là (0, 0).
 * Ảnh là một hộp rộng `w`, cao `h` (vừa khít khung, giữ tỉ lệ); `view` cho biết hộp ảnh đang phóng `s` lần
 * và góc trái trên của nó đang ở (x, y) trong khung.
 */

export interface View {
  s: number
  x: number
  y: number
}

export interface Box {
  /** Khung ảnh */
  stageW: number
  stageH: number
  /** Ảnh khi chưa phóng (vừa khít khung) */
  w: number
  h: number
}

export interface Point {
  x: number
  y: number
}

export const MIN_SCALE = 1
export const MAX_SCALE = 4
/** Chạm 2 lần / bấm chuột: phóng 2,5 lần */
export const TAP_SCALE = 2.5

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

/** Ảnh vừa khít khung, giữ tỉ lệ (như object-contain) */
export function fitBox(stageW: number, stageH: number, aspect: number): Box {
  const safeAspect = aspect > 0 ? aspect : 4 / 3
  const w = Math.min(stageW, stageH * safeAspect)
  return { stageW, stageH, w, h: w / safeAspect }
}

/** Ảnh chưa phóng: nằm giữa khung */
export const restView = (box: Box): View => ({ s: 1, x: (box.stageW - box.w) / 2, y: (box.stageH - box.h) / 2 })

/** Một chiều: ảnh to hơn khung thì không để hở mép; nhỏ hơn khung thì nằm giữa */
const clampAxis = (pos: number, size: number, stage: number): number =>
  size >= stage ? clamp(pos, stage - size, 0) : (stage - size) / 2

/** Giữ ảnh trong giới hạn phóng và không kéo lệch ra ngoài khung */
export function clampView(view: View, box: Box): View {
  const s = clamp(view.s, MIN_SCALE, MAX_SCALE)
  return { s, x: clampAxis(view.x, box.w * s, box.stageW), y: clampAxis(view.y, box.h * s, box.stageH) }
}

/** Phóng tới `s` mà điểm `at` của ảnh vẫn nằm yên dưới ngón tay / con trỏ */
export function zoomAt(view: View, s: number, at: Point): View {
  const ratio = s / view.s
  return { s, x: at.x - (at.x - view.x) * ratio, y: at.y - (at.y - view.y) * ratio }
}

/**
 * Chụm hai ngón: phóng theo tỉ lệ khoảng cách hai ngón, điểm giữa hai ngón kéo ảnh theo.
 * `start` là lúc đặt ngón thứ hai xuống.
 */
export function pinchView(start: View, startMid: Point, startDist: number, mid: Point, dist: number): View {
  // Cho phóng nhỏ hơn 1 một chút lúc đang chụm (nhả tay thì bật về), để cảm giác không bị chặn cứng
  const s = clamp((start.s * dist) / Math.max(startDist, 1), MIN_SCALE * 0.85, MAX_SCALE * 1.15)
  const ratio = s / start.s
  return { s, x: mid.x - (startMid.x - start.x) * ratio, y: mid.y - (startMid.y - start.y) * ratio }
}

/** Máy tính: ảnh đang phóng, rê chuột tới đâu soi tới đó (chuột ở mép phải thì thấy mép phải ảnh) */
export function hoverPanView(view: View, box: Box, pointer: Point): View {
  const size = { w: box.w * view.s, h: box.h * view.s }
  const fx = clamp(pointer.x / box.stageW, 0, 1)
  const fy = clamp(pointer.y / box.stageH, 0, 1)
  return clampView({ s: view.s, x: -fx * (size.w - box.stageW), y: -fy * (size.h - box.stageH) }, box)
}

export const isZoomedView = (view: View): boolean => view.s > MIN_SCALE + 0.01

export const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y)

export const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
