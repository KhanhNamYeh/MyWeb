import React from "react";
import { Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input 
        type="text" 
        placeholder="Tìm kiếm sách..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ padding: "8px", width: "70%" }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        endIcon={<SearchIcon />}
        style={{ padding: "8px", width: "10%" }}
      >
      </Button>
    </div>
  );
};

export default SearchBar;
