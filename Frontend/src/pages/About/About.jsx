import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-container">
      {/* Header Section */}
      <div className="about-header">
        <Link to="/" className="btn-back">&larr; Back to Home</Link>
        <h1>About ProFixer</h1>
        <p className="about-subtitle">Empowering local communities by connecting trusted service professionals with homes.</p>
      </div>

      {/* Main Story & Image Layout */}
      <div className="about-layout">
        <div className="about-text-side">
          <h2>Our Story</h2>
          <p>
            Finding a reliable plumber, cleaner, or technician shouldn't feel like a gamble. **ProFixer** was born out of a simple need: to bring structure, transparency, and safety to the unorganized local services industry in India.
          </p>
          <p>
            We bridge the gap between high-skilled local experts looking for fair work opportunities and households searching for hassle-free maintenance services. By vetting every professional, we ensure top-tier quality directly at your doorstep.
          </p>
        </div>
        <div className="about-img-side">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop" 
            alt="Team Collaboration" 
            className="about-img"
          />
        </div>
      </div>

      {/* Core Values Section */}
      <div className="values-section">
        <h2 className="values-title">Our Core Pillars</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🛡️</div>
            <h3>Verified Trust</h3>
            <p>Every service provider undergoes background screening and expertise validation before joining our network.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">💎</div>
            <h3>Transparent Pricing</h3>
            <p>No hidden charges or surprise hourly rates. You see the exact pricing before confirming your booking slot.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">⚡</div>
            <h3>Hyper-Local Speed</h3>
            <p>We match you with experts right in your neighborhood to guarantee instant response and faster problem-solving.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;