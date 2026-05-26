import React from 'react';
import './MyBookingsView.css';

const MyBookingsView = () => {
  // Dummy data for upcoming/active bookings
  const activeBookings = [
    {
      id: 'b1',
      serviceName: 'AC Deep Cleaning & Service',
      categoryIcon: '❄️',
      providerName: 'Rahul Sharma',
      providerAvatar: '👨‍🔧',
      date: 'May 26, 2026',
      timeSlot: '11:00 AM - 12:30 PM',
      status: 'Partner Assigned',
      statusCode: 'assigned',
      amount: '₹499'
    },
    {
      id: 'b2',
      serviceName: 'Kitchen Sink Pipe Repair',
      categoryIcon: '🚰',
      providerName: 'Priya Gupta',
      providerAvatar: '👩‍🔧',
      date: 'May 28, 2026',
      timeSlot: '04:00 PM - 05:30 PM',
      status: 'Awaiting Confirmation',
      statusCode: 'pending',
      amount: '₹249'
    }
  ];

  return (
    <div className="bookings-view-container">
      <h2 className="section-main-title">My Active Bookings</h2>

      {activeBookings.length === 0 ? (
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