# Local game files (not in git)

Put **your own** `.jar` / `.jad` files here for **local testing**.

- Files in this folder are **ignored by git** (see root `.gitignore`) so you don’t accidentally publish commercial ROMs.
- During **`npm run dev`** and **`npm run preview`**, they are served at **`/games/<filename>`** (e.g. `/games/MyGame.jar`).
- For **production builds**, copy anything you have the **rights** to ship into `public/games/` (or your CDN) so `vite build` can serve them.
