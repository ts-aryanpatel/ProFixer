import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        category: '',
        city: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // List of common professions for ProFixer
    const categories = [
        "Electrician", "Plumber", "AC & Appliance Repair", 
        "Carpenter", "Painter", "Salon & Grooming", "Cleaning & Pest Control"
    ];

    const cities = [
        "Lalganj", "Bhagwanpur", "Hajipur", "Vaishali", "Patna", "Muzaffarpur"
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/provider/auth/register`, {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                category: formData.category,
                city: formData.city
            });

            if (response.data.success) {
                alert(response.data.message);
                navigate("/provider/login");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="provider-signup-container">
            <div className="signup-card">
                <div className="signup-left">
                    <h2>Grow Your Business with Pro<span>Fixer</span></h2>
                    <p>Join India's fastest-growing network of local service experts. Get genuine leads and manage your bookings effortlessly.</p>
                    <ul className="benefits-list">
                        <li>✓ Zero upfront lead charges</li>
                        <li>✓ Flexible working hours</li>
                        <li>✓ Direct UPI payouts from customers</li>
                    </ul>
                </div>

                <div className="signup-right">
                    <h3>Create Provider Account</h3>
                    <p className="subtitle">Set up your professional profile</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" name="fullName" required 
                                placeholder="e.g. Rahul Kumar" 
                                value={formData.fullName} onChange={handleChange} 
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" name="email" required 
                                    placeholder="rahul@example.com" 
                                    value={formData.email} onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input 
                                    type="tel" name="phoneNumber" required 
                                    placeholder="98765XXXXX" pattern="[0-9]{10}"
                                    value={formData.phone} onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Select Category</label>
                                <select name="category" required value={formData.category} onChange={handleChange}>
                                    <option value="">-- Choose your skill --</option>
                                    {categories.map((cate, index) => (
                                        <option key={index} value={cate}>{cate}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <select name="city" required value={formData.city} onChange={handleChange}>
                                    <option value="">--- Choose your city --</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city.toLowerCase()}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" name="password" required 
                                    placeholder="••••••••" 
                                    value={formData.password} onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input 
                                    type="password" name="confirmPassword" required 
                                    placeholder="••••••••" 
                                    value={formData.confirmPassword} onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-signup-submit" disabled={loading}>
                            { loading ? "Registering..." : "Register as Provider"}
                        </button>
                    </form>

                    <p className="auth-redirect">
                        Already have a partner account? <Link to="/provider/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;