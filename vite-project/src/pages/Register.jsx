import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tenant' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await register(form)
      setAuth(res.data, res.data.token)
      toast.success(`Welcome to EasyRent, ${res.data.name}! 🎉`)
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
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
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Join thousands of renters on EasyRent</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
                <input type="text" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-9" required />
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-9" required />
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
                <input type={show ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-9 pr-10" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                  {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-2 block">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: 'tenant', label: '🏠 Rent a Home', desc: 'Find & book properties' }, { val: 'host', label: '🏡 List Property', desc: 'Earn by hosting' }].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.val })}
                    className={`p-3 rounded-xl border text-left transition-all ${form.role === r.val ? 'border-violet-500 bg-violet-500/10' : 'border-[var(--color-border)] hover:border-violet-500/50'}`}
                  >
                    <div className="text-sm font-medium">{r.label}</div>
                    <div className="text-xs text-[var(--color-muted)]">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-muted)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
