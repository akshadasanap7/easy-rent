import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import toast from 'react-hot-toast'

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuthStore()

  if (!user) {
    toast.error('Please login to continue')
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    toast.error('Access denied')
    return <Navigate to="/" replace />
  }

  return children
}
