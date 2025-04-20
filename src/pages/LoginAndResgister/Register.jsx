import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState(""); // New state for login
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

    if (name.trim() === "" || login.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPw.trim() === "") {
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
      const apiUrl = "http://localhost/PHP/login_register.php"; // <-- ADJUST PATH IF NEEDED

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register", // <-- Specify the action
          name: name,
          login: login, // Include the login field
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message || "Registration successful! Redirecting to login...");
        setError("");
        setName("");
        setLogin(""); // Clear the login state
        setEmail("");
        setPassword("");
        setConfirmPw("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.error || `Registration failed (Status: ${response.status})`);
        setSuccessMessage("");
      }
    } catch (networkError) {
      console.error("Registration API call failed:", networkError);
      setError("Failed to connect to the server. Please check the API URL and ensure XAMPP is running.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
       <div className="auth-box">
         <h2 className="auth-title">Create a new account</h2>
         {error && <div className="auth-error alert alert-danger">{error}</div>}
         {successMessage && <div className="auth-success alert alert-success">{successMessage}</div>}
         <form onSubmit={handleSubmit} className="auth-form">
           {/* Name Input */}
           <div className="form-group">
            <label className="form-label">Your name</label>
            <input
              type="text"
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
           {/* Login Input */}
           <div className="form-group">
            <label className="form-label">Login</label>
            <input
              type="text"
              placeholder="Username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
           {/* Email Input */}
           <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
           {/* Password Input */}
           <div className="form-group password-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Password (min 6 characters recommended)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              minLength="6"
              disabled={loading}
            />
          </div>
           {/* Confirm Password Input */}
           <div className="form-group password-group">
            <label className="form-label">Re-enter password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
           {/* Sign Up Button */}
           <button type="submit" className="auth-button login-btn mt-5" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
         </form>
         {/* Policy Text */}
         <p className="policy-text">
           By signing up, you agree to our &nbsp;
           <Link to="/terms">Terms of Service & Privacy Policy</Link>
         </p>
         {/* Link to Login */}
         <Link to="/login" className="forgot-link">
           Already have an account? Log in
         </Link>
       </div>
     </div>
  );
};

export default Register;