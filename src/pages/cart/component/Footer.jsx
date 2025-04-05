import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f4ede4",
        p: 4,
        width: "100%",  // Đảm bảo footer chiếm toàn bộ chiều rộng màn hình
        boxSizing: "border-box", // Đảm bảo padding không làm mất đi chiều rộng
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        
        {/* Cột Tải Ứng Dụng */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">TẢI ỨNG DỤNG</Typography>
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

        {/* Cột Thanh Toán */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">THANH TOÁN</Typography>
          <Box display="flex" justifyContent="center" gap={1} mt={1}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" width={40} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/03/JCB_logo.svg" alt="JCB" width={40} />
          </Box>
        </Grid>

        {/* Cột Theo Dõi Chúng Tôi */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">THEO DÕI CHÚNG TÔI</Typography>
          <Box display="flex" justifyContent="center" gap={1} mt={1}>
            <Facebook sx={{ fontSize: 30 }} />
            <Instagram sx={{ fontSize: 30 }} />
            <LinkedIn sx={{ fontSize: 30 }} />
          </Box>
        </Grid>

        {/* Cột Cá Nhân Hóa */}
        <Grid item xs={12} sm={3} textAlign="center">
          <Typography fontWeight="bold">CÁ NHÂN HÓA</Typography>
          <Box display="flex" flexDirection="column" mt={1}>
            <Link href="#" underline="hover" color="inherit">
              HỖ TRỢ
            </Link>
            <Link href="#" underline="hover" color="inherit">
              TIN TỨC
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
