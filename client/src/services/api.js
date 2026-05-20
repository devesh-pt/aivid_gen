import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('visionflow-auth')
  if (stored) {
    const { state } = JSON.parse(stored)
    if (state?.token) config.headers.Authorization = `Bearer ${state.token}`
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const videoAPI = {
  list: () => api.get('/videos'),
  get: (id) => api.get(`/videos/${id}`),
  delete: (id) => api.delete(`/videos/${id}`),
  update: (id, data) => api.patch(`/videos/${id}`, data),
}

export const generationAPI = {
  start: (prompt, settings) => api.post('/generation/start', { prompt, settings }),
  status: (videoId) => api.get(`/generation/status/${videoId}`),
}

export const exportAPI = {
  export: (id, options) => api.post(`/export/${id}`, options),
}

export const aiAPI = {
  generateTitle: (prompt) => api.post('/ai/title', { prompt }),
  generateHashtags: (prompt) => api.post('/ai/hashtags', { prompt }),
  generateDescription: (prompt, title) => api.post('/ai/description', { prompt, title }),
  generateThumbnail: (prompt) => api.post('/ai/thumbnail', { prompt }),
}

export const uploadAPI = {
  uploadLogo: (file) => {
    const form = new FormData()
    form.append('logo', file)
    return api.post('/upload/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

export default api
