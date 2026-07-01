const TETROMINOES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  S2: [
    [0, 0, 1, 1],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  Z2: [
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  I2: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  J2: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  L2: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  O2: [
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 0],
  ],
  T2: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  FLAG1: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  FLAG2: [
    [0, 0, 1],
    [0, 0, 1],
    [0, 1, 1],
  ],
  FLAG3: [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
}
const COLS = 10

const ROWS = 20

let _cellSize = 28
function getCellSize() { return _cellSize }
function setCellSize(size) { _cellSize = size }
export { TETROMINOES, COLS, ROWS, getCellSize, setCellSize }

export class TetrisGame {
  constructor() {
    this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    this.score = 0
    this.level = 1
    this.lines = 0
    this.state = 'ready'
    this.currentPiece = null
    this.currentPosition = { x: 0, y: 0 }
    this.nextPiece = null
    this.lastDropTime = 0
    this.dropInterval = 1000
    this.animationFrameId = null
  }

  reset() {
    this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    this.score = 0
    this.level = 1
    this.lines = 0
    this.state = 'ready'
    this.currentPiece = null
    this.currentPosition = { x: 0, y: 0 }
    this.nextPiece = null
    this.lastDropTime = 0
    this.dropInterval = 1000
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
  }

  spawn() {
    const types = Object.keys(TETROMINOES)
    const randomType = types[Math.floor(Math.random() * types.length)]
    this.currentPiece = {
      type: randomType,
      shape: TETROMINOES[randomType],
    }
    this.currentPosition = {
      x: Math.floor((COLS - this.currentPiece.shape[0].length) / 2),
      y: 0,
    }
    // Не вызываем spawnNext() при старте игры
  }

  spawnNext() {
    const types = Object.keys(TETROMINOES)
    const randomType = types[Math.floor(Math.random() * types.length)]
    this.nextPiece = {
      type: randomType,
      shape: TETROMINOES[randomType],
    }
  }

  activateNextPiece() {
    this.currentPiece = this.nextPiece
    this.currentPosition = {
      x: Math.floor((COLS - this.currentPiece.shape[0].length) / 2),
      y: 0,
    }
    this.spawnNext()
    if (this.collision(this.currentPiece.shape, this.currentPosition.x, this.currentPosition.y)) {
      this.state = 'gameover'
    }
  }

  move(direction) {
    if (this.state !== 'playing') return false

    const newX = this.currentPosition.x + (direction === 'left' ? -1 : 1)
    if (!this.collision(this.currentPiece.shape, newX, this.currentPosition.y)) {
      this.currentPosition.x = newX
      return true
    }
    return false
  }

  moveDown() {
    if (this.state !== 'playing') return false

    const newY = this.currentPosition.y + 1
    if (!this.collision(this.currentPiece.shape, this.currentPosition.x, newY)) {
      this.currentPosition.y = newY
      return true
    }
    return false
  }

  tryRotation(rotated) {
    if (!this.currentPiece) return false

    if (!this.collision(rotated, this.currentPosition.x, this.currentPosition.y)) {
      this.currentPiece.shape = rotated
      return true
    }

    for (let offset = 1; offset <= 2; offset++) {
      if (!this.collision(rotated, this.currentPosition.x + offset, this.currentPosition.y)) {
        this.currentPiece.shape = rotated
        this.currentPosition.x += offset
        return true
      }
      if (!this.collision(rotated, this.currentPosition.x - offset, this.currentPosition.y)) {
        this.currentPiece.shape = rotated
        this.currentPosition.x -= offset
        return true
      }
    }

    return false
  }

  rotate() {
    if (this.state !== 'playing' || !this.currentPiece) return false
    const shape = this.currentPiece.shape
    const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse())
    return this.tryRotation(rotated)
  }

  rotateCounterClockwise() {
    if (this.state !== 'playing' || !this.currentPiece) return false
    const shape = this.currentPiece.shape
    const rotated = shape[0].map((_, i) => shape.map(row => row[shape[0].length - 1 - i]))
    return this.tryRotation(rotated)
  }

  collision(piece, x, y) {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const newX = x + col
          const newY = y + row

          if (newX < 0 || newX >= COLS || newY >= ROWS) return true
          if (newY >= 0 && this.board[newY][newX]) return true
        }
      }
    }
    return false
  }

  merge() {
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col]) {
          const y = this.currentPosition.y + row
          const x = this.currentPosition.x + col
          if (y >= 0) {
            this.board[y][x] = this.currentPiece.type
          }
        }
      }
    }
    this.currentPiece = null
  }

  clearLines() {
    let linesCleared = 0
    const clearedRows = []

    for (let row = ROWS - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell !== 0)) {
        clearedRows.push(row)
        this.board.splice(row, 1)
        this.board.unshift(Array(COLS).fill(0))
        linesCleared++
        row++
      }
    }

    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800]
      this.score += points[linesCleared] * this.level
      this.lines += linesCleared
      this.level = Math.floor(this.lines / 10) + 1
      this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100)

      this.flashRows = clearedRows
      this.flashTime = performance.now()
      this.explosionParticles = this.createExplosionParticles(clearedRows)
    }
  }

  createExplosionParticles(rows) {
    const browns = ['#8B4513', '#A0522D', '#D2691E', '#DAA520', '#CD853F', '#DEB887']
    const particles = []
    const cellSize = 30

    for (const row of rows) {
      const cy = row * cellSize + cellSize / 2
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 4
        particles.push({
          x: Math.random() * COLS * cellSize,
          y: cy + (Math.random() - 0.5) * cellSize,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          radius: 4 + Math.random() * 6,
          color: browns[Math.floor(Math.random() * browns.length)],
          life: 1,
          decay: 0.012 + Math.random() * 0.008,
          gravity: 0.06 + Math.random() * 0.04,
        })
      }
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 3 + Math.random() * 5
        particles.push({
          x: Math.random() * COLS * cellSize,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5 + Math.random() * 2,
          color: browns[Math.floor(Math.random() * browns.length)],
          life: 1,
          decay: 0.025 + Math.random() * 0.015,
          gravity: 0.02,
        })
      }
    }

    return particles
  }

  updateExplosion(now) {
    if (this.flashRows && now - this.flashTime < 250) {
      return { flashRows: this.flashRows, flashAlpha: 1 - (now - this.flashTime) / 250 }
    }
    this.flashRows = null

    if (this.explosionParticles) {
      for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
        const p = this.explosionParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.life -= p.decay
        if (p.life <= 0) {
          this.explosionParticles.splice(i, 1)
        }
      }
      if (this.explosionParticles.length === 0) {
        this.explosionParticles = null
      }
    }

    return null
  }

  getState() {
    return {
      board: this.board,
      score: this.score,
      level: this.level,
      lines: this.lines,
      state: this.state,
      currentPiece: this.currentPiece,
      currentPosition: this.currentPosition,
      nextPiece: this.nextPiece
    }
  }



  start() {
    this.reset()
    this.state = 'playing'
    this.spawn()
    this.spawnNext()
    this.lastDropTime = performance.now()
    this.gameLoop()
  }

  gameLoop() {
    if (this.state !== 'playing') return

    const now = performance.now()
    if (now - this.lastDropTime > this.dropInterval) {
      if (!this.moveDown()) {
        this.merge()
        this.clearLines()
        this.activateNextPiece()
      }
      this.lastDropTime = now
    }

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop())
  }

  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused'
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
      }
    } else if (this.state === 'paused') {
      this.state = 'playing'
      this.lastDropTime = performance.now()
      this.gameLoop()
    }
  }

  hardDrop() {
    while (this.moveDown()) {}
    this.merge()
    this.clearLines()
    this.activateNextPiece()
  }

  save() {
    const state = this.getState()
    localStorage.setItem('poop-tetris', JSON.stringify(state))
  }

  load() {
    const saved = localStorage.getItem('poop-tetris')
    if (saved) {
      const state = JSON.parse(saved)
      this.board = state.board
      this.score = state.score
      this.level = state.level
      this.lines = state.lines
      this.state = state.state
      this.currentPiece = state.currentPiece
      this.currentPosition = state.currentPosition
      this.nextPiece = state.nextPiece
      return true
    }
    return false
  }
}