import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "./../cart/component/product_Data";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import { useCart } from "../cart/CartContext";
import "./productDetail.css";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';



const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate("/cart");
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="home-container">
      <Navbar />

      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-left">
            <img
              src={`/images/${product.image}`}
              alt={product.title}
              className="product-detail-image"
            />
          </div>
          <div className="product-detail-right">
            <h2 className="product-title">{product.title}</h2>
            <p><strong>Author:</strong> {product.author}</p>
            <p><strong>Genre:</strong> {product.genre}</p>
            <p><strong>Price:</strong> {product.price.toLocaleString()} VND</p>
            <p><strong>Description:</strong> This book is very engaging and interesting...</p>

            <div className="quantity-control">
              <button onClick={handleDecrease}><RemoveIcon /></button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}><AddIcon /></button>
            </div>

            <div className="product-detail-buttons">
              <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
              <button className="add-to-cart" onClick={handleAddToCart}>
                <ShoppingCartIcon style={{ fontSize: 18 }} /> Add to Cart
              </button>
            </div>

            {added && (
              <div className="success-message">
                <CheckCircleIcon style={{ color: 'green' }} />
                Added to cart successfully!
              </div>
            )}
          </div>
        </div>

        <div className="product-summary">
          <h3>Content Summary</h3>
          <p>
            The book tells the inspiring journey of the main character, overcoming difficulties and challenges to achieve their dreams. The work brings many profound and valuable lessons about life.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;