import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileView.css';

// Vite ke mutabik base URL fetch kar rha hai
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileView = () => {
  // Schema defaults ke mutabik initial state
  const [profile, setProfile] = useState({
    fullName: 'Loading...',
    email: '',
    phoneNumber: '',
    category: '',
    skills: [],
    bio: '',
    city: '',
    experience: 0,
    averageRating: 0,
    totalJobsCompleted: 0,
    isVerified: false,
    initials: 'P'
  });

  const BIHAR_CITIES = [
    "Hajipur",
    "Patna",
    "Muzaffarpur",
    "Vaishali",
    "Lalganj",
    "Bhagwanpur"
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(profile);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function: Name se initials nikalne ke liye ("Aryan Kumar" -> "AK")
  const generateInitials = (name) => {
    const nameParts = name.trim().split(/\s+/);
    return nameParts.length > 1
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : name[0] ? name[0].toUpperCase() : 'P';
  };

  // 1. GET DATA: Page load hone par backend se fresh profile data lana
  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Aapke backend GET /profile endpoint par request
        const response = await axios.get(`${API_URL}/provider/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data.success) {
          const pData = response.data.data;
          const name = pData.fullName || 'Provider Name';

          const organizedData = {
            fullName: name,
            email: pData.email || '',
            phoneNumber: pData.phoneNumber || '',
            category: pData.category || 'Service Professional',
            skills: pData.skills || [],
            bio: pData.bio || '',
            city: pData.city || '',
            experience: pData.experience || 0,
            averageRating: pData.averageRating || 0,
            totalJobsCompleted: pData.totalJobsCompleted || 0,
            isVerified: pData.isVerified || false,
            initials: generateInitials(name)
          };

          setProfile(organizedData);
          setEditFormData(organizedData);

          // Sidebar aur baki app se sync rakhne ke liye local storage bhi update kar rhe hain
          localStorage.setItem('provider', JSON.stringify(pData));
        }
      } catch (err) {
        console.error("Backend load error, falling back to localstorage data", err);

        // Fallback: Agar backend route me koi dikkat ho, to localStorage se data load ho jaye
        const storedProvider = localStorage.getItem('provider');
        if (storedProvider) {
          const pData = JSON.parse(storedProvider);
          const name = pData.fullName || 'Provider Name';
          const organizedData = {
            fullName: name,
            email: pData.email || '',
            phoneNumber: pData.phoneNumber || '',
            category: pData.category || 'Service Professional',
            skills: pData.skills || [],
            bio: pData.bio || '',
            city: pData.city || '',
            experience: pData.experience || 0,
            averageRating: pData.averageRating || 0,
            totalJobsCompleted: pData.totalJobsCompleted || 0,
            isVerified: pData.isVerified || false,
            initials: generateInitials(name)
          };
          setProfile(organizedData);
          setEditFormData(organizedData);
        }
      }
    };

    fetchFreshProfile();
  }, [isEditing]); // Jab bhi user edit mode close/save karega, fresh data reload hoga

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // UI par skill tags add karne ka frontend handler
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !editFormData.skills.includes(skillInput.trim())) {
      setEditFormData({
        ...editFormData,
        skills: [...editFormData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  // Skill tag remove karne ke liye handler
  const handleRemoveSkill = (skillToRemove) => {
    setEditFormData({
      ...editFormData,
      skills: editFormData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // 2. PUT/PATCH DATA: Update details ko backend pipeline me push karna
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = '/provider/login';
        return;
      }

      // ⚡ AXIOS CALL: Aapke update provider controller ko hitting
      const response = await axios.patch(
        `${API_URL}/provider/profile/update`,
        {
          fullName: editFormData.fullName,
          bio: editFormData.bio,
          city: editFormData.city,
          experience: Number(editFormData.experience),
          skills: editFormData.skills // Full array list passing
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const freshData = response.data.data;
        const name = freshData.fullName || 'Provider Name';

        const updatedState = {
          fullName: name,
          email: freshData.email,
          phoneNumber: freshData.phoneNumber,
          category: freshData.category,
          skills: freshData.skills || [],
          bio: freshData.bio || '',
          city: freshData.city || '',
          experience: freshData.experience || 0,
          averageRating: freshData.averageRating || 0,
          totalJobsCompleted: freshData.totalJobsCompleted || 0,
          isVerified: freshData.isVerified || false,
          initials: generateInitials(name)
        };

        setProfile(updatedState);

        // Pure response data database local storage me update
        localStorage.setItem('provider', JSON.stringify(freshData));

        setIsEditing(false);
        alert('Profile database se successfully sync ho gayi hai! 🎉');
      }
    } catch (error) {
      console.error("Backend Update Profile Connection Error:", error);
      alert(error.response?.data?.message || "Server par profile update karne me fail hua.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-view-container">
      <h2 className="section-main-title">My ProFixer Profile</h2>

      {!isEditing ? (
        <>
          {/* Main Profile Header Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar-large">
                <span className="avatar-text">{profile.initials}</span>
              </div>
              <div className="profile-header-info">
                <div className="name-wrapper">
                  <h1>{profile.fullName}</h1>
                  {profile.isVerified && <span className="verified-badge">✓ Verified Partner</span>}
                </div>
                <p className="category-tag-title">{profile.category}</p>

                <div className="profile-meta">
                  <span className="rating">⭐ {profile.averageRating} Rating</span>
                  <span className="jobs">💼 {profile.totalJobsCompleted} Jobs Finished</span>
                  <span className="exp">⏳ {profile.experience} Years Exp.</span>
                </div>
                <p className="bio">{profile.bio || "No bio added yet. Click edit profile to add yours!"}</p>
              </div>
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                ✎ Edit Profile
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="info-section">
            <h3>Account & Service Area</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <p className="info-label">Email Address</p>
                  <p className="info-value">{profile.email}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <p className="info-label">Phone Number</p>
                  <p className="info-value">{profile.phoneNumber}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <p className="info-label">Operational City</p>
                  <p className="info-value" style={{ textTransform: 'capitalize' }}>{profile.city || 'Not Set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specialized Skill Tags Mapping */}
          <div className="info-section">
            <h3>Specialized Skills Tags</h3>
            <div className="services-list">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span key={idx} className="service-tag">{skill}</span>
                ))
              ) : (
                <p className="no-data-text">No additional skill tags listed yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Dynamic Edit Form */
        <div className="profile-edit-card">
          <h3>Update Professional Info</h3>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={editFormData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={editFormData.email}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={editFormData.phoneNumber}
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">


              <label>Operational City</label>
              <select
                name="city"
                value={editFormData.city}
                onChange={handleInputChange}
                required
                className="city-dropdown-select"
              >
                <option value="">-- Select Your Working City --</option>
                {BIHAR_CITIES.map((cityOpt, index) => (
                  <option key={index} value={cityOpt}>{cityOpt}</option>
                ))}
              </select>


              {/* <label>Operational City</label>
              <input
                type="text"
                name="city"
                value={editFormData.city}
                onChange={handleInputChange}
                placeholder="e.g. Hajipur"
                required
              /> */}
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={editFormData.experience}
                onChange={handleInputChange}
                placeholder="Years of experience"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio (Max 500 characters)</label>
            <textarea
              name="bio"
              value={editFormData.bio}
              onChange={handleInputChange}
              placeholder="Tell customers about your workflow expertise..."
              rows="4"
              maxLength="500"
            ></textarea>
          </div>

          {/* Interactive Tag UI input */}
          <div className="form-group">
            <label>Add Skill Tags</label>
            <div className="skill-input-wrapper">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g., Inverter setup, Copper piping, House wiring"
              />
              <button type="button" onClick={handleAddSkill} className="btn-add-tag">Add</button>
            </div>
            <div className="edit-skills-container">
              {editFormData.skills.map((skill, idx) => (
                <span key={idx} className="edit-skill-tag">
                  {skill} <button type="button" onClick={() => handleRemoveSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Framework Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;