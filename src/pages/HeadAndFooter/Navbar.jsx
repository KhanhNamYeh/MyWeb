import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Notifications, Favorite, AccountCircle } from "@mui/icons-material";
import "../home/home.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <h1 className="logo">ReadGO</h1>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/notifications">
            <Notifications /> Thông báo
          </Link>
        </li>
        <li>
          <Link to="/user">
            <AccountCircle /> Tài khoản
          </Link>
        </li>
        <li>
          <Link to="/cart">
            <ShoppingCart /> Giỏ hàng
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
