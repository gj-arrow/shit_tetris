import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7107E7' },
    secondary: { main: '#DFE7FF' },
    success: { main: '#16A34A' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    background: {
      default: '#1C202B',
      paper: '#2A2F3E',
    },
  },
  typography: {
    fontFamily: '"Bangers", "JetBrains Mono", system-ui, sans-serif',
    h1: {
      fontFamily: '"Bangers", system-ui, sans-serif',
      fontSize: '2.5rem',
      fontWeight: 400,
      letterSpacing: '2px',
    },
    h4: {
      fontFamily: '"Bangers", system-ui, sans-serif',
      fontSize: '2rem',
      fontWeight: 400,
      letterSpacing: '1.5px',
    },
    h6: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.85rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    subtitle1: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.8rem',
      fontWeight: 600,
    },
    body2: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Bangers", system-ui, sans-serif',
          letterSpacing: '1px',
          textTransform: 'none',
          padding: '8px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          backgroundColor: '#2A2F3E',
          border: '2px solid #7107E7',
        },
        title: {
          fontFamily: '"Bangers", system-ui, sans-serif',
          fontSize: '1.75rem',
          letterSpacing: '1px',
          color: '#DFE7FF',
          padding: '16px 24px',
        },
        content: {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.85rem',
          color: '#DFE7FF',
          padding: '16px 24px',
        },
        actions: {
          padding: '12px 24px',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          boxSizing: 'border-box',
        },
      },
    },
  },
})

;(() => {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = 'https://fonts.googleapis.com'
  document.head.appendChild(link)

  const link2 = document.createElement('link')
  link2.rel = 'preconnect'
  link2.href = 'https://fonts.gstatic.com'
  link2.crossOrigin = 'anonymous'
  document.head.appendChild(link2)

  const fontLink = document.createElement('link')
  fontLink.rel = 'stylesheet'
  fontLink.href =
    'https://fonts.googleapis.com/css2?family=Bangers&family=JetBrains+Mono:wght@400;600;700&display=swap'
  document.head.appendChild(fontLink)
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
