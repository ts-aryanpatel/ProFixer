import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
    // hum identifier ka use karenge jo email ya phone dono accept karega
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Aapke controller ke mutabik dono fields req.body me bhej rahe hain
        // Jo input user ne dala hai uske according set hoga
        const isEmail = identifier.includes('@');
        const loginData = {
            email: isEmail ? identifier : undefined,
            phoneNumber: !isEmail ? identifier : undefined,
            password: password
        };

        try {
            // Backend URL ko apne mutabik update kar lena (e.g., http://localhost:5000/api/v1/auth/login)
            const response = await axios.post(`${API_URL}/provider/auth/login`, loginData, {
                withCredentials: true // ⚡ Yeh important hai taaki cookie secure set ho sake
            });

            if (response.data.success) {
                // Access Token ko LocalStorage ya Auth Context me save karein
                localStorage.setItem('accessToken', response.data.accessToken);
                
                // User details save karne ke liye
                localStorage.setItem('provider', JSON.stringify(response.data.data));

                alert(response.data.message);
                
                // Login ke baad Provider Dashboard par redirect karein
                navigate('/provider/dashboard'); 
            }
        } catch (err) {
            // Error handling jo ApiError standard se match karegi
            const errorMessage = err.response?.data?.message || "Invalid credentials or Server Error";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                
                <div className="login-header">
                    <h2>Pro<span>Fixer</span></h2>
                    <p>Provider Login Dashboard</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email or Phone Number</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Enter email or 10-digit phone" 
                            value={identifier} 
                            onChange={(e) => setIdentifier(e.target.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <div className="label-row">
                            <label>Password</label>
                        </div>
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button type="submit" className="btn-login-submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login as Provider"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Want to join as a partner? <Link to="/provider/register">Register as Provider</Link></p>
                </div>

            </div>
        </div>
    );
};

export default Login;