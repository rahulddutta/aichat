import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  const response = await api.post('/conversations', {})
  return response.data
}

// Get all conversations
export async function getConversations() {
  const response = await api.get('/conversations')
  return response.data
}

export async function askQuestion(messages) {
  const conversationId = getConversationId()
  const response = await api.post('/ask', {
    conversationId,
    messages,
  })
  return response.data
}

export async function uploadPdf(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

// Load conversation by ID
export async function loadConversation(conversationId = null) {
  const id = conversationId || getConversationId()
  const response = await api.get(
    `/conversation/${id}`
  )
  return response.data
}

// Update conversation title
export async function updateConversationTitle(conversationId, title) {
  const response = await api.put(`/conversation/${conversationId}`, { title })
  return response.data
}

// Delete conversation
export async function deleteConversation(conversationId) {
  const response = await api.delete(`/conversation/${conversationId}`)
  return response.data
}

export default api