import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App.jsx'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#9EB16F',
      contrastText: '#1f1f1f'
    },
    secondary: {
      main: '#AF93D6',
      contrastText: '#1f1f1f'
    },
    error: {
      main: '#ff6b6b'
    },
    background: {
      default: '#BACDED',
      paper: '#ffffff'
    },
    text: {
      primary: '#2e2e2e',
      secondary: 'rgba(46,46,46,0.68)'
    }
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Montserrat, Arial, sans-serif',
          background: 'linear-gradient(135deg, #BACDED, #E7E6FF)',
          color: '#2e2e2e'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 18,
          paddingRight: 18,
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 18px rgba(0,0,0,0.12)'
          }
        },
        containedPrimary: {
          backgroundColor: '#9EB16F',
          color: '#1f1f1f',
          '&:hover': { backgroundColor: '#AF93D6' }
        },
        outlined: {
          borderColor: 'rgba(46,46,46,0.18)',
          color: '#2e2e2e',
          backgroundColor: 'rgba(255,255,255,0.45)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(255,255,255,0.45)'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 18,
            backgroundColor: '#FAF4E4'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 12
        }
      }
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
