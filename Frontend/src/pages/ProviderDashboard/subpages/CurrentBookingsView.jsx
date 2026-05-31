import React, { useState } from 'react';
import './CurrentBookingsView.css';

const CurrentBookingsView = () => {
  const [bookings, setBookings] = useState([
    {
      id: 'b1',
      customerName: 'Amit Patel',
      customerPhone: '+91 9876543210',
      serviceName: 'AC Repair & Service',
      categoryIcon: '❄️',
      date: 'May 30, 2026',
      timeSlot: '2:00 PM - 3:30 PM',
      status: 'accepted',
      amount: '₹499',
      address: 'Sector 5, Delhi',
      rating: 4.8
    },
    {
      id: 'b2',
      customerName: 'Priya Singh',
      customerPhone: '+91 8765432109',
      serviceName: 'Plumbing Repair',
      categoryIcon: '🚰',
      date: 'May 30, 2026',
      timeSlot: '4:00 PM - 5:30 PM',
      status: 'pending',
      amount: '₹349',
      address: 'Dwarka, Delhi',
      rating: 4.5
    },
    {
      id: 'b3',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 7654321098',
      serviceName: 'Electrical Wiring',
      categoryIcon: '⚡',
      date: 'May 31, 2026',
      timeSlot: '10:00 AM - 11:30 AM',
      status: 'accepted',
      amount: '₹599',
      address: 'Noida, UP',
      rating: 4.9
    },
    {
      id: 'b4',
      customerName: 'Neha Sharma',
      customerPhone: '+91 6543210987',
      serviceName: 'Carpentry Work',
      categoryIcon: '🔨',
      date: 'May 31, 2026',
      timeSlot: '3:00 PM - 4:30 PM',
      status: 'declined',
      amount: '₹450',
      address: 'Gurgaon, Haryana',
      rating: null
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const handleAcceptBooking = (id) => {
    setBookings(bookings.map(b =>
      b.id === id ? { ...b, status: 'accepted' } : b
    ));
  };

  const handleDeclineBooking = (id) => {
    setBookings(bookings.map(b =>
      b.id === id ? { ...b, status: 'declined' } : b
    ));
  };

  return (
    <div className="bookings-view-container">
      <h2 className="section-main-title">Current Bookings</h2>

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
    </div>
  );
};

export default CurrentBookingsView;
