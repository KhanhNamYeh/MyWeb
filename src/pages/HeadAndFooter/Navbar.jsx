import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Notifications, ExitToApp, AccountCircle, Login } from "@mui/icons-material";
import "../home/home.css";
import { useCart } from "../cart/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [hoveredItemKey, setHoveredItemKey] = useState(null);

  // Check login status when component mounts
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.login) {
      setIsLoggedIn(true);
      setUsername(userInfo.name || userInfo.login);
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  // Handler for protected routes
  const handleProtectedRoute = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { key: 'notifications', Icon: Notifications, label: 'Notifications', url: '/notification' },
    { key: 'account', Icon: AccountCircle, label: 'Account', url: '/user' },
  ];

  const renderNavItem = (item) => {
    const isHovered = hoveredItemKey === item.key;
    return (
      <li
        key={item.key}
        className={`nav-item-wrapper ${isHovered ? 'nav-item-wrapper-hovered' : ''}`}
        onMouseEnter={() => setHoveredItemKey(item.key)}
        onMouseLeave={() => setHoveredItemKey(null)}
      >
        <a 
          href="#" 
          onClick={(e) => handleProtectedRoute(e, item.url)} 
          className="nav-item-link"
        >
          <item.Icon />
          <span className="nav-item-text">{item.label}</span>
        </a>
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
        {/* User greeting displays first when logged in */}
        {isLoggedIn && (
          <li className="nav-item-wrapper user-greeting">
            <span className="nav-item-text">Hi {username}</span>
          </li>
        )}
        
        {/* Display navigation items */}
        {navItems.map(item => renderNavItem(item))}
        
        {/* Cart item */}
        <li
          key="cart"
          className={`nav-item-wrapper cart-item-wrapper ${hoveredItemKey === 'cart' ? 'nav-item-wrapper-hovered' : ''}`}
          onMouseEnter={() => setHoveredItemKey('cart')}
          onMouseLeave={() => setHoveredItemKey(null)}
        >
          <a 
            href="#" 
            onClick={(e) => handleProtectedRoute(e, '/cart')} 
            className="cart-link"
          >
            <div style={{ position: "relative" }}>
              <ShoppingCart />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </div>
            <span className="nav-item-text">Cart</span>
          </a>
        </li>
        
        {/* Login/Logout button */}
        {isLoggedIn ? (
          <li
            key="logout"
            className={`nav-item-wrapper ${hoveredItemKey === 'logout' ? 'nav-item-wrapper-hovered' : ''}`}
            onMouseEnter={() => setHoveredItemKey('logout')}
            onMouseLeave={() => setHoveredItemKey(null)}
          >
            <button onClick={handleLogout} className="nav-item-link logout-button">
              <ExitToApp />
              <span className="nav-item-text">Logout</span>
            </button>
          </li>
        ) : (
          <li
            key="login"
            className={`nav-item-wrapper ${hoveredItemKey === 'login' ? 'nav-item-wrapper-hovered' : ''}`}
            onMouseEnter={() => setHoveredItemKey('login')}
            onMouseLeave={() => setHoveredItemKey(null)}
          >
            <Link to="/login" className="nav-item-link">
              <Login />
              <span className="nav-item-text">Login</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;