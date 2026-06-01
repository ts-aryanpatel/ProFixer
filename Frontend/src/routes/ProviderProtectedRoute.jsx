// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    const providerData = localStorage.getItem('provider');

    // 1. Agar token nahi hai, toh seedhe customer login par bhejo
    if (!token || token === 'undefined' || token === 'null') {
        return <Navigate to="/provider/login" replace />;
    }

    // 2. Agar token hai, par browser me logged in banda "provider" hai,
    // toh use customer dashboard access karne mat do, provider dashboard par redirect karo
    if (providerData) {
        try {
            const provider = JSON.parse(providerData);
            if (provider?.role === 'provider') {
                return <Navigate to="/provider/dashboard" replace />;
            }
        } catch (error) {
            console.error("Error parsing provider data in ProtectedRoute:", error);
        }
    }

    // Agar token hai aur koi provider data nahi hai (yani customer hai), toh allow karo
    return children;
};

export default ProtectedRoute;