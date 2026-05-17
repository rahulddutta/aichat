import React, { useState, useCallback } from 'react'
import { Box, Container, Paper, Stack, CircularProgress } from '@mui/material'
import Header from '../components/Header'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import { askQuestion } from '../services/api'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSend(text) {
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const data = await askQuestion(updatedMessages)
      const assistant = { role: 'assistant', content: data?.answer ?? 'No response' }
      setMessages((prev) => [...prev, assistant])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: could not reach the AI.' }])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '80vh', borderRadius: 2, overflow: 'hidden' }}>
          <Header />

          <Stack sx={{ flex: 1, minHeight: 0 }}>
            <MessageList messages={messages} />
            <Box sx={{ px: 2 }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </Box>
            <ChatInput onSend={handleSend} loading={loading} />
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
