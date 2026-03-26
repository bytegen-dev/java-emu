/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FREEJ2ME_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
