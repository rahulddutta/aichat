import { useEffect, useState } from 'react'
import { Box, Container, Paper, useMediaQuery, useTheme } from '@mui/material'
import Header from '../components/Header'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import TypingIndicator from '../components/TypingIndicator'
import {
  askQuestion,
  loadConversation,
  setConversationId,
  getConversationId,
} from '../services/api'

export default function ChatPage({ activeConversationId, onConversationUpdated }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Load conversation when active conversation changes
  useEffect(() => {
    async function fetchConversation() {
      if (!activeConversationId) return

      setConversationId(activeConversationId)

      try {
        const data = await loadConversation(activeConversationId)
        setMessages(data.messages || [])
      } catch (error) {
        // New conversation - start with empty messages
        setMessages([])
      }
    }

    fetchConversation()
  }, [activeConversationId])

  async function handleSend(text) {
    if (!text || loading) return

    // Ensure we have a conversation ID
    let conversationId = activeConversationId

    if (!conversationId) {
      conversationId = getConversationId()
      setConversationId(conversationId)
    }

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const data = await askQuestion(updatedMessages)

      const assistantMsg = {
        role: 'assistant',
        content: data?.answer ?? 'No response',
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMsg])

      // Notify parent that conversation was updated and sync active conversation state
      if (onConversationUpdated) {
        onConversationUpdated(conversationId)
      }
    } catch (err) {
      console.error(err)

      const errorMsg = {
        role: 'assistant',
        content:
          'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 0, sm: 2 },
          py: { xs: 0, sm: 2 },
          height: '100%',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRadius: { xs: 0, sm: 2 },
            overflow: 'hidden',
            boxShadow: {
              xs: 'none',
              sm: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            },
            bgcolor: 'white',
            mt: isMobile ? 5 : 0,
          }}
        >
          {/* Header */}
          <Header />

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <MessageList messages={messages} />

            {/* Typing Indicator */}
            {loading && (
              <Box
                sx={{
                  px: 2,
                  py: 2,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: '#0ea5e9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '1rem',
                      }}
                    >
                      🤖
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <TypingIndicator />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Input Area */}
          <ChatInput
            onSend={handleSend}
            loading={loading}
          />
        </Paper>
      </Container>
    </Box>
  )
}