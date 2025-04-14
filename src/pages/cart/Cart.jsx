import React, { useState } from "react";
import { useCart } from "./CartContext";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import "./cart.css";
import Product from "./component/Product";
import Radio from "./component/Radio";
import SuccessModal from './component/SuccessModal';

function Cart() {
  const { cart, updateQuantity, removeFromCart /*, clearCart */ } = useCart();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsSuccessModalVisible(true);
    // clearCart();
  };

  const handleCloseModal = () => {
    setIsSuccessModalVisible(false);
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="fs-2">Shopping Cart</div>
        <div className="product-list">
          {cart.length > 0 ? (
            cart.map((item) => (
              <Product
                key={item.id}
                item={item}
                handleQuantityChange={updateQuantity}
                handleRemove={removeFromCart}
              />
            ))
          ) : (
            <p>Your cart is empty!</p>
          )}
        </div>

        {cart.length > 0 && (
           <div className="cart-info-pay">
              <div className="cart-address">
                <div>Shipping Address: 143 Phuoc Thien, Long Thanh My, District 9, Thu Duc City</div>
                <button>Change</button>
              </div>
              <div className="cart-payment">
                <div>Payment Method: </div>
                <Radio />
                <div className="cart-buy-cost">
                  Total Payment: {total.toLocaleString()} VND
                </div>
              </div>
            </div>
        )}

        <div className="cart-payment-button">
          <button onClick={handleCheckout} disabled={cart.length === 0}>
            Checkout
          </button>
        </div>
      </div>
      <Footer />

      {isSuccessModalVisible && <SuccessModal onClose={handleCloseModal} />}
    </>
  );
}

export default Cart;