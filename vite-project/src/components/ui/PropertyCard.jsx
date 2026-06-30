import { Link } from 'react-router-dom'
import { FiMapPin, FiStar, FiHome, FiDroplet, FiHeart } from 'react-icons/fi'
import { useState } from 'react'
import { toggleSaved } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function PropertyCard({ property, savedIds = [] }) {
  const { user } = useAuthStore()
  const [saved, setSaved] = useState(() => savedIds.includes(property._id))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Login to save properties')
    try {
      const res = await toggleSaved(property._id)
      setSaved(res.data.saved)
      toast.success(res.data.saved ? 'Saved!' : 'Removed from saved')
    } catch {
      toast.error('Failed to save')
    }
  }

  const img = property.images?.[0] || `https://placehold.co/600x400/18181f/7c3aed?text=${encodeURIComponent(property.type || 'Property')}`

  return (
    <Link to={`/properties/${property._id}`} className="block">
      <div className="glass rounded-2xl overflow-hidden card-hover group">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img src={img} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={handleSave}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${saved ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500'}`}
          >
            <FiHeart size={14} fill={saved ? 'white' : 'none'} />
          </button>
          <span className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded-full bg-violet-600/90 text-white capitalize font-medium">
            {property.type}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm leading-snug line-clamp-1">{property.title}</h3>
            {property.rating > 0 && (
              <div className="flex items-center gap-1 text-xs text-amber-400 shrink-0">
                <FiStar size={11} fill="currentColor" /> {property.rating.toFixed(1)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--color-muted)] mb-3">
            <FiMapPin size={11} /> {property.location?.city}, {property.location?.state}
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] mb-3">
            <span className="flex items-center gap-1"><FiHome size={11} /> {property.bedrooms} bed</span>
            <span className="flex items-center gap-1"><FiDroplet size={11} /> {property.bathrooms} bath</span>
            {property.area && <span>{property.area} sqft</span>}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-violet-400">₹{property.price?.toLocaleString()}</span>
              <span className="text-xs text-[var(--color-muted)]">/mo</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={property.host?.avatar || `https://ui-avatars.com/api/?name=${property.host?.name}&background=7c3aed&color=fff&size=32`}
                alt={property.host?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs text-[var(--color-muted)]">{property.host?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
