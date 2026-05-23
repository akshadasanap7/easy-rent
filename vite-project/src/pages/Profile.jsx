import { useState } from 'react'
import { updateProfile } from '../api/auth'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { FiUser, FiPhone, FiCamera } from 'react-icons/fi'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', role: user?.role || 'tenant' })
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(user?.avatar || '')
  const [loading, setLoading] = useState(false)

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('phone', form.phone)
      fd.append('role', form.role)
      if (avatar) fd.append('avatar', avatar)
      const res = await updateProfile(fd)
      updateUser(res.data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <h1 className="text-3xl font-bold mb-8">My <span className="gradient-text">Profile</span></h1>

      <div className="glass rounded-3xl p-8">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${user?.name}&background=7c3aed&color=fff&size=96`}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover"
            />
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-violet-700 transition-colors">
              <FiCamera size={14} />
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-1 block">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-9" required />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-1 block">Email</label>
            <input type="email" value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-1 block">Phone</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={15} />
              <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-9" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-2 block">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ val: 'tenant', label: '🏠 Tenant' }, { val: 'host', label: '🏡 Host' }].map((r) => (
                <button key={r.val} type="button" onClick={() => setForm({ ...form, role: r.val })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${form.role === r.val ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-[var(--color-border)] text-[var(--color-muted)]'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
