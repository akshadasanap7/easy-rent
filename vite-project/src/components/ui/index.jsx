export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  return (
    <div className={`${s} border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export function StarRating({ rating, onRate, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => !readonly && onRate?.(s)}
          className={`text-lg transition-colors ${s <= rating ? 'text-amber-400' : 'text-[var(--color-border)]'} ${!readonly ? 'hover:text-amber-400 cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export function Badge({ children, color = 'violet' }) {
  const colors = {
    violet: 'bg-violet-500/20 text-violet-400',
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    amber: 'bg-amber-500/20 text-amber-400',
    blue: 'bg-blue-500/20 text-blue-400',
  }
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${colors[color] || colors.violet}`}>
      {children}
    </span>
  )
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-muted)] mb-4">{desc}</p>
      {action}
    </div>
  )
}
