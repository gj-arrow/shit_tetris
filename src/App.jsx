import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Container, Grid, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Box, Paper, Chip, useMediaQuery,
  useTheme,
} from '@mui/material'
import GameBoard from './GameBoard'
import { TetrisGame, getCellSize, setCellSize, COLS } from './tetrisLogic'
import NextPiece from './NextPiece'
import StatsBar from './StatsBar'
import BottomSheet from './BottomSheet'

import bgImage from './assets/images/shit5.png'
import shit1 from './assets/images/shit1.png'
import shit2 from './assets/images/shit2.png'
import shit3 from './assets/images/shit3.png'
import shit4 from './assets/images/shit4.png'
import shit6 from './assets/images/shit6.png'
import shit7 from './assets/images/shit7.png'

const rainImages = [shit1, shit2, shit3, shit4, bgImage, shit6, shit7]

const keyStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '28px',
  height: '24px',
  padding: '0 6px',
  fontSize: '0.7rem',
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: 700,
  backgroundColor: '#3A3F50',
  color: '#DFE7FF',
  borderRadius: '4px',
  border: '1px solid #5A5F70',
  margin: '0 2px',
  verticalAlign: 'middle',
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function StatCard({ label, value, color = '#DFE7FF' }) {
  return (
    <Paper
      sx={{
        p: '10px 16px',
        mb: 1,
        backgroundColor: '#2A2F3E',
        border: '1px solid #3A3F50',
        borderRadius: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.65rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#8A8FA0',
          display: 'block',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Bangers", system-ui, sans-serif',
          fontSize: '2rem',
          letterSpacing: '1px',
          color: color,
          lineHeight: 1.2,
          mt: 0.5,
        }}
      >
        {value}
      </Typography>
    </Paper>
  )
}

function ControlRow({ keys, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
        {keys.map((k, i) => (
          <span key={k} style={{ ...keyStyles, ...(i > 0 ? { marginLeft: '-2px' } : {}) }}>
            {k}
          </span>
        ))}
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.7rem',
          color: '#8A8FA0',
        }}
      >
        {action}
      </Typography>
    </Box>
  )
}

