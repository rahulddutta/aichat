import React, { useState, useCallback } from 'react'
import { Box, TextField, IconButton, CircularProgress } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState('')

  const handleSend = useCallback(async () => {
    const text = value.trim()
    if (!text || loading) return
    setValue('')
    await onSend(text)
  }, [value, onSend, loading])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          placeholder="Type a message..."
          multiline
          maxRows={6}
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          variant="outlined"
          size="small"
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={loading || !value.trim()}
          aria-label="send"
        >
          {loading ? <CircularProgress size={20} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}
