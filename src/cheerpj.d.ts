/** CheerpJ runtime (loaded from CDN at runtime). See https://cheerpj.com/docs/reference */
export interface CheerpJInitOptions {
  version?: 8 | 11 | 17
  status?: 'splash' | 'none' | 'default'
}

declare global {
  interface Window {
    cheerpjInit?: (options?: CheerpJInitOptions) => Promise<void>
    cheerpjCreateDisplay?: (
      width: number,
      height: number,
      parent?: HTMLElement | null,
    ) => HTMLElement
    cheerpjRunJar?: (jarPath: string, ...args: string[]) => Promise<number>
    cheerpOSAddStringFile?: (path: string, data: string | Uint8Array) => void
  }
}

export {}
