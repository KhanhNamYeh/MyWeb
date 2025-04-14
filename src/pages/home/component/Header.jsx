// components/Header.js
import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from "@mui/icons-material/Notifications";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Header() {
  return (
    <AppBar position="static" color="default">
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          readGO
        </Typography>

        <IconButton>
          <NotificationsIcon />
        </IconButton>

        <Typography>Hello, user01</Typography>

        <IconButton>
          <ShoppingCartIcon />
        </IconButton>

        <IconButton>
          <FavoriteIcon />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}

export default Header;