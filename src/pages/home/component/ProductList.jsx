import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../cart/component/product_Data";
import SearchBar from "./SearchBar";

const ProductList = () => {
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();

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
    selectedGenre === "All" ? true : p.genre.includes(selectedGenre)
  );

  // Get all unique genres from products
  // Split comma-separated genres and flatten the array
  const extractGenres = (products) => {
    const genreSet = new Set();
    genreSet.add("All");
    
    products.forEach(product => {
      if (product.genre) {
        const genres = product.genre.split(',').map(g => g.trim());
        genres.forEach(g => genreSet.add(g));
      }
    });
    
    return Array.from(genreSet);
  };

  const allGenres = extractGenres(products);

  // Get genres from filtered products for display sections
  const displayGenres = selectedGenre === "All" 
    ? [...new Set(filtered.map(p => {
        const genres = p.genre?.split(',').map(g => g.trim()) || [];
        return genres[0] || "Uncategorized"; // Use first genre for grouping
      }))]
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading products: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

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
        const genreProducts = selectedGenre === "All"
          ? filtered.filter(p => {
              const genres = p.genre?.split(',').map(g => g.trim()) || [];
              return genres[0] === genre || (!genres.length && genre === "Uncategorized");
            })
          : filtered;
          
        if (genreProducts.length === 0) return null;
        
        return (
          <section key={genre} className="genre-section">
            <h2 className="genre-title">{genre}</h2>
            <div className="products-container">
              {genreProducts.map((product) => (
                <div key={product.id} className="product-item">
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
                  {product.sale && (
                    <p><strong>Sale Price:</strong> <span className="sale-price">{product.sale.toLocaleString()} VND</span></p>
                  )}
                  {product.promotion && (
                    <p><strong>Promotion:</strong> {product.promotion}</p>
                  )}

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