import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getHostListings, deleteProperty } from '../api/properties'
import { getHostBookings, updateBookingStatus } from '../api/bookings'
import { PageLoader, Badge, EmptyState } from '../components/ui/index.jsx'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiHome, FiDollarSign, FiUsers } from 'react-icons/fi'
import { format } from 'date-fns'

const STATUS_COLOR = { pending: 'amber', confirmed: 'green', cancelled: 'red', completed: 'blue' }

export default function Dashboard() {
  const [listings, setListings] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('listings')

  useEffect(() => {
    Promise.all([getHostListings(), getHostBookings()])
      .then(([l, b]) => { setListings(l.data); setBookings(b.data) })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return
    try {
      await deleteProperty(id)
      setListings((l) => l.filter((x) => x._id !== id))
      toast.success('Property deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      setBookings((b) => b.map((x) => x._id === id ? { ...x, status } : x))
      toast.success(`Booking ${status}`)
    } catch {
      toast.error('Failed to update')
    }
  }

  const totalRevenue = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').reduce((s, b) => s + b.totalPrice, 0)

  if (loading) return <PageLoader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Host <span className="gradient-text">Dashboard</span></h1>
          <p className="text-sm text-[var(--color-muted)]">Manage your listings and bookings</p>
        </div>
        <Link to="/add-property" className="btn-primary">
          <FiPlus size={16} /> Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FiHome size={20} />, label: 'Listings', val: listings.length },
          { icon: <FiCalendar size={20} />, label: 'Bookings', val: bookings.length },
          { icon: <FiUsers size={20} />, label: 'Pending', val: bookings.filter((b) => b.status === 'pending').length },
          { icon: <FiDollarSign size={20} />, label: 'Revenue', val: `₹${totalRevenue.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-violet-400 mb-2">{s.icon}</div>
            <div className="text-2xl font-bold">{s.val}</div>
            <div className="text-xs text-[var(--color-muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['listings', 'bookings'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-violet-600 text-white' : 'btn-ghost'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Listings Tab */}
      {tab === 'listings' && (
        listings.length === 0 ? (
          <EmptyState icon="🏠" title="No listings yet" desc="Create your first property listing" action={<Link to="/add-property" className="btn-primary"><FiPlus size={14} /> Add Property</Link>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((p) => (
              <div key={p._id} className="glass rounded-2xl overflow-hidden">
                <div className="relative h-40">
                  <img src={p.images?.[0] || `https://source.unsplash.com/400x300/?apartment`} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge color={p.isAvailable ? 'green' : 'red'} className="absolute top-3 left-3">
                    {p.isAvailable ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-[var(--color-muted)] mb-3">{p.location?.city} · ₹{p.price?.toLocaleString()}/mo</p>
                  <div className="flex gap-2">
                    <Link to={`/properties/${p._id}`} className="btn-ghost text-xs flex-1 text-center py-1.5">View</Link>
                    <button onClick={() => handleDelete(p._id)} className="btn-ghost text-xs text-red-400 border-red-500/30 px-3 py-1.5">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Bookings Tab */}
      {tab === 'bookings' && (
        bookings.length === 0 ? (
          <EmptyState icon="📅" title="No bookings yet" desc="Bookings will appear here once tenants request your properties" />
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={b.property?.images?.[0] || `https://source.unsplash.com/200x150/?apartment`}
                  alt={b.property?.title}
                  className="w-full sm:w-28 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm line-clamp-1">{b.property?.title}</span>
                    <Badge color={STATUS_COLOR[b.status]}>{b.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] mb-2">
                    <span>Tenant: <span className="text-[var(--color-text)]">{b.tenant?.name}</span></span>
                    <span>{format(new Date(b.checkIn), 'MMM d')} → {format(new Date(b.checkOut), 'MMM d')}</span>
                    <span className="text-violet-400 font-semibold">₹{b.totalPrice?.toLocaleString()}</span>
                  </div>
                  {b.message && <p className="text-xs text-[var(--color-muted)] italic mb-2">"{b.message}"</p>}
                  {b.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatus(b._id, 'confirmed')} className="text-xs px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">Confirm</button>
                      <button onClick={() => handleStatus(b._id, 'cancelled')} className="text-xs px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Decline</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
