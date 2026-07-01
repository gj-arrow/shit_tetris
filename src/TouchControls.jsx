import React, { useState, useRef, useCallback, useEffect } from 'react'

const BUTTON_SIZE = 56
const BUTTON_BORDER_RADIUS = 12

const buttonStyle = (bgColor, isActive) => ({
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.4rem',
  fontWeight: 700,
  color: '#DFE7FF',
  backgroundColor: isActive ? '#5A5F70' : bgColor,
  border: '2px solid #3A3F50',
  borderRadius: BUTTON_BORDER_RADIUS,
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
  WebkitTouchCallout: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.1s',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
})

function TouchButton({ label, onClick, bgColor = '#3A3F50', sx = {} }) {
  const [active, setActive] = useState(false)
  const timeoutRef = useRef(null)

  const handleStart = useCallback((e) => {
    e.preventDefault()
    setActive(true)
    onClick()
    timeoutRef.current = setTimeout(() => {
      setActive(false)
    }, 150)
  }, [onClick])

  const handleEnd = useCallback((e) => {
    e.preventDefault()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActive(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      onPointerCancel={handleEnd}
      style={{
        ...buttonStyle(bgColor, active),
        ...sx,
      }}
    >
      {label}
    </div>
  )
}

function TouchControls({ onMove, onRotate, onHardDrop, onMoveDown }) {
  const repeatRef = useRef(null)
  const directionRef = useRef(null)

  const startRepeat = useCallback((direction) => {
    directionRef.current = direction
    onMove(direction)
    repeatRef.current = setInterval(() => {
      onMove(direction)
    }, 100)
  }, [onMove])

  const stopRepeat = useCallback(() => {
    if (repeatRef.current) {
      clearInterval(repeatRef.current)
      repeatRef.current = null
    }
    directionRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (repeatRef.current) clearInterval(repeatRef.current)
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: 360,
      margin: '8px auto 0',
      gap: 16,
    }}>
      {/* Left controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        <TouchButton
          label="←"
          onClick={() => onMove('left')}
          bgColor="#2A2F3E"
          sx={{ width: 64, height: 48, fontSize: '1.2rem' }}
        />
        <TouchButton
          label="↓"
          onClick={() => onMoveDown()}
          bgColor="#2A2F3E"
          sx={{ width: 64, height: 48, fontSize: '1.2rem' }}
        />
      </div>

      {/* Center - Rotate */}
      <TouchButton
        label="↻"
        onClick={onRotate}
        bgColor="#7107E7"
        sx={{ width: 64, height: 64, fontSize: '1.6rem' }}
      />

      {/* Right - Hard Drop */}
      <TouchButton
        label="⤓"
        onClick={onHardDrop}
        bgColor="#DC2626"
        sx={{ width: 64, height: 64, fontSize: '1.6rem' }}
      />
    </div>
  )
}

export default TouchControls
