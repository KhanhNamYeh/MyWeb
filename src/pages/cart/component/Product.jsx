import React from "react";

const Product = ({ item, handleQuantityChange, handleRemove }) => {
  return (
    <div className="product-item">
      <img
        src={`${import.meta.env.BASE_URL}images/${item.image}`}  // Sử dụng BASE_URL của Vite
        alt={item.title}
        className="product-image"
      />
      <div className="product-details">
        <p><strong>{item.title}</strong></p>
        <p>Tác giả: {item.author}</p>
        <p>Giá: {item.price.toLocaleString()} VND</p>
        <p>Số lượng: 
          <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
          {item.quantity}
          <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
        </p>
        <button onClick={() => handleRemove(item.id)}>Xóa</button>
      </div>
    </div>
  );
};

export default Product;
