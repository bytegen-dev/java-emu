import { useCallback, useState } from 'react'
import { inspectJar, type JarInspectResult } from '../lib/jarInspect'

export function JarInspector() {
  const [data, setData] = useState<JarInspectResult | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const onFile = useCallback(async (file: File | undefined) => {
    setErr(null)
    setData(null)
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.jar')) {
      setErr('Pick a .jar file')
      return
    }
    try {
      setData(await inspectJar(file))
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }, [])

  return (
    <div className="jar-inspector">
      <label className="file-label">
        <input
          type="file"
          accept=".jar,application/java-archive,application/x-java-archive"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        <span>Choose .jar</span>
      </label>

      {err && <p className="msg err">{err}</p>}

      {data && (
        <div className="inspect-result">
          <p>
            <strong>{data.fileName}</strong> — {(data.sizeBytes / 1024).toFixed(1)}{' '}
            KB, {data.entryCount} zip entries
          </p>
          <p className={data.looksLikeMidlet ? 'midlet yes' : 'midlet no'}>
            {data.looksLikeMidlet
              ? 'Manifest looks like a MIDlet (J2ME).'
              : 'No MIDlet headers detected (may still be J2ME or desktop JAR).'}
          </p>
          <details>
            <summary>Manifest keys ({Object.keys(data.manifest).length})</summary>
            <ul className="kv">
              {Object.entries(data.manifest).map(([k, v]) => (
                <li key={k}>
                  <code>{k}</code>: {v}
                </li>
              ))}
            </ul>
          </details>
          {data.rawManifest && (
            <details>
              <summary>Raw META-INF/MANIFEST.MF</summary>
              <pre className="manifest-raw">{data.rawManifest.slice(0, 8000)}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
