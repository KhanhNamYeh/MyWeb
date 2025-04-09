// src/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css"; // File CSS chứa style

const Login = () => {
  // State cho email/điện thoại và mật khẩu
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Sử dụng useNavigate để chuyển hướng
  const navigate = useNavigate();

  // Xử lý khi nhấn nút 'Log in'
  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra rằng người dùng đã nhập đầy đủ thông tin
    if (email.trim() === "" || password.trim() === "") {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    // Thực hiện xác thực đăng nhập ở đây, ví dụ gọi API
    console.log("Login với:", { email, password });
    // Sau khi đăng nhập thành công, điều hướng đến trang home
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email hoặc số điện thoại</label>
            <input
              type="text"
              placeholder="Email hoặc số điện thoại"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group password-group">
            <label className="form-label">Mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
              {/* Icon "ẩn" / "hiện" tùy ý, ở đây chỉ minh họa */}
              <span className="password-toggle">Ẩn</span>
            </div>
          </div>
          <button type="submit" className="auth-button login-btn">
            Log in
          </button>
        </form>
        <p className="policy-text">
          Bằng việc đăng ký, bạn đã đồng ý với &nbsp; 
          <Link to="#">Điều khoản dịch vụ & Chính sách bảo mật</Link>
        </p>
        <Link to="#" className="forgot-link">
          Quên mật khẩu?
        </Link>
      </div>
      <div className="auth-box create-account-box">
        <Link to="/register" className="create-account-btn">
          Tạo tài khoản mới
        </Link>
      </div>
    </div>
  );
};

export default Login;
