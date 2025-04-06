// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, User, Wishlist, Cart, Notification } from "./pages";
import { CartProvider } from "./pages/cart/CartContext"; // Đảm bảo import đúng đường dẫn

function App() {
  return (
    <CartProvider>  {/* Bọc toàn bộ Routes trong CartProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
