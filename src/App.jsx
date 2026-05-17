import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery, Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChatPage from './pages/ChatPage'
import Sidebar from './components/Sidebar'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' },
    secondary: { main: '#64748b' },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    grey: {
      100: '#f1f5f9',
      200: '#e2e8f0',
      700: '#334155',
    },
  },
  typography: {
    fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", sans-serif',
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
  },
})

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [sidebarRefresh, setSidebarRefresh] = useState(0)

  useEffect(() => {
    // Load active conversation from localStorage
    const saved = localStorage.getItem('activeConversationId')
    if (saved) {
      setActiveConversationId(saved)
    }
  }, [])

  const handleConversationSelect = (conversationId) => {
    setActiveConversationId(conversationId)
    localStorage.setItem('activeConversationId', conversationId)
  }

  const handleNewChat = () => {
    const newId = crypto.randomUUID()
    setActiveConversationId(newId)
    localStorage.setItem('activeConversationId', newId)
    setSidebarRefresh((prev) => prev + 1)
  }

  const handleConversationUpdated = (conversationId) => {
    if (conversationId) {
      setActiveConversationId(conversationId)
      localStorage.setItem('activeConversationId', conversationId)
    }
    setSidebarRefresh((prev) => prev + 1)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onNewChat={handleNewChat}
            drawerOpen={true}
            onDrawerClose={() => {}}
            isDrawerMode={false}
            refreshKey={sidebarRefresh}
          />
        )}

        {/* Mobile Drawer Sidebar */}
        {isMobile && (
          <Sidebar
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onNewChat={handleNewChat}
            drawerOpen={drawerOpen}
            onDrawerClose={() => setDrawerOpen(false)}
            isDrawerMode={true}
            refreshKey={sidebarRefresh}
          />
        )}

        {/* Main Chat Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <ChatPage
            key={activeConversationId}
            activeConversationId={activeConversationId}
            onConversationUpdated={handleConversationUpdated}
            isMobile={isMobile}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
