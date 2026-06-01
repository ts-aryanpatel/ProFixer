import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkingHistoryView.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const WorkingHistoryView = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      // Exactly matching: GET /api/booking/provider/bookings
      const response = await axios.get(`${API_URL}/booking/provider/bookings`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // Isolate closed/terminal states for historical analytics logs
      const historicalData = (response.data.data || []).filter(booking => 
        ['completed', 'rejected', 'cancelled'].includes(booking.status)
      );
      setHistory(historicalData);
    } catch (error) {
      console.error("Error retrieving historical logs:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Array Sorting Engine
  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timeSlot?.date) - new Date(a.timeSlot?.date);
    } else if (sortBy === 'amount') {
      return (b.billAmount || 0) - (a.billAmount || 0);
    }
    return 0;
  });

  // Calculate high-level performance metrics based entirely on backend data points
  const stats = {
    totalCompleted: history.filter(h => h.status === 'completed').length,
    totalCanceled: history.filter(h => ['cancelled', 'rejected'].includes(h.status)).length,
    totalEarnings: history.reduce((sum, h) => sum + (h.status === 'completed' ? (h.billAmount || 0) : 0), 0)
  };

  // Helper dictionary setup for asset icon visualization
  const getCategoryIcon = (category) => {
    const maps = {
      "Electrician": "⚡",
      "Plumber": "𚰣",
      "Cleaning & Pest Control": "🧹",
      "AC & Appliance Repair": "❄️",
      "Carpenter": "🔨",
      "Painter": "🎨",
      "Salon & Grooming": "✂️"
    };
    return maps[category] || "🛠️";
  };

  return (
    <div className="working-history-container">
      <h2 className="section-main-title">Working History</h2>

      {/* Metrics Performance Tracker Panels */}
      <div className="history-stats">
        <div className="stat-box completed">
          <span className="stat-icon">✅</span>
          <div>
            <p className="stat-label">Jobs Completed</p>
            <p className="stat-number">{stats.totalCompleted}</p>
          </div>
        </div>
        <div className="stat-box canceled">
          <span className="stat-icon">❌</span>
          <div>
            <p className="stat-label">Canceled / Rejected</p>
            <p className="stat-number">{stats.totalCanceled}</p>
          </div>
        </div>
        <div className="stat-box earnings">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-label">Total Net Earnings</p>
            <p className="stat-number">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter Control Section */}
      <div className="sort-controls">
        <label htmlFor="sortBy">Sort order allocation:</label>
        <select 
          id="sortBy"
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent Jobs</option>
          <option value="amount">Highest Revenue Generated</option>
        </select>
      </div>

      {/* Data Mapping Flow */}
      {loading ? (
        <div className="loader">Accessing cloud historical data files...</div>
      ) : sortedHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No Operational Records</h3>
          <p>You have not logged any terminal service historical checkpoints yet.</p>
        </div>
      ) : (
        <div className="history-list">
          {sortedHistory.map((work) => (
            <div key={work._id} className={`history-card status-${work.status}`}>

              {/* Card Header */}
              <div className="history-card-header">
                <div className="service-info">
                  <span className="service-icon">
                    {getCategoryIcon(work.serviceId?.category)}
                  </span>
                  <div>
                    <h3>{work.serviceId?.name || "Legacy Service Task"}</h3>
                    <p className="customer-name">Client: {work.customerId?.name || "Anonymous User"}</p>
                  </div>
                </div>
                <div className="completion-info">
                  <span className={`status-pill pill-${work.status}`}>
                    {work.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="history-card-body">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div>
                      <p className="detail-label">Service Date</p>
                      <p className="detail-value">
                        {new Date(work.timeSlot?.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕐</span>
                    <div>
                      <p className="detail-label">Allocated Slot</p>
                      <p className="detail-value">{work.timeSlot?.time}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <div>
                      <p className="detail-label">Invoiced Amount</p>
                      <p className="detail-value price-highlight">
                        ₹{work.status === 'completed' ? work.billAmount : 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-context Metadata Section (Address Reference for historical lookup) */}
                <div className="history-address-block">
                  <p className="address-text-title">📍 Execution Address Target</p>
                  <p className="address-text-body">
                    {work.serviceAddress?.street}, {work.serviceAddress?.city}, {work.serviceAddress?.state} - {work.serviceAddress?.pincode}
                  </p>
                </div>
              </div>

              {/* Card Footer Metrics */}
              <div className="history-card-footer">
                <span className="payment-method-tag">
                  Method: {work.paymentMethod?.toUpperCase()} | Status: {work.paymentStatus?.toUpperCase()}
                </span>
                <span className="timestamp-tracker">
                  Logged: {new Date(work.updatedAt).toLocaleDateString()}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkingHistoryView;