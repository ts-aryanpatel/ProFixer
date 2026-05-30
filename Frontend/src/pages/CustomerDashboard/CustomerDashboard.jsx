import React, { useState } from 'react';
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import HomeView from "./subpages/HomeView.jsx";
import MyBookingsView from "./subpages/MyBookingsView.jsx";
import BookingHistoryView from "./subpages/BookingHistoryView.jsx";
import FindProsView from "./subpages/FindProsView.jsx";
import ServicesView from "./subpages/ServicesView.jsx";
import Profile from "./subpages/Profile.jsx";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [preSelectedCategory, setPreSelectedCategory] = useState(null);

    const renderSubPage = () => {
        switch (activeTab) {
            case 'home':
                return <HomeView setActiveTab={setActiveTab} setPreSelectedCategory={setPreSelectedCategory}/>;
            case 'services':
                return <ServicesView preSelectedCategory={preSelectedCategory} setPreSelectedCategory={setPreSelectedCategory}/>;
            case 'findpros':
                return <FindProsView />;
            case 'mybookings':
                return <MyBookingsView />;
            case 'history':
                return <BookingHistoryView />;
            case 'profile':
                return <Profile />
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
        >
            {renderSubPage()}
        </DashboardLayout>
    );
};


export default CustomerDashboard;