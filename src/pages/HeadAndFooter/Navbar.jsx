import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Notifications, Favorite, AccountCircle } from "@mui/icons-material";
import "../home/home.css";
import { useCart } from "../cart/CartContext"; // ✅ Import hook useCart

const Navbar = () => {
  const { cart } = useCart(); 

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <h1 className="logo">ReadGO</h1>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/notification">
            <Notifications /> Thông báo
          </Link>
        </li>
        <li>
          <Link to="/user">
            <AccountCircle /> Tài khoản
          </Link>
        </li>
        <li>
          <Link
            to="/cart"
            className="cart-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px", 
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              <ShoppingCart />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </div>
            <span>Giỏ hàng</span> 
          </Link>
        </li>


        <li>
          <Link to="/wishlist">
            <Favorite /> Yêu thích
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
