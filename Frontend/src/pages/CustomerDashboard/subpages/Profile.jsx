import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    addresses: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/customer/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (response.data.success) {
          const profileData = response.data.data;
          if (!profileData.addresses) {
            profileData.addresses = [];
          }
          setCustomerData(profileData);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Data fetch karne me problem aayi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...(customerData.addresses || [])];
    if (updatedAddresses[index]) {
      updatedAddresses[index][field] = value;
      setCustomerData({ ...customerData, addresses: updatedAddresses });
    }
  };

  const addEmptyAddress = (e) => {
    e.preventDefault(); 
    setCustomerData({
      ...customerData,
      addresses: [
        ...(customerData.addresses || []),
        { label: 'Home', street: '', city: '', state: '', pincode: '' } // Default label 'Home' rakha hai
      ]
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!isEditing) return;

    setUpdating(true);
    setError('');
    setSuccessMsg('');

    try {
      const accessToken = localStorage.getItem('accessToken');
      const safeAddresses = customerData?.addresses || [];

      const mappedAddresses = safeAddresses.map(addr => ({
        label: addr?.label || 'Home',
        street: addr?.street || '',
        city: addr?.city || '',
        state: addr?.state || '',
        pincode: addr?.pincode || '',
        coordinates: addr?.location?.coordinates || addr?.coordinates || [77.23, 28.61] 
      }));

      const response = await axios.put(`${API_URL}/customer/profile`, {
        name: customerData.name,
        avatar: customerData.avatar,
        addresses: mappedAddresses 
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.data.success) {
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);

        const updatedInfo = response.data.data;
        if (!updatedInfo.addresses) updatedInfo.addresses = [];
        setCustomerData(updatedInfo);
        
        const stored = JSON.parse(localStorage.getItem('customer')) || {};
        stored.name = updatedInfo.name || customerData.name;
        localStorage.setItem('customer', JSON.stringify(stored));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="blue-loader">Loading profile context...</div>;

  return (
    <div className="blue-profile-wrapper">
      <div className="blue-profile-header">
        <div className="avatar-edit-block">
          <img src={customerData?.avatar || 'https://assets.telegraphindia.com/abp/2024/May/1715255108_5-2024-05-09t170926-610.jpg'} alt="User Avatar" />
          {isEditing && (
            <input 
              type="text" 
              name="avatar" 
              placeholder="Paste Avatar Image URL" 
              value={customerData?.avatar || ''} 
              onChange={handleInputChange}
              className="avatar-url-input"
            />
          )}
        </div>
        <h2>{customerData?.name || 'Customer Account'}</h2>
      </div>

      {error && <div className="blue-alert error">{error}</div>}
      {successMsg && <div className="blue-alert success">{successMsg}</div>}

      <form onSubmit={handleUpdate} className="blue-profile-form">
        <div className="blue-form-section">
          <h3>Personal Details</h3>
          
          <div className="input-row">
            <label>Full Name</label>
            {isEditing ? (
              <input type="text" name="name" value={customerData?.name || ''} onChange={handleInputChange} required />
            ) : (
              <p className="static-text-box">{customerData?.name || ''}</p>
            )}
          </div>

          <div className="input-row muted">
            <label>Email (🔒 Read-Only)</label>
            <p className="static-text-box locked">{customerData?.email || ''}</p>
          </div>

          <div className="input-row muted">
            <label>Phone Number (🔒 Read-Only)</label>
            <p className="static-text-box locked">{customerData?.phone || ''}</p>
          </div>
        </div>

        <div className="blue-form-section">
          <h3>Saved Addresses</h3>
          {(customerData?.addresses && Array.isArray(customerData.addresses) ? customerData.addresses : []).map((addr, idx) => (
            <div key={idx} className="address-blue-card">
              
              {/* 🛠️ DROPDOWN FIX: Text input hata kar select option lagaya */}
              {isEditing ? (
                <div className="label-select-wrapper" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Address Type:</label>
                  <select 
                    className="address-label-select"
                    value={addr?.label || 'Home'} 
                    onChange={(e) => handleAddressChange(idx, 'label', e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', background: '#fff' }}
                  >
                    <option value="Home">🏠 Home</option>
                    <option value="Work">🏢 Work</option>
                    <option value="Other">📍 Other</option>
                  </select>
                </div>
              ) : (
                <span className="badge-blue">{addr?.label || 'Address'}</span>
              )}

              {isEditing ? (
                <div className="address-inputs-grid">
                    <label>Street:</label>
                  <input type="text" placeholder="Street" value={addr?.street || ''} onChange={(e) => handleAddressChange(idx, 'street', e.target.value)} required />
                  <label>City:</label>
                  <input type="text" placeholder="City" value={addr?.city || ''} onChange={(e) => handleAddressChange(idx, 'city', e.target.value)} required />
                  <label>State:</label>
                  <input type="text" placeholder="State" value={addr?.state || ''} onChange={(e) => handleAddressChange(idx, 'state', e.target.value)} required />
                  <label>Pincode:</label>
                  <input type="text" placeholder="Pincode" value={addr?.pincode || ''} onChange={(e) => handleAddressChange(idx, 'pincode', e.target.value)} required />
                </div>
              ) : (
                <p className="address-display-text">{`${addr?.street || ''}, ${addr?.city || ''}, ${addr?.state || ''} - ${addr?.pincode || ''}`}</p>
              )}
            </div>
          ))}

          {isEditing && (
            <button 
              type="button" 
              className="btn-blue-secondary add-address-btn" 
              onClick={addEmptyAddress}
              style={{ marginTop: '15px', width: '100%', padding: '10px', border: '2px dashed #007bff', background: '#f8f9fa', color: '#007bff', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px' }}
            >
              ➕ Add New Address
            </button>
          )}
        </div>

        <div className="blue-form-actions">
          {isEditing ? (
            <>
              <button type="submit" className="btn-blue-primary" disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn-blue-secondary" 
                onClick={(e) => {
                  e.preventDefault();
                  setError('');
                  setSuccessMsg('');
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="btn-blue-primary" 
              onClick={(e) => {
                e.preventDefault();
                setError('');
                setSuccessMsg('');
                setIsEditing(true);
              }}
            >
              Edit Profile Details
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;