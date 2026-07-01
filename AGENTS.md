# AGENTS.md — Какашечный Тетрис

## Commands
- `npm run dev` — Vite dev server (default port 5173)
- `npm run build` — production build (Vite 8 + Rolldown)
- No tests, lint, or typecheck configured

## Arch
- **Canvas rendering** — `GameBoard.jsx` draws via `requestAnimationFrame` loop, NOT React DOM. `useEffect` runs once (`[game]` stable — it's a class instance in `useState`).
- **Game state** — `TetrisGame` (`tetrisLogic.js`) is a vanilla JS class holding all state (board, pieces, score). React state (`score`, `level`, `lines`) syncs via `updateUI()` polled every rAF frame (NOT `setInterval` as prior AGENTS.md stated).
- **17 tetrominoes** — 7 standard (I,J,L,O,S,T,Z) + 7 "2" variants + 3 FLAG types. All shapes fit in 2×2, 3×3, or 4×4. Rotation is clockwise only, with wall kick (±2).
- **Game loop** — `TetrisGame.gameLoop()` via rAF. `dropInterval` decreases per level.
- **Dead code** — `TouchControls.jsx` and `animationLine.js` are NOT imported anywhere. `src/assets/shit*.png` (without `/images/`) are unused duplicates.

## Keyboard input (desktop)
- **Must use `e.code`**, NOT `e.key` — Russian layout changes `e.key` to Cyrillic.
- `ArrowLeft`/`ArrowRight` (move), `ArrowDown` (soft drop), `Space` (hard drop, or resume when paused), `Enter` (rotate), `KeyP` (pause)

## Mobile / touch
- Detection: `useMediaQuery(theme.breakpoints.down('sm'))` + `isTouchDevice()` check.
- Orientation locked to portrait via `screen.orientation.lock('portrait')` (silent `.catch(() => {})`).
- **Pointer events** (`pointerdown`/`pointerup`) on canvas — NOT touch events (DevTools mobile emulation doesn't fire real TouchEvents).
  - Tap (<30px movement) → rotate
  - Swipe L/R → move, swipe down → hard drop
  - Movement cooldown: 60ms
- **Dynamic cell size** — `Math.max(18, Math.min(28, Math.floor(availableHeight / 20)))`.
- **StatsBar** (mobile only) — compact score/level/lines row + NextPiece preview above board.
- **BottomSheet** (mobile only) — slide-up dialog instead of MUI Dialog for start/gameover.

## Key quirks
- **Block textures** — `src/assets/images/shit1.png` to `shit7.png` loaded as URLs via `import` and drawn with `drawImage`. Falls back to colored rects if images not loaded.
- **MUI dark theme** — `main.jsx`: `createTheme({ palette: { mode: 'dark', primary: { main: '#7107E7' } } })`.
- **Fonts** — Bangers (headings), JetBrains Mono (stats/labels).
- **Game over** — canvas overlay (fixed, pointer-events:none) with falling poop animation in App.jsx.
- **Background** — `shit5.png` on `document.body.style.backgroundImage`.
- **High score** — `localStorage` key `'poop-tetris-highscore'`.

## File structure
```
src/
  main.jsx          — entry, MUI dark theme provider
  App.jsx           — game shell, keyboard handler, full-screen rain canvas, dialogs
  GameBoard.jsx     — canvas board renderer + pointer event gesture handling
  NextPiece.jsx     — canvas preview of next piece
  tetrisLogic.js    — TetrisGame class, 17 tetrominoes, collision, rotation, game loop
  StatsBar.jsx      — mobile compact score/level/lines bar
  BottomSheet.jsx   — mobile slide-up dialog
  assets/images/    — 7 .png files for block textures
  TouchControls.jsx — DEAD (not imported)
  animationLine.js  — DEAD (not imported)
```
