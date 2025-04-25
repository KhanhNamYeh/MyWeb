import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  const [siteSettings, setSiteSettings] = useState({
    site_name: "ReadGO",
    contact_email: "",
    contact_phone: "",
    social_media: {
      facebook: "",
      twitter: "",
      instagram: ""
    }
  });

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
          setSiteSettings(data.settings);
        }
      } catch (err) {
        console.error("Error loading site settings:", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f4ede4",
        p: 4,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Store Name and Contact Info */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {siteSettings.site_name || "ReadGO"}
          </Typography>
          {siteSettings.contact_email && (
            <Typography variant="body2" gutterBottom>
              Email: {siteSettings.contact_email}
            </Typography>
          )}
          {siteSettings.contact_phone && (
            <Typography variant="body2" gutterBottom>
              Phone: {siteSettings.contact_phone}
            </Typography>
          )}
        </Grid>

        {/* Payment Column */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold" gutterBottom>PAYMENT</Typography>
          <Box display="flex" justifyContent="center" gap={1} mt={1}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" width={40} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg" alt="JCB" width={40} />
          </Box>
        </Grid>

        {/* Follow Us Column */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold" gutterBottom>FOLLOW US</Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={1}>
            {siteSettings.social_media.facebook && (
              <Link href={siteSettings.social_media.facebook} target="_blank" rel="noopener noreferrer" color="inherit">
                <Facebook sx={{ fontSize: 30 }} />
              </Link>
            )}
            {siteSettings.social_media.twitter && (
              <Link href={siteSettings.social_media.twitter} target="_blank" rel="noopener noreferrer" color="inherit">
                <Twitter sx={{ fontSize: 30 }} />
              </Link>
            )}
            {siteSettings.social_media.instagram && (
              <Link href={siteSettings.social_media.instagram} target="_blank" rel="noopener noreferrer" color="inherit">
                <Instagram sx={{ fontSize: 30 }} />
              </Link>
            )}
            <Link href="#" color="inherit">
              <LinkedIn sx={{ fontSize: 30 }} />
            </Link>
          </Box>
        </Grid>

        {/* Customer Support */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold" gutterBottom>CUSTOMER SUPPORT</Typography>
          <Box display="flex" flexDirection="column" mt={1}>
            <Link href="/support" underline="hover" color="inherit" sx={{ mb: 1 }}>
              Help & FAQs
            </Link>
            <Link href="/shipping" underline="hover" color="inherit" sx={{ mb: 1 }}>
              Shipping Info
            </Link>
            <Link href="/returns" underline="hover" color="inherit">
              Returns & Exchanges
            </Link>
          </Box>
        </Grid>
        
        {/* Copyright notice */}
        <Grid item xs={12} textAlign="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {siteSettings.site_name || "ReadGO"}. All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;