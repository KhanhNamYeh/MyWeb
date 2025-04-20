import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";
import { products } from "../../cart/component/product_Data";
import SearchBar from "./SearchBar";

const ProductList = () => {
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (submittedTerm) => {
    setActiveSearchTerm(submittedTerm);
  };

  const lowerSearch = activeSearchTerm.toLowerCase();
  
  // Filter products based on search term
  const searchFiltered = products.filter(p =>
    activeSearchTerm === "" ? true :
    p.title.toLowerCase().includes(lowerSearch) ||
    p.author.toLowerCase().includes(lowerSearch) ||
    p.genre.toLowerCase().includes(lowerSearch)
  );
  
  // Further filter by selected genre
  const filtered = searchFiltered.filter(p => 
    selectedGenre === "All" ? true : p.genre === selectedGenre
  );

  // Get all unique genres from products
  const allGenres = ["All", ...new Set(products.map(p => p.genre))];

  // Get genres from filtered products for display sections
  const displayGenres = selectedGenre === "All" 
    ? [...new Set(filtered.map(p => p.genre))]
    : [selectedGenre];

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToCartOnly = (product) => {
    addToCart(product);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div className="product-list-wrapper">
      <div className="product-filter-section">
        <SearchBar onSearchSubmit={handleSearchSubmit} />
        
        <div className="genre-filter">
          <select 
            className="genre-select" 
            value={selectedGenre} 
            onChange={handleGenreChange}
          >
            {allGenres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          No products found matching "{activeSearchTerm}" in {selectedGenre === "All" ? "any category" : `the "${selectedGenre}" category`}.
        </p>
      )}

      {displayGenres.map(genre => {
        const genreProducts = filtered.filter(p => p.genre === genre);
        if (genreProducts.length === 0) return null;
        
        return (
          <section key={genre} className="genre-section">
            <h2 className="genre-title">{genre}</h2>
            <div className="products-container">
              {genreProducts.map((product, idx) => (
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
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductList;