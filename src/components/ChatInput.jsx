import { useState, useRef, useCallback } from 'react'
import { Box, TextField, IconButton, Tooltip } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

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

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: '#e2e8f0',
        background: '#ffffff',
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <TextField
        placeholder="Ask me anything... (Shift+Enter for new line)"
        multiline
        minRows={1}
        maxRows={6}
        fullWidth
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
        variant="outlined"
        size="small"
        inputRef={inputRef}
        inputProps={{
          style: {
            fontFamily: '"Inter", sans-serif',
            fontSize: '1rem',
            lineHeight: 1.5,
            maxHeight: '120px',
            overflowY: 'auto',
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#f8fafc',
            transition: 'all 200ms ease',
            '&:hover': {
              backgroundColor: '#f1f5f9',
              borderColor: '#0ea5e9',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
              borderColor: '#0ea5e9',
            },
            '&.Mui-disabled': {
              backgroundColor: '#f1f5f9',
              opacity: 0.6,
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '10px 12px',
            '&::placeholder': {
              color: '#94a3b8',
              opacity: 0.8,
            },
          },
        }}
      />

      <Tooltip title={loading ? 'Waiting for response...' : 'Send (Enter)'} arrow>
        <span>
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={loading || !value.trim()}
            aria-label="send message"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: 'primary.main',
              color: 'white',
              transition: 'all 200ms ease',
              '&:hover:not(.Mui-disabled)': {
                backgroundColor: '#0284c7',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#cbd5e1',
                color: 'rgba(0, 0, 0, 0.26)',
              },
            }}
          >
            <SendIcon sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}
