import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Create <span>ProFixer</span> Account</h2>
                    <p>Signup to book expert services instantly.</p>
                </div>

                <form className="signup-form">
                    <div className="input-field">
                        <label>Full Name:</label>
                        <input 
                            type="text"
                            name="fullName"
                            placeholder='e.g. Aryan Kumar'
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label >Email:</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder='name@example.com'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label htmlFor="">Phone Number:</label>
                        <input 
                            type="tel"
                            name='phone'
                            placeholder='Your 10-digit number' 
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};


export default Signup;