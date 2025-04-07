import React from "react";
import { useCart } from "./CartContext";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import "./cart.css";
import Product from "./component/Product";  // Import Product component
import Radio from "./component/Radio";  // Import Radio component

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();  // Lấy cart và các hàm từ context

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="fs-2">Giỏ hàng</div>
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
        <div className="cart-info-pay">
          <div className="cart-address">
            <div>Địa chỉ giao hàng: 143 Phước Thiện, Long Thạch Mỹ, Quận 9, Thành phố Thủ Đức</div>
            <button>Thay đổi</button>
          </div>
          <div className="cart-payment">
            <div>Phương thức thanh toán: </div>
            <Radio/>
            <div className="cart-buy-cost">
              Tổng thanh toán: {total.toLocaleString()} VND
            </div>
          </div>
        </div>
        

        <div className="cart-payment-button">
          <button>Thanh toán</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;
