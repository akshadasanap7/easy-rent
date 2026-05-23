import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProperty } from '../api/properties'
import toast from 'react-hot-toast'
import { FiUpload, FiX, FiPlus } from 'react-icons/fi'

const AMENITIES = ['WiFi', 'Parking', 'Gym', 'Pool', 'AC', 'Furnished', 'Security', 'Garden', 'Lift', 'Power']
const TYPES = ['apartment', 'house', 'villa', 'studio', 'condo']

export default function AddProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', type: 'apartment', price: '',
    bedrooms: 1, bathrooms: 1, area: '',
    address: '', city: '', state: '',
  })

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages((prev) => [...prev, ...files].slice(0, 6))
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews((prev) => [...prev, ...urls].slice(0, 6))
  }

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const toggleAmenity = (a) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.city) return toast.error('Fill all required fields')
    setLoading(true)
    try {
      const fd = new FormData()
      images.forEach((img) => fd.append('images', img))
      fd.append('data', JSON.stringify({
        title: form.title,
        description: form.description,
        type: form.type,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: form.area ? Number(form.area) : undefined,
        amenities: selectedAmenities.map((a) => a.toLowerCase()),
        location: { address: form.address, city: form.city, state: form.state },
      }))
      const res = await createProperty(fd)
      toast.success('Property listed successfully! 🎉')
      navigate(`/properties/${res.data._id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">List Your <span className="gradient-text">Property</span></h1>
        <p className="text-sm text-[var(--color-muted)]">Fill in the details to create your listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Property Images</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <FiX size={10} />
                </button>
              </div>
            ))}
            {previews.length < 6 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors">
                <FiUpload size={18} className="text-[var(--color-muted)] mb-1" />
                <span className="text-xs text-[var(--color-muted)]">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-[var(--color-muted)]">Upload up to 6 images (max 5MB each)</p>
        </div>

        {/* Basic Info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-1 block">Title *</label>
            <input type="text" placeholder="e.g. Modern 2BHK in Bandra West" value={form.title} onChange={(e) => set('title', e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-1 block">Description *</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe your property..." rows={4} className="input-field resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Type *</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className="input-field">
                {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Monthly Rent (₹) *</label>
              <input type="number" placeholder="25000" value={form.price} onChange={(e) => set('price', e.target.value)} className="input-field" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Bedrooms</label>
              <input type="number" min={1} max={10} value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Bathrooms</label>
              <input type="number" min={1} max={10} value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">Area (sqft)</label>
              <input type="number" placeholder="1200" value={form.area} onChange={(e) => set('area', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Location</h2>
          <div>
            <label className="text-xs text-[var(--color-muted)] mb-1 block">Address</label>
            <input type="text" placeholder="Street address" value={form.address} onChange={(e) => set('address', e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">City *</label>
              <input type="text" placeholder="Mumbai" value={form.city} onChange={(e) => set('city', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] mb-1 block">State</label>
              <input type="text" placeholder="Maharashtra" value={form.state} onChange={(e) => set('state', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${selectedAmenities.includes(a) ? 'border-violet-500 bg-violet-500/20 text-violet-400' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-violet-500/50'}`}
              >
                {AMENITIES.find((x) => x === a) && `${a}`}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
          {loading ? 'Publishing...' : 'Publish Listing'}
        </button>
      </form>
    </div>
  )
}
