import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import './MyBookingsView.css';

const MyBookingsView = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  const fetchActiveBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/booking/customer/bookings`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setActiveBookings(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
      setActiveBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookings-view-container">
      <h2 className="section-main-title">My Active Bookings</h2>

      {loading ? (
        <div className="empty-bookings-state">
          <span className="empty-icon">⏳</span>
          <h3>Loading Bookings...</h3>
        </div>
      ) : error ? (
        <div className="empty-bookings-state">
          <span className="empty-icon">⚠️</span>
          <h3>Error Loading Bookings</h3>
          <p>{error}</p>
          <button className="book-now-prompt-btn" onClick={fetchActiveBookings}>Retry</button>
        </div>
      ) : activeBookings.length === 0 ? (
        <div className="empty-bookings-state">
          <span className="empty-icon">📅</span>
          <h3>No Active Bookings</h3>
          <p>You don't have any service scheduled right now. Need something fixed?</p>
          <button className="book-now-prompt-btn">Book a Service</button>
        </div>
      ) : (
        <div className="bookings-list">
          {activeBookings.map((booking) => (
            <div key={booking.id} className="booking-status-card">
              
              {/* Header: Service Name & Status Badge */}
              <div className="booking-card-header">
                <div className="service-title-flex">
                  <span className="card-category-icon">{booking.categoryIcon}</span>
                  <div>
                    <h3>{booking.serviceName}</h3>
                    <p className="booking-id-text">Booking ID: #PF-{booking.id.toUpperCase()}</p>
                  </div>
                </div>
                <span className={`status-badge-indicator ${booking.statusCode}`}>
                  {booking.status}
                </span>
              </div>

              {/* Body: Date, Time & Provider Details */}
              <div className="booking-card-body">
                <div className="booking-detail-item">
                  <span className="detail-icon">📆</span>
                  <div>
                    <p className="detail-label">Schedule Date & Time</p>
                    <p className="detail-value">{booking.date} | {booking.timeSlot}</p>
                  </div>
                </div>

                <div className="booking-detail-item">
                  <span className="detail-icon">💰</span>
                  <div>
                    <p className="detail-label">Total Amount</p>
                    <p className="detail-value">{booking.amount} <span className="payment-tag">Pay After Service</span></p>
                  </div>
                </div>

                <div className="booking-provider-profile-row">
                  <div className="provider-mini-avatar">{booking.providerAvatar}</div>
                  <div>
                    <p className="provider-mini-label">Assigned Professional</p>
                    <p className="provider-mini-name">{booking.providerName} ✓</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="booking-card-actions">
                <button className="action-btn cancel-trigger">Cancel Booking</button>
                <button className="action-btn reschedule-trigger">Reschedule</button>
                <button className="action-btn track-primary">Track Partner</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsView;