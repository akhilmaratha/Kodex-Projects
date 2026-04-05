import { Zap } from 'lucide-react'

export function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark">
        <Zap size={18} strokeWidth={2.5} />
      </span>
      <span className="brand-name">
        Sky<span>Mart</span>
      </span>
    </div>
  )
}