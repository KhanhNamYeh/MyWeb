import React from "react";

const Product = ({ item, handleQuantityChange, handleRemove }) => {
  return (
    <div className="product">
      <div className="product-details">
        <img src={item.image} alt={item.name} />
        <div className="product-info">
          <a>{item.name}</a>
          <a>{item.author}</a>
          <s>{item.price} vnd</s>
          <a><strong>{item.sale} vnd</strong></a>
        </div>
      </div>
      <div className="quantity-control">
        <button className="button" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
        <span style={{ margin: "0 10px" }}>{item.quantity}</span>
        <button className="button" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
      </div>
      <span className="product-cost">{(item.sale * item.quantity).toLocaleString()} vnd</span>
      <button className="button del" onClick={() => handleRemove(item.id)}>Xóa</button>
    </div>
  );
};

export default Product;
