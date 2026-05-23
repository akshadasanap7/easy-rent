import { useState } from 'react'
import { FiSearch, FiSliders, FiX } from 'react-icons/fi'

const TYPES = ['apartment', 'house', 'villa', 'studio', 'condo']
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Jaipur']

export default function SearchFilter({ filters, onChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 })

  const clearAll = () => onChange({ search: '', city: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', page: 1 })

  const hasFilters = filters.city || filters.type || filters.minPrice || filters.maxPrice || filters.bedrooms

  return (
    <div className="glass rounded-2xl p-4 mb-8">
      {/* Search bar */}
      <div className="flex gap-3 mb-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
          <input
            type="text"
            placeholder="Search by city, title, or keyword..."
            value={filters.search || ''}
            onChange={(e) => set('search', e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`btn-ghost flex items-center gap-2 ${showAdvanced ? 'border-violet-500 text-violet-400' : ''}`}
        >
          <FiSliders size={15} /> Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-violet-500" />}
        </button>
        {hasFilters && (
          <button onClick={clearAll} className="btn-ghost flex items-center gap-1 text-red-400 border-red-500/30">
            <FiX size={14} /> Clear
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-[var(--color-border)]">
          <select value={filters.city || ''} onChange={(e) => set('city', e.target.value)} className="input-field">
            <option value="">All Cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={filters.type || ''} onChange={(e) => set('type', e.target.value)} className="input-field">
            <option value="">All Types</option>
            {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>

          <select value={filters.bedrooms || ''} onChange={(e) => set('bedrooms', e.target.value)} className="input-field">
            <option value="">Any Beds</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} Bed{n > 1 ? 's' : ''}</option>)}
          </select>

          <input
            type="number"
            placeholder="Min Price (₹)"
            value={filters.minPrice || ''}
            onChange={(e) => set('minPrice', e.target.value)}
            className="input-field"
          />

          <input
            type="number"
            placeholder="Max Price (₹)"
            value={filters.maxPrice || ''}
            onChange={(e) => set('maxPrice', e.target.value)}
            className="input-field"
          />
        </div>
      )}
    </div>
  )
}
