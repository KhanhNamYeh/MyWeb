import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const Login = () => {
  const [login, setLogin] = useState(""); 
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (login.trim() === "" || password.trim() === "") {
      setError("Please enter both login and password");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = "http://localhost/PHP/login_register.php";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "login",
          login: login,
          password: password,
          remember: remember,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Login successful:", data.user);
        
        // Store user information in localStorage
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        if (data.user && data.user.role === "admin") {
          navigate("/home");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.error || `Login failed (Status: ${response.status})`);
      }
    } catch (networkError) {
      console.error("Login API call failed:", networkError);
      setError(
        "Failed to connect to the server. Please check the API URL and ensure XAMPP is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">Login with your existing account</div>
        {error && <div className="auth-error alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username or Email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group password-group">
            <div className="password-input-wrapper">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="form-group custom-control custom-checkbox pb-3">
            <input
              type="checkbox"
              className="custom-control-input"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="custom-control-label" htmlFor="remember">
              Remember login
            </label>
            <Link to="/forgot-password" className="forgot-link float-right">
              Forgot password?
            </Link>
          </div>

          <div className="auth-buttons-container">
            <button type="submit" className="auth-button login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="policy-text">
          By logging in, you agree to our &nbsp;
          <Link to="/terms">Terms of Service</Link> & <Link to="/privacy">Privacy Policy</Link>
        </p>

        <div className="other-signin-options">
              <div className="other-signin-label">Or sign in with:</div>
              <div className="signin-providers">
                  <a href="/auth/google" className="signin-provider-logo">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="provider-logo">
                           <path fill="#4285f4" d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" />
                           <path fill="#34a853" d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" />
                           <path fill="#fbbc04" d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" />
                           <path fill="#ea4335" d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" />
                       </svg>
                  </a>
                  <a href="/auth/github" className="signin-provider-logo">
                       <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="provider-logo">
                           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                       </svg>
                  </a>
                  <a href="/auth/gitlab" className="signin-provider-logo">
                          <svg fillRule="evenodd" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="provider-logo">
                              <path fill="#e24329" d="M32 61.477L43.784 25.2H20.216z" />
                              <path fill="#fc6d26" d="M32 61.477L20.216 25.2H3.7z" />
                              <path fill="#fca326" d="M3.7 25.2L.12 36.23a2.44 2.44 0 0 0 .886 2.728L32 61.477z" />
                              <path fill="#e24329" d="M3.7 25.2h16.515L13.118 3.366c-.365-1.124-1.955-1.124-2.32 0z" />
                              <path fill="#fc6d26" d="M32 61.477L43.784 25.2H60.3z" />
                              <path fill="#fca326" d="M60.3 25.2l3.58 11.02a2.44 2.44 0 0 1-.886 2.728L32 61.477z" />
                              <path fill="#e24329" d="M60.3 25.2H43.784l7.098-21.844c.365-1.124 1.955-1.124 2.32 0z" />
                          </svg>
                  </a>
                  <a href="/auth/atlassian" className="signin-provider-logo">
                          <svg fill="none" viewBox="4 4 24 24" xmlns="http://www.w3.org/2000/svg" className="provider-logo">
                              <path fill="#2684FF" d="M4.77044 5C4.29089 5 3.93123 5.43959 4.01115 5.87918L7.24814 25.7007C7.32806 26.2203 7.76766 26.5799 8.28717 26.5799H23.9526C24.3123 26.5799 24.632 26.3002 24.7119 25.9405L27.9888 5.91915C28.0688 5.43959 27.7091 5.03997 27.2296 5.03997L4.77044 5ZM18.5177 19.3067H13.5223L12.2035 12.2333H19.7565L18.5177 19.3067Z" />
                              <path fill="url(#login-paint0_linear)" d="M26.9098 12.2333H19.7165L18.5176 19.3067H13.5222L7.64771 26.3002C7.64771 26.3002 7.92744 26.54 8.32707 26.54H23.9925C24.3522 26.54 24.6719 26.2602 24.7518 25.9005L26.9098 12.2333Z" />
                              <defs>
                                  <linearGradient gradientUnits="userSpaceOnUse" y2="23.5316" x2="16.672" y1="14.2265" x1="28.5925" id="login-paint0_linear">
                                      <stop stopColor="#0052CC" offset="0.176" />
                                      <stop stopColor="#2684FF" offset={1} />
                                  </linearGradient>
                              </defs>
                          </svg>
                  </a>
              </div>
        </div>
      </div>

      <div className="auth-box create-account-box">
        <div className="auth-header">Don't have an account?</div>
        <Link to="/register" className="create-account-btn">
          Create a new account
        </Link>
      </div>
    </div>
  );
};

export default Login;