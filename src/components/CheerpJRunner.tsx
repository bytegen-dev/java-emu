import { useCallback, useRef } from 'react'
import { useCheerpJ } from '../hooks/useCheerpJ'

const DEMO_JAR = '/app/TextDemo.jar'

export function CheerpJRunner() {
  const hostRef = useRef<HTMLDivElement>(null)
  const {
    ready,
    busy,
    error,
    ensureRuntime,
    runJarFromPath,
    runJarFromFile,
    clearError,
  } = useCheerpJ()

  const onLoadRuntime = useCallback(async () => {
    clearError()
    await ensureRuntime()
  }, [clearError, ensureRuntime])

  const onRunDemo = useCallback(async () => {
    const el = hostRef.current
    if (!el) return
    await ensureRuntime()
    await runJarFromPath(DEMO_JAR, el)
  }, [ensureRuntime, runJarFromPath])

  const onPickJar = useCallback(
    async (f: File | undefined) => {
      const el = hostRef.current
      if (!f || !el) return
      clearError()
      await runJarFromFile(f, el)
    },
    [clearError, runJarFromFile],
  )

  return (
    <div className="cheerpj-runner">
      <p className="hint">
        Uses <strong>CheerpJ</strong> (Java SE in the browser). The bundled sample is Oracle’s{' '}
        <strong>TextDemo</strong> Swing JAR — good to verify the pipeline. Typical <strong>J2ME</strong>{' '}
        <code>.jar</code> files need a <strong>MIDP</strong> implementation (e.g. FreeJ2ME); they will
        usually <strong>fail</strong> here with missing <code>javax.microedition.*</code>.
      </p>

      <div className="runner-actions">
        <button type="button" disabled={busy} onClick={() => void onLoadRuntime()}>
          {ready ? 'Runtime loaded' : 'Load CheerpJ runtime'}
        </button>
        <button type="button" disabled={busy} onClick={() => void onRunDemo()}>
          Run TextDemo (Swing)
        </button>
        <label className="file-label inline">
          <input
            type="file"
            accept=".jar,application/java-archive"
            disabled={busy}
            onChange={(e) => void onPickJar(e.target.files?.[0])}
          />
          <span>Run your .jar</span>
        </label>
      </div>

      {busy && <p className="msg">Running…</p>}
      {error && <p className="msg err">{error}</p>}

      <div ref={hostRef} className="cheerpj-host" />
    </div>
  )
}
