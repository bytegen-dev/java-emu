import JSZip from 'jszip'

export type JarInspectResult = {
  fileName: string
  sizeBytes: number
  manifest: Record<string, string>
  rawManifest: string | null
  entryCount: number
  looksLikeMidlet: boolean
}

function parseManifest(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  let block = ''
  const flush = () => {
    if (!block) return
    const idx = block.indexOf(':')
    if (idx !== -1) {
      const k = block.slice(0, idx).trim()
      const v = block.slice(idx + 1).trim()
      if (k) out[k] = v
    }
    block = ''
  }
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith(' ') && block) {
      block += line.slice(1)
    } else {
      flush()
      block = line
    }
  }
  flush()
  return out
}

export async function inspectJar(file: File): Promise<JarInspectResult> {
  const buf = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buf)
  const names = Object.keys(zip.files)
  const manifestEntry = zip.file('META-INF/MANIFEST.MF')
  let rawManifest: string | null = null
  let manifest: Record<string, string> = {}
  if (manifestEntry) {
    rawManifest = await manifestEntry.async('string')
    manifest = parseManifest(rawManifest)
  }

  const midletVersion = manifest['MicroEdition-Profile'] ?? ''
  const midletName = manifest['MIDlet-Name'] ?? manifest['MIDlet-1'] ?? ''
  const looksLikeMidlet = Boolean(
    midletName || midletVersion || manifest['MIDlet-Version'],
  )

  return {
    fileName: file.name,
    sizeBytes: file.size,
    manifest,
    rawManifest,
    entryCount: names.length,
    looksLikeMidlet,
  }
}
