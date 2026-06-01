import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrentBookingsView.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CurrentBookingsView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // State for final billing step
  const [closingBookingId, setClosingBookingId] = useState(null);
  const [billingData, setBillingData] = useState({ billAmount: '', paymentStatus: 'pending' });

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch all bookings assigned to this verified Provider
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/booking/provider/bookings`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // Isolate current workspace tasks ('pending', 'accepted', 'in-progress')
      // Completed, rejected, and cancelled requests will be visible in your history view instead.
      const operationalBookings = (response.data.data || []).filter(booking =>
        ['pending', 'accepted', 'in-progress'].includes(booking.status)
      );
      setBookings(operationalBookings);
    } catch (error) {
      console.error("Error retrieving active server bookings:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Process standard workflow updates (accepted, rejected, in-progress) via PUT router mapping
  const handleUpdateStatus = async (bookingId, updatedStatus) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${API_URL}/booking/provider/${bookingId}`,
        { status: updatedStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data.success) {
        alert(`Order assignment successfully marked as ${updatedStatus}.`);
        fetchBookings();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update operation state record.");
    }
  };

  // Complete Booking with custom bill entry verification
  const handleCompleteJobSubmit = async (e, bookingId) => {
    e.preventDefault();
    if (!billingData.billAmount || Number(billingData.billAmount) <= 0) {
      alert("Please specify a valid invoice amount to clear this job layout.");
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${API_URL}/booking/provider/${bookingId}`,
        {
          status: 'completed',
          billAmount: Number(billingData.billAmount),
          paymentStatus: billingData.paymentStatus
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data.success) {
        alert("Invoice settlement logged successfully. Booking moved to completed archives.");
        setClosingBookingId(null);
        setBillingData({ billAmount: '', paymentStatus: 'pending' });
        fetchBookings();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Could not execute job completion sequence.");
    }
  };

  // Compute live contextual layout counts dynamically based on API response matching
  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  // Dictionary setup for dynamic category indicators
  const getCategoryIcon = (category) => {
    const maps = {
      "Electrician": "⚡",
      "Plumber": "🚰",
      "Cleaning & Pest Control": "🧹",
      "AC & Appliance Repair": "❄️",
      "Carpenter": "🔨",
      "Painter": "🎨",
      "Salon & Grooming": "✂️"
    };
    return maps[category] || "🛠️";
  };

  return (
    <div className="bookings-view-container">
      <h2 className="section-main-title">Current Bookings</h2>

      {/* Dynamic Filter Navigation Ribbon */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All Active ({bookings.length})
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
          className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilterStatus('in-progress')}
        >
          In Progress ({bookings.filter(b => b.status === 'in-progress').length})
        </button>
      </div>

      {loading ? (
        <div className="loader">Synchronizing server records...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No Bookings Found</h3>
          <p>Your current pipeline is empty under this status allocation.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className={`booking-card border-${booking.status}`}>

              {/* Card Header Structure */}
              <div className="booking-card-header">
                <div className="service-title-flex">
                  <span className="category-icon">
                    {getCategoryIcon(booking.serviceId?.category)}
                  </span>
                  <div>
                    <h3>{booking.serviceId?.name || "Custom Service Job"}</h3>
                    <p className="booking-id">ID: #{booking._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <span className={`status-badge ${booking.status}`}>
                  {booking.status}
                </span>
              </div>

              {/* Card Data Content Grid Wrapper */}
              <div className="booking-card-body">
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-icon">👤</span>
                    <div>
                      <p className="info-label">Customer</p>
                      <p className="info-value">{booking.customerId?.name || "Anonymous Client"}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <div>
                      <p className="info-label">Phone Reference</p>
                      <p className="info-value">
                        {booking.customerId?.phone || "No contact logged"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <span className="info-icon">📆</span>
                    <div>
                      <p className="info-label">Scheduled Date & Time</p>
                      <p className="info-value">
                        {new Date(booking.timeSlot?.date).toLocaleDateString()} | {booking.timeSlot?.time}
                      </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div>
                      <p className="info-label">Service Target Address [{booking.serviceAddress?.label}]</p>
                      <p className="info-value">
                        {booking.serviceAddress?.street}, {booking.serviceAddress?.city}, {booking.serviceAddress?.state} - {booking.serviceAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <span className="info-icon">💰</span>
                    <div>
                      <p className="info-label">Est. Booking Baseline</p>
                      <p className="info-value">
                        ₹{booking.billAmount > 0 ? booking.billAmount : (booking.serviceId?.price || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">💳</span>
                    <div>
                      <p className="info-label">Payment Track Method</p>
                      <p className="info-value" style={{ textTransform: 'uppercase' }}>
                        {booking.paymentMethod} ({booking.paymentStatus})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Context Workflow Actions */}
              <div className="booking-card-actions-wrapper">
                {booking.status === 'pending' && (
                  <div className="booking-card-actions">
                    <button
                      className="action-btn success"
                      onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                    >
                      ✓ Accept Job
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                    >
                      ✕ Decline Request
                    </button>
                  </div>
                )}

                {booking.status === 'accepted' && (
                  <div className="booking-card-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => handleUpdateStatus(booking._id, 'in-progress')}
                    >
                      🚀 Initiate On-Site Work
                    </button>
                    <a 
                      href={`tel:${booking.customerId?.phone}`} 
                      className="action-btn secondary-link"
                      style={{ textDecoration: 'none', textAlign: 'center' }}
                    >
                      📞 Contact Client
                    </a>
                  </div>
                )}

                {booking.status === 'in-progress' && closingBookingId !== booking._id && (
                  <div className="booking-card-actions">
                    <button 
                      className="action-btn dispatch"
                      onClick={() => setClosingBookingId(booking._id)}
                    >
                      🏁 Finalize Task & Bill Amount
                    </button>
                  </div>
                )}

                {/* Inline Billing Panel Generation Structure */}
                {closingBookingId === booking._id && (
                  <form onSubmit={(e) => handleCompleteJobSubmit(e, booking._id)} className="inline-billing-panel">
                    <h4>Billing & Settlement Clearance Form</h4>
                    <div className="billing-input-fields">
                      <input 
                        type="number" 
                        placeholder="Enter Final Bill Amount (₹) *" 
                        value={billingData.billAmount}
                        onChange={(e) => setBillingData({...billingData, billAmount: e.target.value})}
                        required
                      />
                      <select 
                        value={billingData.paymentStatus}
                        onChange={(e) => setBillingData({...billingData, paymentStatus: e.target.value})}
                      >
                        <option value="pending">COD - Payment Collection Pending</option>
                        <option value="paid">Payment Collected Successfully</option>
                      </select>
                    </div>
                    <div className="billing-form-actions">
                      <button type="submit" className="action-btn success">Submit Invoice Settlement</button>
                      <button type="button" className="action-btn link" onClick={() => setClosingBookingId(null)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentBookingsView;