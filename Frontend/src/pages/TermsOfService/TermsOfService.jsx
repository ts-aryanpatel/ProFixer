import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './TermsOfService.css';

const TermsOfService = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='terms-container'>
            <div className='terms-header'>
                <Link to="/" className='btn-back'>&larr; Back to Home</Link>
                <h1>Terms of Service</h1>
                <p className='last-updated'>Last Updated: May 2026</p>
            </div>

            <div className='terms-content'>
                <p className='terms-intro'>
                    Welcome to ProFixer. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before booking any services.
                </p>

                <section className="terms-section">
                    <h2>1. Platform Services & User Roles</h2>
                    <p>
                        ProFixer operates as an aggregator marketplace that connects independent Service Providers (professionals) with Customers looking for home repairs and maintenance tasks. ProFixer does not directly employ the service professionals listed on the platform.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>2. User Accounts & Verification</h2>
                    <p>
                        To use certain features, you must register for an account using verified contact details. You are responsible for maintaining the confidentiality of your account credentials (JWT tokens and passwords) and for all activities that occur under your account.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>3. Bookings, Cancellations & Pricing</h2>
                    <p>
                        All service prices are transparently displayed before confirmation. Any changes during the task execution must be mutually agreed upon. Cancellations made within 2 hours of the scheduled slot may incur a standard convenience fee.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>4. Payments & Security</h2>
                    <p>
                        Payments can be settled securely via integrated online channels or after successful job completion. Users agree not to process payments outside the ProFixer framework to protect transaction security and dispute eligibility.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>5. Limitation of Liability</h2>
                    <p>
                        While ProFixer strictly verifies all professionals through a multi-step onboarding process, the platform is not liable for any unforeseen damages, delays, or direct disputes arising from the service provider's on-site conduct.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;