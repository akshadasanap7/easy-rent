import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from '@/store/authStore'
import toast from 'react-hot-toast'

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) toast.error('Please login to continue')
    else if (roles && !roles.includes(user.role)) toast.error('Access denied')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />

  return children
}
