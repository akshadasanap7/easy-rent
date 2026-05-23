import { useState, useEffect } from 'react'
import { getSaved } from '../api/auth'
import PropertyCard from '../components/ui/PropertyCard'
import { PageLoader, EmptyState } from '../components/ui/index.jsx'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Saved() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSaved()
      .then((r) => setProperties(r.data))
      .catch(() => toast.error('Failed to load saved properties'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <h1 className="text-3xl font-bold mb-8">Saved <span className="gradient-text">Properties</span></h1>

      {properties.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="No saved properties"
          desc="Heart properties you like to save them here"
          action={<Link to="/properties" className="btn-primary">Browse Properties</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
        </div>
      )}
    </div>
  )
}
