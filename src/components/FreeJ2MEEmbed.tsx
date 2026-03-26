import { FREEJ2ME_ORIGIN } from '../config'

/**
 * Embeds [freej2me-web](https://github.com/zb3/freej2me-web) (CheerpJ + FreeJ2ME) for real MIDP games.
 * Default URL is the author’s GitHub Pages build; set `VITE_FREEJ2ME_URL` to your self-hosted `web/` root.
 */
export function FreeJ2MEEmbed() {
  return (
    <div className="freej2me-embed">
      <p className="hint">
        This loads the <strong>freej2me-web</strong> MIDP emulator (CheerpJ + FreeJ2ME). Add your{' '}
        <code>.jar</code>/<code>.jad</code> inside the embedded UI. For production, self-host the{' '}
        <code>web/</code> folder and set <code>VITE_FREEJ2ME_URL</code> (see README).
      </p>
      <p className="hint keys">
        Keyboard: <kbd>Esc</kbd> menu · <kbd>F1</kbd>/<kbd>Q</kbd> left soft · <kbd>F2</kbd>/<kbd>W</kbd>{' '}
        right soft · arrows / numpad · <kbd>Enter</kbd> OK.
      </p>

      <div className="iframe-wrap">
        <iframe
          title="freej2me-web MIDP emulator"
          src={FREEJ2ME_ORIGIN}
          className="freej2me-iframe"
          sandbox="allow-scripts allow-same-origin allow-popups allow-downloads allow-modals"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="fallback">
        If the frame is blank or blocked, open{' '}
        <a href={FREEJ2ME_ORIGIN} target="_blank" rel="noreferrer">
          freej2me-web
        </a>{' '}
        in a new tab.
      </p>
    </div>
  )
}
