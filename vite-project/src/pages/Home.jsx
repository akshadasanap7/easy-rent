import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiShield, FiZap, FiStar } from 'react-icons/fi'
import { getProperties } from '../api/properties'
import PropertyCard from '../components/ui/PropertyCard'
import { PageLoader } from '../components/ui/index.jsx'

const STATS = [
  { value: '10K+', label: 'Properties Listed' },
  { value: '50K+', label: 'Happy Tenants' },
  { value: '200+', label: 'Cities Covered' },
  { value: '4.9★', label: 'Average Rating' },
]

const FEATURES = [
  { icon: <FiShield size={22} />, title: 'Verified Listings', desc: 'Every property is manually verified by our team before going live.' },
  { icon: <FiZap size={22} />, title: 'Instant Booking', desc: 'Book your dream home in minutes with our seamless booking flow.' },
  { icon: <FiStar size={22} />, title: 'Trusted Reviews', desc: 'Real reviews from real tenants to help you make the right choice.' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getProperties({ limit: 6 })
      .then((r) => setFeatured(r.data.properties))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/properties?search=${search}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-[var(--color-surface)] to-indigo-950/30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            India's #1 Rental Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Find Your{' '}
            <span className="gradient-text">Perfect</span>
            <br />Rental Home
          </h1>

          <p className="text-lg text-[var(--color-muted)] max-w-xl mx-auto mb-10">
            Browse thousands of verified apartments, houses, and villas. No brokerage. No hassle.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="glass rounded-2xl p-2 flex gap-2 max-w-xl mx-auto mb-12">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={18} />
              <input
                type="text"
                placeholder="Search city, area, or property type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 bg-transparent border-none focus:ring-0"
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              Search <FiArrowRight size={16} />
            </button>
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad'].map((city) => (
              <Link
                key={city}
                to={`/properties?city=${city}`}
                className="glass px-4 py-1.5 rounded-full text-sm text-[var(--color-muted)] hover:text-violet-400 hover:border-violet-500 transition-all"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--color-muted)]">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-5 h-8 border border-[var(--color-border)] rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-violet-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-extrabold gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-[var(--color-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Featured <span className="gradient-text">Properties</span></h2>
            <p className="text-sm text-[var(--color-muted)]">Hand-picked listings just for you</p>
          </div>
          <Link to="/properties" className="btn-ghost flex items-center gap-2">
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <PageLoader />
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-muted)]">
            <p className="text-4xl mb-3">🏠</p>
            <p>No properties yet. Be the first to list!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Why <span className="gradient-text">EasyRent?</span></h2>
          <p className="text-[var(--color-muted)]">Everything you need to find your next home</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="relative glass rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3">Ready to list your property?</h2>
            <p className="text-[var(--color-muted)] mb-6">Join thousands of hosts earning with EasyRent</p>
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Become a Host <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
