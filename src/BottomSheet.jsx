import React from 'react'
import Button from '@mui/material/Button'

const BottomSheet = ({ open, onClose, title, subtitle, controls, actionLabel, onAction, accentColor, score, level, lines }) => {
  if (!open) return null

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
      }} onClick={onClose} />
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        backgroundColor: '#2A2F3E',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTop: `3px solid ${accentColor || '#7107E7'}`,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
        zIndex: 1000,
        padding: '24px 24px 40px',
        animation: 'slideUp 0.3s ease-out',
      }}>
        <div style={{
          width: 40, height: 4,
          backgroundColor: '#5A5F70',
          borderRadius: 2,
          margin: '0 auto 16px',
        }} />

        {title && (
          <div style={{
            fontFamily: '"Bangers", system-ui, sans-serif',
            fontSize: '1.5rem',
            letterSpacing: 2,
            color: accentColor === '#DC2626' ? '#DC2626' : '#DFE7FF',
            textAlign: 'center',
            marginBottom: subtitle ? 4 : 16,
            textShadow: accentColor === '#DC2626' ? '0 0 20px rgba(220,38,38,0.3)' : 'none',
          }}>
            {title}
          </div>
        )}

        {subtitle && (
          <div style={{
            fontFamily: '"Bangers", system-ui, sans-serif',
            fontSize: '1.1rem',
            letterSpacing: '1px',
            color: '#DAA520',
            textAlign: 'center',
            marginBottom: 16,
            textShadow: '0 0 10px rgba(218,165,32,0.3)',
          }}>
            ★ {subtitle} ★
          </div>
        )}

        {score !== undefined && (
          <>
            <div style={{
              fontFamily: '"Bangers", system-ui, sans-serif',
              fontSize: '2.5rem',
              letterSpacing: '2px',
              color: '#7107E7',
              textAlign: 'center',
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {score}
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#8A8FA0',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              финальный счёт
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{
                flex: 1, textAlign: 'center', padding: '8px 4px',
                backgroundColor: '#1C202B', borderRadius: 8, border: '1px solid #3A3F50',
              }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8A8FA0' }}>
                  Уровень
                </div>
                <div style={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.3rem', color: '#16A34A', lineHeight: 1.2 }}>
                  {level}
                </div>
              </div>
              <div style={{
                flex: 1, textAlign: 'center', padding: '8px 4px',
                backgroundColor: '#1C202B', borderRadius: 8, border: '1px solid #3A3F50',
              }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8A8FA0' }}>
                  Линии
                </div>
                <div style={{ fontFamily: '"Bangers", system-ui, sans-serif', fontSize: '1.3rem', color: '#D97706', lineHeight: 1.2 }}>
                  {lines}
                </div>
              </div>
            </div>
          </>
        )}

        {controls && (
          <div style={{
            padding: 12,
            backgroundColor: '#1C202B',
            borderRadius: 8,
            border: '1px solid #3A3F50',
            marginBottom: 16,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.7rem',
              color: '#DFE7FF',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}>
              {controls}
            </div>
          </div>
        )}

        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="contained"
            fullWidth
            sx={{
              fontFamily: '"Bangers", system-ui, sans-serif',
              fontSize: '1.1rem',
              letterSpacing: '1px',
              py: 1.5,
              backgroundColor: accentColor || '#7107E7',
              '&:hover': { backgroundColor: accentColor === '#DC2626' ? '#EF4444' : '#8B2FFF' },
            }}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </>
  )
}

export default BottomSheet
