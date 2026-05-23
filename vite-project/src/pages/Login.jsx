import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      setAuth(res.data, res.data.token)
      toast.success(`Welcome back, ${res.data.name}! 👋`)
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">ER</div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Sign in to your EasyRent account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-9 pr-10"
                  required
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                  {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-muted)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
