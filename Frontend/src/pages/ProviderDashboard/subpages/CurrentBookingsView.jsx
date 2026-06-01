import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import './CurrentBookingsView.css';

const CurrentBookingsView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProviderBookings();
  }, []);

  const fetchProviderBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/booking/provider/bookings`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const handleAcceptBooking = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/booking/provider/${id}`,
        { status: 'accepted' },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        fetchProviderBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept booking");
    }
  };

  const handleDeclineBooking = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/booking/provider/${id}`,
        { status: 'declined' },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        fetchProviderBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to decline booking");
    }
  };

  return (
    <div className="bookings-view-container">
      <h2 className="section-main-title">Current Bookings</h2>

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <h3>Loading Bookings...</h3>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h3>Error Loading Bookings</h3>
          <p>{error}</p>
          <button className="filter-btn" onClick={fetchProviderBookings}>Retry</button>
        </div>
      ) : (
        <>
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({bookings.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending ({bookings.filter(b => b.status === 'pending').length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilterStatus('accepted')}
        >
          Accepted ({bookings.filter(b => b.status === 'accepted').length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'declined' ? 'active' : ''}`}
          onClick={() => setFilterStatus('declined')}
        >
          Declined ({bookings.filter(b => b.status === 'declined').length})
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No Bookings Found</h3>
          <p>You don't have any bookings in this category.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">

              {/* Header */}
              <div className="booking-card-header">
                <div className="service-title-flex">
                  <span className="category-icon">{booking.categoryIcon}</span>
                  <div>
                    <h3>{booking.serviceName}</h3>
                    <p className="booking-id">Booking ID: #PF-{booking.id.toUpperCase()}</p>
                  </div>
                </div>
                <span className={`status-badge ${booking.status}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {/* Body */}
              <div className="booking-card-body">
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-icon">👤</span>
                    <div>
                      <p className="info-label">Customer</p>
                      <p className="info-value">{booking.customerName}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <div>
                      <p className="info-label">Phone</p>
                      <p className="info-value">{booking.customerPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <span className="info-icon">📆</span>
                    <div>
                      <p className="info-label">Date & Time</p>
                      <p className="info-value">{booking.date} | {booking.timeSlot}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div>
                      <p className="info-label">Location</p>
                      <p className="info-value">{booking.address}</p>
                    </div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <span className="info-icon">💰</span>
                    <div>
                      <p className="info-label">Amount</p>
                      <p className="info-value">{booking.amount}</p>
                    </div>
                  </div>
                  {booking.rating && (
                    <div className="info-item">
                      <span className="info-icon">⭐</span>
                      <div>
                        <p className="info-label">Customer Rating</p>
                        <p className="info-value">{booking.rating}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {booking.status === 'pending' && (
                <div className="booking-card-actions">
                  <button
                    className="action-btn success"
                    onClick={() => handleAcceptBooking(booking.id)}
                  >
                    ✓ Accept Booking
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => handleDeclineBooking(booking.id)}
                  >
                    ✕ Decline
                  </button>
                </div>
              )}

              {booking.status === 'accepted' && (
                <div className="booking-card-actions">
                  <button className="action-btn primary">
                    📞 Contact Customer
                  </button>
                  <button className="action-btn">
                    📍 Get Directions
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default CurrentBookingsView;
