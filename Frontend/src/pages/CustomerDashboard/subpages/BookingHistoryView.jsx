import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import './MyBookingsView.css';

const BookingHistoryView = () => {
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/booking/customer/bookings`, {
        withCredentials: true,
        params: { status: 'completed' }
      });
      
      if (response.data.success) {
        const completed = (response.data.data || []).filter(b => b.status === 'completed');
        setPastBookings(completed);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load booking history");
      setPastBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookings-view-container">
      <h2 className="section-main-title">Booking History</h2>

      {loading ? (
        <div className="empty-bookings-state">
          <span className="empty-icon">⏳</span>
          <h3>Loading History...</h3>
        </div>
      ) : error ? (
        <div className="empty-bookings-state">
          <span className="empty-icon">⚠️</span>
          <h3>Error Loading History</h3>
          <p>{error}</p>
          <button className="book-now-prompt-btn" onClick={fetchBookingHistory}>Retry</button>
        </div>
      ) : pastBookings.length === 0 ? (
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