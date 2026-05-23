import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProperties } from '../api/properties'
import PropertyCard from '../components/ui/PropertyCard'
import SearchFilter from '../components/ui/SearchFilter'
import { PageLoader, EmptyState } from '../components/ui/index.jsx'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 })
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    page: Number(searchParams.get('page')) || 1,
  })

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
      const res = await getProperties({ ...params, limit: 9 })
      setProperties(res.data.properties)
      setMeta({ total: res.data.total, pages: res.data.pages, page: res.data.page })
    } catch {
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProperties()
    // sync to URL
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params, { replace: true })
  }, [filters, fetchProperties, setSearchParams])

  const handleFilterChange = (newFilters) => setFilters(newFilters)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">
          Browse <span className="gradient-text">Properties</span>
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          {meta.total} properties found
        </p>
      </div>

      <SearchFilter filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <PageLoader />
      ) : properties.length === 0 ? (
        <EmptyState
          icon="🏠"
          title="No properties found"
          desc="Try adjusting your filters or search terms"
          action={
            <button onClick={() => setFilters({ search: '', city: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', page: 1 })} className="btn-primary">
              Clear Filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>

          {/* Pagination */}
          {meta.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                disabled={meta.page === 1}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <FiChevronLeft size={18} />
              </button>
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters((f) => ({ ...f, page: p }))}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${meta.page === p ? 'bg-violet-600 text-white' : 'btn-ghost'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                disabled={meta.page === meta.pages}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
