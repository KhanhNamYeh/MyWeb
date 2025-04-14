import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";
import { products } from "../../cart/component/product_Data";
import SearchBar from "./SearchBar";

const ProductList = () => {
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (submittedTerm) => {
    setActiveSearchTerm(submittedTerm);
  };

  const lowerSearch = activeSearchTerm.toLowerCase();
  const filtered = products.filter(p =>
    activeSearchTerm === "" ? true :
    p.title.toLowerCase().includes(lowerSearch) ||
    p.author.toLowerCase().includes(lowerSearch) ||
    p.genre.toLowerCase().includes(lowerSearch)
  );

  const genres = [...new Set(filtered.map(p => p.genre))];

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToCartOnly = (product) => {
    addToCart(product);
  };

  return (
    <div className="product-list-wrapper">
      <SearchBar onSearchSubmit={handleSearchSubmit} />

      {filtered.length === 0 && activeSearchTerm !== "" && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          No products found matching "{activeSearchTerm}".
        </p>
      )}

      {genres.map(genre => (
        <section key={genre} className="genre-section">
          <h2 className="genre-title">{genre}</h2>
          <div className="products-container">
            {filtered
              .filter(p => p.genre === genre)
              .map((product, idx) => (
                <div key={idx} className="product-item">
                  <div
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={`/images/${product.image}`}
                      alt={product.title}
                      className="product-image"
                    />
                    <p><strong>Title:</strong> {product.title}</p>
                  </div>

                  <p><strong>Author:</strong> {product.author}</p>
                  <p><strong>Price:</strong> {product.price.toLocaleString()} VND</p>

                  <div className="product-buttons">
                    <button className="buy-now" onClick={() => handleBuyNow(product)}>
                      Buy Now
                    </button>
                    <button
                      className="add-to-cart"
                      onClick={() => handleAddToCartOnly(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductList;