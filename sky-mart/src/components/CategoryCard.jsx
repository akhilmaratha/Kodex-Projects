export function CategoryCard({ label, count, icon: Icon }) {
  return (
    <article className="category-card panel">
      <span className="category-icon">
        <Icon size={18} />
      </span>
      <strong>{label}</strong>
      <small>{count}</small>
    </article>
  )
}