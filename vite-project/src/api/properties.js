import api from './axios'

export const getProperties = (params) => api.get('/properties', { params })
export const getProperty = (id) => api.get(`/properties/${id}`)
export const createProperty = (data) => api.post('/properties', data)
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data)
export const deleteProperty = (id) => api.delete(`/properties/${id}`)
export const addReview = (id, data) => api.post(`/properties/${id}/reviews`, data)
export const getHostListings = () => api.get('/properties/host/my-listings')
