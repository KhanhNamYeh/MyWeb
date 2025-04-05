import React from "react";
import "../home.css"
import { Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Tìm kiếm sách..." />
      <Button variant="contained" color="primary" endIcon={<SearchIcon />}>
      </Button>
    </div>
  );
};

export default SearchBar;
