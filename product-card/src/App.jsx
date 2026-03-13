import ProductCard from "./components/ProductCard/ProductCard";
import "./index.css";

function App() {

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "₹1999",
      category: "Electronics",
      image: "https://avstore.in/cdn/shop/files/1.AVStore-Sonos-Ace-Front-Angled-View-Hero-Black.jpg?v=1725620870"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "₹2999",
      category: "Gadgets",
      image: "https://ddfndelma2gpn.cloudfront.net/color/1591/oraimo_watch_5_black_1.webp"
    },
    {
      id: 3,
      name: "Running Shoes",
      price: "₹2499",
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    }
  ];

  return (
    <div className="app">

      <h1>Our Products</h1>

      <div className="products-container">

        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

      </div>

    </div>
  );
}

export default App;