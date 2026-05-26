import React, { useState, useEffect } from 'react';
import './FindProsView.css';

const FindProsView = () => {
  // Filters ke liye react states
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedSubService, setSelectedSubService] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedExp, setSelectedExp] = useState('all');

  // Sub-services dictionary
  const subServicesMap = {
    electrician: [
      'Ceiling Fan Repair', "Geyser Service", 'Exhaust Fan Repair', 'Inverter/Battery Service', 'Doorbell Installation/Repair', 'Switchboard/Socket Repair', 'Light Fitting', 'Tv Mounting', 'MCB/Fuse Replacement', 'New Internal Wiring', 'Short Circuit Detection', 'Main Line/Meter Wiring', 'Concealed Wiring Repair'
    ],
    plumber: [
      'Tap/Faucet Repair', 'Wash Basin & Sink Repair', 'Toilet/Commode Repair', 'Pipe Leakage', 'Shower/Jet Spray Fix', 'Water Tank Cleaning', 'Water Meter/Motor Installation', 'Geyser Piping', 'New Bathroom Fitting', 'Water Purifier (RO) Inlet', 'Toilet Blockage Clear', 'Sewage Pipe Cleaning', 'Rainwater Pipe Fix'
    ],
    ac_repair: [
      'AC Wet Service', 'AC Gas Charging', 'AC Installation/Uninstallation', 'AC Repair (General Fault)', 'Split/Window AC Specific Fixes'
    ],
    appliance_repair: [
      'Fridge Gas Refill',
      'Thermostat/Relay Replacement',
      'Door Gasket Change',
      'Single/Double Door Specialist Fix',
      'Drum/Motor Repair',
      'Water Inlet/Drain Issue',
      'PCB Repair',
      'Top Load vs Front Load Service',
      'Microwave/Oven Repair',
      'Water Purifier (RO) Service',
      'Chimney Cleaning',
      'Geyser Repair'
    ],
    carpenter: [
      'Door Lock/Handle Installation',
      'Hinge Repair',
      'Drawer Channel Replacement',
      'Chair/Table Repair',
      'Bed Support Fix',
      'Furniture Assembly',
      'TV Wall Unit Setup',
      'Curtain Rod & Blinds Installation',
      'Wall Shelf Mounting',
      'Wardrobe/Almirah Repair',
      'Modular Kitchen Repair',
      'Wood Polishing',
      'Mesh Door'
    ],
    painter: [
      'Full Interior Hourse Paint',
      'Single Room Painting',
      'Wall Putty & Priming',
      'Feature/Accent Wall',
      'Exterior House Paint',
      'Waterproofing',
      'Anti-Damp Treatment',
      'Wall Patch Repair',
      'Grill & Gate Paiting',
      'Stencil Painting',
      'Wall Texture Design',
      'Wood & Metal Polishing'
    ],
    salon_grooming: [
      "Men's Haircut",
      'Beard Shape & Styling',
      "Men's Facial & Cleanup",
      'Hair Color/Dye Application',
      'Head Massage',
      'Haircut',
      'Hair coloring',
      'Hair Spa & Treatement',
      'Blow Dry & Styling',
      'Facial & Cleanup',
      'Waxing',
      'Threading',
      'Manicure & Pedicure',
      'Bleach & Detan',
      'Bridal/Groom Makeup',
      'Party Makeup',
      'Saree Draping'
    ],
    cleaning_pest: [
      'Full House Deep Cleaning',
      'Kitchen Deep Cleaning',
      'Bathroom Deep Cleaning',
      'Balcony & Terrace Cleaning',
      'Sofa/Couch Cleaning',
      'Mattress Cleaning',
      'Carpet/Rug Shampooing',
      'Curtain & Blind Cleaning',
      'General Pest Control',
      'Termite Control',
      'Bed Bug Treatment',
      'Rodent/Rat Control',
      'Anti-Mosquito Treatment'
    ]
  };

  // Jab main category badle, to sub-service filter ko auto-reset kar do 'all' par
  useEffect(() => {
    setSelectedSubService('all');
  }, [selectedSkill]);

  // Extended Professionals Data List
  const allProviders = [
    {
      id: 'p1',
      name: 'Priya Gupta',
      avatar: '👩‍🔧',
      skill: 'plumber',
      role: 'Verified Expert Plumber',
      rating: 4.8,
      jobs: '120+',
      basePrice: 129,
      distance: '0.5 km away',
      expNum: 10,
      exp: '10+ Years Experience',
      specialties: ['Tap/Faucet Repair', 'Flush Tank Leakage Repair', 'Wash Basin & Sink Repair']
    },
    {
      id: 'p2',
      name: 'Rahul Sharma',
      avatar: '👨‍🔧',
      skill: 'electrician',
      role: 'Senior Electrician',
      rating: 4.9,
      jobs: '95+',
      basePrice: 499,
      distance: '1.2 km away',
      expNum: 8,
      exp: '8+ Years Experience',
      specialties: ['Switchboard/Socket Repair', 'Inverter Servicing & Setup', 'Short Circuit Detection']
    },
    {
      id: 'p3',
      name: 'Amit Kumar',
      avatar: '👨‍💻',
      skill: 'computer',
      role: 'PC & Laptop Specialist',
      rating: 4.2,
      jobs: '60+',
      basePrice: 799,
      distance: '2.5 km away',
      expNum: 5,
      exp: '5+ Years Experience',
      specialties: ['OS Installation', 'Hardware Repair', 'Data Recovery']
    }
  ];

  // Filter Logic
  const filteredProviders = allProviders.filter(pro => {
    const matchSkill = selectedSkill === 'all' || pro.skill === selectedSkill;
    const matchSubService = selectedSubService === 'all' || pro.specialties.includes(selectedSubService);
    const matchRating = selectedRating === 'all' || (selectedRating === '4.5+' && pro.rating >= 4.5);
    const matchExp = selectedExp === 'all' || pro.expNum >= parseInt(selectedExp);

    let matchPrice = true;
    if (selectedPrice === 'low') matchPrice = pro.basePrice < 200;
    else if (selectedPrice === 'mid') matchPrice = pro.basePrice >= 200 && pro.basePrice <= 500;
    else if (selectedPrice === 'premium') matchPrice = pro.basePrice > 500;

    return matchSkill && matchSubService && matchRating && matchPrice && matchExp;
  });

  // Reset function to clear all selected filters
  const resetFilters = () => {
    setSelectedRating('all');
    setSelectedSkill('all');
    setSelectedSubService('all');
    setSelectedPrice('all');
    setSelectedExp('all');
  };

  return (
    <div className="find-pros-container">
      <div className="find-pros-header">
        <h2 className="section-main-title">Meet Our Local Experts</h2>
        <p className="section-subtitle-text">Browse and filter highly-rated verified professionals near your area.</p>
      </div>

      {/* FILTER CONTROL BAR PANEL */}
      <div className="filter-bar-wrapper">
        <div className="filter-row-top">

          {/* 1. Main Category/Skill Dropdown */}
          <div className="filter-group">
            <label>Category Type:</label>
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="filter-dropdown">
              <option value="all">All Categories</option>
              <option value="electrician">Electricians</option>
              <option value="plumber">Plumbers</option>
              <option value="ac_repair">AC Repair</option>
              <option value="appliance_repair">Appliance Repair</option>
              <option value="carpenter">Carpenters</option>
              <option value="painter">Painters</option>
              <option value="salon_grooming">Salon & Grooming</option>
              <option value="cleaning_pest">Cleaning & Pest Control</option>
            </select>
          </div>

          {/* 2. Sub-Services Dropdown (Hamehsa dikhega, par category select na hone par option list empty/disabled rahegi) */}
          <div className="filter-group">
            <label>Specific Service:</label>
            <select
              value={selectedSubService}
              onChange={(e) => setSelectedSubService(e.target.value)}
              className={`filter-dropdown ${selectedSkill === 'all' ? 'disabled-dropdown' : 'highlight-dropdown'}`}
              disabled={selectedSkill === 'all'}
            >
              <option value="all">
                {selectedSkill === 'all' ? 'Select a Category First' : 'All Sub-Services'}
              </option>
              {selectedSkill !== 'all' && subServicesMap[selectedSkill] && (
                subServicesMap[selectedSkill].map((service, index) => (
                  <option key={index} value={service}>{service}</option>
                ))
              )}
            </select>
          </div>

          {/* 3. Ratings Dropdown */}
          <div className="filter-group">
            <label>Ratings:</label>
            <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)} className="filter-dropdown">
              <option value="all">All Ratings</option>
              <option value="4.5+">Top Rated (4.5+ ★)</option>
            </select>
          </div>

          {/* 4. Price Budget Dropdown */}
          <div className="filter-group">
            <label>Service Budget:</label>
            <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className="filter-dropdown">
              <option value="all">Any Budget</option>
              <option value="low">Budget Friendly (Under ₹200)</option>
              <option value="mid">Mid Range (₹200 - ₹500)</option>
              <option value="premium">Premium Service (Above ₹500)</option>
            </select>
          </div>

          {/* 5. Experience Dropdown */}
          <div className="filter-group">
            <label>Experience:</label>
            <select value={selectedExp} onChange={(e) => setSelectedExp(e.target.value)} className="filter-dropdown">
              <option value="all">Any Experience</option>
              <option value="5">5+ Years</option>
              <option value="10">10+ Years</option>
            </select>
          </div>

          {/* 6. Hamesha Dikhne Wala Reset Button */}
          <div className="filter-group reset-button-group">
            <label>&nbsp;</label> {/* Align karne ke liye khali label */}
            <button className="main-reset-filter-btn" onClick={resetFilters}>
              Reset ↺
            </button>
          </div>

        </div>

        {/* Filter Action Meta Info Bar */}
        <div className="filter-action-meta-row">
          <div className="active-results-count">
            Showing <strong>{filteredProviders.length}</strong> verified professionals
          </div>
        </div>
      </div>

      {/* PROFESSIONALS LIST CARDS */}
      {filteredProviders.length === 0 ? (
        <div className="no-pros-fallback">
          <span>🔍</span>
          <h3>No Experts Found</h3>
          <p>Try resetting or relaxing your filter settings to discover more professionals nearby.</p>
          <button className="fallback-reset-btn" onClick={resetFilters}>Reset Filters</button>
        </div>
      ) : (
        <div className="pros-vertical-list">
          {filteredProviders.map((pro) => (
            <div key={pro.id} className="pro-detailed-row-card">

              <div className="pro-main-identity-block">
                <div className="pro-row-avatar">{pro.avatar}</div>
                <span className="row-verified-tag">✓ Verified</span>
              </div>

              <div className="pro-row-mid-details">
                <div className="pro-name-title-flex">
                  <h3>{pro.name}</h3>
                  <span className="pro-row-distance">📍 {pro.distance}</span>
                </div>
                <p className="pro-row-role">{pro.role}</p>
                <p className="pro-row-exp">💼 {pro.exp}</p>

                <div className="pro-row-stats-badges">
                  <span className="row-badge rating-badge">⭐ {pro.rating} / 5</span>
                  <span className="row-badge jobs-badge">🛠️ {pro.jobs} Completed Jobs</span>
                  <span className="row-badge price-badge">💰 Starts at ₹{pro.basePrice}</span>
                </div>

                <div className="pro-specialties-tags-flex">
                  {pro.specialties.map((spec, index) => (
                    <span key={index} className="spec-mini-pill">{spec}</span>
                  ))}
                </div>
              </div>

              <div className="pro-row-action-block">
                <button className="row-primary-btn">Book Appointment</button>
                <button className="row-secondary-btn">View Profile & Reviews</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindProsView;