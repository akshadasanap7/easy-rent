import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('er_token', token)
        set({ user, token })
      },
      updateUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('er_token')
        set({ user: null, token: null })
      },
    }),
    { name: 'er_auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
)

export default useAuthStore
