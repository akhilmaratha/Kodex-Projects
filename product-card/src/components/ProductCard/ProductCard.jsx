import "./ProductCard.css";

function ProductCard({ product }) {
    function addToCart(id) {
        alert(`Product ${id} Added`)
    }
    return (
        <div className="card">

            <img src={product.image} alt={product.name} />

            <h2>{product.name}</h2>

            <p className="category">{product.category}</p>

            <p className="price">{product.price}</p>

            <button onClick={() => addToCart(product.id)}>Add To Cart</button>
        </div>
    );
}

export default ProductCard;