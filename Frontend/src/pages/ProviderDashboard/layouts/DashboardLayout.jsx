import React from 'react';
import Sidebar from "../components/Sidebar.jsx";
import '../ProviderDashboard.css';

const DashboardLayout = ({ children, activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, userRole }) => {
  return (
    <div className="dashboard-container">

      <header className="mobile-top-header">
        <div className="mobile-logo">ProFixer</div>

        <button
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          ☰
        </button>
      </header>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userRole={userRole}
      />

      {isMobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <main className="dashboard-main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
