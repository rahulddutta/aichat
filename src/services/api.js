import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getSessionId() {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

// Helper to get or create conversation ID
export function getConversationId() {
  let conversationId = localStorage.getItem('conversationId')
  if (!conversationId) {
    conversationId = crypto.randomUUID()
    localStorage.setItem('conversationId', conversationId)
  }
  return conversationId
}

// Helper to set a new conversation
export function setConversationId(id) {
  localStorage.setItem('conversationId', id)
}

// Create new conversation
export async function createNewConversation() {
  const session_id = getSessionId()
  const response = await api.post('/conversations', { session_id })
  return response.data
}

// Get all conversations
export async function getConversations() {
  const session_id = getSessionId()
  const response = await api.get('/conversations', {
    params: { session_id },
  })
  return response.data
}

export async function askQuestion(messages) {
  const conversationId = getConversationId()
  const session_id = getSessionId()
  try {
    const response = await api.post('/ask', {
      conversationId,
      session_id,
      messages,
    })
    return response.data
  } catch (error) {
    console.error('askQuestion error:', error.message, {
      response: error.response,
      request: error.request,
    })
    throw error
  }
}

export async function askQuestionStream(messages, onChunk) {
  const conversationId = getConversationId()
  const session_id = getSessionId()

  try {
    const apiBaseUrl = api.defaults.baseURL || ''
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/ask/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        session_id,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    let buffer = ''

    while (!done) {
      const { value, done: streamDone } = await reader.read()
      done = streamDone

      if (value) {
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i]
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6)
              const data = JSON.parse(jsonStr)
              
              if (data.error) {
                onChunk({ error: data.error })
              } else if (data.done) {
                onChunk({
                  done: true,
                  conversationId: data.conversationId,
                  session_id: data.session_id,
                })
              } else if (data.chunk) {
                onChunk({ chunk: data.chunk })
              }
            } catch (e) {
              // Skip parsing errors
            }
          }
        }

        buffer = lines[lines.length - 1]
      }
    }

    // Process any remaining buffer
    if (buffer && buffer.startsWith('data: ')) {
      try {
        const jsonStr = buffer.substring(6)
        const data = JSON.parse(jsonStr)
        if (data.error) {
          onChunk({ error: data.error })
        } else if (data.chunk) {
          onChunk({ chunk: data.chunk })
        }
      } catch (e) {
        // Skip parsing errors
      }
    }
  } catch (error) {
    console.error('Stream error:', error.message, {
      response: error.response,
      request: error.request,
    })
    onChunk({ error: error.message })
  }
}

export async function uploadPdf(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('session_id', getSessionId())

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export async function getUploadedFiles() {
  const session_id = getSessionId()
  const response = await api.get('/upload', {
    params: { session_id },
  })
  return response.data
}

export async function deleteUploadedFile(filename) {
  const session_id = getSessionId()
  const response = await api.delete(`/upload/${encodeURIComponent(filename)}`, {
    params: { session_id },
  })
  return response.data
}

// Load conversation by ID
export async function loadConversation(conversationId = null) {
  const id = conversationId || getConversationId()
  const response = await api.get(`/conversation/${id}`, {
    params: { session_id: getSessionId() },
  })
  return response.data
}

// Update conversation title
export async function updateConversationTitle(conversationId, title) {
  const response = await api.put(`/conversation/${conversationId}`, {
    title,
    session_id: getSessionId(),
  })
  return response.data
}

// Delete conversation
export async function deleteConversation(conversationId) {
  const response = await api.delete(`/conversation/${conversationId}`, {
    params: { session_id: getSessionId() },
  })
  return response.data
}

export default api