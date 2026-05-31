import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ProviderAuth.css';

const ProviderAuth = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    experience: '',
    services: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Provider Login
        const response = await axios.post(
          `${API_URL}/provider/auth/login`,
          {
            email: credentials.email,
            password: credentials.password
          },
          { withCredentials: true }
        );

        const responseData = response.data;
        const token = responseData?.accessToken || response.accessToken;

        if (token) {
          localStorage.setItem('accessToken', token);
          const providerData = responseData.data;
          localStorage.setItem('provider', JSON.stringify(providerData));
          alert("Login successful!");
          navigate('/provider-dashboard');
        }
      } else {
        // Provider Registration
        // Map frontend fields to backend expected names and normalize values
        const mapCategory = (services) => {
          if (!services) return "";
          const s = services.toLowerCase();
          if (s.includes('elect') || s.includes('electric')) return 'Electrician';
          if (s.includes('plumb')) return 'Plumber';
          if (s.includes('clean')) return 'Cleaning & Pest Control';
          if (s.includes('ac') || s.includes('appliance')) return 'AC & Appliance Repair';
          if (s.includes('carp')) return 'Carpenter';
          if (s.includes('paint')) return 'Painter';
          if (s.includes('salon') || s.includes('groom')) return 'Salon & Grooming';
          return services; // fallback: raw value
        };

        const parseExperience = (exp) => {
          if (!exp) return 0;
          const m = String(exp).match(/\d+/);
          return m ? Number(m[0]) : 0;
        };

        const payload = {
          fullName: credentials.name,
          email: credentials.email,
          password: credentials.password,
          phoneNumber: credentials.phone,
          city: credentials.address,
          category: mapCategory(credentials.services),
          experience: parseExperience(credentials.experience),
          skills: credentials.services ? credentials.services.split(',').map(s => s.trim()) : []
        };

        const response = await axios.post(
          `${API_URL}/provider/auth/register`,
          payload,
          { withCredentials: true }
        );

        if (response.data && response.data.success !== false) {
          alert(response.data.message || "Registration successful! You can now log in.");
          setIsLogin(true);
          setCredentials({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            experience: '',
            services: ''
          });
        }
      }
    } catch (err) {
      console.error("Provider Auth Error:", err);

      if (err.response && err.response.data) {
        const backendData = err.response.data;

        if (backendData.errors && backendData.errors.length > 0) {
          const firstError = backendData.errors[0];
          setError(firstError.msg || firstError.message || "Authentication failed.");
        } else if (backendData.message) {
          setError(backendData.message);
        } else {
          setError(isLogin ? "Login failed. Please try again." : "Registration failed. Please try again.");
        }
      } else {
        setError("Unable to connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container provider-auth">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back, Pro!" : "Join ProFixer as a Provider"}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? "Log in to your ProFixer Provider Account"
              : "Sign up and start earning with ProFixer!"}
          </p>
          <div className="role-badge">👨‍🔧 Service Professional</div>
        </div>

        {error && <div className="auth-error-banner">⚠️ {error}</div>}

        {/* Toggle between Login and Signup */}
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setCredentials({
                name: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                experience: '',
                services: ''
              });
            }}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setCredentials({
                name: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                experience: '',
                services: ''
              });
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Signup-only fields */}
          {!isLogin && (
            <>
              <div className="auth-form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={credentials.name}
                  onChange={handleChange}
                  required
                  placeholder="Babu Rao Apte"
                  disabled={loading}
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={credentials.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  disabled={loading}
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={credentials.address}
                  onChange={handleChange}
                  required
                  placeholder="City, State"
                  disabled={loading}
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="experience">Experience (years)</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={credentials.experience}
                  onChange={handleChange}
                  placeholder="e.g., 3+ years"
                  disabled={loading}
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="services">Services You Provide</label>
                <input
                  type="text"
                  id="services"
                  name="services"
                  value={credentials.services}
                  onChange={handleChange}
                  placeholder="e.g., AC Repair, Plumbing, Electrical"
                  disabled={loading}
                />
              </div>
            </>
          )}

          {/* Common fields */}
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
              {isLogin && <a href="#forgot" className="forgot-password-link">Forgot Password?</a>}
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

          {!isLogin && (
            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required disabled={loading} />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
          )}

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading
              ? (isLogin ? "Authenticating..." : "Creating Account...")
              : (isLogin ? "Login" : "Create Account")}
          </button>
        </form>

        <div className="auth-footer-redirect">
          {isLogin ? (
            <p>Don't have an account? <button className="link-btn" onClick={() => setIsLogin(false)}>Sign up here</button></p>
          ) : (
            <p>Already have an account? <button className="link-btn" onClick={() => setIsLogin(true)}>Login here</button></p>
          )}
        </div>

        <div className="auth-footer-customer">
          <p>Are you looking for services? <Link to="/login">Customer Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ProviderAuth;
