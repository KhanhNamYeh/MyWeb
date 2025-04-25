import React, { useState, useEffect } from "react";
import "./AdminSiteSettings.css";

const AdminSiteSettings = () => {
  const [settings, setSettings] = useState({
    site_name: "",
    site_description: "",
    contact_email: "",
    contact_phone: "",
    social_media: {
      facebook: "",
      twitter: "",
      instagram: ""
    },
    shipping_info: "",
    maintenance_mode: false,
    about_us: {
      mission: "We strive to make reading accessible to everyone by providing a wide selection of books at competitive prices.",
      vision: "To inspire a love of reading and lifelong learning in our community."
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost/PHP/admin_settings.php", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "get_settings"
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSettings(data.settings);
        } else {
          setError(data.error || "Failed to fetch settings");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      // Handle nested properties (for social media, about_us)
      const [parent, child] = name.split(".");
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked
    });
  };

  // Save settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch("http://localhost/PHP/admin_settings.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update_settings",
          settings: settings
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage({ type: "success", message: "Settings saved successfully" });
        
        // Clear message after delay
        setTimeout(() => {
          setStatusMessage({ type: "", message: "" });
        }, 3000);
      } else {
        setStatusMessage({ type: "error", message: data.error || "Failed to save settings" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error connecting to server" });
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="admin-settings-loading-container">
        <div className="admin-settings-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="admin-settings-error-container">
        <p>Error loading settings: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-settings-container">
      <div className="admin-settings-header">
        <h2>Site Settings</h2>
      </div>

      {statusMessage.message && (
        <div className={`admin-settings-status-message ${statusMessage.type}`}>
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-settings-form">
        <div className="admin-settings-section">
          <h3>General Information</h3>
          
          <div className="admin-settings-form-group">
            <label htmlFor="site_name">Site Name:</label>
            <input
              type="text"
              id="site_name"
              name="site_name"
              value={settings.site_name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="admin-settings-form-group">
            <label htmlFor="site_description">Site Description:</label>
            <textarea
              id="site_description"
              name="site_description"
              value={settings.site_description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Brief description of your website that appears on the About Us section"
            />
          </div>
        </div>

        <div className="admin-settings-section">
          <h3>Contact Information</h3>
          
          <div className="admin-settings-form-group">
            <label htmlFor="contact_email">Contact Email:</label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={settings.contact_email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="admin-settings-form-group">
            <label htmlFor="contact_phone">Contact Phone:</label>
            <input
              type="text"
              id="contact_phone"
              name="contact_phone"
              value={settings.contact_phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="admin-settings-section">
          <h3>Social Media</h3>
          
          <div className="admin-settings-form-group">
            <label htmlFor="social_media.facebook">Facebook:</label>
            <input
              type="text"
              id="social_media.facebook"
              name="social_media.facebook"
              value={settings.social_media.facebook}
              onChange={handleInputChange}
              placeholder="Facebook page URL"
            />
          </div>
          
          <div className="admin-settings-form-group">
            <label htmlFor="social_media.twitter">Twitter:</label>
            <input
              type="text"
              id="social_media.twitter"
              name="social_media.twitter"
              value={settings.social_media.twitter}
              onChange={handleInputChange}
              placeholder="Twitter profile URL"
            />
          </div>
          
          <div className="admin-settings-form-group">
            <label htmlFor="social_media.instagram">Instagram:</label>
            <input
              type="text"
              id="social_media.instagram"
              name="social_media.instagram"
              value={settings.social_media.instagram}
              onChange={handleInputChange}
              placeholder="Instagram profile URL"
            />
          </div>
        </div>

        <div className="admin-settings-section">
          <h3>About Us Content</h3>
          
          <div className="admin-settings-form-group">
            <label htmlFor="about_us.mission">Mission Statement:</label>
            <textarea
              id="about_us.mission"
              name="about_us.mission"
              value={settings.about_us?.mission || ""}
              onChange={handleInputChange}
              rows="3"
              placeholder="Your company's mission statement"
            />
          </div>
          
          <div className="admin-settings-form-group">
            <label htmlFor="about_us.vision">Vision:</label>
            <textarea
              id="about_us.vision"
              name="about_us.vision"
              value={settings.about_us?.vision || ""}
              onChange={handleInputChange}
              rows="3"
              placeholder="Your company's vision"
            />
          </div>

          <div className="admin-settings-form-group">
            <label htmlFor="about_us.mission">Our Values:</label>
            <textarea
              id="about_us.vision"
              name="about_us.vision"
              value="Integrity, passion for literature, community engagement, and excellent customer service guide everything we do."
              onChange={handleInputChange}
              rows="3"
              placeholder="Your company's vision"
            />
          </div>
        </div>

        <div className="admin-settings-section">
          <h3>Store Settings</h3>
          
          <div className="admin-settings-form-group">
            <label htmlFor="shipping_info">Shipping Information:</label>
            <textarea
              id="shipping_info"
              name="shipping_info"
              value={settings.shipping_info}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter shipping policies and information"
            />
          </div>
          
          <div className="admin-settings-form-group admin-settings-checkbox-group">
            
            <label htmlFor="maintenance_mode"></label>
            <p className="admin-settings-help-text">
            </p>
          </div>
        </div>

        <div className="admin-settings-actions">
          <button 
            type="submit" 
            className="admin-settings-save-btn" 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSiteSettings;