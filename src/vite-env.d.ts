/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "1" khi build bản xem thử (src/data/preview.ts) */
  readonly VITE_BAN_XEM_THU?: string
  /** Địa chỉ WordPress trả danh sách đại lý (src/hooks/useDealers.ts) */
  readonly VITE_DEALERS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
