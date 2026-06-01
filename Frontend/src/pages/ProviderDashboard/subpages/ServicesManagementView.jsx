import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServicesManagementView.css';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ServicesManagementView = () => {
    const [services, setServices] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [providerCategory, setProviderCategory] = useState('');
    
    // Form State mapped exactly to your Mongoose Schema
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        duration: '' 
    });

    useEffect(() => {
        // Read stored provider category from localStorage to customize UI headings if needed
        const storedProvider = localStorage.getItem('provider');
        if (storedProvider) {
            try {
                const providerData = JSON.parse(storedProvider);
                setProviderCategory(providerData.category || '');
            } catch (err) {
                console.error("Error parsing provider from localStorage:", err);
            }
        }
        
        fetchServices();
        fetchSuggestions();
    }, []);

    // 1. Fetch All Existing Services -> GET /api/services/my-services
    const fetchServices = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/services/my-services`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setServices(response.data.allServices || []);
        } catch (error) {
            console.error("Failed to fetch services:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch Category-wise Suggestions dynamically -> GET /api/services/suggestions
    const fetchSuggestions = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/services/suggestions`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            // Your backend dynamically checks key mapping via your constants
            setSuggestions(response.data.suggestions || []);
        } catch (error) {
            console.error("Failed to fetch suggestions:", error.response?.data?.message || error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fills the service title automatically when clicking a suggestion chip
    const handleSuggestionClick = (suggestedName) => {
        setFormData(prev => ({ ...prev, name: suggestedName }));
    };

    // 3. Add Service -> POST /api/services/add
    const handleAddService = async (e) => {
        e.preventDefault();

        if (formData.description.length > 500) {
            alert("Description cannot exceed 500 characters.");
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            
            const serviceData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                basePrice: Number(formData.basePrice),
            };

            if (formData.duration.trim() !== "") {
                serviceData.duration = formData.duration.trim();
            }

            const response = await axios.post(
                `${API_URL}/services/add`, 
                serviceData, 
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );
            
            if (response.data.success) {
                alert(response.data.message || "Service added successfully!");
                setFormData({ name: '', description: '', basePrice: '', duration: '' });
                fetchServices();
            }
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred while adding the service.");
            console.error("Add service error:", error);
        }
    };

    // 4. Delete Service -> DELETE /api/services/delete/:id
    const handleDeleteService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(`${API_URL}/services/delete/${serviceId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            
            if (response.data.success) {
                alert(response.data.message || "Service deleted successfully!");
                fetchServices();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete the service.");
            console.error("Delete service error:", error);
        }
    };

    return (
        <div className="services-container">
            <div className="services-header">
                <h2>Manage Services</h2>
                <p>Configure the specific tasks you perform for your target audience.</p>
            </div>

            <div className="services-grid">
                {/* Form to Add Service */}
                <div className="service-form-section">
                    <h3>Add a New Service</h3>
                    
                    {/* Category-based Smart Suggestions Wrapper */}
                    {suggestions.length > 0 && (
                        <div className="suggestions-wrapper">
                            <span className="suggestions-title">
                                Recommended for <strong>{providerCategory || "Your Category"}</strong>:
                            </span>
                            <div className="suggestion-chips">
                                {suggestions.map((item, idx) => (
                                    <button 
                                        key={idx} 
                                        type="button" 
                                        className="chip-btn"
                                        onClick={() => handleSuggestionClick(item)}
                                    >
                                        + {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleAddService} className="add-service-form">
                        <div className="form-group">
                            <label>Service Title *</label>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="e.g., Deep AC Cleaning" 
                                value={formData.name}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Starting/Base Price (₹) *</label>
                                <input 
                                    type="number" 
                                    name="basePrice"
                                    min="0"
                                    placeholder="Min: 0" 
                                    value={formData.basePrice}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (Optional)</label>
                                <input 
                                    type="text" 
                                    name="duration"
                                    placeholder="e.g., 1-2 Hours" 
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description * ({formData.description.length}/500)</label>
                            <textarea 
                                name="description"
                                rows="4"
                                maxLength="500"
                                placeholder="Explain what is included in this service..." 
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-service-btn">
                            Save Service
                        </button>
                    </form>
                </div>

                {/* Active Catalogue Column */}
                <div className="service-list-section">
                    <h3>Your Active Catalogue ({services.length})</h3>
                    
                    {loading ? (
                        <div className="loader">Fetching catalogue...</div>
                    ) : services.length === 0 ? (
                        <div className="empty-state">
                            <p>No services active. Click on recommendation chips above or type custom entries to create your list.</p>
                        </div>
                    ) : (
                        <div className="services-list-scroll">
                            {services.map((service) => (
                                <div key={service._id} className="service-card">
                                    <div className="service-card-info">
                                        <h4>{service.name}</h4>
                                        <div className="service-meta">
                                            <span className="meta-price">₹{service.basePrice} onwards</span>
                                            <span className="meta-dot">•</span>
                                            <span className="meta-duration">⏱️ {service.duration || "As per requirement"}</span>
                                        </div>
                                        <p className="service-desc">{service.description}</p>
                                    </div>
                                    <button 
                                        type="button"
                                        className="delete-service-btn" 
                                        onClick={() => handleDeleteService(service._id)}
                                        title="Delete Service"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesManagementView;