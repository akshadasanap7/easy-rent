import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProperty, addReview } from '../api/properties'
import { createBooking } from '../api/bookings'
import { PageLoader, StarRating, Badge } from '../components/ui/index.jsx'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { FiMapPin, FiHome, FiDroplet, FiMaximize, FiUser, FiPhone, FiMail, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { format, differenceInDays } from 'date-fns'

const AMENITY_ICONS = {
  wifi: '📶', parking: '🅿️', gym: '🏋️', pool: '🏊', ac: '❄️',
  furnished: '🛋️', security: '🔒', garden: '🌿', lift: '🛗', power: '⚡',
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 1, message: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    getProperty(id)
      .then((r) => setProperty(r.data))
      .catch(() => toast.error('Property not found'))
      .finally(() => setLoading(false))
  }, [id])

  const nights = booking.checkIn && booking.checkOut
    ? differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))
    : 0

  const totalPrice = nights > 0 ? nights * property?.price : 0

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to book')
    if (nights < 1) return toast.error('Select valid dates')
    setBookingLoading(true)
    try {
      await createBooking({ propertyId: id, ...booking })
      toast.success('Booking request sent! 🎉')
      navigate('/my-bookings')
    } catch (err) {
      toast.error(err.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to review')
    setReviewLoading(true)
    try {
      await addReview(id, review)
      toast.success('Review submitted!')
      const r = await getProperty(id)
      setProperty(r.data)
      setReview({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return <PageLoader />
  if (!property) return <div className="pt-24 text-center text-[var(--color-muted)]">Property not found</div>

  const images = property.images?.length
    ? property.images
    : [`https://source.unsplash.com/800x500/?${property.type},interior`]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      {/* Back */}
      <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-violet-400 mb-6 transition-colors">
        <FiChevronLeft size={16} /> Back to listings
      </Link>

      {/* Image Gallery */}
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 mb-8 group">
        <img src={images[imgIdx]} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => setImgIdx((i) => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-5' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {images.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-violet-500' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-[var(--color-muted)] text-sm">
                  <FiMapPin size={14} />
                  {property.location?.address}, {property.location?.city}, {property.location?.state}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-violet-400">₹{property.price?.toLocaleString()}</div>
                <div className="text-xs text-[var(--color-muted)]">per month</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge color="violet">{property.type}</Badge>
              {property.isAvailable ? <Badge color="green">Available</Badge> : <Badge color="red">Unavailable</Badge>}
              {property.rating > 0 && <Badge color="amber">★ {property.rating.toFixed(1)} ({property.reviewCount} reviews)</Badge>}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <FiHome size={18} />, label: 'Bedrooms', val: property.bedrooms },
              { icon: <FiDroplet size={18} />, label: 'Bathrooms', val: property.bathrooms },
              { icon: <FiMaximize size={18} />, label: 'Area', val: property.area ? `${property.area} sqft` : 'N/A' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <div className="text-violet-400 flex justify-center mb-1">{s.icon}</div>
                <div className="font-bold">{s.val}</div>
                <div className="text-xs text-[var(--color-muted)]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-3">About this property</h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <span>{AMENITY_ICONS[a.toLowerCase()] || '✓'}</span>
                    <span className="capitalize">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Hosted by</h2>
            <div className="flex items-center gap-4">
              <img
                src={property.host?.avatar || `https://ui-avatars.com/api/?name=${property.host?.name}&background=7c3aed&color=fff&size=64`}
                alt={property.host?.name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold">{property.host?.name}</div>
                <div className="flex flex-col gap-1 mt-1">
                  {property.host?.email && (
                    <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                      <FiMail size={11} /> {property.host.email}
                    </div>
                  )}
                  {property.host?.phone && (
                    <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                      <FiPhone size={11} /> {property.host.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Reviews ({property.reviewCount})</h2>
            {property.reviews?.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4 mb-6">
                {property.reviews?.map((r, i) => (
                  <div key={i} className="border-b border-[var(--color-border)] pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={r.user?.avatar || `https://ui-avatars.com/api/?name=${r.user?.name}&background=7c3aed&color=fff&size=32`}
                        alt={r.user?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium">{r.user?.name}</div>
                        <div className="text-xs text-[var(--color-muted)]">{format(new Date(r.createdAt), 'MMM d, yyyy')}</div>
                      </div>
                      <StarRating rating={r.rating} readonly />
                    </div>
                    <p className="text-sm text-[var(--color-muted)]">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add review */}
            {user && (
              <form onSubmit={handleReview} className="border-t border-[var(--color-border)] pt-4">
                <h3 className="text-sm font-medium mb-3">Write a Review</h3>
                <div className="mb-3">
                  <StarRating rating={review.rating} onRate={(r) => setReview((v) => ({ ...v, rating: r }))} />
                </div>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview((v) => ({ ...v, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  rows={3}
                  className="input-field mb-3 resize-none"
                  required
                />
                <button type="submit" disabled={reviewLoading} className="btn-primary">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Book this property</h2>
            {!user ? (
              <div className="text-center py-4">
                <p className="text-sm text-[var(--color-muted)] mb-3">Login to book this property</p>
                <Link to="/login" className="btn-primary w-full justify-center">Login to Book</Link>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="text-xs text-[var(--color-muted)] mb-1 block">Check In</label>
                  <input
                    type="date"
                    value={booking.checkIn}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setBooking((b) => ({ ...b, checkIn: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--color-muted)] mb-1 block">Check Out</label>
                  <input
                    type="date"
                    value={booking.checkOut}
                    min={booking.checkIn || format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setBooking((b) => ({ ...b, checkOut: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--color-muted)] mb-1 block">Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={booking.guests}
                    onChange={(e) => setBooking((b) => ({ ...b, guests: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--color-muted)] mb-1 block">Message (optional)</label>
                  <textarea
                    value={booking.message}
                    onChange={(e) => setBooking((b) => ({ ...b, message: e.target.value }))}
                    placeholder="Introduce yourself..."
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>

                {nights > 0 && (
                  <div className="glass rounded-xl p-3 space-y-1 text-sm">
                    <div className="flex justify-between text-[var(--color-muted)]">
                      <span>₹{property.price?.toLocaleString()} × {nights} nights</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-[var(--color-border)] pt-1">
                      <span>Total</span>
                      <span className="text-violet-400">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={bookingLoading} className="btn-primary w-full justify-center py-3">
                  {bookingLoading ? 'Sending Request...' : 'Request to Book'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
