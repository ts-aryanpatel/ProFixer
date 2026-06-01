import React, { useState, useEffect } from 'react';
import './DashboardHomeView.css';

const DashboardHomeView = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalBookings: 24,
    acceptedBookings: 18,
    pendingBookings: 4,
    declinedBookings: 2,
    totalEarnings: 15240,
    thisMonthEarnings: 3500,
    averageRating: 4.8
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 'b1',
      customerName: 'Amit Patel',
      serviceName: 'AC Repair & Service',
      status: 'accepted',
      amount: '₹499',
      date: 'May 30, 2026',
      time: '2:00 PM'
    },
    {
      id: 'b2',
      customerName: 'Priya Singh',
      serviceName: 'Plumbing Repair',
      status: 'pending',
      amount: '₹349',
      date: 'May 30, 2026',
      time: '4:00 PM'
    },
    {
      id: 'b3',
      customerName: 'Rajesh Kumar',
      serviceName: 'Electrical Wiring',
      status: 'accepted',
      amount: '₹599',
      date: 'May 31, 2026',
      time: '10:00 AM'
    }
  ]);

  return (
    <div className="dashboard-home-container">
      <h2 className="section-main-title">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📅</span>
            <h3>Total Bookings</h3>
          </div>
          <p className="stat-value">{stats.totalBookings}</p>
          <p className="stat-label">All time bookings</p>
        </div>

        <div className="stat-card status-accepted">
          <div className="stat-header">
            <span className="stat-icon">✅</span>
            <h3>Accepted</h3>
          </div>
          <p className="stat-value">{stats.acceptedBookings}</p>
          <p className="stat-label">Active & Completed</p>
        </div>

        <div className="stat-card status-pending">
          <div className="stat-header">
            <span className="stat-icon">⏳</span>
            <h3>Pending</h3>
          </div>
          <p className="stat-value">{stats.pendingBookings}</p>
          <p className="stat-label">Awaiting response</p>
        </div>

        <div className="stat-card status-declined">
          <div className="stat-header">
            <span className="stat-icon">❌</span>
            <h3>Declined</h3>
          </div>
          <p className="stat-value">{stats.declinedBookings}</p>
          <p className="stat-label">Not taken</p>
        </div>

        <div className="stat-card earnings">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <h3>Total Earnings</h3>
          </div>
          <p className="stat-value">₹{stats.totalEarnings.toLocaleString()}</p>
          <p className="stat-label">Lifetime earnings</p>
        </div>

        <div className="stat-card earnings-this-month">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <h3>This Month</h3>
          </div>
          <p className="stat-value">₹{stats.thisMonthEarnings.toLocaleString()}</p>
          <p className="stat-label">May earnings</p>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="recent-bookings-section">
        <div className="section-header">
          <h3>Recent Bookings</h3>
          <button
            className="view-all-btn"
            onClick={() => setActiveTab('bookings')}
          >
            View All →
          </button>
        </div>

        <div className="recent-bookings-list">
          {recentBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No Recent Bookings</h3>
              <p>You don't have any recent bookings yet.</p>
            </div>
          ) : (
            recentBookings.map((booking) => (
              <div key={booking.id} className="booking-mini-card">
                <div className="booking-info">
                  <h4>{booking.serviceName}</h4>
                  <p className="customer-name">{booking.customerName}</p>
                  <div className="booking-meta">
                    <span>📆 {booking.date}</span>
                    <span>🕐 {booking.time}</span>
                  </div>
                </div>
                <div className="booking-right">
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <p className="amount">{booking.amount}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button
            className="action-card"
            onClick={() => setActiveTab('bookings')}
          >
            <span className="action-icon">📋</span>
            <p>View Current Bookings</p>
          </button>
          <button
            className="action-card"
            onClick={() => setActiveTab('income')}
          >
            <span className="action-icon">💳</span>
            <p>Check Earnings</p>
          </button>
          <button
            className="action-card"
            onClick={() => setActiveTab('history')}
          >
            <span className="action-icon">📊</span>
            <p>Work History</p>
          </button>
          <button
            className="action-card"
            onClick={() => setActiveTab('profile')}
          >
            <span className="action-icon">👤</span>
            <p>Edit Profile</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeView;
