import React, { useState } from "react";
import "./cart.css"; 
import Radio from "./Radio";
import Product from "./Product"; 
import book1 from "../../assets/book1.png"; 
import book2 from "../../assets/book2.png";

const Cart = () => {
  const [cart, setCart] = useState([
    { id: 1, name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book1 },
    { id: 2, name: "Arasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book2 },
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

  const total = cart.reduce((sum, item) => sum + item.sale * item.quantity, 0);

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
          <Product 
            key={item.id} 
            item={item} 
            handleQuantityChange={handleQuantityChange} 
            handleRemove={handleRemove} 
          />
        ))}
      </div>
      
      <div className="cart-buy">
        <div className="cart-buy-address">
          <div><strong>Địa chỉ giao hàng:</strong> 143 Phước Thiện, Long Thạnh Mỹ, Quận 9, Thành phố Thủ Đức</div>
          <button>Thay đổi</button>
        </div>
        <div className="cart-buy-method">
          <Radio/>
          <div className="cart-buy-cost">Tổng thanh toán ({cart.length} sản phẩm): {total.toLocaleString()} vnd</div>
        </div>
      </div>
      <div className="cart-payment">
        <button>Thanh toán</button>
      </div>
    </div>
  );
};

export default Cart;
