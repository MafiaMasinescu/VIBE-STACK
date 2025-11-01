import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import backGroundImage from "./assets/AboutPageWallpaper.jpg";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);
    axios
      .post("http://localhost:5001/auth/register", { name, email, password })
      .then((res) => {
        setLoading(false);
        navigate("/login");
      })
      .catch((err) => {
        setLoading(false);
        console.error("Signup error:", err);
        if (err.response && err.response.data)
          setError(
            err.response.data.message || JSON.stringify(err.response.data)
          );
        else setError(err.message || "Network Error");
      });
  };

  return (
    <div className="signup-container" style={backGroundImageStyle}>
      <div className="signup-card">
        <h2 className="signup-title">
          <span className="title-word">Create</span>
          <span className="title-word">Account</span>
        </h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="alert-message alert-error">{error}</div>}
          {loading && (
            <div className="alert-message alert-info">
              Creating your account...
            </div>
          )}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              autoComplete="name"
              name="name"
              value={name}
              className="form-input"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Create a password"
              autoComplete="new-password"
              name="password"
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="divider-text">Already have an account?</p>
        <Link to="/login" className="btn-login">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Signup;
