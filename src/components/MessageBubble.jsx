
import { Box, Paper, Typography, Avatar } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'

const markdownComponents = {
  h1: ({ children }) => (
    <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h6" sx={{ mt: 1.75, mb: 0.75, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="subtitle1" sx={{ mt: 1.5, mb: 0.5, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography sx={{ mb: 1, lineHeight: 1.6 }}>
      {children}
    </Typography>
  ),
  strong: ({ children }) => (
    <Typography component="strong" sx={{ fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  em: ({ children }) => (
    <Typography component="em" sx={{ fontStyle: 'italic' }}>
      {children}
    </Typography>
  ),
  code: ({ inline, children }) => (
    <code
      style={{
        backgroundColor: inline ? '#f1f5f9' : undefined,
        color: inline ? '#e11d48' : undefined,
        padding: inline ? '0.125rem 0.375rem' : undefined,
        borderRadius: inline ? '0.25rem' : undefined,
        fontFamily: '"Monaco", "Courier New", monospace',
        fontSize: inline ? '0.875em' : '0.9em',
      }}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        bgcolor: '#1e293b',
        color: '#e2e8f0',
        p: 1.5,
        borderRadius: 1,
        overflow: 'auto',
        mb: 1,
        fontSize: '0.875rem',
        fontFamily: '"Monaco", "Courier New", monospace',
        lineHeight: 1.5,
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: '#0f172a',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: '#475569',
          borderRadius: '3px',
          '&:hover': {
            bgcolor: '#64748b',
          },
        },
      }}
    >
      {children}
    </Box>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 2.5, mb: 1 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ pl: 2.5, mb: 1 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Typography component="li" sx={{ mb: 0.5, lineHeight: 1.6 }}>
      {children}
    </Typography>
  ),
  blockquote: ({ children }) => (
    <Box
      sx={{
        borderLeft: '4px solid #0ea5e9',
        pl: 1.5,
        py: 0.5,
        mb: 1,
        bgcolor: '#f0f9ff',
        borderRadius: '0 4px 4px 0',
      }}
    >
      {children}
    </Box>
  ),
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        gap: 1,
        animation: 'slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '@keyframes slideIn': {
          from: {
            opacity: 0,
            transform: isUser ? 'translateX(20px)' : 'translateX(-20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#0ea5e9',
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <SmartToyIcon sx={{ fontSize: '1.25rem' }} />
        </Avatar>
      )}

      {/* Message Bubble */}
      <Box
        sx={{
          flex: isUser ? '0 0 auto' : 1,
          maxWidth: isUser ? '75%' : '85%',
          width: isUser ? 'fit-content' : '100%',
          minWidth: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: 'inline-block',
            p: 1.5,
            borderRadius: 2,
            bgcolor: isUser ? '#0ea5e9' : '#f1f5f9',
            color: isUser ? '#ffffff' : '#1e293b',
            boxShadow: isUser ? '0 4px 12px rgba(14, 165, 233, 0.2)' : 'none',
            border: isUser ? 'none' : '1px solid #e2e8f0',
            transition: 'all 200ms ease',
            '&:hover': {
              boxShadow: isUser
                ? '0 6px 20px rgba(14, 165, 233, 0.25)'
                : 'none',
            },
          }}
        >
          {isUser ? (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                lineHeight: 1.5,
              }}
            >
              {message.content}
            </Typography>
          ) : (
            <Box
              sx={{
                '& p': { margin: 0, '&:not(:last-child)': { mb: 1 } },
                '& ul, & ol': { margin: 0 },
                '& blockquote': { margin: 0 },
                '& pre': { margin: 0 },
                '& h1, & h2, & h3, & h4, & h5, & h6': { margin: 0 },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            </Box>
          )}
        </Paper>

        {/* Timestamp */}
        {message.timestamp && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              ml: 1,
              color: '#94a3b8',
              fontSize: '0.75rem',
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        )}
      </Box>

      {/* User Avatar */}
      {isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#64748b',
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <PersonIcon sx={{ fontSize: '1.25rem' }} />
        </Avatar>
      )}
    </Box>
  )
}
