import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  // 1. State for holding customer credentials
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // 2. Error/Success states for user feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Clear error message when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 💡 Future Backend Integration:
      const response = await axios.post('https://profixer-backend.onrender.com/api/customer/login', credentials);

      const responseData = response.data;
      const token = responseData?.accessToken || response.accessToken;

      if (token) {
        localStorage.setItem('accessToken', token);

        alert("Login successful! (Simulated)");

        navigate('/customer-dashboard');
      }

      console.log("Customer Login Submitted:", credentials);

      // Temporary simulated success
      alert("Login successful!");
    } catch (err) {
      console.error("Login Error:", err);

      // Check if the backend sent our custom global error response
      if (err.response && err.response.data) {

        // Extract the English message sent by your global handler
        setError(err.response.data.message || "Authentication failed. Please try again.");

        // Log detailed validation errors if any exist in the array
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          console.log("Validation Details:", err.response.data.errors);
        }

      } else {
        // Fallback for network failures or when Render instance is spinning up
        setError("Unable to connect to the server. The live instance might be waking up, please retry in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to your <span>ProFixer</span> Customer Account</p>
        </div>

        {error && <div className="auth-error-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="name@example.com"
              disabled={loading}
            />
          </div>

          <div className="auth-form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <a href="#forgot" className="forgot-password-link">Forgot Password?</a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div className="auth-footer-redirect">
          <p>Don't have an account? <Link to="/signup">Register / Sign Up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;