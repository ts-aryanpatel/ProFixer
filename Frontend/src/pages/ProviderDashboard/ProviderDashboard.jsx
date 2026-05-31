import React, { useState } from 'react';
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import DashboardHomeView from "./subpages/DashboardHomeView.jsx";
import CurrentBookingsView from "./subpages/CurrentBookingsView.jsx";
import ProfileView from "./subpages/ProfileView.jsx";
import WorkingHistoryView from "./subpages/WorkingHistoryView.jsx";
import IncomeView from "./subpages/IncomeView.jsx";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderSubPage = () => {
        switch (activeTab) {
            case 'home':
                return <DashboardHomeView setActiveTab={setActiveTab} />;
            case 'bookings':
                return <CurrentBookingsView />;
            case 'history':
                return <WorkingHistoryView />;
            case 'income':
                return <IncomeView />;
            case 'profile':
                return <ProfileView />;
            default:
                return <div>Tab Not Found</div>;
        }
    };

    return (
        <DashboardLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            userRole="Provider"
        >
            {renderSubPage()}
        </DashboardLayout>
    );
};

export default ProviderDashboard;
