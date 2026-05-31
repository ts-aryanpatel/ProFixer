import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className='navbar'>
            <div className='nav-container'>
                <Link className='logo' to='/' onClick={() => setIsMenuOpen(false)}>
                    Pro<span>Fixer</span>
                </Link>

                <div className={`burger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <span className='bar'></span>
                    <span className='bar'></span>
                    <span className='bar'></span>
                </div>

                <div className={`nav-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
                    <div className='nav-links'>
                        <Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                    </div>

                    <div className='nav-actions'>
                        <Link to="/provider-auth" className='btn-secondary' onClick={() => setIsMenuOpen(false)}>Join as Provider</Link>
                        <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};


export default Navbar;