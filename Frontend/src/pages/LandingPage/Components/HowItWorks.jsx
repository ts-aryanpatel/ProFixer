import React from 'react';
import { motion } from 'framer-motion';
import "./HowItWorks.css";

const HowItWorks = () => {

    const steps = [
        {
            id: 1,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="step-svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83m0 0a2.999 2.999 0 00-4.14-4.14m4.14 4.14L15.5 13.5m-3.36-3.36L6.5 4.5A2.652 2.652 0 003 8.25l5.83 5.83m0 0a2.999 2.999 0 004.14 4.14m-4.14-4.14L4.5 15.5" />
                </svg>
            ),
            title: "Select Service",
            description: "Choose from our wide range of home repair, cleaning, and maintenance services."
        },
        {
            id: 2,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="step-svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            ),
            title: "Get Match",
            description: "Our platform instantly connects you with verified local experts in your area."
        },
        {
            id: 3,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="step-svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            ),
            title: "Book Provider",
            description: "Schedule a time that works for you and pay securely after the job is successfully done."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 } // Har card 0.2s ke gap par aayega
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <section id='how-it-works' className='how-it-works'>
            <div className='section-container'>
                <h2 className='section-title'>How It Works</h2>
                <p className='section-subtitle'>Get your tasks done in 3 simple and secure steps</p>
            </div>

            <motion.div 
                className='steps-grid'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible" // Jab screen par dikhe tab animate ho
                viewport={{ once: true, amount: 0.2 }}> 
                {
                    steps.map((step) => (
                        <motion.div key={step.id} className='step-card' variants={cardVariants}>
                            <div className='icon-wrapper'>
                                {step.icon}
                                <span className='step-number'>{step.id}</span>
                            </div>
                            <h3 className='step-card-title'>{step.title}</h3>
                            <p className='step-card-desc'>{step.description}</p>
                        </motion.div>
                    ))
                }
            </motion.div>
        </section>
    );
};




export default HowItWorks;