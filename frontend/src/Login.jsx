import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'


function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // We need credentials because the backend may set cookies on login
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // server mounts auth routes under /auth
    axios.post('http://localhost:5001/auth/login', { email, password })
    .then(res => {
      // adapt to new controller responses (token or error)
      if (res.data && res.data.token) {
        // logged in
        navigate('/dashboard')
      } else if (res.data && res.data.Status === 'Success') {
        if (res.data.role === 'admin') navigate('/dashboard')
        else navigate('/')
      } else {
        setError('Login failed')
      }
    }).catch(err => {
      console.error('Login error:', err)
      if (err.response && err.response.data) setError(err.response.data.message || JSON.stringify(err.response.data))
      else setError(err.message || 'Network Error')
    })
  }

    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
  <h2>Login</h2>
  {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
          </form>
          <p>Already Have an Account</p>
          <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
            Sign Up
          </Link>
        
      </div>
    </div>
    )
}

export default Login;
