import api from './axios'

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')
export const updateProfile = (data) => api.put('/users/profile', data)
export const toggleSaved = (id) => api.post(`/users/saved/${id}`)
export const getSaved = () => api.get('/users/saved')
