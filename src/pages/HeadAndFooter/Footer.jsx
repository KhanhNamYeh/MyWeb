import React from "react";

import { Box, Typography, Grid, Link } from "@mui/material";
import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
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

        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">DOWNLOAD APP</Typography>
          <Box
            sx={{
              width: 50,
              height: 50,
              bgcolor: "black",
              display: "inline-block",
              borderRadius: "10%",
            }}
          />
        </Grid>

        {/* Payment Column */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">PAYMENT</Typography>
          <Box display="flex" justifyContent="center" gap={1} mt={1}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" width={40} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/JCB_logo.svg" alt="JCB" width={40} />
          </Box>
        </Grid>

        {/* Follow Us Column */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">FOLLOW US</Typography>
          <Box display="flex" justifyContent="center" gap={1} mt={1}>
            <Facebook sx={{ fontSize: 30 }} />
            <Instagram sx={{ fontSize: 30 }} />
            <LinkedIn sx={{ fontSize: 30 }} />
          </Box>
        </Grid>

        {/* Personalize Column */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">PERSONALIZE</Typography>
          <Box display="flex" flexDirection="column" mt={1}>
            <Link href="#" underline="hover" color="inherit">
              SUPPORT
            </Link>
            <Link href="#" underline="hover" color="inherit">
              NEWS
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;