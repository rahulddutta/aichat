import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function askQuestion(messages) {
  const response = await api.post('/ask', {
    messages,
  })

  return response.data
}

export default api