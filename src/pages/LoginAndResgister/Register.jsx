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
    if (name.trim() === "" || phoneOrEmail.trim() === "" || password.trim() === "" || confirmPw.trim() === "") {
      alert("Please fill in all information");
      return;
    }
    if (password !== confirmPw) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Creating account with:", { name, phoneOrEmail, password });
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create a new account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Your name</label>
            <input
              type="text"
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email or phone number</label>
            <input
              type="text"
              placeholder="Email or phone number"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group password-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group password-group">
            <label className="form-label">Re-enter password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="auth-button login-btn mt-5">
            Sign Up
          </button>
        </form>
        <p className="policy-text">
          By signing up, you agree to our &nbsp;
          <Link to="#">Terms of Service & Privacy Policy</Link>
        </p>
        <Link to="/login" className="forgot-link">
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;