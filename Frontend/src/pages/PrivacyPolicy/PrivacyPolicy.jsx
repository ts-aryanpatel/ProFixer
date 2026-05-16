import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./PrivacyPolicy.css";

const PrivacyPolicy = ({ onBack }) => {

     useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='privacy-container'>
            <div className='privacy-header'>
                <Link to="/" className='btn-back' >&larr; Back To Home</Link>
                <h1>Privacy Policy</h1>
                <p className='last-updated'>Last Updated: May 2026</p>
            </div>

            <div className='privacy-content'>
                <section className='privacy-section'>
                    <h2>1. Information We Collect</h2>
                    <p>
                        At ProFixer, we collect information to provide better services to our users. This includes personal identification information (Name, email address, phone number) when you register as a Customer or Service Provider, as well as location data to connect you with local experts.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the collected information to facilitate service bookings, verify professional profiles, process secure payments, and send important updates regarding your tasks. Your location is strictly used to match jobs locally.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>3. Data Security & Protection</h2>
                    <p>
                        We implement robust security measures, including token-based authentication (JWT) and secure database protocols, to protect your personal data from unauthorized access, alteration, or disclosure.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>4. Third-Party Services</h2>
                    <p>
                        ProFixer may use trusted third-party services for maps/location matching and secure payment processing. These third parties have access to your information only to perform specific tasks on our behalf.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;