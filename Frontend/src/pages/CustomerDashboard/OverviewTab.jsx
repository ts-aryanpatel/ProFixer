import React, { useState } from 'react';
import './OverviewTab.css';



const OverviewTab = () => {

    const [searchQuery, setSearchQuery] = useState('');

    const popularCategories = [
        { id: 1, name: 'Electrician', icon: '⚡', itemsCount: '12 Fixers near you' },
        { id: 2, name: 'Plumbing', icon: '🚰', itemsCount: '8 Fixers near you' },
        { id: 3, name: 'Cleaning', icon: '🧹', itemsCount: '15 Fixers near you' },
        { id: 4, name: 'Carpenter', icon: '🪚', itemsCount: '6 Fixers near you' },
        { id: 5, name: 'Appliance Repair', icon: '🔌', itemsCount: '10 Fixers near you' },
        { id: 6, name: 'Painter', icon: '🎨', itemsCount: '5 Fixers near you' }
    ];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Searching for services matching:", searchQuery);
        // 💡 Future Backend Integration: Yahan hum search API hit karenge query ke sath
    };

    return (
        <div className="overview-tab-wrapper">
            <div className="dashboard-welcome-banner">
                <h2>Find the Best Local Services, Instantly 🛠️</h2>
                <p>Book verified experts for home repairs, cleaning, and maintenance near your area.</p>

                <form onSubmit={handleSearchSubmit} className="dashboard-search-form">
                    <div className="search-input-group">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="What service do you need today? (e.g., Electrician, Deep Cleaning)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <button type="submit" className="btn-search-submit">Search</button>
                    </div>
                </form>
            </div>

            <div className="categories-section-head">
                <h3>Popular Categories</h3>
                <p>Select a category to view top-rated local providers</p>
            </div>

            <div className="categories-grid-layout">
                {
                    popularCategories.map((category) => (
                        <div
                            key={category.id}
                            className="category-card-item"
                            onClick={() => console.log(`Navigate to ${category.name} category page`)}
                        >
                            <div className="category-icon-sphere">{category.icon}</div>
                            <div className="category-info-details">
                                <h4>{category.name}</h4>
                                <span>{category.itemsCount}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    );
};


export default OverviewTab;