import React from "react";
import "./product.css"; 

const Product = ({ item, handleQuantityChange, handleRemove }) => {
  return (
    <div className="cart-product-item">
      <img
        src={`${import.meta.env.BASE_URL}images/${item.image}`}  
        alt={item.title}
        className="cart-product-image"
      />
      <div className="cart-product-details">
        <div className="cart-product-info">
          <p className="cart-product-title">{item.title}</p>
          <p className="cart-product-author">{item.author}</p>
        </div>
        <div className="cart-product-subtotal">
          <span>{item.price.toLocaleString()} vnd</span>
        </div>
        <div className="cart-product-quantity-selector">
          <button onClick={() => handleQuantityChange(item.id, -1)} aria-label="Giảm số lượng">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => handleQuantityChange(item.id, 1)} aria-label="Tăng số lượng">+</button>
        </div>
        <button className="cart-product-actions" onClick={() => handleRemove(item.id)}>Xóa</button>
      </div>
    </div>
  );
};

export default Product;
