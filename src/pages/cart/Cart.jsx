import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import "./cart.css";
import Product from "./component/Product";
import Radio from "./component/Radio";
import SuccessModal from './component/SuccessModal';

function Cart() {
  const { cart, updateQuantity, removeFromCart, checkout, isLoggedIn } = useCart();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      navigate('/login', { state: { returnTo: '/cart' } });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await checkout();
      if (success) {
        setIsSuccessModalVisible(true);
      } else {
        setError("Checkout failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during checkout.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalVisible(false);
    // Optionally redirect to homepage or order history
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="fs-2">Shopping Cart</div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
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
          <button 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || isProcessing}
          >
            {isProcessing ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
      <Footer />

      {isSuccessModalVisible && <SuccessModal onClose={handleCloseModal} />}
    </>
  );
}

export default Cart;