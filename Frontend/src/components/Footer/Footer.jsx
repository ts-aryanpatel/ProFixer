import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css";

const Footer = () => {
    return (
        <footer className='footer'>
            <div className='footer-container'>
                <div className='footer-copyright'>
                    <p>&copy; 2026 <span>ProFixer</span>. All rights reserved.</p>
                </div>

                <div className='footer-links'>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Services</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
            </div>
        </footer>
    )
};

export default Footer;