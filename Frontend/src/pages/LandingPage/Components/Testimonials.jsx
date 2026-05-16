import React from 'react';
import './Testimonials.css';

const Testimonials = () => {

    const reviews = [
        {
            id: 1,
            name: "Rahul Sharma",
            role: "Home Owner",
            text: "Getting my AC serviced through ProFixer was incredibly easy. The technician arrived on time, was very professional, and the work was top-notch.",
            avatar: "https://i.pravatar.cc/150?u=priya"
        },
        {
            id: 2,
            name: "Priya Verma",
            role: "Working Professional",
            text: "My laptop suddenly crashed on a busy workday. The ProFixer expert came to my home and fixed it within 2 hours. Truly a lifesaver!",
            
            avatar: "https://i.pravatar.cc/150?u=rahul"
        },
        {
            id: 3,
            name: "Amit Kumar",
            role: "New Resident",
            text: "Finding a trusted plumber in a new city is tough, but ProFixer made it simple. Their transparent pricing and verified pros are a game changer.",
            avatar: "https://i.pravatar.cc/150?u=amit"
        }
    ];

    return (
        <section className='testimonials-section'>
            <div className='section-header'>
                <h2 className='section-title'>What Our Customers Say</h2>
                <p className="section-subtitle">Real stories from people who trust ProFixer for their home tasks</p>
            </div>

            <div className='testimonials-grid'>
                {
                    reviews.map((review) => (
                        <div key={review.id} className='testimonial-card'>
                            <div className='quote-icon'>“</div>
                            <p className='review-text'>{review.text}</p>
                            <div className='user-profile'>
                                <img src={review.avatar} alt={review.name} className='user-avatar' />
                                <div className='user-info'>
                                    <h4>{review.name}</h4>
                                    <span>{review.role}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </section>
    );
};

export default Testimonials;