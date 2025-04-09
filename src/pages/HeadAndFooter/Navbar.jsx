import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Notifications, AccountCircle } from "@mui/icons-material";
import { ExitToApp } from "@mui/icons-material";
import "../home/home.css";
import { useCart } from "../cart/CartContext"; 

const Navbar = () => {
  const { cart } = useCart(); 
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Khi đăng nhập hoặc đăng ký, người dùng sẽ được điều hướng đến /home */}
      <Link to="/home" className="logo-link">
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
          {/* Nút Logout theo style nhỏ gọn như các link khác */}
          <button onClick={handleLogout} className="logout-btn">
            <ExitToApp fontSize="inherit" />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
