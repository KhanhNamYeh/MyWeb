import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, User, Wishlist, Cart, Notification, AdminPage } from "./pages";
import { CartProvider } from "./pages/cart/CartContext";
import ProductDetail  from "./pages/product_detail/ProductDetail";

import Login from "./pages/LoginAndResgister/Login";
import Register from "./pages/LoginAndResgister/Register";
function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/user" element={<User />} />
          
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes> 
      </Router>
    </CartProvider>
  );
}

export default App;
