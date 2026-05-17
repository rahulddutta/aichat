import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  return (
    <Box
      ref={containerRef}
      sx={{
        overflowY: 'auto',
        px: 2,
        py: 1,
        flexGrow: 1,
      }}
    >
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}
    </Box>
  )
}
