import React from 'react';
import { motion } from "framer-motion";
import "./Hero.css";

const Hero = () => {
    return (
        <section className='hero'>
            <div className='hero-container'>

                <motion.div 
                    className='hero-left'
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}>
                    <h1 className='hero-title'>
                        Trusted Local Experts For Every Home Task
                    </h1>
                    <p className='hero-subtitle'>
                        Connecting you with verified professionals for repairs, maintenance, and help in your neighborhood.
                    </p>
                    <div className='search-container'>
                        <div className='search-input-wrapper'>
                            <input 
                                type="text"
                                placeholder='What service do you need? (e.g., Plumber, Electrician)'
                                className='search-input'
                            />
                        </div>
                        <button className='search-btn'>Search</button>
                    </div>
                </motion.div>

                <motion.div 
                    className='hero-right'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
                    <div className='hero-image-wrapper'>
                        <img 
                            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop" 
                            alt="Professional Service Provider"
                            className='hero-image' 
                        />
                        <div className='hero-blob'></div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;