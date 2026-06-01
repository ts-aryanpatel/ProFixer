import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit to backend API
    alert("Thank you! Your message has been sent successfully.");
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <Link to="/" className="btn-back">&larr; Back to Home</Link>
        <h1>Contact Us</h1>
        <p className="contact-subtitle">Have questions? We're here to help you 24/7.</p>
      </div>

      <div className="contact-layout">
        {/* Left Side: Contact Information Cards */}
        <div className="contact-info-side">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <div className="info-text">
              <h3>Our Location</h3>
              <p>Vaishali, Bihar, India</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <div className="info-text">
              <h3>Email Us</h3>
              <p>support@profixer.in</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <div className="info-text">
              <h3>Call Support</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form Wrapper */}
        <div className="contact-form-side">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange}
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Service Booking Issue">Service Booking Issue</option>
                <option value="Partner Onboarding">Partner Onboarding (Join as Pro)</option>
                <option value="Technical Support">Technical Support</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;