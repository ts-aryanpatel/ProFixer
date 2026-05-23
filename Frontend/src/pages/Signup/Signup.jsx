import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';


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
            const response = await axios.post('https://profixer-backend.onrender.com/api/customer/register', credentials);

            if (response.data && response.success !== false) {
                alert(response.message || "Registration successful! Please log in.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Signup Error:", err);

            if (err.response && err.response.data) {
                const backendData = err.response.data;

                // 💡 1. Check karo agar backend ne specific validation errors array bheja hai
                if (backendData.errors && backendData.errors.length > 0) {
                    // Array ke pehle error ka main message nikal lo (jaise field validation msg)
                    const firstError = backendData.errors[0];
                    setError(firstError.msg || firstError.message || "Validation failed.");
                }
                // 💡 2. Agar array nahi hai par normal message hai
                else if (backendData.message) {
                    setError(backendData.message);
                }
                // 💡 3. Agar kuch bhi nahi mila
                else {
                    setError("Registration failed. Please try again.");
                }

            } else {
                setError("Unable to connect to the server. The live instance might be waking up, please retry.");
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
                            disablesd={loading}
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