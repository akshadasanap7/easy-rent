import api from './axios'

export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my-bookings')
export const getHostBookings = () => api.get('/bookings/host-bookings')
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status })
