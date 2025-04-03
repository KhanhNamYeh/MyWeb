import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, User, Wishlist, Cart, Notification } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
