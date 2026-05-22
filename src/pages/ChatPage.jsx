import { useEffect, useState, useRef } from 'react'
import { Box, Button, Container, Paper, Typography, useMediaQuery, useTheme, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Header from '../components/Header'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import TypingIndicator from '../components/TypingIndicator'
import {
  askQuestion,
  loadConversation,
  setConversationId,
  getConversationId,
  uploadPdf,
  getUploadedFiles,
  deleteUploadedFile,
} from '../services/api'

export default function ChatPage({ activeConversationId, onConversationUpdated, isMobile, onOpenDrawer }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const fileInputRef = useRef(null)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleDeleteFile = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return
    try {
      await deleteUploadedFile(filename)
      setUploadedFiles((prev) => prev.filter((f) => f.filename !== filename))
      setUploadMessage(`Deleted ${filename}`)
    } catch (e) {
      console.error('Delete failed', e)
      setUploadMessage('Failed to delete file')
    }
  }

  // Load conversation when active conversation changes
  useEffect(() => {
    async function fetchUploads() {
      try {
        const files = await getUploadedFiles()
        setUploadedFiles(files || [])
      } catch (e) {
        // ignore
      }
    }

    fetchUploads()

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

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadMessage('')

    try {
      const result = await uploadPdf(file)
      const successMessage = `Uploaded ${result.chunks} chunks from ${file.name}`
      setUploadMessage(successMessage)

      try {
        const files = await getUploadedFiles()
        setUploadedFiles(files || [])
      } catch (e) {
        // ignore
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `${successMessage}. You can now ask questions about this PDF.`,
          timestamp: Date.now(),
        },
      ])
    } catch (error) {
      console.error('PDF upload failed', error)
      setUploadMessage(
        'PDF upload failed. Please try again and ensure the server is running.'
      )
    } finally {
      setUploading(false)
      event.target.value = ''
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
            mt: 0,
          }}
        >
          {/* Header */}
          <Header isMobile={isMobile || isSmallScreen} onMenuClick={onOpenDrawer} />

          {/* Upload PDF */}
          <Box
            sx={{
              px: 2,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileSelected}
            />
            <Button
              variant="outlined"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </Button>
            {uploadMessage && (
              <Typography
                variant="body2"
                sx={{ color: uploading ? 'text.secondary' : 'success.main' }}
              >
                {uploadMessage}
              </Typography>
            )}
            {uploadedFiles && uploadedFiles.length > 0 && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  Uploaded files:
                </Typography>
                {uploadedFiles.map((f, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.9rem', flex: 1 }}>
                      {f.filename} — {f.chunks} chunks
                    </Typography>
                    <IconButton size="small" onClick={() => handleDeleteFile(f.filename)} aria-label={`delete ${f.filename}`}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

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