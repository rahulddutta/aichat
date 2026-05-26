import { useEffect, useRef, useState } from 'react'
import { Box, Fab } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages }) {
  const containerRef = useRef(null)
  const endRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    // Show button when user scrolls up more than 100px from bottom
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
  }

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        overflowY: 'auto',
        px: 2,
        py: 2,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        scrollBehavior: 'smooth',
        position: 'relative',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: '#f1f5f9',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            bgcolor: '#94a3b8',
          },
        },
      }}
    >
      {messages.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            color: '#94a3b8',
            textAlign: 'center',
            py: 4,
          }}
        >
          <Box>
            <Box sx={{ fontSize: '3rem', mb: 1 }}>👋</Box>
            <Box sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Ask me about employees, React, AI, etc.
            </Box>
          </Box>
        </Box>
      )}

      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}

      <div ref={endRef} />

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Fab
          size="small"
          onClick={scrollToBottom}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            bgcolor: '#0ea5e9',
            color: 'white',
            '&:hover': {
              bgcolor: '#0284c7',
            },
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
          }}
          aria-label="scroll to bottom"
        >
          <ExpandMoreIcon />
        </Fab>
      )}
    </Box>
  )
}
