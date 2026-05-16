import React from 'react';
import Hero from "./Components/Hero.jsx";
import HowItWorks from "./Components/HowItWorks.jsx";
import Services from "./Components/Services.jsx";
import Testimonials from "./Components/Testimonials.jsx";
import "./LandingPage.css";

const LandingPage = () => {
    return (
        <div className='Landing-page'>
            <Hero />

            <HowItWorks />

            <Services />

            <Testimonials />
        </div>
    );
};


export default LandingPage;