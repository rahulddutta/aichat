import { useEffect, useState, useRef } from 'react'
import { Box, Button, Container, Paper, Typography, useMediaQuery, useTheme, IconButton, Alert, Chip, LinearProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import Header from '../components/Header'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import TypingIndicator from '../components/TypingIndicator'
import {
  askQuestionStream,
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
  const [uploadError, setUploadError] = useState('')
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
      setUploadError('')
      setTimeout(() => setUploadMessage(''), 3000)
    } catch (e) {
      console.error('Delete failed', e)
      setUploadError('Failed to delete file')
      setUploadMessage('')
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

    const requestMessages = updatedMessages.slice(-6)

    try {
      let fullAnswer = ''
      let messageAdded = false

      await askQuestionStream(requestMessages, (data) => {
        if (data.error) {
          console.error('Stream error:', data.error)
          
          // If we haven't added the message yet, add it with error
          if (!messageAdded) {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: `Error: ${data.error}`,
                timestamp: Date.now(),
              },
            ])
            messageAdded = true
          } else {
            // Update existing message with error
            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: `Error: ${data.error}`,
              }
              return updated
            })
          }
        } else if (data.chunk) {
          fullAnswer += data.chunk
          
          if (!messageAdded) {
            // First chunk - add message to state
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: fullAnswer,
                timestamp: Date.now(),
              },
            ])
            messageAdded = true
          } else {
            // Subsequent chunks - update existing message
            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: fullAnswer,
              }
              return updated
            })
          }
        } else if (data.done) {
          if (onConversationUpdated) {
            onConversationUpdated(conversationId)
          }
        }
      })
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
    setUploadError('')

    try {
      const result = await uploadPdf(file)
      const successMessage = `✓ Uploaded ${result.chunks} chunks from ${file.name}`
      setUploadMessage(successMessage)
      setUploadError('')

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
          content: `Successfully uploaded "${file.name}" with ${result.chunks} chunks. You can now ask questions about this PDF.`,
          timestamp: Date.now(),
        },
      ])

      // Clear success message after 4 seconds
      setTimeout(() => setUploadMessage(''), 4000)
    } catch (error) {
      console.error('PDF upload failed', error)
      const errorMsg = 'PDF upload failed. Please try again and ensure the server is running.'
      setUploadError(errorMsg)
      setUploadMessage('')
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
              borderBottom: '1px solid #e2e8f0',
              bgcolor: '#fafafa',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileSelected}
            />

            {/* Upload Button and Progress */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: uploadMessage || uploadError || (uploadedFiles && uploadedFiles.length > 0) ? 2 : 0 }}>
              <Button
                variant="contained"
                onClick={handleUploadClick}
                disabled={uploading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 200ms ease',
                }}
              >
                {uploading ? 'Uploading...' : 'Upload PDF'}
              </Button>
              {uploading && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Processing file...
                </Typography>
              )}
            </Box>

            {uploading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

            {/* Success Message */}
            {uploadMessage && (
              <Alert
                icon={<CheckCircleIcon fontSize="inherit" />}
                severity="success"
                sx={{ mb: 2, borderRadius: 1 }}
                onClose={() => setUploadMessage('')}
              >
                {uploadMessage}
              </Alert>
            )}

            {/* Error Message */}
            {uploadError && (
              <Alert
                icon={<ErrorIcon fontSize="inherit" />}
                severity="error"
                sx={{ mb: 2, borderRadius: 1 }}
                onClose={() => setUploadError('')}
              >
                {uploadError}
              </Alert>
            )}

            {/* Uploaded Files */}
            {uploadedFiles && uploadedFiles.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Uploaded Files ({uploadedFiles.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {uploadedFiles.map((f, idx) => (
                    <Chip
                      key={idx}
                      icon={<DescriptionIcon />}
                      label={`${f.filename} (${f.chunks} chunks)`}
                      onDelete={() => handleDeleteFile(f.filename)}
                      variant="outlined"
                      sx={{
                        borderColor: '#cbd5e1',
                        bgcolor: '#ffffff',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <TypingIndicator />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Thinking...
                    </Typography>
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