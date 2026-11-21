/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "1" khi build bản xem thử (src/data/preview.ts) */
  readonly VITE_BAN_XEM_THU?: string
  /** Địa chỉ WordPress trả danh sách đại lý (src/hooks/useDealers.ts) */
  readonly VITE_DEALERS_URL?: string
}

/** Năm lúc dựng (vite.config.ts `define`): chân trang dùng lúc dựng sẵn HTML và lúc React gắn vào trang */
declare const __NAM_DUNG__: number

interface ImportMeta {
  readonly env: ImportMetaEnv
}
