import React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import ChatPage from './pages/ChatPage'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatPage />
    </ThemeProvider>
  )
}

export default App
