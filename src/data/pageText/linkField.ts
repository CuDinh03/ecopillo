import type { TextField } from './define'

/**
 * Ô đường link trong một bộ chữ trang (khung trang: menu, chân trang, ô xổ Sản phẩm). Màn hình sửa kiểm như ô link của
 * Liên hệ (https://…, /duong-dan/, tel:, mailto:); ô để trống thì web dùng link gốc.
 */
export const lienKet = (nhan: string, goc: string, goiY?: string): TextField<string> => ({ nhan, kieu: 'link', goc, goiY })

/** Link dùng được trên menu: đường dẫn trong web (/…, không phải //…) hoặc https://… */
export const isMenuLink = (value: string): boolean => /^(\/(?!\/)|https:\/\/)[^\s<>"]*$/.test(value)

/** Link trong web (mở bằng bộ định tuyến, không tải lại trang) */
export const isSiteLink = (value: string): boolean => value.startsWith('/') && !value.startsWith('//')
