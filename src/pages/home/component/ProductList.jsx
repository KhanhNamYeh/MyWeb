import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../cart/component/product_Data";
import SearchBar from "./SearchBar"; // Assuming SearchBar is in the same directory

// Import the CSS file
import './productlist.css';

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
    selectedGenre === "All" ? true : p.genre?.split(',').map(g => g.trim()).includes(selectedGenre)
  );

  // Get all unique genres from products
  const extractGenres = (products) => {
    const genreSet = new Set();
    genreSet.add("All");

    products.forEach(product => {
      if (product.genre) {
        const genres = product.genre.split(',').map(g => g.trim());
        genres.forEach(g => { if (g) genreSet.add(g); }); // Add only non-empty genres
      }
    });

    return Array.from(genreSet).sort(); // Sort genres alphabetically
  };

  const allGenres = extractGenres(products);

  // Get genres from filtered products for display sections
  const displayGenres = selectedGenre === "All"
    ? [...new Set(filtered.map(p => {
        const genres = p.genre?.split(',').map(g => g.trim()) || [];
        return genres[0] || "Uncategorized"; // Use first genre for grouping
      }))].sort() // Sort display genres as well
    : [selectedGenre];

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToCartOnly = (product) => {
    addToCart(product);
    // Optional: Add feedback like a toast notification here
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const navigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="productlist-loading-container"> {/* Updated class */}
        <div className="productlist-spinner"></div> {/* Updated class */}
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productlist-error-container"> {/* Updated class */}
        <p>Error loading products: {error}</p>
        {/* Added class to button */}
        <button className="productlist-try-again" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="productlist-wrapper"> {/* Updated class */}
      <div className="productlist-filter-section"> {/* Updated class */}
        {/* Assuming SearchBar uses productlist-search-* classes internally or pass them as props */}
        <SearchBar onSearchSubmit={handleSearchSubmit} />

        <div className="productlist-genre-filter"> {/* Updated class */}
          <select
            className="productlist-genre-select" /* Updated class */
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

      {filtered.length === 0 && activeSearchTerm && (
         /* Updated class for no results */
        <div className="productlist-no-results">
          No products found matching "{activeSearchTerm}"{selectedGenre !== "All" ? ` in the "${selectedGenre}" category` : ''}.
        </div>
      )}

      {displayGenres.map(genre => {
        const genreProducts = selectedGenre === "All"
          ? filtered.filter(p => {
              const genres = p.genre?.split(',').map(g => g.trim()) || [];
              // Match if the first genre is the current group genre, or if product has no genre and group is "Uncategorized"
              return (genres.length > 0 && genres[0] === genre) || (genres.length === 0 && genre === "Uncategorized");
            })
          : filtered; // If a specific genre is selected, all 'filtered' products belong to it

        if (genreProducts.length === 0) return null;

        return (
          <section key={genre} className="productlist-genre-section"> {/* Updated class */}
            <h2 className="productlist-genre-title">{genre}</h2> {/* Updated class */}
            <div className="productlist-products-container"> {/* Updated class */}
              {genreProducts.map((product) => (
                <div key={product.id} className="productlist-product-item"> {/* Updated class */}

                  {/* Image Container - Made clickable */}
                  <div
                    className="productlist-image-container" /* Added class */
                    onClick={() => navigateToProduct(product.id)}
                  >
                    <img
                      src={`/images/${product.image}`} // Ensure this path is correct
                      alt={product.title}
                      className="productlist-product-image" /* Updated class */
                      loading="lazy" // Added lazy loading for images
                    />
                    {/* Example Badges - Add logic based on product properties */}
                    {/* {product.isNew && <span className="productlist-badge productlist-badge-new">New</span>} */}
                    {/* {product.isBestseller && <span className="productlist-badge productlist-badge-bestseller">Bestseller</span>} */}
                  </div>

                  {/* Product Details Wrapper */}
                  <div className="productlist-product-details"> {/* Added class */}
                    {/* Title - Made clickable */}
                    <h3
                      className="productlist-product-title" /* Updated class and tag */
                      onClick={() => navigateToProduct(product.id)}
                      title={product.title} // Add title attribute for tooltip on hover
                    >
                       {product.title}
                    </h3>
                    <p className="productlist-product-author">{product.author}</p> {/* Updated class */}

                    {/* Price Logic */}
                    <div>
                      {product.sale ? (
                        <p className="productlist-product-price">
                          <span className="productlist-sale-price">{product.sale.toLocaleString()} VND</span>
                          <span className="productlist-regular-price">{product.price.toLocaleString()} VND</span>
                        </p>
                      ) : (
                        <p className="productlist-product-price">{product.price.toLocaleString()} VND</p>
                      )}
                    </div>

                    {product.promotion && (
                      <span className="productlist-promotion">{product.promotion}</span> /* Updated class and tag */
                    )}

                    {/* Buttons Container */}
                    <div className="productlist-product-buttons"> {/* Updated class */}
                      <button className="productlist-buy-now" onClick={() => handleBuyNow(product)}> {/* Updated class */}
                        Buy Now
                      </button>
                      <button
                        className="productlist-add-to-cart" /* Updated class */
                        onClick={() => handleAddToCartOnly(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div> {/* End product-details */}
                </div> // End product-item
              ))}
            </div> {/* End products-container */}
          </section> // End genre-section
        );
      })}
    </div> // End product-list-wrapper
  );
};

export default ProductList;