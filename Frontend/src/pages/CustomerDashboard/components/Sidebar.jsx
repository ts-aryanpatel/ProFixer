import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {

  const [user, setUser] = useState({
    name: 'User',
    role: 'Customer',
    initials: 'U',
    avatar: ''
  });

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');

    if (storedCustomer) {
      const customerData = JSON.parse(storedCustomer);

      const nameParts = customerData.name ? customerData.name.split(' ') : [];
      const initials = nameParts.length > 1
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : nameParts[0] ? nameParts[0][0].toUpperCase() : 'U';

      setUser({
        name: customerData.name,
        role: customerData.role || 'Customer',
        initials: initials,
        avatar: customerData.avatar || ''
      });
    }
  }, [activeTab]);

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

  const handleLogout = async () => {
    try {

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/customer/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}` // 👈 Yeh line zaroori hai middleware ke liye
          }
        }
      );

      if (response.data.success) {
        alert("Logged out successfully from server!");
      }


    } catch (error) {
      console.error("Backend logout failed:", error.response?.data?.message || error.message);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('customer');

      window.location.href = '/login';
    }
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

      <div
        className={`sidebar-profile ${activeTab === 'profile' ? 'active-profile' : ''}`}
        onClick={() => handleTabClick('profile')}
        style={{ cursor: 'pointer' }}
      >
        <div className="profile-avatar">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="sidebar-avatar-img"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            user.initials
          )}
        </div>
        <div className="profile-info">
          <h4 className="user-name">{user.name}</h4>
          <span className="user-role">{user.role}</span>
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
        <button className="menu-btn logout-btn" onClick={handleLogout}>
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;