import React, { useState, useEffect } from 'react';
import './user.css';
import Navbar from '../HeadAndFooter/Navbar';
import Footer from '../HeadAndFooter/Footer';
import ai from "/images/ai.png";
import a2 from "/images/a2.png"; // Make sure these files exist
import a3 from "/images/a3.png"; // Make sure these files exist
import { Favorite } from '@mui/icons-material';

function hidePassword(password) {
  return password ? password.replace(/./g, '*') : '******';
}

function hideMail(email) {
  if (!email) return '';
  const [username, domain] = email.split('@');
  const hiddenUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
  return `${hiddenUsername}@${domain}`;
}

const User = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    login: '',
    password: '',
    email: '',
    phone: '',
    selectedImage: ''
  });
  const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });

  // Define available avatar images
  const avatarImages = [
    { id: 'image1', src: ai, alt: 'Avatar 1' },
    { id: 'image2', src: a2, alt: 'Avatar 2' },
    { id: 'image3', src: a3, alt: 'Avatar 3' }
  ];

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/PHP/user.php", {
        method: "GET",
        credentials: "include"
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.user);
        // Initialize form data with user data
        setEditFormData({
          name: data.user.name || '',
          login: data.user.login || '',
          password: '******', // Use placeholder for password
          email: data.user.email || '',
          phone: data.user.phone || '',
          selectedImage: data.user.image || ai
        });
      } else {
        setError(data.error || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError('Network error - Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
    setUpdateStatus({ message: '', type: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleImageSelect = (imageSrc) => {
    setEditFormData({
      ...editFormData,
      selectedImage: imageSrc
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateStatus({ message: 'Updating profile...', type: 'info' });
      
      const formDataToSend = {
        ...editFormData,
        image: editFormData.selectedImage // Include the selected image
      };

      const response = await fetch("http://localhost/PHP/edit_user.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.user);
        setUpdateStatus({ message: 'Profile updated successfully!', type: 'success' });
        
        // Reset password field in the form
        setEditFormData({
          ...editFormData,
          password: '******'
        });
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          setShowEditModal(false);
          setUpdateStatus({ message: '', type: '' });
        }, 2000);
      } else {
        setUpdateStatus({ message: data.error || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
      setUpdateStatus({ message: 'Network error - Could not connect to server', type: 'error' });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 mb-5">
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading user data...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !userData) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 mb-5">
          <div className="alert alert-danger" role="alert">
            {error || 'Could not load user data. Please try logging in again.'}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <div className="user-container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="user-profile">
                <div className="user-profile-img">
                  <img src={userData.image || ai} alt="User" className="user-image" />
                </div>
                <div className="user-profile-container">
                  <h2>Account Information</h2>

                  <div className="user-profile-info row">
                      <div className="user-info-item col-12">
                          <span className="label">Name:</span>
                          <span className="value" id="user-name">{userData.name}</span>
                      </div>
                      <div className="user-info-item col-lg-6 col-md-12">
                          <span className="label">Login:</span>
                          <span className="value" id="user-login">{userData.login}</span>
                      </div>
                      <div className="user-info-item col-6">
                          <span className="label">Password:</span>
                          <span className="value" id="user-login">{hidePassword(userData.password)}</span>
                      </div>
                      <div className="user-info-item col-12">
                          <span className="label">Email:</span>
                          <span className="value" id="user-email">{hideMail(userData.email)}</span>
                      </div>
                      <div className="user-info-item col-lg-6 col-md-12">
                          <span className="label">Phone:</span>
                          <span className="value" id="user-phone">{userData.phone || 'Not provided'}</span>
                      </div>
                      <div className="user-info-item col-6">
                          <span className="label">Role:</span>
                          <span className="value" id="user-role">{userData.role}</span>
                      </div>
                      <div className="user-info-item col-12">
                          <button onClick={handleOpenEditModal}>Edit</button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="user-likes has-waves">
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />

                <div className="user-likes-content">
                  <div className="user-likes-author">Favorite Authors</div>
                  <div className="user-likes-tag">
                    <img src={ai} alt="User" className="user-image" />
                    <div className="user-info">
                      <a>Harlem Shuffle</a>
                      <a>New York</a>
                    </div>
                    <div className="user-actions">
                      <a className="like-count">3</a>
                      <a className="favorite-action"><Favorite /></a>
                    </div>
                  </div>
                  <div className="user-likes-tag">
                    <img src={ai} alt="User" className="user-image" />
                    <div className="user-info">
                      <a>Harlem Shuffle</a>
                      <a>New York</a>
                    </div>
                    <div className="user-actions">
                      <a className="like-count">3</a>
                      <a className="favorite-action"><Favorite /></a>
                    </div>
                  </div>
                  <div className="user-likes-tag">
                    <img src={ai} alt="User" className="user-image" />
                    <div className="user-info">
                      <a>Harlem Shuffle</a>
                      <a>New York</a>
                    </div>
                    <div className="user-actions">
                      <a className="like-count">3</a>
                      <a className="favorite-action"><Favorite /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-history">
                <h2>Transaction History</h2>

                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Erasure</td>
                        <td>2</td>
                        <td><span className="status status-delivered">Delivered</span></td>
                      </tr>
                      <tr>
                        <td>Erasure</td>
                        <td>2</td>
                        <td><span className="status status-processing">On the way</span></td>
                      </tr>
                      <tr>
                        <td>Erasure</td>
                        <td>2</td>
                        <td><span className="status status-cancelled">Checking</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <a href="/notification" className="user-history-full">Details</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>Edit Profile</h3>
              <button className="close-button" onClick={handleCloseEditModal}>&times;</button>
            </div>
            {updateStatus.message && (
              <div className={`alert alert-${updateStatus.type === 'success' ? 'success' : updateStatus.type === 'info' ? 'info' : 'danger'}`}>
                {updateStatus.message}
              </div>
            )}
            <form onSubmit={handleEditSubmit} className="edit-form">
              {/* Image Selection Section - Debug version with inline styles */}
              <div className="form-group">
                <label>Profile Image</label>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                  {avatarImages.map((avatar) => (
                    <div 
                      key={avatar.id} 
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: editFormData.selectedImage === avatar.src ? '3px solid #4CAF50' : '3px solid transparent',
                        position: 'relative'
                      }}
                      onClick={() => handleImageSelect(avatar.src)}
                    >
                      <img 
                        src={avatar.src} 
                        alt={avatar.alt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {editFormData.selectedImage === avatar.src && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#4CAF50',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editFormData.name} 
                  onChange={handleEditInputChange} 
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Login</label>
                <input 
                  type="text" 
                  name="login" 
                  value={editFormData.login} 
                  onChange={handleEditInputChange} 
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={editFormData.password} 
                  onChange={handleEditInputChange} 
                  className="form-control"
                  placeholder="Enter new password or leave as is to keep current"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editFormData.email} 
                  onChange={handleEditInputChange} 
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={editFormData.phone} 
                  onChange={handleEditInputChange} 
                  className="form-control"
                />
              </div>
              <div className="edit-form-buttons">
                <button type="button" onClick={handleCloseEditModal} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default User;