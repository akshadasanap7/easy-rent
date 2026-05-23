import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FiMenu, FiX, FiHome, FiUser, FiLogOut, FiPlusCircle, FiBookmark, FiCalendar } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setDropOpen(false)
  }

  const navLinks = [
    { to: '/properties', label: 'Browse' },
    ...(user?.role === 'host' ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm">
            ER
          </span>
          <span className="gradient-text">EasyRent</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${pathname === l.to ? 'text-violet-400' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl hover:border-violet-500 transition-colors"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=7c3aed&color=fff`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-2xl py-2 border border-[var(--color-border)]">
                  <div className="px-4 py-2 border-b border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-muted)]">{user.email}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 capitalize">{user.role}</span>
                  </div>
                  {[
                    { to: '/profile', icon: <FiUser size={14} />, label: 'Profile' },
                    { to: '/saved', icon: <FiBookmark size={14} />, label: 'Saved' },
                    { to: '/my-bookings', icon: <FiCalendar size={14} />, label: 'My Bookings' },
                    ...(user.role === 'host' ? [{ to: '/add-property', icon: <FiPlusCircle size={14} />, label: 'Add Property' }] : []),
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-[var(--color-muted)]" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-[var(--color-border)] px-4 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-muted)]">{l.label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-sm text-[var(--color-muted)]">Profile</Link>
              <Link to="/my-bookings" onClick={() => setOpen(false)} className="text-sm text-[var(--color-muted)]">My Bookings</Link>
              <button onClick={handleLogout} className="text-sm text-red-400 text-left">Logout</button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1 text-center">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1 text-center">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
