import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

/** Serve `games/` at `/games/*` in dev + preview (files stay gitignored). */
function gamesStaticPlugin(): Plugin {
  const mount = () => {
    const gamesDir = path.resolve(process.cwd(), 'games')
    return (req: { url?: string }, res: { setHeader: Function; end: Function; statusCode?: number }, next: () => void) => {
      const raw = req.url?.split('?')[0] ?? ''
      if (!raw.startsWith('/games/')) {
        next()
        return
      }
      let name = decodeURIComponent(raw.slice('/games/'.length))
      if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) {
        next()
        return
      }
      const lower = name.toLowerCase()
      if (!lower.endsWith('.jar') && !lower.endsWith('.jad')) {
        next()
        return
      }
      const fp = path.join(gamesDir, name)
      if (!fp.startsWith(gamesDir)) {
        next()
        return
      }
      if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) {
        next()
        return
      }
      const buf = fs.readFileSync(fp)
      const type = lower.endsWith('.jad')
        ? 'text/vnd.sun.j2me.app-descriptor; charset=utf-8'
        : 'application/java-archive'
      res.setHeader('Content-Type', type)
      res.setHeader('Cache-Control', 'no-store')
      res.end(buf)
    }
  }
  return {
    name: 'games-local-static',
    configureServer(server) {
      server.middlewares.use(mount())
    },
    configurePreviewServer(server) {
      server.middlewares.use(mount())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), gamesStaticPlugin()],
})
