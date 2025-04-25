import React, { useState, useEffect } from "react";
import "./AboutUs.css";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState({
    site_name: "",
    site_description: "",
    about_us: {
      mission: "",
      vision: ""
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setAboutData(data.settings);
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

  // Render loading state
  if (loading) {
    return (
      <div className="about-us-loading-container">
        <div className="about-us-spinner"></div>
        <p>Loading about us information...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="about-us-error-container">
        <p>Error loading content: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1>About {aboutData.site_name}</h1>
        <p className="about-us-description">{aboutData.site_description}</p>
      </div>

      <div className="about-us-content">
        <div className="about-us-cards-container">
          <div className="about-us-card">
            <div className="about-us-card-icon">
              <i className="fas fa-bullseye"></i>
            </div>
            <h3>Our Mission</h3>
            <p>{aboutData.about_us?.mission || "We strive to make reading accessible to everyone by providing a wide selection of books at competitive prices."}</p>
          </div>

          <div className="about-us-card">
            <div className="about-us-card-icon">
              <i className="fas fa-eye"></i>
            </div>
            <h3>Our Vision</h3>
            <p>{aboutData.about_us?.vision || "To inspire a love of reading and lifelong learning in our community."}</p>
          </div>

          <div className="about-us-card">
            <div className="about-us-card-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Our Values</h3>
            <p>Integrity, passion for literature, community engagement, and excellent customer service guide everything we do.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;