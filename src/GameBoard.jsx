import React, { useRef, useState, useEffect } from 'react'
import { COLS, ROWS, CELL_SIZE, getCellSize, setCellSize } from './tetrisLogic'

import shit1 from './assets/images/shit1.png'
import shit2 from './assets/images/shit2.png'
import shit3 from './assets/images/shit3.png'
import shit4 from './assets/images/shit4.png'
import shit5 from './assets/images/shit5.png'
import shit6 from './assets/images/shit6.png'
import shit7 from './assets/images/shit7.png'

const IMAGE_MAP = {
  I: 'shit1', J: 'shit2', L: 'shit3', O: 'shit4',
  S: 'shit5', T: 'shit6', Z: 'shit7',
  I2: 'shit1', J2: 'shit2', L2: 'shit3', O2: 'shit4',
  S2: 'shit5', T2: 'shit6', Z2: 'shit7',
  FLAG1: 'shit1', FLAG2: 'shit2', FLAG3: 'shit3',
}

const imageSrc = { shit1, shit2, shit3, shit4, shit5, shit6, shit7 }
const imgNames = ['shit1', 'shit2', 'shit3', 'shit4', 'shit5', 'shit6', 'shit7']

const FALLBACK_COLORS = {
  I: '#00FFFF', J: '#4A90FF', L: '#FF8C00', O: '#FFD700',
  S: '#16A34A', T: '#7107E7', Z: '#DC2626',
  I2: '#00FFFF', J2: '#4A90FF', L2: '#FF8C00', O2: '#FFD700',
  S2: '#16A34A', T2: '#7107E7', Z2: '#DC2626',
  FLAG1: '#8B4513', FLAG2: '#8B4513', FLAG3: '#8B4513',
}

const MOVE_COOLDOWN = 60

const GameBoard = ({ game, isMobile, callUpdateUI }) => {
  const canvasRef = useRef(null)
  const imagesRef = useRef({})
  const touchStartRef = useRef(null)
  const lastMoveRef = useRef(0)
  const [resizeKey, setResizeKey] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isMobile) {
      // Calculate cell size from available viewport height minus overhead elements
      const overhead = 190
      const availH = window.innerHeight - overhead
      const cs = Math.max(14, Math.min(45, Math.floor(availH / ROWS)))
      setCellSize(cs)
    } else {
      setCellSize(28)
    }

    const ctx = canvas.getContext('2d')
    const cellSize = getCellSize()
    const width = COLS * cellSize
    const height = ROWS * cellSize
    canvas.width = width
    canvas.height = height

    imgNames.forEach(name => {
      const img = new Image()
      img.src = imageSrc[name]
      imagesRef.current[name] = img
    })

    function drawCell(ctx, x, y, type) {
      const imgName = IMAGE_MAP[type]
      const img = imagesRef.current[imgName]
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x * cellSize, y * cellSize, cellSize, cellSize)
      } else {
        const color = FALLBACK_COLORS[type] || '#8B4513'
        ctx.fillStyle = color
        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2)

        // Inner highlight for depth
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, 4)
        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, 4, cellSize - 2)

        // Inner shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.fillRect(x * cellSize + 1, y * cellSize + cellSize - 5, cellSize - 2, 4)
        ctx.fillRect(x * cellSize + cellSize - 5, y * cellSize + 1, 4, cellSize - 2)
      }

      // Cell border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.lineWidth = 1
      ctx.strokeRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize - 1, cellSize - 1)
    }

    let animFrameId

    const draw = () => {
      // Dark background
      ctx.fillStyle = '#151820'
      ctx.fillRect(0, 0, width, height)

      // Grid lines
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath()
        ctx.moveTo(i * cellSize, 0)
        ctx.lineTo(i * cellSize, height)
        ctx.strokeStyle = 'rgba(58, 63, 80, 0.4)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
      for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * cellSize)
        ctx.lineTo(width, i * cellSize)
        ctx.strokeStyle = 'rgba(58, 63, 80, 0.4)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      const state = game.getState()
      const explosion = game.updateExplosion(performance.now())

      // Flash effect for line clear
      if (explosion && explosion.flashRows != null) {
        for (const row of explosion.flashRows) {
          ctx.fillStyle = `rgba(223, 231, 255, ${explosion.flashAlpha * 0.6})`
          ctx.fillRect(0, row * cellSize, COLS * cellSize, cellSize)
        }
      }

      // Explosion particles
      if (game.explosionParticles && game.explosionParticles.length > 0) {
        for (const p of game.explosionParticles) {
          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      // Placed blocks
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (state.board[row][col]) {
            drawCell(ctx, col, row, state.board[row][col])
          }
        }
      }

      // Current piece
      if (state.currentPiece && state.currentPosition) {
        for (let row = 0; row < state.currentPiece.shape.length; row++) {
          for (let col = 0; col < state.currentPiece.shape[row].length; col++) {
            if (state.currentPiece.shape[row][col]) {
              drawCell(ctx, state.currentPosition.x + col, state.currentPosition.y + row, state.currentPiece.type)
            }
          }
        }
      }

      animFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animFrameId)
  }, [game, isMobile, resizeKey])

  // Recalculate cellSize on window resize (orientation change on mobile)
  useEffect(() => {
    if (!isMobile) return

    const onResize = () => setResizeKey(k => k + 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMobile])

  // Touch / pointer swipe handling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handlePointerDown = (e) => {
      touchStartRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const handlePointerUp = (e) => {
      if (!touchStartRef.current) return
      if (game.getState().state !== 'playing') {
        touchStartRef.current = null
        return
      }

      const dx = e.clientX - touchStartRef.current.x
      const dy = e.clientY - touchStartRef.current.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      const threshold = 30

      if (absDx < threshold && absDy < threshold) {
        // Tap = rotate
        touchStartRef.current = null
        game.rotate()
        if (callUpdateUI) callUpdateUI()
        return
      }

      const now = performance.now()
      if (now - lastMoveRef.current < MOVE_COOLDOWN) {
        touchStartRef.current = null
        return
      }
      lastMoveRef.current = now

      if (absDx > absDy) {
        // Horizontal swipe = move left/right
        if (dx > 0) game.move('right')
        else game.move('left')
      } else {
        // Vertical swipe: down = hard drop, up = soft drop (1 cell)
        if (dy > 0) game.hardDrop()
        else game.moveDown()
      }
      touchStartRef.current = null
      if (callUpdateUI) callUpdateUI()
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
    }
  }, [game, callUpdateUI])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        touchAction: 'none',
      }}
    />
  )
}

export default GameBoard
