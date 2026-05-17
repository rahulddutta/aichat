import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages }) {
  const containerRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Box
      ref={containerRef}
      sx={{
        overflowY: 'auto',
        px: 2,
        py: 2,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        scrollBehavior: 'smooth',
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
            <Box sx={{ fontSize: '3rem', mb: 1 }}>💬</Box>
            <Box sx={{ fontSize: '1rem', fontWeight: 500 }}>
              No messages yet. Start a conversation!
            </Box>
          </Box>
        </Box>
      )}

      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}

      <div ref={endRef} />
    </Box>
  )
}
