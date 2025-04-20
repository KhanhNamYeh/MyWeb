import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import AdminBookManagement from "./component/AdminBookManagement";
import "./AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in session storage
    const sessionUser = sessionStorage.getItem("user");
    
    if (sessionUser) {
      const userData = JSON.parse(sessionUser);
      
      if (userData.role !== "admin") {
        // Redirect non-admin users
        navigate("/");
        return;
      }
      
      setUser(userData);
      setLoading(false);
    } else {
      // Try to get user from server session
      fetch("http://localhost/PHP/check_session.php", {
        method: "GET",
        credentials: "include"
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.user) {
          if (data.user.role !== "admin") {
            // Redirect non-admin users
            navigate("/");
            return;
          }
          
          setUser(data.user);
          // Store in session storage for future use
          sessionStorage.setItem("user", JSON.stringify(data.user));
        } else {
          // Redirect to login if not logged in
          navigate("/login");
        }
      })
      .catch(error => {
        console.error("Error checking session:", error);
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <div className="admin-profile">
            {user.image ? (
              <img src={`/images/${user.image}`} alt={user.name} className="admin-avatar" />
            ) : (
              <div className="admin-avatar-placeholder">{user.name.charAt(0)}</div>
            )}
            <div className="admin-info">
              <h3>{user.name}</h3>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
          
          <nav className="admin-nav">
            <ul>
              <li className="active">Book Management</li>
              <li>User Management</li>
              <li>Orders</li>
              <li>Site Settings</li>
            </ul>
          </nav>
        </div>
        
        <div className="admin-content">
          <AdminBookManagement />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPage;