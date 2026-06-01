import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, userRole }) => {

  const [user, setUser] = useState({
    name: 'Provider',
    role: 'Service Professional',
    initials: 'P'
  });

  useEffect(() => {
    const storedProvider = localStorage.getItem('provider');

    if (storedProvider) {
      const providerData = JSON.parse(storedProvider);

      const displayName = providerData.fullName || providerData.name || 'Provider';

      const nameParts = displayName.trim().split(/\s+/);
      const initials = nameParts.length > 1
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : nameParts[0] ? nameParts[0][0].toUpperCase() : 'P';

      setUser({
        name: displayName,
        role: providerData.category || providerData.role || 'Service Professional',
        initials: initials,
        avatar: providerData.avatar || null // Dynamic avatar capability added
      });
    }
  }, [activeTab]);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Current Bookings', icon: '📅' },
    { id: 'services', label: 'My Services', icon: '🛠️' },
  ];

  const accountItems = [
    { id: 'history', label: 'Working History', icon: '📜' },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      // Backend controller ko target karne ke liye exact route `/provider/auth/logout`
      await axios.post(
        `${API_URL}/provider/auth/logout`,
        {},
        {
          withCredentials: true, // Backend req.cookies.refreshToken ko read kar sake isliye zaroori hai
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      alert("Logged out successfully!");
    } catch (error) {
      // Agar token expire ho chuka hai ya session nahi milti toh backend error yahan catch hoga
      console.error("Logout failed on backend:", error.response?.data?.message || error.message);
    } finally {
      // Safeguard: Backend fail ho ya pass, frontend se data clean karke redirect karna compulsory hai
      localStorage.removeItem('accessToken');
      localStorage.removeItem('provider');
      window.location.href = '/provider/login';
    }
  };

  return (
    <aside className={`profixer-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>

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
            {accountItems.map((item) => (
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