import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api' })

api.interceptors.request.use((config) => {
  try {
    const persisted = localStorage.getItem('er_auth')
    const token = persisted ? JSON.parse(persisted)?.state?.token : null
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    // ignore parse errors
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err.response?.data || { message: 'Something went wrong' })
)

export default api