function App() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const touchSupported = isTouchDevice() || isMobile

  const [game] = useState(() => new TetrisGame())
  const [gameState, setGameState] = useState('ready')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [nextPieceRef, setNextPieceRef] = useState(null)
  const [startOpen, setStartOpen] = useState(true)
  const [gameOverOpen, setGameOverOpen] = useState(false)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('poop-tetris-highscore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [cellSize, setCellSizeState] = useState(28)
  const rainCanvasRef = useRef(null)

  const updateUI = useCallback(() => {
    const state = game.getState()
    setScore(state.score)
    setLevel(state.level)
    setLines(state.lines)
    setGameState(state.state)
    if (state.nextPiece && (!nextPieceRef || nextPieceRef.type !== state.nextPiece.type)) {
      setNextPieceRef(state.nextPiece)
    }
    if (state.state === 'gameover') {
      setGameOverOpen(true)
      if (state.score > highScore) {
        setHighScore(state.score)
        localStorage.setItem('poop-tetris-highscore', state.score.toString())
      }
    }
  }, [game, nextPieceRef, highScore])

  const updateUIRef = useRef(updateUI)
  useEffect(() => {
    updateUIRef.current = updateUI
  }, [updateUI])

  useEffect(() => {
    let animFrameId
    const tick = () => {
      updateUIRef.current()
      animFrameId = requestAnimationFrame(() => tick())
    }
    animFrameId = requestAnimationFrame(() => tick())
    return () => cancelAnimationFrame(animFrameId)
  }, [])

  const callUpdateUI = useCallback(() => {
    updateUIRef.current()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = game.getState().state
      if (state === 'paused') {
        e.preventDefault()
        if (e.code === 'Space') game.start()
        return
      }

      if (state !== 'playing') return

      switch (e.code) {
        case 'ArrowLeft':
          game.move('left')
          break
        case 'ArrowRight':
          game.move('right')
          break
        case 'ArrowDown':
          game.moveDown()
          break
        case 'Space':
          game.hardDrop()
          break
        case 'Enter':
          game.rotate()
          break
        case 'KeyP':
          game.togglePause()
          break
      }

      updateUI()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [game, updateUI])



  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgImage})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundBlendMode = 'overlay'
    document.body.style.backgroundColor = '#1C202B'
    document.body.style.backgroundRepeat = 'no-repeat'

    const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/png'
    link.rel = 'shortcut icon'
    link.href = bgImage
    document.getElementsByTagName('head')[0].appendChild(link)

    return () => {
      document.body.style.backgroundImage = ''
    }
  }, [])

  // Dynamic cell size for mobile
  useEffect(() => {
    const calc = () => {
      if (isMobile) {
        const availableHeight = window.innerHeight - 220
        const cs = Math.max(18, Math.min(28, Math.floor(availableHeight / 20)))
        setCellSizeState(cs)
        setCellSize(cs)
      } else {
        setCellSizeState(28)
        setCellSize(28)
      }
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [isMobile])

  // Lock orientation on mobile
  useEffect(() => {
    if (isMobile && screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('portrait').catch(() => {})
    }
  }, [isMobile])

  useEffect(() => {
    if (!gameOverOpen) return

    const canvas = rainCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const loadedImages = rainImages.map(src => {
      const img = new Image()
      img.src = src
      return img
    })

    const size = isMobile ? 28 : 40
    const particles = []
    let lastSpawn = 0
    let rafId
    const spawnRate = isMobile ? 120 : 60
    const spawnCount = isMobile ? 2 : 4

    const draw = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (now - lastSpawn > spawnRate) {
        for (let i = 0; i < spawnCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: -size - Math.random() * 100,
            speed: 1 + Math.random() * 3,
            img: loadedImages[Math.floor(Math.random() * loadedImages.length)],
          })
        }
        lastSpawn = now
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.y += p.speed * (isMobile ? 1.5 : 2)
        if (p.img.complete && p.img.naturalWidth > 0) {
          ctx.drawImage(p.img, p.x, p.y, size, size)
        }
        if (p.y > canvas.height + size) {
          particles.splice(i, 1)
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(rafId)
  }, [gameOverOpen])

  const handleStart = () => {
    const btn = document.activeElement
    if (btn && btn.blur) btn.blur()
    setStartOpen(false)
    game.start()
    updateUI()
  }

  const handleRestart = () => {
    setGameOverOpen(false)
    setScore(0)
    setLevel(1)
    setLines(0)
    game.start()
    setTimeout(() => updateUI(), 50)
    const button = document.querySelector('[id*="root"] Button') ||
                   document.querySelector('Button') ||
                   document.activeElement
    if (button && button.blur) {
      setTimeout(() => button?.blur(), 10)
    }
  }

  const handlePause = () => {
    game.togglePause()

    const button = document.querySelector('[id*="root"] Button') ||
                   document.querySelector('Button') ||
                   document.activeElement
    if (button && button.blur) {
      setTimeout(() => button?.blur(), 10)
    }

    if (game.getState().state === 'playing') {
      game.spawnNext()
    }
    updateUI()
  }

  const stateChip = gameState === 'playing'
    ? { label: 'ИГРАЕТ', color: '#16A34A', bg: '#1a3a2a' }
    : gameState === 'paused'
      ? { label: 'ПАУЗА', color: '#D97706', bg: '#3a2a1a' }
      : gameState === 'gameover'
        ? { label: 'КОНЕЦ ИГРЫ', color: '#DC2626', bg: '#3a1a1a' }
        : { label: 'ГОТОВ', color: '#DFE7FF', bg: '#2a2f3e' }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      pt: 1,
      pb: 1,
      px: 2,
    }}>
      {/* Title */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontFamily: '"Bangers", system-ui, sans-serif',
          fontSize: isMobile ? '1.5rem' : '2.2rem',
          letterSpacing: '2px',
          color: '#DFE7FF',
          textShadow: '0 0 20px rgba(113, 7, 231, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
          mb: 0.5,
          lineHeight: 1,
        }}
      >
        КАКАШЕЧНЫЙ ТЕТРИС
      </Typography>

      {/* State indicator */}
      <Chip
        label={stateChip.label}
        sx={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '1.5px',
          color: stateChip.color,
          backgroundColor: stateChip.bg,
          border: `1px solid ${stateChip.color}`,
          mb: 0.75,
          height: '24px',
        }}
      />

      {/* Mobile stats bar */}
      {isMobile && (
        <StatsBar
          score={score}
          level={level}
          lines={lines}
          nextPiece={nextPieceRef}
          cellSize={cellSize}
        />
      )}

      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'flex-start',
        gap: isMobile ? 0.5 : 2,
        width: '100%',
        maxWidth: isMobile ? COLS * cellSize + 16 : 680,
        justifyContent: 'center',
      }}>
        {/* Game Board */}
        <Box sx={{ flexShrink: 0, touchAction: 'none' }}>
          <Paper
            sx={{
              p: isMobile ? 0.5 : 0.75,
              backgroundColor: '#2A2F3E',
              border: '2px solid #3A3F50',
              borderRadius: 2,
            }}
          >
            <GameBoard game={game} isMobile={isMobile} callUpdateUI={callUpdateUI} />
          </Paper>
        </Box>

        {/* Side Panel - desktop only */}
        {!isMobile && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            minWidth: 160,
            maxWidth: 200,
          }}>
            {/* Next Piece */}
            <Paper
              sx={{
                p: 1,
                backgroundColor: '#2A2F3E',
                border: '1px solid #3A3F50',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.55rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#8A8FA0',
                display: 'block',
                mb: 0.5,
              }}>
                Фигура
              </Typography>
              <Box sx={{
                display: 'inline-block',
                backgroundColor: '#1C202B',
                borderRadius: 1,
                border: '1px solid #3A3F50',
              }}>
                <NextPiece piece={nextPieceRef} />
              </Box>
            </Paper>

            {/* Stats - compact */}
            <Paper sx={{
              p: '6px 10px',
              backgroundColor: '#2A2F3E',
              border: '1px solid #3A3F50',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8A8FA0' }}>
                  Счёт
                </Typography>
                <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.3rem', letterSpacing: '0.5px', color: '#7107E7', lineHeight: 1.2 }}>
                  {score}
                </Typography>
              </Box>
              <Box sx={{ width: '1px', backgroundColor: '#3A3F50', mx: 0.75 }} />
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8A8FA0' }}>
                  Ур
                </Typography>
                <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.3rem', color: '#16A34A', lineHeight: 1.2 }}>
                  {level}
                </Typography>
              </Box>
              <Box sx={{ width: '1px', backgroundColor: '#3A3F50', mx: 0.75 }} />
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8A8FA0' }}>
                  Лин
                </Typography>
                <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.3rem', color: '#D97706', lineHeight: 1.2 }}>
                  {lines}
                </Typography>
              </Box>
            </Paper>

            {/* High Score */}
            {highScore > 0 && (
              <Paper sx={{ p: '4px 10px', backgroundColor: '#1C202B', border: '1px solid #3A3F50', borderRadius: 2, textAlign: 'center' }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.45rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', display: 'block' }}>
                  Рекорд
                </Typography>
                <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.1rem', letterSpacing: '0.5px', color: '#DAA520', lineHeight: 1.2 }}>
                  {highScore.toLocaleString('ru-RU')}
                </Typography>
              </Paper>
            )}

            {/* Controls */}
            {!touchSupported && (
              <Paper sx={{ p: 1, backgroundColor: '#2A2F3E', border: '1px solid #3A3F50', borderRadius: 2 }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', display: 'block', mb: 0.75 }}>
                  Управление
                </Typography>
                <ControlRow keys={['←', '→']} action="движ" />
                <ControlRow keys={['↓']} action="вниз" />
                <ControlRow keys={['Пробел']} action="сброс" />
                <ControlRow keys={['Enter']} action="поворот" />
                <ControlRow keys={['P']} action="пауза" />
              </Paper>
            )}

            {/* Pause Button */}
            <Button variant="contained" onClick={handlePause} fullWidth
              sx={{
                fontFamily: '"Bangers", system-ui, sans-serif',
                fontSize: '0.95rem', letterSpacing: '1px', py: 0.75,
                backgroundColor: gameState === 'paused' ? '#16A34A' : '#7107E7',
                '&:hover': { backgroundColor: gameState === 'paused' ? '#22c55e' : '#8B2FFF' },
              }}
            >
              {gameState === 'paused' ? '▶ ПРОДОЛЖИТЬ' : '⏸ ПАУЗА'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Mobile Pause Button */}
      {isMobile && (gameState === 'playing' || gameState === 'paused') && (
        <Button
          variant="contained"
          onClick={handlePause}
          sx={{
            position: 'fixed',
            bottom: 12,
            right: 12,
            minWidth: 44,
            width: 44,
            height: 44,
            borderRadius: '50%',
            p: 0,
            fontFamily: '"Bangers", system-ui, sans-serif',
            fontSize: '1.1rem',
            backgroundColor: gameState === 'paused' ? '#16A34A' : '#7107E7',
            '&:hover': { backgroundColor: gameState === 'paused' ? '#22c55e' : '#8B2FFF' },
            zIndex: 1100,
          }}
        >
          {gameState === 'paused' ? '▶' : '⏸'}
        </Button>
      )}

      {/* Start Dialog / Sheet */}
      {isMobile ? (
        <BottomSheet
          open={startOpen}
          onClose={() => {}}
          title="КАКАШЕЧНЫЙ ТЕТРИС"
          subtitle="Собирай линии, набирай очки!"
          controls={touchSupported ? 'Свайп ← → движение\nСвайп ↓ — сброс\nТап — поворот' : '← → движение\n↓ вниз\nПробел сброс'}
          actionLabel="НАЧАТЬ ИГРУ"
          onAction={handleStart}
          accentColor="#7107E7"
        />
      ) : (
        <Dialog
          open={startOpen}
          maxWidth="xs"
          slotProps={{ paper: { sx: { backgroundColor: '#2A2F3E', border: '2px solid #7107E7', borderRadius: 3 } } }}
        >
          <DialogTitle sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '2rem', letterSpacing: '2px', color: '#DFE7FF', textAlign: 'center' }}>
            КАКАШЕЧНЫЙ ТЕТРИС
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', color: '#8A8FA0', mb: 2 }}>
              Собирай линии, набирай очки!
            </Typography>
            <Box sx={{ p: 2, backgroundColor: '#1C202B', borderRadius: 2, border: '1px solid #3A3F50' }}>
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', color: '#DFE7FF', lineHeight: 1.8 }}>
                {touchSupported ? (
                  <>
                    Свайп ← → — движение{'\n'}
                    Свайп ↑ — поворот{'\n'}
                    Свайп ↓ — сброс
                  </>
                ) : (
                  <>
                    ← → — движение{'\n'}
                    ↓ — вниз{'\n'}
                    Пробел — сброс{'\n'}
                    Enter — поворот{'\n'}
                    P — пауза
                  </>
                )}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button onClick={handleStart} variant="contained"
              sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.3rem', letterSpacing: '2px', py: 1.5, px: 4, backgroundColor: '#7107E7', '&:hover': { backgroundColor: '#8B2FFF' } }}
            >
              НАЧАТЬ ИГРУ
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Game Over Dialog / Sheet */}
      {isMobile ? (
        <BottomSheet
          open={gameOverOpen}
          onClose={() => {}}
          title="ИГРА ОКОНЧЕНА"
          subtitle={score >= highScore && score > 0 ? 'НОВЫЙ РЕКОРД!' : ''}
          score={score}
          level={level}
          lines={lines}
          actionLabel="ИГРАТЬ СНОВА"
          onAction={handleRestart}
          accentColor="#DC2626"
        />
      ) : (
        <Dialog
          open={gameOverOpen}
          maxWidth="xs"
          slotProps={{ paper: { sx: { backgroundColor: '#2A2F3E', border: '2px solid #DC2626', borderRadius: 3 } } }}
        >
          <DialogTitle sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '2.5rem', letterSpacing: '2px', color: '#DC2626', textAlign: 'center', textShadow: '0 0 20px rgba(220, 38, 38, 0.3)' }}>
            ИГРА ОКОНЧЕНА
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '3rem', letterSpacing: '2px', color: '#7107E7', lineHeight: 1, mb: 1 }}>
              {score}
            </Typography>
            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', display: 'block', mb: 2 }}>
              финальный счёт
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <Paper sx={{ p: 1.5, backgroundColor: '#1C202B', border: '1px solid #3A3F50', borderRadius: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', display: 'block' }}>
                    Уровень
                  </Typography>
                  <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.5rem', color: '#16A34A' }}>
                    {level}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 1.5, backgroundColor: '#1C202B', border: '1px solid #3A3F50', borderRadius: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', display: 'block' }}>
                    Линии
                  </Typography>
                  <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.5rem', color: '#D97706' }}>
                    {lines}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            {score >= highScore && score > 0 && (
              <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.2rem', letterSpacing: '1px', color: '#DAA520', mt: 2, textShadow: '0 0 10px rgba(218, 165, 32, 0.3)' }}>
                ★ НОВЫЙ РЕКОРД! ★
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button onClick={handleRestart} variant="contained"
              sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.3rem', letterSpacing: '2px', py: 1.5, px: 4, backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#EF4444' } }}
            >
              ИГРАТЬ СНОВА
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {gameOverOpen && (
        <canvas
          ref={rainCanvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      )}
    </Box>
  )
}

export default App
