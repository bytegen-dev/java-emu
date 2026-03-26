import { useCallback, useRef, useState } from 'react'

const LOADER_URL = 'https://cjrtnc.leaningtech.com/4.2/loader.js'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.cheerpjInit === 'function') {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

export function useCheerpJ() {
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inited = useRef(false)

  const ensureRuntime = useCallback(async () => {
    setError(null)
    await loadScript(LOADER_URL)
    if (!inited.current) {
      const init = window.cheerpjInit
      if (typeof init !== 'function') {
        throw new Error('CheerpJ failed to load (cheerpjInit missing)')
      }
      await init({ version: 8, status: 'splash' })
      inited.current = true
    }
    setReady(true)
  }, [])

  const runJarFromPath = useCallback(
    async (vfsPath: string, parent: HTMLElement) => {
      setBusy(true)
      setError(null)
      try {
        await ensureRuntime()
        parent.replaceChildren()
        window.cheerpjCreateDisplay?.(800, 600, parent)
        const code = await window.cheerpjRunJar?.(vfsPath)
        if (code === undefined) throw new Error('cheerpjRunJar unavailable')
        if (code !== 0) {
          setError(`Process exited with code ${code}`)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setBusy(false)
      }
    },
    [ensureRuntime],
  )

  /** Mount user file into CheerpJ `/str/` and execute (desktop JAR; J2ME MIDlets need MIDP runtime). */
  const runJarFromFile = useCallback(
    async (file: File, parent: HTMLElement) => {
      setBusy(true)
      setError(null)
      try {
        await ensureRuntime()
        const buf = new Uint8Array(await file.arrayBuffer())
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'upload.jar'
        const path = `/str/${safe}`
        window.cheerpOSAddStringFile?.(path, buf)
        parent.replaceChildren()
        window.cheerpjCreateDisplay?.(800, 600, parent)
        const code = await window.cheerpjRunJar?.(path)
        if (code === undefined) throw new Error('cheerpjRunJar unavailable')
        if (code !== 0) {
          setError(`Process exited with code ${code}`)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setBusy(false)
      }
    },
    [ensureRuntime],
  )

  return {
    ready,
    busy,
    error,
    ensureRuntime,
    runJarFromPath,
    runJarFromFile,
    clearError: () => setError(null),
  }
}
