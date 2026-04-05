export function StatCard({ icon: Icon, value, label, hint }) {
  return (
    <article className="stat-card panel">
      <span className="stat-icon">
        <Icon size={16} />
      </span>
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{hint}</small>
    </article>
  )
}