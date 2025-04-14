import React, { useState } from "react";
import { Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearchSubmit }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearchClick = () => {
    onSearchSubmit(localSearchTerm);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for books..."
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: "8px", width: "70%" }}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<SearchIcon />}
        style={{ padding: "8px", width: "auto", marginLeft: "5px" }}
        onClick={handleSearchClick}
      >
      </Button>
    </div>
  );
};

export default SearchBar;