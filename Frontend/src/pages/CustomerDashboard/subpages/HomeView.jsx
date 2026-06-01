import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import './HomeView.css';

const HomeView = ({ setActiveTab, setPreSelectedCategory }) => {
  const [selectedCity, setSelectedCity] = useState('Lalganj');
  const [searchQuery, setSearchQuery] = useState('');

  // Backend data states
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Core API Search Function
  const fetchSearchResults = async (queryText = '') => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/services/search?city=${selectedCity}&query=${queryText}`);

      if (response.data.success) {
        setProviders(response.data.data.providers || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch experts");
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [selectedCity]);

  // Future Backend API Integration helper
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults(searchQuery);
  };

  const handleCategoryClick = (categoryId) => {
    if (setPreSelectedCategory && setActiveTab) {
      setPreSelectedCategory(categoryId);
      setActiveTab('services');
    }
  };

  const handleViewAllRedirect = () => {
    if (setActiveTab) {
      setActiveTab('findPros');
    }
  };

  const categories = [
    { id: 'Electrician', name: 'Electrician', icon: '⚡' },
    { id: 'Plumber', name: 'Plumber', icon: '🚰' },
    { id: 'AC & Appliance Repair', name: 'AC & Appliance Repair', icon: '❄️' },
    { id: 'Carpenter', name: 'Carpenter', icon: '🪚' },
    { id: 'Painter', name: 'Painter', icon: '🎨' },
    { id: 'Salon & Grooming', name: 'Salon & Grooming', icon: '✂️' },
    { id: 'Cleaning & Pest Control', name: 'Cleaning & Pest Control', icon: '🧹' },
  ];

  const totalResultsCount = providers.length;

  return (
    <div className="home-view-container">

      {/* 2. HERO SECTION WITH BUTTON FORM SUBMISSION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Trusted Local Professionals Near You</h1>
          <p>Book verified electricians, plumbers, technicians, tutors, and more.</p>

          {/* Form wrapper use kiya hai taaki enter press karne par bhi submit ho jaye */}
          <form onSubmit={handleSearchSubmit} className="search-bar-composite-container">

            {/* City Selector */}
            <div className="city-selector-block">
              <span className="geo-icon">📍</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="hero-city-dropdown"
              >
                <option value="Bhagwanpur">Bhagwanpur</option>
                <option value="Hajipur">Hajipur</option>
                <option value="Lalganj">Lalganj</option>
                <option value="Muzaffarpur">Muzaffarpur</option>
                <option value="Patna">Patna</option>
                <option value="Vaishali">Vaishali</option>

              </select>
            </div>

            <div className="search-divider-line"></div>

            {/* Main Input Text */}
            <div className="search-input-block">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a service... (e.g., Electrician, Plumber)"
                className="main-search-input"
              />
            </div>

            {/* NEW: SUBMIT ACTION BUTTON */}
            <button type="submit" className="hero-search-action-btn" disabled={loading}>
              {loading ? '...' : 'Search'}
            </button>
          </form>
        </div>
      </section>

      {/* 3. SERVICE CATEGORIES SECTION */}
      <section className="categories-section">
        <h2 className="section-main-title">What service do you need?</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => handleCategoryClick(cat.id)}>
              <div className="category-icon-wrapper">{cat.icon}</div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NEARBY PROFESSIONALS SECTION */}
      <section className="nearby-section">
        <div className="section-header-flex">
          <h2 className="section-main-title">{searchQuery ? `Search Results in ${selectedCity}` : `Available Experts in ${selectedCity}`}</h2>
          {totalResultsCount > 8 && (
            <button className="see-all-btn" onClick={handleViewAllRedirect}>
              View All ({totalResultsCount})
            </button>
          )}
        </div>

        {error && <div className="home-error-msg">⚠️ {error}</div>}
        {loading && <div className="home-loading-msg">Searching live database...</div>}

        {!loading && totalResultsCount === 0 && (
          <div className="home-no-data-card">
            <p>No professionals or specific services active right now in "${selectedCity}" for your search.</p>
          </div>
        )}

        <div className="pros-scroller-container">


          {providers.slice(0, 8).map((provider) => (
            <div key={provider._id} className="pro-card">
              {provider.isVerified && <div className="pro-verified-badge">✓ Verified Expert</div>}
              <div className="pro-avatar-circle">
                {provider.fullName.charAt(0).toUpperCase()}
              </div>

              <div className="pro-details">
                <h3>{provider.fullName}</h3>
                <p className="pro-role">{provider.category}</p>

                <div className="pro-stats-row">
                  <span className="pro-rating">⭐ {provider.averageRating || '0.0'}</span>
                  <span className="pro-dot">•</span>
                  {/* Stored Requirement field showcase */}
                  <span className="pro-jobs">{provider.totalJobsCompleted || 0}+ Jobs</span>
                </div>

                <div className="home-pro-skills-list">
                  {provider.skills?.slice(0, 3).map((s, i) => (
                    <span key={i} className="home-skill-tag">{s}</span>
                  ))}
                </div>
              </div>

              {/* REQUIREMENT: Two dynamic actions for providers */}
              <div className="pro-card-actions-dual">
                <button className="view-profile-btn-half">View Profile</button>
                <button className="book-professional-btn-half">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomeView;