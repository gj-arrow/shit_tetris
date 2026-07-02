import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Container, Grid, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Box, Paper, Chip, useMediaQuery,
  useTheme,
} from '@mui/material'
import GameBoard from './GameBoard'
import { TetrisGame } from './tetrisLogic'
import NextPiece from './NextPiece'
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

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
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

  useEffect(() => {
    const id = setInterval(() => updateUI(), 200)
    return () => clearInterval(id)
  }, [updateUI])

  // Stable ref to updateUI so pointer event handlers don't get recreated
  const updateUIRef = useRef(updateUI)
  useEffect(() => {
    updateUIRef.current = updateUI
  }, [updateUI])

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

    const size = 40
    const particles = []
    let lastSpawn = 0
    let rafId

    const draw = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (now - lastSpawn > 60) {
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: -size - Math.random() * 100,
            speed: 1 + Math.random() * 4,
            img: loadedImages[Math.floor(Math.random() * loadedImages.length)],
          })
        }
        lastSpawn = now
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.y += p.speed * 2
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
      pt: isMobile ? 0.5 : 1,
      pb: 0,
      px: isMobile ? 0.5 : 2,
    }}>
      {/* Title */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontFamily: '"Bangers", system-ui, sans-serif',
          fontSize: isMobile ? '1.3rem' : '2.2rem',
          letterSpacing: '2px',
          color: '#DFE7FF',
          textShadow: '0 0 20px rgba(113, 7, 231, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
          mb: 0.25,
          lineHeight: 1.1,
        }}
      >
        КАКАШЕЧНЫЙ ТЕТРИС
      </Typography>

      {/* State indicator — на мобильных внутри TopBar */}
      {!isMobile && (
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
      )}

      {/* Mobile TopBar — Score слева, остальное справа */}
      {isMobile && (
        <Paper
          sx={{
            width: '100%',
            p: '8px 12px',
            mb: 2,
            backgroundColor: '#2A2F3E',
            border: '2px solid #3A3F50',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Левая колонка: счёт сверху, пауза снизу */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.75, alignSelf: 'stretch', py: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', lineHeight: 1, mb: 0.25 }}>
                Счёт
              </Typography>
              <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.8rem', letterSpacing: '1px', color: '#7107E7', lineHeight: 1.1 }}>
                {score}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handlePause}
              sx={{
                minWidth: 52,
                width: 52,
                height: 52,
                borderRadius: '50%',
                p: 0,
                fontFamily: '"Bangers", system-ui, sans-serif',
                fontSize: '1.3rem',
                backgroundColor: gameState === 'paused' ? '#16A34A' : '#7107E7',
                '&:hover': { backgroundColor: gameState === 'paused' ? '#22c55e' : '#8B2FFF' },
              }}
            >
              {gameState === 'paused' ? '▶' : '⏸'}
            </Button>
          </Box>

          {/* Центр: Next Piece квадрат */}
          <Box sx={{
            width: 120,
            height: 120,
            mx: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1C202B',
            borderRadius: 1,
            border: '2px solid #3A3F50',
            flexShrink: 0,
          }}>
            <Box sx={{
              transform: 'scale(1.0)',
              transformOrigin: 'center center',
              lineHeight: 0,
            }}>
              <NextPiece piece={nextPieceRef} />
            </Box>
          </Box>

          {/* Правая колонка: статус сверху, уровень/линии снизу */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.75, alignSelf: 'stretch', py: 1 }}>
            <Chip
              label={stateChip.label}
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '2px',
                color: stateChip.color,
                backgroundColor: '#1C202B',
                border: `2px solid ${stateChip.color}`,
                height: '40px',
                '& .MuiChip-label': { px: 2 },
                flexShrink: 0,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'center', minWidth: 48 }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', lineHeight: 1, mb: 0.25 }}>
                  Ур
                </Typography>
                <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.4rem', color: '#16A34A', lineHeight: 1.1 }}>
                  {level}
                </Typography>
              </Box>
              <Box sx={{ width: '1px', height: 36, backgroundColor: '#3A3F50' }} />
              <Box sx={{ textAlign: 'center', minWidth: 48 }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#8A8FA0', lineHeight: 1, mb: 0.25 }}>
                  Лин
                </Typography>
                <Typography sx={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.4rem', color: '#D97706', lineHeight: 1.1 }}>
                  {lines}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Game Board - fills remaining space on mobile */}
      <Box sx={{
        flex: isMobile ? 1 : 0,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 0 : 2,
        pb: isMobile ? '16px' : 0,
        width: '100%',
        maxWidth: isMobile ? '100%' : 680,
        minHeight: isMobile ? 0 : undefined,
        overflow: 'hidden',
      }}>
        {/* Board */}
        <Box sx={{
          flexShrink: 0,
          ...(isMobile ? { maxHeight: '100%', display: 'flex' } : {}),
        }}>
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
            mb: 2,
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
            <Paper
              sx={{
                p: '6px 10px',
                backgroundColor: '#2A2F3E',
                border: '1px solid #3A3F50',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
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

            {/* Controls - desktop only */}
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

      {/* Start Dialog */}
      <Dialog
        open={startOpen}
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: '#2A2F3E',
            border: '2px solid #7107E7',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{
          fontFamily: '"Bangers", system-ui, sans-serif',
          fontSize: '2rem',
          letterSpacing: '2px',
          color: '#DFE7FF',
          textAlign: 'center',
        }}>
          КАКАШЕЧНЫЙ ТЕТРИС
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.85rem',
            color: '#8A8FA0',
            mb: 2,
          }}>
            Собирай линии, набирай очки!
          </Typography>
            <Box sx={{
              p: 2,
              backgroundColor: '#1C202B',
              borderRadius: 2,
              border: '1px solid #3A3F50',
            }}>
              <Typography sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.7rem',
                color: '#DFE7FF',
                lineHeight: 1.8,
              }}>
                {isMobile
                  ? `← → — движение${'\n'}↑ — вниз (1 кл)${'\n'}↓ — сброс${'\n'}Тап — поворот`
                  : `← → — движение${'\n'}↓ — вниз${'\n'}Пробел — сброс${'\n'}Enter — поворот${'\n'}P — пауза`
                }
              </Typography>
            </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleStart}
            variant="contained"
            sx={{
              fontFamily: '"Bangers", system-ui, sans-serif',
              fontSize: '1.3rem',
              letterSpacing: '2px',
              py: 1.5,
              px: 4,
              backgroundColor: '#7107E7',
              '&:hover': { backgroundColor: '#8B2FFF' },
            }}
          >
            НАЧАТЬ ИГРУ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Game Over Dialog */}
      <Dialog
        open={gameOverOpen}
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: '#2A2F3E',
            border: '2px solid #DC2626',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{
          fontFamily: '"Bangers", system-ui, sans-serif',
          fontSize: '2.5rem',
          letterSpacing: '2px',
          color: '#DC2626',
          textAlign: 'center',
          textShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
        }}>
          ИГРА ОКОНЧЕНА
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            {/* Счёт */}
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#8A8FA0',
                mb: 0.25,
              }}>
                Счёт
              </Typography>
              <Typography sx={{
                fontFamily: '"Bangers", system-ui, sans-serif',
                fontSize: '2rem',
                letterSpacing: '2px',
                color: '#7107E7',
                lineHeight: 1,
              }}>
                {score}
              </Typography>
            </Box>

            {/* Уровень */}
            <Box sx={{ width: '1px', height: 56, backgroundColor: '#3A3F50', alignSelf: 'center' }} />

            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#8A8FA0',
                mb: 0.25,
              }}>
                Уровень
              </Typography>
              <Typography sx={{
                fontFamily: '"Bangers", system-ui, sans-serif',
                fontSize: '2rem',
                letterSpacing: '2px',
                color: '#16A34A',
                lineHeight: 1,
              }}>
                {level}
              </Typography>
            </Box>

            {/* Линии */}
            <Box sx={{ width: '1px', height: 56, backgroundColor: '#3A3F50', alignSelf: 'center' }} />

            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#8A8FA0',
                mb: 0.25,
              }}>
                Линии
              </Typography>
              <Typography sx={{
                fontFamily: '"Bangers", system-ui, sans-serif',
                fontSize: '2rem',
                letterSpacing: '2px',
                color: '#D97706',
                lineHeight: 1,
              }}>
                {lines}
              </Typography>
            </Box>
          </Box>
          {score >= highScore && score > 0 && (
            <Typography sx={{
              fontFamily: '"Bangers", system-ui, sans-serif',
              fontSize: '1.2rem',
              letterSpacing: '1px',
              color: '#DAA520',
              mt: 2,
              textShadow: '0 0 10px rgba(218, 165, 32, 0.3)',
            }}>
              ★ НОВЫЙ РЕКОРД! ★
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleRestart}
            variant="contained"
            sx={{
              fontFamily: '"Bangers", system-ui, sans-serif',
              fontSize: '1.3rem',
              letterSpacing: '2px',
              py: 1.5,
              px: 4,
              backgroundColor: '#DC2626',
              '&:hover': { backgroundColor: '#EF4444' },
            }}
          >
            ИГРАТЬ СНОВА
          </Button>
        </DialogActions>
      </Dialog>

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
