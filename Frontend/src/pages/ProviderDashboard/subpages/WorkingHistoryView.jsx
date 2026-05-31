import React, { useState } from 'react';
import './WorkingHistoryView.css';

const WorkingHistoryView = () => {
  const [history, setHistory] = useState([
    {
      id: 'h1',
      customerName: 'Amit Patel',
      serviceName: 'AC Repair & Service',
      categoryIcon: '❄️',
      date: 'May 25, 2026',
      completedTime: '2:00 PM - 3:15 PM',
      amount: '₹499',
      rating: 4.8,
      review: 'Great service! Very professional and quick.'
    },
    {
      id: 'h2',
      customerName: 'Priya Singh',
      serviceName: 'Plumbing Repair',
      categoryIcon: '🚰',
      date: 'May 20, 2026',
      completedTime: '10:00 AM - 11:30 AM',
      amount: '₹349',
      rating: 4.5,
      review: 'Good work, fixed the issue completely.'
    },
    {
      id: 'h3',
      customerName: 'Rajesh Kumar',
      serviceName: 'Electrical Wiring',
      categoryIcon: '⚡',
      date: 'May 15, 2026',
      completedTime: '3:00 PM - 4:45 PM',
      amount: '₹599',
      rating: 4.9,
      review: 'Excellent! Very knowledgeable and efficient.'
    },
    {
      id: 'h4',
      customerName: 'Neha Sharma',
      serviceName: 'Carpentry Work',
      categoryIcon: '🔨',
      date: 'May 10, 2026',
      completedTime: '9:00 AM - 1:00 PM',
      amount: '₹450',
      rating: 4.7,
      review: 'Perfect workmanship, very satisfied!'
    },
    {
      id: 'h5',
      customerName: 'Vikram Singh',
      serviceName: 'Home Cleaning',
      categoryIcon: '🧹',
      date: 'May 5, 2026',
      completedTime: '2:00 PM - 3:30 PM',
      amount: '₹299',
      rating: 4.6,
      review: 'Clean and thorough job.'
    }
  ]);

  const [sortBy, setSortBy] = useState('recent');

  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const stats = {
    totalCompleted: history.length,
    averageRating: (history.reduce((sum, h) => sum + h.rating, 0) / history.length).toFixed(1),
    totalEarnings: history.reduce((sum, h) => parseInt(h.amount.replace('₹', '')), 0)
  };

  return (
    <div className="working-history-container">
      <h2 className="section-main-title">Working History</h2>

      {/* Stats */}
      <div className="history-stats">
        <div className="stat-box">
          <span className="stat-icon">✅</span>
          <div>
            <p className="stat-label">Jobs Completed</p>
            <p className="stat-number">{stats.totalCompleted}</p>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon">⭐</span>
          <div>
            <p className="stat-label">Average Rating</p>
            <p className="stat-number">{stats.averageRating}</p>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-label">Total Earned</p>
            <p className="stat-number">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* History List */}
      {sortedHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No Work History</h3>
          <p>You haven't completed any jobs yet.</p>
        </div>
      ) : (
        <div className="history-list">
          {sortedHistory.map((work) => (
            <div key={work.id} className="history-card">

              {/* Header */}
              <div className="history-card-header">
                <div className="service-info">
                  <span className="service-icon">{work.categoryIcon}</span>
                  <div>
                    <h3>{work.serviceName}</h3>
                    <p className="customer-name">{work.customerName}</p>
                  </div>
                </div>
                <div className="completion-info">
                  <div className="rating-badge">
                    <span className="star">⭐</span>
                    <span className="rating-value">{work.rating}</span>
                  </div>
                  <span className="completed-badge">✓ Completed</span>
                </div>
              </div>

              {/* Body */}
              <div className="history-card-body">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div>
                      <p className="detail-label">Date</p>
                      <p className="detail-value">{work.date}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕐</span>
                    <div>
                      <p className="detail-label">Time</p>
                      <p className="detail-value">{work.completedTime}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <div>
                      <p className="detail-label">Earned</p>
                      <p className="detail-value">{work.amount}</p>
                    </div>
                  </div>
                </div>

                {work.review && (
                  <div className="review-section">
                    <p className="review-label">Customer Review:</p>
                    <p className="review-text">"{work.review}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="history-card-footer">
                <button className="detail-btn">View Details</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkingHistoryView;
