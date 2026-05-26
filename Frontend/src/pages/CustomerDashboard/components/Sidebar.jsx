import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'findpros', label: 'Find Professionals', icon: '🔍' },
  ];

  const bookingItems = [
    { id: 'mybookings', label: 'My Bookings', icon: '📅' },
    { id: 'history', label: 'Booking History', icon: '📜' },
  ];

  // Tab click hone par mobile me menu automatic close hona chahiye
  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false); 
  };

  return (
    <aside className={`profixer-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
      
      {/* Mobile Close Button */}
      <button 
        className="sidebar-close-btn"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        ✕
      </button>

      <div className="sidebar-profile">
        <div className="profile-avatar">AK</div>
        <div className="profile-info">
          <h4 className="user-name">Anil Kumar</h4>
          <span className="user-role">Customer</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-section">
          <span className="section-title">Quick Actions</span>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`menu-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="menu-section">
          <span className="section-title">My Account</span>
          <ul>
            {bookingItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`menu-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="menu-btn logout-btn">
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;