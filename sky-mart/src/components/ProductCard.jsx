import { Plus } from 'lucide-react'

export function ProductCard({ name, title, price, category, image, rating, reviews, onAdd }) {
  const displayName = title || name
  const displayRating = rating?.rate ?? rating ?? null
  const displayReviews = rating?.count ?? reviews ?? null

  return (
    <article className="product-card">
      <div className="product-thumb" aria-hidden="true">
        {image ? <img src={image} alt="" /> : <span>{displayName.slice(0, 1)}</span>}
      </div>
      <div className="product-meta">
        <small>{category}</small>
        <strong>{displayName}</strong>
        {displayRating ? (
          <small>
            {displayRating}★ {displayReviews ? `(${displayReviews})` : ''}
          </small>
        ) : null}
      </div>
      <span className="product-tag">${Number(price).toFixed(2)}</span>
      <button
        className="icon-button subtle"
        type="button"
        aria-label={`Add ${displayName}`}
        onClick={onAdd}
      >
        <Plus size={15} />
      </button>
    </article>
  )
}