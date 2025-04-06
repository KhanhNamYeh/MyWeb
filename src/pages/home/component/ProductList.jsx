import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";
import { useNavigate } from "react-router-dom";
import { products } from "../../cart/component/product_Data"; // Import dữ liệu sản phẩm
import SearchBar from "./SearchBar";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const lowerSearch = searchTerm.toLowerCase();
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(lowerSearch) ||
    p.author.toLowerCase().includes(lowerSearch) ||
    p.genre.toLowerCase().includes(lowerSearch)
  );

  const genres = [...new Set(filtered.map(p => p.genre))];

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="product-list-wrapper">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {genres.map(genre => (
        <section key={genre} className="genre-section">
          <h2 className="genre-title">{genre}</h2>
          <div className="products-container">
            {filtered
              .filter(p => p.genre === genre)
              .map((product, idx) => (
                <div key={idx} className="product-item">
                  <img
                    src={`/images/${product.image}`}
                    alt={product.title}
                    className="product-image"
                  />

                  <p><strong>Tên:</strong> {product.title}</p>
                  <p><strong>Tác giả:</strong> {product.author}</p>
                  <p><strong>Giá Tiền:</strong> {product.price.toLocaleString()} đ</p>

                  <div className="product-buttons">
                    <button
                      className="buy-now"
                      onClick={() => handleAddToCart(product)}
                    >
                      Mua ngay
                    </button>
                    <button
                      className="add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartIcon style={{ marginRight: 8 }} /> Thêm vào giỏ hàng
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
