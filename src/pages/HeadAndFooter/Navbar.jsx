import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Notifications, ExitToApp, AccountCircle } from "@mui/icons-material";
import "../home/home.css";
import { useCart } from "../cart/CartContext";

const navItemsBeforeCart = [
  { key: 'notifications', Icon: Notifications, label: 'Notifications', url: '/notification' },
  { key: 'account', Icon: AccountCircle, label: 'Account', url: '/user' },
];

const navItemsAfterCart = [
  { key: 'login', Icon: ExitToApp, label: 'Logout', url: '/login' },
];
// ------------------------------------------------------------

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };
  const [hoveredItemKey, setHoveredItemKey] = useState(null);

  const renderNavItem = (item) => {
    const isHovered = hoveredItemKey === item.key;
    return (
      <li
        key={item.key}
        className={`nav-item-wrapper ${isHovered ? 'nav-item-wrapper-hovered' : ''}`}
        onMouseEnter={() => setHoveredItemKey(item.key)}
        onMouseLeave={() => setHoveredItemKey(null)}
      >
        <Link to={item.url} className="nav-item-link">
          <item.Icon />
          <span className="nav-item-text">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="animated-logo-button" data-text="ReadGO">
        <span className="actual-text">&nbsp;ReadGO&nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;ReadGO&nbsp;</span>
      </Link>

      <ul className="nav-links">
        {navItemsBeforeCart.map(item => renderNavItem(item))}
        <li
          key="cart"
          className={`nav-item-wrapper cart-item-wrapper ${hoveredItemKey === 'cart' ? 'nav-item-wrapper-hovered' : ''}`}
          onMouseEnter={() => setHoveredItemKey('cart')}
          onMouseLeave={() => setHoveredItemKey(null)}
        >
          <Link to="/cart" className="cart-link">
            <div style={{ position: "relative" }}>
              <ShoppingCart />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </div>
            <span className="nav-item-text">Cart</span>
          </Link>
        </li>
        {navItemsAfterCart.map(item => renderNavItem(item))}
      </ul>
    </nav>
  );
};

export default Navbar;