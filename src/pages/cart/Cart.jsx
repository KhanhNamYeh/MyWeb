import React from "react";
import { useCart } from "./CartContext";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import "./cart.css";
import Product from "./component/Product";  // Import Product component

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();  // Lấy cart và các hàm từ context

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h2>Giỏ hàng</h2>
        <div className="product-list">
          {cart.length > 0 ? (
            cart.map((item) => (
              <Product
                key={item.id}
                item={item}
                handleQuantityChange={updateQuantity}  // Truyền hàm updateQuantity
                handleRemove={removeFromCart}  // Truyền hàm removeFromCart
              />
            ))
          ) : (
            <p>Giỏ hàng của bạn đang trống!</p>
          )}
        </div>

        <div className="cart-buy-cost">
          Tổng thanh toán: {total.toLocaleString()} VND
        </div>

        <div className="cart-payment">
          <button>Thanh toán</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;
