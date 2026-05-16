import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  // Dynamic state that will map directly to your future MongoDB collection
  const [pricingData, setPricingData] = useState([
    { id: 1, service: "AC Deep Cleaning", price: 499, unit: "per unit", category: "Appliance" },
    { id: 2, service: "Full Home Sanitization", price: 1299, unit: "starts from", category: "Cleaning" },
    { id: 3, service: "Switch/Socket Replacement", price: 99, unit: "per point", category: "Electrician" },
    { id: 4, service: "Tap Leakage Repair", price: 149, unit: "per tap", category: "Plumber" },
    { id: 5, service: "Door Lock Installation", price: 249, unit: "per lock", category: "Carpenter" },
    { id: 6, service: "Kitchen Deep Cleaning", price: 899, unit: "per kitchen", category: "Cleaning" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Future Backend Integration:
    // fetch('/api/pricing').then(res => res.json()).then(data => setPricingData(data));
  }, []);

  return (
    <div className="pricing-wrapper">
      <div className="pricing-header-section">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Simple & Transparent Pricing</h1>
        <p>No hidden subscriptions, no surprise costs. You only pay for the services you book.</p>
      </div>

      <div className="pricing-features-grid">
        <div className="p-feature-card">
          <span className="p-icon">💰</span>
          <h4>No Subscription</h4>
          <p>Pay purely on a per-service basis. Zero recurring fees.</p>
        </div>
        <div className="p-feature-card">
          <span className="p-icon">🛡️</span>
          <h4>Insurance Included</h4>
          <p>Every single booking comes with our native safety protection cover.</p>
        </div>
        <div className="p-feature-card">
          <span className="p-icon">⚙️</span>
          <h4>All-Inclusive Rates</h4>
          <p>Platform service charges and taxes are pre-included in the price.</p>
        </div>
      </div>

      <div className="pricing-table-container">
        <table className="pro-pricing-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Final Price (Inc. Charges)</th>
            </tr>
          </thead>
          <tbody>
            {pricingData.map((item) => (
              <tr key={item.id}>
                <td className="s-name">{item.service}</td>
                <td><span className="s-cat-tag">{item.category}</span></td>
                <td className="s-price">₹{item.price} <small>{item.unit}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pricing-footer-note">
        <p>*Please note: Cost of materials or spare parts replaced during the service will be charged extra.</p>
      </div>
    </div>
  );
};

export default Pricing;