import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import backGroundImage from "./assets/AboutPageWallpaper.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // We need credentials because the backend may set cookies on login
  axios.defaults.withCredentials = true;

  const backGroundImageStyle = {
    backgroundImage: `url(${backGroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    // server mounts auth routes under /auth
    axios
      .post(`${API_URL}/auth/login`, { email, password })
      .then((res) => {
        // adapt to new controller responses (token or error)
        if (res.data && res.data.token) {
          // Store token in localStorage
          localStorage.setItem("token", res.data.token);
          // Navigate to feed
          navigate("/feed");
        } else if (res.data && res.data.Status === "Success") {
          if (res.data.role === "admin") navigate("/dashboard");
          else navigate("/");
        } else {
          setError("Login failed");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.response && err.response.data)
          setError(
            err.response.data.message || JSON.stringify(err.response.data)
          );
        else setError(err.message || "Network Error");
      });
  };

  return (
    <div className="login-container" style={backGroundImageStyle}>
      <div className="login-card">
        <h2 className="login-title">
          <span className="title-word">Welcome</span>
          <span className="title-word">Back</span>
        </h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              name="email"
              className="form-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              name="password"
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>
        <p className="divider-text">Don't have an account?</p>
        <Link to="/register" className="btn-signup">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
