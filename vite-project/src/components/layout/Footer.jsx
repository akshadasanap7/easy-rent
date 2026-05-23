import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 font-extrabold text-xl mb-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm">ER</span>
            <span className="gradient-text">EasyRent</span>
          </div>
          <p className="text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">
            Find your perfect rental home. Browse thousands of verified properties across India.
          </p>
          <div className="flex gap-3 mt-4">
            {[FiGithub, FiTwitter, FiInstagram].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 glass rounded-xl flex items-center justify-center text-[var(--color-muted)] hover:text-violet-400 transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          {['Browse Properties', 'Add Listing', 'How it Works', 'Pricing'].map((t) => (
            <Link key={t} to="/properties" className="block text-sm text-[var(--color-muted)] hover:text-violet-400 mb-2 transition-colors">{t}</Link>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          {['About Us', 'Blog', 'Careers', 'Contact'].map((t) => (
            <a key={t} href="#" className="block text-sm text-[var(--color-muted)] hover:text-violet-400 mb-2 transition-colors">{t}</a>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-muted)]">
        © {new Date().getFullYear()} EasyRent. Built with ❤️ for renters everywhere.
      </div>
    </footer>
  )
}
