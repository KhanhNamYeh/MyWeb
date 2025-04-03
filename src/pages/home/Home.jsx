import React from "react";
import { Link } from "react-router-dom"; // Import Link để điều hướng
import "./home.css";

const Home = () => (
  <div>
    <h1>Trang Chủ</h1>
    <nav>
      <ul>
        <li><Link to="/login">Đăng nhập</Link></li>
        <li><Link to="/cart">Giỏ hàng</Link></li>
        <li><Link to="/notification">Thông báo</Link></li>
        <li><Link to="/wishlist">Danh sách yêu thích</Link></li>
        <li><Link to="/user">Tài khoản</Link></li>
      </ul>
    </nav>
  </div>
);

export default Home;
