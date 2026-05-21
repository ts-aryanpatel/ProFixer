import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Router import karo
import "./Services.css";

const Services = () => {
    const navigate = useNavigate(); // 2. Hook initialize karo
    
    const popularCategories = [
        { id: 1, name: 'AC Repair', img: 'https://static.vecteezy.com/system/resources/thumbnails/071/837/068/small_2x/technician-repairing-white-wall-mounted-air-conditioner-in-modern-indoor-setting-free-photo.jpg' },
        { id: 2, name: 'House Cleaning', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400' },
        { id: 3, name: 'Plumbing', img: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=400' },
        { id: 4, name: 'Electrician', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400' },
    ];

    return (
        <section id='services' className='services-section'>
            <div className='section-header'>
                <h2 className='section-title'>Popular Categories</h2>
                <p className='section-subtitle'>Explore top-rated professional services near you</p>
            </div>

            <div className='services-grid'>
                {
                    popularCategories.map((category) => (
                        // 3. onClick par navigate laga do aur URL me keyword pass karo
                        <div key={category.id} className='service-card' onClick={() => navigate(`/search-results?keyword=${category.name}&page=1`)}>
                            <div className='service-img-wrapper'>
                                <img src={category.img} alt={category.name} className='service-img' />
                                <div className='card-overlay'></div>
                            </div>
                            <div className='service-info'>
                                <h3>{category.name}</h3>
                                <div className="explore-link">
                                    <span>Explore Services</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};

export default Services;