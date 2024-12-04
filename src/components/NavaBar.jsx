import React, { useState } from 'react';
import './NavaBar.css';
import { FaHome } from 'react-icons/fa';

const NavaBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Truyền từ khóa tìm kiếm lên App.js
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        NghiaMusic
      </div>
      <div className="navbar-center">
        <button className="navbar-button">
          <FaHome className="home-icon" />
          Home
        </button>
        <input
          type="text"
          className="navbar-search"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
    </nav>
  );
};

export default NavaBar;