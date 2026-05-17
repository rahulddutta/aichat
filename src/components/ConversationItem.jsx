import { Box, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { capitalizeFirstLetter, stripMarkdown } from '../utils/text'

export default function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}) {
  const formatTime = (timestamp) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24)
      return `${days}d ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <Box
      onClick={onSelect}
      sx={{
        mx: 1,
        my: 0.75,
        px: 2,
        py: 1.5,
        borderRadius: 1.25,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        bgcolor: isActive ? '#e0f2fe' : 'transparent',
        border: isActive ? '1px solid #0ea5e9' : '1px solid transparent',
        borderLeft: isActive ? '3px solid #0ea5e9' : '3px solid transparent',
        paddingLeft: isActive ? 'calc(0.5rem - 2px)' : '0.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 1,
        group: 'item',
        '&:hover': {
          bgcolor: '#f1f5f9',
          borderColor: '#cbd5e1',
        },
        '&:hover .delete-btn': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.9rem',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? '#0ea5e9' : '#334155',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 200ms ease',
          }}
        >
          {capitalizeFirstLetter(conversation.title) || 'Untitled conversation'}
        </Typography>

        {conversation.lastMessage && (
          <Typography
            sx={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mt: 0.5,
            }}
          >
            {stripMarkdown(conversation.lastMessage)}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 0.75,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#cbd5e1',
            }}
          >
            {formatTime(conversation.updatedAt)}
          </Typography>
        </Box>
      </Box>

      <IconButton
        className="delete-btn"
        size="small"
        onClick={onDelete}
        sx={{
          opacity: 0,
          transition: 'opacity 200ms ease',
          color: '#94a3b8',
          '&:hover': {
            color: '#ef4444',
            bgcolor: 'rgba(239, 68, 68, 0.1)',
          },
        }}
      >
        <DeleteIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  )
}
