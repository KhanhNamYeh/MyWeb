import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import AdminBookManagement from "./component/AdminBookManagement";
import AdminUserManagement from "./component/AdminUserManagement";
import AdminOrderManagement from "./component/AdminOrderManagement";
import AdminSiteSettings from "./component/AdminSiteSettings";
import "./AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("books");

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
      <div className="admin-page-loading-container">
        <div className="admin-page-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  // Render the appropriate component based on active tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "books":
        return <AdminBookManagement />;
      case "users":
        return <AdminUserManagement />;
      case "orders":
        return <AdminOrderManagement />;
      case "settings":
        return <AdminSiteSettings />;
      default:
        return <AdminBookManagement />;
    }
  };

  return (
    <div className="admin-page-wrapper">
      <Navbar />
      
      <div className="admin-page-container">
        <div className="admin-page-sidebar">
          <div className="admin-page-profile">
            {user.image ? (
              <img src={`/images/${user.image}`} alt={user.name} className="admin-page-avatar" />
            ) : (
              <div className="admin-page-avatar-placeholder">{user.name.charAt(0)}</div>
            )}
            <div className="admin-page-info">
              <h3>{user.name}</h3>
              <p className="admin-page-role">Administrator</p>
            </div>
          </div>
          
          <nav className="admin-page-nav">
            <ul>
              <li 
                className={activeTab === "books" ? "active" : ""}
                onClick={() => setActiveTab("books")}
              >
                Book Management
              </li>
              <li 
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
              >
                User Management
              </li>
              <li 
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
              >
                Order Management
              </li>
              <li 
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
              >
                Site Settings
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="admin-page-content">
          {renderActiveComponent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPage;