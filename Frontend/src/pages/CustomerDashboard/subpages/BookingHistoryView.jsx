import React from 'react';
import './MyBookingsView.css'; // Same styling rules share karenge

const BookingHistoryView = () => {
  // Dummy data for completed/past bookings
  const pastBookings = [
    {
      id: 'h1',
      serviceName: 'Fan Installation & Wiring',
      categoryIcon: '⚡',
      providerName: 'Rahul Sharma',
      date: 'April 14, 2026',
      status: 'Completed',
      statusCode: 'completed',
      amount: '₹350'
    }
  ];

  return (
    <div className="bookings-view-container">
      <h2 className="section-main-title">Booking History</h2>

      {pastBookings.length === 0 ? (
        <div className="empty-bookings-state">
          <span className="empty-icon">📜</span>
          <h3>No Past Bookings</h3>
          <p>Your completed order history will appear here.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {pastBookings.map((history) => (
            <div key={history.id} className="booking-status-card history-card">
              
              <div className="booking-card-header">
                <div className="service-title-flex">
                  <span className="card-category-icon">{history.categoryIcon}</span>
                  <div>
                    <h3>{history.serviceName}</h3>
                    <p className="booking-id-text">Booking ID: #PF-{history.id.toUpperCase()}</p>
                  </div>
                </div>
                <span className={`status-badge-indicator ${history.statusCode}`}>
                  {history.status}
                </span>
              </div>

              <div className="booking-card-body history-body">
                <p><strong>Completed On:</strong> {history.date}</p>
                <p><strong>Professional:</strong> {history.providerName}</p>
                <p><strong>Amount Paid:</strong> {history.amount}</p>
              </div>

              <div className="booking-card-actions history-actions">
                <button className="action-btn download-invoice">Download Invoice</button>
                <button className="action-btn rebook-primary">Quick Re-Book</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryView;