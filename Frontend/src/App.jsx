import React from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService/TermsOfService.jsx";
import ContactUs from "./pages/ContactUs/ContactUs.jsx";
import Footer from "./components/Footer/Footer.jsx";
import About from "./pages/About/About.jsx";
import ServicesPage from "./pages/ServicesPage/ServicesPage.jsx";
import Pricing from "./pages/Pricing/Pricing.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {

  const location = useLocation();

  const isDashboard = location.pathname.includes('/customer-dashboard');

  return (
    <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      { !isDashboard && <Navbar /> }

      <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/customer-dashboard" element={ <ProtectedRoute> <CustomerDashboard /> </ProtectedRoute>} />
          </Routes> 
      </main>

      { !isDashboard && <Footer /> }
    </div>
  );
}

export default App
