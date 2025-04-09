// src/auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra các ô thông tin đã nhập đầy đủ
    if (name.trim() === "" || phoneOrEmail.trim() === "" || password.trim() === "" || confirmPw.trim() === "") {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPw) {
      alert("Mật khẩu không trùng khớp!");
      return;
    }
    // Gọi API đăng ký, xử lý logic, v.v.
    console.log("Tạo tài khoản với:", { name, phoneOrEmail, password });
    // Sau khi đăng ký thành công, điều hướng về trang Home hoặc trang Login tùy theo yêu cầu
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Tạo tài khoản mới</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Tên của bạn</label>
            <input
              type="text"
              placeholder="Tên hiển thị"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email hoặc số điện thoại</label>
            <input
              type="text"
              placeholder="Email hoặc số điện thoại"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group password-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group password-group">
            <label className="form-label">Nhập lại mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="auth-button register-btn">
            Đăng ký
          </button>
        </form>
        <p className="policy-text">
          Bằng việc đăng ký, bạn đã đồng ý với &nbsp; 
          <Link to="#">Điều khoản dịch vụ & Chính sách bảo mật</Link>
        </p>
        <Link to="/login" className="forgot-link">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default Register;
