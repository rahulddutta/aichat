import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          borderRadius: 2,
          maxWidth: '75%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          boxShadow: isUser ? 3 : 1,
          transition: 'transform 160ms ease',
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
      </Paper>
    </Box>
  )
}
