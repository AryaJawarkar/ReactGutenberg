import React from 'react';
import Clear from '../assets/images/Cancel.svg';
import Search from '../assets/images/Search.svg';
const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="search-container">
      <img src={Search} alt="Search" className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="clear-button" onClick={onClear}>
          <img src={Clear} alt="Clear" className="clear-button" />
        </button>
      )}
    </div>
  );
};

export default SearchBar; 