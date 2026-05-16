import React from 'react';
import "./Services.css";

const Services = () => {
    
    const popularServices = [
        { id: 1, name: 'AC Repair', price: 'Starts at ₹299', img: 'https://static.vecteezy.com/system/resources/thumbnails/071/837/068/small_2x/technician-repairing-white-wall-mounted-air-conditioner-in-modern-indoor-setting-free-photo.jpg' },
        { id: 2, name: 'House Cleaning', price: 'Starts at ₹499', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400' },
        { id: 3, name: 'Plumbing', price: 'Starts at ₹199', img: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=400' },
        { id: 4, name: 'Electrician', price: 'Starts at ₹149', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400' },
    ];

    return (
        <section id='services' className='services-section'>
            <div className='section-header'>
                <h2 className='section-title'>Popular Services</h2>
                <p className='section-subtitle'>Book professional services at transparent prices</p>
            </div>

            <div className='services-grid'>
                {
                    popularServices.map((service) => (
                        <div key={service.id} className='service-card'>
                            <div className='service-img-wrapper'>
                                <img src={service.img} alt={service.name} className='service-img' />
                            </div>
                            <div className='service-info'>
                                <h3>{service.name}</h3>
                                <p>{service.price}</p>
                                <button className='btn-book'>Book Now</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};

export default Services;