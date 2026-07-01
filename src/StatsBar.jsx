import React from 'react'
import NextPiece from './NextPiece'
import { COLS } from './tetrisLogic'

const StatBox = ({ label, value, color }) => (
  <div style={{ textAlign: 'center', flex: 1 }}>
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.5rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: '#8A8FA0',
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: '"Bangers", system-ui, sans-serif',
      fontSize: '1.3rem',
      letterSpacing: '0.5px',
      color: color,
      lineHeight: 1.2,
    }}>
      {value}
    </div>
  </div>
)

const StatsBar = ({ score, level, lines, nextPiece, cellSize, maxWidth }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2A2F3E',
    border: '1px solid #3A3F50',
    borderRadius: 2,
    width: '100%',
    maxWidth: maxWidth || (COLS * cellSize + 16),
  }}>
    <StatBox label="Счёт" value={score} color="#7107E7" />
    <div style={{ width: 1, backgroundColor: '#3A3F50', alignSelf: 'stretch', minHeight: 36 }} />
    <StatBox label="Ур" value={level} color="#16A34A" />
    <div style={{ width: 1, backgroundColor: '#3A3F50', alignSelf: 'stretch', minHeight: 36 }} />
    <StatBox label="Лин" value={lines} color="#D97706" />
    <NextPiece piece={nextPiece} cellSize={cellSize} />
  </div>
)

export default StatsBar
