import React, { useState } from "react";
import "./cart.css"; 
import book1 from "../../assets/book1.png"; 

const Cart = () => {
  const [cart, setCart] = useState([
    { id: 1, name: "Erasure", author: "by Percival Everett", price: 233000, quantity: 1, image: book1 },
    { id: 2, name: "Erasure", author: "by Percival Everett", price: 233000, quantity: 1, image: book1 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleQuantityChange = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Giỏ hàng</h2>
      <div className="cart-header">
        <span className="header-title a">Sản phẩm</span>
        <span className="header-title b">Số lượng</span>
        <span className="header-title c">Số tiền</span>
        <span className="header-title d">Thao tác</span>
      </div>

      <div className="product-list">
        {cart.map((item) => (
          <div key={item.id} className="product">
            <div className="product-details">
              <img src={item.image} alt={item.name} />
              <div className="product-info">
                <a>Erasure</a>
                <a>by Percival Everett</a>
                <s>493.000 vnd</s>
                <a>233.000 vnd</a>
              </div>
            </div>
            <div className="quantity-control">
              <button className="button" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
              <span style={{ margin: "0 10px" }}>{item.quantity}</span>
              <button className="button" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
            </div>
            <span className="product-cost">{(item.price * item.quantity).toLocaleString()} vnd</span>
            <button className="button del" onClick={() => handleRemove(item.id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Cart;
