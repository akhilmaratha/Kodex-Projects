import { ShoppingCart } from 'lucide-react'

export function ShopProductCard({ title, name, price, category, image, rating, reviews, onAdd }) {
  const displayName = title || name
  const displayRating = rating?.rate ?? rating ?? 0
  const displayReviews = rating?.count ?? reviews ?? 0

  return (
    <article className="shop-product-card panel">
      <div className="shop-badge">{category}</div>
      <div className="shop-image-wrap">
        <img src={image} alt={displayName} className="shop-image" loading="lazy" />
      </div>
      <div className="shop-product-body">
        <div>
          <p className="shop-product-category">{category}</p>
          <h3>{displayName}</h3>
        </div>
        <div className="shop-rating">
          <span className="shop-stars">{displayRating.toFixed(1)}★</span>
          <small>({displayReviews})</small>
        </div>
        <div className="shop-card-footer">
          <strong>${Number(price).toFixed(2)}</strong>
          <button className="shop-add-button" type="button" onClick={onAdd}>
            <ShoppingCart size={15} /> Add
          </button>
        </div>
      </div>
    </article>
  )
}