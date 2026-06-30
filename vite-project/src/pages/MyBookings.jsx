import { useState, useEffect } from 'react'
import { getMyBookings, updateBookingStatus } from '../api/bookings'
import { PageLoader, Badge, EmptyState } from '../components/ui/index.jsx'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FiCalendar, FiMapPin } from 'react-icons/fi'

const STATUS_COLOR = { pending: 'amber', confirmed: 'green', cancelled: 'red', completed: 'blue' }

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyBookings()
      .then((r) => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  const cancel = async (id) => {
    try {
      await updateBookingStatus(id, 'cancelled')
      setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'cancelled' } : x))
      toast.success('Booking cancelled')
    } catch {
      toast.error('Failed to cancel')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <h1 className="text-3xl font-bold mb-8">My <span className="gradient-text">Bookings</span></h1>

      {bookings.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No bookings yet"
          desc="Start exploring properties and make your first booking"
          action={<Link to="/properties" className="btn-primary">Browse Properties</Link>}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
              <img
                src={b.property?.images?.[0] || `https://placehold.co/200x150/18181f/7c3aed?text=Property`}
                alt={b.property?.title}
                className="w-full sm:w-32 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link to={`/properties/${b.property?._id}`} className="font-semibold hover:text-violet-400 transition-colors line-clamp-1">
                    {b.property?.title}
                  </Link>
                  <Badge color={STATUS_COLOR[b.status]}>{b.status}</Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--color-muted)] mb-2">
                  <FiMapPin size={11} /> {b.property?.location?.city}
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--color-muted)] mb-3">
                  <span className="flex items-center gap-1"><FiCalendar size={11} /> {format(new Date(b.checkIn), 'MMM d')} → {format(new Date(b.checkOut), 'MMM d, yyyy')}</span>
                  <span className="font-semibold text-violet-400">₹{b.totalPrice?.toLocaleString()}</span>
                </div>
                {b.status === 'pending' && (
                  <button onClick={() => cancel(b._id)} className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1 rounded-lg transition-colors">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
