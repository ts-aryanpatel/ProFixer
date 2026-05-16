import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicesPage.css';

const ServicesPage = () => {
  // 1. All Categories List
  const categories = [
    { id: 'electrician', name: 'Electrician', icon: '⚡' },
    { id: 'plumber', name: 'Plumber', icon: '🚰' },
    { id: 'cleaning', name: 'Cleaning & Pest', icon: '🧹' },
    { id: 'appliances', name: 'AC & Appliances', icon: '❄️' },
    { id: 'carpenter', name: 'Carpenter', icon: '🪚' },
    { id: 'painter', name: 'Painter', icon: '🎨' },
    { id: 'salon', name: 'Salon & Grooming', icon: '✂️' }
  ];

  // 2. State for Tracking Active Category Sidebar
  const [activeCategory, setActiveCategory] = useState('electrician');

  // 3. Dynamic Sub-Services Data (Exactly mirroring future MongoDB model)
  const [subServices, setSubServices] = useState([
    // Electrician
    { id: 101, category: 'electrician', name: 'Fan Repair & Installation', price: 149, time: '30 mins', desc: 'Complete testing, wiring alignment, and capacitor replacement if needed.' },
    { id: 102, category: 'electrician', name: 'Switchboard Fixing', price: 99, time: '20 mins', desc: 'Replacement of faulty switches and secure testing of home internal load.' },
    { id: 103, category: 'electrician', name: 'House Inverter Setup', price: 499, time: '60 mins', desc: 'Safe installation with bypass switch configuration and battery battery health checks.' },
    
    // Plumber
    { id: 201, category: 'plumber', name: 'Tap Leakage Repair', price: 129, time: '15 mins', desc: 'Spindle change and high-grade washer sealing to eliminate persistent drops.' },
    { id: 202, category: 'plumber', name: 'Drain Unclogging', price: 299, time: '40 mins', desc: 'Heavy-duty pressure pipe cleaning for kitchens or washrooms.' },
    
    // Cleaning & Pest Control
    { id: 301, category: 'cleaning', name: 'Sofa Deep Cleaning', price: 799, time: '90 mins', desc: 'Vacuuming, shampoo treatment, and complete sanitization for a 3-seater sofa.' },
    { id: 302, category: 'cleaning', name: 'Full Bathroom Cleaning', price: 499, time: '60 mins', desc: 'Stain removal from wall tiles, deep floor scrubbing, and tap polishing.' },
    
    // AC & Appliance Repair
    { id: 401, category: 'appliances', name: 'AC Jet Servicing', price: 449, time: '45 mins', desc: 'High-pressure water jet filter cleaning, gas pressure checks, and tray wash.' },
    { id: 402, category: 'appliances', name: 'Washing Machine Repair', price: 349, time: '50 mins', desc: 'Drum alignment, motor error diagnostics, and water intake troubleshooting.' },
    
    // Carpenter
    { id: 501, category: 'carpenter', name: 'Door Lock Installation', price: 199, time: '30 mins', desc: 'Fitting handles, deadbolts, or advanced cylindrical locks on wooden frames.' },
    
    // Painter
    { id: 601, category: 'painter', name: 'Wall Crack Fill & Touch-up', price: 599, time: '120 mins', desc: 'Putty scraping, waterproofing layer, and matching color emulsion application.' },
    
    // Salon & Grooming
    { id: 701, category: 'salon', name: 'Men\'s Haircut & Styling', price: 149, time: '30 mins', desc: 'Trending haircut styles with precision lining and premium product wash.' }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter items based on active sidebar tab selection
  const filteredServices = subServices.filter(item => item.category === activeCategory);

  return (
    <div className="services-dir-container">
      <div className="services-dir-header">
        <Link to="/" className="btn-back">&larr; Back to Home</Link>
        <h1>Explore Services</h1>
        <p>Choose a category to find transparent rates and professional experts.</p>
      </div>

      <div className="services-dir-layout">
        {/* Left Side: Categories Sidebar Selector */}
        <aside className="categories-sidebar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`sidebar-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </aside>

        {/* Right Side: Filtered Sub-Services Cards List */}
        <main className="sub-services-content">
          <div className="results-count">
            Showing {filteredServices.length} expert services for <strong>{categories.find(c => c.id === activeCategory)?.name}</strong>
          </div>

          <div className="sub-services-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="sub-service-card">
                <div className="card-main-info">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.desc}</p>
                  
                  <div className="service-metadata">
                    <span className="meta-time">⏱️ {service.time}</span>
                    <span className="meta-warranty">🛡️ Included Warranty</span>
                  </div>
                </div>

                <div className="card-action-side">
                  <div className="service-price">₹{service.price}</div>
                  <button className="btn-add-task" onClick={() => alert(`Added ${service.name} to cart!`)}>
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServicesPage;