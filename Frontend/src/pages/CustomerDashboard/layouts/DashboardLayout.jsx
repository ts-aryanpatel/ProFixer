import React from 'react';
import Sidebar from "../components/Sidebar.jsx";
import '../CustomerDashboard.css';

const DashboardLayout = ({ children, activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <div className="dashboard-container">
      
      {/* MOBILE STICKY TOP HEADER */}
      <header className="mobile-top-header">
        <div className="mobile-logo">ProFixer</div>
        
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          ☰
        </button>
      </header>

      {/* SIDEBAR (Ab isme mobile states bhi jaengi) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content Overlay for Mobile when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;