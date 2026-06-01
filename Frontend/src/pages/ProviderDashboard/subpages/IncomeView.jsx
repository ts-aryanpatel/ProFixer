import React, { useState } from 'react';
import './IncomeView.css';

const IncomeView = () => {
  const [incomeData, setIncomeData] = useState({
    thisMonth: {
      earnings: 3500,
      bookings: 7,
      pending: 500
    },
    totalEarnings: 15240,
    availableBalance: 3000,
    transactions: [
      {
        id: 't1',
        date: 'May 25, 2026',
        bookingId: '#PF-B1',
        amount: 499,
        status: 'completed',
        description: 'AC Repair & Service'
      },
      {
        id: 't2',
        date: 'May 20, 2026',
        bookingId: '#PF-B2',
        amount: 349,
        status: 'completed',
        description: 'Plumbing Repair'
      },
      {
        id: 't3',
        date: 'May 15, 2026',
        bookingId: '#PF-B3',
        amount: 599,
        status: 'completed',
        description: 'Electrical Wiring'
      },
      {
        id: 't4',
        date: 'May 30, 2026',
        bookingId: '#PF-B4',
        amount: 450,
        status: 'pending',
        description: 'Carpentry Work (pending payment)'
      }
    ]
  });

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountHolder: 'John Doe',
    accountNumber: '****1234',
    ifscCode: 'SBIN0001234'
  });

  const handleRequestPayout = () => {
    if (!payoutAmount || parseInt(payoutAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (parseInt(payoutAmount) > incomeData.availableBalance) {
      alert('Insufficient balance');
      return;
    }
    alert(`Payout request of ₹${payoutAmount} submitted successfully!`);
    setPayoutAmount('');
    setShowPayoutModal(false);
  };

  const completedTransactions = incomeData.transactions.filter(t => t.status === 'completed');
  const pendingTransactions = incomeData.transactions.filter(t => t.status === 'pending');

  return (
    <div className="income-view-container">
      <h2 className="section-main-title">Income & Earnings</h2>

      {/* Main Stats */}
      <div className="income-stats-grid">
        <div className="income-stat-card primary">
          <div className="stat-header">
            <span className="stat-icon">💵</span>
            <h3>Available Balance</h3>
          </div>
          <p className="stat-amount">₹{incomeData.availableBalance.toLocaleString()}</p>
          <p className="stat-description">Ready to withdraw</p>
          <button
            className="payout-btn primary"
            onClick={() => setShowPayoutModal(true)}
          >
            Request Payout
          </button>
        </div>

        <div className="income-stat-card">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <h3>This Month</h3>
          </div>
          <p className="stat-amount">₹{incomeData.thisMonth.earnings.toLocaleString()}</p>
          <p className="stat-description">{incomeData.thisMonth.bookings} bookings</p>
        </div>

        <div className="income-stat-card">
          <div className="stat-header">
            <span className="stat-icon">⏳</span>
            <h3>Pending</h3>
          </div>
          <p className="stat-amount">₹{incomeData.thisMonth.pending.toLocaleString()}</p>
          <p className="stat-description">Awaiting completion</p>
        </div>

        <div className="income-stat-card">
          <div className="stat-header">
            <span className="stat-icon">🏆</span>
            <h3>Lifetime Earnings</h3>
          </div>
          <p className="stat-amount">₹{incomeData.totalEarnings.toLocaleString()}</p>
          <p className="stat-description">Total earned</p>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bank-details-card">
        <div className="card-header">
          <h3>Bank Account Details</h3>
          <button className="edit-btn">Edit</button>
        </div>
        <div className="bank-info">
          <div className="bank-item">
            <span className="bank-label">Account Holder</span>
            <span className="bank-value">{bankDetails.accountHolder}</span>
          </div>
          <div className="bank-item">
            <span className="bank-label">Account Number</span>
            <span className="bank-value">{bankDetails.accountNumber}</span>
          </div>
          <div className="bank-item">
            <span className="bank-label">IFSC Code</span>
            <span className="bank-value">{bankDetails.ifscCode}</span>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="transactions-section">
        <h3>Recent Transactions</h3>

        {completedTransactions.length > 0 && (
          <div className="transaction-group">
            <h4 className="transaction-group-title">Completed</h4>
            <div className="transaction-list">
              {completedTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <p className="transaction-description">{transaction.description}</p>
                    <p className="transaction-meta">
                      {transaction.date} • {transaction.bookingId}
                    </p>
                  </div>
                  <span className="transaction-amount completed">
                    +₹{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingTransactions.length > 0 && (
          <div className="transaction-group">
            <h4 className="transaction-group-title">Pending</h4>
            <div className="transaction-list">
              {pendingTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item pending">
                  <div className="transaction-info">
                    <p className="transaction-description">{transaction.description}</p>
                    <p className="transaction-meta">
                      {transaction.date} • {transaction.bookingId}
                    </p>
                  </div>
                  <span className="transaction-amount pending">
                    +₹{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {incomeData.transactions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💸</div>
            <h3>No Transactions</h3>
            <p>You haven't earned anything yet.</p>
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="modal-overlay" onClick={() => setShowPayoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowPayoutModal(false)}
            >
              ✕
            </button>

            <h2>Request Payout</h2>
            <p className="modal-description">
              Maximum available: <strong>₹{incomeData.availableBalance}</strong>
            </p>

            <div className="form-group">
              <label>Amount to Withdraw</label>
              <div className="amount-input-group">
                <span className="currency">₹</span>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={incomeData.availableBalance}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bank Account</label>
              <div className="account-display">
                <p>{bankDetails.accountHolder}</p>
                <p>{bankDetails.accountNumber}</p>
              </div>
            </div>

            <div className="form-note">
              <p>📋 Payout will be transferred to your registered bank account within 2-3 business days.</p>
            </div>

            <div className="modal-actions">
              <button
                className="action-btn cancel"
                onClick={() => setShowPayoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="action-btn submit"
                onClick={handleRequestPayout}
              >
                Request Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeView;