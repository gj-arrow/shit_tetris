import React, { useRef, useEffect } from 'react'
import { TETROMINOES, getCellSize } from './tetrisLogic'

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

const FALLBACK_COLORS = {
  I: '#00FFFF', J: '#4A90FF', L: '#FF8C00', O: '#FFD700',
  S: '#16A34A', T: '#7107E7', Z: '#DC2626',
  I2: '#00FFFF', J2: '#4A90FF', L2: '#FF8C00', O2: '#FFD700',
  S2: '#16A34A', T2: '#7107E7', Z2: '#DC2626',
  FLAG1: '#8B4513', FLAG2: '#8B4513', FLAG3: '#8B4513',
}

const imgCache = {}

function getCachedImage(name) {
  if (!imgCache[name]) {
    const img = new Image()
    img.src = imageSrc[name]
    imgCache[name] = img
  }
  return imgCache[name]
}

const NextPiece = ({ piece, cellSize }) => {
  const canvasRef = useRef(null)
  const cs = cellSize || getCellSize()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !piece) return

    const ctx = canvas.getContext('2d')
    const size = 4 * cs
    canvas.width = size
    canvas.height = size

    const shape = TETROMINOES[piece.type]
    const offsetX = (4 - shape[0].length) / 2
    const offsetY = (4 - shape.length) / 2

    ctx.clearRect(0, 0, size, size)

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          drawCell(ctx, offsetX + col, offsetY + row, piece.type)
        }
      }
    }
  }, [piece])

  function drawCell(ctx, x, y, type) {
    const imgName = IMAGE_MAP[type]
    const img = getCachedImage(imgName)
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x * cs, y * cs, cs, cs)
    } else {
      const color = FALLBACK_COLORS[type] || '#8B4513'
      ctx.fillStyle = color
      ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2)

      // Inner highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, 4)
      ctx.fillRect(x * cs + 1, y * cs + 1, 4, cs - 2)

      // Inner shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(x * cs + 1, y * cs + cs - 5, cs - 2, 4)
      ctx.fillRect(x * cs + cs - 5, y * cs + 1, 4, cs - 2)
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.lineWidth = 1
    ctx.strokeRect(x * cs + 0.5, y * cs + 0.5, cs - 1, cs - 1)
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block' }}
    />
  )
}

export default NextPiece
