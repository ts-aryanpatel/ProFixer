import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });

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

        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/api/customer/register`, credentials, { 
                withCredentials: true 
            });

            if (response.data && response.data.success !== false) {
                alert(response.data.message || "Registration successful! Please log in.");
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const backendData = err.response.data;

                if (backendData.errors && backendData.errors.length > 0) {
                    const firstError = backendData.errors[0];
                    setError(firstError.msg || firstError.message || "Validation failed.");
                } else if (backendData.message) {
                    setError(backendData.message);
                } else {
                    setError("Registration failed. Please try again.");
                }
            } else {
                setError("Unable to connect to the server. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p className="auth-subtitle">Sign up for a new <span>ProFixer</span> Customer Account</p>
                </div>

                {error && <div className="auth-error-banner">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className='auth-form'>
                    <div className="auth-form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={credentials.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            disabled={loading}
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
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
                            placeholder="Enter your phone number"
                            disabled={loading}
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn-auth-submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign up"}
                    </button>
                </form>

                <div className="auth-footer-redirect">
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};


export default Signup;