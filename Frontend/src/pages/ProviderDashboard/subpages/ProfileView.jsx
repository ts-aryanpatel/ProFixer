import React, { useState } from 'react';
import './ProfileView.css';

const ProfileView = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@example.com',
    address: 'Sector 5, Delhi',
    bio: 'Professional AC technician with 5+ years of experience',
    avatar: '',
    rating: 4.8,
    totalJobs: 24,
    services: ['AC Repair', 'AC Service', 'AC Installation'],
    experience: '5+ years',
    certifications: ['Certified AC Technician', 'Safety Certified']
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(profile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveProfile = () => {
    setProfile(editFormData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-view-container">
      <h2 className="section-main-title">My Profile</h2>

      {!isEditing ? (
        <>
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar-large">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span>{profile.name.split(' ').map(n => n[0]).join('')}</span>
                )}
              </div>
              <div className="profile-header-info">
                <h1>{profile.name}</h1>
                <div className="profile-meta">
                  <span className="rating">⭐ {profile.rating}</span>
                  <span className="jobs">✅ {profile.totalJobs} Jobs</span>
                </div>
                <p className="bio">{profile.bio}</p>
              </div>
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                ✎ Edit Profile
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="info-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">{profile.email}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <p className="info-label">Phone</p>
                  <p className="info-value">{profile.phone}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <p className="info-label">Address</p>
                  <p className="info-value">{profile.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="info-section">
            <h3>Services Offered</h3>
            <div className="services-list">
              {profile.services.map((service, idx) => (
                <span key={idx} className="service-tag">{service}</span>
              ))}
            </div>
          </div>

          {/* Experience & Certifications */}
          <div className="info-grid">
            <div className="info-section">
              <h3>Experience</h3>
              <p className="experience-text">{profile.experience}</p>
            </div>
            <div className="info-section">
              <h3>Certifications</h3>
              <ul className="certifications-list">
                {profile.certifications.map((cert, idx) => (
                  <li key={idx}>✓ {cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        // Edit Form
        <div className="profile-edit-card">
          <h3>Edit Profile</h3>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={editFormData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={editFormData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={editFormData.bio}
              onChange={handleInputChange}
              placeholder="Tell customers about yourself"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Experience</label>
            <input
              type="text"
              name="experience"
              value={editFormData.experience}
              onChange={handleInputChange}
              placeholder="e.g., 5+ years"
            />
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSaveProfile}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
