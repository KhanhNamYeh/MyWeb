import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!name || !login || !email || !password || !confirmPw) {
      setError("Please fill in all information");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password !== confirmPw) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost/PHP/login_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name,
          login,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message || "Registration successful! Redirecting...");
        setName("");
        setLogin("");
        setEmail("");
        setPassword("");
        setConfirmPw("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || `Registration failed (Status: ${response.status})`);
      }
    } catch (err) {
      console.error("API error:", err);
      setError("Could not connect to the server. Make sure XAMPP is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-container-active register-form-container">
      <div className="auth-box auth-login-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">ReadGo</div>
        </div>
        <h2 className="auth-title">Create a new account</h2>

        {error && (
          <div className="auth-error">
            <div className="auth-error-icon">!</div>
            <div className="auth-error-message">{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="auth-success">
            <div className="auth-error-icon">✓</div>
            <div>{successMessage}</div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-form-label">Name</label>
            <input
              type="text"
              className="auth-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Username</label>
            <input
              type="text"
              className="auth-form-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Email</label>
            <input
              type="email"
              className="auth-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Password</label>
            <input
              type="password"
              className="auth-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Confirm Password</label>
            <input
              type="password"
              className="auth-form-input"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
            />
          </div>

          <div className="auth-buttons-container">
            <button
              type="submit"
              className={`auth-button auth-login-btn ${loading ? "auth-loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <div className="auth-loading-spinner"></div>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        <div className="auth-policy-text">
          By registering, you agree to our{" "}
          <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </div>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <div className="auth-create-account-box">
          <Link className="auth-create-account-btn" to="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;