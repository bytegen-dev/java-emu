# j2me-emulator-web

Vite + React + TypeScript shell to **inspect** `.jar` files, run **desktop Java** via **[CheerpJ](https://cheerpj.com/)**, and play **MIDP** games through an embedded **[freej2me-web](https://github.com/zb3/freej2me-web)** build (CheerpJ + FreeJ2ME).

## Quick start

```bash
cd j2me-emulator-web
npm install
npm run dev
```

Open the printed localhost URL (must be **http(s)**, not `file://` — CheerpJ requirement).

### `games/` folder

Drop **local** `.jar` / `.jad` files in [`games/`](games/) (see [`games/README.md`](games/README.md)). They are **gitignored** so you don’t commit third-party games. With **`npm run dev`** or **`npm run preview`**, each file is available at **`/games/<filename>`** (handy for links or tooling). For **production**, only ship assets you have rights to use (e.g. copy into `public/games/`).

## Tabs

| Tab | What it does |
|-----|----------------|
| **Inspect JAR** | Parses `META-INF/MANIFEST.MF`, flags likely **MIDlet** metadata. |
| **Run Java (CheerpJ)** | Desktop JARs (`cheerpjRunJar`). Sample: `public/app/TextDemo.jar` (Oracle Swing **TextDemo**). |
| **Run MIDlet (FreeJ2ME)** | Embeds the upstream **freej2me-web** UI (default: `https://zb3.github.io/freej2me-web/`) so you can load **`.jar` / `.jad`** like on a feature phone. |

### Self-host FreeJ2ME (optional)

The default iframe points at the author’s GitHub Pages site. To use your own build (offline, custom domain, CSP):

1. Clone [zb3/freej2me-web](https://github.com/zb3/freej2me-web).
2. Build with **Docker + Ant** per [their README](https://github.com/zb3/freej2me-web#building) (`freej2me-web.jar` ends up under `web/`).
3. Serve the `web/` directory with **Range** request support (their README suggests `npx serve -u web`).
4. Create `.env` in this project:

```bash
VITE_FREEJ2ME_URL=http://127.0.0.1:3000/
```

(point at wherever you served `web/` — trailing slash is fine). Restart `npm run dev`.

See also [.env.example](.env.example).

## Why two Java runtimes?

- **CheerpJ alone** = **Java SE**. It does **not** implement `javax.microedition.*`.
- **freej2me-web** = FreeJ2ME + CheerpJ + canvas/WebGL/MIDI glue — that’s what runs **MIDlets**.

## License / third party

- **CheerpJ** — Leaning Technologies; [licensing](https://cheerpj.com/) for production.
- **freej2me-web / FreeJ2ME** — see [upstream LICENSE](https://github.com/zb3/freej2me-web/blob/main/LICENSE); embedding is subject to those terms.
- **TextDemo.jar** — Oracle tutorial sample (check redistribution for your use case).
