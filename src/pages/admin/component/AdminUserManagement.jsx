import React, { useState, useEffect } from "react";
import "./AdminUserManagement.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    login: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    image: ""
  });
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost/PHP/admin_users.php", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "get_users"
          }),
        });

        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.error || "Failed to fetch users");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddNew = () => {
    setIsAdding(true);
    setCurrentUser(null);
    setFormData({
      name: "",
      login: "",
      email: "",
      phone: "",
      role: "user",
      password: "",
      image: ""
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setIsAdding(false);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      login: user.login,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: "", // Password field is empty when editing
      image: user.image || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    // Don't allow deletion if it's the current logged-in user
    const currentUserId = JSON.parse(sessionStorage.getItem("user"))?.id;
    if (userId === currentUserId) {
      setStatusMessage({ type: "error", message: "You cannot delete your own account" });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch("http://localhost/PHP/admin_users.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_user",
          user_id: userId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage({ type: "success", message: "User deleted successfully" });
        // Update users list without reloading
        setUsers(users.filter(user => user.id !== userId));
      } else {
        setStatusMessage({ type: "error", message: data.error || "Failed to delete user" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error connecting to server" });
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.login || !formData.email) {
      setStatusMessage({ type: "error", message: "Name, login and email are required" });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMessage({ type: "error", message: "Please enter a valid email address" });
      return;
    }

    // For new users, password is required
    if (isAdding && !formData.password) {
      setStatusMessage({ type: "error", message: "Password is required for new users" });
      return;
    }

    // Prepare data for submission
    const userData = {
      name: formData.name,
      login: formData.login,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      image: formData.image
    };

    // Only include password if it's provided (required for new users, optional for updates)
    if (formData.password) {
      userData.password = formData.password;
    }

    try {
      const response = await fetch("http://localhost/PHP/admin_users.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isAdding ? "add_user" : "update_user",
          user_id: currentUser?.id,
          user_data: userData
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage({ 
          type: "success", 
          message: isAdding ? "User added successfully" : "User updated successfully" 
        });
        setShowModal(false);
        
        // Update the user list
        if (isAdding && data.user) {
          setUsers([...users, data.user]);
        } else if (!isAdding) {
          setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...userData } : u));
        }
      } else {
        setStatusMessage({ type: "error", message: data.error || "Operation failed" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error connecting to server" });
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="admin-usermanage-loading-container">
        <div className="admin-usermanage-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-usermanage-error-container">
        <p>Error loading users: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-usermanage-container">
      <div className="admin-usermanage-header">
        <h2>User Management</h2>
        <button className="admin-usermanage-add-btn" onClick={handleAddNew}>Add New User</button>
      </div>

      {statusMessage.message && (
        <div className={`admin-usermanage-status-message ${statusMessage.type}`}>
          {statusMessage.message}
        </div>
      )}

      <div className="admin-usermanage-table-container">
        <table className="admin-usermanage-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Login</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.login}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  <span className={`admin-usermanage-role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="admin-usermanage-action-buttons">
                    <button 
                      className="admin-usermanage-edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-usermanage-delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-usermanage-modal-backdrop">
          <div className="admin-usermanage-modal-content admin-usermanage-user-modal">
            <h3>{isAdding ? "Add New User" : "Edit User"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-usermanage-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-usermanage-form-group">
                <label>Login Username:</label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-usermanage-form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-usermanage-form-group">
                <label>Phone (optional):</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="admin-usermanage-form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="admin-usermanage-form-group">
                <label>{isAdding ? "Password:" : "Password (leave blank to keep current):"}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={isAdding}
                />
              </div>

              <div className="admin-usermanage-form-group">
                <label>Profile Image Filename (optional):</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="e.g., user1.jpg"
                />
                <small>Image should be in the /images/ folder</small>
              </div>

              <div className="admin-usermanage-modal-buttons">
                <button type="submit" className="admin-usermanage-save-btn">Save</button>
                <button 
                  type="button" 
                  className="admin-usermanage-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;