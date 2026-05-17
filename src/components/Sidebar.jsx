import { useEffect, useState } from 'react'
import {
  Drawer,
  List,
  ListItemButton,
  Typography,
  Divider,
  Box,
  IconButton,
  CircularProgress,
  Collapse,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { getConversations, deleteConversation } from '../services/api'
import ConversationItem from './ConversationItem'

export default function Sidebar({
  activeConversationId,
  onConversationSelect,
  onNewChat,
  drawerOpen,
  onDrawerClose,
  isDrawerMode,
  refreshKey,
}) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    loadConversations()
  }, [refreshKey])

  async function loadConversations() {
    setLoading(true)
    try {
      const data = await getConversations()
      setConversations(data || [])
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(e, conversationId) {
    e.stopPropagation()
    try {
      await deleteConversation(conversationId)
      setConversations((prev) =>
        prev.filter((c) => c.conversationId !== conversationId)
      )
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  function handleNewChat() {
    onNewChat()
    if (isDrawerMode) {
      onDrawerClose()
    }
    loadConversations()
  }

  function handleSelectConversation(conversationId) {
    onConversationSelect(conversationId)
    if (isDrawerMode) {
      onDrawerClose()
    }
  }

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Box
          onClick={handleNewChat}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
            border: '1px solid #e2e8f0',
            borderRadius: 1.5,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            bgcolor: 'white',
            '&:hover': {
              bgcolor: '#f1f5f9',
              borderColor: '#0ea5e9',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)',
            },
            fontWeight: 500,
            color: '#334155',
          }}
        >
          <AddIcon sx={{ fontSize: 20, color: '#0ea5e9' }} />
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
            New Chat
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      {/* Conversations List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '3px',
            '&:hover': {
              background: '#94a3b8',
            },
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: '#94a3b8', fontStyle: 'italic' }}
            >
              No conversations yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 1 }}>
            {conversations.map((conversation) => (
              <Box key={conversation.conversationId}>
                <ConversationItem
                  conversation={conversation}
                  isActive={
                    activeConversationId === conversation.conversationId
                  }
                  onSelect={() =>
                    handleSelectConversation(conversation.conversationId)
                  }
                  onDelete={(e) =>
                    handleDelete(e, conversation.conversationId)
                  }
                />
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Box>
  )

  if (isDrawerMode) {
    return (
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={onDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        borderRight: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {sidebarContent}
    </Box>
  )
}
