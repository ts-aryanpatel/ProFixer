import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardHomeView.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardHomeView = ({ setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    acceptedBookings: 0,
    pendingBookings: 0,
    declinedBookings: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      // Fetch data straight from your uniform provider bookings pipeline
      const response = await axios.get(`${API_URL}/booking/provider/bookings`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const allBookings = response.data?.data || response.data?.bookings || [];
      
      // Compute Live State Metrics
      const total = allBookings.length;
      const pending = allBookings.filter(b => b.status === 'pending').length;
      const accepted = allBookings.filter(b => ['accepted', 'in-progress', 'completed'].includes(b.status)).length;
      const declined = allBookings.filter(b => ['cancelled', 'rejected'].includes(b.status)).length;
      
      // Compute Earnings directly from finalized database states
      const totalEarnings = allBookings.reduce((sum, b) => 
        sum + (b.status === 'completed' ? (b.billAmount || b.serviceId?.basePrice || 0) : 0), 0
      );

      // Filter Current Month Analytics
      const currentCalendarDate = new Date();
      const currentYear = currentCalendarDate.getFullYear();
      const currentMonth = currentCalendarDate.getMonth(); // 0-indexed

      const thisMonthEarnings = allBookings.reduce((sum, b) => {
        if (b.status !== 'completed' || !b.timeSlot?.date) return sum;
        const bookingDate = new Date(b.timeSlot.date);
        if (bookingDate.getFullYear() === currentYear && bookingDate.getMonth() === currentMonth) {
          return sum + (b.billAmount || b.serviceId?.basePrice || 0);
        }
        return sum;
      }, 0);

      setStats({
        totalBookings: total,
        acceptedBookings: accepted,
        pendingBookings: pending,
        declinedBookings: declined,
        totalEarnings,
        thisMonthEarnings
      });

      // Slice out the top 3 most recent entries chronologically for clean micro viewcards
      const sortedLatest = [...allBookings]
        .sort((a, b) => new Date(b.timeSlot?.date) - new Date(a.timeSlot?.date))
        .slice(0, 3);

      setRecentBookings(sortedLatest);

    } catch (error) {
      console.error("Failed to compile dashboard ecosystem telemetry data logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get localized system string for current runtime visual mapping
  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="dashboard-home-container">
      <h2 className="section-main-title">Dashboard Overview</h2>

      {loading ? (
        <div className="dashboard-loader">Syncing database operations network metrics...</div>
      ) : (
        <>
          {/* Stats Grid Matrix */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">📅</span>
                <h3>Total Bookings</h3>
              </div>
              <p className="stat-value">{stats.totalBookings}</p>
              <p className="stat-label">All time assignments</p>
            </div>

            <div className="stat-card status-accepted">
              <div className="stat-header">
                <span className="stat-icon">✅</span>
                <h3>Accepted / Active</h3>
              </div>
              <p className="stat-value">{stats.acceptedBookings}</p>
              <p className="stat-label">In-flight & completed</p>
            </div>

            <div className="stat-card status-pending">
              <div className="stat-header">
                <span className="stat-icon">⏳</span>
                <h3>Pending Action</h3>
              </div>
              <p className="stat-value">{stats.pendingBookings}</p>
              <p className="stat-label">Awaiting operational signoff</p>
            </div>

            <div className="stat-card status-declined">
              <div className="stat-header">
                <span className="stat-icon">❌</span>
                <h3>Declined / Cancelled</h3>
              </div>
              <p className="stat-value">{stats.declinedBookings}</p>
              <p className="stat-label">Turned away or voided</p>
            </div>
          </div>

          {/* Recent Bookings Queue Log */}
          <div className="recent-bookings-section">
            <div className="section-header">
              <h3>Recent Pipeline Activity</h3>
              <button
                className="view-all-btn"
                onClick={() => setActiveTab('bookings')}
              >
                View All Activity →
              </button>
            </div>

            <div className="recent-bookings-list">
              {recentBookings.length === 0 ? (
                <div className="dashboard-empty-state">
                  <div className="empty-state-icon">📭</div>
                  <h3>No Dynamic Logs Available</h3>
                  <p>You do not have any registered client assignment records inside your ledger.</p>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking._id} className={`booking-mini-card sideborder-${booking.status}`}>
                    <div className="booking-info">
                      <h4>{booking.serviceId?.name || "Custom Contract Operation"}</h4>
                      <p className="customer-name">Client: {booking.customerId?.name || "Anonymous Requester"}</p>
                      <div className="booking-meta">
                        <span>📆 {booking.timeSlot?.date ? new Date(booking.timeSlot.date).toLocaleDateString() : 'N/A'}</span>
                        <span>⏱️ {booking.timeSlot?.time || 'Unassigned Time'}</span>
                      </div>
                    </div>
                    <div className="booking-right">
                      <span className={`status-badge state-${booking.status}`}>
                        {booking.status}
                      </span>
                      <p className="amount">₹{booking.status === 'completed' ? (booking.billAmount || booking.serviceId?.basePrice) : (booking.serviceId?.basePrice || 0)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Control Actions Section Block */}
      <div className="quick-actions">
        <h3>Quick Navigation Panel</h3>
        <div className="actions-grid">
          <button
            className="action-card"
            onClick={() => setActiveTab('bookings')}
          >
            <span className="action-icon">📋</span>
            <p>Live Bookings Screen</p>
          </button>
          <button
            className="action-card"
            onClick={() => setActiveTab('history')}
          >
            <span className="action-icon">📊</span>
            <p>Closed Archive History</p>
          </button>
          <button
            className="action-card"
            onClick={() => setActiveTab('services')}
          >
            <span className="action-icon">⚙️</span>
            <p>Catalogue Management</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeView;